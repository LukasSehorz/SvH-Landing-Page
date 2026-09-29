import type { ReactNode } from "react";
import Rich from "@/components/system/Rich";
import { PitchCenterMark } from "./PitchMark";

/**
 * Kopf der Unterseiten: Beschriftung, Überschrift (H1, mit Verlaufswort),
 * Einleitung. Dahinter ein leiser Lichtschleier, Punktraster und der fein
 * angedeutete Mittelkreis. Der Auftritt läuft rein per CSS (pages.css), ohne JavaScript.
 */
export default function PageHead({
  label,
  title,
  lead,
  quiet = false,
  className = "",
  children,
}: Readonly<{ label: string; title: string; lead?: string; quiet?: boolean; className?: string; children?: ReactNode }>) {
  return (
    <header className={`pg-head ${quiet ? "pg-head--quiet" : ""} ${className}`}>
      <div className="pg-head-bg" aria-hidden="true">
        <div className="pg-veil" />
        <div className="dots pg-dots" />
        <PitchCenterMark className="pg-pitch" />
      </div>
      <div className="shell pg-head-inner">
        <p className="label pg-in" style={{ "--i": 0 } as React.CSSProperties}>
          {label}
        </p>
        <h1 className="pg-title pg-in" style={{ "--i": 1 } as React.CSSProperties}>
          <Rich text={title} />
        </h1>
        {lead ? (
          <p className="lead pg-lead pg-in" style={{ "--i": 2 } as React.CSSProperties}>
            {lead}
          </p>
        ) : null}
        {children}
      </div>
    </header>
  );
}
