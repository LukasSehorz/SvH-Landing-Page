import Image from "next/image";
import { cta, ergebnisse } from "@/app/copy";
import Cta from "@/components/system/Cta";
import Rich from "@/components/system/Rich";
import { ArrowOut } from "@/components/system/Icons";
import CaseGraphic from "./CaseGraphic";

const KIND = { estera: "people", fuchs: "days", platzhalter: "shrink" } as const;

export default function Ergebnisse() {
  return (
    <section className="section res" id="ergebnisse" aria-labelledby="res-title">
      <div className="shell">
        <div className="res-head">
          <div className="res-big" data-reveal="">
            <span className="res-big-num" data-count="35" data-suffix="+">
              {ergebnisse.big}
            </span>
            <span className="res-big-label">{ergebnisse.bigLabel}</span>
          </div>
          <div>
            <p className="label" data-reveal="">
              {ergebnisse.label}
            </p>
            <h2 className="h2 res-title" id="res-title" data-split="">
              <Rich text={ergebnisse.title} />
            </h2>
          </div>
        </div>

        <ul className="res-grid">
          {ergebnisse.cases.map((c) => (
            <li key={c.id} className={`res-card glass ${c.image ? "" : "res-card--tbd"}`} data-reveal="">
              <div className="res-browser">
                <div className="res-browser-bar" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                  <span className="res-url">{c.link ? c.link.label : ""}</span>
                </div>
                <div className="res-shot">
                  {c.image ? (
                    <Image src={c.image} alt={c.alt} width={1600} height={1000} sizes="(max-width: 699px) 92vw, (max-width: 1099px) 46vw, 460px" />
                  ) : (
                    <div className="res-tbd" aria-hidden="true">
                      <span className="res-tbd-line w1" />
                      <span className="res-tbd-line w2" />
                      <span className="res-tbd-line w3" />
                    </div>
                  )}
                </div>
              </div>
              <div className="res-body">
                <h3 className="h3">{c.name}</h3>
                {c.branche ? <p className="res-branche">{c.branche}</p> : null}
                <p className="res-built-label">{ergebnisse.builtLabel}</p>
                <p className="body res-built">
                  <Rich text={c.built} />
                </p>
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
                <div className="res-trans">
                  <CaseGraphic kind={KIND[c.id as keyof typeof KIND]} />
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
