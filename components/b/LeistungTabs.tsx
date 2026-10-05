"use client";

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Haken } from "./ui";

/* Klickbare Punkte einer Leistung: links (oder rechts) die Kästen, daneben das passende Beispiel.
   Barrierefrei als Tabs (Pfeiltasten hoch/runter, Pos1/Ende). */

export type Tab = { id: string; titel: string; text: string; bild: ReactNode };

export default function LeistungTabs({ tabs, listeRechts = false, beispiel }: { tabs: Tab[]; listeRechts?: boolean; beispiel: string }) {
  const uid = useId();
  const [aktiv, setAktiv] = useState(0);
  const knoepfe = useRef<(HTMLButtonElement | null)[]>([]);

  const gehe = (i: number) => {
    const n = (i + tabs.length) % tabs.length;
    setAktiv(n);
    knoepfe.current[n]?.focus();
  };
  const taste = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") gehe(aktiv + 1);
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") gehe(aktiv - 1);
    else if (e.key === "Home") gehe(0);
    else if (e.key === "End") gehe(tabs.length - 1);
    else return;
    e.preventDefault();
  };
  const t = tabs[aktiv];

  return (
    <div className={`lt-tabs${listeRechts ? " lt-tabs--rechts" : ""}`}>
      <div className="lt-liste" role="tablist" aria-orientation="vertical" onKeyDown={taste}>
        {tabs.map((tab, i) => (
          <button
            key={tab.id}
            ref={(el) => {
              knoepfe.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${uid}-tab-${tab.id}`}
            aria-selected={i === aktiv}
            aria-controls={`${uid}-panel`}
            tabIndex={i === aktiv ? 0 : -1}
            className="lt-knopf"
            onClick={() => setAktiv(i)}
          >
            <Haken size={24} />
            <span className="lt-knopf-titel">{tab.titel}</span>
            <svg className="lt-knopf-pfeil" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d={listeRechts ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} />
            </svg>
          </button>
        ))}
      </div>

      <div className="lt-panel" role="tabpanel" id={`${uid}-panel`} aria-labelledby={`${uid}-tab-${t.id}`} tabIndex={0}>
        <div className="lt-panel-inhalt" key={t.id}>
          <p className="lt-panel-label">{beispiel}</p>
          <h3 className="lt-panel-titel">{t.titel}</h3>
          <p className="lt-panel-text">{t.text}</p>
          <div className="lt-panel-bild">{t.bild}</div>
        </div>
      </div>
    </div>
  );
}
