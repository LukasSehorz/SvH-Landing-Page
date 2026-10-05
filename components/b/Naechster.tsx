import Image from "next/image";
import { cta } from "@/app/copy";
import { naechsterB } from "@/app/(b)/copy";
import Cta from "@/components/system/Cta";

/* Nächster Schritt (Vorbild: andreasbaulig.de „Überzeuge dich selbst. Ganz unverbindlich.“):
   links ragt eine helle Fläche mit dem Bild-Logo über einen schwarzen Kasten, rechts Text und Knopf.
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
          <Cta href="#termin" className="nx-cta">
            {cta.main}
          </Cta>
        </div>
      </div>
    </section>
  );
}
