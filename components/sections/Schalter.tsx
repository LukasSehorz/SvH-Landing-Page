"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { schalter } from "@/app/copy";
import Rich from "@/components/system/Rich";
import { prefersReducedMotion } from "@/lib/hooks";
import Scene from "./SchalterScenes";

/* ====================================================================
   „Der Schalter“: Ohne KI / Mit KI. Im Server-HTML steht „Mit KI“
   (Endzustand). Mit Bewegung springt er vor dem Eintritt auf „Ohne KI“
   und legt sich beim ersten Sichtkontakt nach kurzer Pause selbst um.
   ==================================================================== */

const SPRING = { type: "spring", stiffness: 520, damping: 32, mass: 0.9 } as const;

export default function Schalter() {
  const [on, setOn] = useState(true);
  const [play, setPlay] = useState(false);
  const touched = useRef(false);
  const section = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const reduced = prefersReducedMotion();
    let timer = 0;
    if (!reduced && el.getBoundingClientRect().top > window.innerHeight * 0.6) setOn(false);
    const auto = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        auto.disconnect();
        if (reduced || touched.current) return;
        timer = window.setTimeout(() => {
          if (!touched.current) setOn(true);
        }, 900);
      },
      { threshold: 0.35 },
    );
    auto.observe(el);
    // Mini-Szenen nur abspielen, solange sichtbar
    const vis = new IntersectionObserver(([e]) => setPlay(e.isIntersecting && !reduced), { rootMargin: "100px" });
    vis.observe(el);
    return () => {
      auto.disconnect();
      vis.disconnect();
      window.clearTimeout(timer);
    };
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
          <div className="sw-bar">
            <div className="sw-switchwrap">
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

        <ul className="sw-grid">
          {schalter.cards.map((c, i) => (
            <li key={c.id} className="sw-card glass" style={{ "--i": i } as React.CSSProperties} data-reveal="">
              <div className="sw-stage">
                <Scene id={c.id} />
              </div>
              <div className="sw-row">
                <h3 className="h3">{c.title}</h3>
                <span className="sw-kpi" aria-live="polite">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={on ? "on" : "off"}
                      className="sw-kpi-in"
                      initial={{ y: 16, opacity: 0, filter: "blur(4px)" }}
                      animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                      exit={{ y: -16, opacity: 0, filter: "blur(4px)" }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
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
            </li>
          ))}
        </ul>
        <p className="sw-note small" data-reveal="">
          {schalter.note}
        </p>
      </div>
    </section>
  );
}
