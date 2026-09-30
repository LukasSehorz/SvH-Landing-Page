"use client";

/* Brücke zwischen Anker-Sprung (SmoothScroll) und Einblendungen (Reveals):
   Am Ziel eines Sprungs wird nichts mehr eingeblendet, alles steht sofort. */

type Revealer = (root: Element) => void;
const revealers = new Set<Revealer>();

export function registerRevealer(fn: Revealer): () => void {
  revealers.add(fn);
  return () => {
    revealers.delete(fn);
  };
}

export function revealWithin(root: Element): void {
  revealers.forEach((fn) => fn(root));
}
