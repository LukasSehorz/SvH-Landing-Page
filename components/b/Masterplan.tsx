import Image from "next/image";
import { cta } from "@/app/copy";
import { masterplanB } from "@/app/copy-b";
import Cta from "@/components/system/Cta";
import Laptop from "./Laptop";
import { Haken } from "./ui";

/* Masterplan: dunkler Kasten mit Text links, rechts ragt ein Laptop mit dem Plan heraus
   (Vorbild: andreasbaulig.de „Unser System als Training“, etwas kleiner).
   Unter den Punkten steht der Preisanker „1.099 € → 0 €“ als kleines Preisschild (seit Runde 3 hier statt
   auf dem Workshop-Bild), direkt vor dem Knopf. Der Laptop ist reine Abbildung: Seine Mini-Schrift (7–9 px)
   ist für Screenreader ausgeblendet, alle Inhalte stehen links als Text. */
export default function Masterplan() {
  const d = masterplanB;
  return (
    <section className="mp" id="masterplan" aria-labelledby="mp-titel">
      <div className="mp-kasten" data-rv="">
        <div className="mp-text">
          <p className="b-label mp-label">{d.label}</p>
          <h2 className="mp-titel" id="mp-titel">
            {d.titel}
          </h2>
          <p className="mp-intro">{d.intro}</p>
          {d.punkte.map((p) => (
            <div key={p.titel} className="mp-punkt">
              <p className="mp-punkt-titel">{p.titel}</p>
              <p className="mp-punkt-text">{p.text}</p>
            </div>
          ))}
          <div className="mp-preis">
            <p className="mp-preis-titel">{d.preis.titel}</p>
            <p className="mp-preis-zeile">
              <del className="mp-preis-alt">
                <span className="sr-only">statt </span>
                {d.preis.alt}
              </del>
              <span className="mp-preis-neu">{d.preis.neu}</span>
            </p>
            <p className="mp-preis-text">{d.preis.text}</p>
          </div>
          <Cta href="#termin" className="mp-cta">
            {cta.main}
          </Cta>
        </div>

        <div className="mp-laptop" aria-hidden="true">
          <Laptop>
            <div className="sc-plan">
              <div className="sc-plan-deckblatt">
                <Image src="/logo/svh-bild-navy.webp" alt="" width={16} height={26} />
                <p className="sc-plan-titel">{d.doc.titel}</p>
                <p className="sc-plan-fuer">{d.doc.fuer}</p>
                <p className="sc-plan-von">{d.doc.von}</p>
              </div>
              <div className="sc-plan-seite">
                <p className="sc-plan-h">{d.doc.zeitfresser}</p>
                <ul className="sc-plan-balken">
                  {d.doc.balken.map((b, i) => (
                    <li key={b}>
                      <span>{b}</span>
                      <span className="sc-plan-bar" style={{ width: `${92 - i * 15}%` }} />
                    </li>
                  ))}
                </ul>
                <p className="sc-plan-h">{d.doc.top3}</p>
                <ol className="sc-plan-top">
                  {["Angebote automatisch", "E-Mail-Assistent", "Wissensspeicher"].map((t) => (
                    <li key={t}>
                      <Haken size={10} farbe="#16a34a" />
                      {t}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </Laptop>
        </div>
      </div>
    </section>
  );
}
