import Image from "next/image";
import { aktuelles, ergebnisse } from "@/app/copy";
import { ArrowOut } from "@/components/system/Icons";

/*
 * Videoliste für /aktuelles. Es wird nichts eingebettet: Das Vorschaubild
 * liegt bei uns (public/aktuelles), erst der Klick öffnet YouTube in einem
 * neuen Fenster. So geht beim Aufruf der Seite nichts an Google.
 * Die ganze Karte ist klickbar (gestreckter Link am Titel).
 * Vorschaubilder gehen unverändert raus (1280 px, WebP, ohne zweite Kompression):
 * mobil ca. 1,2-fach, am Desktop mindestens 2-fach der Anzeigegröße, gestochen scharf.
 */

type Video = (typeof aktuelles.videos)[number];

function PlayMark() {
  return (
    <span className="vid-play" aria-hidden="true">
      <svg viewBox="0 0 44 44" fill="none">
        <circle cx="22" cy="22" r="21" stroke="currentColor" strokeOpacity="0.55" strokeWidth="1.2" />
        <path d="M18.2 15.2 29.4 22l-11.2 6.8z" fill="currentColor" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function Card({ v, lead = false }: Readonly<{ v: Video; lead?: boolean }>) {
  return (
    <article className={`vid ${lead ? "vid--lead" : ""}`} data-reveal="">
      <div className="vid-shot">
        <span className="vid-frame">
          <Image
            src={v.bild}
            alt={v.alt}
            width={1280}
            height={720}
            sizes={lead ? "(max-width: 899px) calc(100vw - 40px), 640px" : "(max-width: 699px) calc(100vw - 40px), (max-width: 1099px) 46vw, 420px"}
            unoptimized
            loading={lead ? "eager" : "lazy"}
          />
          <span className="vid-shade" aria-hidden="true" />
          <PlayMark />
        </span>
      </div>
      <div className="vid-text">
        <p className="vid-meta">
          {lead ? <span className="chip vid-chip">{aktuelles.latest}</span> : null}
          <time dateTime={v.datumIso}>{v.datum}</time>
        </p>
        <h2 className="vid-title">
          <a className="vid-link" href={v.href} target="_blank" rel="noopener noreferrer">
            {v.titel}
            <span className="sr-only"> ({ergebnisse.newWindow})</span>
          </a>
        </h2>
        <p className="vid-body">{v.body}</p>
        <span className="vid-go" aria-hidden="true">
          {aktuelles.watch}
          <ArrowOut />
        </span>
      </div>
    </article>
  );
}

export default function Videos() {
  const [first, ...rest] = aktuelles.videos;
  return (
    <section className="vids" aria-label={aktuelles.label}>
      <div className="shell">
        {first ? <Card v={first} lead /> : null}

        {rest.length ? (
          <ul className="vid-grid">
            {rest.map((v) => (
              <li key={v.id}>
                <Card v={v} />
              </li>
            ))}
          </ul>
        ) : null}

        <div className="vid-foot" data-reveal="">
          <p className="vid-hint">{aktuelles.hint}</p>
          <a className="btn btn-ghost vid-channel" href={aktuelles.channel.href} target="_blank" rel="noopener noreferrer">
            <span>{aktuelles.channel.label}</span>
            <ArrowOut />
            <span className="sr-only"> ({ergebnisse.newWindow})</span>
          </a>
        </div>
      </div>
    </section>
  );
}
