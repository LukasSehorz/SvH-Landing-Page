"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import { motion } from "motion/react";
import Rich from "@/components/system/Rich";
import { useIsoLayoutEffect, useMotionMode } from "@/lib/hooks";

/*
 * Aufklapp-Liste: immer nur eine Frage offen, weiche Höhenanimation (Motion).
 * Im Server-HTML (und ohne JavaScript) stehen alle Antworten offen, damit sie
 * lesbar sind. Erst im Browser klappt die Liste zu, nur die erste bleibt offen.
 * Tastatur: Enter/Leertaste öffnen, Pfeil hoch/runter, Pos1/Ende springen.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

type Item = { q: string; a: string };

export default function FragenListe({ items }: Readonly<{ items: readonly Item[] }>) {
  const uid = useId().replace(/:/g, "");
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState<number | null>(0);
  const mode = useMotionMode();
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  useIsoLayoutEffect(() => setReady(true), []);

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const n = items.length;
    let to = -1;
    if (e.key === "ArrowDown") to = (i + 1) % n;
    else if (e.key === "ArrowUp") to = (i - 1 + n) % n;
    else if (e.key === "Home") to = 0;
    else if (e.key === "End") to = n - 1;
    if (to < 0) return;
    e.preventDefault();
    buttons.current[to]?.focus();
  };

  const duration = mode === "reduced" ? 0 : 0.5;

  return (
    <ul className="faq-list">
      {items.map((it, i) => {
        const isOpen = !ready || open === i;
        const qId = `faq-${uid}-q${i}`;
        const aId = `faq-${uid}-a${i}`;
        return (
          <li key={it.q} className="faq-item" data-open={isOpen ? "true" : "false"}>
            <h3 className="faq-h">
              <button
                ref={(el) => {
                  buttons.current[i] = el;
                }}
                type="button"
                id={qId}
                className="faq-q"
                aria-expanded={isOpen}
                aria-controls={aId}
                onClick={() => setOpen((o) => (o === i ? null : i))}
                onKeyDown={(e) => onKey(e, i)}
              >
                <span className="faq-num" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="faq-q-text">{it.q}</span>
                <span className="faq-icon" aria-hidden="true" />
              </button>
            </h3>
            {ready ? (
              <motion.div
                id={aId}
                role="region"
                aria-labelledby={qId}
                className="faq-a"
                initial={false}
                animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                transition={{ height: { duration, ease: EASE }, opacity: { duration: duration * 0.7, ease: EASE } }}
                inert={!isOpen}
              >
                <p className="faq-a-in">
                  <Rich text={it.a} />
                </p>
              </motion.div>
            ) : (
              <div id={aId} role="region" aria-labelledby={qId} className="faq-a">
                <p className="faq-a-in">
                  <Rich text={it.a} />
                </p>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
