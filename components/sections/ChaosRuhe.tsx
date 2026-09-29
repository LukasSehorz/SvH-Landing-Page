"use client";

import Image from "next/image";
import { useRef } from "react";
import { chaos } from "@/app/copy";
import { media } from "@/app/generated/media";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useMotionMode } from "@/lib/hooks";

/* ====================================================================
   „Vom Chaos zur Ruhe“: gepinnte Szene, Canvas zeichnet die Bildfolge
   passend zum Scrollfortschritt. Drei Text-Takte wechseln weich.
   Server-HTML und reduzierte Bewegung: Start- und Endbild untereinander
   mit allen drei Takten, ohne Pin.
   ==================================================================== */

const B = chaos.beats;

function Beat({ i, className = "" }: { i: number; className?: string }) {
  const b = B[i];
  return (
    <div className={`chaos-beat ${className}`} data-i={i}>
      {b.label ? <p className="label">{b.label}</p> : null}
      <h2 className="h2 chaos-title">{b.title}</h2>
      <p className="lead chaos-text">{b.text}</p>
    </div>
  );
}

function StaticStory() {
  const s = media.stills;
  return (
    <div className="shell chaos-static">
      {s.start ? (
        <figure className="chaos-fig">
          <Image src={s.start.d} alt={chaos.altStart} width={1600} height={900} sizes="(max-width: 1520px) 100vw, 1440px" />
        </figure>
      ) : null}
      <Beat i={0} />
      <Beat i={1} className="chaos-beat--mid" />
      {s.end ? (
        <figure className="chaos-fig">
          <Image src={s.end.d} alt={chaos.altEnd} width={1600} height={900} sizes="(max-width: 1520px) 100vw, 1440px" />
        </figure>
      ) : null}
      <Beat i={2} />
    </div>
  );
}

