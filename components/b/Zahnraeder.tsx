import { zahnradB } from "@/app/copy-b";
import { Grad, Haken, stufe } from "./ui";
import ZahnradLauf from "./ZahnradLauf";

/* Zahnräder: das Lösungsprinzip direkt nach dem Problem. Großes Rad „KI“ in der Mitte, fünf
   Bereiche greifen außen herum ein. Zeichentrick-Optik in Schwarz-Weiß wie die Problem-Sektion:
   dicke schwarze Kontur, flache Flächen, harte Schattenseite (Cel-Shading), harter Versatz-Schatten,
   weißer Glanzstrich. Echte Verzahnung (gleiches Modul).
   Bewegung: Sobald die Grafik im Bild ist, dreht sich das große Rad langsam im Uhrzeigersinn,
   die kleinen gegenläufig und doppelt so schnell (24 zu 12 Zähne), so greifen die Zähne sichtbar
   ineinander. Gedreht werden nur die Radformen (Umriss, Schnittform, Schatten); Licht, Naben und
   Beschriftungen stehen still. Die Formen sind schon an ihrer Stelle und im Anfangswinkel berechnet,
   damit CSS um die Mitte der eigenen Form drehen kann (transform-box: fill-box). */

const M = 13; // Modul
const Z1 = 24; // Zähne großes Rad
const Z2 = 12; // Zähne kleine Räder
const R1 = (M * Z1) / 2; // Teilkreis 156
const R2 = (M * Z2) / 2; // Teilkreis 78
const ABSTAND = R1 + R2;
const RAND = 30;
const GROESSE = 2 * (ABSTAND + R2 + M) + 2 * RAND;
const C = GROESSE / 2;
const KONTUR = 9; // dicke schwarze Linie
const SCHATTEN = { x: 10, y: 12 }; // harter Versatz-Schatten

const grad = (r: number) => (r * Math.PI) / 180;

/** Zahnrad-Umriss um (cx, cy), um „dreh“ Grad gedreht: breite, runde Zeichentrick-Zähne */
function umriss(z: number, rp: number, cx: number, cy: number, dreh: number) {
  const ra = rp + M;
  const rf = rp - 1.1 * M;
  const p = (2 * Math.PI) / z;
  const d = grad(dreh);
  const pt = (r: number, a: number) => `${(cx + r * Math.cos(a + d)).toFixed(2)} ${(cy + r * Math.sin(a + d)).toFixed(2)}`;
  const teile: string[] = [];
  for (let k = 0; k < z; k++) {
    const a = k * p;
    teile.push(pt(rf, a - 0.29 * p), pt(ra, a - 0.17 * p), pt(ra, a + 0.17 * p), pt(rf, a + 0.29 * p));
  }
  return `M${teile.join("L")}Z`;
}

const kreis = (x: number, y: number, r: number) => `M${(x + r).toFixed(2)} ${y.toFixed(2)}a${r} ${r} 0 1 0 ${-2 * r} 0a${r} ${r} 0 1 0 ${2 * r} 0Z`;

const RF1 = R1 - 1.1 * M;
/** großes Rad mit sechs Aussparungen (punktsymmetrisch, die Mitte der Form ist die Radmitte) */
const gross = (x: number, y: number) =>
  umriss(Z1, R1, x, y, 0) + Array.from({ length: 6 }, (_, i) => kreis(x + Math.cos(grad(i * 60 + 30)) * RF1 * 0.6, y + Math.sin(grad(i * 60 + 30)) * RF1 * 0.6, RF1 * 0.15)).join("");

/* Lage der kleinen Räder und Anfangswinkel, damit Zahn in Lücke greift */
const P1 = 360 / Z1;
const P2 = 360 / Z2;
const RAEDER = zahnradB.bereiche.map((b, i) => {
  const theta = -90 + i * 72;
  const phase = theta + 180 - P2 * (0.5 - theta / P1);
  const dreh = ((phase % P2) + P2) % P2;
  return { ...b, x: C + ABSTAND * Math.cos(grad(theta)), y: C + ABSTAND * Math.sin(grad(theta)), form: (x: number, y: number) => umriss(Z2, R2, x, y, dreh) };
});

/* Bildausschnitt eng um die Räder (unten ist weniger Platz nötig): auf dem Handy wird alles größer */
const AUSSEN = R2 + M + KONTUR / 2;
const XS = RAEDER.map((r) => r.x);
const YS = RAEDER.map((r) => r.y);
const LUFT = 8;
const BOX = {
  x: Math.min(...XS) - AUSSEN - LUFT,
  y: Math.min(...YS) - AUSSEN - LUFT,
  r: Math.max(...XS) + R2 + M + SCHATTEN.x + LUFT,
  u: Math.max(...YS) + R2 + M + SCHATTEN.y + LUFT,
};
const VIEWBOX = `${BOX.x.toFixed(1)} ${BOX.y.toFixed(1)} ${(BOX.r - BOX.x).toFixed(1)} ${(BOX.u - BOX.y).toFixed(1)}`;

