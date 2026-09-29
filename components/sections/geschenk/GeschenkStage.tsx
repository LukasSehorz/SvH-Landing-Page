"use client";

import { useRef } from "react";
import { geschenk } from "@/app/copy";
import Rich from "@/components/system/Rich";
import { gsap, useGSAP } from "@/lib/gsap";
import { useMediaQuery, useMotionMode } from "@/lib/hooks";
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
const stackAt = (d: number) => ({ xPercent: 0, yPercent: d * 4.8, scale: 1 - d * 0.05, rotation: 0 });
// Übersicht: alle vier Seiten als ruhiges 2 × 2-Raster
const gridAt = (i: number) => ({
  xPercent: (i % 2 ? 1 : -1) * 25.9,
  yPercent: (i < 2 ? -1 : 1) * 25.9,
  scale: 0.47,
  rotation: 0,
});
// Handy, Zustand 4: Deckblatt wieder vorn, die übrigen Seiten leicht aufgefächert dahinter
const FAN = [
  { xPercent: 0, yPercent: 0, scale: 1, rotation: 0 },
  { xPercent: -1.2, yPercent: 3.2, scale: 0.97, rotation: -2.4 },
  { xPercent: 1.4, yPercent: 4.6, scale: 0.955, rotation: 2 },
  { xPercent: 0.4, yPercent: 7.2, scale: 0.935, rotation: 4.2 },
];
const depthOf = (i: number, front: number) => (i - front + N) % N;
const frontOf = (state: number) => (state === 4 ? 0 : state);

