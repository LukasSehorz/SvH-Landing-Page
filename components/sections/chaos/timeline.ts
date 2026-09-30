import { gsap } from "@/lib/gsap";
import { MOTION as M } from "@/lib/motion";
import { fmtClock, GROUPS, ITEMS, S } from "./parts";
import type { Variant } from "./LiveScene";

/* ====================================================================
   Choreografie der gepinnten Szene, komplett an den Scroll gekoppelt.
   Ein Zeitstrahl in Einheiten „Bildschirmhöhen Scrollweg“:
   E = Einlauf (Sektion schiebt sich ins Bild), S = gepinnter Weg.
   Takt 1 Chaos · Takt 2 Muster · Takt 3 Ruhe.
   Animiert werden nur transform und opacity.

   Desktop: das Fenster hat feste Entwurfsmaße und wird als Ganzes skaliert.
   Telefon: nie skaliert (Schrift bleibt 15/11 px). Stattdessen rückt die
   Szene nach oben, wenn ein kürzerer Text-Takt Platz macht, und die Zahl
   sichtbarer Gruppen richtet sich nach der echten Höhe (Rest als Kartenkanten).
   ==================================================================== */

// Entwurfsmaße des Fensters (Desktop)
export const BOX_W = 560;
export const BOX_H = 568;
const LIST_H = 424; // 540 Fensterhöhe − 40 Leiste − 76 Kopf

const smooth = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));
const DIM = 0.28; // Startdeckkraft der noch nicht aufgeleuchteten Wörter

/** Desktop: Skalierung an den verfügbaren Platz anpassen (ohne Neuaufbau). Telefon: immer 1. */
export function fitScene(root: HTMLElement, variant: Variant) {
  const box = root.querySelector<HTMLElement>(".cs--live");
  const fit = box?.querySelector<HTMLElement>(".cs-fit");
  if (!box || !fit) return;
  const k = variant === "win" ? Math.min(box.clientWidth / BOX_W, box.clientHeight / BOX_H, 1.3) : 1;
  fit.style.setProperty("--k", String(Math.max(0.55, Math.round(k * 1000) / 1000)));
}

type Wrap = <F extends (...args: never[]) => unknown>(fn: F) => F;

