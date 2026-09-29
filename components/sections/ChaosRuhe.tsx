"use client";

import { useRef } from "react";
import { chaos } from "@/app/copy";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useMediaQuery, useMotionMode } from "@/lib/hooks";
import LiveScene, { type Variant } from "./chaos/LiveScene";
import StaticScene from "./chaos/StaticScene";
import { ChaosDefs, Words } from "./chaos/parts";
import { buildTimeline, fitScene } from "./chaos/timeline";

/* ====================================================================
   „Vom Chaos zur Ruhe“ · Der Posteingang, der sich selbst leert.
   Gepinnte Szene (CSS sticky, GSAP ScrollTrigger scrubbt den Zeitstrahl):
   Takt 1 Einträge stapeln sich, Takt 2 sie ordnen sich in vier Gruppen,
   Takt 3 eine Linie fährt durch, alles wird abgehakt, „Alles erledigt“.
   Server-HTML, ohne JavaScript, reduzierte Bewegung und sehr niedrige
   Fenster: drei Takte untereinander mit je einem statischen Zustand.
   ==================================================================== */

const B = chaos.beats;
// Scrollweg im gepinnten Zustand in Bildschirmhöhen (muss zum CSS passen: .chaos--live)
const RUN = { win: 2.8, stack: 2.1 } as const;
// Einlauf: Zeitstrahl beginnt, wenn die Sektionsoberkante bei 70 % der Höhe steht
const ENTRY = 0.7;

function Beat({ i }: { i: number }) {
  const b = B[i];
  const Title = i === 1 ? "p" : "h2";
  return (
    <div className="chaos-beat" data-i={i}>
      {b.label ? <p className="label chaos-label">{b.label}</p> : <p className="label chaos-label chaos-label--empty" aria-hidden="true" />}
      <Title className="chaos-title" id={i === 0 ? "chaos-title" : undefined}>
        <Words text={b.title} />
      </Title>
      <p className="chaos-text">
        <Words text={b.text} />
      </p>
    </div>
  );
}

function StaticStory() {
  return (
    <div className="shell chaos-static">
      {B.map((_, i) => (
        <div className="chaos-row" key={i}>
          <Beat i={i} />
          <div className="chaos-still" role={i === 0 ? "img" : undefined} aria-label={i === 0 ? chaos.scene.alt : undefined}>
            <StaticScene state={i as 0 | 1 | 2} />
          </div>
        </div>
      ))}
    </div>
  );
}

function LiveStory({ variant }: { variant: Variant }) {
  const stage = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = stage.current;
      const section = root?.parentElement;
      if (!root || !section) return;
      fitScene(root, variant);
      const tl = buildTimeline(root, variant, ENTRY, RUN[variant]);
      const st = ScrollTrigger.create({
        trigger: section,
        start: `top ${Math.round(ENTRY * 100)}%`,
        end: "bottom bottom",
        scrub: variant === "win" ? 0.5 : 0.35,
        animation: tl,
      });
      ScrollTrigger.refresh();

      // Nur die Skalierung nachführen, der Zeitstrahl rechnet in Entwurfsmaßen
      let raf = 0;
      const ro = new ResizeObserver(() => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => fitScene(root, variant));
      });
      const box = root.querySelector(".cs--live");
      if (box) ro.observe(box);
      return () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        st.kill();
      };
    },
    { scope: stage, dependencies: [variant], revertOnUpdate: true },
  );

  return (
    <div className="chaos-stage" ref={stage}>
      <div className="chaos-glow" aria-hidden="true" />
      <div className="shell chaos-frame">
        <div className="chaos-copy">
          <div className="chaos-beats">
            {B.map((_, i) => (
              <Beat key={i} i={i} />
            ))}
          </div>
          <div className="chaos-steps" aria-hidden="true">
            <i>
              <b />
            </i>
            <i>
              <b />
            </i>
            <i>
              <b />
            </i>
          </div>
        </div>
        <div className="chaos-visual" role="img" aria-label={chaos.scene.alt}>
          <LiveScene variant={variant} />
        </div>
      </div>
    </div>
  );
}

export default function ChaosRuhe() {
  const mode = useMotionMode();
  const wide = useMediaQuery("(min-width: 960px)");
  // Pin nur, wenn genug Höhe da ist (sonst sauberer statischer Ablauf)
  const tall = useMediaQuery(wide ? "(min-height: 640px)" : "(min-height: 600px)");
  const live = mode === "motion" && tall;
  return (
    <section className={live ? "chaos chaos--live" : "chaos"} id="problem" aria-labelledby="chaos-title">
      <ChaosDefs />
      {live ? <LiveStory variant={wide ? "win" : "stack"} /> : <StaticStory />}
    </section>
  );
}
