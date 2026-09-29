"use client";

import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";

/**
 * Seitenweite Einblendungen. Startzustände werden erst hier im Browser gesetzt
 * und nur für Elemente, die beim Laden noch unterhalb des Bildes liegen.
 * Ohne JavaScript oder bei reduzierter Bewegung bleibt alles sichtbar.
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
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const vh = window.innerHeight;
      const below = (el: Element) => el.getBoundingClientRect().top > vh * 0.9;

      // 1) Weiche Einblendung
      const els = gsap.utils.toArray<HTMLElement>("[data-reveal]").filter(below);
      if (els.length) {
        gsap.set(els, { autoAlpha: 0, y: 34 });
        ScrollTrigger.batch(els, {
          start: "top 90%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, { autoAlpha: 1, y: 0, duration: 1.05, ease: "expo.out", stagger: 0.09, overwrite: true }),
        });
      }

      // 2) Überschriften zeilenweise
      gsap.utils.toArray<HTMLElement>("[data-split]").forEach((el) => {
        if (!below(el)) return;
        gsap.set(el, { autoAlpha: 0 });
        document.fonts.ready.then(() => {
          const split = SplitText.create(el, { type: "lines", mask: "lines", linesClass: "split-line" });
          gsap.set(el, { autoAlpha: 1 });
          gsap.from(split.lines, {
            yPercent: 115,
            duration: 1.15,
            ease: "expo.out",
            stagger: 0.1,
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
            onComplete: () => split.revert(),
          });
        });
      });

      // 3) Schreibschrift
      gsap.utils.toArray<HTMLElement>('[data-script="auto"]').forEach((el) => {
        if (!below(el)) return;
        const text = el.querySelector<HTMLElement>(".script-text");
        const paths = el.querySelectorAll<SVGPathElement>(".script-swoosh path");
        gsap.set(text, { "--w": "-16%" });
        gsap.set(paths, { strokeDasharray: 1, strokeDashoffset: 1 });
        const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 84%", once: true } });
        tl.to(text, { "--w": "120%", duration: 1.15, ease: "power2.inOut" })
          .to(paths[0], { strokeDashoffset: 0, duration: 0.8, ease: "power3.out" }, 0.7)
          .to(paths[1], { strokeDashoffset: 0, duration: 0.7, ease: "power3.out" }, 0.9);
      });

      // 4) Spielfeldlinien zeichnen sich
      gsap.utils.toArray<SVGGeometryElement>("[data-draw]").forEach((p) => {
        if (p.closest("[data-draw-manual]")) return;
        const root = p.closest<HTMLElement>("[data-draw-root]") ?? p.closest("svg") ?? p;
        gsap.fromTo(
          p,
          { strokeDasharray: 1, strokeDashoffset: 1 },
          {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: { trigger: root, start: "top 92%", end: "top 35%", scrub: 0.8 },
          },
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
        gsap.to(o, {
          v: to,
          duration: 1.8,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
          onUpdate: () => {
            el.textContent = `${pre}${Math.round(o.v)}${suf}`;
          },
        });
      });

      // 6) Wortmarke am Fuß
      gsap.utils.toArray<HTMLElement>("[data-wordmark]").forEach((el) => {
        gsap.fromTo(
          el,
          { "--reveal": "0%", "--shine": "150%" },
          {
            "--reveal": "100%",
            "--shine": "-50%",
            ease: "none",
            // bis ganz unten: die Marke steht nah am Seitenende
            scrollTrigger: { trigger: el, start: "top bottom", end: "max", scrub: 0.8 },
          },
        );
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());
    },
    { dependencies: [pathname], revertOnUpdate: true },
  );

  return null;
}
