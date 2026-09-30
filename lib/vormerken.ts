"use client";

/* Zeitfresser vormerken: Wer im Schalter eine Aufgabe als „kenne ich“
   markiert, findet sie im Formular (Schritt 1) schon ausgewählt.
   Gespeichert wird nur im sessionStorage dieses Tabs, nichts verlässt das Gerät.
   Die Namen müssen exakt den Kacheln in copy.ts (abschluss.step1.tiles) entsprechen. */

export const VORMERK_EVENT = "svh:vormerken";
const KEY = "svh-vorgemerkt";
// Rückfall im Speicher, falls sessionStorage gesperrt ist (privater Modus o. Ä.)
let memory: string[] | null = null;

export function getVorgemerkt(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.sessionStorage.getItem(KEY);
    const list = raw ? (JSON.parse(raw) as unknown) : memory ?? [];
    return Array.isArray(list) ? list.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return memory ?? [];
  }
}

function save(list: string[]): void {
  memory = list;
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* Privater Modus o. Ä.: dann gilt die Vormerkung nur bis zum Neuladen */
  }
  window.dispatchEvent(new CustomEvent(VORMERK_EVENT, { detail: list }));
}

/* Setzt oder entfernt eine Aufgabe. Gibt den neuen Zustand zurück. */
export function toggleVorgemerkt(tile: string, on?: boolean): boolean {
  if (typeof window === "undefined") return false;
  const list = getVorgemerkt();
  const has = list.includes(tile);
  const next = on ?? !has;
  if (next && !has) save([...list, tile]);
  if (!next && has) save(list.filter((t) => t !== tile));
  return next;
}

export function isVorgemerkt(tile: string): boolean {
  return getVorgemerkt().includes(tile);
}
