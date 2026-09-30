import Board from "./spielzug/Board";

/* „Der Spielzug“: der Ablauf in vier Schritten als Taktiktafel (Menü-Anker #fahrplan).
   Kopf, Tafel und Knopf liegen gemeinsam in Board, damit sie zusammen gepinnt werden. */
export default function Spielzug() {
  return (
    <section className="section sz" id="fahrplan" aria-labelledby="sz-title">
      <div className="shell">
        <Board />
      </div>
    </section>
  );
}
