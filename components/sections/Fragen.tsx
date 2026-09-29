import { cta, fragen } from "@/app/copy";
import Cta from "@/components/system/Cta";
import JsonLd from "@/components/system/JsonLd";
import Rich, { plain } from "@/components/system/Rich";
import FragenListe from "./abschluss/FragenListe";

/* „Was Unternehmer uns vorher fragen.“ Aufklapp-Liste + FAQPage-JSON-LD. */
export default function Fragen() {
  const ld = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: fragen.items.map((f) => ({
      "@type": "Question",
      name: plain(f.q),
      acceptedAnswer: { "@type": "Answer", text: plain(f.a) },
    })),
  };

  return (
    <section className="section faq" id="fragen" aria-labelledby="faq-title">
      <JsonLd data={ld} />
      <div className="shell faq-grid">
        <div className="faq-head">
          <p className="label" data-reveal="">
            {fragen.label}
          </p>
          <h2 className="h2 faq-title" id="faq-title" data-split="">
            <Rich text={fragen.title} />
          </h2>
          <div className="faq-cta" data-reveal="">
            <Cta href="#termin">{cta.main}</Cta>
          </div>
        </div>
        <FragenListe items={fragen.items} />
      </div>
    </section>
  );
}
