import { Fragment, type CSSProperties } from "react";
import { loesungen } from "@/app/copy";
import Rich from "@/components/system/Rich";
import { Arrow } from "@/components/system/Icons";
import LoesungIcon, { LoesungIconDefs } from "./loesungen/LoesungIcon";

/* ====================================================================
   „Lösungen“: welche KI-Helfer wir bauen, auf einen Blick.
   Handy: drei kurze Listen (Icon links, Titel und Satz rechts), einspaltig.
   Tablet bis 1279 px: zwei Spalten (Wissen + Kommunikation | Abläufe), gleich lang.
   Ab 1280 px: ruhiges Raster aus fünf Spalten mit Glaskarten,
   Reihe 1 Wissen (2) + Kommunikation (3), Reihe 2 Abläufe (5).
   Einblendung über die seitenweiten Reveals (nur opacity/transform),
   im Server-HTML steht alles sichtbar.
   ==================================================================== */

// Schlusszeile: erster Satz als Frage, der Rest wird zum stillen Link auf das Formular
function splitMore(text: string): [string, string] {
  const m = text.match(/^(.+?[?.!])\s+(.+)$/);
  return m ? [m[1], m[2]] : ["", text];
}

export default function Loesungen() {
  const [ask, answer] = splitMore(loesungen.more);
  // letztes Wort und Pfeil bleiben zusammen (kein einsamer Pfeil in der nächsten Zeile)
  const cut = answer.lastIndexOf(" ");
  const answerHead = cut > 0 ? answer.slice(0, cut + 1) : "";
  const answerTail = cut > 0 ? answer.slice(cut + 1) : answer;
  return (
    <section className="section loe" id="loesungen" aria-labelledby="loe-title">
      <LoesungIconDefs />
      <div className="shell">
        <div className="loe-head">
          <div className="loe-head-copy">
            <p className="label" data-reveal="">
              {loesungen.label}
            </p>
            <h2 className="h2 loe-title" id="loe-title" data-split="">
              <Rich text={loesungen.title} />
            </h2>
          </div>
          <p className="lead loe-text" data-reveal="">
            <Rich text={loesungen.text} />
          </p>
        </div>

        <div className="loe-groups">
          {loesungen.groups.map((g) => (
            <div key={g.id} className={`loe-group loe-group--${g.id}`} style={{ "--n": g.items.length } as CSSProperties}>
              <h3 className="loe-group-title" data-reveal="">
                <span>{g.title}</span>
              </h3>
              <ul className="loe-list">
                {g.items.map((it) => (
                  <li key={it.id} className="loe-item glass" data-reveal="">
                    <span className="loe-icon" aria-hidden="true">
                      <LoesungIcon id={it.id} />
                    </span>
                    <div className="loe-copy">
                      <h4 className="loe-item-title">
                        <Rich text={it.title} />
                      </h4>
                      <p className="loe-item-text">
                        <Rich text={it.text} />
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="loe-foot">
          <div className="loe-tools" data-reveal="">
            <span className="loe-tools-label">{loesungen.toolsLabel}</span>{" "}
            <ul className="loe-tools-list">
              {loesungen.tools.map((t, i) => (
                // Leerzeichen zwischen den Namen: Umbruch nur nach dem Trenner
                <Fragment key={t}>
                  {i > 0 ? " " : null}
                  <li>{t}</li>
                </Fragment>
              ))}
            </ul>
          </div>
          <p className="loe-more" data-reveal="">
            {ask ? <span className="loe-more-ask">{ask} </span> : null}
            <a href="#termin" className="loe-link">
              {answerHead}
              <span className="nb">
                {answerTail}
                <Arrow size={16} className="loe-link-arrow" />
              </span>
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
