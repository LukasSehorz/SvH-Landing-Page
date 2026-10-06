import Image from "next/image";
import { Fragment } from "react";
import { kundenB } from "@/app/copy-b";
import { LOGOS } from "./logos";
import KundenKarussell from "./KundenKarussell";
import MehrText from "./MehrText";
import { GoogleG, Grad, Sterne } from "./ui";

/* Kunden: echte Google-Bewertungen als endloses Karussell in einer Reihe (KundenKarussell).
   Jede Karte: oben das Firmenlogo, darunter die Bewertung (wortgetreu), unten kurz, was wir umgesetzt haben.
   Desktop drei Karten, Tablet zwei, Handy eine (die nächste schaut hinein). */

/** Logo oben in der Karte: Bilddatei, Schriftzug (Betthupferl) oder neutral ohne Logo */
function FirmenLogo({ logo, firma, href }: { logo: string; firma: string; href: string }) {
  const inhalt =
    logo === "betthupferl" ? (
      <span className="kd-wortmarke">Betthupferl</span>
    ) : logo && LOGOS[logo] ? (
      <Image src={LOGOS[logo].src} alt={firma} width={LOGOS[logo].w} height={LOGOS[logo].h} />
    ) : (
      <span className="kd-ohne-logo">{firma || "Kundenstimme"}</span>
    );
  const klasse = `kd-logo${logo === "taxiizi" ? " kd-logo--dunkel" : ""}`;
  return href ? (
    <a className={klasse} href={href} target="_blank" rel="noopener noreferrer" aria-label={`${firma} (öffnet in neuem Fenster)`}>
      {inhalt}
    </a>
  ) : (
    <div className={klasse}>{inhalt}</div>
  );
}

export default function Kunden() {
  const karten = kundenB.bewertungen.map((b) => (
    <Fragment key={b.name}>
      <FirmenLogo logo={b.logo} firma={b.firma} href={b.href} />
      <figure className="kd-bewertung">
        <div className="kd-bewertung-kopf">
          <span className="kd-avatar" aria-hidden="true">
            {b.name.trim().charAt(0).toUpperCase()}
          </span>
          <span>
            <span className="kd-name">{b.name}</span>
            <span className="kd-datum">
              {kundenB.google} · {b.datum}
            </span>
          </span>
          <GoogleG size={18} />
        </div>
        <Sterne n={b.sterne} />
        <MehrText text={b.text} weiter={kundenB.weiter} weniger={kundenB.weniger} />
      </figure>
      <div className="kd-umgesetzt">
        <p className="kd-umgesetzt-label">{kundenB.umgesetzt}</p>
        <p className={`kd-umgesetzt-text${b.umgesetzt ? "" : " kd-umgesetzt-text--offen"}`}>{b.umgesetzt || kundenB.folgt}</p>
      </div>
    </Fragment>
  ));

  return (
    <section className="sb sb--tint" id="kunden" aria-labelledby="kunden-titel">
      <div className="sb-wrap">
        <div className="b-kopf b-kopf--mitte" data-rv="">
          <p className="b-label">{kundenB.label}</p>
          <h2 className="b-h2" id="kunden-titel">
            <Grad text={kundenB.titel} />
          </h2>
          <p className="b-lead">{kundenB.text}</p>
          <a className="kd-schnitt" href={kundenB.profil} target="_blank" rel="noopener noreferrer">
            <GoogleG />
            <span className="kd-schnitt-zahl">{kundenB.schnitt}</span>
            <Sterne n={5} />
            <span className="kd-schnitt-anzahl">{kundenB.anzahl}</span>
          </a>
        </div>

        {/* ohne JavaScript: ganze Texte und eine waagerecht scrollbare Reihe (alle fünf Karten erreichbar) */}
        <noscript>
          <style>
            {".kd-text[data-zu]{display:block;-webkit-line-clamp:unset;overflow:visible}" +
              ".kd-fenster{overflow-x:auto!important;scroll-snap-type:x mandatory;overscroll-behavior-x:contain;padding-block:4px 32px;margin-block:-4px -32px}" +
              ".kd-karte{scroll-snap-align:start}.kd-steuerung{display:none!important}"}
          </style>
        </noscript>
        <KundenKarussell
          karten={karten}
          bereich={kundenB.bereich}
          zurueck={kundenB.zurueck}
          vor={kundenB.vor}
          positionen={kundenB.bewertungen.map((_, i) => kundenB.position(i + 1, kundenB.bewertungen.length))}
        />

        <p className="kd-alle" data-rv="">
          <a className="b-textlink" href={kundenB.profil} target="_blank" rel="noopener noreferrer">
            {kundenB.profilLink}
          </a>
        </p>
      </div>
    </section>
  );
}
