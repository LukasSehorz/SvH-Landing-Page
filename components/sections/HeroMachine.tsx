"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { hero } from "@/app/copy";
import { Check, Clock } from "@/components/system/Icons";
import { PitchCenter } from "@/components/system/PitchLines";

/* ====================================================================
   „Die Arbeit erledigt sich selbst“
   Aufgaben-Kärtchen werden nacheinander in den leuchtenden KI-Kern
   gezogen und kommen rechts als „erledigt“ wieder heraus; der Zähler
   „Zeit gewonnen“ zählt mit. Der Kern ist die Partikel-Kugel der alten
   Seite (HeroField.tsx), hier als leichte 2D-Canvas-Fassung ohne three.js.
   ==================================================================== */

if (typeof window !== "undefined") gsap.registerPlugin(MotionPathPlugin);

const TASKS = hero.tasks;
const MIN = hero.minutes;

function fmt(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (!h) return `${m} Min.`;
  return m ? `${h} Std. ${m} Min.` : `${h} Std.`;
}

/* ------------------------------------------------------------ Kern */

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const PALETTE = ["#5b8cff", "#7c6aff", "#b9a5ff", "#f4f4f6"];

type Pt = { x: number; y: number; z: number; s: number; c: number; spoke: boolean; ph: number; f: number };

class Core {
  private ctx: CanvasRenderingContext2D;
  private pts: Pt[] = [];
  private hub: HTMLCanvasElement;
  private w = 0;
  private h = 0;
  private dpr = 1;
  private cx = 0;
  private cy = 0;
  private R = 100;
  private t = 1.2;
  private last = 0;
  private raf = 0;
  private pulseV = 0;
  running = false;

  constructor(private canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext("2d")!;
    const rand = mulberry32(20260825);
    const n = window.matchMedia("(max-width: 699px)").matches ? 90 : 150;
    for (let i = 0; i < n; i++) {
      const z = rand() * 2 - 1;
      const a = rand() * Math.PI * 2;
      const rxy = Math.sqrt(1 - z * z);
      const r = 0.42 + 0.58 * Math.pow(rand(), 0.65);
      const p = rand();
      this.pts.push({
        x: Math.cos(a) * rxy * r,
        y: Math.sin(a) * rxy * r,
        z: z * r,
        s: 0.7 + Math.pow(rand(), 3.5) * 5.2,
        c: p < 0.32 ? 0 : p < 0.6 ? 1 : p < 0.86 ? 2 : 3,
        spoke: rand() < 0.45,
        ph: rand() * Math.PI * 2,
        f: 0.5 + rand() * 0.9,
      });
    }
    this.hub = Core.sprite("#cfc6ff", 1);
  }

  private static sprite(color: string, core: number) {
    const s = document.createElement("canvas");
    s.width = s.height = 64;
    const g = s.getContext("2d")!;
    const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grd.addColorStop(0, color);
    grd.addColorStop(0.16, color);
    grd.addColorStop(0.3, Core.alpha(color, 0.35 * core));
    grd.addColorStop(1, Core.alpha(color, 0));
    g.fillStyle = grd;
    g.fillRect(0, 0, 64, 64);
    return s;
  }

  private static alpha(hex: string, a: number) {
    const n = parseInt(hex.slice(1), 16);
    return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
  }

  resize(w: number, h: number, cx: number, cy: number, R: number) {
    // volle Schärfe bis 2x (Retina), darüber keine sichtbare Verbesserung
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.w = w;
    this.h = h;
    this.cx = cx;
    this.cy = cy;
    this.R = R;
    this.canvas.width = Math.round(w * this.dpr);
    this.canvas.height = Math.round(h * this.dpr);
    this.draw();
  }

