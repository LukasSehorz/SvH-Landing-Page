import Image from "next/image";
import { cta } from "@/app/copy";
import { assistentenB, automatisierungB, leistungenB, wissenB, workshopB } from "@/app/copy-b";
import Cta from "@/components/system/Cta";
import { ASSISTENTEN_BILDER, AUTOMATISIERUNG_BILDER } from "./Beispiele";
import Laptop from "./Laptop";
import LeistungTabs from "./LeistungTabs";
import { Grad, Haken, Symbol, stufe } from "./ui";

/* Die vier Leistungen im Detail (Überblick: Unendlich.tsx). */

function MittelKopf({ id, titel, einfach }: { id: string; titel: string; einfach: string }) {
  return (
    <div className="lk" data-rv="">
      <h2 className="b-h2" id={id}>
        <Grad text={titel} />
      </h2>
      <p className="lk-einfach">
        <span className="lk-einfach-label">{leistungenB.einfachLabel}:</span> {einfach}
      </p>
    </div>
  );
}

/** Pfeil nach unten zwischen zwei Schritten */
function PfeilRunter() {
  return (
    <span className="wf-pfeil" aria-hidden="true">
      <svg viewBox="0 0 24 34" width="22" height="30" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v28M5 23l7 7 7-7" />
      </svg>
    </span>
  );
}

