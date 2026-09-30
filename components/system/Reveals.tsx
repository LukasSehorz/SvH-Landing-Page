"use client";

import { usePathname } from "next/navigation";
import { gsap, useGSAP } from "@/lib/gsap";
import { SplitText } from "@/lib/gsap-split";
import { afterPaint } from "@/lib/idle";
import { enterLine, MOTION as M } from "@/lib/motion";
import { requestRefresh } from "@/lib/refresh";
import { registerRevealer } from "@/lib/reveal";

/**
 * Seitenweite Einblendungen nach einem Maß (lib/motion.ts). Startzustände werden
 * erst hier im Browser gesetzt und nur für Elemente, die beim Laden noch unterhalb
 * des Bildes liegen. Ohne JavaScript oder bei reduzierter Bewegung bleibt alles sichtbar.
 *
 * Wichtig (Barrierefreiheit): nie visibility/autoAlpha, nur opacity und transform.
 * So bleibt alles im Barrierefreiheitsbaum und per Tab erreichbar; ein Fokus
 * stellt das Element sofort fertig hin.
 *
 *  [data-reveal]        weich von unten (Deckkraft + 24 px Aufstieg), gestaffelt
 *  [data-reveal=fade]   nur Deckkraft (für Flächen, an denen Scroll-Szenen messen)
 *  [data-split]         Überschrift zeilenweise mit Maske (SplitText)
 *  [data-script=auto]   Schreibschrift schreibt sich, Schwung zeichnet sich
 *  [data-draw]          Spielfeldlinie zeichnet sich beim Scrollen
 *  [data-count]         Zahl zählt hoch
 *  [data-wordmark]      Wortmarke am Fuß baut sich auf
 *
 * Auslöser für alle: Oberkante 15 % im sichtbaren Bereich (über der mobilen CTA-Leiste).
 * Anker-Sprünge (Menü, Knöpfe, Direktaufruf mit #hash, Zurück): Im sichtbaren
 * Zielbereich wird nichts mehr eingeblendet, alles steht sofort fertig da.
 *
 * Leistung (Bau-Runde 7): Beim Laden wird nichts gemessen und kein GSAP-Startwert
 * gesetzt. Nach dem ersten Bild werden alle Lagen in einem Zug gelesen (frisches
 * Layout, praktisch kostenlos), dann nur Attribute geschrieben: [data-rv] setzt den
 * Startzustand per CSS (base.css). Ausgelöst wird per IntersectionObserver statt mit
 * einem ScrollTrigger je Element. Überschriften werden erst geteilt, wenn sie einen
 * Bildschirm entfernt sind, eine je Task. Tempo und Kurven sind unverändert.
 */

const SEL = '[data-reveal], [data-split], [data-script="auto"], [data-count]';
/** Blöcke aus fremden Dateien, die ohne eigenes Attribut mitlaufen (Fußzeile) */
const AUTO = ".footer-grid > *";
/** Beobachtungsfläche nach oben praktisch unbegrenzt: Wer über ein Element hinweg
    springt, löst es trotzdem aus (wie ScrollTrigger „once“). */
const ABOVE = 100000;

type Kind = "move" | "fade" | "split" | "script" | "count";

