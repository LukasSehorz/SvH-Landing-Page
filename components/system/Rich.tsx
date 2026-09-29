import { Fragment } from "react";
import ScriptWord from "./ScriptWord";

/** Setzt *Wort* als Schreibschrift und _Wort_ als Verlaufswort. */
export default function Rich({ text, manualScript = false }: Readonly<{ text: string; manualScript?: boolean }>) {
  // Zahl und Einheit nie trennen (160 Std., 30 Min., 0 €)
  text = text.replace(/(\d+\+?) (Std\.|Min\.|€|Stunden|Minuten)/g, "$1\u00a0$2");
  const parts = text.split(/(\*[^*]+\*|_[^_]+_)/g).filter(Boolean);
  return (
    <>
      {parts.map((p, i) => {
        if (p.startsWith("*") && p.endsWith("*")) return <ScriptWord key={i} manual={manualScript}>{p.slice(1, -1)}</ScriptWord>;
        if (p.startsWith("_") && p.endsWith("_")) return <span key={i} className="grad">{p.slice(1, -1)}</span>;
        // Bindestrich-Wörter nicht am Bindestrich trennen (E-Mails, KI-Masterplan)
        return (
          <Fragment key={i}>
            {p.split(/(\b[A-ZÄÖÜ]{1,2}-[\wäöüßÄÖÜ]+)/g).map((w, j) => (j % 2 ? <span key={j} className="nb">{w}</span> : w))}
          </Fragment>
        );
      })}
    </>
  );
}

/** Reiner Text ohne Auszeichnung (für Metadaten, JSON-LD, Alt-Texte). */
export function plain(text: string): string {
  return text.replace(/[*_]/g, "");
}
