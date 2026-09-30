import { Fragment } from "react";
import { chaos } from "@/app/copy";

/* ====================================================================
   Bausteine der Szene „Der Posteingang, der sich selbst leert“.
   Reines DOM/SVG, gestochen scharf in jeder Größe. Dieselben Bausteine
   dienen der gepinnten Szene (absolut positioniert) und der statischen
   Fassung (normaler Fluss).
   ==================================================================== */

export const S = chaos.scene;
export const ITEMS = S.items;
export const GROUPS = S.groups;

/* -------------------------------------------------------- Linien-Icons */

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Symbol je Gruppe: Angebot, E-Mail, Daten abtippen, Termin. */
export function GroupIcon({ g, size = 18 }: { g: number; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      {g === 0 ? (
        <g {...stroke}>
          <path d="M5.75 2.75h5.6l3.9 3.9v9.85c0 .41-.34.75-.75.75h-8.75a.75.75 0 0 1-.75-.75V3.5c0-.41.34-.75.75-.75Z" />
          <path d="M11.1 2.9v3.95h3.95" />
          <path d="M7.75 10.25h4.5M7.75 13.25h3" />
        </g>
      ) : g === 1 ? (
        <g {...stroke}>
          <rect x="2.75" y="4.5" width="14.5" height="11" rx="2.25" />
          <path d="m3.4 5.9 6.6 4.85 6.6-4.85" />
        </g>
      ) : g === 2 ? (
        <g {...stroke}>
          <rect x="2.25" y="5" width="15.5" height="10" rx="2.25" />
          <path d="M5.6 8.2h.01M8.2 8.2h.01M10.8 8.2h.01M13.4 8.2h.01M5.6 10.6h.01M14.4 10.6h.01M7.6 12.4h4.8" strokeWidth="1.6" />
        </g>
      ) : (
        <g {...stroke}>
          <rect x="3" y="4.25" width="14" height="12.5" rx="2.25" />
          <path d="M3 8.25h14M7 2.75v3M13 2.75v3" />
          <path d="M7 11.5h.01M10 11.5h.01M13 11.5h.01M7 14h.01M10 14h.01" strokeWidth="1.7" />
        </g>
      )}
    </svg>
  );
}

