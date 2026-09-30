"use client";

import { Fragment, useEffect, useId, useRef, useState } from "react";
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { cta, spielzug } from "@/app/copy";
import Cta from "@/components/system/Cta";
import { Arrow } from "@/components/system/Icons";
import Rich from "@/components/system/Rich";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useIsoLayoutEffect, useMotionMode } from "@/lib/hooks";
import { MOTION as M } from "@/lib/motion";
import { requestRefresh } from "@/lib/refresh";
import { axisEase, measure, type Geo } from "./geometry";

if (typeof window !== "undefined") gsap.registerPlugin(MotionPathPlugin);

/* ====================================================================
   „Der Spielzug“: Taktiktafel. Vier Stationen als Spielerkreise, eine
   gestrichelte Passlinie, der Ball läuft beim Scrollen mit (MotionPath).
   Bis 1279 px senkrecht ohne Pin, ab 1280 px waagrecht, Kopf und Tafel
   gemeinsam gepinnt. Server-HTML, ohne JS und bei reduzierter Bewegung:
   Endzustand, alles sichtbar, Ball im Tor.

   Aufbau gegen Rücksetzer: Der ScrollTrigger (mit Pin) hängt nur an
   Bewegungsmodus, Ausrichtung und Pin-Eignung. Er treibt einen Stellvertreter,
   der eine pausierte Zeitleiste vorspult. Ändert sich die Geometrie, wird nur
   diese Zeitleiste neu gebaut und auf denselben Fortschritt gesetzt.
   ==================================================================== */

const STEPS = spielzug.steps;
/** Mobil: Zeile im Raster (1 = Klammer, 5 = Gabelung, 6 = „Mit uns“, 8 = Tor) */
const ROW = [2, 3, 4, 7];
/** Auslauf nach dem Tor (Anteil der Laufstrecke) */
const TAIL = { v: 0.06, h: 0.1 };
/** Scrollweg des Pins in Bildschirmhöhen (Runde 3: 1,2 → 0,8, der Ablauf bleibt gut lesbar) */
const PIN_LEN = 0.8;
/** Mobil: Höhe im Bild, auf der der Ball mitläuft */
const FOCUS_V = "66%";
/** Deckkraft noch nicht erreichter Karten */
const DIM = 0.5;

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

