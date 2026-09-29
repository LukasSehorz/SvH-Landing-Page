"use client";

import { useRef, useState } from "react";
import { animate } from "motion/react";
import { useIsoLayoutEffect } from "@/lib/hooks";

const fmt = (n: number) => Math.round(n).toLocaleString("de-DE");

/**
 * Zahl, die bei Änderung weich zum neuen Wert zählt.
 * React schreibt nur den Startwert; danach setzt die Animation den Text direkt.
 */
export default function Zahl({ value, reduced = false }: Readonly<{ value: number; reduced?: boolean }>) {
  const ref = useRef<HTMLSpanElement>(null);
  const shown = useRef(value);
  const [initial] = useState(() => fmt(value));

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced || shown.current === value) {
      shown.current = value;
      el.textContent = fmt(value);
      return;
    }
    const ctrl = animate(shown.current, value, {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        shown.current = v;
        el.textContent = fmt(v);
      },
    });
    return () => ctrl.stop();
  }, [value, reduced]);

  return (
    <span ref={ref} className="tnum">
      {initial}
    </span>
  );
}
