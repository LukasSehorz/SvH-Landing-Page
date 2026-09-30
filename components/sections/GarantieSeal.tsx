"use client";

import { useRef } from "react";
import { garantie } from "@/app/copy";
import { gsap, useGSAP } from "@/lib/gsap";
import { enterStart, MOTION as M } from "@/lib/motion";

/* ====================================================================
   Garantie-Siegel wie eine Prägung: feine Verlaufs-Haarlinien, innen das
   SvH-Monogramm, außen die Ringschrift auf einem Kreispfad, die sich sehr
   langsam dreht. Beim Einscrollen zeichnen sich die Ringe, dann setzt sich
   das Siegel mit einer ruhigen Feder-Bewegung. Server-HTML: fertig und still.
   ==================================================================== */

export default function GarantieSeal() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    (_ctx, contextSafe) => {
      const el = root.current;
      if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      // langsame Drehung nur, solange das Siegel im Bild ist
      const io = new IntersectionObserver(([e]) => el.toggleAttribute("data-spin", e.isIntersecting), { rootMargin: "80px" });
      io.observe(el);
      // Auftritt: Ringe zeichnen sich, das Siegel setzt sich
      const build = () => {
        const rings = el.querySelectorAll<SVGCircleElement>("[data-ring]");
        const seal = el.querySelector(".seal-body");
        const mono = el.querySelector(".seal-mono");
        const text = el.querySelector(".seal-text");
        const disc = el.querySelector(".seal-disc");
        const glow = el.querySelector(".seal-glow");
        // nur opacity/transform (nie visibility), Maß aus lib/motion.ts
        gsap.set(rings, { strokeDasharray: 1, strokeDashoffset: 1 });
        gsap.set(seal, { scale: 1.05, rotate: -4, transformOrigin: "50% 50%" });
        gsap.set([mono, text, disc, glow], { opacity: 0 });
        const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: enterStart, once: true } });
        tl.to([disc, glow], { opacity: 1, duration: 1.6, ease: M.fade }, 0)
          .to(rings, { strokeDashoffset: 0, duration: 1.4, ease: M.draw, stagger: 0.12 }, 0)
          .to(text, { opacity: 1, duration: 1.0, ease: M.fade }, 0.7)
          .to(mono, { opacity: 1, duration: 0.9, ease: M.fade }, 0.9)
          .to(seal, { scale: 1, rotate: 0, duration: 1.6, ease: M.ease }, 0.8);
      };
      // Erst anlegen, wenn das Siegel einen Bildschirm entfernt ist (beim Laden wird nichts
      // gemessen). Liegt es dann schon im Bild oder darüber (Laden mitten auf der Seite,
      // Anker-Sprung), bleibt es fertig stehen. Nach oben unbegrenzt: auch ein Sprung
      // darüber hinweg meldet sich.
      const near = new IntersectionObserver(
        contextSafe!(([e]: IntersectionObserverEntry[]) => {
          if (!e.isIntersecting) return;
          near.disconnect();
          if (e.boundingClientRect.top >= window.innerHeight * 0.85) build();
        }),
        { rootMargin: "100000px 0px 100% 0px" },
      );
      near.observe(el);
      return () => {
        io.disconnect();
        near.disconnect();
      };
    },
    { scope: root },
  );

  return (
    <div className="seal" ref={root} aria-hidden="true">
      <div className="seal-glow" />
      <svg className="seal-svg" viewBox="0 0 300 300">
        <defs>
          <linearGradient id="seal-grad" gradientUnits="userSpaceOnUse" x1="20" y1="30" x2="280" y2="270">
            <stop offset="0" stopColor="#5b8cff" />
            <stop offset="0.5" stopColor="#7c6aff" />
            <stop offset="1" stopColor="#b9a5ff" />
          </linearGradient>
          <radialGradient id="seal-fill" cx="0.5" cy="0.42" r="0.6">
            <stop offset="0" stopColor="rgba(124,106,255,0.1)" />
            <stop offset="1" stopColor="rgba(8,8,12,0.96)" />
          </radialGradient>
          <path id="seal-path" d="M150 150 m -117 0 a 117 117 0 1 1 234 0 a 117 117 0 1 1 -234 0" />
        </defs>
        <g className="seal-body">
          <circle className="seal-disc" cx="150" cy="150" r="140" fill="url(#seal-fill)" />
          <circle data-ring="" pathLength={1} cx="150" cy="150" r="142" className="seal-ring seal-ring--outer" transform="rotate(-90 150 150)" />
          <circle data-ring="" pathLength={1} cx="150" cy="150" r="134" className="seal-ring" transform="rotate(-90 150 150)" />
          <circle data-ring="" pathLength={1} cx="150" cy="150" r="100" className="seal-ring" transform="rotate(-90 150 150)" />
          <circle data-ring="" pathLength={1} cx="150" cy="150" r="93" className="seal-ring seal-ring--thin" transform="rotate(-90 150 150)" />
          {/* Teilstriche als ein Kreis mit Strichmuster (statt 72 Einzellinien) */}
          <g className="seal-ticks">
            <circle cx="150" cy="150" r="95" pathLength={72} className="seal-tick" />
            <circle cx="150" cy="150" r="93.5" pathLength={12} className="seal-tick seal-tick--long" />
          </g>
          <g className="seal-text">
            <text>
              <textPath href="#seal-path" startOffset="0" textLength={735} lengthAdjust="spacing">
                {garantie.seal.toUpperCase().replace(/\s+$/, "\u00a0")}
              </textPath>
            </text>
          </g>
          <image className="seal-mono" href="/logo/svh-bild-480.webp" x="124" y="108" width="52" height="85" />
          <path className="seal-star" d="M150 212 l2.2 4.6 5 .6 -3.7 3.4 1 5 -4.5 -2.5 -4.5 2.5 1 -5 -3.7 -3.4 5 -.6z" />
        </g>
      </svg>
    </div>
  );
}