  pulse() {
    this.pulseV = 1;
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min((now - this.last) / 1000, 0.05);
      this.last = now;
      this.t += dt;
      this.pulseV *= Math.exp(-dt * 1.6);
      this.draw();
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  draw() {
    const { ctx, dpr, t } = this;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, this.w, this.h);

    const pv = this.pulseV;
    const R = this.R * (1 - 0.035 * pv);
    const a = t * 0.12;
    const b = -0.32 + Math.sin(t * 0.18) * 0.04;
    const ca = Math.cos(a);
    const sa = Math.sin(a);
    const cb = Math.cos(b);
    const sb = Math.sin(b);
    const F = 3.4;

    const proj: { x: number; y: number; d: number; p: Pt }[] = [];
    for (const p of this.pts) {
      const breathe = 1 + Math.sin(t * p.f * 0.6 + p.ph) * 0.015;
      const x0 = p.x * breathe;
      const y0 = p.y * breathe;
      const z0 = p.z * breathe;
      const x1 = x0 * ca + z0 * sa;
      const z1 = -x0 * sa + z0 * ca;
      const y2 = y0 * cb - z1 * sb;
      const z2 = y0 * sb + z1 * cb;
      const s = F / (F - z2);
      proj.push({ x: this.cx + x1 * R * s, y: this.cy + y2 * R * s, d: (z2 + 1) / 2, p });
    }
    proj.sort((m, n) => m.d - n.d);

    // Speichen: haarfein
    ctx.lineWidth = 0.6;
    for (const q of proj) {
      if (!q.p.spoke) continue;
      const al = (0.03 + 0.066 * q.d) * (1 + pv * 0.8);
      ctx.strokeStyle = `rgba(160,176,255,${al.toFixed(3)})`;
      ctx.beginPath();
      ctx.moveTo(this.cx, this.cy);
      ctx.lineTo(q.x, q.y);
      ctx.stroke();
    }

    // Weicher Hof um die Nabe (dezent)
    const hr = this.R * (0.42 + 0.08 * pv);
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = 0.32 + 0.12 * pv;
    ctx.drawImage(this.hub, this.cx - hr, this.cy - hr, hr * 2, hr * 2);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";

    // Punkte: gestochen scharf, Tiefe über Größe und Deckkraft
    const unit = this.R / 150;
    for (const q of proj) {
      const r = Math.max(0.9, (0.9 + q.p.s * 0.5) * unit * (0.75 + 0.5 * q.d));
      ctx.globalAlpha = 0.35 + 0.65 * q.d;
      ctx.fillStyle = PALETTE[q.p.c];
      ctx.beginPath();
      ctx.arc(q.x, q.y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Nabe: klarer, heller Kern
    ctx.beginPath();
    ctx.arc(this.cx, this.cy, 2.6 + pv * 0.8, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
  }
}

/* -------------------------------------------------------- Geometrie */

type Slot = { x: number; y: number; s: number; a: number; z: number };

/* Senkrechter Fluss auf dem Handy und bei 1024–1179 px quer (Maschine in der schmalen rechten Spalte).
   Muss zur gleichlautenden Abfrage in app/styles/hero.css passen. */
const VERTICAL = "(max-width: 699px), (min-width: 1024px) and (max-width: 1179px) and (orientation: landscape)";

function geo(W: number, H: number, counterTop: number) {
  // nach Bildschirmbreite (wie im CSS), nicht nach Bühnenbreite
  const mobile = window.matchMedia(VERTICAL).matches;
  if (mobile) {
    // Senkrechter Fluss: oben ein Stapel Arbeit, mitten der Kern, unten der Stapel „erledigt“,
    // darunter der Zähler. Dicht gepackt: der Kern füllt genau den Raum zwischen den Stapeln.
    const cardW = Math.min(240, W * 0.8);
    const cardH = 48;
    const x = (W - cardW) / 2;
    const inY = 22; // vorderste Karte oben (zwei weitere lugen je 7 px darüber hervor)
    const outY = (counterTop > 0 ? counterTop : H - 44) - 12 - 14 - cardH;
    const gap = Math.max(60, outY - inY - cardH);
    const cy = inY + cardH + gap / 2;
    return {
      mobile,
      cardW,
      cardH,
      cx: W / 2,
      cy,
      R: Math.min(W * 0.2, gap * 0.5),
      // Mittelkreis umschließt den Kern und berührt die Stapel (Kreis = 71,3 % der Grafik)
      pitch: Math.min(W * 0.92, (gap + 28) / 0.713),
      inSlot: (k: number): Slot => ({ x, y: inY - k * 7, s: 1 - k * 0.05, a: [1, 0.55, 0.28, 0][k] ?? 0, z: 10 - k }),
      outSlot: (k: number): Slot => ({ x, y: outY + k * 7, s: 1 - k * 0.05, a: [1, 0.55, 0.28, 0][k] ?? 0, z: 10 - k }),
    };
  }
  const cardW = 212;
  const cardH = 52;
  const cy = H * 0.45;
  const cx = W / 2;
  const gap = 66;
  const slotY = (k: number) => cy - cardH / 2 + (k - 1) * gap;
  return {
    mobile,
    cardW,
    cardH,
    cx,
    cy,
    R: Math.min(W * 0.27, H * 0.29),
    pitch: 0,
    inSlot: (k: number): Slot => ({ x: 0, y: slotY(k), s: 1, a: k < 3 ? 1 : 0, z: 1 }),
    outSlot: (k: number): Slot => ({ x: W - cardW, y: slotY(k), s: 1, a: k < 3 ? 1 : 0, z: 1 }),
  };
}

/** Karte auf einen Platz setzen oder dorthin bewegen */
const slotVars = (sl: Slot) => ({ x: sl.x, y: sl.y, scale: sl.s, autoAlpha: sl.a, zIndex: sl.z });

/* ------------------------------------------------------ Komponente */

export default function HeroMachine() {
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = root.current;
    const cv = canvas.current;
    if (!el || !cv) return;
    const core = new Core(cv);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const counterEl = el.querySelector<HTMLElement>(".machine-counter");
    const measure = () => geo(el.clientWidth, el.clientHeight, counterEl?.offsetTop ?? 0);
    let g = measure();
    const fit = () => {
      g = measure();
      core.resize(el.clientWidth, el.clientHeight, g.cx, g.cy, g.R);
      // Mittelkreis und Schein folgen dem Kern (senkrechter Fluss)
      el.style.setProperty("--cy", `${Math.round(g.cy)}px`);
      if (g.pitch) el.style.setProperty("--pd", `${Math.round(g.pitch)}px`);
      else el.style.removeProperty("--pd");
    };
    fit();
    if (reduced) {
      const ro = new ResizeObserver(fit);
      ro.observe(el);
      return () => ro.disconnect();
    }

    const ins = Array.from(el.querySelectorAll<HTMLElement>(".task-in"));
    const outs = Array.from(el.querySelectorAll<HTMLElement>(".task-out"));
    const valueEl = el.querySelector<HTMLElement>(".machine-counter-value")!;
    const plusEl = el.querySelector<HTMLElement>(".machine-plus")!;

    // Zustand: Warteschlange links (0 = nächstes), erledigt rechts (0 = neuestes)
    let queue = [...ins];
    let done = [...outs];
    let next = 7; // nächster Aufgabentext für die hinten nachrückende Karte
    let current = 3; // Aufgabe, die gerade eingezogen wird
    let minutes = MIN[0] + MIN[1] + MIN[2];
    let tl: gsap.core.Timeline | null = null;
    let visible = true;

    el.dataset.js = "";
    const label = (card: HTMLElement, text: string) => {
      const l = card.querySelector(".task-label");
      if (l) l.textContent = text;
    };

    const place = () => {
      queue.forEach((c, k) => gsap.set(c, slotVars(g.inSlot(k))));
      done.forEach((c, k) => gsap.set(c, slotVars(g.outSlot(k))));
    };
    place();

    const step = () => {
      const flyer = queue[0];
      const out = done[3];
      const task = current;
      label(out, TASKS[task]);
      const check = out.querySelector<SVGPathElement>(".task-check path");
      const s0 = g.inSlot(0);
      const c = { x: g.cx - g.cardW / 2, y: g.cy - g.cardH / 2 };
      const o0 = g.outSlot(0);
      const add = MIN[task % MIN.length];

      tl = gsap.timeline({
        paused: !visible,
        onComplete: () => {
          // Karten weiterreichen
          label(flyer, TASKS[next % TASKS.length]);
          gsap.set(flyer, slotVars(g.inSlot(3)));
          queue = [queue[1], queue[2], queue[3], flyer];
          done = [out, done[0], done[1], done[2]];
          current = (current + 1) % TASKS.length;
          next += 1;
          step();
        },
      });
      // Ablauf mit festen Plätzen: ein Platz wird erst neu belegt, wenn er frei ist
      tl.to(flyer, { scale: 1.02, duration: 0.35, ease: "power2.out" })
        .to(
          flyer,
          {
            motionPath: {
              path: g.mobile ? [s0, c] : [s0, { x: g.cx * 0.42, y: s0.y - 34 }, c],
              curviness: 1.25,
            },
            scale: 0.3,
            duration: 1.2,
            ease: "power2.inOut",
          },
          0.25,
        )
        // unsichtbar, bevor es klein wird: kein Rest-Kärtchen im Kern
        .to(flyer, { autoAlpha: 0, duration: 0.3, ease: "power1.in" }, 0.62)
        .add(() => core.pulse(), 1.45)
        .to(queue[1], { ...slotVars(g.inSlot(0)), duration: 0.8, ease: "expo.out" }, 0.75)
        .to(queue[2], { ...slotVars(g.inSlot(1)), duration: 0.8, ease: "expo.out" }, 0.85)
        .fromTo(queue[3], slotVars(g.inSlot(3)), { ...slotVars(g.inSlot(2)), duration: 0.8, ease: "expo.out" }, 1.25);
      done.slice(0, 3).forEach((d, k) => {
        const last = k === 2;
        tl!.to(d, { ...slotVars(g.outSlot(k + 1)), duration: last ? 0.35 : 0.7, ease: last ? "power1.out" : "expo.out" }, 1.35 + (2 - k) * 0.05);
      });
      tl.fromTo(
        out,
        { x: c.x, y: c.y, scale: 0.3, autoAlpha: 0, zIndex: o0.z + 1 },
        {
          motionPath: {
            path: g.mobile ? [c, o0] : [c, { x: g.cx + (o0.x - g.cx) * 0.55, y: o0.y - 30 }, o0],
            curviness: 1.2,
          },
          scale: 1,
          duration: 1.1,
          ease: "expo.out",
          immediateRender: false,
        },
        1.75,
      );
      // erst sichtbar, wenn es über die halbe Größe gewachsen ist (kein Mini-Kärtchen im Kern)
      tl.to(out, { autoAlpha: 1, duration: 0.35, ease: "power1.out" }, 1.87);
      if (check) tl.fromTo(check, { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.45, ease: "power2.out" }, 2.3);
      tl.add(() => {
        const from = minutes;
        minutes += add;
        const o = { v: from };
        gsap.to(o, { v: minutes, duration: 0.9, ease: "power2.out", onUpdate: () => (valueEl.textContent = fmt(Math.round(o.v))) });
        plusEl.textContent = `+${add} Min.`;
        gsap.fromTo(plusEl, { y: 6, autoAlpha: 0 }, { y: -10, autoAlpha: 1, duration: 0.7, ease: "expo.out" });
        gsap.to(plusEl, { autoAlpha: 0, duration: 0.6, delay: 1.2, ease: "power1.inOut" });
      }, 2.4).to({}, { duration: 1.3 });
    };

    // Erst nach kurzer Pause starten (der Blick liegt zuerst auf der Überschrift)
    const startTimer = window.setTimeout(step, 1600);

    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        if (visible) {
          core.start();
          tl?.resume();
        } else {
          core.stop();
          tl?.pause();
        }
      },
      { rootMargin: "80px" },
    );
    io.observe(el);

    // Zähler-Kapsel blendet aus, bevor sie beim Weiterscrollen unter die Leiste gerät
    const away = new IntersectionObserver(
      ([e]) => counterEl?.toggleAttribute("data-away", !e.isIntersecting && e.boundingClientRect.top < 140),
      { rootMargin: "-100px 0px 0px 0px", threshold: 1 },
    );
    if (counterEl) away.observe(counterEl);

    let rt = 0;
    const ro = new ResizeObserver(() => {
      window.clearTimeout(rt);
      rt = window.setTimeout(() => {
        fit();
        if (tl) {
          tl.kill();
          tl = null;
          place();
          step();
        } else {
          place();
        }
      }, 120);
    });
    ro.observe(el);

    return () => {
      window.clearTimeout(startTimer);
      window.clearTimeout(rt);
      io.disconnect();
      away.disconnect();
      ro.disconnect();
      tl?.kill();
      core.stop();
      gsap.killTweensOf([...ins, ...outs, plusEl]);
    };
  }, []);

  // Statischer Endzustand fürs Server-HTML: drei warten, drei sind erledigt
  const slotsIn = [3, 4, 5, 6];
  const slotsOut = [2, 1, 0, 7];
  return (
    <div className="machine" ref={root} aria-hidden="true">
      <div className="machine-glow" />
      <PitchCenter className="machine-pitch" />
      <canvas ref={canvas} className="machine-core" />
      {slotsIn.map((t, k) => (
        <div className="task task-in" data-slot={k} key={`in-${k}`}>
          <span className="task-dot" />
          <span className="task-label">{TASKS[t]}</span>
        </div>
      ))}
      {slotsOut.map((t, k) => (
        <div className="task task-out" data-slot={k} key={`out-${k}`}>
          <span className="task-check">
            <Check size={13} />
          </span>
          <span className="task-text">
            <span className="task-label">{TASKS[t]}</span>
            <span className="task-badge">{hero.done}</span>
          </span>
        </div>
      ))}
      <div className="machine-counter">
        <span className="machine-counter-label">
          <Clock size={16} />
          {hero.counter}
        </span>
        <span className="machine-counter-value">{fmt(MIN[0] + MIN[1] + MIN[2])}</span>
        <span className="machine-plus" />
      </div>
    </div>
  );
}
