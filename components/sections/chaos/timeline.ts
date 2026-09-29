import { gsap } from "@/lib/gsap";
import { fmtClock, GROUPS, ITEMS, S } from "./parts";
import type { Variant } from "./LiveScene";

/* ====================================================================
   Choreografie der gepinnten Szene, komplett an den Scroll gekoppelt.
   Ein Zeitstrahl in Einheiten „Bildschirmhöhen Scrollweg“:
   E = Einlauf (Sektion schiebt sich ins Bild), S = gepinnter Weg.
   Takt 1 Chaos · Takt 2 Muster · Takt 3 Ruhe.
   Animiert werden nur transform und opacity.
   ==================================================================== */

// Entwurfsmaße des Fensters (Desktop). Die Szene wird als Ganzes skaliert.
export const BOX_W = 600;
export const BOX_H = 568;
const LIST_H = 424; // 540 Fensterhöhe − 40 Leiste − 76 Kopf
const LIST_TOP_M = 36; // Abstand Kopfzeile → Stapel (mobil, wie im CSS)
const SL = 6; // Versatz der Karten, die im Stapel hervorlugen

const smooth = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));

/** Skalierung der Szene an den verfügbaren Platz anpassen (ohne Neuaufbau). */
export function fitScene(root: HTMLElement, variant: Variant) {
  const box = root.querySelector<HTMLElement>(".cs--live");
  const fit = box?.querySelector<HTMLElement>(".cs-fit");
  if (!box || !fit) return;
  let k: number;
  if (variant === "win") {
    k = Math.min(box.clientWidth / BOX_W, box.clientHeight / BOX_H, 1.2);
  } else {
    const cardH = fit.querySelector<HTMLElement>(".ce")?.offsetHeight || 60;
    const need = LIST_TOP_M + 4 * (cardH + 2 * SL) + 3 * 8 + 4;
    k = Math.min(1, box.clientHeight / need);
  }
  fit.style.setProperty("--k", String(Math.max(0.55, Math.round(k * 1000) / 1000)));
}

