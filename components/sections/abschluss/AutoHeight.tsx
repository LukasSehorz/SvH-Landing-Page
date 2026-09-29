"use client";

import { useRef, useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { useIsoLayoutEffect } from "@/lib/hooks";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Behälter, der seine Höhe weich an den Inhalt anpasst (Schrittwechsel,
 * Fehlermeldungen, Ergebnis). Im Server-HTML steht die Höhe auf „auto“;
 * die erste Messung wird ohne Animation übernommen.
 */
export default function AutoHeight({
  children,
  instant = false,
  className = "",
}: Readonly<{ children: ReactNode; instant?: boolean; className?: string }>) {
  const inner = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<{ h: number | "auto"; anim: boolean }>({ h: "auto", anim: false });

  useIsoLayoutEffect(() => {
    const el = inner.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const h = el.offsetHeight;
      setBox((b) => (b.h === h ? b : { h, anim: b.h !== "auto" }));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <motion.div
      className={`autoh ${className}`}
      initial={false}
      animate={{ height: box.h }}
      transition={instant || !box.anim ? { duration: 0 } : { duration: 0.5, ease: EASE }}
    >
      <div ref={inner} className="autoh-in">
        {children}
      </div>
    </motion.div>
  );
}
