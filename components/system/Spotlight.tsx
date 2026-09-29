"use client";

import { useEffect } from "react";

/** Maus-Spotlight für alle Glaskarten: ein einziger Zuhörer für die ganze Seite. */
export default function Spotlight() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let last: HTMLElement | null = null;
    let raf = 0;
    let ev: PointerEvent | null = null;
    const apply = () => {
      raf = 0;
      if (!ev) return;
      const el = (ev.target as HTMLElement | null)?.closest?.<HTMLElement>(".glass") ?? null;
      if (last && last !== el) last.style.setProperty("--so", "0");
      if (el) {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--sx", `${ev.clientX - r.left}px`);
        el.style.setProperty("--sy", `${ev.clientY - r.top}px`);
        el.style.setProperty("--so", "1");
      }
      last = el;
    };
    const onMove = (e: PointerEvent) => {
      ev = e;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);
  return null;
}
