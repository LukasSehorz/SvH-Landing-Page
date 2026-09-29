import type { Metadata } from "next";
import { aktuelles } from "@/app/copy";
import { company } from "@/app/content";
import PageHead from "@/components/pages/PageHead";
import Videos from "@/components/pages/Videos";
import PageCta from "@/components/pages/PageCta";
import JsonLd from "@/components/system/JsonLd";
import { pageMeta } from "@/components/pages/meta";

/*
 * /aktuelles: Kopf, neuestes Video groß, übrige als Raster, Hinweis und
 * Kanal-Link, kompakter Abschluss mit dem Knopf zum Formular (/#termin).
 * Nichts wird eingebettet, erst ein Klick öffnet YouTube.
 */

const title = `${aktuelles.meta.title} | ${company.name}`;

export const metadata: Metadata = pageMeta({ title: aktuelles.meta.title, description: aktuelles.meta.description, path: "/aktuelles" });

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
