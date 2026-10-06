import type { CSSProperties } from "react";
import { cta } from "@/app/copy";
import { leistungenB } from "@/app/copy-b";
import Cta from "@/components/system/Cta";
import { Grad, Pfeil, stufe } from "./ui";

/* „Unsere Leistungen“ 0–4 als Unendlichkeitszeichen (Vorbild: andreasbaulig.de), aber geschlossen:
   ein Band ohne Enden, die vier Farben gehen fließend ineinander über.
   Auf dem Band laufen die Stufen 1–4: 1 oben links, 2 unten rechts, 3 oben rechts, 4 unten links
   (so läuft das Band auch). Die 0 (KI-Workshop) sitzt als Start-Knopf auf der Kreuzung in der Mitte.
   Karten im Prinzip von „Unsere Haupt-Angebote“ (Apex): hell, feiner Rand, farbiger Schimmer in einer Ecke.
   Form: Lemniskate von Bernoulli, etwas höher gezogen. Alles wird auf dem Server berechnet. */

const W = 1000;
const H = 600;
const CX = W / 2;
const CY = H / 2;
const A = 420; // halbe Breite
const STRECK = 1.45; // Schleifen höher ziehen
const BAND = 86; // Bandbreite (Handy: dicker per CSS)
const N = 480; // Stützpunkte

// Beschriftung auf dem Band: am Computer und (größer) am Handy
// frei: Abstand zur Mitte (dort sitzt der Start-Knopf), luecke: zwischen Nummer und Wort
type Masse = { schrift: number; r: number; frei: number; luecke: number };
const GROSS: Masse = { schrift: 30, r: 19, frei: 100, luecke: 11 };
const KLEIN: Masse = { schrift: 40, r: 24, frei: 132, luecke: 13 };
const SPITZE = 40; // Mindestabstand zur Spitze einer Schleife

// Farben der vier Abschnitte (Markenfamilie Blau → Lila), weiße Schrift bleibt lesbar
const FARBEN = ["#2f6bff", "#4f46e5", "#7c3aed", "#a855f7"];

type P = { x: number; y: number };

function punkt(t: number): P {
  const s = Math.sin(t);
  const c = Math.cos(t);
  const d = 1 + s * s;
  return { x: CX + (A * c) / d, y: CY + ((A * s * c) / d) * STRECK };
}

/* Das Band läuft von der linken Spitze (t = π) rückwärts:
   1 links oben → Mitte → 2 rechts unten → rechte Spitze → 3 rechts oben → Mitte → 4 links unten → zurück. */
const tVon = (g: number) => Math.PI - (g * Math.PI) / 2; // g ∈ [0, 4]

const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const rgba = (h: string, a: number) => `rgba(${hex(h).join(",")},${a})`;
function mische(a: string, b: string, w: number) {
  const x = hex(a);
  const y = hex(b);
  return `rgb(${x.map((v, i) => Math.round(v + (y[i] - v) * w)).join(",")})`;
}
const weich = (e0: number, e1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};
function farbeBei(g: number) {
  const k = Math.floor(g) % 4;
  return mische(FARBEN[k], FARBEN[(k + 1) % 4], weich(0.62, 1, g - Math.floor(g)));
}

const pfad = (pts: P[]) => pts.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join("");

// Kleine Stücke mit Farbverlauf entlang des Bandes (leicht überlappend: keine Haarlinien)
const STUECKE = Array.from({ length: N }, (_, i) => {
  const g0 = (i / N) * 4;
  const g1 = ((i + 1.6) / N) * 4;
  return { d: pfad([punkt(tVon(g0)), punkt(tVon((g0 + g1) / 2)), punkt(tVon(g1))]), farbe: farbeBei((g0 + g1) / 2) };
});
const UMRISS_PUNKTE = Array.from({ length: N + 1 }, (_, i) => punkt(tVon((i / N) * 4)));
const UMRISS = pfad(UMRISS_PUNKTE);
// Gesamtlänge des Bandes: für den Lichtimpuls, der endlos durch das Zeichen läuft
const UMFANG = UMRISS_PUNKTE.reduce((s, p, i) => (i ? s + Math.hypot(p.x - UMRISS_PUNKTE[i - 1].x, p.y - UMRISS_PUNKTE[i - 1].y) : 0), 0);

