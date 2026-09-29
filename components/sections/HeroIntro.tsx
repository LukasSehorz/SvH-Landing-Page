"use client";

import { gsap, SplitText, useGSAP } from "@/lib/gsap";

/**
 * Auftritt des Starts: H1 zeilenweise mit Masken-Reveal (SplitText),
 * danach schreibt sich das Schreibschrift-Wort und der Schwung zeichnet sich.
 */
export default function HeroIntro() {
  useGSAP(() => {
    const section = document.querySelector<HTMLElement>(".hero");
    const h1 = section?.querySelector<HTMLElement>(".hero-title");
    if (!section || !h1) return;
    const ins = section.querySelectorAll<HTMLElement>("[data-hero-in]");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      section.dataset.ready = "";
      return;
    }

    // Schreibschrift vor dem Teilen verstecken (bleibt beim Zurücksetzen erhalten)
    const st = h1.querySelector<HTMLElement>(".script-text");
    if (st) st.style.setProperty("--w", "-16%");
    h1.querySelectorAll<SVGPathElement>(".script-swoosh path").forEach((p) => {
      p.style.strokeDasharray = "1";
      p.style.strokeDashoffset = "1";
    });

    let split: SplitText | null = null;
    const run = () => {
      split = SplitText.create(h1, { type: "lines", mask: "lines", linesClass: "split-line" });
      gsap.set(ins, { autoAlpha: 0, y: 26 });
      section.dataset.ready = "";
      const tl = gsap.timeline({ delay: 0.05 });
      tl.from(split.lines, { yPercent: 118, duration: 1.15, ease: "expo.out", stagger: 0.12 })
        .to(ins, { autoAlpha: 1, y: 0, duration: 1, ease: "expo.out", stagger: 0.08 }, 0.35)
        .add(() => {
          split?.revert();
          split = null;
          // nach dem Zurücksetzen die neuen Knoten holen
          const text = h1.querySelector<HTMLElement>(".script-text");
          const paths = h1.querySelectorAll<SVGPathElement>(".script-swoosh path");
          const w = gsap.timeline();
          w.to(text, { "--w": "120%", duration: 1.05, ease: "power2.inOut" })
            .to(paths[0] ?? {}, { strokeDashoffset: 0, duration: 0.75, ease: "power3.out" }, 0.62)
            .to(paths[1] ?? {}, { strokeDashoffset: 0, duration: 0.6, ease: "power3.out" }, 0.82);
        }, 1.05);
    };

    // Zeilen erst nach dem Laden der Schriften messen
    if (document.fonts.status === "loaded") run();
    else document.fonts.ready.then(run);

    return () => {
      split?.revert();
    };
  });
  return null;
}
