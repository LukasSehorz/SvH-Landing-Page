import Image from "next/image";
import { abschluss } from "@/app/copy";
import { company } from "@/app/content";
import { media } from "@/app/generated/media";
import Rich from "@/components/system/Rich";
import { Clock, Mail, Phone } from "@/components/system/Icons";
import Formular from "./abschluss/Formular";
import Strafraum from "./abschluss/Strafraum";
import { Schloss } from "./abschluss/Symbole";

/* Abschluss (#termin): Überschrift, Formular in drei Schritten, Direktkontakt.
   Hintergrund: sehr dezentes Flutlicht und der Strafraum als Spielfeldlinie.
   data-hide-mobile-cta: solange dieser Bereich im Bild ist, blendet die feste
   CTA-Leiste (MobileCta) aus, damit sie keine Felder verdeckt. */

const flutlicht = media.flutlicht?.[0] ?? null;
const [mailUser, mailDomain] = company.email.split("@");

export default function Abschluss() {
  return (
    <section className="section abs" id="termin" aria-labelledby="abs-title" data-hide-mobile-cta="">
      <div className="abs-bg" aria-hidden="true">
        {flutlicht ? (
          <div className="abs-flood">
            <Image src={flutlicht.src} alt="" fill sizes="100vw" quality={70} />
          </div>
        ) : null}
        <Strafraum />
      </div>

      <div className="shell abs-grid">
        <div className="abs-head">
          <p className="label" data-reveal="">
            {abschluss.label}
          </p>
          <h2 className="h2 abs-title" id="abs-title" data-reveal="">
            <Rich text={abschluss.title} />
          </h2>
          <p className="lead abs-text" data-reveal="">
            <Rich text={abschluss.text} />
          </p>
        </div>

        <div className="abs-form">
          <Formular />
          <p className="abs-below">
            <Schloss />
            <span>{abschluss.below}</span>
          </p>
        </div>

        <aside className="abs-direct" aria-labelledby="abs-direct-title">
          <p className="abs-direct-title" id="abs-direct-title">
            {abschluss.direct.title}
          </p>
          <ul className="abs-direct-list">
            <li>
              <a className="abs-direct-row" href={`tel:${company.phoneHref}`}>
                <span className="abs-direct-ic">
                  <Phone />
                </span>
                <span className="abs-direct-val nb">{company.phone}</span>
              </a>
            </li>
            <li>
              <a className="abs-direct-row" href={`mailto:${company.email}`}>
                <span className="abs-direct-ic">
                  <Mail />
                </span>
                <span className="abs-direct-val">
                  {mailUser}
                  <wbr />@{mailDomain}
                </span>
              </a>
            </li>
            <li>
              <p className="abs-direct-row abs-direct-row--static">
                <span className="abs-direct-ic">
                  <Clock />
                </span>
                <span className="abs-direct-val abs-direct-val--sm">{abschluss.direct.hours}</span>
              </p>
            </li>
          </ul>
        </aside>
      </div>
    </section>
  );
}
