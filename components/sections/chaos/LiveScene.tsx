import { DoneRow, Entry, GROUPS, GroupHead, ITEMS, S, StackHead, Summary, Toast, WindowHead } from "./parts";

/* ====================================================================
   Szene für die gepinnte Fassung. Alle beweglichen Teile liegen absolut
   übereinander, Position und Deckkraft setzt ausschließlich GSAP
   (timeline.ts). Wird nur im Browser mit Bewegung gerendert.
   win   = Posteingangs-Fenster (Desktop)
   stack = Mitteilungs-Stapel wie auf dem Sperrbildschirm (mobil)
   ==================================================================== */

export type Variant = "win" | "stack";

function Moving({ variant }: { variant: Variant }) {
  return (
    <>
      {ITEMS.map((_, i) => (
        <Entry key={i} i={i} />
      ))}
      {GROUPS.map((_, g) => (
        <DoneRow key={g} g={g} />
      ))}
      <div className="cline" aria-hidden="true">
        <i className="cline-wash" />
        <i className="cline-bar" />
      </div>
      <Summary variant={variant} />
    </>
  );
}

export default function LiveScene({ variant }: { variant: Variant }) {
  if (variant === "win") {
    return (
      <div className="cs cs--live cs--win" aria-hidden="true">
        <div className="cs-fit">
          <div className="cw">
            <WindowHead count={S.start} time="08:50" />
            <div className="cw-list">
              {GROUPS.map((_, g) => (
                <GroupHead key={g} g={g} />
              ))}
              <Moving variant="win" />
              <span className="cw-fade c-fade" />
            </div>
          </div>
          {S.toasts.map((_, t) => (
            <Toast key={t} t={t} />
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="cs cs--live cs--stack" aria-hidden="true">
      <div className="cs-fit">
        <StackHead count={S.start} time="08:50" />
        <div className="cm-list">
          <Moving variant="stack" />
        </div>
        <span className="cm-fade c-fade" />
      </div>
    </div>
  );
}
