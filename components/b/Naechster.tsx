import Image from "next/image";
import { cta } from "@/app/copy";
import { company } from "@/app/content";
import { naechsterB } from "@/app/copy-b";
import Cta from "@/components/system/Cta";
import { Symbol } from "./ui";

/* Nächster Schritt (Vorbild: andreasbaulig.de „Überzeuge dich selbst. Ganz unverbindlich.“):
   links ragt eine helle Fläche mit dem Bild-Logo über einen dunklen Kasten, rechts Text und Knopf.
   Seit Runde 3 persönlich statt Wiederholung des Workshops: zwei Absätze, darunter der direkte Draht
   zu den Gründern (Telefon, Trefferfläche ≥ 44 px), dann der Schluss-Satz und der Knopf.
   Der Knopf öffnet die Anmeldung (FormDialog). Ziel aller Knöpfe: #termin. */
export default function Naechster() {
  return (
    <section className="nx" id="termin" aria-labelledby="nx-titel">
      <div className="nx-wrap" data-rv="">
        <div className="nx-bild" aria-hidden="true">
          <Image src="/logo/svh-bild-navy.webp" alt="" width={150} height={244} />
        </div>
        <div className="nx-kasten">
          <h2 className="nx-titel" id="nx-titel">
            {naechsterB.titel.map((z) => (
              <span key={z}>{z}</span>
            ))}
          </h2>
          {naechsterB.absaetze.map((a) => (
            <p key={a} className="nx-absatz">
              {a}
            </p>
          ))}
          <div className="nx-direkt">
            <p className="nx-direkt-text">{naechsterB.telefon}</p>
            <a className="nx-tel" href={`tel:${company.phoneHref}`}>
              <span className="nx-tel-symbol" aria-hidden="true">
                <Symbol name="telefon" size={18} farbe="#cfc2ff" />
              </span>
              {company.phone}
            </a>
          </div>
          <p className="nx-schluss">{naechsterB.schluss}</p>
          <Cta href="#termin" className="nx-cta">
            {cta.main}
          </Cta>
        </div>
      </div>
    </section>
  );
}
