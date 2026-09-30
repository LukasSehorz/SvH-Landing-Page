"use client";

/* ====================================================================
   Bewegungssystem SvH (Bau-Runde 6). Ein Maß für die ganze Seite.

   Warum so: „expo.out“ legt 90 % der Strecke in das erste Drittel der Dauer.
   Gemessen bei 1440 × 800: Einblendung 1,05 s, aber nach 0,33 s schon zu 90 %
   da, Deckkraft nach 0,10 s halb. Das wirkt hastig, obwohl die Dauer lang ist.
   Jetzt: Bewegung mit Quart-Auslauf (power3.out), Deckkraft mit sanftem
   Quad-Auslauf (power1.out). 90 % nach ≈ 0,45 s (Bewegung) bzw. ≈ 0,6 s
   (Deckkraft), weich auslaufend bis ≈ 1 s. Ruhig, aber nicht träge.

   Scrollgekoppelte Szenen (Chaos, Spielzug): Der Scroll bestimmt, WANN ein
   Schritt passiert, die Dauer läuft in echter Zeit (STEP). Vorher hingen
   Taktwechsel und Karten an 12 bis 40 px Scrollweg und liefen bei normalem
   Lesetempo in 30 bis 80 ms durch.

   CSS-Gegenstücke: --ease-reveal, --ease-fade, --dur-reveal in base.css.
   ==================================================================== */

export const MOTION = {
  /** Bewegung (transform): Quart-Auslauf, weich, ohne Nachschwingen */
  ease: "power3.out",
  /** Deckkraft: sanfter, damit nichts aufblitzt */
  fade: "power1.out",
  /** Ausblenden (kurz, beschleunigt weg) */
  out: "power1.in",
  /** Zeichnen (Linien, Ringe, Schwünge) */
  draw: "power2.inOut",

  /** Absätze, Karten, Knöpfe, Listenpunkte */
  block: { y: 24, move: 1.0, fade: 0.9, stagger: 0.08 },
  /** Überschriften: zeilenweise Masken-Aufstieg */
  head: { yPercent: 112, dur: 1.1, stagger: 0.12 },
  /** Zähler: weicher Auslauf, nie in unter einer Sekunde durch */
  count: { dur: 1.8, ease: "power1.out" },
  /** Schreibschrift: Wort schreibt sich, Schwung zeichnet sich */
  script: { write: 1.3, swoosh: 1.0 },
  /** Linien zeichnen */
  line: 1.1,
  /** Schritt in einer Scroll-Szene (Karte leuchtet auf, Takt wechselt).
      gap: Pause zwischen Aus und Ein, damit nie zwei Texte übereinander stehen */
  step: { in: 0.8, out: 0.3, gap: 0.05, y: 12 },

  /** Auslöser: Oberkante 15 % im sichtbaren Bereich (über der mobilen CTA-Leiste) */
  enter: 0.85,
} as const;

let probe: HTMLElement | null = null;

/** Höhe der festen CTA-Leiste mobil (var(--mobile-cta-h) enthält calc/env, daher gemessen). */
function ctaHeight(): number {
  if (!probe || !probe.isConnected) {
    probe = document.createElement("i");
    probe.setAttribute("aria-hidden", "true");
    probe.style.cssText = "position:absolute;left:0;top:0;width:0;height:var(--mobile-cta-h);pointer-events:none;opacity:0";
    document.body.appendChild(probe);
  }
  return probe.offsetHeight;
}

/** Auslöselinie in px vom oberen Bildrand: 85 % der Höhe über der mobilen CTA-Leiste. */
export function enterLine(): number {
  if (typeof window === "undefined") return 0;
  return Math.round((window.innerHeight - ctaHeight()) * MOTION.enter);
}

/** ScrollTrigger-Start einer Einblendung (Funktion: jeder Refresh misst neu). */
export const enterStart = () => `top ${enterLine()}px`;
