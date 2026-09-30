import { abschluss } from "@/app/copy";
import { company } from "@/app/content";
import Rich from "@/components/system/Rich";
import { Clock, Mail, Phone } from "@/components/system/Icons";
import Formular from "./abschluss/LazyFormular";
import { Haken } from "./abschluss/Symbole";
import Deckblatt from "./abschluss/Deckblatt";

/* Abschluss (#termin): Überschrift, Formular in drei Schritten, Direktkontakt.
   Hintergrund: nur ein ruhiger Lichtschein. Flutlicht-Foto (unscharf hinter Text)
   und Strafraum-Linien (lagen unter der Menüleiste) sind bewusst weggelassen.
   data-hide-mobile-cta: solange dieser Bereich im Bild ist, blendet die feste
   CTA-Leiste (MobileCta) aus, damit sie keine Felder verdeckt. */

const [mailUser, mailDomain] = company.email.split("@");

export default function Abschluss() {
  return (
    <section className="section abs" id="termin" aria-labelledby="abs-title" data-hide-mobile-cta="">
      <div className="abs-bg" aria-hidden="true">
        <div className="abs-glow" />
      </div>

      <div className="shell abs-grid">
        {/* Ziel aller Knöpfe: hier wird nichts eingeblendet, alles steht sofort da
            (auch das Schreibschrift-Wort bleibt im Endzustand, data-script="manual"). */}
        <div className="abs-head">
          <p className="label">{abschluss.label}</p>
          <h2 className="h2 abs-title" id="abs-title">
            <Rich text={abschluss.title} manualScript />
          </h2>
          <p className="lead abs-text">
            <Rich text={abschluss.text} />
          </p>
          {/* ab 1.000 px: das Geschenk in der Blicklinie zum Formular; mobil ausgeblendet */}
          <Deckblatt />
        </div>

        <div className="abs-form">
          <noscript>
            <p className="abs-noscript">
              {abschluss.noscriptBefore}
              <a href={`tel:${company.phoneHref}`}>{company.phone}</a>
              {abschluss.errorMid}
              <a href={`mailto:${company.email}`}>{company.email}</a>
              {abschluss.errorAfter}
            </p>
          </noscript>
          <Formular />
          <ul className="abs-below">
            {abschluss.below.split(" · ").map((b) => (
              <li key={b}>
                <Haken size={13} />
                {b}
              </li>
            ))}
          </ul>
        </div>

        {/* Nur der Direktkontakt blendet beim normalen Hineinscrollen ein. Nach einem Knopf-
            oder Menü-Sprung steht er sofort (Reveals stellt den Zielbereich fertig hin). */}
        <aside className="abs-side abs-direct" aria-labelledby="abs-direct-title" data-reveal="">
          <p className="abs-direct-title" id="abs-direct-title">
            {abschluss.direct.title}
          </p>
          <ul className="abs-direct-list">
            <li>
              <a className="abs-direct-row" href={`tel:${company.phoneHref}`}>
                <Phone size={16} />
                <span className="abs-direct-val nb">{company.phone}</span>
              </a>
            </li>
            <li>
              <a className="abs-direct-row" href={`mailto:${company.email}`}>
                <Mail size={16} />
                <span className="abs-direct-val">
                  {mailUser}
                  <wbr />@{mailDomain}
                </span>
              </a>
            </li>
            <li className="abs-direct-row abs-direct-row--static">
              <Clock size={16} />
              <span className="abs-direct-val">{abschluss.direct.hours.replace(/(\d+) Uhr/, "$1\u00a0Uhr")}</span>
            </li>
          </ul>
        </aside>
      </div>
    </section>
  );
}
