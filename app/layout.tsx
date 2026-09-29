import type { Metadata, Viewport } from "next";
import { Inter, Inter_Tight, Mr_Dafoe } from "next/font/google";
import "./globals.css";
import { meta } from "./copy";
import { company } from "./content";
import { GTM_ID, SEARCH_CONSOLE_ID } from "./tracking";
import SmoothScroll from "@/components/system/SmoothScroll";
import Consent from "@/components/system/Consent";
import Reveals from "@/components/system/Reveals";
import Spotlight from "@/components/system/Spotlight";
import SvgDefs from "@/components/system/SvgDefs";
import Noise from "@/components/system/Noise";
import Navbar from "@/components/system/Navbar";
import Footer from "@/components/system/Footer";

// Schriften werden von Next selbst ausgeliefert (keine Anfrage an Google)
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", weight: ["400", "500", "600"], display: "swap" });
const interTight = Inter_Tight({ subsets: ["latin"], variable: "--font-inter-tight", weight: ["400", "500", "600"], display: "swap" });
// Pinsel-Schreibschrift für die drei Akzentwörter (per Screenshot verglichen mit Yellowtail, Kaushan Script, Damion)
const script = Mr_Dafoe({ subsets: ["latin"], variable: "--font-script-face", weight: "400", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(company.url),
  title: { default: meta.title, template: "%s | SvH Consulting" },
  description: meta.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: "SvH Consulting",
    title: meta.title,
    description: meta.description,
    url: company.url,
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
    <html lang="de" className={`${inter.variable} ${interTight.variable} ${script.variable}`} suppressHydrationWarning>
      <head>
        {/* Markiert „JavaScript läuft“, damit die Hauptzeile nicht aufblitzt, bevor sie sich aufbaut */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <a className="skip-link" href="#inhalt">
          Zum Inhalt springen
        </a>
        {/* Kennung des Tag Manager nur als Text; geladen wird er erst nach Einwilligung */}
        <div id="gtm-id" data-gtm-id={GTM_ID} hidden />
        <SvgDefs />
        <Navbar />
        {children}
        <Footer />
        <Noise fixed opacity={0.035} />
        <SmoothScroll />
        <Reveals />
        <Spotlight />
        <Consent />
      </body>
    </html>
  );
}