export default function GeschenkStage() {
  const motionMode = useMotionMode();
  // Handy quer (sehr niedriges Fenster): kein Platz für ein klebendes Dokument, Seiten offen zeigen
  const short = useMediaQuery("(max-height: 540px) and (max-width: 1023px)");
  const mode = motionMode === "motion" && short ? "reduced" : motionMode;
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
      const desktop = () => window.matchMedia("(min-width: 1024px)").matches;

      let cur = 0;
      let tl: gsap.core.Timeline | null = null;

      const applyZ = (state: number) => {
        pages.forEach((p, i) => gsap.set(p, { zIndex: 10 - depthOf(i, frontOf(state)) }));
      };
      const shadeFor = (i: number, state: number) => (state === 4 && desktop() ? 0 : depthOf(i, frontOf(state)) * 0.025);
      const posFor = (i: number, state: number) => {
        if (state === 4) return desktop() ? gridAt(i) : FAN[i];
        return stackAt(depthOf(i, state));
      };

      // Inhalt einer Seite: prep() setzt den Anfang (sofort beim Wechsel, damit sich
      // beim Überblenden keine zwei Inhalte überlagern), build() baut ihn auf
      const parts = (i: number) => {
        const pg = pages[i];
        return {
          bars: pg.querySelectorAll(".md-bar"),
          items: pg.querySelectorAll(".md-top li"),
          lines: pg.querySelectorAll(".md-top .md-line, .md-weg .md-line, .md-note .md-line"),
          gauges: pg.querySelectorAll(".md-gauge i"),
          checks: pg.querySelectorAll(".md-check path"),
          boxes: pg.querySelectorAll(".md-check"),
          heads: pg.querySelectorAll(".md-weg-t"),
        };
      };
      const prep = (i: number) => {
        if (i === 0) return;
        const c = parts(i);
        const all = [c.bars, c.items, c.lines, c.gauges, c.checks, c.boxes, c.heads];
        gsap.killTweensOf(all);
        if (c.bars.length) gsap.set(c.bars, { scaleX: 0 });
        if (c.items.length) gsap.set(c.items, { autoAlpha: 0, y: 8 });
        if (c.lines.length) gsap.set(c.lines, { scaleX: 0 });
        if (c.gauges.length) gsap.set(c.gauges, { scaleX: 0 });
        if (c.heads.length) gsap.set(c.heads, { autoAlpha: 0, y: 6 });
        if (c.boxes.length) gsap.set(c.boxes, { "--f": 0 });
        if (c.checks.length) gsap.set(c.checks, { strokeDashoffset: 1 });
      };
      const build = (i: number) => {
        if (i === 0) return;
        const c = parts(i);
        if (c.bars.length) gsap.to(c.bars, { scaleX: 1, duration: 1.1, ease: "expo.out", stagger: 0.07 });
        if (c.items.length) gsap.to(c.items, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.1 });
        if (c.heads.length) gsap.to(c.heads, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.1 });
        if (c.lines.length) gsap.to(c.lines, { scaleX: 1, duration: 0.9, ease: "expo.out", stagger: 0.035, delay: 0.12 });
        if (c.gauges.length) gsap.to(c.gauges, { scaleX: 1, duration: 1, ease: "expo.out", stagger: 0.1, delay: 0.25 });
        if (c.boxes.length) gsap.to(c.boxes, { "--f": 1, duration: 0.3, ease: "power2.out", stagger: 0.06, delay: 0.2 });
        if (c.checks.length) gsap.to(c.checks, { strokeDashoffset: 0, duration: 0.4, ease: "power2.out", stagger: 0.06, delay: 0.27 });
      };

      // Startzustand im Browser: Stapel mit Deckblatt vorn
      gsap.set(pages, { transformOrigin: "50% 50%" });
      pages.forEach((p, i) => gsap.set(p, posFor(i, 0)));
      shades.forEach((s, i) => gsap.set(s, { opacity: shadeFor(i, 0) }));
      gsap.set(el.querySelectorAll(".md-check path"), { strokeDasharray: 1, strokeDashoffset: 0 });
      applyZ(0);

      // Übergänge laufen immer vollständig und ruhig durch; wer schneller scrollt,
      // bekommt danach direkt den zuletzt gewünschten Zustand (keine Sprünge)
      let want = 0;
      const request = (s: number) => {
        want = s;
        if (!tl || !tl.isActive()) go(want);
      };
      const settle = () => {
        if (want !== cur) go(want);
      };

      const go = (next: number) => {
        if (next === cur) return;
        const prev = cur;
        cur = next;
        tl = gsap.timeline({ onComplete: settle });
        const T = 0.8;

        if (desktop() && (next === 4 || prev === 4)) {
          // Stapel ↔ Übersicht: alle Seiten gleiten gleichzeitig an ihren Platz
          applyZ(next === 4 ? 0 : next);
          pages.forEach((p, i) => {
            tl!.to(p, { ...posFor(i, next), duration: 0.95, ease: "power3.inOut" }, i * 0.035);
            tl!.to(shades[i], { opacity: shadeFor(i, next), duration: 0.6, ease: "power2.out" }, 0);
          });
          // Inhalt bleibt dabei stehen (er war in der Übersicht schon sichtbar)
          return;
        }

        const fNext = frontOf(next);
        const fPrev = frontOf(prev);
        const forward = depthOf(fNext, fPrev) === 1;
        if (forward) {
          // Die vordere Seite hebt sich ab und legt sich nach hinten, die nächste rückt vor
          const out = pages[fPrev];
          prep(fNext);
          tl.to(out, { xPercent: -10, yPercent: -2, rotation: -2, autoAlpha: 0, duration: 0.36, ease: "power1.in" }, 0)
            .add(() => applyZ(next), 0.36)
            .set(out, { ...posFor(fPrev, next) }, 0.36)
            .to(out, { autoAlpha: 1, duration: 0.45, ease: "power1.out" }, 0.4);
          pages.forEach((p, i) => {
            if (i !== fPrev) tl!.to(p, { ...posFor(i, next), duration: T, ease: "power3.inOut" }, 0.08);
          });
        } else {
          // Zurück (oder Sprung): die gewünschte Seite kommt von oben nach vorn
          const inn = pages[fNext];
          tl.to(inn, { autoAlpha: 0, duration: 0.2, ease: "power1.in" }, 0)
            .add(() => {
              applyZ(next);
              prep(fNext);
            }, 0.2)
            .set(inn, { ...stackAt(0), xPercent: -12, yPercent: -2, rotation: -2.5 }, 0.2)
            .to(inn, { autoAlpha: 1, xPercent: 0, yPercent: 0, rotation: 0, duration: 0.7, ease: "power3.out" }, 0.22);
          pages.forEach((p, i) => {
            if (i !== fNext) tl!.to(p, { ...posFor(i, next), duration: T, ease: "power3.inOut" }, 0);
          });
        }
        shades.forEach((s, i) => tl!.to(s, { opacity: shadeFor(i, next), duration: 0.6, ease: "power2.out" }, 0.2));
        tl.add(() => build(fNext), 0.34);
      };

      // Aktiver Punkt: der Punkt, dessen Kasten gerade eine gedachte Linie kreuzt.
      // Die Kästen schließen lückenlos aneinander (Innenabstand oben = unten), so ist
      // immer der Punkt aktiv, dessen Text der Linie am nächsten ist. Mobil liegt die
      // Linie im freien Streifen zwischen Dokument und CTA-Leiste, aber nur so tief,
      // dass der neue Text beim Umschalten schon ganz lesbar ist.
      // IntersectionObserver statt Scroll-Positionen: bleibt richtig, auch wenn sich
      // darüber die Seite nachträglich in der Höhe ändert.
      const texts = points.map((p) => p.querySelector<HTMLElement>(".gs-pt")!);
      const lineY = () => {
        const vh = window.innerHeight;
        const py = parseFloat(getComputedStyle(points[0]).paddingTop) || 0;
        const tallest = Math.max(...texts.map((t) => t.offsetHeight));
        const top = desktop() ? 100 : sticky.offsetHeight - (parseFloat(getComputedStyle(el).getPropertyValue("--gs-shift")) || 0);
        const bottom = desktop() ? vh : vh - 88;
        const line = Math.min((top + bottom) / 2, bottom - py - tallest - 8);
        return Math.round(Math.max(line, top + 8));
      };

      const mark = (state: number) => {
        el.dataset.state = String(state);
        points.forEach((p, i) => {
          p.toggleAttribute("data-active", i === state - 1);
          p.toggleAttribute("data-done", i < state - 1);
        });
      };
      const jump = (state: number) => {
        cur = state;
        want = state;
        applyZ(state);
        pages.forEach((p, i) => gsap.set(p, { ...posFor(i, state), autoAlpha: 1 }));
        shades.forEach((s, i) => gsap.set(s, { opacity: shadeFor(i, state) }));
      };

      let io: IntersectionObserver | null = null;
      let first = true;
      const watch = () => {
        io?.disconnect();
        const vh = window.innerHeight;
        const L = lineY();
        io = new IntersectionObserver(
          (entries) => {
            let next: number | null = null;
            entries.forEach((e) => {
              const i = points.indexOf(e.target as HTMLElement);
              if (e.isIntersecting) next = i + 1;
              else if (i === 0 && e.boundingClientRect.top > L && next === null) next = 0;
            });
            if (first) {
              first = false;
              // Beim Laden mitten in oder unter der Sektion: Zustand ohne Animation setzen
              const lastBox = points[N - 1].getBoundingClientRect();
              const state = next ?? (lastBox.bottom < L ? N : 0);
              mark(state);
              if (state) jump(state);
              return;
            }
            if (next === null) return;
            mark(next);
            request(next);
          },
          { rootMargin: `${-L}px 0px ${-(vh - L - 1)}px 0px`, threshold: 0 },
        );
        points.forEach((p) => io!.observe(p));
      };
      watch();
      let rz = 0;
      const onResize = () => {
        window.clearTimeout(rz);
        rz = window.setTimeout(() => {
          syncNav();
          watch();
          if (!tl || !tl.isActive()) jump(cur);
        }, 180);
      };
      window.addEventListener("resize", onResize);

      // Mobil: blendet die Menüleiste beim Runterscrollen aus, rückt das Dokument
      // nach oben (sticky-Versatz), weich nachgezogen per transform (FLIP)
      const nav = document.querySelector<HTMLElement>(".nav");
      let navHidden = false;
      const syncNav = () => {
        const hidden = nav?.dataset.hidden === "true" && !desktop();
        if (hidden === navHidden) return;
        navHidden = hidden;
        const before = sticky.getBoundingClientRect().top;
        el.toggleAttribute("data-navhidden", hidden);
        const dy = before - sticky.getBoundingClientRect().top;
        if (Math.abs(dy) > 1) gsap.fromTo(sticky, { y: dy }, { y: 0, duration: 0.6, ease: "power3.out", overwrite: true });
      };
      const mo = nav ? new MutationObserver(syncNav) : null;
      if (nav) mo!.observe(nav, { attributes: true, attributeFilter: ["data-hidden"] });
      syncNav();

      // Auftritt: Dokument gleitet herein, danach setzt sich der Stempel ruhig aufs Deckblatt
      let enter: IntersectionObserver | null = null;
      if (box.getBoundingClientRect().top > window.innerHeight * 0.85) {
        gsap.set(box, { autoAlpha: 0, y: 36 });
        gsap.set(stamp, { autoAlpha: 0, scale: 1.16 });
        enter = new IntersectionObserver(
          ([e]) => {
            if (!e.isIntersecting) return;
            enter?.disconnect();
            gsap.to(box, { autoAlpha: 1, duration: 0.55, ease: "power1.out" });
            gsap.to(box, { y: 0, duration: 1.1, ease: "expo.out" });
            gsap.to(stamp, { autoAlpha: 1, scale: 1, duration: 1.0, ease: "expo.out", delay: 0.75 });
          },
          { rootMargin: "0px 0px -16% 0px" },
        );
        enter.observe(box);
      }

      return () => {
        tl?.kill();
        io?.disconnect();
        enter?.disconnect();
        mo?.disconnect();
        window.removeEventListener("resize", onResize);
        window.clearTimeout(rz);
        delete el.dataset.state;
        el.removeAttribute("data-navhidden");
        points.forEach((p) => {
          p.removeAttribute("data-active");
          p.removeAttribute("data-done");
        });
        // Alles, was später in Beobachtern animiert wurde, zurücksetzen (z. B. Wechsel
        // auf reduzierte Bewegung oder Handy quer): die offenen Seiten stehen dann sauber
        const content = pages.flatMap((_, i) => {
          const c = parts(i);
          return [...c.bars, ...c.items, ...c.lines, ...c.gauges, ...c.heads];
        });
        const boxes = el.querySelectorAll(".md-check");
        const checks = el.querySelectorAll(".md-check path");
        gsap.killTweensOf([pages, shades, box, stamp, sticky, content, boxes, checks]);
        gsap.set([...pages, box, stamp, sticky, ...content], { clearProps: "transform,opacity,visibility,zIndex" });
        gsap.set(shades, { clearProps: "opacity" });
        gsap.set(boxes, { clearProps: "--f" });
        gsap.set(checks, { clearProps: "strokeDashoffset,strokeDasharray" });
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
