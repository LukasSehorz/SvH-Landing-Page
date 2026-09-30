"use client";

import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { SplitText } from "@/lib/gsap-split";
import { enterStart, MOTION as M } from "@/lib/motion";
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
 */

const SEL = '[data-reveal], [data-split], [data-script="auto"], [data-count]';
/** Blöcke aus fremden Dateien, die ohne eigenes Attribut mitlaufen (Fußzeile) */
const AUTO = ".footer-grid > *";

export default function Reveals() {
  const pathname = usePathname();

  useGSAP(
    (_ctx, contextSafe) => {
      const safe = contextSafe!;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const vh = window.innerHeight;
      const below = (el: Element) => el.getBoundingClientRect().top > vh * 0.9;
      /** Elemente mit gesetztem Startzustand, die noch nicht fertig stehen */
      const managed = new Set<Element>();
      const splits = new Map<Element, SplitText>();
      const triggers = new Map<Element, ScrollTrigger[]>();
      const keep = (el: Element, st?: ScrollTrigger | null) => {
        if (!st) return;
        triggers.set(el, [...(triggers.get(el) ?? []), st]);
      };
      const done = (el: Element) => {
        managed.delete(el);
        triggers.delete(el);
      };

      // Endzustand sofort herstellen (Fokus, Anker-Sprung): ohne Übergang
      const finish = (el: Element) => {
        if (!managed.has(el)) return;
        triggers.get(el)?.forEach((t) => t.kill());
        done(el);
        if (el.matches(`[data-reveal], ${AUTO}`)) gsap.set(el, { opacity: 1, y: 0, overwrite: true });
        if (el.matches("[data-split]")) {
          const split = splits.get(el);
          if (split) {
            gsap.killTweensOf(split.lines);
            split.revert();
            splits.delete(el);
          }
          gsap.set(el, { opacity: 1 });
        }
        if (el.matches('[data-script="auto"]')) {
          const t = el.querySelector(".script-text");
          const ps = el.querySelectorAll(".script-swoosh path");
          if (t) gsap.set(t, { "--w": "120%", overwrite: true });
          if (ps.length) gsap.set(ps, { strokeDashoffset: 0, overwrite: true });
        }
        if (el.matches("[data-count]")) {
          const h = el as HTMLElement;
          h.textContent = `${h.dataset.prefix ?? ""}${h.dataset.count}${h.dataset.suffix ?? ""}`;
        }
      };
      const revealWithin = (root: Element) => {
        if (root.matches(SEL)) finish(root);
        root.querySelectorAll(SEL).forEach(finish);
      };
      /** alles fertig stellen, was (im Bild gemessen) zwischen y0 und y1 liegt */
      const finishBand = (y0: number, y1: number) => {
        managed.forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.bottom > y0 && r.top < y1) finish(el);
        });
      };
      const unregister = registerRevealer(revealWithin);

      // 1) Weiche Einblendung: Deckkraft sanft, Bewegung mit Quart-Auslauf, gestaffelt
      const els = gsap.utils.toArray<HTMLElement>(`[data-reveal], ${AUTO}`).filter(below);
      const fadeOnly = (el: Element) => el.getAttribute("data-reveal") === "fade";
      if (els.length) {
        els.forEach((el) => {
          managed.add(el);
          gsap.set(el, fadeOnly(el) ? { opacity: 0 } : { opacity: 0, y: M.block.y });
        });
        const batch = ScrollTrigger.batch(els, {
          start: enterStart,
          once: true,
          onEnter: (b) => {
            (b as HTMLElement[]).forEach((el, i) => {
              if (!managed.has(el)) return;
              const delay = i * M.block.stagger;
              triggers.delete(el);
              gsap.to(el, { opacity: 1, duration: M.block.fade, ease: M.fade, delay, overwrite: "auto", onComplete: () => done(el) });
              if (!fadeOnly(el)) gsap.to(el, { y: 0, duration: M.block.move, ease: M.ease, delay, overwrite: "auto" });
            });
          },
        });
        els.forEach((el, i) => keep(el, batch[i]));
      }

      // 2) Überschriften zeilenweise (aria nur auf echten Überschriften)
      gsap.utils.toArray<HTMLElement>("[data-split]").forEach((el) => {
        if (!below(el)) return;
        managed.add(el);
        gsap.set(el, { opacity: 0 });
        document.fonts.ready.then(
          safe(() => {
            if (!managed.has(el)) return; // schon fertig (Fokus/Sprung)
            const split = SplitText.create(el, {
              type: "lines",
              mask: "lines",
              linesClass: "split-line",
              // geschützte Leerzeichen erhalten (sonst brechen Wortpaare im geteilten Zustand anders um)
              reduceWhiteSpace: false,
              aria: el.matches("h1,h2,h3,h4,h5,h6") ? "auto" : "none",
            });
            splits.set(el, split);
            gsap.set(el, { opacity: 1 });
            const tw = gsap.from(split.lines, {
              yPercent: M.head.yPercent,
              duration: M.head.dur,
              ease: M.ease,
              stagger: M.head.stagger,
              scrollTrigger: { trigger: el, start: enterStart, once: true },
              onComplete: () => {
                done(el);
                splits.delete(el);
                split.revert();
              },
            });
            keep(el, tw.scrollTrigger);
          }),
        );
      });

      // 3) Schreibschrift
      gsap.utils.toArray<HTMLElement>('[data-script="auto"]').forEach((el) => {
        if (!below(el)) return;
        const text = el.querySelector<HTMLElement>(".script-text");
        const paths = el.querySelectorAll<SVGPathElement>(".script-swoosh path");
        managed.add(el);
        if (text) gsap.set(text, { "--w": "-16%" });
        if (paths.length) gsap.set(paths, { strokeDasharray: 1, strokeDashoffset: 1 });
        const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: enterStart, once: true }, onComplete: () => done(el) });
        if (text) tl.to(text, { "--w": "120%", duration: M.script.write, ease: "power2.inOut" });
        if (paths[0]) tl.to(paths[0], { strokeDashoffset: 0, duration: M.script.swoosh, ease: M.draw }, M.script.write * 0.62);
        if (paths[1]) tl.to(paths[1], { strokeDashoffset: 0, duration: M.script.swoosh * 0.9, ease: M.draw }, M.script.write * 0.78);
        keep(el, tl.scrollTrigger);
      });

      // 4) Spielfeldlinien zeichnen sich
      gsap.utils.toArray<SVGGeometryElement>("[data-draw]").forEach((p) => {
        if (p.closest("[data-draw-manual]")) return;
        const root = p.closest<HTMLElement>("[data-draw-root]") ?? p.closest("svg") ?? p;
        gsap.fromTo(
          p,
          { strokeDasharray: 1, strokeDashoffset: 1 },
          { strokeDashoffset: 0, ease: "none", scrollTrigger: { trigger: root, start: "top 92%", end: "top 35%", scrub: 0.8 } },
        );
      });

      // 5) Zahlen zählen hoch (weicher Auslauf, nie in unter einer Sekunde durch)
      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
        if (!below(el)) return;
        const to = Number(el.dataset.count);
        const pre = el.dataset.prefix ?? "";
        const suf = el.dataset.suffix ?? "";
        const o = { v: 0 };
        managed.add(el);
        el.textContent = `${pre}0${suf}`;
        const tw = gsap.to(o, {
          v: to,
          duration: M.count.dur,
          ease: M.count.ease,
          scrollTrigger: { trigger: el, start: enterStart, once: true },
          onUpdate: () => {
            if (managed.has(el)) el.textContent = `${pre}${Math.round(o.v)}${suf}`;
          },
          onComplete: () => done(el),
        });
        keep(el, tw.scrollTrigger);
      });

      // 6) Wortmarke am Fuß: vollständig aufgedeckt, sobald sie ganz im Bild ist
      //    (ohne Nachlauf, damit nie ein halber Schriftzug wie „CONSULTINC“ stehen bleibt)
      gsap.utils.toArray<HTMLElement>("[data-wordmark]").forEach((el) => {
        gsap.fromTo(
          el,
          { "--reveal": "0%", "--shine": "150%" },
          { "--reveal": "100%", "--shine": "-50%", ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom bottom", scrub: true } },
        );
      });

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
      // Direktaufruf mit #hash (auch von einer Unterseite kommend)
      onHash();

      requestRefresh();
      return () => {
        cancelAnimationFrame(raf);
        document.removeEventListener("focusin", onFocus);
        document.removeEventListener("click", onClick, true);
        window.removeEventListener("hashchange", onHash);
        window.removeEventListener("popstate", onHash);
        unregister();
      };
    },
    { dependencies: [pathname], revertOnUpdate: true },
  );

  return null;
}
