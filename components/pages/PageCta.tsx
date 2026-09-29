import { abschluss, cta, hero } from "@/app/copy";
import Cta from "@/components/system/Cta";
import Rich from "@/components/system/Rich";
import { PitchArcMark } from "./PitchMark";

/**
 * Kompakter Abschluss der Unterseiten: dieselben Texte wie der Abschluss der
 * Startseite, ein Knopf zum Formular (/#termin).
 */
export default function PageCta() {
  return (
    <section className="pg-cta" aria-labelledby="pg-cta-title">
      <div className="shell">
        <div className="pg-cta-card glass" data-reveal="">
          <div className="pg-cta-bg" aria-hidden="true">
            <div className="pg-cta-veil" />
            <PitchArcMark className="pg-cta-pitch" />
          </div>
          <p className="label">{abschluss.label}</p>
          <h2 className="h2 pg-cta-title" id="pg-cta-title">
            <Rich text={abschluss.title} />
          </h2>
          <p className="lead pg-cta-text">
            <Rich text={abschluss.text} />
          </p>
          <div className="pg-cta-actions">
            <Cta href="/#termin" className="btn-block-m">
              {cta.main}
            </Cta>
            <p className="pg-cta-sub">
              <Rich text={hero.sub} />
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
