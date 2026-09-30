"use client";

import { ScrollTrigger } from "gsap/ScrollTrigger";

/* Gemeinsamer, entprellter ScrollTrigger.refresh().
   Jeder direkte refresh() erzwingt ein Layout der ganzen Seite. Sektionen
   rufen deshalb nur requestRefresh() auf; mehrere Aufrufe kurz hintereinander
   werden zu einem einzigen refresh() zusammengefasst. */

let timer: number | null = null;

export function requestRefresh(delay = 150): void {
  if (typeof window === "undefined") return;
  if (timer !== null) window.clearTimeout(timer);
  timer = window.setTimeout(() => {
    timer = null;
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, delay);
}
