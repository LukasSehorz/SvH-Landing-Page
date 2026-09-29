import type { Metadata } from "next";
import { notFound } from "@/app/copy";
import Cta from "@/components/system/Cta";
import PageHead from "@/components/pages/PageHead";

/* Seite nicht gefunden: schlicht, ein Satz, ein Weg zurück. Leiste und Fußzeile kommen aus dem Layout. */

export const metadata: Metadata = {
  title: notFound.metaTitle,
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main id="inhalt" className="pg">
      <PageHead label={notFound.label} title={notFound.title} lead={notFound.lead} className="pg-head--nf">
        <div className="nf-actions pg-in" style={{ "--i": 3 } as React.CSSProperties}>
          <Cta href="/">{notFound.home}</Cta>
        </div>
      </PageHead>
    </main>
  );
}
