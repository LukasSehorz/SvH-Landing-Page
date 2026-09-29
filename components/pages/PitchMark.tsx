import { useId } from "react";

/**
 * Spielfeldlinien für die Unterseiten (Kopf, Abschluss, 404).
 * Die Linien zeichnen sich per CSS beim Laden (pages.css, .pm-draw),
 * ohne JavaScript und bei reduzierter Bewegung stehen sie fertig da.
 */

function Grad({ id, x2 = 0, y2 = 600 }: { id: string; x2?: number; y2?: number }) {
  return (
    <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={x2} y2={y2}>
      <stop offset="0" stopColor="#5b8cff" />
      <stop offset="0.55" stopColor="#7c6aff" />
      <stop offset="1" stopColor="#9d8cff" />
    </linearGradient>
  );
}

/** Mittelkreis mit Mittellinie, angeschnitten am Rand des Kopfes. */
export function PitchCenterMark({ className = "" }: Readonly<{ className?: string }>) {
  const id = useId().replace(/:/g, "");
  return (
    <svg className={`pm ${className}`} viewBox="0 0 600 600" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
      <defs>
        <Grad id={`pmc-${id}`} />
        <linearGradient id={`pml-${id}`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="600">
          <stop offset="0" stopColor="#6b78ff" stopOpacity="0" />
          <stop offset="0.35" stopColor="#6b78ff" stopOpacity="0.6" />
          <stop offset="0.75" stopColor="#8a7bff" stopOpacity="0.5" />
          <stop offset="1" stopColor="#8a7bff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g className="pm-glow">
        <circle className="pm-draw" pathLength={1} cx="300" cy="300" r="214" transform="rotate(-90 300 300)" style={{ stroke: `url(#pmc-${id})` }} />
        <path className="pm-draw pm-d2" pathLength={1} d="M300 0 V 600" style={{ stroke: `url(#pml-${id})` }} />
      </g>
      <circle className="pm-spot" cx="300" cy="300" r="3.5" />
    </svg>
  );
}

/** Flacher Strafraumbogen, hängt oben in der Abschlusskarte (endet über der Beschriftung). */
export function PitchArcMark({ className = "" }: Readonly<{ className?: string }>) {
  const id = useId().replace(/:/g, "");
  return (
    <svg className={`pm ${className}`} viewBox="0 0 1000 200" preserveAspectRatio="xMidYMin meet" aria-hidden="true" focusable="false">
      <defs>
        <Grad id={`pma-${id}`} x2={1000} y2={0} />
      </defs>
      <g className="pm-glow" style={{ stroke: `url(#pma-${id})` }}>
        <path className="pm-draw" pathLength={1} d="M300 0 A 700 700 0 0 0 700 0" />
      </g>
      <circle className="pm-spot" cx="500" cy="0" r="3" />
    </svg>
  );
}
