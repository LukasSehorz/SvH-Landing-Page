import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Inter, Inter_Tight } from "next/font/google";
import "./b.css";
import { nav } from "@/app/copy";
import Navbar from "@/components/b/Navbar";
import Footer from "@/components/b/Footer";
import Reveal from "@/components/b/Reveal";
import { SvgDefsB } from "@/components/b/ui";
import VariantSwitch from "@/components/variante/VariantSwitch";

/* Variante B: eigenes Root-Layout, teilt keine Styles mit Variante A. Die Leiste ist eine Kopie aus A. */

// dieselben Schriften wie A (Leiste und Knopf sehen identisch aus)
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", weight: ["400", "500", "600"], display: "swap" });
const interTight = Inter_Tight({ subsets: ["latin"], variable: "--font-inter-tight", weight: ["400", "500", "600", "800"], display: "swap" });
// nur für den Schriftzug des Kunden Betthupferl (dessen Logo ist ein Schriftzug in Bodoni Moda, kursiv)
const bodoni = Bodoni_Moda({ subsets: ["latin"], variable: "--font-bodoni", weight: "400", style: "italic", display: "swap", preload: false });

export const metadata: Metadata = {
  title: "Variante B | SvH Consulting",
  description: "Die KI-Automatisierungen, die deinem Unternehmen fehlen, um jeden Monat Zeit zu sparen. Starte mit dem kostenlosen KI-Workshop.",
  // Entwurf: nicht in Suchmaschinen
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function LayoutB({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de" className={`${inter.variable} ${interTight.variable} ${bodoni.variable}`}>
      <body>
        <a className="skip-link" href="#inhalt">
          {nav.skip}
        </a>
        <SvgDefsB />
        <Navbar />
        {children}
        <Footer />
        <Reveal />
        <VariantSwitch aktiv="b" />
      </body>
    </html>
  );
}
