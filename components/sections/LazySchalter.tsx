"use client";

import dynamic from "next/dynamic";

// Eigenes Paket (Motion + Szenen), wird mit gerendert, aber getrennt vom ersten Bildschirm geladen
const Schalter = dynamic(() => import("./Schalter"));
export default Schalter;
