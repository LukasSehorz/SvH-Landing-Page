"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
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
  private sprites: HTMLCanvasElement[] = [];
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
  private ring = 0;
  running = false;

  constructor(private canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext("2d")!;
    const rand = mulberry32(20260825);
    for (let i = 0; i < 150; i++) {
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
        spoke: rand() < 0.72,
        ph: rand() * Math.PI * 2,
        f: 0.5 + rand() * 0.9,
      });
    }
    this.sprites = PALETTE.map((c) => Core.sprite(c, 0.95));
    this.hub = Core.sprite("#e9e4ff", 1);
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
    this.dpr = Math.min(window.devicePixelRatio || 1, 1.75);
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
    this.ring = 0.001;
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min((now - this.last) / 1000, 0.05);
      this.last = now;
      this.t += dt;
      this.pulseV *= Math.exp(-dt * 2.4);
      if (this.ring > 0) {
        this.ring += dt * 0.85;
        if (this.ring >= 1) this.ring = 0;
      }
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
    ctx.globalCompositeOperation = "lighter";

    const pv = this.pulseV;
    const R = this.R * (1 - 0.09 * pv);
    const a = t * 0.2;
    const b = -0.3 + Math.sin(t * 0.27) * 0.06;
    const ca = Math.cos(a);
    const sa = Math.sin(a);
    const cb = Math.cos(b);
    const sb = Math.sin(b);
    const F = 3.4;

    // Schockwelle beim Verarbeiten
    if (this.ring > 0) {
      const rr = R * (0.25 + this.ring * 1.25);
      ctx.beginPath();
      ctx.arc(this.cx, this.cy, rr, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(185,165,255,${(1 - this.ring) * 0.45})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }

    const proj: { x: number; y: number; d: number; p: Pt }[] = [];
    for (const p of this.pts) {
      const breathe = 1 + Math.sin(t * p.f + p.ph) * 0.035;
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

    // Speichen zur Nabe
    ctx.lineWidth = 0.8;
    for (const q of proj) {
      if (!q.p.spoke) continue;
      const al = (0.05 + 0.12 * q.d) * (1 + pv * 1.6);
      ctx.strokeStyle = `rgba(157,180,255,${al.toFixed(3)})`;
      ctx.beginPath();
      ctx.moveTo(this.cx, this.cy);
      ctx.lineTo(q.x, q.y);
      ctx.stroke();
    }

    // Punkte mit Leuchten
    const unit = this.R / 150;
    for (const q of proj) {
      const r = q.p.s * unit * (0.7 + 0.6 * q.d) * 2.6;
      ctx.globalAlpha = 0.35 + 0.65 * q.d;
      ctx.drawImage(this.sprites[q.p.c], q.x - r, q.y - r, r * 2, r * 2);
    }
    ctx.globalAlpha = 1;

    // Nabe
    const hr = this.R * (0.5 + 0.35 * pv);
    ctx.globalAlpha = 0.8;
    ctx.drawImage(this.hub, this.cx - hr, this.cy - hr, hr * 2, hr * 2);
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.arc(this.cx, this.cy, 3.2 + pv * 2.4, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";
  }
}

/* -------------------------------------------------------- Geometrie */

function geo(W: number, H: number) {
  const mobile = W < 560;
  const cardW = mobile ? 150 : 212;
  const cardH = mobile ? 40 : 52;
  const cy = H * (mobile ? 0.44 : 0.45);
  const cx = W / 2;
  const gap = mobile ? 52 : 68;
  const slotY = (k: number) => cy - cardH / 2 + (k - 1) * gap;
  return {
    cardW,
    cardH,
    cx,
    cy,
    R: Math.min(W * (mobile ? 0.3 : 0.29), H * 0.3),
    inSlot: (k: number) => ({ x: 0, y: slotY(k) }),
    outSlot: (k: number) => ({ x: W - cardW, y: slotY(k) }),
  };
}

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
    let g = geo(el.clientWidth, el.clientHeight);
    const fit = () => {
      g = geo(el.clientWidth, el.clientHeight);
      core.resize(el.clientWidth, el.clientHeight, g.cx, g.cy, g.R);
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
      queue.forEach((c, k) => gsap.set(c, { x: g.inSlot(k).x, y: g.inSlot(k).y, scale: 1, autoAlpha: k < 3 ? 1 : 0 }));
      done.forEach((c, k) => gsap.set(c, { x: g.outSlot(k).x, y: g.outSlot(k).y, scale: 1, autoAlpha: k < 3 ? 1 : 0 }));
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
          gsap.set(flyer, { x: g.inSlot(3).x, y: g.inSlot(3).y, scale: 1, autoAlpha: 0 });
          queue = [queue[1], queue[2], queue[3], flyer];
          done = [out, done[0], done[1], done[2]];
          current = (current + 1) % TASKS.length;
          next += 1;
          step();
        },
      });
      tl.to(flyer, { scale: 1.05, duration: 0.28, ease: "power2.out" })
        .to(
          flyer,
          {
            motionPath: { path: [s0, { x: g.cx * 0.42, y: s0.y - 34 }, c], curviness: 1.25 },
            scale: 0.16,
            duration: 1.05,
            ease: "power2.in",
          },
          0.22,
        )
        .to(flyer, { autoAlpha: 0, duration: 0.32, ease: "power1.in" }, 0.95)
        .add(() => core.pulse(), 1.2)
        .to(queue[1], { y: g.inSlot(0).y, duration: 0.85, ease: "expo.out" }, 0.5)
        .to(queue[2], { y: g.inSlot(1).y, duration: 0.85, ease: "expo.out" }, 0.58)
        .fromTo(queue[3], { y: g.inSlot(3).y, autoAlpha: 0 }, { y: g.inSlot(2).y, autoAlpha: 1, duration: 0.85, ease: "expo.out" }, 0.66)
        .to(done[0], { y: g.outSlot(1).y, duration: 0.75, ease: "expo.out" }, 1.2)
        .to(done[1], { y: g.outSlot(2).y, duration: 0.75, ease: "expo.out" }, 1.26)
        .to(done[2], { y: g.outSlot(3).y, autoAlpha: 0, duration: 0.6, ease: "power2.out" }, 1.26)
        .fromTo(
          out,
          { x: c.x, y: c.y, scale: 0.16, autoAlpha: 0 },
          {
            motionPath: { path: [c, { x: g.cx + (o0.x - g.cx) * 0.55, y: o0.y - 30 }, o0], curviness: 1.2 },
            scale: 1,
            autoAlpha: 1,
            duration: 1,
            ease: "power3.out",
            immediateRender: false,
          },
          1.3,
        );
      if (check) tl.fromTo(check, { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.45, ease: "power2.out" }, 1.9);
      tl.add(() => {
        const from = minutes;
        minutes += add;
        const o = { v: from };
        gsap.to(o, { v: minutes, duration: 0.9, ease: "power2.out", onUpdate: () => (valueEl.textContent = fmt(Math.round(o.v))) });
        plusEl.textContent = `+${add} Min.`;
        gsap.fromTo(plusEl, { y: 8, autoAlpha: 0 }, { y: -22, autoAlpha: 1, duration: 0.5, ease: "power2.out" });
        gsap.to(plusEl, { autoAlpha: 0, duration: 0.5, delay: 0.9 });
      }, 1.95).to({}, { duration: 0.95 });
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
          <span className="task-label">{TASKS[t]}</span>
          <span className="task-badge">{hero.done}</span>
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
