import { cta } from "@/app/copy";
import { zahnradB } from "@/app/copy-b";
import Cta from "@/components/system/Cta";
import { Grad, Haken, stufe } from "./ui";

/* Zahnräder: großes Rad „KI“ in der Mitte, fünf Bereiche greifen außen herum ein (stehen still).
   Zeichentrick-Optik in Schwarz-Weiß: dicke schwarze Kontur, flache Flächen, harte Schattenseite
   (Cel-Shading), harter Versatz-Schatten und ein weißer Glanzstrich. Echte Verzahnung (gleiches Modul). */

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

const grad = (r: number) => (r * Math.PI) / 180;

/** Zahnrad-Umriss um (0,0): breite, runde Zeichentrick-Zähne */
function umriss(z: number, rp: number) {
  const ra = rp + M;
  const rf = rp - 1.1 * M;
  const p = (2 * Math.PI) / z;
  const pt = (r: number, a: number) => `${(r * Math.cos(a)).toFixed(2)} ${(r * Math.sin(a)).toFixed(2)}`;
  const teile: string[] = [];
  for (let k = 0; k < z; k++) {
    const a = k * p;
    teile.push(pt(rf, a - 0.29 * p), pt(ra, a - 0.17 * p), pt(ra, a + 0.17 * p), pt(rf, a + 0.29 * p));
  }
  return `M${teile.join("L")}Z`;
}

const kreis = (x: number, y: number, r: number) => `M${(x + r).toFixed(2)} ${y.toFixed(2)}a${r} ${r} 0 1 0 ${-2 * r} 0a${r} ${r} 0 1 0 ${2 * r} 0Z`;

const RF1 = R1 - 1.1 * M;
const GROSS = umriss(Z1, R1) + Array.from({ length: 6 }, (_, i) => kreis(Math.cos(grad(i * 60 + 30)) * RF1 * 0.6, Math.sin(grad(i * 60 + 30)) * RF1 * 0.6, RF1 * 0.15)).join("");
const KLEIN = umriss(Z2, R2);

/* Lage der kleinen Räder und Drehwinkel, damit Zahn in Lücke greift */
const P1 = 360 / Z1;
const P2 = 360 / Z2;
const RAEDER = zahnradB.bereiche.map((b, i) => {
  const theta = -90 + i * 72;
  const phase = theta + 180 - P2 * (0.5 - theta / P1);
  return { ...b, x: C + ABSTAND * Math.cos(grad(theta)), y: C + ABSTAND * Math.sin(grad(theta)), dreh: ((phase % P2) + P2) % P2 };
});

/** Ein Rad im Zeichentrick-Stil */
function Rad({ id, pfad, x, y, dreh, r }: { id: string; pfad: string; x: number; y: number; dreh: number; r: number }) {
  const t = `translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${dreh.toFixed(2)})`;
  return (
    <g>
      {/* harter Schatten nach rechts unten */}
      <path d={pfad} transform={`translate(${(x + 10).toFixed(2)} ${(y + 12).toFixed(2)}) rotate(${dreh.toFixed(2)})`} fill="#0b0b0e" fillRule="evenodd" opacity="0.18" />
      <clipPath id={id}>
        <path d={pfad} transform={t} clipRule="evenodd" />
      </clipPath>
      <g clipPath={`url(#${id})`}>
        {/* Schattenseite (grau), darüber die helle Fläche leicht nach links oben versetzt: harte Kante wie im Comic */}
        <rect x={x - r - 20} y={y - r - 20} width={2 * r + 40} height={2 * r + 40} fill="#74747e" />
        <circle cx={x - r * 0.1} cy={y - r * 0.12} r={r * 0.97} fill="#a4a4ae" />
        {/* Glanzstrich links oben */}
        <path d={`M${(x - r * 0.62).toFixed(1)} ${(y - r * 0.12).toFixed(1)}A${(r * 0.64).toFixed(1)} ${(r * 0.64).toFixed(1)} 0 0 1 ${(x - r * 0.14).toFixed(1)} ${(y - r * 0.62).toFixed(1)}`} fill="none" stroke="#e6e6ea" strokeWidth={r * 0.06} strokeLinecap="round" />
      </g>
      <path d={pfad} transform={t} fill="none" stroke="#0b0b0e" strokeWidth={KONTUR} strokeLinejoin="round" />
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
    <svg className="zr-svg" viewBox={`0 0 ${GROESSE} ${GROESSE}`} role="img" aria-label={`Zahnräder: KI in der Mitte treibt ${zahnradB.bereiche.map((b) => b.lang.replace("-\n", "").replace("\n", " ")).join(", ")} an.`}>
      {RAEDER.map((r, i) => (
        <Rad key={r.lang} id={`zr-k${i}`} pfad={KLEIN} x={r.x} y={r.y} dreh={r.dreh} r={R2 + M} />
      ))}
      <Rad id="zr-g" pfad={GROSS} x={C} y={C} dreh={0} r={R1 + M} />
      {/* Ring um die Aussparungen: betont den dicken Rand */}
      <circle cx={C} cy={C} r={RF1 - 22} fill="none" stroke="#0b0b0e" strokeWidth="5" />

      {/* Naben mit Beschriftung */}
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

export default function Zahnraeder() {
  return (
    <section className="sb zr" aria-labelledby="zr-titel">
      <div className="sb-wrap zr-grid">
        <div className="zr-bild" data-rv="">
          <Grafik />
        </div>
        <div className="zr-text" data-rv="" style={stufe(1)}>
          <h2 className="b-h2" id="zr-titel">
            <Grad text={zahnradB.titel} />
          </h2>
          <p className="b-lead">{zahnradB.text}</p>
          <ul className="zr-punkte">
            {zahnradB.punkte.map((p) => (
              <li key={p}>
                <Haken size={24} farbe="#16a34a" />
                {p}
              </li>
            ))}
          </ul>
          <Cta href="#termin" className="zr-cta">
            {cta.main}
          </Cta>
        </div>
      </div>
    </section>
  );
}
