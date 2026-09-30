import { abschluss, geschenk } from "@/app/copy";
import { CoverPage } from "../geschenk/Masterplan";

/* Das Geschenk am Entscheidungsort (ab 1.000 px): das Deckblatt des KI-Masterplans
   im Hochformat, genau wie im Geschenk-Abschnitt (CoverPage aus Masterplan.tsx),
   leicht gekippt direkt unter der Überschrift, daneben eine kurze Zeile.
   Zwei eigene Rasterelemente (Blatt, Zeile), damit der Direktkontakt rechts neben
   dem Blatt unter der Zeile stehen kann (Raster in abschluss.css).
   Der „0 €“-Stempel auf dem Blatt ist zunächst unsichtbar; im Erfolgszustand
   setzt das Formular data-gesendet an #termin, dann legt er sich ruhig auf das
   Deckblatt (reine CSS-Überblendung). Mobil ausgeblendet: dort hat das Formular
   im ersten Bildschirm Vorrang. */

const D = geschenk.doc;
const G = abschluss.gift;

export default function Deckblatt() {
  return (
    <>
      <div className="abs-deck" role="img" aria-label={`${D.coverTitle} ${D.coverSub}, ${D.coverBy}`}>
        <div className="md" aria-hidden="true">
          <div className="md-box abs-deck-box">
            <CoverPage />
          </div>
        </div>
      </div>
      <p className="abs-gift-cap">
        <span className="abs-gift-rule" aria-hidden="true" />
        <span className="abs-gift-t">{G.title}</span>
        <span className="abs-gift-m">
          {G.when}
          <span className="nb">
            <span aria-hidden="true">{" · "}</span>
            <span className="abs-gift-p">{G.price}</span>
          </span>
        </span>
      </p>
    </>
  );
}
