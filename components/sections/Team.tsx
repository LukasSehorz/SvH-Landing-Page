import Image from "next/image";
import { aktuelles, ergebnisse, team } from "@/app/copy";
import Rich from "@/components/system/Rich";
import { ArrowOut, Play } from "@/components/system/Icons";

/* „Wer dahintersteckt“: kompakt. Links Text und die zwei Gründer als ruhige
   Kapseln mit Monogramm (bis Fotos da sind), rechts als Hauptbild das neueste
   Video von Jannik. Das Vorschaubild liegt lokal, erst der Klick öffnet YouTube
   in einem neuen Fenster (nichts wird eingebettet). */

// Namen nie über zwei Zeilen trennen
const teamText = team.people.reduce((t, p) => t.replace(p.name, p.name.replace(/ /g, " ")), team.text);
const neuestes = [...aktuelles.videos].sort((a, b) => b.datumIso.localeCompare(a.datumIso))[0];

function Monogramm({ initials }: Readonly<{ initials: string }>) {
  return (
    <span className="team-mono" aria-hidden="true">
      <svg className="team-ring" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="59.25" />
      </svg>
      <span className="team-ini" data-len={initials.length}>
        {initials}
      </span>
    </span>
  );
}

export default function Team() {
  return (
    <section className="section team" id="team" aria-labelledby="team-title">
      <div className="shell team-grid">
        <div className="team-copy">
          <p className="label" data-reveal="">
            {team.label}
          </p>
          <h2 className="h2 team-title" id="team-title" data-split="">
            <Rich text={team.title} />
          </h2>
          <p className="lead team-text" data-reveal="">
            <Rich text={teamText} />
          </p>
          <ul className="team-people" data-reveal="">
            {team.people.map((p) => (
              <li key={p.name} className="team-person">
                <Monogramm initials={p.initials} />
                <span className="team-meta">
                  <h3 className="team-name">{p.name}</h3>
                  <span className="team-role">{p.role}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        {neuestes ? (
          <a className="team-video" href={neuestes.href} target="_blank" rel="noopener noreferrer" data-reveal="">
            <span className="team-thumb">
              <Image
                src={neuestes.bild}
                alt={neuestes.alt}
                width={1280}
                height={720}
                quality={85}
                sizes="(max-width: 999px) calc(100vw - 40px), 640px"
              />
              <span className="team-play" aria-hidden="true">
                <Play size={22} />
              </span>
            </span>
            <span className="team-video-body">
              <span className="team-video-meta">
                {aktuelles.latest} ·{" "}
                <time className="nb" dateTime={neuestes.datumIso}>
                  {neuestes.datum}
                </time>
              </span>
              <span className="team-video-text">{team.video}</span>
              <span className="team-video-cta">
                {team.videoCta}
                <ArrowOut />
                <span className="sr-only">({ergebnisse.newWindow})</span>
              </span>
            </span>
          </a>
        ) : null}
      </div>
    </section>
  );
}
