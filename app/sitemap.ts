import type { MetadataRoute } from "next";

/* Adresse der veröffentlichten Seite (mit Bindestrich). Die Rechtsseiten waren
   auf der alten Seite nicht auf noindex gesetzt und stehen deshalb mit
   niedriger Priorität in der Liste. */
const BASE = "https://svh-consult.de";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    { path: "/", priority: 1, changeFrequency: "weekly" as const },
    { path: "/aktuelles", priority: 0.7, changeFrequency: "weekly" as const },
    { path: "/impressum", priority: 0.2, changeFrequency: "yearly" as const },
    { path: "/datenschutz", priority: 0.2, changeFrequency: "yearly" as const },
    { path: "/agb", priority: 0.2, changeFrequency: "yearly" as const },
  ];
  const lastModified = new Date();
  return paths.map(({ path, priority, changeFrequency }) => ({ url: BASE + path, lastModified, changeFrequency, priority }));
}