export function buildTimeline(root: HTMLElement, variant: Variant, E: number, SS: number) {
  const win = variant === "win";
  const scene = root.querySelector<HTMLElement>(".cs--live")!;
  const all = (sel: string, r: ParentNode = scene) => Array.from(r.querySelectorAll<HTMLElement>(sel));

  const entries = all(".ce");
  const inners = entries.map((e) => e.querySelector<HTMLElement>(".ce-in")!);
  const lits = entries.map((e) => e.querySelector<HTMLElement>(".ce-lit")!);
  const heads = all(".cg");
  const dones = all(".cd");
  const line = scene.querySelector<HTMLElement>(".cline")!;
  const sum = scene.querySelector<HTMLElement>(".csum")!;
  const chips = all("li", sum);
  const toasts = all(".ct");
  const fade = scene.querySelector<HTMLElement>(".c-fade");
  const counts = all("[data-count]");
  const countBg = all(".c-count-bg");
  const clocks = all("[data-clock]");
  const glow = root.querySelector<HTMLElement>(".chaos-glow");
  const beats = all(".chaos-beat", root);
  const tWords = beats.map((b) => all(".chaos-title .cwd", b));
  const bWords = beats.map((b) => all(".chaos-text .cwd", b));
  const fills = all(".chaos-steps b", root);

  const N = entries.length;
  const cardH = entries[0].offsetHeight;
  const pitch = cardH + 8;

  // Gruppen-Anordnung (Takt 2): je Gruppe ein Stapel, vorne der neueste Eintrag
  const headH = win ? 24 : 0;
  const groupH = headH + cardH + 2 * SL;
  const gap = win ? 10 : 8;
  const total = 4 * groupH + 3 * gap;
  const top0 = win ? Math.max(0, (LIST_H - total) / 2) : 0;
  const gTop = (g: number) => top0 + g * (groupH + gap);
  const gFront = (g: number) => gTop(g) + headH;
  const slot = (s: number) => (win ? 6 : 0) + s * pitch;
  const rank = ITEMS.map((it, i) => ITEMS.slice(i + 1).filter((o) => o.g === it.g).length);
  const ofGroup = (g: number) => ITEMS.map((it, i) => (it.g === g ? i : -1)).filter((i) => i >= 0);

  const lineA = gFront(0) - 18;
  const lineB = gFront(3) + cardH + 2 * SL + 18;
  const sumH = sum.offsetHeight;
  const sumY = win ? (LIST_H - sumH) / 2 - 6 : Math.max(0, (total - sumH) / 2);

  /* ------------------------------------------------ Startzustand */
  gsap.set(entries, { transformOrigin: "50% 100%", x: 0, scale: 1 });
  entries.forEach((el, i) => gsap.set(el, { y: i < 3 ? slot(2 - i) : slot(0) - pitch * 0.55, opacity: i < 3 ? 1 : 0 }));
  gsap.set(lits, { opacity: 0 });
  gsap.set(inners, { opacity: 1 });
  heads.forEach((h, g) => gsap.set(h, { y: gTop(g) + 6, opacity: 0 }));
  dones.forEach((d, g) => gsap.set(d, { y: gFront(g), height: cardH, opacity: 0 }));
  gsap.set(line, { y: lineA, opacity: 0 });
  gsap.set(sum, { y: sumY + 16, opacity: 0 });
  gsap.set(chips, { opacity: 0, y: 6 });
  if (toasts.length) gsap.set(toasts, { opacity: 0, y: -10, scale: 0.96, transformOrigin: "100% 0%" });
  if (fade) gsap.set(fade, { opacity: 1 });
  gsap.set(countBg, { opacity: 1 });
  if (glow) gsap.set(glow, { opacity: 0 });
  gsap.set(beats, { opacity: (i: number) => (i === 0 ? 1 : 0), y: (i: number) => (i === 0 ? 0 : 22) });
  gsap.set([...tWords.flat(), ...bWords.flat()], { opacity: 0.16 });
  gsap.set(fills, { scaleX: 0, transformOrigin: "0% 50%" });

  const cnt = { v: S.start };
  const clk = { m: 8 * 60 + 50 };
  const putCount = () => {
    const t = String(Math.round(cnt.v));
    counts.forEach((c) => (c.textContent = t));
  };
  const putClock = () => {
    const t = fmtClock(clk.m);
    clocks.forEach((c) => (c.textContent = t));
  };
  putCount();
  putClock();

  /* ------------------------------------------------ Zeitstrahl */
  const T = (f: number) => E + f * SS;
  const D = (f: number) => f * SS;
  const tl = gsap.timeline({ paused: true, defaults: { ease: "none" } });

  // Wörter leuchten nacheinander auf (weich überlappend)
  const light = (ws: HTMLElement[], a: number, b: number) => {
    if (!ws.length) return;
    const each = (b - a) / (ws.length + 1.5);
    tl.to(ws, { opacity: 1, duration: each * 2.5, stagger: each, ease: "power1.inOut" }, a);
  };
  const swap = (from: number, to: number, at: number) => {
    tl.to(beats[from], { opacity: 0, y: -18, duration: D(0.03), ease: "power2.in" }, at);
    tl.to(beats[to], { opacity: 1, y: 0, duration: D(0.04), ease: "power2.out" }, at + D(0.03));
  };

  /* Takt 1 · Chaos: Einträge kommen immer schneller, Zähler klettert, Uhr läuft */
  light(tWords[0], E * 0.12, E * 0.92);
  light(bWords[0], T(0), T(0.12));
  tl.to(fills[0], { scaleX: 1, duration: T(0.345) }, 0);

  const arr = { n: 3 };
  const setY = entries.map((e) => gsap.quickSetter(e, "y", "px"));
  const setO = entries.map((e) => gsap.quickSetter(e, "opacity"));
  const renderArrivals = () => {
    const n = arr.n;
    for (let i = 0; i < N; i++) {
      const appear = i < 3 ? 1 : smooth(n - i);
      let pushes = 0;
      for (let j = i + 1; j < N; j++) pushes += j < 3 ? 1 : smooth(n - j);
      setY[i](slot(pushes) - (1 - appear) * pitch * 0.55);
      setO[i](appear);
    }
  };
  // beschleunigt: anfangs gemächlich, am Ende Schlag auf Schlag
  tl.to(arr, { n: N, duration: D(0.3), ease: (t: number) => 0.35 * t + 0.65 * t * t, onUpdate: renderArrivals }, T(0));
  tl.to(cnt, { v: S.total, duration: D(0.3), ease: "power2.in", onUpdate: putCount }, T(0));
  tl.to(clk, { m: 16 * 60 + 48, duration: D(0.3), onUpdate: putClock }, T(0));

  // Mitteilungen stapeln sich über dem Fensterrand (Desktop)
  toasts.forEach((t, k) => {
    const a = T(0.19 + k * 0.04);
    tl.to(t, { opacity: 1, y: 0, scale: 1, duration: D(0.03), ease: "power2.out" }, a);
    for (let o = 0; o < k; o++) {
      const depth = k - o;
      tl.to(toasts[o], { y: -11 * depth, scale: 1 - 0.05 * depth, opacity: depth === 1 ? 0.7 : 0.42, duration: D(0.03), ease: "power2.out" }, a);
    }
  });

  /* Takt 2 · Muster: gleiche Symbole leuchten gemeinsam, dann ordnet sich alles */
  swap(0, 1, T(0.33));
  tl.to(fills[1], { scaleX: 1, duration: D(0.29) }, T(0.36));
  light(tWords[1], T(0.37), T(0.45));
  light(bWords[1], T(0.44), T(0.49));

  for (let g = 0; g < 4; g++) {
    const a = T(0.39 + g * 0.022);
    const mine = ofGroup(g);
    tl.to(mine.map((i) => lits[i]), { opacity: 1, duration: D(0.009), ease: "power2.out" }, a);
    tl.to(mine.map((i) => inners[i]), { opacity: 1, duration: D(0.009) }, a);
    tl.to(inners.filter((_, i) => ITEMS[i].g !== g), { opacity: 0.38, duration: D(0.009) }, a);
    tl.to(mine.map((i) => lits[i]), { opacity: 0, duration: D(0.012), ease: "power1.in" }, a + D(0.016));
  }
  tl.to(inners, { opacity: 1, duration: D(0.012) }, T(0.478));

  const G0 = T(0.49);
  if (fade) tl.to(fade, { opacity: 0, duration: D(0.05) }, G0);
  if (toasts.length) tl.to(toasts, { opacity: 0, y: 36, x: -24, scale: 0.92, duration: D(0.045), ease: "power2.in", stagger: D(0.006) }, T(0.465));
  entries.forEach((el, i) => {
    const r = rank[i];
    const g = ITEMS[i].g;
    tl.to(
      el,
      { y: gFront(g) + r * SL, scale: 1 - r * 0.045, opacity: r === 0 ? 1 : r === 1 ? 0.72 : 0.46, duration: D(0.11), ease: "power3.inOut" },
      G0 + g * D(0.007),
    );
    if (r === 0) tl.to(lits[i], { opacity: 0.5, duration: D(0.03) }, T(0.58));
  });
  heads.forEach((h, g) => tl.to(h, { opacity: 1, y: gTop(g), duration: D(0.04), ease: "power2.out" }, T(0.565) + g * D(0.006)));

  /* Takt 3 · Ruhe: eine feine Linie fährt durch, Gruppe für Gruppe wird erledigt */
  swap(1, 2, T(0.64));
  tl.to(fills[2], { scaleX: 1, duration: D(0.28) }, T(0.67));
  light(tWords[2], T(0.68), T(0.77));
  light(bWords[2], T(0.76), T(0.83));

  const L0 = T(0.72);
  const LD = D(0.15);
  tl.to(line, { opacity: 1, duration: D(0.012) }, L0 - D(0.008));
  tl.to(line, { y: lineB, duration: LD, ease: "none" }, L0);
  tl.to(line, { opacity: 0, duration: D(0.016) }, L0 + LD - D(0.012));
  if (glow) tl.to(glow, { opacity: 1, duration: D(0.2), ease: "power1.inOut" }, L0);
  let left: number = S.total;
  GROUPS.forEach((grp, g) => {
    const center = gFront(g) + cardH / 2;
    const at = L0 + LD * ((center - lineA) / (lineB - lineA)) - D(0.006);
    ofGroup(g).forEach((i) => {
      if (rank[i] === 0) tl.to(entries[i], { opacity: 0, duration: D(0.018) }, at);
      else tl.to(entries[i], { y: gFront(g), scale: 0.97, opacity: 0, duration: D(0.022), ease: "power2.inOut" }, at);
    });
    tl.to(dones[g], { opacity: 1, duration: D(0.02) }, at);
    if (heads[g]) tl.to(heads[g], { opacity: 0, duration: D(0.018) }, at);
    left -= grp.count;
    tl.to(cnt, { v: left, duration: D(0.02), onUpdate: putCount }, at);
  });
  tl.to(countBg, { opacity: 0.3, duration: D(0.02) }, L0 + LD - D(0.02));

  // Übrig bleibt die ruhige Zusammenfassung
  const F0 = T(0.885);
  tl.to(dones, { opacity: 0, y: (g: number) => gFront(g) - 10, duration: D(0.035), ease: "power2.in", stagger: D(0.005) }, F0);
  tl.to(sum, { opacity: 1, y: sumY, duration: D(0.05), ease: "power2.out" }, F0 + D(0.025));
  tl.to(chips, { opacity: 1, y: 0, duration: D(0.03), stagger: D(0.006), ease: "power2.out" }, F0 + D(0.045));

  tl.set({}, {}, E + SS); // Gesamtlänge = gesamter Scrollweg
  return tl;
}