export default function Reveals() {
  const pathname = usePathname();

  useGSAP(
    (_ctx, contextSafe) => {
      const safe = contextSafe!;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      /** Elemente mit gesetztem Startzustand, die noch nicht fertig stehen */
      const managed = new Map<Element, Kind>();
      /** Einblendung läuft (GSAP hat Inline-Werte gesetzt) */
      const playing = new Set<Element>();
      const anims = new Map<Element, gsap.core.Animation>();
      const splits = new Map<Element, SplitText>();
      /** Überschriften, die ausgelöst wurden, bevor die Schriften bereit waren */
      const wanted = new Set<Element>();
      const undo: (() => void)[] = [];
      let dead = false;
      /** Teilen erst mit geladenen Schriften (sonst andere Zeilenumbrüche) */
      let fontsReady = false;
      let trigger: IntersectionObserver | null = null;
      let near: IntersectionObserver | null = null;
      let lazy: IntersectionObserver | null = null;
      const builders = new Map<Element, () => void>();
      /** Beobachtetes Ziel → Elemente, die es auslöst. Meist das Element selbst; Karten in einer
          wischbaren Reihe (Handy) lösen über die Reihe aus: Karten rechts außerhalb sind für den
          Beobachter abgeschnitten, eingeblendet wird aber wie bisher nach der Höhe. */
      const members = new Map<Element, Element[]>();
      /** gleichzeitig ausgelöste Blöcke (laufen als Gruppe) */
      let batch: Element[] = [];
      let vw = 0;
      let vh = 0;

      const setStyle = (el: HTMLElement | SVGElement, prop: string, value: string) => {
        const prev = el.style.getPropertyValue(prop);
        el.style.setProperty(prop, value);
        undo.push(() => (prev ? el.style.setProperty(prop, prev) : el.style.removeProperty(prop)));
      };
      const countText = (h: HTMLElement, v: string | number) => `${h.dataset.prefix ?? ""}${v}${h.dataset.suffix ?? ""}`;

      const done = (el: Element) => {
        managed.delete(el);
        playing.delete(el);
        anims.delete(el);
      };

      // Endzustand sofort herstellen (Fokus, Anker-Sprung): ohne Übergang
      const finish = (el: Element) => {
        const k = managed.get(el);
        if (!k) return;
        if ((members.get(el)?.length ?? 0) <= 1) {
          trigger?.unobserve(el);
          members.delete(el);
        }
        near?.unobserve(el);
        wanted.delete(el);
        batch = batch.filter((b) => b !== el);
        anims.get(el)?.kill();
        const was = playing.has(el);
        done(el);
        if (k === "move" || k === "fade") {
          el.removeAttribute("data-rv");
          if (was) gsap.set(el, k === "move" ? { opacity: 1, y: 0, overwrite: true } : { opacity: 1, overwrite: true });
        } else if (k === "split") {
          const split = splits.get(el);
          if (split) {
            gsap.killTweensOf(split.lines);
            split.revert();
            splits.delete(el);
          }
          el.removeAttribute("data-rv");
        } else if (k === "script") {
          const t = el.querySelector(".script-text");
          const ps = el.querySelectorAll(".script-swoosh path");
          if (t) gsap.set(t, { "--w": "120%", overwrite: true });
          if (ps.length) gsap.set(ps, { strokeDashoffset: 0, overwrite: true });
        } else {
          const h = el as HTMLElement;
          h.textContent = countText(h, h.dataset.count ?? "");
        }
      };
      const revealWithin = (root: Element) => {
        if (root.matches(SEL) || root.matches(AUTO)) finish(root);
        root.querySelectorAll(`${SEL}, ${AUTO}`).forEach(finish);
      };
      /** alles fertig stellen, was (im Bild gemessen) zwischen y0 und y1 liegt */
      const finishBand = (y0: number, y1: number) => {
        const hit: Element[] = [];
        managed.forEach((_k, el) => {
          const r = el.getBoundingClientRect();
          if (r.bottom > y0 && r.top < y1) hit.push(el);
        });
        hit.forEach(finish);
      };
      const unregister = registerRevealer(revealWithin);

      // 1) Weiche Einblendung: Deckkraft sanft, Bewegung mit Quart-Auslauf, gestaffelt.
      //    Gleichzeitig ausgelöste Blöcke laufen als Gruppe (wie ScrollTrigger.batch, 16 ms Fenster).
      const runBatch = safe(() => {
        const b = batch;
        batch = [];
        // erst alle Startzustände übergeben (Attribut weg, gleicher Wert inline), dann laufen lassen
        b.forEach((el) => {
          const k = managed.get(el);
          if (!k) return;
          el.removeAttribute("data-rv");
          gsap.set(el, k === "move" ? { opacity: 0, y: M.block.y } : { opacity: 0 });
          playing.add(el);
        });
        b.forEach((el, i) => {
          const k = managed.get(el);
          if (!k) return;
          const delay = i * M.block.stagger;
          anims.set(el, gsap.to(el, { opacity: 1, duration: M.block.fade, ease: M.fade, delay, overwrite: "auto", onComplete: () => done(el) }));
          if (k === "move") gsap.to(el, { y: 0, duration: M.block.move, ease: M.ease, delay, overwrite: "auto" });
        });
      });
      const flush = gsap.delayedCall(0.016, runBatch).pause();

      // 2) Überschriften zeilenweise (aria nur auf echten Überschriften)
      const prepare = (el: Element) => {
        if (splits.has(el) || managed.get(el) !== "split") return;
        const split = SplitText.create(el as HTMLElement, {
          type: "lines",
          mask: "lines",
          linesClass: "split-line",
          // geschützte Leerzeichen erhalten (sonst brechen Wortpaare im geteilten Zustand anders um)
          reduceWhiteSpace: false,
          aria: el.matches("h1,h2,h3,h4,h5,h6") ? "auto" : "none",
        });
        splits.set(el, split);
        gsap.set(split.lines, { yPercent: M.head.yPercent });
        el.removeAttribute("data-rv");
      };
      const playSplit = (el: Element) => {
        if (!fontsReady) {
          wanted.add(el);
          return;
        }
        prepare(el);
        const split = splits.get(el);
        if (!split) return;
        playing.add(el);
        anims.set(
          el,
          gsap.to(split.lines, {
            yPercent: 0,
            duration: M.head.dur,
            ease: M.ease,
            stagger: M.head.stagger,
            onComplete: () => {
              done(el);
              splits.delete(el);
              split.revert();
            },
          }),
        );
      };
      // Vorbereiten, eine Überschrift je Task (SplitText misst und baut das DOM um)
      const queue: Element[] = [];
      let pumpTimer = 0;
      const pump = safe(() => {
        pumpTimer = 0;
        if (dead) return;
        const el = queue.shift();
        if (el) prepare(el);
        if (queue.length) pumpTimer = window.setTimeout(pump, 0);
      });
      const enqueue = (el: Element) => {
        if (!queue.includes(el)) queue.push(el);
        if (fontsReady && !pumpTimer) pumpTimer = window.setTimeout(pump, 0);
      };
      // Schriften bereit: ausgelöste Überschriften sofort, die übrigen je Task
      document.fonts.ready.then(
        safe(() => {
          if (dead) return;
          fontsReady = true;
          wanted.forEach(playSplit);
          wanted.clear();
          if (queue.length && !pumpTimer) pumpTimer = window.setTimeout(pump, 0);
        }),
      );

      // 3) Schreibschrift
      const playScript = (el: Element) => {
        const text = el.querySelector<HTMLElement>(".script-text");
        const paths = el.querySelectorAll<SVGPathElement>(".script-swoosh path");
        playing.add(el);
        const tl = gsap.timeline({ onComplete: () => done(el) });
        if (text) tl.to(text, { "--w": "120%", duration: M.script.write, ease: "power2.inOut" });
        if (paths[0]) tl.to(paths[0], { strokeDashoffset: 0, duration: M.script.swoosh, ease: M.draw }, M.script.write * 0.62);
        if (paths[1]) tl.to(paths[1], { strokeDashoffset: 0, duration: M.script.swoosh * 0.9, ease: M.draw }, M.script.write * 0.78);
        anims.set(el, tl);
      };

      // 5) Zahlen zählen hoch (weicher Auslauf, nie in unter einer Sekunde durch)
      const playCount = (el: Element) => {
        const h = el as HTMLElement;
        const to = Number(h.dataset.count);
        const o = { v: 0 };
        playing.add(el);
        anims.set(
          el,
          gsap.to(o, {
            v: to,
            duration: M.count.dur,
            ease: M.count.ease,
            onUpdate: () => {
              if (managed.has(el)) h.textContent = countText(h, Math.round(o.v));
            },
            onComplete: () => done(el),
          }),
        );
      };

      const enter = (el: Element) => {
        const k = managed.get(el);
        if (!k || playing.has(el) || batch.includes(el)) return;
        if (k === "move" || k === "fade") {
          if (!batch.length) flush.restart(true);
          batch.push(el);
        } else if (k === "split") playSplit(el);
        else if (k === "script") playScript(el);
        else playCount(el);
      };

      /* Beobachter. Auslöser: Oberkante über der Linie (nach oben unbegrenzt).
         Nähe: einen Bildschirm unterhalb des Bildes (Überschriften teilen, Linien anlegen). */
      const makeObservers = (line: number) => {
        trigger?.disconnect();
        near?.disconnect();
        lazy?.disconnect();
        trigger = new IntersectionObserver(
          safe((entries: IntersectionObserverEntry[]) => {
            entries.forEach((e) => {
              if (!e.isIntersecting) return;
              trigger?.unobserve(e.target);
              const list = members.get(e.target) ?? [];
              members.delete(e.target);
              // längst oben vorbei (Sprung über die Stelle hinweg): ohne Übergang fertig
              const gone = e.boundingClientRect.bottom <= 0;
              list.forEach((el) => (gone ? finish(el) : enter(el)));
            });
          }),
          { rootMargin: `${ABOVE}px 0px ${-(vh - line)}px 0px` },
        );
        const nearMargin = `${ABOVE}px 0px ${vh}px 0px`;
        near = new IntersectionObserver(
          safe((entries: IntersectionObserverEntry[]) => {
            entries.forEach((e) => {
              if (!e.isIntersecting) return;
              near?.unobserve(e.target);
              enqueue(e.target);
            });
          }),
          { rootMargin: nearMargin },
        );
        lazy = new IntersectionObserver(
          safe((entries: IntersectionObserverEntry[]) => {
            entries.forEach((e) => {
              if (!e.isIntersecting) return;
              lazy?.unobserve(e.target);
              builders.get(e.target)?.();
              builders.delete(e.target);
            });
          }),
          { rootMargin: nearMargin },
        );
        members.clear();
        const scroller = new Map<Element, Element | null>();
        const scrollerOf = (el: Element) => {
          for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
            let hit = scroller.get(p);
            if (hit === undefined) {
              const ox = getComputedStyle(p).overflowX;
              hit = ox === "auto" || ox === "scroll" ? p : null;
              scroller.set(p, hit);
            }
            if (hit) return hit;
          }
          return null;
        };
        managed.forEach((k, el) => {
          if (playing.has(el) || batch.includes(el)) return;
          const target = k === "move" || k === "fade" ? (scrollerOf(el) ?? el) : el;
          const list = members.get(target);
          if (list) list.push(el);
          else {
            members.set(target, [el]);
            trigger!.observe(target);
          }
          if (k === "split" && !splits.has(el)) near!.observe(el);
        });
        builders.forEach((_b, el) => lazy!.observe(el));
      };

      // 4) Spielfeldlinien zeichnen sich; 6) Wortmarke am Fuß: vollständig aufgedeckt,
      //    sobald sie ganz im Bild ist (ohne Nachlauf, nie ein halber Schriftzug).
      //    Beide scrubben mit ScrollTrigger und werden erst in der Nähe angelegt.
      const buildDraw = (root: Element, paths: SVGGeometryElement[]) => () => {
        paths.forEach((p) =>
          gsap.fromTo(
            p,
            { strokeDasharray: 1, strokeDashoffset: 1 },
            { strokeDashoffset: 0, ease: "none", scrollTrigger: { trigger: root, start: "top 92%", end: "top 35%", scrub: 0.8 } },
          ),
        );
      };
      const buildWordmark = (el: Element) => () => {
        gsap.fromTo(
          el,
          { "--reveal": "0%", "--shine": "150%" },
          { "--reveal": "100%", "--shine": "-50%", ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom bottom", scrub: true } },
        );
      };

      // Einmalige Bestandsaufnahme nach dem ersten Bild: erst alle Lagen lesen, dann nur schreiben
      const setup = safe(() => {
        if (dead) return;
        vw = window.innerWidth;
        vh = window.innerHeight;
        const line = enterLine(); // misst die CTA-Leiste, solange das Layout frisch ist
        const list: [Element, Kind][] = [];
        const seen = new Set<Element>();
        const add = (el: Element, k: Kind) => {
          if (seen.has(el)) return;
          seen.add(el);
          list.push([el, k]);
        };
        document.querySelectorAll(`[data-reveal], ${AUTO}`).forEach((el) => add(el, el.getAttribute("data-reveal") === "fade" ? "fade" : "move"));
        document.querySelectorAll("[data-split]").forEach((el) => add(el, "split"));
        document.querySelectorAll('[data-script="auto"]').forEach((el) => add(el, "script"));
        document.querySelectorAll("[data-count]").forEach((el) => add(el, "count"));
        const tops = list.map(([el]) => el.getBoundingClientRect().top);

        list.forEach(([el, k], i) => {
          if (tops[i] <= vh * 0.9) return; // beim Laden schon im Bild: bleibt, wie es ist
          managed.set(el, k);
          if (k === "move" || k === "fade" || k === "split") el.setAttribute("data-rv", k);
          else if (k === "script") {
            const text = el.querySelector<HTMLElement>(".script-text");
            if (text) setStyle(text, "--w", "-16%");
            el.querySelectorAll<SVGPathElement>(".script-swoosh path").forEach((p) => {
              setStyle(p, "stroke-dasharray", "1");
              setStyle(p, "stroke-dashoffset", "1");
            });
          } else {
            const h = el as HTMLElement;
            h.textContent = countText(h, 0);
          }
        });

        const roots = new Map<Element, SVGGeometryElement[]>();
        document.querySelectorAll<SVGGeometryElement>("[data-draw]").forEach((p) => {
          if (p.closest("[data-draw-manual]")) return;
          const root = p.closest("[data-draw-root]") ?? p.closest("svg") ?? p;
          roots.set(root, [...(roots.get(root) ?? []), p]);
        });
        roots.forEach((paths, root) => builders.set(root, buildDraw(root, paths)));
        document.querySelectorAll("[data-wordmark]").forEach((el) => builders.set(el, buildWordmark(el)));

        makeObservers(line);
        // Direktaufruf mit #hash (auch von einer Unterseite kommend)
        onHash();
        requestRefresh();
      });
      const cancelSetup = afterPaint(setup);

      // Größe geändert (nicht nur die Adressleiste): Linie neu, noch nicht laufende Teilungen neu
      let rz = 0;
      const onResize = () => {
        window.clearTimeout(rz);
        rz = window.setTimeout(
          safe(() => {
            if (dead || !trigger) return;
            const w = window.innerWidth;
            const h = window.innerHeight;
            const widthChanged = Math.abs(w - vw) >= 2;
            if (!widthChanged && Math.abs(h - vh) < 120) return;
            vw = w;
            vh = h;
            const line = enterLine();
            if (widthChanged) {
              splits.forEach((split, el) => {
                if (playing.has(el)) return;
                split.revert();
                splits.delete(el);
                el.setAttribute("data-rv", "split");
              });
            }
            makeObservers(line);
          }),
          200,
        );
      };
      window.addEventListener("resize", onResize);

      // Fokus stellt sofort fertig hin (Tastatur, Screenreader)
      const onFocus = (e: FocusEvent) => {
        const t = e.target as Element | null;
        const el = t?.closest?.(`[data-reveal], [data-split], ${AUTO}`);
        if (el) finish(el);
        t?.closest?.("section")?.querySelectorAll("[data-reveal]").forEach((r) => {
          if (r.contains(t)) finish(r);
        });
      };
      document.addEventListener("focusin", onFocus);

      // Anker-Sprünge: sofort den Bereich fertig stellen, der am Ziel im Bild sein wird
      // (auch während der Fahrt, denn Szenen bauen sich unterwegs auf und verschieben
      // das Ziel), und wenn der Scroll steht, alles, was tatsächlich im Bild ist.
      let raf = 0;
      const afterJump = (target: Element) => {
        const band = () => {
          const top = target.getBoundingClientRect().top;
          finishBand(top - 40, top + window.innerHeight);
        };
        band();
        cancelAnimationFrame(raf);
        const t0 = performance.now();
        let last = window.scrollY;
        let moved = false;
        let still = 0;
        let frames = 0;
        const watch = () => {
          frames++;
          const y = window.scrollY;
          if (Math.abs(y - last) >= 1) {
            moved = true;
            still = 0;
          } else still++;
          last = y;
          band();
          if ((moved && still >= 8) || (!moved && frames > 40) || performance.now() - t0 > 4500) {
            finishBand(-Infinity, window.innerHeight);
            return;
          }
          raf = requestAnimationFrame(watch);
        };
        raf = requestAnimationFrame(watch);
      };
      // Erfassungsphase: greift auch, wenn ein Link den Klick selbst übernimmt (Next Link im Menü)
      const onClick = (e: MouseEvent) => {
        if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        const href = (e.target as Element | null)?.closest?.("a[href]")?.getAttribute("href") ?? "";
        const m = href.match(/^\/?#([\w-]+)$/);
        if (!m || (href.startsWith("/") && window.location.pathname !== "/")) return;
        const t = document.getElementById(m[1]);
        if (t) afterJump(t);
      };
      const onHash = () => {
        const id = decodeURIComponent(window.location.hash.slice(1));
        const t = id ? document.getElementById(id) : null;
        if (t) afterJump(t);
      };
      document.addEventListener("click", onClick, true);
      window.addEventListener("hashchange", onHash);
      window.addEventListener("popstate", onHash);

      return () => {
        dead = true;
        cancelSetup();
        cancelAnimationFrame(raf);
        window.clearTimeout(rz);
        window.clearTimeout(pumpTimer);
        flush.kill();
        trigger?.disconnect();
        near?.disconnect();
        lazy?.disconnect();
        window.removeEventListener("resize", onResize);
        document.removeEventListener("focusin", onFocus);
        document.removeEventListener("click", onClick, true);
        window.removeEventListener("hashchange", onHash);
        window.removeEventListener("popstate", onHash);
        unregister();
        // Startzustände zurücknehmen (Tweens, Teilungen und Trigger nimmt useGSAP selbst zurück)
        managed.forEach((k, el) => {
          el.removeAttribute("data-rv");
          if (k === "count") {
            const h = el as HTMLElement;
            h.textContent = countText(h, h.dataset.count ?? "");
          }
        });
        undo.reverse().forEach((f) => f());
      };
    },
    { dependencies: [pathname], revertOnUpdate: true },
  );

  return null;
}
