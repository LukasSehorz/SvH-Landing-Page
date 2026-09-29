/* Spielfeldlinien hinter dem Abschluss: Torlinie, Strafraum, Torraum,
   Elfmeterpunkt und Teilkreis, von oben gesehen. Der Abschluss ist der Torschuss.
   Die Linien zeichnen sich beim Scrollen (data-draw, Reveals.tsx). */
export default function Strafraum() {
  return (
    <svg className="pitch abs-pitch" viewBox="0 0 1200 300" preserveAspectRatio="xMidYMin meet" data-draw-root="" aria-hidden="true">
      <defs>
        <linearGradient id="abs-goal" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1200" y2="0">
          <stop offset="0" stopColor="#5b8cff" stopOpacity="0" />
          <stop offset="0.25" stopColor="#5b8cff" stopOpacity="0.9" />
          <stop offset="0.5" stopColor="#7c6aff" />
          <stop offset="0.75" stopColor="#9d8cff" stopOpacity="0.9" />
          <stop offset="1" stopColor="#9d8cff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="abs-box" gradientUnits="userSpaceOnUse" x1="330" y1="0" x2="870" y2="0">
          <stop offset="0" stopColor="#5b8cff" />
          <stop offset="0.55" stopColor="#7c6aff" />
          <stop offset="1" stopColor="#9d8cff" />
        </linearGradient>
      </defs>
      <path data-draw="" pathLength={1} d="M0 24 H 1200" style={{ stroke: "url(#abs-goal)" }} />
      <path data-draw="" pathLength={1} d="M548 24 V 8 H 652 V 24" style={{ stroke: "url(#abs-box)" }} />
      <path data-draw="" pathLength={1} d="M470 24 V 84 H 730 V 24" style={{ stroke: "url(#abs-box)" }} />
      <path data-draw="" pathLength={1} d="M330 24 V 204 H 870 V 24" style={{ stroke: "url(#abs-box)" }} />
      <path data-draw="" pathLength={1} d="M502 204 A 110 110 0 0 0 698 204" style={{ stroke: "url(#abs-box)" }} />
      <circle className="spot" cx="600" cy="154" r="2.6" />
    </svg>
  );
}
