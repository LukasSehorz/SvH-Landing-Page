/** Gemeinsame Verläufe für SVG-Striche (nicht display:none, sonst greifen sie nicht). */
export default function SvgDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="swoosh-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#7c6aff" />
          <stop offset="1" stopColor="#b9a5ff" />
        </linearGradient>
        <linearGradient id="brand-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#5b8cff" />
          <stop offset="0.48" stopColor="#7c6aff" />
          <stop offset="1" stopColor="#b9a5ff" />
        </linearGradient>
      </defs>
    </svg>
  );
}
