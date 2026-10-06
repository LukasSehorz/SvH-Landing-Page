import Image from "next/image";
import { logosB } from "@/app/copy-b";
import { LOGOS } from "./logos";

/* Logo-Kasten unter der Trust-Bar: fast volle Breite, kräftiger schwarzer Rahmen.
   Jedes Logo führt zur Webseite des Kunden; dazu die Zahl der weiteren Projekte (35 − Logos). */
export default function KundenLogos() {
  const weitere = logosB.gesamt - logosB.firmen.length;
  return (
    <section className="kl" aria-labelledby="kl-titel">
      <div className="kl-kasten" data-rv="">
        <p className="kl-titel" id="kl-titel">
          {logosB.label}
        </p>
        <ul className="kl-liste">
          {logosB.firmen.map((f) => {
            const l = LOGOS[f.id];
            return (
              <li key={f.id}>
                <a className="kl-logo" href={f.href} target="_blank" rel="noopener noreferrer" title={f.name}>
                  <Image src={l.src} alt={`${f.name} (${logosB.neuesFenster})`} width={l.w} height={l.h} />
                </a>
              </li>
            );
          })}
          <li className="kl-mehr">{logosB.weitere(weitere)}</li>
        </ul>
      </div>
    </section>
  );
}
