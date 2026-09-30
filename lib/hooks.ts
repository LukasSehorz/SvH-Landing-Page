"use client";

import { startTransition, useEffect, useLayoutEffect, useState, type RefObject } from "react";

export const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Bewegungsmodus ohne Hydrations-Sprung:
 * Server und erster Client-Durchlauf liefern "static" (Endzustand),
 * danach "motion" oder "reduced".
 * Der erste Wechsel läuft als Transition: sonst rendert React alle betroffenen
 * Sektionen (u. a. die Chaos-Szene) synchron im Hydrations-Task mit (lange Aufgabe).
 * Zu sehen war bis dahin ohnehin das Server-HTML, also derselbe Endzustand.
 */
export function useMotionMode(): "static" | "motion" | "reduced" {
  const [mode, setMode] = useState<"static" | "motion" | "reduced">("static");
  useIsoLayoutEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const set = () => setMode(mq.matches ? "reduced" : "motion");
    startTransition(set);
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);
  return mode;
}

/** Medienabfrage; der erste Wert kommt wie bei useMotionMode als Transition (nicht im Hydrations-Task). */
export function useMediaQuery(query: string, fallback = false): boolean {
  const [match, setMatch] = useState(fallback);
  useIsoLayoutEffect(() => {
    const mq = window.matchMedia(query);
    const set = () => setMatch(mq.matches);
    startTransition(set);
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, [query]);
  return match;
}

/** Wahr, solange das Element (mit Rand) im Bild ist. */
export function useInView(ref: RefObject<Element | null>, rootMargin = "0px", threshold = 0): boolean {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin, threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin, threshold]);
  return inView;
}

/**
 * Auftritt eines Elements:
 * "static" = Server/ohne Bewegung (Endzustand), "hidden" = wartet unterhalb des Bildes,
 * "shown" = ist eingetreten (Animation läuft). Liegt das Element beim Laden schon im Bild,
 * bleibt es beim Endzustand, damit nichts aufblitzt.
 * Die Lage liefert der erste Rückruf des Beobachters (nach dem ersten Bild, ohne erzwungenes
 * Layout); ein Element darunter ist in diesem einen Bild ohnehin nicht zu sehen.
 */
export function useEntrance(ref: RefObject<Element | null>, threshold = 0.25): "static" | "hidden" | "shown" {
  const [state, setState] = useState<"static" | "hidden" | "shown">("static");
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    let first = true;
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (first) {
          first = false;
          const vh = e.rootBounds?.height ?? window.innerHeight;
          if (e.boundingClientRect.top < vh * 0.9) {
            io.disconnect();
            return;
          }
          setState("hidden");
          // schon zum Teil sichtbar: erst ein Bild im Startzustand, dann loslaufen
          if (e.isIntersecting) {
            io.disconnect();
            raf = requestAnimationFrame(() => (raf = requestAnimationFrame(() => setState("shown"))));
          }
          return;
        }
        if (e.isIntersecting) {
          setState("shown");
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [ref, threshold]);
  return state;
}
