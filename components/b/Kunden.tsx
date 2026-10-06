import Image from "next/image";
import { kundenB } from "@/app/copy-b";
import { LOGOS } from "./logos";
import MehrText from "./MehrText";
import { Grad, stufe } from "./ui";

/* Kunden: hohe Karten (drei oben, zwei darunter). Oben das Firmenlogo, darunter die echte
   Google-Bewertung, unten kurz, was wir umgesetzt haben. */

function Sterne({ n }: { n: number }) {
  return (
    <span className="kd-sterne" role="img" aria-label={`${n} von 5 Sternen`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
          <path d="M10 1.8l2.5 5.3 5.8.7-4.3 4 1.1 5.7L10 14.7l-5.1 2.8 1.1-5.7-4.3-4 5.8-.7z" fill={i < n ? "#fbbc04" : "#e2e2ea"} />
        </svg>
      ))}
    </span>
  );
}

function GoogleG({ size = 22 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path fill="#4285F4" d="M22.6 12.3c0-.8-.1-1.5-.2-2.3H12v4.3h6c-.3 1.4-1 2.5-2.2 3.3v2.7h3.5c2.1-1.9 3.3-4.7 3.3-8z" />
      <path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.5-2.7c-1 .7-2.3 1.1-3.8 1.1-2.9 0-5.4-2-6.3-4.6H2.1v2.8C3.9 20.5 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.7 14.1c-.2-.7-.4-1.4-.4-2.1s.1-1.4.4-2.1V7.1H2.1C1.4 8.6 1 10.2 1 12s.4 3.4 1.1 4.9z" />
      <path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.2-3.2C17.5 2.1 15 1 12 1 7.7 1 3.9 3.5 2.1 7.1l3.6 2.8C6.6 7.3 9.1 5.4 12 5.4z" />
    </svg>
  );
}

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

        {/* ohne JavaScript nicht kürzen (kein „Weiterlesen“ möglich) */}
        <noscript>
          <style>{".kd-text[data-zu]{display:block;-webkit-line-clamp:unset;overflow:visible}"}</style>
        </noscript>
        <ul className="kd-karten">
          {kundenB.bewertungen.map((b, i) => (
            <li key={b.name} className="kd-karte" data-rv="" style={stufe(i % 3)}>
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
            </li>
          ))}
        </ul>

        <p className="kd-alle" data-rv="">
          <a className="b-textlink" href={kundenB.profil} target="_blank" rel="noopener noreferrer">
            {kundenB.profilLink}
          </a>
        </p>
      </div>
    </section>
  );
}