function PinnedStory() {
  const pin = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useGSAP(
    () => {
      const el = pin.current;
      const cv = canvas.current;
      if (!el || !cv) return;
      const ctx = cv.getContext("2d")!;
      const portrait = () => window.innerWidth / window.innerHeight < 0.72;
      let usePortrait = portrait();
      const count = media.seq.count;

      // Bildquellen: Bildfolge oder (Fallback) Start- und Endbild
      const src = (i: number) => {
        if (count) return `${usePortrait ? media.seq.mobile : media.seq.desktop}${String(i + 1).padStart(4, "0")}.webp`;
        const st = i === 0 ? media.stills.start : media.stills.end;
        return st ? (usePortrait ? st.m : st.d) : "";
      };
      const total = count || 2;
      let frames: (HTMLImageElement | null)[] = new Array(total).fill(null);
      let loadedAll = false;
      const load = (i: number) =>
        new Promise<void>((res) => {
          if (frames[i]) return res();
          const img = new window.Image();
          img.decoding = "async";
          img.onload = () => {
            frames[i] = img;
            res();
          };
          img.onerror = () => res();
          img.src = src(i);
        });

      const state = { f: 0, mix: 0 };
      let cw = 0;
      let ch = 0;
      const size = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        cw = el.clientWidth;
        ch = el.clientHeight;
        cv.width = Math.round(cw * dpr);
        cv.height = Math.round(ch * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      };

      const cover = (img: HTMLImageElement, alpha = 1) => {
        const iw = img.naturalWidth;
        const ih = img.naturalHeight;
        const s = Math.max(cw / iw, ch / ih);
        const w = iw * s;
        const h = ih * s;
        // Laptop sitzt rechts: Bild rechtsbündig ausrichten, Hochkant mittig
        const fx = usePortrait ? 0.5 : 0.78;
        ctx.globalAlpha = alpha;
        ctx.drawImage(img, (cw - w) * fx, (ch - h) * 0.5, w, h);
        ctx.globalAlpha = 1;
      };

      const nearest = (i: number) => {
        if (frames[i]) return frames[i];
        for (let d = 1; d < total; d++) {
          if (frames[i - d]) return frames[i - d];
          if (frames[i + d]) return frames[i + d];
        }
        return null;
      };

      const draw = () => {
        ctx.clearRect(0, 0, cw, ch);
        if (count) {
          const img = nearest(Math.round(state.f));
          if (img) cover(img);
        } else {
          if (frames[0]) cover(frames[0]);
          if (frames[1] && state.mix > 0) cover(frames[1], state.mix);
        }
      };

      size();
      load(0).then(draw);

      const loadAll = () => {
        if (loadedAll) return;
        loadedAll = true;
        // Reihenfolge: jedes achte Bild zuerst, dann auffüllen (weiches Scrubben auch bei langsamer Leitung)
        const order: number[] = [];
        for (let step = 8; step >= 1; step = Math.floor(step / 2)) {
          for (let i = 0; i < total; i += step) if (!order.includes(i)) order.push(i);
        }
        let k = 0;
        const next = () => {
          if (k >= order.length) return;
          const i = order[k++];
          load(i).then(() => {
            if (Math.abs(Math.round(state.f) - i) < 6) draw();
            next();
          });
        };
        for (let n = 0; n < 6; n++) next();
      };

      // Bildfolge erst laden, wenn die Szene naht
      const io = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            loadAll();
            io.disconnect();
          }
        },
        { rootMargin: "150% 0px" },
      );
      io.observe(el);

      const beats = gsap.utils.toArray<HTMLElement>(el.querySelectorAll(".chaos-beat"));
      const ticks = el.querySelectorAll<HTMLElement>(".chaos-tick");
      gsap.set(beats.slice(1), { autoAlpha: 0, y: 40 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "+=260%",
          pin: true,
          scrub: 0.5,
          refreshPriority: 2,
          onUpdate: (self) => {
            ticks.forEach((t, i) => t.toggleAttribute("data-on", self.progress >= [0, 0.4, 0.78][i]));
          },
        },
      });
      tl.to(state, { f: total - 1, duration: 1, onUpdate: draw }, 0)
        .to(state, { mix: 1, duration: 0.4, onUpdate: draw }, 0.36)
        .to(beats[0], { autoAlpha: 0, y: -40, duration: 0.07, ease: "power1.in" }, 0.26)
        .to(beats[1], { autoAlpha: 1, y: 0, duration: 0.08, ease: "power2.out" }, 0.36)
        .to(beats[1], { autoAlpha: 0, y: -40, duration: 0.07, ease: "power1.in" }, 0.63)
        .to(beats[2], { autoAlpha: 1, y: 0, duration: 0.08, ease: "power2.out" }, 0.76)
        .fromTo(el.querySelector(".chaos-progress-fill"), { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0);

      const onResize = () => {
        const p = portrait();
        if (p !== usePortrait) {
          usePortrait = p;
          frames = new Array(total).fill(null);
          loadedAll = false;
          load(0).then(draw);
          loadAll();
        }
        size();
        draw();
      };
      window.addEventListener("resize", onResize);
      ScrollTrigger.refresh();

      return () => {
        window.removeEventListener("resize", onResize);
        io.disconnect();
      };
    },
    { scope: pin },
  );

  return (
    <div className="chaos-pin" ref={pin}>
      <canvas ref={canvas} className="chaos-canvas" role="img" aria-label={`${chaos.altStart}. ${chaos.altEnd}.`} />
      <div className="chaos-shade" aria-hidden="true" />
      <div className="shell chaos-inner">
        <div className="chaos-beats">
          {B.map((_, i) => (
            <Beat key={i} i={i} />
          ))}
        </div>
        <div className="chaos-progress" aria-hidden="true">
          <span className="chaos-progress-track">
            <span className="chaos-progress-fill" />
          </span>
          <span className="chaos-ticks">
            <i className="chaos-tick" data-on="">1</i>
            <i className="chaos-tick">2</i>
            <i className="chaos-tick">3</i>
          </span>
        </div>
      </div>
    </div>
  );
}

export default function ChaosRuhe() {
  const mode = useMotionMode();
  return (
    <section className="chaos" id="problem" aria-label={B[0].label}>
      {mode === "motion" ? <PinnedStory /> : <StaticStory />}
    </section>
  );
}
