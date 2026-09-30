"use client";

/* ====================================================================
   Zeitplanung für Arbeit, die nicht in den Lade- oder Hydrations-Task gehört
   (Bau-Runde 7, Leistung mobil).

   Hintergrund: Lighthouse mobil rechnet mit vierfach gebremster CPU und zählt
   jede Aufgabe über 50 ms als Blockierzeit (TBT). Teuer ist vor allem Messen
   (getBoundingClientRect, offsetHeight, innerHeight, GSAP-Startwerte), solange
   gerade geschrieben wurde: Dann muss der Browser mitten im Skript Stil und
   Layout der ganzen Seite neu berechnen. Nach einem gezeichneten Bild ist das
   Layout frisch und Messen kostet fast nichts.
   ==================================================================== */

/** Nach dem nächsten gezeichneten Bild, in einem eigenen Task (Layout ist dann frisch). */
export function afterPaint(cb: () => void): () => void {
  let t = 0;
  const raf = requestAnimationFrame(() => {
    t = window.setTimeout(cb, 0);
  });
  return () => {
    cancelAnimationFrame(raf);
    window.clearTimeout(t);
  };
}

/**
 * Nach dem Laden der Seite (spätestens `maxWait` ms nach dem Aufruf, falls große Bilder das
 * load-Ereignis hinauszögern) im Leerlauf, dort spätestens nach `timeout` ms.
 * Safari kennt kein requestIdleCallback: dann nach einer kurzen Pause.
 */
export function whenIdle(cb: () => void, timeout = 1200, maxWait = 2500): () => void {
  let idle = 0;
  let t = 0;
  let started = false;
  let dead = false;
  const ric = typeof window.requestIdleCallback === "function";
  const go = () => {
    if (dead || started) return;
    started = true;
    window.clearTimeout(cap);
    window.removeEventListener("load", go);
    if (ric) idle = window.requestIdleCallback(() => cb(), { timeout });
    else t = window.setTimeout(cb, 120);
  };
  const cap = window.setTimeout(go, maxWait);
  if (document.readyState === "complete") go();
  else window.addEventListener("load", go, { once: true });
  return () => {
    dead = true;
    window.clearTimeout(cap);
    window.removeEventListener("load", go);
    if (ric && idle) window.cancelIdleCallback(idle);
    window.clearTimeout(t);
  };
}
