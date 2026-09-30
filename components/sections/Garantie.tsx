import { Fragment } from "react";
import { cta, garantie } from "@/app/copy";
import Cta from "@/components/system/Cta";
import Rich from "@/components/system/Rich";
import GarantieSeal from "./GarantieSeal";

/* Garantie: seriös und klar. Prägesiegel, drei Schritte, Kleingedrucktes in der Kapsel. */
export default function Garantie() {
  return (
    <section className="section gar" id="garantie" aria-labelledby="gar-title">
      <div className="shell gar-grid">
        <div className="gar-seal-wrap" data-reveal="">
          <GarantieSeal />
        </div>
        <div className="gar-copy">
          <p className="label" data-reveal="">
            {garantie.label}
          </p>
          <h2 className="h2 gar-title" id="gar-title">
            {garantie.title.map((l, i) => (
              <Fragment key={l}>
                {i > 0 ? " " : null}
                <span className="line" data-split="">
                  <Rich text={l} />
                </span>
              </Fragment>
            ))}
          </h2>
          <p className="lead gar-text" data-reveal="">
            <Rich text={garantie.text} />
          </p>
          <ol className="gar-steps">
            {garantie.steps.map((s, i) => (
              <li key={s.title} className="gar-step" data-reveal="">
                <span className="gar-num" aria-hidden="true">
                  {i + 1}
                </span>
                <div>
                  <h3 className="gar-step-title">{s.title}</h3>
                  <p className="body">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="gar-capsule" data-reveal="">
            {garantie.small}
          </p>
          <div className="gar-cta" data-reveal="">
            <Cta href="#termin" className="btn-block-m">
              {cta.main}
            </Cta>
          </div>
        </div>
      </div>
    </section>
  );
}
