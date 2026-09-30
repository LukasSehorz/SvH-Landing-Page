"use client";

import dynamic from "next/dynamic";

// Eigenes Paket (Formular + Motion): wird mit gerendert (Server-HTML bleibt), aber getrennt vom ersten Bildschirm geladen
const Formular = dynamic(() => import("./Formular"));
export default Formular;
