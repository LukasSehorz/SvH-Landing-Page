"use client";

import { useEffect, useRef, useState } from "react";
import { chaos } from "@/app/copy";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useMediaQuery, useMotionMode } from "@/lib/hooks";
import { requestRefresh } from "@/lib/refresh";
import LiveScene, { type Variant } from "./chaos/LiveScene";
import StaticScene from "./chaos/StaticScene";
import { ChaosDefs, TitleLines, Words } from "./chaos/parts";
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
const RUN = { win: 1.2, stack: 1.25 } as const;
// Einlauf: Zeitstrahl beginnt, wenn die Sektionsoberkante bei 70 % der Höhe steht
const ENTRY = 0.7;

function Beat({ i }: { i: number }) {
  const b = B[i];
  const Title = i === 1 ? "p" : "h2";
  return (
    <div className="chaos-beat" data-i={i}>
      {b.label ? <p className="label chaos-label">{b.label}</p> : <p className="label chaos-label chaos-label--empty" aria-hidden="true" />}
      <Title className="h2 chaos-title" id={i === 0 ? "chaos-title" : undefined}>
        <TitleLines title={b.title} />
      </Title>
      <p className="chaos-text">
        <Words text={b.text} />
      </p>
    </div>
  );
}

function StaticStory({ variant }: { variant: Variant }) {
  return (
    <div className="shell chaos-static">
      {B.map((_, i) => (
        <div className="chaos-row" key={i}>
          <Beat i={i} />
          <div className="chaos-still" role={i === 0 ? "img" : undefined} aria-label={i === 0 ? chaos.scene.alt : undefined}>
            <StaticScene state={i as 0 | 1 | 2} variant={variant} />
          </div>
        </div>
      ))}
    </div>
  );
}

function LiveStory({ variant }: { variant: Variant }) {
  const stage = useRef<HTMLDivElement>(null);
  // Zeitstrahl erst aufbauen, wenn die Sektion etwa einen Bildschirm entfernt ist
  const [near, setNear] = useState(false);
  // Neuaufbau nur bei echter Breitenänderung (Textumbruch ändert die Maße), nicht bei der Adressleiste
  const [layout, setLayout] = useState(0);

  useEffect(() => {
    const el = stage.current?.parentElement;
    if (!el) return;
    let idle = 0;
    // Ausgangsbreite erst im ersten Beobachter-Rückruf lesen (Layout ist dann frisch). innerWidth
    // beim Einhängen erzwingt auf dem Handy mitten in der Hydration ein Layout der ganzen Seite.
    let w = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!w) w = window.innerWidth;
        if (!e.isIntersecting) return;
        io.disconnect();
        // im Leerlauf aufbauen (bremst das Laden nicht), spätestens nach 400 ms
        const go = () => setNear(true);
        if (typeof window.requestIdleCallback === "function") idle = window.requestIdleCallback(go, { timeout: 400 });
        else idle = globalThis.setTimeout(go, 120) as unknown as number;
      },
      { rootMargin: "100% 0px" },
    );
    io.observe(el);
    let t = 0;
    const onResize = () => {
      window.clearTimeout(t);
      t = window.setTimeout(() => {
        if (!w) w = window.innerWidth;
        if (Math.abs(window.innerWidth - w) < 2) return;
        w = window.innerWidth;
        setLayout((n) => n + 1);
      }, 180);
    };
    window.addEventListener("resize", onResize);
    requestRefresh(); // Sektion hat jetzt ihre gepinnte Höhe
    return () => {
      io.disconnect();
      if (typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(idle);
      window.clearTimeout(idle);
      window.clearTimeout(t);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useGSAP(
    (_ctx, contextSafe) => {
      const root = stage.current;
      const section = root?.parentElement;
      if (!root || !section || !near) return;
      fitScene(root, variant);
      const tl = buildTimeline(root, variant, ENTRY, RUN[variant], contextSafe);
      const st = ScrollTrigger.create({
        trigger: section,
        start: `top ${Math.round(ENTRY * 100)}%`,
        end: "bottom bottom",
        scrub: variant === "win" ? 0.5 : 0.35,
        animation: tl,
      });

      // Desktop: nur die Skalierung nachführen, der Zeitstrahl rechnet in Entwurfsmaßen
      let raf = 0;
      const ro = new ResizeObserver(() => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => fitScene(root, variant));
      });
      const box = root.querySelector(".cs--live");
      if (box && variant === "win") ro.observe(box);
      return () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        st.kill();
      };
    },
    { scope: stage, dependencies: [variant, near, layout], revertOnUpdate: true },
  );

  return (
    <div className="chaos-stage" ref={stage}>
      <div className="chaos-glow" aria-hidden="true" />
      <i className="chaos-cta-probe" aria-hidden="true" />
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
  const variant: Variant = wide ? "win" : "stack";
  return (
    <section className={live ? "chaos chaos--live" : "chaos"} id="problem" aria-labelledby="chaos-title">
      <ChaosDefs />
      {live ? <LiveStory variant={variant} /> : <StaticStory variant={mode === "static" ? "stack" : variant} />}
    </section>
  );
}
