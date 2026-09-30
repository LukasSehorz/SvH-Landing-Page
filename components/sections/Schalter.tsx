"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cta, schalter } from "@/app/copy";
import Cta from "@/components/system/Cta";
import Rich from "@/components/system/Rich";
import { Check } from "@/components/system/Icons";
import { prefersReducedMotion } from "@/lib/hooks";
import { getVorgemerkt, toggleVorgemerkt, VORMERK_EVENT } from "@/lib/vormerken";
import Scene from "./SchalterScenes";

/* ====================================================================
   „Der Schalter“: Ohne KI / Mit KI. Im Server-HTML steht „Mit KI“
   (Endzustand). Mit Bewegung springt er vor dem Eintritt auf „Ohne KI“
   und legt sich beim ersten Sichtkontakt mit dem Schalter selbst um.
   Je Karte „Das kenne ich“: merkt die Aufgabe für das Formular vor.
   Mobil: wischbare Kartenreihe mit Einrasten und angeschnittener Folgekarte.
   ==================================================================== */

// Knopf gleitet ruhig um (fast kritisch gedämpft, kein Nachschwingen; vorher 520/32 ≈ 0,2 s, wirkte wie ein Schnappen)
const SPRING = { type: "spring", stiffness: 260, damping: 30, mass: 1 } as const;

function Vormerken({ id }: { id: string }) {
  const tile = schalter.kachel[id];
  const [on, setOn] = useState(false);
  const [hint, setHint] = useState(false);
  useEffect(() => {
    const sync = () => setOn(getVorgemerkt().includes(tile));
    sync();
    window.addEventListener(VORMERK_EVENT, sync);
    return () => window.removeEventListener(VORMERK_EVENT, sync);
  }, [tile]);
  useEffect(() => {
    if (!hint) return;
    const t = window.setTimeout(() => setHint(false), 2600);
    return () => window.clearTimeout(t);
  }, [hint]);
  return (
    <div className="sw-mark">
      <button
        type="button"
        className="sw-mark-btn"
        aria-pressed={on}
        onClick={() => {
          const next = toggleVorgemerkt(tile);
          setOn(next);
          setHint(next);
        }}
      >
        <span className="sw-mark-box" aria-hidden="true">
          {on ? <Check size={13} /> : null}
        </span>
        {on ? schalter.vorgemerkt : schalter.kenne}
      </button>
      <span className="sw-mark-hint" role="status" data-show={hint ? "true" : "false"}>
        {hint ? schalter.hinweis : ""}
      </span>
    </div>
  );
}

