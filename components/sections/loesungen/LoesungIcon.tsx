/* Linien-Icons der Lösungen: 24er-Raster, Strich überall genau 1,5 px
   (vector-effect: non-scaling-stroke, auch wenn das Icon kleiner gezeichnet wird),
   runde Enden, Markenverlauf als Strichfarbe. Keine Überlappungen, damit jedes
   Symbol auch in 22 px gestochen scharf bleibt. */

const PATHS: Record<string, string[]> = {
  // Wissen: aufgeschlagenes Buch mit Textzeilen
  wissensmanagement: [
    "M12 6.9C10.2 5.7 7.5 5.2 3.75 5.4v12.4c3.75-.2 6.45.3 8.25 1.5 1.8-1.2 4.5-1.7 8.25-1.5V5.4C16.5 5.2 13.8 5.7 12 6.9Z",
    "M12 6.9v12.4",
    "M14.6 9.9c.9-.4 2-.6 3.2-.6",
    "M14.6 13c.9-.4 2-.6 3.2-.6",
  ],
  // Chat auf der Webseite: Browserfenster mit Sprechblase
  webchat: [
    "M6 4h12a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3Z",
    "M3 8.5h18",
    "M8.25 11.75h7.5a1.25 1.25 0 0 1 1.25 1.25v1.5a1.25 1.25 0 0 1-1.25 1.25H11.5L9.5 17.5v-1.75H8.25A1.25 1.25 0 0 1 7 14.5V13a1.25 1.25 0 0 1 1.25-1.25Z",
  ],
  // E-Mail: Umschlag
  email: [
    "M5.5 5.5h13A2.5 2.5 0 0 1 21 8v8a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 16V8a2.5 2.5 0 0 1 2.5-2.5Z",
    "m3.9 7.4 6.9 5.1a2 2 0 0 0 2.4 0l6.9-5.1",
  ],
  // Telefon: Hörer mit Schallwellen
  telefon: [
    "M5.4 3.75h2.7l1.4 3.7-1.8 1.35a10.3 10.3 0 0 0 5.5 5.5l1.35-1.8 3.7 1.4v2.7a1.8 1.8 0 0 1-1.8 1.8A14.6 14.6 0 0 1 3.6 5.55a1.8 1.8 0 0 1 1.8-1.8Z",
    "M14.75 3.5a5.75 5.75 0 0 1 5.75 5.75",
    "M14.75 6.75a2.5 2.5 0 0 1 2.5 2.5",
  ],
  // Termine: Kalenderblatt mit Haken
  termine: [
    "M6.25 5h11.5a2.75 2.75 0 0 1 2.75 2.75v10a2.75 2.75 0 0 1-2.75 2.75H6.25A2.75 2.75 0 0 1 3.5 17.75v-10A2.75 2.75 0 0 1 6.25 5Z",
    "M3.5 9.5h17",
    "M8 3v3.5",
    "M16 3v3.5",
    "m9.25 14.75 1.9 1.9 3.6-3.9",
  ],
  // Angebote: Blatt mit Eselsohr, Zeilen und Unterschrift
  angebote: [
    "M14 3.5H7.5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V8Z",
    "M14 3.5V8h4.5",
    "M8.75 11.25h6.5",
    "M8.75 14.25h4",
    "M8.75 17.4c.7-.8 1.3-.8 1.8 0s1.1.8 1.8 0 1.2-.7 1.7 0",
  ],
  // Rechnungen: Beleg mit gezacktem Rand
  rechnungen: [
    "M6 3.5h12v17l-2-1.3-2 1.3-2-1.3-2 1.3-2-1.3-2 1.3Z",
    "M9 8h6",
    "M9 11h6",
    "M9 14h3.5",
  ],
  // Kundenliste: Person mit Liste
  crm: [
    "M8.5 6a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z",
    "M3.5 18.75c.6-2.7 2.6-4.25 5-4.25s4.4 1.55 5 4.25",
    "M16 7.75h4.5",
    "M16 11.75h4.5",
    "M17.75 15.75h2.75",
  ],
  // Dokumente auslesen: Scan-Rahmen mit Textzeilen
  dokumente: [
    "M3.5 8V6.25A2.75 2.75 0 0 1 6.25 3.5H8",
    "M16 3.5h1.75a2.75 2.75 0 0 1 2.75 2.75V8",
    "M20.5 16v1.75a2.75 2.75 0 0 1-2.75 2.75H16",
    "M8 20.5H6.25a2.75 2.75 0 0 1-2.75-2.75V16",
    "M8.5 9h7",
    "M8.5 12h7",
    "M8.5 15h4.5",
  ],
  // Berichte: Achse mit Balken
  berichte: [
    "M4 4v14.5A1.5 1.5 0 0 0 5.5 20H20",
    "M8.5 16.5V13",
    "M12 16.5V9.5",
    "M15.5 16.5v-5",
    "M19 16.5V7",
  ],
};

/** Ein gemeinsamer Verlauf für alle Icons (Nutzerkoordinaten, greift auch bei geraden Linien). */
export function LoesungIconDefs() {
  return (
    <svg width="0" height="0" className="loe-defs" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="loe-grad" gradientUnits="userSpaceOnUse" x1="3" y1="3" x2="21" y2="21">
          <stop offset="0" stopColor="#7aa0ff" />
          <stop offset="0.5" stopColor="#9483ff" />
          <stop offset="1" stopColor="#c9b9ff" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function LoesungIcon({ id }: Readonly<{ id: string }>) {
  const paths = PATHS[id];
  if (!paths) return null;
  return (
    <svg className="loe-svg" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      {paths.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
