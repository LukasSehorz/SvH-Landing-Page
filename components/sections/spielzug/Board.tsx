"use client";

import { Fragment, useId, useRef, useState } from "react";
import { spielzug } from "@/app/copy";
import { Arrow } from "@/components/system/Icons";
import Rich from "@/components/system/Rich";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useIsoLayoutEffect, useMotionMode } from "@/lib/hooks";
import { axisEase, measure, type Geo } from "./geometry";

/* ====================================================================
   „Der Spielzug“: Taktiktafel. Vier Stationen als Spielerkreise, eine
   gestrichelte Passlinie, der Ball läuft beim Scrollen mit (MotionPath,
   scrub). Mobil senkrecht ohne Pin, ab 1024 px waagrecht und gepinnt.
   Server-HTML, ohne JS und bei reduzierter Bewegung: Endzustand, alles
   sichtbar, Ball im Tor.
   ==================================================================== */

const STEPS = spielzug.steps;
/** Mobil: Zeile im Raster (1 = Klammer, 5 = Gabelung, 6 = „Mit uns“, 8 = Tor) */
const ROW = [2, 3, 4, 7];

/** „0 €“ im Klammertext hervorheben, ohne den Wortlaut zu ändern */
function FreeText({ text }: { text: string }) {
  const k = text.indexOf("0 €");
  if (k < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, k)}
      <strong className="sz-free-num">0&nbsp;€</strong>
      {text.slice(k + 3)}
    </>
  );
}

/** Bindestrich-Wörter zusammenhalten (Geld-zurück-Garantie) */
function Keep({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\S+-\S+)/g).map((w, j) => (j % 2 ? <span key={j} className="nb">{w}</span> : w))}
    </>
  );
}

function GoalText({ text }: { text: string }) {
  const k = text.indexOf("!");
  if (k < 0) return <>{text}</>;
  return (
    <>
      <span className="sz-goal-big">{text.slice(0, k + 1)}</span> <span className="sz-goal-sub">{text.slice(k + 2)}</span>
    </>
  );
}

function PlanIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path d="M6 2.75h6.6L17 7.15v11.1c0 .55-.45 1-1 1H6c-.55 0-1-.45-1-1V3.75c0-.55.45-1 1-1Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M12.5 3v4.4H17M8 11.5h6M8 14.5h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Lines({ geo, still, uid }: { geo: Geo; still: boolean; uid: string }) {
  const grad = `szg-${uid}`;
  const halo = `szh-${uid}`;
  const mask = `szm-${uid}`;
  const v = geo.layout === "v";
  return (
    <svg className="sz-svg" width={geo.w} height={geo.h} viewBox={`0 0 ${geo.w} ${geo.h}`} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={grad} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={v ? 0 : geo.w} y2={v ? geo.h : 0}>
          <stop offset="0" stopColor="#5b8cff" />
          <stop offset="0.52" stopColor="#7c6aff" />
          <stop offset="1" stopColor="#b9a5ff" />
        </linearGradient>
        <radialGradient id={halo}>
          <stop offset="0" stopColor="#c9bcff" stopOpacity="0.55" />
          <stop offset="0.45" stopColor="#8f7dff" stopOpacity="0.18" />
          <stop offset="1" stopColor="#7c6aff" stopOpacity="0" />
        </radialGradient>
        {geo.hole ? (
          <mask id={mask} maskUnits="userSpaceOnUse" x="0" y="0" width={geo.w} height={geo.h}>
            <rect x="0" y="0" width={geo.w} height={geo.h} fill="#fff" />
            <rect x={geo.hole.x} y={geo.hole.y} width={geo.hole.w} height={geo.hole.h} rx="12" fill="#000" />
          </mask>
        ) : null}
      </defs>

      <g className="sz-pitch" stroke={`url(#${grad})`} mask={geo.hole ? `url(#${mask})` : undefined}>
        <path className="sz-pitch-soft" d={geo.pitchSoft} />
        <path className="sz-pitch-goal" d={geo.pitchGoal} />
      </g>
      {geo.spots.map((s) => (
        <circle key={`${s.x}-${s.y}`} className="sz-spot" cx={s.x} cy={s.y} r={s.r} />
      ))}

      <path className="sz-bracket" data-l="bracket" d={geo.bracket} />

      <path className="sz-pass" d={geo.main} />
      <path className="sz-pass" d={geo.branch} />

      <path className="sz-trail-soft" data-l="trail" d={geo.main} stroke={`url(#${grad})`} />
      <path className="sz-trail" data-l="trail" data-main="" d={geo.main} stroke={`url(#${grad})`} />
      <path className="sz-trail-soft" data-l="branch" d={geo.branch} stroke={`url(#${grad})`} />
      <path className="sz-trail" data-l="branch" d={geo.branch} stroke={`url(#${grad})`} />
      <path className="sz-tip" data-l="tip" d={geo.tip} />

      <path className="sz-net" data-l="net" d={geo.goalNet} />
      <path className="sz-goal-base" d={geo.goalFrame} />
      <path className="sz-goal-frame" data-l="frame" d={geo.goalFrame} stroke={`url(#${grad})`} />
      <circle className="sz-goal-glow" data-l="glow" cx={geo.ring.cx} cy={geo.ring.cy} r={geo.ring.r * 1.5} style={{ fill: `url(#${halo})` }} />
      <circle className="sz-ring" data-l="ring" cx={geo.ring.cx} cy={geo.ring.cy} r={geo.ring.r} />

      <g className="sz-ball" data-l="ball" transform={still ? `translate(${geo.end.x} ${geo.end.y})` : undefined}>
        <circle r={v ? 13 : 15} style={{ fill: `url(#${halo})` }} />
        <circle className="sz-ball-core" r={v ? 4 : 4.5} />
      </g>
    </svg>
  );
}

