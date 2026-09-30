import type { CSSProperties } from "react";
import { geschenk } from "@/app/copy";
import { company } from "@/app/content";

/* ====================================================================
   Das Masterplan-Dokument als reines HTML/CSS: vier Seiten auf Papier,
   Kopfzeile mit Markenverlauf und Monogramm, dezent „Beispiel“.
   Keine erfundenen Texte: Überschriften und Balken kommen aus copy.ts,
   alles Weitere sind Blindzeilen (graue Striche wie Text im Entwurf).
   Die Bewegung (Stapel, Aufbau, Stempel) steuert GeschenkStage.tsx.
   ==================================================================== */

const D = geschenk.doc;
// Die drei größten Zeitfresser aus der Balkenseite werden zur Top 3
const TOP = D.bars.slice(0, 3);
// Balkenlängen rein illustrativ (keine Zahlen im Dokument)
const BARS = [0.94, 0.79, 0.66, 0.52, 0.41, 0.3];

type V = CSSProperties & Record<`--${string}`, string | number>;

function Head() {
  return (
    <div className="md-head">
      <span className="md-mono" />
      <span className="md-run">{D.coverTitle}</span>
      <span className="md-sample">{D.sample}</span>
    </div>
  );
}

function Foot({ n }: { n: number }) {
  return (
    <div className="md-foot">
      <span>{company.name}</span>
      <span className="md-pno">
        {String(n).padStart(2, "0")}
        <i> / 04</i>
      </span>
    </div>
  );
}

// Seitentitel ohne eigene Nummer: gezählt wird nur unten („02 / 04“)
function Title({ children }: { children: string }) {
  return (
    <div className="md-title">
      <span className="md-kicker" />
      <span className="md-h">{children}</span>
    </div>
  );
}

function Line({ w }: { w: number }) {
  return <span className="md-line" style={{ "--w": `${w}%` } as V} />;
}

// Kurzes Fazit als Blindzeilen, nur im Hochformat sichtbar (füllt die Seite wie im echten Bericht)
function Note({ w }: { w: [number, number, number] }) {
  return (
    <div className="md-note">
      <Line w={w[0]} />
      <Line w={w[1]} />
      <Line w={w[2]} />
    </div>
  );
}

export function Stamp() {
  // Siegel mit feinem Strichkranz, gesetzt in Violett auf das Deckblatt
  const ticks = Array.from({ length: 60 }, (_, i) => i * 6);
  return (
    <div className="md-stamp">
      <svg className="md-stamp-ring" viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r="48" className="md-stamp-o" />
        <circle cx="50" cy="50" r="36.5" className="md-stamp-i" />
        <g className="md-stamp-ticks">
          {ticks.map((a) => (
            <line key={a} x1="50" y1="4.6" x2="50" y2={a % 30 === 0 ? "10.4" : "8.6"} transform={`rotate(${a} 50 50)`} />
          ))}
        </g>
      </svg>
      <span className="md-stamp-v">{geschenk.stamp}</span>
    </div>
  );
}

/** Deckblatt mit Stempel. Auch einzeln nutzbar (z. B. neben dem Formular), braucht einen
    Rahmen mit fester Größe: <div className="md"><div className="md-box"><CoverPage /></div></div> */
export function CoverPage() {
  return (
    <div className="md-page md-cover" data-page="0">
      <div className="md-sheet">
        <div className="md-cover-band" aria-hidden="true">
          <svg className="md-cover-pitch" viewBox="0 0 400 160" preserveAspectRatio="xMidYMid slice">
            <path d="M200 0 V160" />
            <circle cx="200" cy="80" r="52" />
            <circle cx="200" cy="80" r="2.2" className="dot" />
            <path d="M0 22 H70 V138 H0" />
            <path d="M400 22 H330 V138 H400" />
            <path d="M70 52 A 40 40 0 0 1 70 108" />
            <path d="M330 52 A 40 40 0 0 0 330 108" />
          </svg>
          <span className="md-cover-mono" />
          <span className="md-sample md-sample--dark">{D.sample}</span>
        </div>
        <div className="md-cover-main">
          <span className="md-cover-title">{D.coverTitle}</span>
          <span className="md-cover-sub">{D.coverSub}</span>
        </div>
        <div className="md-cover-foot">
          <span className="md-rule" />
          <span className="md-cover-by">{D.coverBy}</span>
        </div>
        <Stamp />
      </div>
      <span className="md-shade" />
    </div>
  );
}

export default function Masterplan({ label }: Readonly<{ label: string }>) {
  return (
    <div className="md" role="img" aria-label={label}>
      <div className="md-box">
        <CoverPage />

        {/* Zeitfresser */}
        <div className="md-page" data-page="1">
          <div className="md-sheet">
            <Head />
            <Title>{D.pageZeitfresser}</Title>
            <div className="md-chart">
              <span className="md-grid" aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
              </span>
              <ul className="md-bars">
                {D.bars.map((b, i) => (
                  <li key={b}>
                    <span className="md-bar-l">{b}</span>
                    <span className="md-bar-t">
                      <span className="md-bar" style={{ "--v": BARS[i], "--i": i } as V} />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <Note w={[94, 86, 52]} />
            <Foot n={2} />
          </div>
          <span className="md-shade" />
        </div>

        {/* Top 3 */}
        <div className="md-page" data-page="2">
          <div className="md-sheet">
            <Head />
            <Title>{D.pageTop3}</Title>
            <ol className="md-top">
              {TOP.map((t, i) => (
                <li key={t}>
                  <span className="md-top-n">{i + 1}</span>
                  <span className="md-top-b">
                    <span className="md-top-t">{t}</span>
                    <Line w={[88, 80, 84][i]} />
                    <Line w={[62, 70, 54][i]} />
                  </span>
                  <span className="md-gauge" aria-hidden="true">
                    <i style={{ "--g": [0.92, 0.76, 0.62][i] } as V} />
                  </span>
                </li>
              ))}
            </ol>
            <Note w={[90, 78, 60]} />
            <Foot n={3} />
          </div>
          <span className="md-shade" />
        </div>

        {/* Lösungsweg */}
        <div className="md-page" data-page="3">
          <div className="md-sheet">
            <Head />
            <Title>{D.pageWeg}</Title>
            <div className="md-weg">
              {TOP.map((t, i) => (
                <div className="md-weg-col" key={t}>
                  <span className="md-weg-t">
                    <b>{i + 1}</b>
                    {t}
                  </span>
                  <ul>
                    {[0, 1, 2].map((k) => (
                      <li key={k}>
                        <span className="md-check">
                          <svg viewBox="0 0 16 16" aria-hidden="true">
                            <path d="M3.6 8.4 6.6 11.3 12.4 4.9" pathLength={1} />
                          </svg>
                        </span>
                        <Line w={[[86, 64, 74], [72, 88, 58], [80, 60, 70]][i][k]} />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <Foot n={4} />
          </div>
          <span className="md-shade" />
        </div>
      </div>
    </div>
  );
}
