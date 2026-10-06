import Image from "next/image";
import type { CSSProperties } from "react";
import { masterplanB } from "@/app/copy-b";

/* Der KI-Masterplan als gezeichnetes Druckstück (HTML/CSS/SVG, kein Bild): Deckblatt mit Siegel und drei Seiten.
   Reine Abbildung mit erfundenen Beispielwerten, darum komplett aria-hidden; die Aussagen stehen als echter Text
   in Masterplan.tsx. Alle Maße in em: Jede Seite rechnet ihre Schrift aus der eigenen Breite (masterplan.css),
   so bleibt das Dokument auf jeder Breite gestochen scharf und in sich gleich. */

const d = masterplanB.doc;
const v = (werte: Record<string, string | number>) => werte as CSSProperties;

/* Gezackter Rand des Siegels (Rosette): 40 weiche Bögen zwischen Innen- und Außenradius */
const ROSETTE = (() => {
  const n = 40;
  const innen = 95;
  const aussen = 103;
  const p = (r: number, a: number) => `${(104 + r * Math.cos(a)).toFixed(2)} ${(104 + r * Math.sin(a)).toFixed(2)}`;
  let pfad = `M ${p(innen, 0)}`;
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * Math.PI * 2;
    const a1 = ((i + 1) / n) * Math.PI * 2;
    pfad += ` Q ${p(aussen, (a0 + a1) / 2)} ${p(innen, a1)}`;
  }
  return `${pfad} Z`;
})();

function Siegel() {
  return (
    <div className="mpd-siegel">
      <svg viewBox="0 0 208 208" focusable="false">
        <defs>
          <linearGradient id="mpd-siegel-verlauf" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#3f74ff" />
            <stop offset="0.55" stopColor="#6a55ff" />
            <stop offset="1" stopColor="#8c6dff" />
          </linearGradient>
          <radialGradient id="mpd-siegel-glanz" cx="0.32" cy="0.22" r="0.8">
            <stop offset="0" stopColor="#fff" stopOpacity="0.32" />
            <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <path id="mpd-siegel-pfad" d="M104 104 m -72 0 a 72 72 0 1 1 144 0 a 72 72 0 1 1 -144 0" />
        </defs>
        <path d={ROSETTE} fill="url(#mpd-siegel-verlauf)" />
        <path d={ROSETTE} fill="url(#mpd-siegel-glanz)" />
        <circle cx="104" cy="104" r="88" fill="none" stroke="#fff" strokeOpacity="0.55" strokeWidth="1.2" />
        <circle cx="104" cy="104" r="56" fill="none" stroke="#fff" strokeOpacity="0.55" strokeWidth="1.2" />
        <text className="mpd-siegel-ring">
          <textPath href="#mpd-siegel-pfad" startOffset="0" textLength={448} lengthAdjust="spacing">
            {`${d.siegel.ring.toUpperCase()} · `}
          </textPath>
        </text>
        <text className="mpd-siegel-mitte" x="104" y="104" textAnchor="middle" dominantBaseline="central">
          {d.siegel.mitte}
        </text>
      </svg>
    </div>
  );
}

function Kopf({ nr, kicker, titel }: { nr: number; kicker: string; titel: string }) {
  return (
    <div className="mpd-kopf">
      <span className="mpd-nr">{nr}</span>
      <div>
        <p className="mpd-kicker">{kicker}</p>
        <p className="mpd-titel">{titel}</p>
      </div>
    </div>
  );
}

function Fuss() {
  return (
    <div className="mpd-fuss">
      <span>{d.fuss}</span>
      <span className="mpd-fuss-beispiel">{d.beispiel}</span>
    </div>
  );
}

export default function MasterplanDokument() {
  const z = d.zeitfresser;
  const t = d.top3;
  const f = d.fahrplan;
  const max = Math.max(...z.zeilen.map((r) => r.std));
  const werkzeuge = Array.from(new Set(t.zeilen.flatMap((r) => r.werkzeuge)));
  return (
    <div className="mpd" aria-hidden="true">
      {/* Deckblatt (liegt hinten) */}
      <div className="mpd-blatt mpd-blatt--deck" style={v({ "--i": 0 })}>
        <span className="mpd-deck-kante" />
        <Image className="mpd-mono" src="/logo/svh-bild-navy.webp" alt="" width={480} height={780} sizes="48px" />
        <p className="mpd-deck-titel">{d.titel}</p>
        <p className="mpd-deck-fuer">{d.fuer}</p>
        <span className="mpd-deck-strich" />
        <p className="mpd-deck-von">{d.von}</p>
        <span className="mpd-deck-licht" />
      </div>

      {/* Seite 2: Top 3 */}
      <div className="mpd-blatt mpd-blatt--2" style={v({ "--i": 1 })}>
        <Kopf nr={2} kicker={t.kicker} titel={t.titel} />
        <ol className="mpd-top">
          {t.zeilen.map((r, i) => (
            <li key={r.titel}>
              <span className="mpd-top-rang">{i + 1}</span>
              <div className="mpd-top-inhalt">
                <p className="mpd-top-titel">{r.titel}</p>
                <p className="mpd-top-spart">{r.spart}</p>
                <p className="mpd-top-meta">
                  <span className="mpd-top-aufwand">
                    {t.aufwand}
                    <span className={`mpd-punkte mpd-punkte--${r.stufe}`}>
                      <i />
                      <i />
                      <i />
                    </span>
                    {r.aufwand}
                  </span>
                </p>
                <p className="mpd-chips">
                  {r.werkzeuge.map((w) => (
                    <span key={w}>{w}</span>
                  ))}
                </p>
              </div>
            </li>
          ))}
        </ol>
        <Fuss />
      </div>

      {/* Seite 3: Fahrplan */}
      <div className="mpd-blatt mpd-blatt--3" style={v({ "--i": 2 })}>
        <Kopf nr={3} kicker={f.kicker} titel={f.titel} />
        <ol className="mpd-weg">
          {f.schritte.map((s, i) => (
            <li key={s.was} className={i === 0 ? "mpd-weg-start" : undefined}>
              <span className="mpd-weg-punkt" />
              <p className="mpd-weg-wann">{s.wann}</p>
              <p className="mpd-weg-was">{s.was}</p>
              <p className="mpd-weg-wie">{s.wie}</p>
            </li>
          ))}
        </ol>
        <div className="mpd-werkzeuge">
          <p className="mpd-einheit">{f.werkzeugeTitel}</p>
          <p className="mpd-chips">
            {werkzeuge.map((w) => (
              <span key={w}>{w}</span>
            ))}
          </p>
        </div>
        <Fuss />
      </div>

      {/* Seite 1: Zeitfresser (liegt vorne) */}
      <div className="mpd-blatt mpd-blatt--1" style={v({ "--i": 3 })}>
        <Kopf nr={1} kicker={z.kicker} titel={z.titel} />
        <p className="mpd-einheit">{z.einheit}</p>
        <ul className="mpd-balken">
          {z.zeilen.map((r, i) => (
            <li key={r.name} style={v({ "--w": r.std / max, "--j": i })}>
              <span className="mpd-b-name">{r.name}</span>
              <span className="mpd-b-wert">{r.std} Std.</span>
              <span className="mpd-b-spur">
                <span className="mpd-b-fuell" />
              </span>
            </li>
          ))}
        </ul>
        <p className="mpd-summe">
          <span>{z.summe}</span>
          <strong>{z.summeWert}</strong>
        </p>
        <Fuss />
      </div>

      <Siegel />
    </div>
  );
}
