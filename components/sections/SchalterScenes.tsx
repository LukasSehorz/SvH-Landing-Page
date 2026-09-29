/* ====================================================================
   Mini-Szenen der vier Karten (reines SVG + CSS-Keyframes, sehr leicht).
   Ohne KI: grau, Stapel wackeln, Sanduhr dreht sich.
   Mit KI: Verlaufsstriche, geordnete Abläufe im Stil der alten KiTiles.
   Abgespielt wird nur, solange der Abschnitt im Bild ist (data-play).
   ==================================================================== */

const G = "url(#brand-grad)";

function Hourglass({ x, y }: { x: number; y: number }) {
  return (
    <g className="sc-hourglass" style={{ transformOrigin: `${x}px ${y}px` }}>
      <path d={`M${x - 9} ${y - 13} h18 M${x - 9} ${y + 13} h18 M${x - 7} ${y - 13} c0 8 14 8 14 13 s-14 5 -14 13 M${x + 7} ${y - 13} c0 8 -14 8 -14 13 s14 5 14 13`} />
      <path className="sc-sand" d={`M${x - 3} ${y + 10} h6 l-3 -4z`} />
    </g>
  );
}

function PaperStack({ x, y, lines = 3 }: { x: number; y: number; lines?: number }) {
  return (
    <g>
      {[-7, 4, -2].map((r, i) => (
        <g key={i} className="sc-still" style={{ transformOrigin: `${x + 34}px ${y + 44}px`, animationDelay: `${i * -0.4}s`, rotate: `${r}deg` }}>
          <rect x={x + i * 5} y={y - i * 6} width="68" height="86" rx="5" className="sc-paper" />
          {Array.from({ length: lines }).map((_, k) => (
            <path key={k} d={`M${x + 10 + i * 5} ${y + 16 + k * 12 - i * 6} h${38 - k * 6}`} className="sc-line" />
          ))}
        </g>
      ))}
    </g>
  );
}

/* ------------------------------------------------------------ Ohne */

function OffScene({ id }: { id: string }) {
  return (
    <g className="sc-off">
      {id === "angebote" ? (
        <>
          <PaperStack x={70} y={40} />
          <PaperStack x={160} y={34} lines={4} />
        </>
      ) : null}
      {id === "emails" ? (
        <>
          {[0, 1, 2, 3].map((i) => (
            <g key={i} className="sc-still" style={{ transformOrigin: "150px 80px", animationDelay: `${i * -0.3}s` }}>
              <rect x={78 + i * 16} y={38 + i * 14} width="92" height="58" rx="6" className="sc-paper" style={{ rotate: `${(i % 2 ? 1 : -1) * (3 + i)}deg` }} />
              <path d={`M${78 + i * 16} ${40 + i * 14} l46 30 46 -30`} className="sc-line" style={{ rotate: `${(i % 2 ? 1 : -1) * (3 + i)}deg` }} />
            </g>
          ))}
          <circle cx="206" cy="42" r="7" className="sc-badge" />
        </>
      ) : null}
      {id === "wissen" ? (
        <>
          {[0, 1, 2].map((i) => (
            <g key={i} className="sc-still" style={{ transformOrigin: "140px 90px", animationDelay: `${i * -0.5}s` }}>
              <path d={`M${70 + i * 44} ${62 + (i % 2) * 8} h18 l6 7 h30 v50 h-54z`} className="sc-paper" />
            </g>
          ))}
          {[
            [96, 40],
            [150, 30],
            [204, 44],
          ].map(([x, y], i) => (
            <g key={i} className="sc-still" style={{ animationDelay: `${i * -0.7}s` }}>
              <circle cx={x} cy={y} r="11" className="sc-paper" />
              <text x={x} y={y + 4.5} textAnchor="middle" className="sc-count">
                ?
              </text>
            </g>
          ))}
        </>
      ) : null}
      {id === "kunden" ? (
        <>
          {[
            [70, 36, -8],
            [118, 58, 6],
            [168, 32, -4],
            [96, 92, 10],
            [160, 88, -6],
          ].map(([x, y, r], i) => (
            <g key={i} className="sc-still" style={{ transformOrigin: `${x + 20}px ${y + 18}px`, animationDelay: `${i * -0.35}s` }}>
              <rect x={x} y={y} width="42" height="36" rx="3" className="sc-paper" style={{ rotate: `${r}deg`, transformOrigin: `${x + 21}px ${y + 18}px` }} />
              <path d={`M${x + 8} ${y + 13} h24 M${x + 8} ${y + 22} h16`} className="sc-line" style={{ rotate: `${r}deg`, transformOrigin: `${x + 21}px ${y + 18}px` }} />
            </g>
          ))}
        </>
      ) : null}
      <Hourglass x={268} y={74} />
    </g>
  );
}

/* ------------------------------------------------------------- Mit */

