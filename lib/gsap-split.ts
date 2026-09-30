"use client";

import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";

// SplitText nur für die Einblendungen der Überschriften (Reveals)
if (typeof window !== "undefined") gsap.registerPlugin(SplitText);

export { SplitText };
