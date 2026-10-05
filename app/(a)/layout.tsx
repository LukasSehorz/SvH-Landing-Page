import type { Metadata, Viewport } from "next";
import { Inter, Inter_Tight, Mr_Dafoe } from "next/font/google";
import "@/app/globals.css";
import { meta, nav } from "@/app/copy";
import { company } from "@/app/content";
import { GTM_ID, SEARCH_CONSOLE_ID } from "@/app/tracking";
import Consent from "@/components/system/Consent";
import Effects from "@/components/system/Effects";
import Spotlight from "@/components/system/Spotlight";
import SvgDefs from "@/components/system/SvgDefs";
import Noise from "@/components/system/Noise";
import Navbar from "@/components/system/Navbar";
import Footer from "@/components/system/Footer";
import VariantSwitch from "@/components/variante/VariantSwitch";

// Schriften werden von Next selbst ausgeliefert (keine Anfrage an Google)
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", weight: ["400", "500", "600"], display: "swap" });
const interTight = Inter_Tight({ subsets: ["latin"], variable: "--font-inter-tight", weight: ["400", "500", "600"], display: "swap" });
// Pinsel-Schreibschrift für die drei Akzentwörter (per Screenshot verglichen mit Yellowtail, Kaushan Script, Damion)
// nicht vorladen: das Wort schreibt sich erst nach 1 s und soll nicht mit dem LCP konkurrieren
const script = Mr_Dafoe({ subsets: ["latin"], variable: "--font-script-face", weight: "400", display: "swap", preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(company.url),
  title: { default: meta.title, template: "%s | SvH Consulting" },
  description: meta.description,
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: "SvH Consulting",
    title: meta.title,
    description: meta.description,
    url: `${company.url}/`,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: meta.ogAlt }],
  },
  twitter: { card: "summary_large_image", title: meta.title, description: meta.description, images: ["/og.png"] },
  robots: { index: true, follow: true },
  ...(SEARCH_CONSOLE_ID ? { verification: { google: SEARCH_CONSOLE_ID } } : {}),
};

export const viewport: Viewport = {
  themeColor: "#050507",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de" className={`${inter.variable} ${interTight.variable} ${script.variable}`}>
      <body>
        <a className="skip-link" href="#inhalt">
          {nav.skip}
        </a>
        {/* Kennung des Tag Manager nur als Text; geladen wird er erst nach Einwilligung */}
        <div id="gtm-id" data-gtm-id={GTM_ID} hidden />
        {/* Einwilligung im DOM vor der Navigation: per Tab sofort erreichbar */}
        <Consent />
        <SvgDefs />
        <Navbar />
        {children}
        <Footer />
        <Noise fixed opacity={0.035} />
        <Effects />
        <Spotlight />
        <VariantSwitch aktiv="a" />
      </body>
    </html>
  );
}
