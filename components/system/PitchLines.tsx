import { useId } from "react";

/**
 * Motiv „Spielfeldlinien“: leuchtende Linien in 1–1,5 px, Blau → Violett.
 * Pfade mit data-draw zeichnen sich beim Scrollen (Reveals.tsx), im
 * Server-HTML stehen sie fertig gezeichnet.
 */

function Grad({ id, w, h = 0, vertical = false }: { id: string; w: number; h?: number; vertical?: boolean }) {
  return (
    <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={vertical ? 0 : w} y2={vertical ? h : 0}>
      <stop offset="0" stopColor="#5b8cff" />
      <stop offset="0.55" stopColor="#7c6aff" />
      <stop offset="1" stopColor="#9d8cff" />
    </linearGradient>
  );
}

/** Mittelkreis, Mittellinie und Anstoßpunkt, hinter dem KI-Kern. */
export function PitchCenter({ className = "" }: Readonly<{ className?: string }>) {
  const id = useId().replace(/:/g, "");
  return (
    <svg className={`pitch ${className}`} viewBox="0 0 600 600" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <defs>
        <Grad id={`pc-${id}`} w={600} h={600} vertical />
        <linearGradient id={`pl-${id}`} gradientUnits="userSpaceOnUse" x1="0" y1="20" x2="0" y2="580">
          <stop offset="0" stopColor="#6b78ff" stopOpacity="0" />
          <stop offset="0.3" stopColor="#6b78ff" stopOpacity="0.55" />
          <stop offset="0.7" stopColor="#8a7bff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#8a7bff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g className="glow">
        <circle data-draw="" pathLength={1} cx="300" cy="300" r="214" style={{ stroke: `url(#pc-${id})`, opacity: 0.75 }} transform="rotate(-90 300 300)" />
        <path data-draw="" pathLength={1} d="M300 20 V 580" style={{ stroke: `url(#pl-${id})` }} />
      </g>
      <circle className="spot" cx="300" cy="300" r="3.5" style={{ fill: "#b9a5ff" }} />
    </svg>
  );
}

/** Übergang zwischen Abschnitten: Strafraumkante mit Bogen, Mittelkreis oder Eckbögen. */
export function Divider({ variant = "arc" }: Readonly<{ variant?: "arc" | "half" | "corner" }>) {
  const id = useId().replace(/:/g, "");
  const s = { stroke: `url(#dv-${id})` };
  return (
    <div className="divider" data-draw-root="" aria-hidden="true">
      <svg className="pitch" viewBox="0 0 1200 150" preserveAspectRatio="xMidYMin meet">
        <defs>
          <Grad id={`dv-${id}`} w={1200} />
        </defs>
        <g className="glow">
          {variant === "arc" ? (
            <>
              <path data-draw="" pathLength={1} style={s} d="M40 22 H 1160" opacity="0.55" />
              <path data-draw="" pathLength={1} style={s} d="M470 22 A 150 150 0 0 0 730 22" />
              <circle className="spot" cx="600" cy="22" r="3" style={{ fill: "#9d8cff" }} />
            </>
          ) : null}
          {variant === "half" ? (
            <>
              <path data-draw="" pathLength={1} style={s} d="M40 16 H 1160" opacity="0.55" />
              <path data-draw="" pathLength={1} style={s} d="M480 16 A 120 120 0 0 0 720 16" />
              <circle className="spot" cx="600" cy="16" r="3" style={{ fill: "#9d8cff" }} />
            </>
          ) : null}
          {variant === "corner" ? (
            <>
              <path data-draw="" pathLength={1} style={s} d="M40 130 V 40 A 26 26 0 0 0 66 14 H 520" />
              <path data-draw="" pathLength={1} style={s} d="M1160 130 V 40 A 26 26 0 0 1 1134 14 H 680" />
            </>
          ) : null}
        </g>
      </svg>
    </div>
  );
}
