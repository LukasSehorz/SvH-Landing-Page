"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Grundausstattung einmal registrieren (nur im Browser). Weitere Plugins
// registriert jeder Baustein selbst: SplitText in lib/gsap-split.ts,
// MotionPathPlugin in HeroMachine und im Spielzug-Board.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export { gsap, ScrollTrigger, useGSAP };
