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
        <circle className="pm-draw pm-d3" pathLength={1} cx="300" cy="300" r="92" transform="rotate(90 300 300)" style={{ stroke: `url(#pmc-${id})`, opacity: 0.35 }} />
      </g>
      <circle className="pm-spot" cx="300" cy="300" r="3.5" />
    </svg>
  );
}

/** Strafraum mit Bogen, oben offen: Übergang über dem Abschluss. */
export function PitchBoxMark({ className = "" }: Readonly<{ className?: string }>) {
  const id = useId().replace(/:/g, "");
  return (
    <svg className={`pm ${className}`} viewBox="0 0 1000 220" preserveAspectRatio="xMidYMin meet" aria-hidden="true" focusable="false">
      <defs>
        <Grad id={`pmb-${id}`} x2={1000} y2={0} />
      </defs>
      <g className="pm-glow" style={{ stroke: `url(#pmb-${id})` }}>
        <path className="pm-draw" pathLength={1} d="M40 2 H 960" style={{ opacity: 0.5 }} />
        <path className="pm-draw pm-d2" pathLength={1} d="M250 2 V 120 H 750 V 2" />
        <path className="pm-draw pm-d3" pathLength={1} d="M410 120 A 110 110 0 0 0 590 120" />
      </g>
      <circle className="pm-spot" cx="500" cy="78" r="3" />
    </svg>
  );
}
