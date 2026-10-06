import { leistungenB } from "@/app/copy-b";
import { Grad, Pfeil, stufe } from "./ui";

/* „Unsere Leistungen“ als Unendlichkeitszeichen (Vorbild: andreasbaulig.de), aber geschlossen:
   ein Band ohne Enden, die vier Farben gehen fließend ineinander über.
   Lage: 1 oben links, 2 unten rechts, 3 oben rechts, 4 unten links (so läuft das Band auch).
   Form: Lemniskate von Bernoulli, etwas höher gezogen. Alles wird auf dem Server berechnet. */

const W = 1000;
const H = 600;
const CX = W / 2;
const CY = H / 2;
const A = 420; // halbe Breite
const STRECK = 1.45; // Schleifen höher ziehen
const BAND = 86; // Bandbreite
const N = 480; // Stützpunkte
const SCHRIFT = 30; // Beschriftung auf dem Band
const R = 19; // Nummernkreis

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

const ABSCHNITTE = leistungenB.teile.map((teil, k) => {
  const pts = Array.from({ length: 121 }, (_, i) => punkt(tVon(k + i / 120)));
  const lesbar = pts[pts.length - 1].x >= pts[0].x ? pts : [...pts].reverse(); // Schrift nie kopfüber
  const l = laengen(lesbar);
  const L = l[l.length - 1];
  // Nummer direkt vor dem Wort: Gruppe (Kreis + Wort) mittig auf dem Abschnitt
  const breite = teil.kurz.length * SCHRIFT * 0.57;
  const textMitte = L / 2 + R + 3;
  const nummer = beiLaenge(lesbar, l, L / 2 - breite / 2 - 3);
  const oben = k === 0 || k === 2;
  const links = k === 0 || k === 3;
  const mitte = punkt(tVon(k + 0.5));
  // kurzer, geschwungener Pfeil vom Band zur Seite des Textes
  const sx = mitte.x + (links ? -26 : 26);
  const sy = mitte.y + (oben ? -(BAND / 2 + 8) : BAND / 2 + 8);
  const ex = sx + (links ? -62 : 62);
  const ey = sy + (oben ? -34 : 34);
  const pfeil = `M${sx.toFixed(1)} ${sy.toFixed(1)}Q${(sx + (links ? -6 : 6)).toFixed(1)} ${ey.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`;
  return { teil, farbe: FARBEN[k], textPfad: pfad(lesbar), textMitte, nummer, pfeil, id: `lm-${k}`, lage: `${oben ? "o" : "u"}${links ? "l" : "r"}` };
});

function Zeichen() {
  return (
    <svg className="um-svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Unendlichkeitszeichen aus vier Leistungen: 1 KI-Workshop, 2 KI-Automatisierung, 3 KI-Assistenten, 4 KI-Wissensmanagement">
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

      <path d={UMRISS} fill="none" stroke="rgba(60,40,180,0.28)" strokeWidth={BAND} transform="translate(0 16)" filter="url(#um-schatten)" />
      {STUECKE.map((s, i) => (
        <path key={i} d={s.d} fill="none" stroke={s.farbe} strokeWidth={BAND} strokeLinecap="butt" strokeLinejoin="round" />
      ))}
      <path d={UMRISS} fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth={BAND * 0.18} transform={`translate(0 ${-BAND * 0.22})`} />
      {/* Lichtimpuls, der das Band entlangläuft (zeigt: alles greift ineinander) */}
      <path
        d={UMRISS}
        className="um-impuls"
        fill="none"
        stroke="#fff"
        strokeWidth={BAND * 0.42}
        strokeLinecap="round"
        style={{ "--l": UMFANG.toFixed(0), strokeDasharray: `${(UMFANG * 0.06).toFixed(0)} ${UMFANG.toFixed(0)}` } as React.CSSProperties}
      />

      {ABSCHNITTE.map((a) => (
        <g key={`b-${a.id}`}>
          <text className="um-band-text" dy="10">
            <textPath href={`#${a.id}`} startOffset={a.textMitte.toFixed(1)} textAnchor="middle">
              {a.teil.kurz}
            </textPath>
          </text>
          <circle cx={a.nummer.x} cy={a.nummer.y} r={R} fill="#fff" />
          <text x={a.nummer.x} y={a.nummer.y} dy="8" textAnchor="middle" className="um-nummer" fill={a.farbe}>
            {a.teil.nr}
          </text>
        </g>
      ))}

      {ABSCHNITTE.map((a) => (
        <path key={`p-${a.id}`} d={a.pfeil} fill="none" stroke="#0b0b0e" strokeWidth="2.4" strokeLinecap="round" markerEnd="url(#um-spitze)" />
      ))}
    </svg>
  );
}

export default function Unendlich() {
  return (
    <section className="sb sb--kompakt" id="leistungen" aria-labelledby="leistungen-titel">
      <div className="sb-wrap um-wrap">
        <div className="b-kopf b-kopf--mitte um-kopf" data-rv="">
          <h2 className="b-h2" id="leistungen-titel">
            <Grad text={leistungenB.titel} />
          </h2>
          <p className="b-lead">{leistungenB.text}</p>
        </div>

        <div className="um-grid">
          <div className="um-zeichen" data-rv="">
            <Zeichen />
          </div>
          {ABSCHNITTE.map((a, k) => (
            <div key={a.id} className={`um-text um-text--${a.lage}`} data-rv="" style={stufe(k + 1)}>
              <p className="um-text-kopf">
                <span className="um-text-nr" style={{ background: a.farbe }}>
                  {a.teil.nr}
                </span>
                {a.teil.titel}
              </p>
              <p className="um-text-body">{a.teil.text}</p>
              <a className="um-mehr" href={a.teil.href}>
                {leistungenB.mehr} <Pfeil size={16} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
