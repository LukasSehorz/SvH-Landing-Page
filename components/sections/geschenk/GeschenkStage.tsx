"use client";

import { useRef } from "react";
import { geschenk } from "@/app/copy";
import Rich from "@/components/system/Rich";
import { gsap, useGSAP } from "@/lib/gsap";
import { useMediaQuery, useMotionMode } from "@/lib/hooks";
import { MOTION as M } from "@/lib/motion";
import { requestRefresh } from "@/lib/refresh";
import Masterplan from "./Masterplan";

/* ====================================================================
   Bühne „Das Geschenk“: das Masterplan-Dokument klebt im Bild (CSS
   sticky, kein Pin), daneben bzw. darunter ziehen die vier Punkte vorbei.
   Jeder Punkt holt seine Seite nach vorn und baut ihren Inhalt auf:
     Zustand 0 = Deckblatt, 1 = Zeitfresser, 2 = Top 3, 3 = Lösungsweg,
     4 = Abschluss (Desktop: alle Seiten als Übersicht, Handy: Deckblatt vorn).
   Seitenwechsel ohne Doppelbild: erst blendet der Inhalt der vorderen Seite
   aus, dann liegt die neue Seite (deckend) vorn, steigt 12 px auf und ihr
   Inhalt blendet ein. Nie scheinen zwei Seiteninhalte übereinander.
   Server-HTML und reduzierte Bewegung: alle Seiten offen, nichts versteckt.
   Die Zeitleiste entsteht erst, wenn die Sektion etwa einen Bildschirm entfernt ist.
   ==================================================================== */

const P = geschenk.points;
const D = geschenk.doc;
const LABEL = `${D.coverTitle} ${D.coverSub}, ${D.coverBy}. ${D.sample}.`;
const N = 4;

