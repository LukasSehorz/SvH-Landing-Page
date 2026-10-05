import Image from "next/image";
import { cta } from "@/app/copy";
import { masterplanB } from "@/app/(b)/copy";
import Cta from "@/components/system/Cta";
import Laptop from "./Laptop";
import { Haken } from "./ui";

/* Masterplan: schwarzer Kasten mit Text links, rechts ragt ein Laptop mit dem Plan heraus
   (Vorbild: andreasbaulig.de „Unser System als Training“, etwas kleiner). */
export default function Masterplan() {
  const d = masterplanB;
  return (
    <section className="mp" aria-labelledby="mp-titel">
      <div className="mp-kasten" data-rv="">
        <div className="mp-text">
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
          <Cta href="#termin" className="mp-cta">
            {cta.main}
          </Cta>
        </div>

        <div className="mp-laptop">
          <Laptop label="Beispiel eines KI-Masterplans">
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
