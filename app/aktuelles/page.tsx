import type { Metadata } from "next";
import { aktuelles, meta } from "@/app/copy";
import { company } from "@/app/content";
import PageHead from "@/components/pages/PageHead";
import Videos from "@/components/pages/Videos";
import PageCta from "@/components/pages/PageCta";
import JsonLd from "@/components/system/JsonLd";

/*
 * /aktuelles: Kopf, neuestes Video groß, übrige als Raster, Hinweis und
 * Kanal-Link, kompakter Abschluss mit dem Knopf zum Formular (/#termin).
 * Nichts wird eingebettet, erst ein Klick öffnet YouTube.
 */

const title = `${aktuelles.meta.title} | ${company.name}`;

export const metadata: Metadata = {
  title: aktuelles.meta.title,
  description: aktuelles.meta.description,
  alternates: { canonical: "/aktuelles" },
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: company.name,
    title,
    description: aktuelles.meta.description,
    url: `${company.url}/aktuelles`,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: meta.ogAlt }],
  },
  twitter: { card: "summary_large_image", title, description: aktuelles.meta.description, images: ["/og.png"] },
};

// Strukturierte Daten: Liste der Videos (nur Angaben, die auch sichtbar sind)
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: title,
  url: `${company.url}/aktuelles`,
  inLanguage: "de-DE",
  mainEntity: {
    "@type": "ItemList",
    itemListElement: aktuelles.videos.map((v, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "VideoObject",
        name: v.titel,
        description: v.body,
        uploadDate: v.datumIso,
        thumbnailUrl: `${company.url}${v.bild}`,
        url: v.href,
      },
    })),
  },
};

export default function AktuellesPage() {
  return (
    <main id="inhalt" className="pg">
      <JsonLd data={jsonLd} />
      <PageHead label={aktuelles.label} title={aktuelles.title} lead={aktuelles.text} />
      <Videos />
      <PageCta />
    </main>
  );
}
