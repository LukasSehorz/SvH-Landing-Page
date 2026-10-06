import Image from "next/image";
import { trustB } from "@/app/copy-b";
import { LOGOS } from "./logos";

/* Trust-Bar direkt unter dem Hero: vier Fakten im Markenverlauf (Lila früh im Verlauf). */
export default function TrustBar() {
  return (
    <section className="tb" aria-label="Fakten über SvH Consulting">
      <ul className="tb-liste shell">
        {trustB.map((t) => (
          <li key={t.big} className="tb-punkt">
            <span className="tb-big">{t.big}</span>
            <span className="tb-small">
              {t.small}
              {t.logo && LOGOS[t.logo] ? (
                <Image className="tb-logo" src={LOGOS[t.logo].src} alt="Estera GmbH" width={LOGOS[t.logo].w} height={LOGOS[t.logo].h} />
              ) : null}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
