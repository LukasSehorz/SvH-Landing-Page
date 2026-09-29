import Image from "next/image";
import { aktuelles, ergebnisse, team } from "@/app/copy";
import Rich from "@/components/system/Rich";
import { ArrowOut, Play } from "@/components/system/Icons";

/* „Wer dahintersteckt“: zwei Gründer-Karten mit Monogramm (bis Fotos da sind)
   und das neueste Video von Jannik. Vorschaubild liegt lokal, erst der Klick
   öffnet YouTube in einem neuen Fenster (nichts wird eingebettet). */

const neuestes = [...aktuelles.videos].sort((a, b) => b.datumIso.localeCompare(a.datumIso))[0];

function Monogramm({ initials }: Readonly<{ initials: string }>) {
  return (
    <span className="team-mono" aria-hidden="true">
      <svg className="team-ring" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="59.25" />
      </svg>
      <span className="team-ini">{initials}</span>
    </span>
  );
}

export default function Team() {
  return (
    <section className="section team" id="team" aria-labelledby="team-title">
      <div className="shell">
        <div className="team-head">
          <div>
            <p className="label" data-reveal="">
              {team.label}
            </p>
            <h2 className="h2 team-title" id="team-title" data-split="">
              <Rich text={team.title} />
            </h2>
          </div>
          <p className="lead team-text" data-reveal="">
            <Rich text={team.text} />
          </p>
        </div>

        <div className="team-grid">
          <ul className="team-people">
            {team.people.map((p) => (
              <li key={p.name} className="team-card" data-reveal="">
                <span className="team-line" aria-hidden="true" />
                <Monogramm initials={p.initials} />
                <span className="team-meta">
                  <h3 className="team-name">{p.name}</h3>
                  <span className="team-role">{p.role}</span>
                </span>
              </li>
            ))}
          </ul>

          {neuestes ? (
            <a className="team-video" href={neuestes.href} target="_blank" rel="noopener noreferrer" data-reveal="">
              <span className="team-thumb">
                <Image
                  src={neuestes.bild}
                  alt={neuestes.alt}
                  width={1280}
                  height={720}
                  quality={85}
                  sizes="(max-width: 699px) calc(100vw - 40px), (max-width: 1099px) calc(100vw - 80px), 640px"
                />
                <span className="team-play" aria-hidden="true">
                  <Play size={22} />
                </span>
              </span>
              <span className="team-video-body">
                <span className="team-video-meta">
                  {aktuelles.latest} · <time dateTime={neuestes.datumIso}>{neuestes.datum}</time>
                </span>
                <span className="team-video-text">{team.video}</span>
                <span className="team-video-title">{neuestes.titel}</span>
                <span className="team-video-cta">
                  {team.videoCta}
                  <ArrowOut />
                  <span className="sr-only">({ergebnisse.newWindow})</span>
                </span>
              </span>
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
