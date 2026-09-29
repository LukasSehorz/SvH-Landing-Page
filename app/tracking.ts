/**
 * Kennung des Google Tag Manager, an genau einer Stelle (von der alten Seite).
 * Geladen wird er erst nach Klick auf „Einverstanden“ (siehe Consent.tsx).
 */
export const GTM_ID = "GTM-M5C85RXB";

export function istGueltigeGtmId(id: string): boolean {
  return /^GTM-[A-Z0-9]{6,8}$/.test(id);
}

if (!istGueltigeGtmId(GTM_ID)) {
  throw new Error(`Die Kennung des Tag Manager sieht falsch aus: "${GTM_ID}".`);
}

/** Search-Console-Kennzeichen; leer = wird nicht gesetzt. */
export const SEARCH_CONSOLE_ID = "";

/** Schlüssel, unter dem die Entscheidung im Browser liegt (wie alt). */
export const CONSENT_KEY = "svh-einwilligung";

export type Einwilligung = "alle" | "notwendig";