// Stapel: jede Seite dahinter etwas kleiner und tiefer (in % der Seitengröße).
// Dieselben Werte stehen als Startzustand in geschenk.css (vor dem Aufbau).
const stackAt = (d: number) => ({ x: 0, y: 0, xPercent: 0, yPercent: d * 4.8, scale: 1 - d * 0.05, rotation: 0 });
// Desktop, Zustand 4: alle vier Seiten als ruhiges 2 × 2-Raster
const gridAt = (i: number) => ({
  x: 0,
  y: 0,
  xPercent: (i % 2 ? 1 : -1) * 25.9,
  yPercent: (i < 2 ? -1 : 1) * 25.9,
  scale: 0.47,
  rotation: 0,
});
// Handy, Zustand 4: Deckblatt wieder vorn, die übrigen Seiten leicht aufgefächert dahinter
const FAN = [
  { x: 0, y: 0, xPercent: 0, yPercent: 0, scale: 1, rotation: 0 },
  { x: 0, y: 0, xPercent: -1.2, yPercent: 3.2, scale: 0.97, rotation: -2.4 },
  { x: 0, y: 0, xPercent: 1.4, yPercent: 4.6, scale: 0.955, rotation: 2 },
  { x: 0, y: 0, xPercent: 0.4, yPercent: 7.2, scale: 0.935, rotation: 4.2 },
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
      if (!el || mode === "static") return;
      // Die Sektion ändert beim Wechsel der Fassung ihre Höhe: Trigger darunter neu messen
      requestRefresh();
      if (mode !== "motion") return;

      let cleanup: (() => void) | null = null;
      const near = new IntersectionObserver(
        ([e]) => {
          if (!e.isIntersecting) return;
          near.disconnect();
          cleanup = setup(el);
        },
        { rootMargin: "100% 0px" },
      );
      // die Bühne selbst hat am Desktop keinen eigenen Kasten (display: contents), daher die Sektion beobachten
      near.observe(el.closest("section") ?? el);
      return () => {
        near.disconnect();
        cleanup?.();
      };
    },
    { scope: root, dependencies: [mode], revertOnUpdate: true },
  );

  return (
    <div className="gs-stage" ref={root} data-mode={mode === "motion" ? "motion" : "static"}>
      <span className="gs-probe" aria-hidden="true" />
      <div className="gs-docwrap">
        <div className="gs-sticky">
          <Masterplan label={LABEL} />
        </div>
      </div>

      <div className="gs-points">
        <ol className="gs-list">
          {P.map((p, i) => (
            <li className="gs-point" key={p.title} data-reveal="">
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

/* ------------------------------------------------------------------
   Aufbau der Bewegung (läuft einmal, sobald die Sektion naht).
   Gibt eine Aufräumfunktion zurück, die alle gesetzten Werte entfernt.
   ------------------------------------------------------------------ */
function setup(el: HTMLElement): () => void {
  const box = el.querySelector<HTMLElement>(".md-box")!;
  const pages = gsap.utils.toArray<HTMLElement>(el.querySelectorAll(".md-page"));
  const shades = pages.map((p) => p.querySelector<HTMLElement>(".md-shade")!);
  const stamp = el.querySelector<HTMLElement>(".md-stamp")!;
  const points = gsap.utils.toArray<HTMLElement>(el.querySelectorAll(".gs-point"));
  const sticky = el.querySelector<HTMLElement>(".gs-docwrap")!;
  const probe = el.querySelector<HTMLElement>(".gs-probe");
  const desktop = () => window.matchMedia("(min-width: 1024px)").matches;

  let cur = 0;
  let tl: gsap.core.Timeline | null = null;
  let stampShown = true;

  const applyZ = (state: number) => {
    pages.forEach((p, i) => gsap.set(p, { zIndex: 10 - depthOf(i, frontOf(state)) }));
  };
  const shadeFor = (i: number, state: number) => (state === 4 && desktop() ? 0 : depthOf(i, frontOf(state)) * 0.025);
  const posFor = (i: number, state: number) => {
    if (state === 4) return desktop() ? gridAt(i) : FAN[i];
    return stackAt(depthOf(i, state));
  };

  // Inhalt einer Seite = alle Blöcke auf dem Papier (der Stempel erst, wenn er gesetzt ist)
  const contentOf = (i: number) =>
    gsap.utils.toArray<HTMLElement>(pages[i].querySelectorAll(".md-sheet > *")).filter((c) => stampShown || c !== stamp);

  // Aufbau je Seite: prep() setzt den Anfang, build() lässt ihn wachsen
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
    gsap.killTweensOf([c.bars, c.items, c.lines, c.gauges, c.checks, c.boxes, c.heads]);
    if (c.bars.length) gsap.set(c.bars, { scaleX: 0 });
    if (c.items.length) gsap.set(c.items, { opacity: 0, y: 8 });
    if (c.lines.length) gsap.set(c.lines, { scaleX: 0 });
    if (c.gauges.length) gsap.set(c.gauges, { scaleX: 0 });
    if (c.heads.length) gsap.set(c.heads, { opacity: 0, y: 6 });
    if (c.boxes.length) gsap.set(c.boxes, { "--f": 0 });
    if (c.checks.length) gsap.set(c.checks, { strokeDashoffset: 1 });
  };
  // Aufbau ruhig, aber zügig (Runde 6): Inhalt nach ≈ 0,5 s lesbar, nach ≈ 1,1 s fertig.
  // Runde 4 hatte auf 0,2 bis 0,5 s gestrafft; das wirkte gehetzt, der alte Inhalt verschwand
  // auf dem Telefon in 4 Bildern (67 ms). Jetzt wie das übrige Bewegungssystem (lib/motion.ts).
  const build = (i: number) => {
    if (i === 0) return;
    const c = parts(i);
    if (c.bars.length) gsap.to(c.bars, { scaleX: 1, duration: 0.85, ease: M.ease, stagger: 0.05 });
    if (c.items.length) gsap.to(c.items, { opacity: 1, y: 0, duration: 0.65, ease: M.ease, stagger: 0.07 });
    if (c.heads.length) gsap.to(c.heads, { opacity: 1, y: 0, duration: 0.6, ease: M.ease, stagger: 0.07 });
    if (c.lines.length) gsap.to(c.lines, { scaleX: 1, duration: 0.8, ease: M.ease, stagger: 0.025, delay: 0.06 });
    if (c.gauges.length) gsap.to(c.gauges, { scaleX: 1, duration: 0.85, ease: M.ease, stagger: 0.06, delay: 0.12 });
    if (c.boxes.length) gsap.to(c.boxes, { "--f": 1, duration: 0.35, ease: "power2.out", stagger: 0.04, delay: 0.14 });
    if (c.checks.length) gsap.to(c.checks, { strokeDashoffset: 0, duration: 0.45, ease: "power2.out", stagger: 0.04, delay: 0.2 });
  };

  // Startzustand: Stapel mit Deckblatt vorn (entspricht dem CSS-Startzustand)
  gsap.set(pages, { transformOrigin: "50% 50%" });
  pages.forEach((p, i) => gsap.set(p, posFor(i, 0)));
  shades.forEach((s, i) => gsap.set(s, { opacity: shadeFor(i, 0) }));
  gsap.set(el.querySelectorAll(".md-check path"), { strokeDasharray: 1, strokeDashoffset: 0 });
  applyZ(0);

  // Übergänge laufen immer vollständig durch; wer schneller scrollt, bekommt danach
  // direkt den zuletzt gewünschten Zustand (keine Sprünge, keine halben Zustände)
  let want = 0;
  const request = (s: number) => {
    want = s;
    if (!tl || !tl.isActive()) go(want);
  };
  const settle = () => {
    if (want !== cur) go(want);
  };

  const OUT = 0.22; // Inhalt der alten Seite blendet aus (vorher 0,12 s: auf dem Telefon 4 Bilder, wirkte wie Flackern)
  const IN = 0.45; // Inhalt der neuen Seite blendet ein (vorher 0,2 s)
  const MOVE = 0.7; // neue Seite steigt auf, die übrigen gleiten an ihren Stapelplatz (vorher 0,45 s)

  const go = (next: number) => {
    if (next === cur) return;
    const prev = cur;
    cur = next;
    tl = gsap.timeline({ onComplete: settle });

    if (desktop() && (next === 4 || prev === 4)) {
      // Stapel ↔ Übersicht: alle Seiten gleiten gleichzeitig an ihren Platz. Zur Übersicht
      // bleibt die Reihenfolge des Stapels (die vordere Seite bleibt vorn und gleitet an
      // ihren Platz, kein Deckblatt springt nach vorn, keine Fußzeilen schauen darunter
      // heraus); zurück zum Stapel wird sie sofort gesetzt (im Raster überlappt nichts).
      if (next !== 4) applyZ(next);
      pages.forEach((p, i) => {
        tl!.to(p, { ...posFor(i, next), duration: 1.05, ease: "power3.inOut" }, i * 0.04);
        tl!.to(shades[i], { opacity: shadeFor(i, next), duration: 0.6, ease: "power2.out" }, 0);
      });
      return;
    }

    const fPrev = frontOf(prev);
    const fNext = frontOf(next);
    const oldContent = contentOf(fPrev);
    const newContent = contentOf(fNext);

    // 1) erst aus: Inhalt der vorderen Seite verschwindet, das Papier bleibt
    tl.to(oldContent, { opacity: 0, duration: OUT, ease: M.out }, 0);
    // 2) Tausch: die neue Seite liegt deckend vorn (Inhalt noch unsichtbar), 12 px tiefer
    tl.add(() => {
      prep(fNext);
      gsap.set(newContent, { opacity: 0 });
      applyZ(next);
      gsap.set(pages[fNext], { ...posFor(fNext, next), y: 12 });
      gsap.set(shades[fNext], { opacity: 0 });
    }, OUT);
    // die alte Seite bekommt ihren Inhalt zurück, sobald sie ganz verdeckt hinten liegt
    tl.set(oldContent, { opacity: 1 }, OUT + MOVE + 0.02);
    // 3) dann ein: Seite steigt auf, Inhalt blendet ein und baut sich parallel auf
    tl.to(pages[fNext], { y: 0, duration: MOVE, ease: M.ease }, OUT);
    tl.to(newContent, { opacity: 1, duration: IN, ease: M.fade }, OUT + 0.02);
    tl.add(() => build(fNext), OUT + 0.04);
    // die übrigen Seiten gleiten unsichtbar an ihren Stapelplatz
    pages.forEach((p, i) => {
      if (i === fNext) return;
      tl!.to(p, { ...posFor(i, next), duration: MOVE, ease: "power3.inOut" }, OUT);
      tl!.to(shades[i], { opacity: shadeFor(i, next), duration: 0.4, ease: "power2.out" }, OUT);
    });
  };

  // Aktiver Punkt: der Punkt, dessen Kasten eine gedachte Linie kreuzt. Die Kästen
  // schließen lückenlos aneinander (Innenabstand oben = unten), so ist immer der Punkt
  // aktiv, dessen Text der Linie am nächsten ist. Mobil liegt die Linie im freien
  // Streifen zwischen Dokument und CTA-Leiste, aber nur so tief, dass der neue Text
  // beim Umschalten schon ganz lesbar ist. IntersectionObserver statt Scroll-Positionen:
  // bleibt richtig, auch wenn sich die Seite darüber nachträglich in der Höhe ändert.
  const texts = points.map((p) => p.querySelector<HTMLElement>(".gs-pt")!);
  const lineY = () => {
    const vh = window.innerHeight;
    const py = parseFloat(getComputedStyle(points[0]).paddingTop) || 0;
    const tallest = Math.max(...texts.map((t) => t.offsetHeight));
    const ctaH = probe?.offsetHeight ?? 0; // = var(--mobile-cta-h)
    const shift = parseFloat(getComputedStyle(el).getPropertyValue("--gs-shift")) || 0;
    const top = desktop() ? 100 : sticky.offsetHeight - shift;
    const bottom = vh - ctaH;
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
    pages.forEach((p, i) => gsap.set(p, posFor(i, state)));
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
          // Einstieg mitten in oder unter der Sektion: Zustand ohne Animation setzen
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
      watch();
      if (!tl || !tl.isActive()) jump(cur);
    }, 180);
  };
  window.addEventListener("resize", onResize);

  // Auftritt: Dokument gleitet herein, danach setzt sich der Stempel ruhig aufs Deckblatt.
  // Nur opacity/transform (nie visibility), damit nichts aus dem Barrierefreiheitsbaum fällt.
  let enter: IntersectionObserver | null = null;
  if (box.getBoundingClientRect().top > window.innerHeight * 0.85) {
    stampShown = false;
    gsap.set(box, { opacity: 0, y: 36 });
    gsap.set(stamp, { opacity: 0, scale: 1.1 });
    enter = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        enter?.disconnect();
        gsap.to(box, { opacity: 1, duration: M.block.fade, ease: M.fade });
        gsap.to(box, { y: 0, duration: 1.1, ease: M.ease });
        gsap.to(stamp, {
          opacity: 1,
          scale: 1,
          duration: 0.9,
          ease: M.ease,
          delay: 0.8,
          onStart: () => {
            stampShown = true;
          },
        });
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    enter.observe(box);
  }

  return () => {
    tl?.kill();
    io?.disconnect();
    enter?.disconnect();
    window.removeEventListener("resize", onResize);
    window.clearTimeout(rz);
    delete el.dataset.state;
    points.forEach((p) => {
      p.removeAttribute("data-active");
      p.removeAttribute("data-done");
    });
    // Alle gesetzten Werte entfernen (z. B. Wechsel auf reduzierte Bewegung oder Handy quer)
    const blocks = pages.flatMap((_, i) => gsap.utils.toArray<HTMLElement>(pages[i].querySelectorAll(".md-sheet > *")));
    const content = pages.flatMap((_, i) => {
      const c = parts(i);
      return [...c.bars, ...c.items, ...c.lines, ...c.gauges, ...c.heads];
    });
    const boxes = el.querySelectorAll(".md-check");
    const checks = el.querySelectorAll(".md-check path");
    gsap.killTweensOf([pages, shades, box, stamp, blocks, content, boxes, checks]);
    gsap.set([...pages, box, stamp, ...blocks, ...content], { clearProps: "transform,opacity,visibility,zIndex" });
    gsap.set(shades, { clearProps: "opacity" });
    gsap.set(boxes, { clearProps: "--f" });
    gsap.set(checks, { clearProps: "strokeDashoffset,strokeDasharray" });
  };
}
