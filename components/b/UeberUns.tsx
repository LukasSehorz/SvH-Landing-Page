import Image from "next/image";
import { aktuelles } from "@/app/copy";
import { company } from "@/app/content";
import { aktuellesB, teamB } from "@/app/copy-b";
import { Grad, stufe } from "./ui";

/* Über uns: die zwei Gründer ganz groß (links Lukas, rechts Jannik), darunter je ein großer Text
   über die Person. Ohne Foto steht ein gestalteter Platzhalter mit Initialen. */
export function UeberUns() {
  return (
    <section className="sb" id="ueber-uns" aria-labelledby="ueber-uns-titel">
      <div className="sb-wrap">
        <div className="b-kopf b-kopf--mitte" data-rv="">
          <h2 className="b-h2" id="ueber-uns-titel">
            <Grad text={teamB.titel} />
          </h2>
        </div>

        <ul className="uu-gruender">
          {teamB.people.map((p, i) => (
            <li key={p.name} className="uu-gruender-eintrag" data-rv="" style={stufe(i)}>
              <div className="uu-foto">
                {p.foto ? (
                  <Image src={p.foto} alt={p.name} fill sizes="(max-width: 699px) 100vw, 600px" />
                ) : (
                  <div className="uu-foto-platzhalter" aria-hidden="true">
                    <span className="uu-foto-initialen">{p.initials}</span>
                    <span className="uu-foto-hinweis">{teamB.fotoFolgt}</span>
                  </div>
                )}
              </div>
              <div className="uu-text">
                <p className="uu-name">{p.name}</p>
                <p className="uu-rolle">{p.rolle}</p>
                {p.text.map((t) => (
                  <p key={t} className="uu-absatz">
                    {t}
                  </p>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function YouTubeLogo() {
  return (
    <svg viewBox="0 0 28 20" width="28" height="20" aria-hidden="true">
      <path d="M27.4 3.1A3.5 3.5 0 0 0 25 .6C22.8 0 14 0 14 0S5.2 0 3 .6A3.5 3.5 0 0 0 .6 3.1C0 5.3 0 10 0 10s0 4.7.6 6.9A3.5 3.5 0 0 0 3 19.4c2.2.6 11 .6 11 .6s8.8 0 11-.6a3.5 3.5 0 0 0 2.4-2.5c.6-2.2.6-6.9.6-6.9s0-4.7-.6-6.9z" fill="#FF0000" />
      <path d="M11.2 14.3L18.5 10l-7.3-4.3z" fill="#fff" />
    </svg>
  );
}

function LinkedInLogo() {
  return (
    <svg viewBox="0 0 24 24" width="40" height="40" aria-hidden="true">
      <rect width="24" height="24" rx="4" fill="#0A66C2" />
      <path d="M7.1 9.5H4.6V19h2.5zM5.9 5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM19.4 13.6c0-2.6-1.4-4.3-3.7-4.3-1.3 0-2.2.7-2.6 1.4V9.5h-2.4V19h2.5v-4.9c0-1.3.4-2.5 1.9-2.5s1.7 1.4 1.7 2.6V19h2.6z" fill="#fff" />
    </svg>
  );
}

/* Einblicke in die KI-Welt: die zwei neuesten Videos (Liste aus Variante A) und unsere LinkedIn-Profile. */
export function Aktuelles() {
  const videos = aktuelles.videos.slice(0, 2);
  return (
    <section className="sb sb--tint" id="aktuelles" aria-labelledby="aktuelles-titel">
      <div className="sb-wrap">
        <div className="b-kopf b-kopf--mitte" data-rv="">
          <p className="b-label">{aktuellesB.label}</p>
          <h2 className="b-h2" id="aktuelles-titel">
            <Grad text={aktuellesB.title} />
          </h2>
          <p className="b-lead">{aktuellesB.text}</p>
        </div>
        <ul className="ak-videos">
          {videos.map((v, i) => (
            <li key={v.id} data-rv="" style={stufe(i)}>
              <a className="ak-video b-karte" href={v.href} target="_blank" rel="noopener noreferrer">
                <span className="ak-bild">
                  <Image src={v.bild} alt={v.alt} fill sizes="(max-width: 899px) 100vw, 380px" />
                  <span className="ak-play" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="20" height="20">
                      <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
                    </svg>
                  </span>
                </span>
                <span className="ak-body">
                  <time className="ak-datum" dateTime={v.datumIso}>
                    {v.datum}
                  </time>
                  <span className="ak-titel">{v.titel}</span>
                  <span className="ak-mehr">
                    {aktuellesB.ansehen}
                    <span className="sr-only"> (YouTube, neues Fenster)</span>
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
        <p className="ak-kanal" data-rv="">
          <a className="ak-yt" href={company.youtube} target="_blank" rel="noopener noreferrer">
            <YouTubeLogo />
            {aktuellesB.alle}
          </a>
        </p>

        <div className="ak-li" data-rv="">
          <p className="ak-li-titel">{aktuellesB.linkedinTitel}</p>
          <ul className="ak-li-liste">
            {aktuellesB.linkedin.map((l) => (
              <li key={l.href}>
                <a className="ak-li-link" href={l.href} target="_blank" rel="noopener noreferrer">
                  <LinkedInLogo />
                  <span>
                    <span className="ak-li-name">{l.name}</span>
                    <span className="ak-li-sub">{aktuellesB.linkedinSub}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