/** Ein Rad im Zeichentrick-Stil. „klein“ dreht gegenläufig und doppelt so schnell. */
function Rad({ id, form, x, y, r, klein = false }: { id: string; form: (x: number, y: number) => string; x: number; y: number; r: number; klein?: boolean }) {
  const pfad = form(x, y);
  const dreht = klein ? "zr-dreh zr-dreh--klein" : "zr-dreh";
  return (
    <g>
      {/* harter Schatten nach rechts unten */}
      <path className={dreht} d={form(x + SCHATTEN.x, y + SCHATTEN.y)} fill="#0b0b0e" fillRule="evenodd" opacity="0.18" />
      <clipPath id={id}>
        <path className={dreht} d={pfad} clipRule="evenodd" />
      </clipPath>
      <g clipPath={`url(#${id})`}>
        {/* Schattenseite (grau), darüber die helle Fläche leicht nach links oben versetzt: harte Kante wie im Comic.
            Das Licht steht still, nur die Form dreht sich darunter weg. */}
        <rect x={x - r - 20} y={y - r - 20} width={2 * r + 40} height={2 * r + 40} fill="#74747e" />
        <circle cx={x - r * 0.1} cy={y - r * 0.12} r={r * 0.97} fill="#a4a4ae" />
        {/* Glanzstrich links oben */}
        <path d={`M${(x - r * 0.62).toFixed(1)} ${(y - r * 0.12).toFixed(1)}A${(r * 0.64).toFixed(1)} ${(r * 0.64).toFixed(1)} 0 0 1 ${(x - r * 0.14).toFixed(1)} ${(y - r * 0.62).toFixed(1)}`} fill="none" stroke="#e6e6ea" strokeWidth={r * 0.06} strokeLinecap="round" />
      </g>
      <path className={dreht} d={pfad} fill="none" stroke="#0b0b0e" strokeWidth={KONTUR} strokeLinejoin="round" />
    </g>
  );
}

function Beschriftung({ x, y, text, klasse, zeile }: { x: number; y: number; text: string; klasse: string; zeile: number }) {
  const zeilen = text.split("\n");
  return (
    <text x={x} y={y} textAnchor="middle" className={klasse}>
      {zeilen.map((z, i) => (
        <tspan key={z} x={x} dy={i === 0 ? (zeilen.length === 1 ? zeile * 0.35 : -zeile * 0.18) : zeile}>
          {z}
        </tspan>
      ))}
    </text>
  );
}

function Grafik() {
  return (
    <svg className="zr-svg" viewBox={VIEWBOX} role="img" aria-label={`Zahnräder: KI in der Mitte treibt ${zahnradB.bereiche.map((b) => b.lang.replace("-\n", "").replace("\n", " ")).join(", ")} an.`}>
      {RAEDER.map((r, i) => (
        <Rad key={r.lang} id={`zr-k${i}`} form={r.form} x={r.x} y={r.y} r={R2 + M} klein />
      ))}
      <Rad id="zr-g" form={gross} x={C} y={C} r={R1 + M} />
      {/* Ring um die Aussparungen: betont den dicken Rand */}
      <circle cx={C} cy={C} r={RF1 - 22} fill="none" stroke="#0b0b0e" strokeWidth="5" />

      {/* Naben mit Beschriftung: stehen still */}
      <circle cx={C} cy={C} r="64" fill="#fff" stroke="#0b0b0e" strokeWidth={KONTUR} />
      <text x={C} y={C} dy="21" textAnchor="middle" className="zr-ki">
        {zahnradB.mitte}
      </text>
      {RAEDER.map((r) => (
        <g key={`n-${r.lang}`}>
          <circle cx={r.x} cy={r.y} r="56" fill="#fff" stroke="#0b0b0e" strokeWidth={KONTUR} />
          <Beschriftung x={r.x} y={r.y} text={r.lang} klasse="zr-label zr-label--lang" zeile={19} />
          <Beschriftung x={r.x} y={r.y} text={r.kurz} klasse="zr-label zr-label--kurz" zeile={25} />
        </g>
      ))}
    </svg>
  );
}

/** Pfeil nach unten am Textlink */
function Runter() {
  return (
    <svg className="zr-weiter-pfeil" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path d="M12 5v14M6 13l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Der Pfeil hängt am letzten Wort, damit er beim Umbruch nie allein am Rand steht
const weiterWorte = zahnradB.weiter.split(" ");
const weiterEnde = weiterWorte.pop();
const weiterAnfang = weiterWorte.join(" ");

export default function Zahnraeder() {
  return (
    <section className="sb zr" aria-labelledby="zr-titel">
      {/* gestrichelte Linie aus dem Schaubild darüber: das Problem führt hierher zur Lösung */}
      <div className="zr-faden" aria-hidden="true">
        <svg viewBox="0 0 40 100" preserveAspectRatio="none">
          <path d="M20 0 C 2 30, 38 60, 20 92" />
        </svg>
        <span className="zr-faden-spitze" />
      </div>
      <div className="sb-wrap">
        <div className="b-kopf b-kopf--mitte zr-kopf" data-rv="">
          <p className="b-label">{zahnradB.label}</p>
          <h2 className="b-h2" id="zr-titel">
            <Grad text={zahnradB.titel} />
          </h2>
        </div>
        <div className="zr-grid">
          <div className="zr-bild" data-rv="">
            <ZahnradLauf>
              <Grafik />
            </ZahnradLauf>
          </div>
          <div className="zr-text" data-rv="" style={stufe(1)}>
            <p className="b-lead">{zahnradB.text}</p>
            <ul className="zr-punkte">
              {zahnradB.punkte.map((p) => (
                <li key={p}>
                  <Haken size={24} farbe="#16a34a" />
                  {p}
                </li>
              ))}
            </ul>
            <a className="zr-weiter" href={zahnradB.weiterHref}>
              {weiterAnfang}{" "}
              <span className="zr-weiter-ende">
                {weiterEnde}
                <Runter />
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
