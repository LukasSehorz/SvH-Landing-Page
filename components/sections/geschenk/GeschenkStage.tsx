"use client";

import { useRef } from "react";
import { geschenk } from "@/app/copy";
import Rich from "@/components/system/Rich";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useMotionMode } from "@/lib/hooks";
import Masterplan from "./Masterplan";

/* ====================================================================
   Bühne „Das Geschenk“: das Masterplan-Dokument klebt im Bild (CSS
   sticky, kein Pin), daneben bzw. darunter ziehen die vier Punkte vorbei.
   Jeder Punkt holt seine Seite nach vorn und baut ihren Inhalt auf:
     Zustand 0 = Deckblatt, 1 = Zeitfresser, 2 = Top 3, 3 = Lösungsweg,
     4 = Übersicht aller Seiten (Besprechung im zweiten Termin).
   Server-HTML und reduzierte Bewegung: alle Seiten offen nebeneinander
   bzw. untereinander, Stempel gesetzt, nichts versteckt.
   ==================================================================== */

const P = geschenk.points;
const D = geschenk.doc;
const LABEL = `${D.coverTitle} ${D.coverSub}, ${D.coverBy}. ${D.sample}.`;
const N = 4;

// Stapel: jede Seite dahinter etwas kleiner und tiefer (in % der Seitengröße)
const stackAt = (d: number) => ({ xPercent: 0, yPercent: d * 4.4, scale: 1 - d * 0.05, rotation: 0 });
// Übersicht: alle vier Seiten als ruhiges 2 × 2-Raster
const gridAt = (i: number) => ({
  xPercent: (i % 2 ? 1 : -1) * 25.9,
  yPercent: (i < 2 ? -1 : 1) * 25.9,
  scale: 0.47,
  rotation: 0,
});
const depthOf = (i: number, front: number) => (i - front + N) % N;