function laengen(pts: P[]) {
  const l = [0];
  for (let i = 1; i < pts.length; i++) l.push(l[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
  return l;
}
function beiLaenge(pts: P[], l: number[], s: number): P {
  const i = Math.max(1, l.findIndex((v) => v >= s));
  const f = (s - l[i - 1]) / (l[i] - l[i - 1] || 1);
  return { x: pts[i - 1].x + (pts[i].x - pts[i - 1].x) * f, y: pts[i - 1].y + (pts[i].y - pts[i - 1].y) * f };
}

// 0 ist der Start in der Mitte, auf dem Band laufen nur 1–4
const START = leistungenB.teile.find((t) => t.nr === 0) ?? leistungenB.teile[0];
const STUFEN = leistungenB.teile.filter((t) => t.nr > 0).slice(0, 4);
const START_VERLAUF = `linear-gradient(135deg, ${FARBEN[0]}, ${FARBEN[3]})`;

const ABSCHNITTE = STUFEN.map((teil, k) => {
  const pts = Array.from({ length: 121 }, (_, i) => punkt(tVon(k + i / 120)));
  const lesbar = pts[pts.length - 1].x >= pts[0].x ? pts : [...pts].reverse(); // Schrift nie kopfüber
  const l = laengen(lesbar);
  const L = l[l.length - 1];
  const vonMitte = Math.hypot(lesbar[0].x - CX, lesbar[0].y - CY) < 1; // Lesrichtung beginnt an der Kreuzung
  // Scheitel der Schleife (höchster bzw. tiefster Punkt): dort liegt das Band am flachsten
  const ys = lesbar.map((q) => q.y);
  const scheitel = l[ys.indexOf(k === 0 || k === 2 ? Math.min(...ys) : Math.max(...ys))];
  // Wort mittig auf dem Scheitel, Nummer davor; an der Kreuzung Platz für den Start-Knopf lassen
  const beschriftung = (m: Masse) => {
    const breite = teil.kurz.length * m.schrift * 0.58;
    let wort = scheitel - breite / 2;
    const ende = vonMitte ? L - SPITZE : L - m.frei;
    const anfang = vonMitte ? m.frei : SPITZE;
    wort = Math.min(wort, ende - breite);
    wort = Math.max(wort, anfang + 2 * m.r + m.luecke);
    return { nummer: beiLaenge(lesbar, l, wort - m.luecke - m.r), wort, m };
  };
  const oben = k === 0 || k === 2;
  const links = k === 0 || k === 3;
  // kurzer, geschwungener Pfeil von der äußeren Schulter des Bandes zur Karte daneben (nur am Computer)
  const g = k + (oben ? 0.24 : 0.76); // Schulter: zwischen Spitze und Scheitel
  const p0 = punkt(tVon(g - 0.01));
  const p1 = punkt(tVon(g + 0.01));
  const auf = punkt(tVon(g));
  let nx = -(p1.y - p0.y);
  let ny = p1.x - p0.x;
  const nl = Math.hypot(nx, ny) || 1;
  nx /= nl;
  ny /= nl;
  if (nx * (links ? -1 : 1) < 0) {
    nx = -nx;
    ny = -ny;
  }
  const sx = auf.x + nx * (BAND / 2 + 12);
  const sy = auf.y + ny * (BAND / 2 + 12);
  const ex = sx + (links ? -54 : 54);
  const ey = sy + (oben ? -26 : 30);
  const pfeil = `M${sx.toFixed(1)} ${sy.toFixed(1)}Q${(sx + (links ? -4 : 4)).toFixed(1)} ${ey.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`;
  return {
    teil,
    farbe: FARBEN[k],
    textPfad: pfad(lesbar),
    gross: beschriftung(GROSS),
    klein: beschriftung(KLEIN),
    pfeil,
    id: `lm-${k}`,
    lage: `${oben ? "o" : "u"}${links ? "l" : "r"}`,
  };
});

type Abschnitt = (typeof ABSCHNITTE)[number];

function Beschriftung({ a, b, klasse }: { a: Abschnitt; b: Abschnitt["gross"]; klasse: string }) {
  return (
    <g className={klasse} style={{ fontSize: b.m.schrift } as CSSProperties}>
      <text className="um-band-text" dy="0.35em">
        <textPath href={`#${a.id}`} startOffset={b.wort.toFixed(1)}>
          {a.teil.kurz}
        </textPath>
      </text>
      <circle cx={b.nummer.x} cy={b.nummer.y} r={b.m.r} fill="#fff" />
      <text x={b.nummer.x} y={b.nummer.y} dy="0.36em" textAnchor="middle" className="um-nummer" fill={a.farbe} style={{ fontSize: b.m.r * 1.16 }}>
        {a.teil.nr}
      </text>
    </g>
  );
}

const ARIA = `Unendlichkeitszeichen. In der Mitte der Start: ${START.nr} ${START.titel}. Danach laufen vier Stufen im Kreis: ${STUFEN.map((t) => `${t.nr} ${t.kurz}`).join(", ")}.`;

function Zeichen() {
  return (
    <svg className="um-svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={ARIA}>
      <defs>
        <filter id="um-schatten" x="-10%" y="-10%" width="120%" height="130%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
        <marker id="um-spitze" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0L10 5L0 10" fill="none" stroke="#0b0b0e" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </marker>
        {ABSCHNITTE.map((a) => (
          <path key={a.id} id={a.id} d={a.textPfad} />
        ))}
      </defs>

      <path d={UMRISS} className="um-schatten" fill="none" stroke="rgba(60,40,180,0.28)" strokeWidth={BAND} transform="translate(0 16)" filter="url(#um-schatten)" />
      <g className="um-band">
        {STUECKE.map((s, i) => (
          <path key={i} d={s.d} fill="none" stroke={s.farbe} strokeWidth={BAND} strokeLinecap="butt" strokeLinejoin="round" />
        ))}
      </g>
      <path d={UMRISS} className="um-glanz" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth={BAND * 0.18} transform={`translate(0 ${-BAND * 0.22})`} />
      {/* Lichtimpuls, der das Band entlangläuft (zeigt: alles greift ineinander) */}
      <path
        d={UMRISS}
        className="um-impuls"
        fill="none"
        stroke="#fff"
        strokeWidth={BAND * 0.42}
        strokeLinecap="round"
        style={{ "--l": UMFANG.toFixed(0), strokeDasharray: `${(UMFANG * 0.06).toFixed(0)} ${UMFANG.toFixed(0)}` } as CSSProperties}
      />

      {ABSCHNITTE.map((a) => (
        <g key={`b-${a.id}`}>
          <Beschriftung a={a} b={a.gross} klasse="um-lbl um-lbl--gross" />
          <Beschriftung a={a} b={a.klein} klasse="um-lbl um-lbl--klein" />
        </g>
      ))}

      {ABSCHNITTE.map((a) => (
        <path key={`p-${a.id}`} className="um-pfeil" d={a.pfeil} fill="none" stroke="#0b0b0e" strokeWidth="2.4" strokeLinecap="round" markerEnd="url(#um-spitze)" />
      ))}
    </svg>
  );
}

type Teil = (typeof leistungenB.teile)[number];

// „E-Mails“ und „KI-…“ nicht am Bindestrich umbrechen (geschützter Bindestrich)
const festeBindestriche = (t: string) => t.replace(/\b(KI|E)-(?=\w)/g, "$1\u2011");

/** Karte einer Stufe: Nummer, Titel, Text, „Einfach erklärt“, Link */
function Karte({ teil, farbe, klasse, d }: { teil: Teil; farbe: string; klasse: string; d: number }) {
  const start = teil.nr === 0;
  return (
    <article
      className={`um-karte ${klasse}`}
      data-rv=""
      style={{ ...stufe(d), "--f": farbe, "--f-weich": rgba(farbe, 0.2) } as CSSProperties}
      aria-labelledby={`um-karte-${teil.nr}`}
    >
      <h3 className="um-karte-kopf" id={`um-karte-${teil.nr}`}>
        <span className="um-karte-nr" style={start ? { background: START_VERLAUF } : undefined}>
          <span className="sr-only">Stufe </span>
          {teil.nr}
        </span>
        <span className="um-karte-titel">{festeBindestriche(teil.titel)}</span>
      </h3>
      <p className="um-karte-text">{festeBindestriche(teil.text)}</p>
      <p className="um-einfach">
        <strong>{leistungenB.einfachLabel}:</strong> {teil.einfach}
      </p>
      <a className="um-mehr" href={teil.href}>
        {leistungenB.mehr}
        <span className="sr-only">: {teil.titel}</span> <Pfeil size={16} />
      </a>
    </article>
  );
}

export default function Unendlich() {
  return (
    <section className="sb sb--kompakt" id="leistungen" aria-labelledby="leistungen-titel">
      <div className="sb-wrap um-wrap">
        <div className="b-kopf b-kopf--mitte um-kopf" data-rv="">
          <p className="b-label">{leistungenB.label}</p>
          <h2 className="b-h2" id="leistungen-titel">
            <Grad text={leistungenB.titel} />
          </h2>
          <p className="b-lead">{leistungenB.text}</p>
        </div>

        <div className="um-grid">
          <div className="um-mitte">
            <div className="um-zeichen" data-rv="">
              <Zeichen />
              {/* Start-Knopf auf der Kreuzung: hier steigt man ein */}
              <span className="um-start" aria-hidden="true">
                <span className="um-start-nr">{START.nr}</span>
                <span className="um-start-wort">{leistungenB.start}</span>
              </span>
              <span className="um-stiel" aria-hidden="true" />
            </div>
            <Karte teil={START} farbe={FARBEN[1]} klasse="um-karte--start" d={1} />
          </div>
          {ABSCHNITTE.map((a, k) => (
            <Karte key={a.id} teil={a.teil} farbe={a.farbe} klasse={`um-karte--${a.lage}`} d={k + 2} />
          ))}
        </div>

        <div className="um-ende" data-rv="">
          <Cta href="#termin">{cta.main}</Cta>
        </div>
      </div>
    </section>
  );
}