/** Tor-Schrift und Knopf: „Tor! Zeit gewonnen.“ führt direkt in die Handlung */
function Finish({ where }: { where: "board" | "head" }) {
  return (
    <div className={`sz-finish sz-finish--${where}`} data-reveal="">
      <p className="sz-goaltext" data-sz-goaltext="">
        <GoalText text={spielzug.goal} />
      </p>
      <Cta href="#termin" className={where === "board" ? "btn-block-m" : ""}>
        {cta.main}
      </Cta>
    </div>
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
        {/* Spielfeldlinien unter den Karten ausgespart, damit auch gedimmte Karten nichts durchscheinen lassen */}
        <mask id={mask} maskUnits="userSpaceOnUse" x="0" y="0" width={geo.w} height={geo.h}>
          <rect x="0" y="0" width={geo.w} height={geo.h} fill="#fff" />
          {geo.holes.map((b) => (
            <rect key={`${b.x}-${b.y}`} x={b.x - 1} y={b.y - 1} width={b.w + 2} height={b.h + 2} rx="18" fill="#000" />
          ))}
        </mask>
      </defs>

      <g mask={`url(#${mask})`}>
        <g className="sz-pitch" stroke={`url(#${grad})`}>
          <path className="sz-pitch-soft" d={geo.pitchSoft} />
          <path className="sz-pitch-goal" d={geo.pitchGoal} />
        </g>
        {geo.spots.map((s) => (
          <circle key={`${s.x}-${s.y}`} className="sz-spot" cx={s.x} cy={s.y} r={s.r} />
        ))}
      </g>

      <path className="sz-bracket" data-l="bracket" d={geo.bracket} />

      <path className="sz-pass" d={geo.main} />
      <path className="sz-pass sz-pass--side" d={geo.branch} />

      <path className="sz-trail-soft" data-l="trail" d={geo.main} stroke={`url(#${grad})`} />
      <path className="sz-trail" data-l="trail" data-main="" d={geo.main} stroke={`url(#${grad})`} />
      {/* Nebenweg „Selbst umsetzen“: ruhiges Grau statt Markenverlauf */}
      <path className="sz-trail-soft sz-side" data-l="branch" d={geo.branch} />
      <path className="sz-trail sz-side" data-l="branch" d={geo.branch} />
      <path className="sz-tip sz-side-tip" data-l="tip" d={geo.tip} />

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

const navClear = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-clear")) || 92;
const isPinned = (el: HTMLElement | null) => !!el && getComputedStyle(el).position === "fixed";

export default function Board() {
  const mode = useMotionMode();
  const board = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [geo, setGeo] = useState<Geo | null>(null);
  const [pinOk, setPinOk] = useState(false);
  const geoRef = useRef<Geo | null>(null);
  /** Fortschritt des Stellvertreters, überdauert jeden Neuaufbau der Zeitleiste */
  const prog = useRef({ p: 0, dir: 1 });
  const inner = useRef<gsap.core.Timeline | null>(null);
  /** Schritte in echter Zeit (Karten, Gabelung, Tor), vom Stellvertreter angestoßen */
  const live = useRef<((time: number) => void) | null>(null);
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const layout = geo?.layout ?? null;

  // Erst aufbauen, wenn die Sektion etwa einen Bildschirm entfernt ist
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "100% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Geometrie aus der echten Lage der Elemente. Rundungsreste unter 2 px und
  // alles während des Pins werden ignoriert (sonst Neuaufbau und Rücksprung).
  useIsoLayoutEffect(() => {
    const el = board.current;
    const st = stage.current;
    if (!near || !el || !st) return;
    let raf = 0;
    const last = { w: -9, h: -9 };
    const checkPin = () => {
      if (isPinned(st)) return;
      setPinOk(window.matchMedia("(min-width: 1280px)").matches && st.offsetHeight <= window.innerHeight - navClear() - 8);
    };
    const run = () => {
      raf = 0;
      if (isPinned(st)) return;
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (Math.abs(w - last.w) < 2 && Math.abs(h - last.h) < 2) return;
      last.w = w;
      last.h = h;
      const g = measure(el);
      if (g) setGeo((prev) => (prev && prev.key === g.key ? prev : g));
      checkPin();
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(run);
    };
    run();
    const ro = new ResizeObserver(schedule);
    ro.observe(el);
    const onResize = () => {
      checkPin();
      schedule();
    };
    window.addEventListener("resize", onResize);
    document.fonts?.ready.then(() => {
      last.w = -9;
      schedule();
    });
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, [near]);

  // Aktuelle Geometrie für die Start/Ende-Funktionen des Triggers (vor dessen Aufbau setzen)
  useIsoLayoutEffect(() => {
    geoRef.current = geo;
  }, [geo]);

  // 1) ScrollTrigger: hängt nicht an der Geometrie, nur an Modus, Ausrichtung und Pin-Eignung
  useGSAP(
    () => {
      const el = board.current;
      const st = stage.current;
      if (mode !== "motion" || !layout || !el || !st) return;
      const v = layout === "v";
      const proxy = { p: 0 };
      let vars: ScrollTrigger.Vars;
      if (v) {
        // Ohne Pin: Der Ball bleibt auf fester Höhe im Bild, die Tafel läuft darunter durch
        vars = {
          trigger: el,
          start: () => `top+=${Math.round(geoRef.current?.start.y ?? 0)} ${FOCUS_V}`,
          end: () => {
            const g = geoRef.current;
            return g ? `top+=${Math.round(g.end.y + (g.end.y - g.start.y) * TAIL.v)} ${FOCUS_V}` : `bottom ${FOCUS_V}`;
          },
          scrub: 0.45,
          refreshPriority: 0,
        };
      } else if (pinOk) {
        // Kopf und Tafel gemeinsam gepinnt: „Die ersten drei kosten nichts.“ bleibt die ganze Zeit im Bild
        vars = {
          trigger: st,
          pin: st,
          start: () => `top ${navClear()}`,
          end: () => `+=${Math.round(window.innerHeight * PIN_LEN)}`,
          scrub: 0.6,
          // kein anticipatePin: Lenis scrollt im selben Bild, in dem ScrollTrigger rechnet.
          // Mit Vorgriff rastete die Tafel 19 bis 28 px zu früh ein (sichtbarer Sprung, auch
          // zurück über das Pin-Ende).
          refreshPriority: 0,
        };
      } else {
        vars = { trigger: el, start: "top 72%", end: "bottom 62%", scrub: 0.6, refreshPriority: 0 };
      }
      gsap.fromTo(
        proxy,
        { p: 0 },
        {
          p: 1,
          ease: "none",
          scrollTrigger: vars,
          onUpdate: () => {
            const r = prog.current;
            if (proxy.p !== r.p) r.dir = proxy.p > r.p ? 1 : -1;
            r.p = proxy.p;
            const tl = inner.current;
            if (tl) {
              tl.progress(proxy.p);
              live.current?.(tl.time());
            }
          },
        },
      );
      requestRefresh();
    },
    { dependencies: [mode, layout, pinOk], revertOnUpdate: true },
  );

  // Senkrecht hängen Start und Ende an der Geometrie: nur neu vermessen lassen, nicht neu bauen
  useEffect(() => {
    if (mode === "motion" && layout === "v") requestRefresh();
  }, [geo, mode, layout]);

  // 2) Zeitleiste aus der Geometrie, pausiert; der Stellvertreter spult sie vor
  useGSAP(
    (_ctx, contextSafe) => {
      const el = board.current;
      if (mode !== "motion" || !geo || !el) return;
      const $ = <T extends Element = HTMLElement>(s: string) => el.querySelector<T>(s);
      const $$ = <T extends Element = HTMLElement>(s: string) => Array.from(el.querySelectorAll<T>(s));
      const main = $<SVGPathElement>("[data-main]");
      const ball = $<SVGGElement>('[data-l="ball"]');
      if (!main || !ball) return;

      const v = geo.layout === "v";
      const tail = v ? TAIL.v : TAIL.h;
      const L = main.getTotalLength();
      const ease = axisEase(main, L, v ? "y" : "x");
      const dash = (els: Element[], len: number) => gsap.set(els, { strokeDasharray: `${len} ${len + 24}`, strokeDashoffset: len });

      const trail = $$('[data-l="trail"]');
      const branch = $$<SVGPathElement>('[data-l="branch"]');
      const bracket = $<SVGPathElement>('[data-l="bracket"]')!;
      const frame = $<SVGPathElement>('[data-l="frame"]')!;
      dash(trail, L);
      dash(branch, branch[0].getTotalLength());
      dash([bracket], bracket.getTotalLength());
      dash([frame], frame.getTotalLength());

      const on = $$(".sz-node-on");
      const cards = $$('[data-sz="card"]');
      const free = $('[data-sz="free"]');
      const fork = $('[data-sz="fork"]');
      const withEl = $('[data-sz="with"]');
      const tip = $('[data-l="tip"]');
      const net = $('[data-l="net"]');
      const ring = $('[data-l="ring"]');
      const glow = $('[data-l="glow"]');
      // Die sichtbare Tor-Schrift (in der Tafel oder im Kopf, je nach Breite)
      const goalText = Array.from(stage.current?.querySelectorAll<HTMLElement>("[data-sz-goaltext]") ?? []).find((n) => n.offsetParent !== null) ?? null;
      const T = geo.t;
      const at = (t: number) => Math.max(0, t);

      const tl = gsap.timeline({ paused: true, defaults: { ease: "none" } });

      tl.to(ball, { motionPath: { path: main, align: main, alignOrigin: [0.5, 0.5] }, duration: 1, ease, immediateRender: true }, 0);
      tl.to(trail, { strokeDashoffset: 0, duration: 1, ease }, 0);

      // Klammer „0 €“ folgt dem Ball (durchgehende Linie, bleibt an den Scroll gekoppelt)
      tl.to(bracket, { strokeDashoffset: 0, duration: Math.max(0.05, T.bracketTo - T.bracketFrom) }, T.bracketFrom);

      if (ring && contextSafe) {
        gsap.set(ring, { opacity: 0 });
        // Lichtring einmal in echter Zeit, nur beim Vorwärtsscrollen
        const pulse = contextSafe(() => {
          if (prog.current.dir < 0) return;
          gsap.fromTo(
            ring,
            { opacity: 0.85, scale: v ? 0.5 : 0.6, svgOrigin: `${geo.ring.cx} ${geo.ring.cy}` },
            { opacity: 0, scale: v ? 1.35 : 2.1, duration: v ? 1.8 : 2.2, ease: "sine.out", overwrite: true },
          );
        });
        tl.call(pulse, undefined, 1);
      }
      tl.to({}, { duration: tail }, 1);

      /* Schritte: Der Scroll entscheidet, WANN eine Station erreicht ist, die Dauer
         läuft in echter Zeit (vorher 0,035 bis 0,06 der Strecke, also 20 bis 40 px
         Scrollweg: bei normalem Lesetempo 65 bis 80 ms). Rückwärts wieder zurück. */
      type Step = { at: number; el: Element; hide: gsap.TweenVars; show: gsap.TweenVars; move?: [gsap.TweenVars, gsap.TweenVars]; dur: number; delay: number; ease: string; on?: boolean };
      const steps: Step[] = [];
      const add = (at: number, el: Element | null, hide: gsap.TweenVars, show: gsap.TweenVars, o: Partial<Pick<Step, "move" | "dur" | "delay" | "ease">> = {}) => {
        if (el) steps.push({ at, el, hide, show, move: o.move, dur: o.dur ?? M.step.in, delay: o.delay ?? 0, ease: o.ease ?? M.fade });
      };
      const rise: [gsap.TweenVars, gsap.TweenVars] = [{ y: M.step.y }, { y: 0 }];
      T.nodes.forEach((t, k) => {
        add(at(t - 0.012), on[k], { opacity: 0, scale: 0.82 }, { opacity: 1, scale: 1 }, { dur: 0.6, ease: M.ease });
        add(at(t - 0.02), cards[k], { opacity: DIM }, { opacity: 1 }, { move: rise });
      });
      add(at(T.bracketFrom - 0.02), free, { opacity: 0.55 }, { opacity: 1 });
      branch.forEach((b) => add(T.fork, b, { strokeDashoffset: b.getTotalLength() }, { strokeDashoffset: 0 }, { dur: M.line * 0.9, ease: M.draw }));
      add(T.fork, tip, { opacity: 0 }, { opacity: 1 }, { dur: 0.5, delay: 0.7 });
      add(T.fork + 0.012, fork, { opacity: DIM }, { opacity: 1 }, { move: rise, delay: 0.25 });
      add(at(T.with - 0.02), withEl, { opacity: 0.55 }, { opacity: 1 });
      // Tor: Rahmen zeichnet sich, Netz hellt auf, weicher Lichtschein, Schrift blendet ein
      add(0.9, frame, { strokeDashoffset: frame.getTotalLength() }, { strokeDashoffset: 0 }, { dur: M.line, ease: M.draw });
      add(0.93, goalText, { opacity: 0 }, { opacity: 1 }, { move: [{ y: 10 }, { y: 0 }], dur: 0.9, delay: 0.1 });
      add(0.96, net, { opacity: 0.25 }, { opacity: 1 });
      add(0.99, glow, { opacity: 0 }, { opacity: 0.6 }, { dur: 1.0 });

      const apply = (time: number, instant: boolean) => {
        steps.forEach((st) => {
          const reached = time >= st.at;
          if (st.on === reached) return;
          st.on = reached;
          const [mHide, mShow] = st.move ?? [null, null];
          if (instant) {
            gsap.set(st.el, { ...(reached ? st.show : st.hide), ...((reached ? mShow : mHide) ?? {}), overwrite: true });
            return;
          }
          if (reached) {
            gsap.to(st.el, { ...st.show, duration: st.dur, delay: st.delay, ease: st.ease, overwrite: "auto" });
            if (mShow) gsap.to(st.el, { ...mShow, duration: st.dur + 0.1, delay: st.delay, ease: M.ease, overwrite: "auto" });
          } else {
            gsap.to(st.el, { ...st.hide, ...(mHide ?? {}), duration: M.step.out, ease: M.out, overwrite: "auto" });
          }
        });
      };

      // Fortschritt übernehmen, ohne Rückrufe auszulösen (kein Lichtring beim Neuaufbau)
      tl.progress(prog.current.p, true);
      apply(tl.time(), true);
      inner.current = tl;
      live.current = contextSafe ? contextSafe((t: number) => apply(t, false)) : (t: number) => apply(t, false);
      return () => {
        if (inner.current === tl) inner.current = null;
        live.current = null;
      };
    },
    { scope: stage, dependencies: [mode, geo], revertOnUpdate: true },
  );

  const still = mode !== "motion";

  return (
    <div className="sz-stage" ref={stage}>
      <header className="sz-head">
        <div className="sz-head-copy">
          <p className="label" data-reveal="">
            {spielzug.label}
          </p>
          <h2 className="h2 sz-title" id="sz-title">
            {spielzug.title.map((l, i) => (
              <Fragment key={l}>
                {i > 0 ? " " : null}
                <span className="line" data-split="">
                  <Rich text={l} />
                </span>
              </Fragment>
            ))}
          </h2>
        </div>
        <Finish where="head" />
      </header>

      <div className="sz-board" ref={board} data-geo={geo ? geo.layout : undefined} data-reveal="fade">
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
            <Finish where="board" />
          </div>
        </div>
      </div>
    </div>
  );
}
