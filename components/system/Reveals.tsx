"use client";

import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { SplitText } from "@/lib/gsap-split";
import { requestRefresh } from "@/lib/refresh";
import { registerRevealer } from "@/lib/reveal";

/**
 * Seitenweite Einblendungen. Startzustände werden erst hier im Browser gesetzt
 * und nur für Elemente, die beim Laden noch unterhalb des Bildes liegen.
 * Ohne JavaScript oder bei reduzierter Bewegung bleibt alles sichtbar.
 *
 * Wichtig (Barrierefreiheit): nie visibility/autoAlpha, nur opacity und transform.
 * So bleibt alles im Barrierefreiheitsbaum und per Tab erreichbar; ein Fokus
 * blendet das Element sofort vollständig ein.
 *
 *  [data-reveal]      weich von unten
 *  [data-split]       Überschrift zeilenweise mit Maske (SplitText)
 *  [data-script=auto] Schreibschrift schreibt sich, Schwung zeichnet sich
 *  [data-draw]        Spielfeldlinie zeichnet sich beim Scrollen
 *  [data-count]       Zahl zählt hoch
 *  [data-wordmark]    Wortmarke am Fuß baut sich auf
 */
export default function Reveals() {
  const pathname = usePathname();

  useGSAP(
    (_ctx, contextSafe) => {
      const safe = contextSafe!;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const vh = window.innerHeight;
      const below = (el: Element) => el.getBoundingClientRect().top > vh * 0.9;
      const triggers = new Map<Element, ScrollTrigger[]>();
      const keep = (el: Element, st?: ScrollTrigger | null) => {
        if (!st) return;
        triggers.set(el, [...(triggers.get(el) ?? []), st]);
      };

      // Endzustand sofort herstellen (Fokus, Anker-Sprung)
      const finish = (el: Element) => {
        triggers.get(el)?.forEach((t) => t.kill());
        triggers.delete(el);
        if (el.matches("[data-reveal]")) gsap.to(el, { opacity: 1, y: 0, duration: 0.25, overwrite: true });
        if (el.matches("[data-split]")) {
          gsap.set(el, { opacity: 1 });
          el.querySelectorAll(".split-line").forEach((l) => gsap.set(l, { yPercent: 0 }));
        }
        if (el.matches('[data-script="auto"]')) {
          const t = el.querySelector(".script-text");
          const ps = el.querySelectorAll(".script-swoosh path");
          if (t) gsap.set(t, { "--w": "120%" });
          if (ps.length) gsap.set(ps, { strokeDashoffset: 0 });
        }
        if (el.matches("[data-count]")) {
          const h = el as HTMLElement;
          h.textContent = `${h.dataset.prefix ?? ""}${h.dataset.count}${h.dataset.suffix ?? ""}`;
        }
      };
      const revealWithin = (root: Element) => {
        const sel = '[data-reveal], [data-split], [data-script="auto"], [data-count]';
        if (root.matches(sel)) finish(root);
        root.querySelectorAll(sel).forEach(finish);
      };
      const unregister = registerRevealer(revealWithin);

      // 1) Weiche Einblendung (nur opacity + transform)
      const els = gsap.utils.toArray<HTMLElement>("[data-reveal]").filter(below);
      if (els.length) {
        gsap.set(els, { opacity: 0, y: 34 });
        const batch = ScrollTrigger.batch(els, {
          start: "top 90%",
          once: true,
          onEnter: (b) => gsap.to(b, { opacity: 1, y: 0, duration: 1.05, ease: "expo.out", stagger: 0.09, overwrite: true }),
        });
        els.forEach((el, i) => keep(el, batch[i]));
      }

      // 2) Überschriften zeilenweise (aria nur auf echten Überschriften)
      gsap.utils.toArray<HTMLElement>("[data-split]").forEach((el) => {
        if (!below(el)) return;
        gsap.set(el, { opacity: 0 });
        document.fonts.ready.then(
          safe(() => {
            if (!triggers.has(el) && Number(gsap.getProperty(el, "opacity")) === 1) return; // schon fertig (Fokus/Sprung)
            const split = SplitText.create(el, {
              type: "lines",
              mask: "lines",
              linesClass: "split-line",
              // geschützte Leerzeichen erhalten (sonst brechen Wortpaare im geteilten Zustand anders um)
              reduceWhiteSpace: false,
              aria: el.matches("h1,h2,h3,h4,h5,h6") ? "auto" : "none",
            });
            gsap.set(el, { opacity: 1 });
            const tw = gsap.from(split.lines, {
              yPercent: 115,
              duration: 1.15,
              ease: "expo.out",
              stagger: 0.1,
              scrollTrigger: { trigger: el, start: "top 88%", once: true },
              onComplete: () => split.revert(),
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
        if (text) gsap.set(text, { "--w": "-16%" });
        if (paths.length) gsap.set(paths, { strokeDasharray: 1, strokeDashoffset: 1 });
        const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 84%", once: true } });
        if (text) tl.to(text, { "--w": "120%", duration: 1.15, ease: "power2.inOut" });
        if (paths[0]) tl.to(paths[0], { strokeDashoffset: 0, duration: 0.8, ease: "power3.out" }, 0.7);
        if (paths[1]) tl.to(paths[1], { strokeDashoffset: 0, duration: 0.7, ease: "power3.out" }, 0.9);
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

      // 5) Zahlen zählen hoch
      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
        if (!below(el)) return;
        const to = Number(el.dataset.count);
        const pre = el.dataset.prefix ?? "";
        const suf = el.dataset.suffix ?? "";
        const o = { v: 0 };
        el.textContent = `${pre}0${suf}`;
        const tw = gsap.to(o, {
          v: to,
          duration: 1.8,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
          onUpdate: () => {
            el.textContent = `${pre}${Math.round(o.v)}${suf}`;
          },
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

      // Fokus blendet sofort vollständig ein (Tastatur, Screenreader)
      const onFocus = (e: FocusEvent) => {
        const el = (e.target as Element | null)?.closest?.('[data-reveal], [data-split]');
        if (el) finish(el);
        (e.target as Element | null)?.closest?.("section")?.querySelectorAll("[data-reveal]").forEach((r) => {
          if (r.contains(e.target as Node)) finish(r);
        });
      };
      document.addEventListener("focusin", onFocus);

      requestRefresh();
      return () => {
        document.removeEventListener("focusin", onFocus);
        unregister();
      };
    },
    { dependencies: [pathname], revertOnUpdate: true },
  );

  return null;
}