export default function Board() {
  const mode = useMotionMode();
  const board = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [geo, setGeo] = useState<Geo | null>(null);
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");

  // Geometrie aus der echten Lage der Elemente, bei jeder Größenänderung neu
  useIsoLayoutEffect(() => {
    const el = board.current;
    if (!el) return;
    let raf = 0;
    const run = () => {
      raf = 0;
      const g = measure(el);
      if (g) setGeo((prev) => (prev && prev.key === g.key ? prev : g));
    };
    run();
    const ro = new ResizeObserver(() => {
      if (!raf) raf = requestAnimationFrame(run);
    });
    ro.observe(el);
    document.fonts?.ready.then(() => {
      if (!raf) raf = requestAnimationFrame(run);
    });
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  useGSAP(
    (_ctx, contextSafe) => {
      const el = board.current;
      const stageEl = stage.current;
      if (mode !== "motion" || !geo || !el || !stageEl) return;
      const $ = <T extends Element = HTMLElement>(s: string) => el.querySelector<T>(s);
      const $$ = <T extends Element = HTMLElement>(s: string) => Array.from(el.querySelectorAll<T>(s));
      const main = $<SVGPathElement>("[data-main]");
      const ball = $<SVGGElement>('[data-l="ball"]');
      if (!main || !ball) return;

      const v = geo.layout === "v";
      const TAIL = 0.1;
      const L = main.getTotalLength();
      const ease = axisEase(main, L, v ? "y" : "x");
      const dash = (els: Element[], len: number) => gsap.set(els, { strokeDasharray: `${len} ${len + 24}`, strokeDashoffset: len });

      const trail = $$('[data-l="trail"]');
      const branch = $$<SVGPathElement>('[data-l="branch"]');
      const bracket = $<SVGPathElement>('[data-l="bracket"]')!;
      const frame = $<SVGPathElement>('[data-l="frame"]')!;
      const Lb = branch[0].getTotalLength();
      const Lk = bracket.getTotalLength();
      const Lf = frame.getTotalLength();
      dash(trail, L);
      dash(branch, Lb);
      dash([bracket], Lk);
      dash([frame], Lf);

      const on = $$(".sz-node-on");
      const cards = $$('[data-sz="card"]');
      const free = $('[data-sz="free"]');
      const fork = $('[data-sz="fork"]');
      const withEl = $('[data-sz="with"]');
      const tip = $('[data-l="tip"]');
      const net = $('[data-l="net"]');
      const ring = $('[data-l="ring"]');
      const glow = $('[data-l="glow"]');
      const goalText = $(".sz-goaltext");
      const T = geo.t;
      const at = (t: number) => Math.max(0, t);

      let st: ScrollTrigger.Vars;
      if (v) {
        // Ohne Pin: Der Ball bleibt bei 58 % der Bildhöhe, die Tafel läuft darunter durch
        const span = geo.end.y - geo.start.y;
        st = {
          trigger: el,
          start: `top+=${Math.round(geo.start.y)} 58%`,
          end: `top+=${Math.round(geo.end.y + span * TAIL)} 58%`,
          scrub: 0.45,
          refreshPriority: 0,
        };
      } else if (el.offsetHeight <= window.innerHeight - 40) {
        // Gepinnt wird die Hülle, damit Ränder der Tafel (1024–1279 über den Rand) erhalten bleiben
        st = {
          trigger: stageEl,
          pin: stageEl,
          start: "center center",
          end: () => `+=${Math.round(window.innerHeight * 1.6)}`,
          scrub: 0.6,
          anticipatePin: 1,
          refreshPriority: 0,
        };
      } else {
        st = { trigger: el, start: "top 72%", end: "bottom 62%", scrub: 0.6, refreshPriority: 0 };
      }

      const tl = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: st });

      tl.to(ball, { motionPath: { path: main, align: main, alignOrigin: [0.5, 0.5] }, duration: 1, ease, immediateRender: true }, 0);
      tl.to(trail, { strokeDashoffset: 0, duration: 1, ease }, 0);

      T.nodes.forEach((t, k) => {
        tl.fromTo(on[k], { autoAlpha: 0, scale: 0.82 }, { autoAlpha: 1, scale: 1, duration: 0.035, ease: "power2.out" }, at(t - 0.018));
        tl.fromTo(cards[k], { opacity: 0.3, y: 14 }, { opacity: 1, y: 0, duration: 0.06, ease: "power1.out" }, at(t - 0.025));
      });

      if (free) tl.fromTo(free, { opacity: 0.35 }, { opacity: 1, duration: 0.05 }, at(T.bracketFrom - 0.02));
      tl.to(bracket, { strokeDashoffset: 0, duration: Math.max(0.05, T.bracketTo - T.bracketFrom) }, T.bracketFrom);

      tl.to(branch, { strokeDashoffset: 0, duration: 0.06, ease: "power1.inOut" }, T.fork);
      if (tip) tl.fromTo(tip, { opacity: 0 }, { opacity: 1, duration: 0.015 }, T.fork + 0.05);
      if (fork) tl.fromTo(fork, { opacity: 0.3, y: 14 }, { opacity: 1, y: 0, duration: 0.06, ease: "power1.out" }, T.fork + 0.012);
      if (withEl) tl.fromTo(withEl, { opacity: 0.35 }, { opacity: 1, duration: 0.04 }, at(T.with - 0.02));

      // Tor: Rahmen zeichnet sich fertig, Netz hellt auf, weicher Lichtring, Schrift blendet ein
      tl.to(frame, { strokeDashoffset: 0, duration: 0.1, ease: "power1.inOut" }, 0.92);
      if (net) tl.fromTo(net, { opacity: 0.25 }, { opacity: 1, duration: 0.05 }, 0.98);
      if (glow) tl.fromTo(glow, { opacity: 0 }, { opacity: 0.6, duration: 0.06, ease: "power1.out" }, 0.995);
      if (goalText) tl.fromTo(goalText, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.05, ease: "power1.out" }, 0.99);
      if (ring && contextSafe) {
        // Lichtring einmal in echter Zeit, nur beim Vorwärtsscrollen
        const pulse = contextSafe(() => {
          if ((tl.scrollTrigger?.direction ?? 1) < 0) return;
          gsap.fromTo(
            ring,
            { opacity: 0.85, scale: v ? 0.5 : 0.6, svgOrigin: `${geo.ring.cx} ${geo.ring.cy}` },
            { opacity: 0, scale: v ? 1.35 : 2.1, duration: v ? 1.8 : 2.2, ease: "sine.out", overwrite: true },
          );
        });
        tl.call(pulse, undefined, 1);
      }
      tl.to({}, { duration: TAIL }, 1);

      const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
      return () => cancelAnimationFrame(raf);
    },
    { scope: stage, dependencies: [mode, geo], revertOnUpdate: true },
  );

  const still = mode !== "motion";

  return (
    <div className="sz-stage" ref={stage}>
      <div className="sz-board" ref={board} data-geo={geo ? geo.layout : undefined}>
        <div className="sz-dots" aria-hidden="true" />
        {geo ? <Lines geo={geo} still={still} uid={uid} /> : null}

        <div className="sz-flow">
          <span className="sz-fallback" aria-hidden="true" />

          <p className="sz-free" data-sz="free">
            <FreeText text={spielzug.bracket} />
          </p>

          {STEPS.map((s, i) => (
            <Fragment key={s.title}>
              <div className="sz-step" style={{ "--r": ROW[i], "--c": `${i * 2 + 1} / ${i * 2 + 3}` } as React.CSSProperties}>
                <div className="sz-nodecell" aria-hidden="true">
                  <span className="sz-node" data-sz="node">
                    <span className="sz-node-num">{i + 1}</span>
                    <span className="sz-node-on">{i + 1}</span>
                  </span>
                </div>
                <article className="sz-card" data-sz="card" aria-labelledby={`sz-${uid}-${i}`}>
                  <p className="sz-step-no">
                    {spielzug.stepWord} {i + 1}
                  </p>
                  <h3 className="sz-card-title" id={`sz-${uid}-${i}`}>
                    <Rich text={s.title} />
                  </h3>
                  <p className="sz-card-text">
                    <Rich text={s.text} />
                  </p>
                  <p className="sz-tag">
                    <span className={`chip ${i === 3 ? "sz-chip-guarantee" : ""}`}>
                      <span>
                        <Keep text={s.tag} />
                      </span>
                    </span>
                  </p>
                </article>
              </div>

              {i === 2 ? (
                <>
                  <div className="sz-fork" data-sz="fork">
                    <h3 className="sz-fork-title">
                      <span className="sz-fork-icon">
                        <PlanIcon />
                      </span>
                      {spielzug.forkSelf.title}
                    </h3>
                    <p className="sz-fork-text">{spielzug.forkSelf.text}</p>
                  </div>
                  <p className="sz-with" data-sz="with">
                    <span>{spielzug.forkUs}</span>
                    <Arrow className="sz-with-arrow" size={16} />
                  </p>
                </>
              ) : null}
            </Fragment>
          ))}

          <div className="sz-goal">
            <span className="sz-goalmouth" data-sz="goal" aria-hidden="true" />
            <p className="sz-goaltext" data-sz="goaltext">
              <GoalText text={spielzug.goal} />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
