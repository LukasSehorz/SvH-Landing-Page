"use client";

import { useRef } from "react";
import { useEntrance } from "@/lib/hooks";

/* Übersetzungszeile als kleine Grafik: Personen leuchten auf, Tagesbalken füllen sich,
   Zeitbalken schrumpft. Im Server-HTML steht der Endzustand. */

function Person() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
      <circle cx="12" cy="7.5" r="4" />
      <path d="M4 21c.6-4.4 3.8-7 8-7s7.4 2.6 8 7" />
    </svg>
  );
}

export default function CaseGraphic({ kind }: Readonly<{ kind: "people" | "days" | "shrink" | "bar" }>) {
  const ref = useRef<HTMLDivElement>(null);
  const state = useEntrance(ref, 0.6);
  const on = state !== "hidden";
  return (
    <div ref={ref} className={`cg cg-${kind}`} data-on={on ? "true" : "false"} aria-hidden="true">
      {kind === "people" ? (
        <div className="cg-people">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} style={{ transitionDelay: `${0.15 + i * 0.22}s` }}>
              <Person />
            </span>
          ))}
        </div>
      ) : null}
      {kind === "days" ? (
        <div className="cg-days">
          <span className="cg-day">
            <i style={{ transitionDelay: "0.1s" }} />
          </span>
          <span className="cg-day">
            <i style={{ transitionDelay: "0.8s", ["--fill" as string]: "0.875" }} />
          </span>
        </div>
      ) : null}
      {kind === "bar" ? (
        <div className="cg-bigbar">
          <span className="cg-bigbar-track">
            <i />
          </span>
        </div>
      ) : null}
      {kind === "shrink" ? (
        <div className="cg-shrink">
          <span className="cg-bar">
            <i />
          </span>
        </div>
      ) : null}
    </div>
  );
}
