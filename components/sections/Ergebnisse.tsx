import Image from "next/image";
import { cta, ergebnisse } from "@/app/copy";
import Cta from "@/components/system/Cta";
import Rich from "@/components/system/Rich";
import { ArrowOut } from "@/components/system/Icons";
import CaseGraphic from "./CaseGraphic";
import ResDots from "./ResDots";

const KIND = { estera: "people", fuchs: "days" } as const;

/* Ergebnisse: Handy als wischbare Kartenreihe (Kennzahl zuerst), Tablet als Querkarten,
   ab 1280 px drei Spalten. Die dritte Referenz ist ein gestalteter Platzhalter ohne Browserrahmen. */
export default function Ergebnisse() {
  return (
    <section className="section res" id="ergebnisse" aria-labelledby="res-title">
      <div className="shell">
        {/* Überschrift steht für sich; die Projektzahl ist eine eigene, klar beschriftete Kennzahl
            (Handy und Tablet darunter als erste Zeile über den Karten, ab 1024 px rechts neben der Überschrift) */}
        <div className="res-head">
          <div className="res-head-copy">
            <p className="label" data-reveal="">
              {ergebnisse.label}
            </p>
            <h2 className="h2 res-title" id="res-title" data-split="">
              <Rich text={ergebnisse.title} />
            </h2>
          </div>
          <p className="res-stat" data-reveal="">
            <span className="res-stat-num" data-count="35" data-suffix="+">
              {ergebnisse.big}
            </span>
            <span className="res-stat-label">{ergebnisse.bigLabel}</span>
          </p>
        </div>

        <ul className="res-grid" id="res-track">
          {ergebnisse.cases.map((c) => (
            <li key={c.id} className={`res-card glass ${c.image ? "" : "res-card--tbd"}`} data-reveal="">
              <div className="res-result">
                <p className="res-num">
                  {c.resultNumber ? (
                    <span data-count={c.resultNumber} data-prefix={c.resultPrefix} data-suffix={c.resultSuffix}>
                      {c.resultText}
                    </span>
                  ) : (
                    <span>{c.resultText}</span>
                  )}
                </p>
                <p className="res-sub">{c.resultSub}</p>
              </div>

              <div className="res-visual">
                {c.image ? (
                  <div className="res-browser">
                    <div className="res-browser-bar" aria-hidden="true">
                      <i />
                      <i />
                      <i />
                      <span className="res-url">{c.link?.label}</span>
                    </div>
                    <div className="res-shot">
                      <Image src={c.image} alt={c.alt} width={1600} height={1000} sizes="(max-width: 699px) 84vw, (max-width: 1279px) 44vw, 440px" />
                    </div>
                  </div>
                ) : (
                  // Platzhalter: die Aussage selbst als Bild (Zeitbalken schrumpft von einem Tag auf 30 Minuten)
                  <div className="res-tbd">
                    <span>
                      <span className="res-tbd-num">{c.resultText}</span>
                      <span className="res-tbd-sub">{c.resultSub}</span>
                    </span>
                    <CaseGraphic kind="bar" />
                  </div>
                )}
              </div>

              <div className="res-body">
                <h3 className={c.image ? "h3 res-name" : "res-name res-name--tbd"}>{c.name}</h3>
                {c.branche ? <p className="res-branche">{c.branche}</p> : null}
                <p className="res-built-label">{ergebnisse.builtLabel}</p>
                <p className="body res-built">
                  <Rich text={c.built} />
                </p>
                <div className="res-trans">
                  {c.id in KIND ? <CaseGraphic kind={KIND[c.id as keyof typeof KIND]} /> : null}
                  <p>{c.translated}</p>
                </div>
                {c.link ? (
                  <a className="text-link res-link" href={c.link.href} target="_blank" rel="noopener noreferrer">
                    {c.link.label}
                    <ArrowOut />
                    <span className="sr-only">({ergebnisse.newWindow})</span>
                  </a>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
        <ResDots count={ergebnisse.cases.length} />

        <div className="res-cta" data-reveal="">
          <p className="res-cta-line">{ergebnisse.ctaLine}</p>
          <Cta href="#termin" className="btn-block-m">
            {cta.main}
          </Cta>
        </div>
      </div>
    </section>
  );
}