export function buildTimeline(root: HTMLElement, variant: Variant, E: number, SS: number, wrap: Wrap = (fn) => fn) {
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
  const counts = all("[data-chaos-count]");
  const countBg = all(".c-count-bg");
  const clocks = all("[data-clock]");
  const glow = root.querySelector<HTMLElement>(".chaos-glow");
  const visual = root.querySelector<HTMLElement>(".chaos-visual");
  const beats = all(".chaos-beat", root);
  const tWords = beats.map((b) => all(".chaos-title .cwd", b));
  const bWords = beats.map((b) => all(".chaos-text .cwd", b));
  const fills = all(".chaos-steps b", root);

  const N = entries.length;
  const cardH = entries[0].offsetHeight;
  const pitch = cardH + 8;
  const rank = ITEMS.map((it, i) => ITEMS.slice(i + 1).filter((o) => o.g === it.g).length);
  const ofGroup = (g: number) => ITEMS.map((it, i) => (it.g === g ? i : -1)).filter((i) => i >= 0);

  /* ------------------------------------------------ Telefon: Platz je Takt */
  // Kürzere Takte machen oben Platz, die Szene rückt nach (shift je Takt).
  const hBeat = beats.map((b) => b.offsetHeight);
  const hMax = Math.max(...hBeat);
  const shift = hBeat.map((h) => (win ? 0 : hMax - h));
  let avail = [0, 0, 0];
  if (!win) {
    const stage = root.getBoundingClientRect();
    const list = scene.querySelector<HTMLElement>(".cm-list")!.getBoundingClientRect();
    const cta = root.querySelector<HTMLElement>(".chaos-cta-probe")?.offsetHeight ?? 0;
    const bottom = stage.height - cta - 10; // sichtbare Unterkante über der CTA-Leiste
    const top0 = list.top - stage.top;
    avail = shift.map((s) => bottom - (top0 - s + shift[0]));
  }

  /* ------------------------------------------------ Gruppen-Anordnung (Takt 2) */
  const SL = win ? 7 : 4;
  const headH = win ? 24 : 0;
  const groupH = headH + cardH + 2 * SL;
  // Telefon: die Kanten der hinteren Karten liegen im Abstand zwischen den Gruppen.
  // So viele Gruppen, wie in Takt 2 und 3 wirklich Platz haben; der Rest als Kanten.
  let V = 4;
  let gapM = 10;
  let offM = 0;
  const needM = (v: number, gap: number) => v * cardH + (v - 1) * gap + 2 * SL + (4 - v) * SL;
  if (!win) {
    const room = Math.min(avail[1], avail[2]);
    while (V > 2 && needM(V, 10) > room) V--;
    // hohe Telefone: Gruppen luftiger verteilen und den Rest nicht nur unten lassen
    // (gut ein Drittel über, der Rest unter den Gruppen), damit die untere Bildhälfte nicht leer steht
    gapM = Math.max(10, Math.min(24, (room - needM(V, 0)) / (V - 1)));
    offM = Math.max(0, Math.min(48, (room - needM(V, gapM)) * 0.35));
  }
  scene.dataset.groups = String(V); // zur Kontrolle im Test
  const gapG = win ? 10 : gapM;
  const pitchG = win ? groupH + gapG : cardH + gapM;
  const total = win ? 4 * groupH + 3 * gapG : needM(V, gapM);
  const top0 = win ? Math.max(0, (LIST_H - total) / 2) : offM;
  const gTop = (g: number) => top0 + Math.min(g, V - 1) * pitchG;
  const gFront = (g: number) => gTop(g) + headH;
  // eingeklappte Gruppen (nur Telefon, wenn es eng ist) liegen als Kanten hinter der letzten
  const extra = (g: number) => Math.max(0, g - (V - 1));
  const slot = (s: number) => (win ? 6 : 0) + s * pitch;

  const lineA = gFront(0) - 18;
  const lineB = gFront(V - 1) + cardH + 2 * SL + (4 - V) * SL + 18;
  const sumH = sum.offsetHeight;
  const card = sum.querySelector<HTMLElement>(".csum-card");
  const sumY = win ? (LIST_H - sumH) / 2 - 6 : Math.max(0, (avail[2] - sumH) / 2);
  const cardY = sumY + (card?.offsetTop ?? sumH / 2);

  /* ------------------------------------------------ Startzustand */
  gsap.set(entries, { transformOrigin: "50% 100%", x: 0, scale: 1 });
  entries.forEach((el, i) => gsap.set(el, { y: i < 3 ? slot(2 - i) : slot(0) - 16, opacity: i < 3 ? 1 : 0 }));
  gsap.set(lits, { opacity: 0 });
  gsap.set(inners, { opacity: 1 });
  heads.forEach((h, g) => gsap.set(h, { y: gTop(g) + 6, opacity: 0 }));
  dones.forEach((d, g) => gsap.set(d, { y: gFront(g), height: cardH, opacity: 0, scale: 1, transformOrigin: "50% 50%" }));
  gsap.set(line, { y: lineA, opacity: 0 });
  gsap.set(sum, { y: sumY + 14, opacity: 0 });
  if (chips.length) gsap.set(chips, { opacity: 0, y: 6 });
  const toastInner = toasts.map((t) => Array.from(t.children) as HTMLElement[]);
  if (toasts.length) {
    gsap.set(toasts, { opacity: 0, y: -10, scale: 0.96, transformOrigin: "100% 0%" });
    gsap.set(toastInner.flat(), { opacity: 1 });
  }
  if (fade) gsap.set(fade, { opacity: 1 });
  if (countBg.length) gsap.set(countBg, { opacity: 1 });
  if (glow) gsap.set(glow, { opacity: 0 });
  if (visual) gsap.set(visual, { y: -shift[0] });
  gsap.set(beats, { opacity: (i: number) => (i === 0 ? 1 : 0), y: (i: number) => (i === 0 ? 0 : 22) });
  const words = [...tWords.flat(), ...bWords.flat()];
  if (words.length) gsap.set(words, { opacity: DIM });
  if (fills.length) gsap.set(fills, { scaleX: 0, transformOrigin: "0% 50%" });

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
  /* Takt wechseln: Der Scroll entscheidet, WANN, die Dauer läuft in echter Zeit
     (vorher hing der Wechsel an 12 bis 40 px Scrollweg und lief in 30 bis 50 ms,
     auf dem Telefon in einem einzigen Bild durch). Erst aus, dann ein; die Szene
     rückt dabei ruhig in den frei gewordenen Platz. Rückwärts genauso zurück. */
  const beatAt = [0, 0, 0];
  const swap = (_from: number, to: number, at: number) => {
    beatAt[to] = at + D(0.03);
  };
  let beat = -1;
  const showBeat = (next: number, instant: boolean) => {
    if (next === beat) return;
    const dir = beat < 0 || next > beat ? 1 : -1;
    beat = next;
    if (instant) {
      gsap.set(beats, { opacity: (i: number) => (i === next ? 1 : 0), y: (i: number) => (i === next ? 0 : 22), overwrite: true });
      if (visual) gsap.set(visual, { y: -shift[next], overwrite: true });
      return;
    }
    beats.forEach((b, i) => {
      if (i === next) return;
      if (Number(gsap.getProperty(b, "opacity")) > 0.01) gsap.to(b, { opacity: 0, y: -14 * dir, duration: M.step.out, ease: M.out, overwrite: true });
    });
    // erst ganz aus, dann ein (nie Text über Text)
    const b = beats[next];
    const hidden = Number(gsap.getProperty(b, "opacity")) < 0.05;
    const delay = hidden ? M.step.out + M.step.gap : 0;
    gsap.fromTo(b, { y: hidden ? 18 * dir : Number(gsap.getProperty(b, "y")) }, { y: 0, duration: M.step.in + 0.1, delay, ease: M.ease, overwrite: true });
    gsap.to(b, { opacity: 1, duration: M.step.in, delay, ease: M.fade });
    if (visual) gsap.to(visual, { y: -shift[next], duration: 0.9, ease: "power2.inOut", overwrite: true });
  };

  /* Takt 1 · Chaos: Einträge kommen immer schneller, Zähler klettert, Uhr läuft */
  light(tWords[0], E * 0.04, E * 0.62); // Überschrift steht beim Einrasten schon voll da
  light(bWords[0], E * 0.62, T(0.11));
  if (fills[0]) tl.to(fills[0], { scaleX: 1, duration: T(0.345) }, 0);

  const arr = { n: 3 };
  const setY = entries.map((e) => gsap.quickSetter(e, "y", "px"));
  const setO = entries.map((e) => gsap.quickSetter(e, "opacity"));
  const renderArrivals = () => {
    const n = arr.n;
    for (let i = 0; i < N; i++) {
      // der Neue gleitet erst ein, wenn die anderen Platz gemacht haben
      const appear = i < 3 ? 1 : smooth(n - i);
      const shown = i < 3 ? 1 : smooth((n - i - 0.35) / 0.65);
      let pushes = 0;
      for (let j = i + 1; j < N; j++) pushes += j < 3 ? 1 : smooth(n - j);
      setY[i](slot(pushes) - (1 - appear) * 16);
      setO[i](shown);
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
      tl.to(toasts[o], { y: -11 * depth, scale: 1 - 0.05 * depth, opacity: depth === 1 ? 0.75 : 0.45, duration: D(0.03), ease: "power2.out" }, a);
      // hintere Mitteilungen: nur die Kante bleibt sichtbar
      if (depth === 1) tl.to(toastInner[o], { opacity: 0, duration: D(0.02) }, a);
    }
  });

  /* Takt 2 · Muster: gleiche Symbole leuchten gemeinsam, dann ordnet sich alles */
  swap(0, 1, T(0.33));
  if (fills[1]) tl.to(fills[1], { scaleX: 1, duration: D(0.29) }, T(0.36));
  light(tWords[1], T(0.37), T(0.44));
  light(bWords[1], T(0.43), T(0.48));

  for (let g = 0; g < 4; g++) {
    const a = T(0.39 + g * 0.022);
    const mine = ofGroup(g);
    if (!mine.length) continue;
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
    const g = ITEMS[i].g;
    const r = rank[i];
    const x = extra(g);
    // eingeklappte Gruppe: nur ihre vorderste Karte bleibt als Kante sichtbar
    const depth = x ? 2 + x : r;
    const op = x ? (r === 0 ? 0.4 : 0) : r === 0 ? 1 : r === 1 ? 0.8 : 0.55;
    tl.to(
      el,
      { y: gFront(g) + depth * SL, scale: 1 - depth * 0.045, opacity: op, duration: D(0.11), ease: "power3.inOut" },
      G0 + Math.min(g, V - 1) * D(0.007),
    );
    if (r === 0 && !x) tl.to(lits[i], { opacity: 0.5, duration: D(0.03) }, T(0.58));
    // hintere Karten im Stapel: nur die Kante bleibt sichtbar
    else tl.to(inners[i], { opacity: 0, duration: D(0.05) }, G0 + Math.min(g, V - 1) * D(0.007) + D(0.03));
  });
  heads.forEach((h, g) => tl.to(h, { opacity: 1, y: gTop(g), duration: D(0.04), ease: "power2.out" }, T(0.565) + g * D(0.006)));

  /* Takt 3 · Ruhe: eine feine Linie fährt durch, Gruppe für Gruppe wird erledigt */
  swap(1, 2, T(0.64));
  if (fills[2]) tl.to(fills[2], { scaleX: 1, duration: D(0.28) }, T(0.67));
  light(tWords[2], T(0.68), T(0.76));
  light(bWords[2], T(0.75), T(0.82));

  const L0 = T(0.72);
  const LD = D(0.15);
  tl.to(line, { opacity: 1, duration: D(0.012) }, L0 - D(0.008));
  tl.to(line, { y: lineB, duration: LD, ease: "none" }, L0);
  tl.to(line, { opacity: 0, duration: D(0.016) }, L0 + LD - D(0.012));
  if (glow) tl.to(glow, { opacity: 1, duration: D(0.2), ease: "power1.inOut" }, L0);
  let left: number = S.total;
  GROUPS.forEach((grp, g) => {
    const gv = Math.min(g, V - 1);
    const center = gFront(gv) + cardH / 2;
    const at = L0 + LD * ((center - lineA) / (lineB - lineA)) - D(0.006);
    const collapsed = extra(g) > 0;
    // erst verschwindet der Inhalt, dann kommt die erledigte Zeile (kein Text über Text)
    ofGroup(g).forEach((i) => {
      if (rank[i] === 0 && !collapsed) {
        tl.to(inners[i], { opacity: 0, duration: D(0.01) }, at);
        tl.to(entries[i], { opacity: 0, duration: D(0.01) }, at + D(0.022));
      } else tl.to(entries[i], { y: gFront(g), scale: 0.97, opacity: 0, duration: D(0.022), ease: "power2.inOut" }, at);
    });
    if (!collapsed) tl.to(dones[g], { opacity: 1, duration: D(0.016) }, at + D(0.009));
    if (heads[g]) tl.to(heads[g], { opacity: 0, duration: D(0.018) }, at);
    left -= grp.count;
    tl.to(cnt, { v: left, duration: D(0.02), onUpdate: putCount }, at);
  });
  if (countBg.length) tl.to(countBg, { opacity: 0.3, duration: D(0.02) }, L0 + LD - D(0.02));

  // Übrig bleibt die ruhige Zusammenfassung. Erst aus, dann ein.
  const F0 = T(0.885);
  const shown = dones.filter((_, g) => !extra(g));
  if (!shown.length) {
    // nichts auszublenden
  } else if (win) {
    tl.to(shown, { opacity: 0, y: (g: number) => gFront(g) - 10, duration: D(0.035), ease: "power2.in", stagger: D(0.005) }, F0);
  } else {
    // mobil fällt der Stapel in eine einzige Mitteilung zusammen
    tl.to(shown, { opacity: 0, y: cardY, scale: 0.94, duration: D(0.045), ease: "power2.in", stagger: D(0.004) }, F0);
  }
  tl.to(sum, { opacity: 1, y: sumY, duration: D(0.05), ease: "power2.out" }, F0 + D(0.045));
  if (chips.length) tl.to(chips, { opacity: 1, y: 0, duration: D(0.03), stagger: D(0.006), ease: "power2.out" }, F0 + D(0.065));

  tl.set({}, {}, E + SS); // Gesamtlänge = gesamter Scrollweg

  const syncBeat = (instant: boolean) => {
    const t = tl.time();
    showBeat(t >= beatAt[2] ? 2 : t >= beatAt[1] ? 1 : 0, instant);
  };
  syncBeat(true);
  tl.eventCallback("onUpdate", wrap(() => syncBeat(false)));
  return tl;
}
