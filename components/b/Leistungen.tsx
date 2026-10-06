import Image from "next/image";
import { cta } from "@/app/copy";
import { workshopB } from "@/app/copy-b";
import Cta from "@/components/system/Cta";
import { Grad, Haken, stufe } from "./ui";

/* Stufe 0: der kostenlose KI-Workshop als Fahrplan in drei Schritten (Überblick aller Stufen: Unendlich.tsx).
   Die früheren Detail-Abschnitte (Automatisierung, Assistenten, Wissen) ersetzt seit 06.10.2026 Loesungen.tsx. */

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
            <p className="b-label">{workshopB.label}</p>
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