/** Häkchen im Markenverlauf (Verlauf aus den eigenen SVG-Defs der Sektion). */
export function GradCheck({ size = 18, ring = false }: { size?: number; ring?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden="true" focusable="false" className="c-gcheck">
      {ring ? <circle cx="10" cy="10" r="8.6" fill="none" stroke="url(#chaos-grad)" strokeWidth="1.1" /> : null}
      <path d="M6.1 10.3 8.8 13l5.1-5.9" fill="none" stroke="url(#chaos-grad)" strokeWidth={ring ? 1.4 : 1.8} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Eigene Verlaufs-Definition, damit die Sektion ohne fremde Defs auskommt. */
export function ChaosDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="chaos-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5b8cff" />
          <stop offset="0.5" stopColor="#7c6aff" />
          <stop offset="1" stopColor="#b9a5ff" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* -------------------------------------------------------- Einträge */

/**
 * Ein Eintrag. Desktop: Zeile im Posteingang (Titel, Absender, Uhrzeit, Punkt).
 * Mobil: Mitteilung wie auf dem Sperrbildschirm (Gruppenname, Uhrzeit, Titel).
 * Welche Teile sichtbar sind, entscheidet das CSS der jeweiligen Fassung.
 */
export function Entry({ i, className = "" }: { i: number; className?: string }) {
  const it = ITEMS[i];
  return (
    <div className={`ce ${className}`} data-g={it.g} data-i={i}>
      <div className="ce-in">
        <span className="ce-ico">
          <GroupIcon g={it.g} />
          <span className="ce-lit">
            <GroupIcon g={it.g} />
          </span>
        </span>
        <span className="ce-body">
          <span className="ce-top">
            <span className="ce-app">{GROUPS[it.g].name}</span>
            <span className="ce-time">{it.time}</span>
          </span>
          <span className="ce-title">{it.title}</span>
          <span className="ce-from">{it.from}</span>
        </span>
        <span className="ce-side">
          <span className="ce-time">{it.time}</span>
          <i className="ce-dot" />
        </span>
      </div>
    </div>
  );
}

/** Kopfzeile einer Gruppe (Desktop). */
export function GroupHead({ g, className = "" }: { g: number; className?: string }) {
  return (
    <div className={`cg ${className}`} data-g={g}>
      <span className="cg-name">{GROUPS[g].name}</span>
      <span className="cg-n">{GROUPS[g].count}</span>
    </div>
  );
}

/** Erledigte Gruppe: eine ruhige Zeile mit Häkchen. */
export function DoneRow({ g, className = "" }: { g: number; className?: string }) {
  return (
    <div className={`cd ${className}`} data-g={g}>
      <span className="cd-ico">
        <GradCheck size={21} />
      </span>
      <span className="cd-name">{GROUPS[g].name}</span>
      <span className="cd-n">
        {GROUPS[g].count} {S.doneShort}
      </span>
    </div>
  );
}

/**
 * Zusammenfassung am Ende: „Alles erledigt“.
 * Fenster (Desktop): Zeile mit Anzahl und vier Kapseln.
 * Stapel (mobil): der ganze Stapel fällt in eine einzige Mitteilung „Ihre Helfer · 148 erledigt“.
 */
export function Summary({ variant, className = "" }: { variant: "win" | "stack"; className?: string }) {
  return (
    <div className={`csum ${className}`}>
      <span className="csum-check">
        <GradCheck size={variant === "win" ? 56 : 46} ring />
      </span>
      <p className="csum-title">{S.done}</p>
      {variant === "win" ? (
        <>
          <p className="csum-line">
            {S.doneLine} <b className="csum-n">{S.total}</b>
          </p>
          <ul className="csum-chips">
            {GROUPS.map((g) => (
              <li key={g.name}>
                <GradCheck size={14} />
                {g.name}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div className="csum-card">
          <span className="cd-ico">
            <GradCheck size={21} />
          </span>
          <span className="ce-body">
            <span className="ce-top">
              <span className="ce-app">{S.helpers}</span>
              <span className="ce-time">{S.now}</span>
            </span>
            <span className="csum-card-t">
              <b className="csum-n">{S.total}</b> {S.doneShort}
            </span>
            <span className="csum-card-s">{GROUPS.map((g) => g.name).join(" · ")}</span>
          </span>
        </div>
      )}
    </div>
  );
}

/** Überschrift eines Takts: Zeichenkette oder feste Zeilen (Array). */
export function TitleLines({ title }: { title: string | readonly string[] }) {
  if (typeof title === "string") return <Words text={title} />;
  return (
    <>
      {title.map((line, i) => (
        <Fragment key={i}>
          <span className="line">
            <Words text={line} />
          </span>
          {i < title.length - 1 ? " " : null}
        </Fragment>
      ))}
    </>
  );
}

/** Mitteilung, die über den Fensterrand ragt (Desktop). */
export function Toast({ t, className = "" }: { t: number; className?: string }) {
  const it = S.toasts[t];
  return (
    <div className={`ct ${className}`}>
      <span className="ce-ico">
        <GroupIcon g={it.g} />
      </span>
      <span className="ct-body">
        <span className="ct-title">{it.title}</span>
        <span className="ct-sub">{it.sub}</span>
      </span>
    </div>
  );
}

/** Fensterleiste und Kopf des Posteingangs. */
export function WindowHead({ count, time }: { count: number; time: string }) {
  return (
    <>
      <div className="cw-bar">
        <span className="cw-dots">
          <i />
          <i />
          <i />
        </span>
        <span className="cw-bar-title">{S.inbox}</span>
      </div>
      <div className="cw-head">
        <div>
          <p className="cw-title">{S.inbox}</p>
          <p className="cw-sub">
            {S.today} · <span data-clock="">{time}</span>
          </p>
        </div>
        <p className="c-count" data-zero={count === 0 ? "" : undefined}>
          <span className="c-count-bg" />
          <b data-count="">{count}</b> {S.unread}
        </p>
      </div>
    </>
  );
}

/** Kopfzeile des Mitteilungs-Stapels (mobil). */
export function StackHead({ count, time }: { count: number; time: string }) {
  return (
    <div className="cm-head">
      <p className="cm-clock">
        {S.today} · <span data-clock="">{time}</span>
      </p>
      <p className="c-count" data-zero={count === 0 ? "" : undefined}>
        <span className="c-count-bg" />
        <b data-count="">{count}</b> {S.unread}
      </p>
    </div>
  );
}

/** Text in einzelne Wörter zerlegen (für das Aufleuchten Wort für Wort). */
export function Words({ text }: { text: string }) {
  const w = text.split(" ");
  return (
    <>
      {w.map((word, i) => (
        <Fragment key={i}>
          <span className="cwd">{word}</span>
          {i < w.length - 1 ? " " : null}
        </Fragment>
      ))}
    </>
  );
}

export function fmtClock(min: number) {
  const h = Math.floor(min / 60);
  const m = Math.round(min % 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
