/**
 * Schreibschrift-Akzent mit gezeichnetem Schwung darunter (wie im LinkedIn-Banner).
 * Die Bewegung (Wort schreibt sich, Schwung zeichnet sich) setzt Reveals.tsx
 * bzw. der Start-Abschnitt im Browser; im Server-HTML steht der Endzustand.
 */
export default function ScriptWord({ children, manual = false }: Readonly<{ children: string; manual?: boolean }>) {
  return (
    <span className="script" data-script={manual ? "manual" : "auto"}>
      <span className="script-text">{children}</span>
      <svg className="script-swoosh" viewBox="0 0 300 40" preserveAspectRatio="none" aria-hidden="true">
        <path className="s1" pathLength={1} d="M6 30 C 70 21, 150 15, 226 16 C 262 16.5, 284 20, 296 9" />
        <path className="s2" pathLength={1} d="M34 37 C 104 30, 176 27, 250 30" />
      </svg>
    </span>
  );
}
