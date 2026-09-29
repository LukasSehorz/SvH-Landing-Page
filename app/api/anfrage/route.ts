/*
 * Versand des Formulars „KI-Workshop sichern“ (portiert von der alten Seite).
 *
 * Jede Anfrage geht an lukas.sehorz@svhconsult.de (content.ts), beim Hoster
 * über ANFRAGE_EMPFAENGER übersteuerbar. Verschickt wird über Resend; der
 * Schlüssel existiert NUR als Umgebungsvariable RESEND_API_KEY.
 *
 * Fehlt der Schlüssel, antwortet der Handler mit 503 und dem Grund
 * „kein-versand“. Das Formular öffnet dann das E-Mail-Programm des Besuchers
 * mit der fertigen Nachricht. So steht nie eine Erfolgsmeldung ohne Versand.
 */

import { NextResponse } from "next/server";
import { company } from "../../content";
import { betreff, htmlFassung, lesen, pruefen, textFassung } from "./format";

/* Absender wie auf der alten Seite. Resend nimmt ihn erst an, wenn die Domain
   svhconsult.de dort bestätigt ist; über ANFRAGE_ABSENDER übersteuerbar. */
const ABSENDER_VORGABE = "SvH Consulting <resend@svhconsult.de>";
const MAX_BYTES = 24_000;

export async function POST(request: Request) {
  let roh: string;
  try {
    roh = await request.text();
  } catch {
    return NextResponse.json({ ok: false, grund: "eingabe" }, { status: 400 });
  }
  if (roh.length > MAX_BYTES) {
    return NextResponse.json({ ok: false, grund: "eingabe" }, { status: 413 });
  }

  let eingabe: ReturnType<typeof lesen>;
  try {
    eingabe = lesen(JSON.parse(roh));
  } catch {
    return NextResponse.json({ ok: false, grund: "eingabe" }, { status: 400 });
  }

  /* Das Feld „website“ ist für Menschen unsichtbar. Füllt ein Programm es aus,
     tun wir so, als wäre alles gut, und verschicken nichts. */
  if (eingabe.website) {
    return NextResponse.json({ ok: true });
  }

  const felder = pruefen(eingabe);
  if (felder.length) {
    return NextResponse.json({ ok: false, grund: "eingabe", felder }, { status: 400 });
  }

  const schluessel = process.env.RESEND_API_KEY;
  if (!schluessel) {
    return NextResponse.json({ ok: false, grund: "kein-versand" }, { status: 503 });
  }

  const empfaenger = process.env.ANFRAGE_EMPFAENGER || company.email;
  const absender = process.env.ANFRAGE_ABSENDER || ABSENDER_VORGABE;

  try {
    const antwort = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${schluessel}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: absender,
        to: [empfaenger],
        reply_to: eingabe.email,
        subject: betreff(eingabe),
        text: textFassung(eingabe),
        html: htmlFassung(eingabe),
      }),
    });

    if (!antwort.ok) {
      console.error("Resend hat den Versand abgelehnt", antwort.status, await antwort.text());
      return NextResponse.json({ ok: false, grund: "versand" }, { status: 502 });
    }

    // Kennung der Mail bei Resend (verrät nichts über den Inhalt, hilft beim Nachsehen der Zustellung)
    const daten = (await antwort.json().catch(() => null)) as { id?: string } | null;
    return NextResponse.json({ ok: true, id: daten?.id ?? null });
  } catch (fehler) {
    console.error("Versand fehlgeschlagen", fehler);
    return NextResponse.json({ ok: false, grund: "versand" }, { status: 502 });
  }
}