export default function GeschenkStage() {
  const mode = useMotionMode();
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (mode !== "motion" || !el) return;

      const box = el.querySelector<HTMLElement>(".md-box")!;
      const pages = gsap.utils.toArray<HTMLElement>(el.querySelectorAll(".md-page"));
      const shades = pages.map((p) => p.querySelector<HTMLElement>(".md-shade")!);
      const stamp = el.querySelector<HTMLElement>(".md-stamp")!;
      const points = gsap.utils.toArray<HTMLElement>(el.querySelectorAll(".gs-point"));
      const sticky = el.querySelector<HTMLElement>(".gs-docwrap")!;
      const fill = el.querySelector<HTMLElement>(".gs-track-fill");
      const desktop = () => window.matchMedia("(min-width: 1024px)").matches;

      let cur = 0;
      let tl: gsap.core.Timeline | null = null;

      const applyZ = (state: number) => {
        const front = state === 4 ? 0 : state;
        pages.forEach((p, i) => gsap.set(p, { zIndex: 10 - depthOf(i, front) }));
      };
      const shadeFor = (i: number, state: number) => (state === 4 ? 0 : depthOf(i, state) * 0.06);
      const posFor = (i: number, state: number) => (state === 4 ? gridAt(i) : stackAt(depthOf(i, state)));

      // Inhalt der Seite baut sich auf, sobald sie vorn liegt
      const build = (i: number) => {
        const pg = pages[i];
        if (i === 1) {
          const bars = pg.querySelectorAll(".md-bar");
          gsap.killTweensOf(bars);
          gsap.fromTo(bars, { scaleX: 0 }, { scaleX: 1, duration: 1.1, ease: "expo.out", stagger: 0.07 });
        } else if (i === 2) {
          const items = pg.querySelectorAll(".md-top li");
          const lines = pg.querySelectorAll(".md-top .md-line");
          const lever = pg.querySelectorAll(".md-lever i[data-on]");
          gsap.killTweensOf([items, lines, lever]);
          gsap.fromTo(items, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.12 });
          gsap.fromTo(lines, { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: "expo.out", stagger: 0.05, delay: 0.15 });
          gsap.fromTo(lever, { scaleY: 0 }, { scaleY: 1, duration: 0.6, ease: "power3.out", stagger: 0.03, delay: 0.3 });
        } else if (i === 3) {
          const checks = pg.querySelectorAll(".md-check path");
          const boxes = pg.querySelectorAll(".md-check");
          const lines = pg.querySelectorAll(".md-weg .md-line");
          gsap.killTweensOf([checks, boxes, lines]);
          gsap.fromTo(lines, { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: "expo.out", stagger: 0.05 });
          gsap.fromTo(boxes, { "--f": 0 }, { "--f": 1, duration: 0.35, ease: "power2.out", stagger: 0.11, delay: 0.2 });
          gsap.fromTo(checks, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.45, ease: "power2.out", stagger: 0.11, delay: 0.3 });
        }
      };

      // Startzustand im Browser: Stapel mit Deckblatt vorn
      gsap.set(pages, { transformOrigin: "50% 50%" });
      pages.forEach((p, i) => gsap.set(p, posFor(i, 0)));
      shades.forEach((s, i) => gsap.set(s, { opacity: shadeFor(i, 0) }));
      gsap.set(el.querySelectorAll(".md-check path"), { strokeDasharray: 1, strokeDashoffset: 0 });
      applyZ(0);

      const go = (next: number) => {
        if (next === cur) return;
        const prev = cur;
        cur = next;
        if (tl) {
          tl.kill();
          gsap.set(pages, { autoAlpha: 1 });
        }
        tl = gsap.timeline();
        const T = 0.8;

        if (next === 4 || prev === 4) {
          // Stapel ↔ Übersicht: alle Seiten gleiten gleichzeitig an ihren Platz
          applyZ(next === 4 ? 0 : next);
          pages.forEach((p, i) => {
            tl!.to(p, { ...posFor(i, next), duration: 0.95, ease: "power3.inOut" }, i * 0.035);
            tl!.to(shades[i], { opacity: shadeFor(i, next), duration: 0.6, ease: "power2.out" }, 0);
          });
          if (next !== 4) tl.add(() => build(next), 0.45);
          return;
        }

        const forward = depthOf(next, prev) === 1;
        if (forward) {
          // Die vordere Seite hebt sich ab und legt sich nach hinten, die nächste rückt vor
          const out = pages[prev];
          tl.to(out, { yPercent: -6, scale: 1.015, autoAlpha: 0, duration: 0.42, ease: "power2.in" }, 0)
            .add(() => applyZ(next), 0.42)
            .set(out, { ...stackAt(N - 1) }, 0.42)
            .to(out, { autoAlpha: 1, duration: 0.45, ease: "power1.out" }, 0.46);
          pages.forEach((p, i) => {
            if (i !== prev) tl!.to(p, { ...posFor(i, next), duration: T, ease: "power3.inOut" }, 0.08);
          });
        } else {
          // Zurück (oder Sprung): die gewünschte Seite kommt von oben nach vorn
          const inn = pages[next];
          tl.to(inn, { autoAlpha: 0, duration: 0.22, ease: "power1.in" }, 0)
            .add(() => applyZ(next), 0.22)
            .set(inn, { ...stackAt(0), yPercent: -6, scale: 1.015 }, 0.22)
            .to(inn, { autoAlpha: 1, yPercent: 0, scale: 1, duration: 0.65, ease: "power3.out" }, 0.24);
          pages.forEach((p, i) => {
            if (i !== next) tl!.to(p, { ...posFor(i, next), duration: T, ease: "power3.inOut" }, 0);
          });
        }
        shades.forEach((s, i) => tl!.to(s, { opacity: shadeFor(i, next), duration: 0.6, ease: "power2.out" }, 0.2));
        tl.add(() => build(next), 0.34);
      };

      // Aktiver Punkt: Linie, an der ein Punkt „dran“ ist
      const lineY = () => {
        const vh = window.innerHeight;
        if (desktop()) return Math.round(vh * 0.56);
        const docBottom = sticky.offsetHeight;
        const free = Math.max(0, vh - docBottom - 88);
        return Math.round(docBottom + Math.max(24, free * 0.3));
      };

      const mark = (state: number) => {
        el.dataset.state = String(state);
        points.forEach((p, i) => p.toggleAttribute("data-active", i === state - 1));
      };

      const triggers = points.map((pt, i) =>
        ScrollTrigger.create({
          trigger: pt,
          start: () => `top ${lineY()}px`,
          onEnter: () => {
            mark(i + 1);
            go(i + 1);
          },
          onLeaveBack: () => {
            mark(i);
            go(i);
          },
        }),
      );

      // Fortschrittslinie an den Punkten entlang
      if (fill) {
        gsap.fromTo(
          fill,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: points[0],
              start: () => `top ${lineY()}px`,
              endTrigger: points[N - 1],
              end: () => `top ${lineY()}px`,
              scrub: 0.4,
            },
          },
        );
      }

      // Stempel setzt sich ruhig aufs Deckblatt, sobald das Dokument ins Bild kommt
      const vh = window.innerHeight;
      const boxTop = box.getBoundingClientRect().top;
      if (boxTop > vh * 0.85) {
        gsap.set(box, { autoAlpha: 0, y: 36 });
        gsap.set(stamp, { autoAlpha: 0, scale: 1.16 });
        ScrollTrigger.create({
          trigger: box,
          start: "top 84%",
          once: true,
          onEnter: () => {
            gsap.to(box, { autoAlpha: 1, y: 0, duration: 1.1, ease: "expo.out" });
            gsap.to(stamp, { autoAlpha: 1, scale: 1, duration: 1.0, ease: "expo.out", delay: 0.75 });
          },
        });
      }

      // Einstieg mitten in der Sektion (Neuladen, Anker): Zustand ohne Animation setzen
      ScrollTrigger.refresh();
      const y = window.scrollY;
      const init = triggers.filter((t) => y >= t.start).length;
      if (init) {
        cur = init;
        mark(init);
        applyZ(init);
        pages.forEach((p, i) => gsap.set(p, posFor(i, init)));
        shades.forEach((s, i) => gsap.set(s, { opacity: shadeFor(i, init) }));
      } else {
        mark(0);
      }

      return () => {
        tl?.kill();
        delete el.dataset.state;
        points.forEach((p) => p.removeAttribute("data-active"));
      };
    },
    { scope: root, dependencies: [mode], revertOnUpdate: true },
  );

  return (
    <div className="gs-stage" ref={root} data-mode={mode === "motion" ? "motion" : "static"}>
      <div className="gs-docwrap">
        <div className="gs-sticky">
          <Masterplan label={LABEL} />
        </div>
      </div>

      <div className="gs-points">
        <span className="gs-track" aria-hidden="true">
          <span className="gs-track-fill" />
        </span>
        <ol className="gs-list">
        {P.map((p, i) => (
          <li className="gs-point" key={p.title}>
            <span className="gs-num" aria-hidden="true">
              {i + 1}
            </span>
            <div className="gs-pt">
              <h3 className="h3 gs-pt-t">
                <Rich text={p.title} />
              </h3>
              <p className="body gs-pt-x">
                <Rich text={p.text} />
              </p>
            </div>
          </li>
        ))}
        </ol>
      </div>
    </div>
  );
}
