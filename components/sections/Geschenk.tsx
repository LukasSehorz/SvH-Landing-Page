import { cta, geschenk } from "@/app/copy";
import Cta from "@/components/system/Cta";
import Rich from "@/components/system/Rich";
import GeschenkStage from "./geschenk/GeschenkStage";

/* ====================================================================
   „Das Geschenk“: der kostenlose KI-Masterplan als Produkt, das man in
   der Hand hält. Kopf und Kasten „Warum wir das verschenken“ sind
   Server-HTML, die Bühne mit Dokument und Punkten ist GeschenkStage.
   ==================================================================== */

function Gift() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3.5" y="8.25" width="17" height="4.25" rx="1.2" />
        <path d="M5.25 12.5v6.75c0 .69.56 1.25 1.25 1.25h11c.69 0 1.25-.56 1.25-1.25V12.5" />
        <path d="M12 8.25V20.5" />
        <path d="M12 8.25C11 5.6 8.9 4 7.55 4.9c-1.2.8-.4 3.35 4.45 3.35Z" />
        <path d="M12 8.25C13 5.6 15.1 4 16.45 4.9c1.2.8.4 3.35-4.45 3.35Z" />
      </g>
    </svg>
  );
}

export default function Geschenk() {
  return (
    <section className="section gs" id="masterplan" aria-labelledby="gs-title">
      <div className="gs-bg" aria-hidden="true">
        <div className="gs-veil" />
      </div>

      <div className="shell gs-grid">
        <div className="gs-head">
          <p className="label" data-reveal="">
            {geschenk.label}
          </p>
          <h2 className="h2 gs-title" id="gs-title">
            <span className="line" data-split="">
              {geschenk.title[0]}
            </span>
            <span className="line gs-title-script">
              <Rich text={geschenk.title[1]} />
            </span>
          </h2>
          <p className="lead gs-lead" data-reveal="">
            <Rich text={geschenk.text} />
          </p>
        </div>

        <GeschenkStage />

        <div className="gs-foot">
          <div className="gs-why glass" data-reveal="">
            <span className="gs-why-icon">
              <Gift />
            </span>
            <h3 className="h3 gs-why-t">{geschenk.whyTitle}</h3>
            <p className="body gs-why-x">
              <Rich text={geschenk.whyText} />
            </p>
          </div>
          <div className="gs-cta" data-reveal="">
            <Cta href="#termin" className="btn-block-m">
              {cta.main}
            </Cta>
          </div>
        </div>
      </div>
    </section>
  );
}