export default function Schalter() {
  const [on, setOn] = useState(true);
  const [play, setPlay] = useState(false);
  const [page, setPage] = useState(0);
  const touched = useRef(false);
  const section = useRef<HTMLElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);

  // Mitlaufendes Band (nur Tablet): deckend, sobald es oben klebt; am Sektionsende blendet es aus
  useEffect(() => {
    const b = bar.current;
    const sec = section.current;
    if (!b || !sec) return;
    let raf = 0;
    let late = 0;
    const check = () => {
      raf = 0;
      if (getComputedStyle(b).position !== "sticky") {
        b.removeAttribute("data-stuck");
        b.removeAttribute("data-leaving");
        return;
      }
      const top = parseFloat(getComputedStyle(b).top) || 0;
      const r = b.getBoundingClientRect();
      const bottom = sec.getBoundingClientRect().bottom;
      b.toggleAttribute("data-stuck", r.top <= top + 1 && bottom > r.bottom + 8);
      b.toggleAttribute("data-leaving", bottom < r.bottom + 160);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
      window.clearTimeout(late);
      late = window.setTimeout(check, 700);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    b.addEventListener("transitionend", onScroll);
    check();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      b.removeEventListener("transitionend", onScroll);
      cancelAnimationFrame(raf);
      window.clearTimeout(late);
    };
  }, []);

  useEffect(() => {
    const el = section.current;
    const sw = bar.current;
    if (!el || !sw) return;
    const reduced = prefersReducedMotion();
    let timer = 0;
    if (!reduced && el.getBoundingClientRect().top > window.innerHeight * 0.6) setOn(false);
    // Auslöser: der Schalter selbst im mittleren Bildbereich (greift auch quer und in Safari)
    const auto = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        auto.disconnect();
        if (reduced || touched.current) return;
        timer = window.setTimeout(() => {
          if (!touched.current) setOn(true);
        }, 800);
      },
      { rootMargin: "0px 0px -35% 0px", threshold: 0 },
    );
    auto.observe(sw);
    // Mini-Szenen nur abspielen, solange sichtbar
    const vis = new IntersectionObserver(([e]) => setPlay(e.isIntersecting && !reduced), { rootMargin: "100px" });
    vis.observe(el);
    return () => {
      auto.disconnect();
      vis.disconnect();
      window.clearTimeout(timer);
    };
  }, []);

  // Wischreihe (mobil): aktuelle Karte für die Punkte
  useEffect(() => {
    const t = track.current;
    if (!t) return;
    const cards = Array.from(t.children);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && e.intersectionRatio > 0.6) setPage(cards.indexOf(e.target));
        });
      },
      { root: t, threshold: [0.6] },
    );
    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);

  const set = (v: boolean) => {
    touched.current = true;
    setOn(v);
  };

  return (
    <section className="section sw" id="alltag" ref={section} aria-labelledby="sw-title" data-on={on ? "true" : "false"} data-play={play ? "true" : "false"}>
      <div className="shell">
        <div className="sw-head">
          <div>
            <p className="label" data-reveal="">
              {schalter.label}
            </p>
            <h2 className="h2 sw-title" id="sw-title" data-split="">
              <Rich text={schalter.title} />
            </h2>
          </div>
          <div className="sw-bar" ref={bar}>
            <div className="sw-switchwrap" data-reveal="">
              <button type="button" className="sw-side" data-active={!on} onClick={() => set(false)} tabIndex={-1} aria-hidden="true">
                {schalter.off}
              </button>
              <button type="button" role="switch" aria-checked={on} aria-label={schalter.switchLabel} className="sw-switch" onClick={() => set(!on)}>
                <span className="sw-track-glow" aria-hidden="true" />
                <motion.span className="sw-knob" layout transition={SPRING} aria-hidden="true">
                  <span className="sw-knob-dot" />
                </motion.span>
              </button>
              <button type="button" className="sw-side" data-active={on} onClick={() => set(true)} tabIndex={-1} aria-hidden="true">
                {schalter.on}
              </button>
            </div>
          </div>
        </div>

        <ul className="sw-grid" ref={track} aria-label={schalter.karten}>
          {schalter.cards.map((c, i) => (
            <li key={c.id} className="sw-card glass" style={{ "--i": i } as React.CSSProperties} data-reveal="">
              <div className="sw-stage">
                <Scene id={c.id} />
              </div>
              <div className="sw-row">
                <h3 className="h3">{c.title}</h3>
                <span className="sw-kpi">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={on ? "on" : "off"}
                      className="sw-kpi-in"
                      initial={{ y: 14, opacity: 0 }}
                      animate={{ y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1], delay: 0.22 } }}
                      exit={{ y: -14, opacity: 0, transition: { duration: 0.24, ease: [0.4, 0, 1, 1] } }}
                    >
                      {on ? c.kpiOn : c.kpiOff}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </div>
              <div className="sw-texts">
                <p className="body" data-v="off" aria-hidden={on}>
                  <Rich text={c.off} />
                </p>
                <p className="body" data-v="on" aria-hidden={!on}>
                  <Rich text={c.on} />
                </p>
              </div>
              <Vormerken id={c.id} />
            </li>
          ))}
        </ul>
        <div className="sw-dots" aria-hidden="true">
          {schalter.cards.map((c, i) => (
            <i key={c.id} data-on={i === page ? "true" : "false"} />
          ))}
        </div>
        <p className="sw-note" data-reveal="">
          {schalter.note}
        </p>
        <div className="sw-cta" data-reveal="">
          <Cta href="#termin" className="btn-block-m">
            {cta.main}
          </Cta>
        </div>
      </div>
    </section>
  );
}