function OnScene({ id }: { id: string }) {
  if (id === "angebote")
    return (
      <g className="sc-on">
        <rect x="92" y="18" width="116" height="116" rx="10" className="sc-card" />
        {[0, 1, 2, 3].map((i) => (
          <path key={i} d={`M110 ${44 + i * 16} h${[70, 56, 64, 44][i]}`} className="sc-grow" style={{ animationDelay: `${0.25 + i * 0.28}s` }} />
        ))}
        <path d="M110 114 h80" className="sc-grow sc-total" style={{ animationDelay: "1.5s" }} />
        <g className="sc-pop" style={{ animationDelay: "1.95s", transformOrigin: "212px 26px" }}>
          <circle cx="212" cy="26" r="15" fill={G} />
          <path d="M205 26.5 l4.6 4.4 8.2 -9" className="sc-tick" />
        </g>
        <path d="M40 76 h40" className="sc-flow" />
        <path d="M220 76 h40" className="sc-flow" style={{ animationDelay: "1.2s" }} />
      </g>
    );
  if (id === "emails")
    return (
      <g className="sc-on">
        <g className="sc-slide">
          <rect x="30" y="56" width="52" height="36" rx="6" className="sc-card" />
          <path d="M31 58 l25 17 25 -17" className="sc-stroke" />
        </g>
        <circle cx="130" cy="74" r="14" className="sc-node" />
        <circle cx="130" cy="74" r="4" fill="#fff" />
        <path d="M86 74 h28 M146 74 h24" className="sc-flow" />
        <rect x="172" y="30" width="112" height="90" rx="10" className="sc-card" />
        {[0, 1, 2].map((i) => (
          <path key={i} d={`M186 ${52 + i * 14} h${[74, 60, 68][i]}`} className="sc-grow" style={{ animationDelay: `${0.7 + i * 0.35}s` }} />
        ))}
        <rect x="186" y="96" width="46" height="14" rx="7" className="sc-pill sc-pop" style={{ animationDelay: "2s", transformOrigin: "209px 103px" }} />
        <path d="M201 103 l3.5 3.2 6.5 -6.8" className="sc-tick sc-pop" style={{ animationDelay: "2.1s", transformOrigin: "206px 103px" }} />
      </g>
    );
  if (id === "wissen")
    return (
      <g className="sc-on">
        <path d="M34 34 h96 a8 8 0 0 1 8 8 v26 a8 8 0 0 1 -8 8 h-70 l-12 10 v-10 h-14 a8 8 0 0 1 -8 -8 v-26 a8 8 0 0 1 8 -8z" className="sc-card" />
        <path d="M48 50 h66 M48 62 h44" className="sc-stroke" />
        <path d="M170 64 h92 a8 8 0 0 1 8 8 v34 a8 8 0 0 1 -8 8 h-14 v10 l-12 -10 h-66 a8 8 0 0 1 -8 -8 v-34 a8 8 0 0 1 8 -8z" className="sc-card sc-pop" style={{ animationDelay: "0.7s", transformOrigin: "216px 90px" }} />
        {[0, 1].map((i) => (
          <path key={i} d={`M178 ${82 + i * 14} h${[72, 50][i]}`} className="sc-grow" style={{ animationDelay: `${1 + i * 0.3}s` }} />
        ))}
        <g className="sc-pop" style={{ animationDelay: "1.8s", transformOrigin: "236px 40px" }}>
          <rect x="218" y="26" width="36" height="28" rx="6" className="sc-pill" />
          <path d="M228 33 h10 l6 6 v10 h-16z M238 33 v6 h6" className="sc-tick" />
        </g>
        <path d="M236 56 v8" className="sc-flow" />
      </g>
    );
  return (
    <g className="sc-on">
      <g className="sc-slide2">
        <rect x="22" y="58" width="62" height="34" rx="6" className="sc-card" />
        <path d="M32 70 h40 M32 80 h26" className="sc-stroke" />
      </g>
      <path d="M90 75 h40" className="sc-flow" />
      <rect x="138" y="24" width="120" height="104" rx="10" className="sc-card" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <path d={`M138 ${48 + i * 22} h120`} className="sc-hair" />
          <path d={`M150 ${40 + i * 22} h${[46, 60, 38, 52][i]}`} className={i === 0 ? "sc-grow" : "sc-dim"} style={i === 0 ? { animationDelay: "1s" } : undefined} />
        </g>
      ))}
      <rect x="140" y="27" width="116" height="20" rx="4" className="sc-row" style={{ animationDelay: "1.1s" }} />
      <g className="sc-bell" style={{ transformOrigin: "276px 30px", animationDelay: "1.8s" }}>
        <path d="M268 40 h16 l-2 -3 v-6 a6 6 0 0 0 -12 0 v6z M274 43 h4" className="sc-tick" />
      </g>
    </g>
  );
}

export default function Scene({ id }: Readonly<{ id: string }>) {
  return (
    <svg className="sc" viewBox="0 0 300 150" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <OffScene id={id} />
      <OnScene id={id} />
    </svg>
  );
}
