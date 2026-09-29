/* Feine Strich-Symbole für das Formular (1,5 px, wie die übrigen Icons). */

const S = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" } as const;

/** Ein Symbol je Zeitfresser-Kachel, in der Reihenfolge aus copy.ts. */
export function Zeitfresser({ i }: Readonly<{ i: number }>) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" {...S}>
      {i === 0 ? (
        // Angebot: Blatt mit Stift
        <>
          <path d="M11.5 2.75H5.25a1 1 0 0 0-1 1v12.5a1 1 0 0 0 1 1h9.5a1 1 0 0 0 1-1V7" />
          <path d="M7 7.25h4M7 10.25h6M7 13.25h3.5" />
          <path d="m13.2 2.8 3.9 3.9" />
        </>
      ) : i === 1 ? (
        // E-Mail
        <>
          <rect x="2.75" y="4.25" width="14.5" height="11.5" rx="2" />
          <path d="m3.5 5.5 6.5 5 6.5-5" />
        </>
      ) : i === 2 ? (
        // Tastatur
        <>
          <rect x="2.25" y="5.25" width="15.5" height="9.5" rx="2" />
          <path d="M5.5 8.25h.01M8.5 8.25h.01M11.5 8.25h.01M14.5 8.25h.01M6.75 11.75h6.5" />
        </>
      ) : i === 3 ? (
        // Beleg
        <>
          <path d="M5 2.75h10v14.5l-1.7-1.2-1.6 1.2-1.7-1.2-1.7 1.2-1.6-1.2L5 17.25z" />
          <path d="M7.75 7h4.5M7.75 10h4.5" />
        </>
      ) : i === 4 ? (
        // Kalender
        <>
          <rect x="3" y="4" width="14" height="13" rx="2" />
          <path d="M3 8h14M7 2.5v3M13 2.5v3" />
        </>
      ) : i === 5 ? (
        // Nachfassen: Pfeil im Kreis
        <>
          <path d="M16.25 10a6.25 6.25 0 1 1-1.83-4.42" />
          <path d="M16.5 3.25v3.5H13" />
        </>
      ) : i === 6 ? (
        // Suchen
        <>
          <circle cx="8.75" cy="8.75" r="5.5" />
          <path d="m13 13 4 4" />
        </>
      ) : i === 7 ? (
        // Bericht: Balken
        <>
          <path d="M3.25 16.75h13.5" />
          <path d="M6 13.75v-4M10 13.75v-7.5M14 13.75v-5.5" />
        </>
      ) : i === 8 ? (
        // Bewerbung: Person
        <>
          <circle cx="10" cy="7" r="3.25" />
          <path d="M3.75 16.75c.9-3 3.3-4.5 6.25-4.5s5.35 1.5 6.25 4.5" />
        </>
      ) : (
        // Etwas anderes: Plus
        <>
          <circle cx="10" cy="10" r="7.25" />
          <path d="M10 7v6M7 10h6" />
        </>
      )}
    </svg>
  );
}

/** Kleine Personen-Gruppe: 1 bis 4 Figuren für die Betriebsgröße. */
export function Leute({ n }: Readonly<{ n: number }>) {
  const w = 14 * n + 4;
  return (
    <svg width={w} height="18" viewBox={`0 0 ${w} 18`} aria-hidden="true" {...S} strokeWidth={1.4}>
      {Array.from({ length: n }, (_, i) => {
        const x = 9 + i * 14;
        return (
          <g key={i}>
            <circle cx={x} cy="5.5" r="2.6" />
            <path d={`M${x - 5} 16c.6-2.9 2.5-4.4 5-4.4s4.4 1.5 5 4.4`} />
          </g>
        );
      })}
    </svg>
  );
}

export function Haken({ size = 14 }: Readonly<{ size?: number }>) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden="true" {...S} strokeWidth={2}>
      <path d="M3.6 8.4 6.6 11.3 12.5 4.9" />
    </svg>
  );
}

export function Zurueck() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" {...S} strokeWidth={1.7}>
      <path d="M10 3.5 5.5 8l4.5 4.5" />
    </svg>
  );
}

export function Hinweis() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" {...S} strokeWidth={1.5}>
      <circle cx="8" cy="8" r="6.25" />
      <path d="M8 4.9v3.6M8 11.1h.01" />
    </svg>
  );
}

export function Schloss() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true" {...S} strokeWidth={1.5}>
      <rect x="3.25" y="7" width="9.5" height="6.75" rx="1.6" />
      <path d="M5.25 7V5.25a2.75 2.75 0 0 1 5.5 0V7" />
    </svg>
  );
}
