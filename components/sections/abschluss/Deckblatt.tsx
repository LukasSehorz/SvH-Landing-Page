import { geschenk } from "@/app/copy";

/* Kleines Deckblatt des KI-Masterplans neben dem Formular (nur Desktop):
   das Geschenk steht genau am Entscheidungsort. Schlanke eigene Variante im
   Look des Dokuments aus dem Geschenk-Abschnitt (Papier, dunkles Band,
   Markenverlauf), eigene Stile in abschluss.css.
   Im Erfolgszustand setzt das Formular data-gesendet an #termin, dann legt
   sich der „0 €“-Stempel ruhig auf das Deckblatt (reine CSS-Überblendung). */

const D = geschenk.doc;

export default function Deckblatt() {
  return (
    <div className="deck" role="img" aria-label={`${D.coverTitle} ${D.coverSub}, ${D.coverBy}`}>
      <div className="deck-sheet" aria-hidden="true">
        <div className="deck-band">
          <span className="deck-mono" />
          <span className="deck-sample">{D.sample}</span>
        </div>
        <div className="deck-main">
          <span className="deck-title">{D.coverTitle}</span>
          <span className="deck-sub">{D.coverSub}</span>
        </div>
        <div className="deck-foot">
          <span className="deck-rule" />
          <span className="deck-by">{D.coverBy}</span>
        </div>
        <span className="deck-stamp">
          <svg viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="47" className="o" />
            <circle cx="50" cy="50" r="38" className="i" />
          </svg>
          <span className="deck-stamp-v">{geschenk.stamp}</span>
        </span>
      </div>
    </div>
  );
}
