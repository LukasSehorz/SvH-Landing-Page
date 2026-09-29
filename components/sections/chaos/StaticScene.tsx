import { Entry, GROUPS, GroupHead, ITEMS, S, StackHead, Summary, Toast, WindowHead } from "./parts";

/* ====================================================================
   Statische Zustände der Szene (Server-HTML, ohne JavaScript und bei
   reduzierter Bewegung): 0 = Chaos, 1 = Muster (gruppiert), 2 = Ruhe.
   Beide Fassungen stehen im HTML, das CSS zeigt je Breite eine davon.
   ==================================================================== */

/** Neuester Eintrag je Gruppe (vorne im Stapel). */
function newestOf(g: number) {
  let last = -1;
  ITEMS.forEach((it, i) => {
    if (it.g === g) last = i;
  });
  return last;
}

const NEWEST_FIRST = ITEMS.map((_, i) => ITEMS.length - 1 - i);

function WindowState({ state }: { state: 0 | 1 | 2 }) {
  return (
    <div className="cs-box">
      <div className="cw">
        <WindowHead count={state === 2 ? 0 : S.total} time="16:48" />
        <div className="cw-list">
          {state === 0 ? (
            <div className="cs-flow">
              {NEWEST_FIRST.slice(0, 7).map((i) => (
                <Entry key={i} i={i} />
              ))}
            </div>
          ) : state === 1 ? (
            <div className="cs-groups">
              {GROUPS.map((_, g) => (
                <div className="cs-group" key={g}>
                  <GroupHead g={g} />
                  <div className="cs-stk">
                    <Entry i={newestOf(g)} className="is-lit" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="cs-rest">
              <Summary />
            </div>
          )}
          {state === 0 ? <span className="cw-fade" aria-hidden="true" /> : null}
        </div>
      </div>
      {state === 0 ? (
        <div className="cs-toasts">
          {S.toasts.map((_, t) => (
            <Toast key={t} t={t} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function StackState({ state }: { state: 0 | 1 | 2 }) {
  return (
    <div className="cm">
      <StackHead count={state === 2 ? 0 : S.total} time="16:48" />
      {state === 0 ? (
        <div className="cm-list cs-flow">
          {NEWEST_FIRST.slice(0, 5).map((i) => (
            <Entry key={i} i={i} />
          ))}
          <span className="cm-fade" aria-hidden="true" />
        </div>
      ) : state === 1 ? (
        <div className="cm-list cs-groups">
          {GROUPS.map((_, g) => (
            <div className="cs-stk" key={g}>
              <Entry i={newestOf(g)} className="is-lit" />
            </div>
          ))}
        </div>
      ) : (
        <div className="cm-list cs-rest">
          <Summary />
        </div>
      )}
    </div>
  );
}

export default function StaticScene({ state }: { state: 0 | 1 | 2 }) {
  return (
    <div className="cs cs--static" data-state={state} aria-hidden="true">
      <div className="cs-win">
        <WindowState state={state} />
      </div>
      <div className="cs-stack">
        <StackState state={state} />
      </div>
    </div>
  );
}
