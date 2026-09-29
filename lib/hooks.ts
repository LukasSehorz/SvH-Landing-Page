"use client";

import { useEffect, useLayoutEffect, useState, type RefObject } from "react";

export const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Bewegungsmodus ohne Hydrations-Sprung:
 * Server und erster Client-Durchlauf liefern "static" (Endzustand),
 * danach "motion" oder "reduced".
 */
export function useMotionMode(): "static" | "motion" | "reduced" {
  const [mode, setMode] = useState<"static" | "motion" | "reduced">("static");
  useIsoLayoutEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const set = () => setMode(mq.matches ? "reduced" : "motion");
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);
  return mode;
}

export function useMediaQuery(query: string, fallback = false): boolean {
  const [match, setMatch] = useState(fallback);
  useIsoLayoutEffect(() => {
    const mq = window.matchMedia(query);
    const set = () => setMatch(mq.matches);
    set();
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
 */
export function useEntrance(ref: RefObject<Element | null>, threshold = 0.25): "static" | "hidden" | "shown" {
  const [state, setState] = useState<"static" | "hidden" | "shown">("static");
  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const top = el.getBoundingClientRect().top;
    if (top < window.innerHeight * 0.9) return;
    setState("hidden");
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setState("shown");
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold]);
  return state;
}
