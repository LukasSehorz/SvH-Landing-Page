import Hero from "@/components/sections/Hero";
import ChaosRuhe from "@/components/sections/ChaosRuhe";
import Schalter from "@/components/sections/LazySchalter";
import Loesungen from "@/components/sections/Loesungen";
import Ergebnisse from "@/components/sections/Ergebnisse";
import Geschenk from "@/components/sections/Geschenk";
import Spielzug from "@/components/sections/Spielzug";
import Garantie from "@/components/sections/Garantie";
import Team from "@/components/sections/Team";
import Fragen from "@/components/sections/Fragen";
import Abschluss from "@/components/sections/Abschluss";
import MobileCta from "@/components/system/MobileCta";
import { Divider } from "@/components/system/PitchLines";
import type { Metadata } from "next";
import JsonLd from "@/components/system/JsonLd";
import { company } from "@/app/content";

// Kanonische Adresse nur für die Startseite (Unterseiten setzen ihre eigene)
export const metadata: Metadata = { alternates: { canonical: "/" } };

// Reihenfolge laut KONZEPT.md. Jede Sektion liegt in einer eigenen Datei mit eigener CSS-Datei unter app/styles/.
export default function Home() {
  return (
    <main id="inhalt">
      {/* Nur Angaben, die auch sichtbar auf der Seite stehen */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          name: company.name,
          legalName: company.legalName,
          url: `${company.url}/`,
          logo: `${company.url}/icon.png`,
          image: `${company.url}/og.png`,
          telephone: company.phoneHref,
          email: company.email,
          address: {
            "@type": "PostalAddress",
            ...(company.street ? { streetAddress: company.street } : {}),
            postalCode: company.zipCity.split(" ")[0],
            addressLocality: company.zipCity.split(" ").slice(1).join(" "),
            addressCountry: "DE",
          },
          founder: company.partners.map((name) => ({ "@type": "Person", name })),
          sameAs: [company.youtube],
          areaServed: "DE",
        }}
      />
      <Hero />
      <ChaosRuhe />
      <Schalter />
      <Loesungen />
      <Divider variant="arc" />
      <Ergebnisse />
      <Geschenk />
      <Spielzug />
      <Garantie />
      <Divider variant="half" />
      <Team />
      <Fragen />
      <Abschluss />
      <MobileCta />
    </main>
  );
}
