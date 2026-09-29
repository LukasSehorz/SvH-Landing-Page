import { cta, spielzug } from "@/app/copy";
import Cta from "@/components/system/Cta";
import Rich from "@/components/system/Rich";
import Board from "./spielzug/Board";

/* „Der Spielzug“: der Ablauf in vier Schritten als Taktiktafel (Menü-Anker #fahrplan). */
export default function Spielzug() {
  return (
    <section className="section sz" id="fahrplan" aria-labelledby="sz-title">
      <div className="shell">
        <header className="sz-head">
          <p className="label" data-reveal="">
            {spielzug.label}
          </p>
          <h2 className="h2 sz-title" id="sz-title" data-reveal="">
            {spielzug.title.map((l) => (
              <span className="line" key={l}>
                <Rich text={l} />
              </span>
            ))}
          </h2>
        </header>

        <Board />

        <div className="sz-cta" data-reveal="">
          <Cta href="#termin" className="btn-block-m">
            {cta.main}
          </Cta>
        </div>
      </div>
    </section>
  );
}
