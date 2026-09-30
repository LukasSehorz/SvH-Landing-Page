"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

// GSAP und Lenis nur dort laden, wo Bewegung gebraucht wird (Startseite, Aktuelles).
// Rechtsseiten scrollen nativ und laden kein GSAP.
const SmoothScroll = dynamic(() => import("./SmoothScroll"), { ssr: false });
const Reveals = dynamic(() => import("./Reveals"), { ssr: false });

const MIT_BEWEGUNG = new Set(["/", "/aktuelles"]);

export default function Effects() {
  const pathname = usePathname();
  if (!MIT_BEWEGUNG.has(pathname)) return null;
  return (
    <>
      <SmoothScroll />
      <Reveals />
    </>
  );
}