export function Workshop() {
  return (
    <section className="sb sb--workshop" id="workshop" aria-labelledby="workshop-titel">
      <div className="sb-wrap ws-grid">
        <div className="ws-links">
          <div className="b-kopf" data-rv="">
            <h2 className="b-h2" id="workshop-titel">
              <Grad text={workshopB.titel} />
            </h2>
            <p className="b-lead">{workshopB.text}</p>
          </div>

          <ol className="wf">
            {workshopB.schritte.map((s, i) => (
              <li key={s.titel} className="wf-schritt" data-rv="">
                {i > 0 ? <PfeilRunter /> : null}
                <div className={`wf-karte${i === 0 ? " wf-karte--haupt" : ""}`}>
                  <div className="wf-kopf">
                    <span className="wf-nr">{i + 1}</span>
                    <h3 className="wf-titel">{s.titel}</h3>
                    <span className="wf-tag">{s.tag}</span>
                    {s.preis ? <span className="wf-preis">{s.preis}</span> : null}
                  </div>
                  <p className="wf-text">{s.text}</p>
                  {s.punkte.length ? (
                    <ul className="wf-punkte">
                      {s.punkte.map((p) => (
                        <li key={p}>
                          <Haken size={20} farbe="#fff" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>

          <div className="wf-ende" data-rv="">
            <p>{workshopB.hinweis}</p>
            <Cta href="#termin">{cta.main}</Cta>
          </div>
        </div>

        <div className="ws-bild" data-rv="" style={stufe(1)}>
          {workshopB.bild ? (
            <Image src={workshopB.bild} alt="" fill sizes="(max-width: 999px) 100vw, 560px" />
          ) : (
            <div className="ws-bild-platzhalter" aria-hidden="true">
              <Image src="/logo/svh-bild-480.webp" alt="" width={96} height={156} />
              <span>{workshopB.bildFolgt}</span>
            </div>
          )}
          <div className="ws-preis">
            <p className="ws-preis-titel">{workshopB.preis.titel}</p>
            <p className="ws-preis-zeile">
              <del className="ws-preis-alt">
                <span className="sr-only">statt </span>
                {workshopB.preis.alt}
              </del>
              <span className="ws-preis-neu">{workshopB.preis.neu}</span>
            </p>
            <p className="ws-preis-text">{workshopB.preis.text}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Automatisierung() {
  const d = automatisierungB;
  return (
    <section className="sb" id="automatisierung" aria-labelledby="automatisierung-titel">
      <div className="sb-wrap">
        <MittelKopf id="automatisierung-titel" titel={d.titel} einfach={d.einfach} />
        <div data-rv="">
          <LeistungTabs beispiel="Beispiel" tabs={d.punkte.map((p) => ({ ...p, bild: AUTOMATISIERUNG_BILDER[p.id] }))} />
        </div>
      </div>
    </section>
  );
}

export function Assistenten() {
  const d = assistentenB;
  return (
    <section className="sb sb--tint" id="assistenten" aria-labelledby="assistenten-titel">
      <div className="sb-wrap">
        <MittelKopf id="assistenten-titel" titel={d.titel} einfach={d.einfach} />
        <div data-rv="">
          <LeistungTabs beispiel="Beispiel" listeRechts tabs={d.punkte.map((p) => ({ ...p, bild: ASSISTENTEN_BILDER[p.id] }))} />
        </div>
      </div>
    </section>
  );
}

/* Wissensmanagement: Wo das Wissen heute steckt (4 Kästen) → Folge → wir bündeln es →
   vorher/nachher auf zwei Laptops. */
export function Wissen() {
  const d = wissenB;
  return (
    <section className="sb" id="wissensmanagement" aria-labelledby="wissen-titel">
      <div className="sb-wrap">
        <div className="b-kopf b-kopf--mitte" data-rv="">
          <h2 className="b-h2" id="wissen-titel">
            <Grad text={d.titel} />
          </h2>
          <p className="b-lead">{d.kurz}</p>
        </div>

        <p className="wm-orte-titel" data-rv="">
          {d.orteTitel}
        </p>
        <ul className="wm-orte">
          {d.orte.map((o, i) => (
            <li key={o.titel} className="wm-ort" data-rv="" style={stufe(i)}>
              <span className="wm-ort-symbol">
                <Symbol name={o.icon} size={24} farbe="#111" />
              </span>
              <p className="wm-ort-titel">{o.titel}</p>
              <p className="wm-ort-text">{o.text}</p>
            </li>
          ))}
        </ul>

        {/* vier Linien laufen zu einem Pfeil zusammen */}
        <div className="wm-trichter" aria-hidden="true">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M12.5 0 C 12.5 55, 50 40, 50 94" />
            <path d="M37.5 0 C 37.5 50, 50 45, 50 94" />
            <path d="M62.5 0 C 62.5 50, 50 45, 50 94" />
            <path d="M87.5 0 C 87.5 55, 50 40, 50 94" />
          </svg>
          <span className="wm-trichter-spitze" />
        </div>

        <div className="wm-folge" data-rv="">
          <p className="wm-folge-text">{d.folge}</p>
          <p className="wm-loesung">
            <Image src="/logo/svh-bild-navy.webp" alt="" width={30} height={49} />
            {d.loesung}
          </p>
        </div>

        <div className="wm-laptops">
          <div className="wm-laptop" data-rv="">
            <p className="wm-laptop-label wm-laptop-label--vorher">{d.vorher.label}</p>
            <Laptop label={`${d.beispiel}: ${d.vorher.unter}`}>
              <div className="sc-vorher">
                <p className="sc-frage">{d.vorher.frage}</p>
                <ul className="sc-chaos">
                  {d.vorher.orte.map((o, i) => (
                    <li key={o.text} className={`sc-zettel sc-zettel--${i + 1}`}>
                      <Symbol name={o.icon} size={14} farbe="#555" />
                      {o.text}
                    </li>
                  ))}
                </ul>
                <span className="sc-fragezeichen" aria-hidden="true">
                  ?
                </span>
              </div>
            </Laptop>
            <p className="wm-laptop-unter">{d.vorher.unter}</p>
          </div>

          <div className="wm-laptop" data-rv="" style={stufe(1)}>
            <p className="wm-laptop-label">{d.nachher.label}</p>
            <Laptop label={`${d.beispiel}: ${d.nachher.unter}`}>
              <div className="sc-nachher">
                <aside className="sc-seite">
                  <p className="sc-app">
                    <Image src="/logo/svh-bild-navy.webp" alt="" width={10} height={16} />
                    {d.nachher.app}
                  </p>
                  <ul>
                    {d.nachher.quellen.map((q) => (
                      <li key={q}>
                        <Haken size={11} farbe="#16a34a" />
                        {q}
                      </li>
                    ))}
                  </ul>
                </aside>
                <div className="sc-chat">
                  <p className="sc-blase sc-blase--frage">{d.nachher.frage}</p>
                  <div className="sc-blase sc-blase--antwort">
                    <span className="sc-absender">KI</span>
                    <p>{d.nachher.antwort}</p>
                    <span className="sc-quelle">{d.nachher.quelle}</span>
                  </div>
                  <p className="sc-eingabe">Frag etwas …</p>
                </div>
              </div>
            </Laptop>
            <p className="wm-laptop-unter">{d.nachher.unter}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
