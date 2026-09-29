/* ====================================================================
   Geometrie der Taktiktafel. Alle Linien werden aus der echten Lage der
   HTML-Elemente berechnet (Knoten, Karten, Tor), damit Passlinie, Klammer
   und Gabelung bei jeder Breite exakt sitzen.
   Koordinaten: Pixel relativ zur Innenkante der Tafel (= SVG-Fläche).
   ==================================================================== */

export type Pt = { x: number; y: number };
type Box = { x: number; y: number; w: number; h: number };

export type Geo = {
  key: string;
  layout: "v" | "h";
  w: number;
  h: number;
  start: Pt;
  end: Pt;
  main: string;
  branch: string;
  tip: string;
  bracket: string;
  pitchSoft: string;
  pitchGoal: string;
  spots: { x: number; y: number; r: number }[];
  goalFrame: string;
  goalNet: string;
  ring: { cx: number; cy: number; r: number };
  /** Aussparung der Spielfeldlinien hinter der Tor-Schrift */
  hole: { x: number; y: number; w: number; h: number } | null;
  /** Zeitpunkte 0…1 entlang der Laufachse (y mobil, x breit) */
  t: { nodes: number[]; fork: number; with: number; bracketFrom: number; bracketTo: number };
};

const r1 = (v: number) => Math.round(v * 10) / 10;
/** Halbpixel für gestochen scharfe 1-px-Linien */
const hp = (v: number) => Math.round(v) + 0.5;

function box(el: HTMLElement, root: HTMLElement): Box {
  let x = 0;
  let y = 0;
  let n: HTMLElement | null = el;
  while (n && n !== root) {
    x += n.offsetLeft;
    y += n.offsetTop;
    n = n.offsetParent as HTMLElement | null;
  }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight };
}

function circle(cx: number, cy: number, r: number) {
  return `M${r1(cx - r)} ${r1(cy)}a${r1(r)} ${r1(r)} 0 1 0 ${r1(2 * r)} 0a${r1(r)} ${r1(r)} 0 1 0 ${r1(-2 * r)} 0`;
}

/** Netz im Tor: feines Gitter */
function net(b: Box, stepX: number, stepY: number) {
  let d = "";
  for (let x = b.x + stepX; x < b.x + b.w - 1; x += stepX) d += `M${hp(x)} ${r1(b.y)}V${r1(b.y + b.h)}`;
  for (let y = b.y + stepY; y < b.y + b.h - 1; y += stepY) d += `M${r1(b.x)} ${hp(y)}H${r1(b.x + b.w)}`;
  return d;
}

export function measure(root: HTMLElement): Geo | null {
  const q = (s: string) => Array.from(root.querySelectorAll<HTMLElement>(`[data-sz="${s}"]`));
  const nodes = q("node");
  const cards = q("card");
  const free = q("free")[0];
  const fork = q("fork")[0];
  const withEl = q("with")[0];
  const goal = q("goal")[0];
  const goalText = q("goaltext")[0];
  if (nodes.length < 4 || cards.length < 4 || !free || !fork || !withEl || !goal) return null;

  const W = root.clientWidth;
  const H = root.clientHeight;
  if (!W || !H) return null;
  const layout: "v" | "h" = window.matchMedia("(min-width: 1024px)").matches ? "h" : "v";

  const nb = nodes.map((n) => box(n, root));
  const S = nb.map((b) => ({ x: b.x + b.w / 2, y: b.y + b.h / 2 }));
  const cb = cards.map((c) => box(c, root));
  const lb = box(free, root);
  const fb = box(fork, root);
  const wb = box(withEl, root);
  const gb = box(goal, root);

  const geo = layout === "v" ? vertical(W, H, S, cb, lb, fb, wb, gb) : horizontal(W, H, S, cb, lb, fb, wb, gb);
  if (layout === "h" && goalText) {
    const tb = box(goalText, root);
    geo.hole = { x: tb.x - 14, y: tb.y - 10, w: tb.w + 28, h: tb.h + 20 };
  }
  geo.key = [layout, W, H, ...S.map((p) => `${p.x},${p.y}`), cb.map((b) => `${b.x},${b.y},${b.w},${b.h}`).join(";"), lb.x, lb.y, lb.h, fb.x, fb.y, fb.h, wb.x, wb.y, gb.x, gb.y, gb.w, gb.h, geo.hole ? `${geo.hole.x},${geo.hole.y},${geo.hole.w}` : ""].join("|");
  return geo;
}

/* ------------------------------------------------------ mobil: senkrecht */

function vertical(W: number, H: number, S: Pt[], cb: Box[], lb: Box, fb: Box, wb: Box, gb: Box): Geo {
  const railX = hp(S[0].x);
  const start = { x: railX, y: S[0].y - 46 };
  const c4 = cb[3];
  const yA = Math.max(S[3].y, c4.y + c4.h + 6);
  const gx = gb.x + gb.w / 2;
  const end = { x: gx, y: gb.y + gb.h * 0.55 };
  const d = end.y - yA;
  const main = `M${railX} ${r1(start.y)}V${r1(yA)}C${railX} ${r1(yA + d * 0.55)} ${r1(gx)} ${r1(end.y - d * 0.62)} ${r1(gx)} ${r1(end.y)}`;

  // Gabelung: Seitenast vom Pfad nach rechts zur Karte „Selbst umsetzen“
  const E = { x: fb.x - 5, y: fb.y + 29 };
  const J = { x: railX, y: E.y - 40 };
  const branch = `M${railX} ${r1(J.y)}C${railX} ${r1(J.y + 24)} ${r1(railX + 10)} ${r1(E.y)} ${r1(railX + 30)} ${r1(E.y)}L${r1(E.x)} ${r1(E.y)}`;
  const tip = `M${r1(E.x - 6)} ${r1(E.y - 4.5)}L${r1(E.x)} ${r1(E.y)}L${r1(E.x - 6)} ${r1(E.y + 4.5)}`;

  // Klammer links neben den Schritten 1 bis 3
  const yc = lb.y + 11;
  const xb = hp(railX - 25);
  const yE = cb[2].y + cb[2].h;
  const bracket = `M${r1(lb.x - 10)} ${r1(yc)}H${r1(xb + 8)}Q${xb} ${r1(yc)} ${xb} ${r1(yc + 8)}V${r1(yE - 8)}Q${xb} ${r1(yE)} ${r1(xb + 8)} ${r1(yE)}H${r1(xb + 16)}`;

  // Spielfeld hochkant, Tor unten. Die Mittellinie liegt zwischen Schritt 3 und
  // der Gabelung: Die eigene Hälfte ist der kostenlose Teil, danach geht es aufs Tor.
  const i = 8.5;
  const L = i;
  const R = hp(W - i - 1);
  const T = i;
  const B = hp(gb.y);
  const cx = hp(W / 2);
  const midY = hp((cb[2].y + cb[2].h + fb.y) / 2 - 6);
  const rc = Math.min(W * 0.22, 76);
  let soft = `M${L} ${B}V${T}H${R}V${B}`;
  soft += `M${L} ${midY}H${R}` + circle(cx, midY, rc);
  soft += `M${L + 12} ${T}A12 12 0 0 1 ${L} ${T + 12}M${R - 12} ${T}A12 12 0 0 0 ${R} ${T + 12}`;

  let goalLines = `M${L} ${B}H${R}`;
  const pw2 = Math.min(W * 0.66, 250);
  const ph2 = 92;
  goalLines += `M${r1(cx - pw2 / 2)} ${B}V${B - ph2}H${r1(cx + pw2 / 2)}V${B}`;
  const gw2 = Math.min(gb.w + 58, pw2 * 0.6);
  goalLines += `M${r1(cx - gw2 / 2)} ${B}V${B - 30}H${r1(cx + gw2 / 2)}V${B}`;
  {
    const sy = B - 64;
    const rA = 40;
    const dy = sy - (B - ph2);
    const dx = Math.sqrt(rA * rA - dy * dy);
    goalLines += `M${r1(cx - dx)} ${B - ph2}A${rA} ${rA} 0 0 1 ${r1(cx + dx)} ${B - ph2}`;
  }
  goalLines += `M${L} ${B - 12}A12 12 0 0 1 ${L + 12} ${B}M${R} ${B - 12}A12 12 0 0 0 ${R - 12} ${B}`;

  const spots = [
    { x: cx, y: midY, r: 2 },
    { x: cx, y: B - 64, r: 1.8 },
  ];

  const g = { x: Math.round(gb.x), y: B, w: Math.round(gb.w), h: Math.round(gb.h) };
  const goalFrame = `M${hp(g.x)} ${B}V${hp(g.y + g.h)}H${hp(g.x + g.w)}V${B}`;
  const goalNet = net(g, 8, 6);

  const a0 = start.y;
  const a1 = end.y;
  const tt = (v: number) => Math.min(1, Math.max(0, (v - a0) / (a1 - a0)));

  return {
    key: "",
    layout: "v",
    w: W,
    h: H,
    start,
    end,
    main,
    branch,
    tip,
    bracket,
    pitchSoft: soft,
    pitchGoal: goalLines,
    spots,
    goalFrame,
    goalNet,
    ring: { cx: gx, cy: g.y + g.h / 2, r: g.w * 0.62 },
    hole: null,
    t: {
      nodes: S.map((p) => tt(p.y)),
      fork: tt(J.y),
      with: tt(wb.y + wb.h / 2),
      bracketFrom: 0,
      bracketTo: tt(yE),
    },
  };
}

/* ------------------------------------------------------ breit: waagrecht */

function horizontal(W: number, H: number, S: Pt[], cb: Box[], lb: Box, fb: Box, wb: Box, gb: Box): Geo {
  const yL = hp(S[0].y);
  const start = { x: S[0].x - 76, y: yL };
  const c4 = cb[3];
  const xs = c4.x + c4.w + 8;
  const cy = gb.y + gb.h / 2;
  const end = { x: gb.x + gb.w * 0.55, y: cy };
  const span = Math.max(40, gb.x - xs);
  const main = `M${r1(start.x)} ${yL}H${r1(S[3].x)}C${r1(xs + span * 0.3)} ${yL} ${r1(gb.x - span * 0.5)} ${r1(cy)} ${r1(end.x)} ${r1(cy)}`;

  // Gabelung an Station 3: Ast löst sich nach oben zur Karte „Selbst umsetzen“
  const E = { x: fb.x + 38, y: fb.y + fb.h + 5 };
  const S3 = S[2];
  const branch = `M${r1(S3.x)} ${yL}C${r1(S3.x + (E.x - S3.x) * 0.62)} ${yL} ${r1(E.x)} ${r1(E.y + (yL - E.y) * 0.5)} ${r1(E.x)} ${r1(E.y)}`;
  const tip = `M${r1(E.x - 4.5)} ${r1(E.y + 6)}L${r1(E.x)} ${r1(E.y)}L${r1(E.x + 4.5)} ${r1(E.y + 6)}`;

  // Klammer über den Stationen 1 bis 3, Spitze zeigt zur Beschriftung
  const yb = hp(lb.y + lb.h + 12);
  const [x1, x2, x3] = [hp(S[0].x), hp(S[1].x), hp(S[2].x)];
  const bracket = `M${x1} ${yb + 14}V${yb + 6}Q${x1} ${yb} ${x1 + 6} ${yb}H${x2 - 6}Q${x2} ${yb} ${x2} ${yb - 6}Q${x2} ${yb} ${x2 + 6} ${yb}H${x3 - 6}Q${x3} ${yb} ${x3} ${yb + 6}V${yb + 14}`;

  // Spielfeld quer, Tor rechts
  const i = 16.5;
  const R = hp(gb.x);
  const L = hp(Math.max(i, W - R - 1));
  const T = i;
  const B = hp(H - i - 1);
  const pcy = hp(cy);
  const midX = hp((L + R) / 2);
  const rc = Math.min(H * 0.19, W * 0.085, 104);
  const pd = Math.min(Math.max(W * 0.1, 92), 160);
  const ph = Math.min(H * 0.56, 340);
  const ga = pd * 0.36;
  const gh = ph * 0.44;
  const rA = pd * 0.5;
  const dxA = pd * 0.3;
  const dyA = Math.sqrt(rA * rA - dxA * dxA);

  let soft = `M${R} ${T}H${L}V${B}H${R}`;
  soft += `M${midX} ${T}V${B}` + circle(midX, pcy, rc);
  soft += `M${L} ${r1(pcy - ph / 2)}H${r1(L + pd)}V${r1(pcy + ph / 2)}H${L}`;
  soft += `M${L} ${r1(pcy - gh / 2)}H${r1(L + ga)}V${r1(pcy + gh / 2)}H${L}`;
  soft += `M${r1(L + pd)} ${r1(pcy - dyA)}A${r1(rA)} ${r1(rA)} 0 0 1 ${r1(L + pd)} ${r1(pcy + dyA)}`;
  soft += `M${L + 14} ${T}A14 14 0 0 0 ${L} ${T + 14}M${L} ${B - 14}A14 14 0 0 0 ${L + 14} ${B}`;

  let goalLines = `M${R} ${T}V${B}`;
  goalLines += `M${R} ${r1(pcy - ph / 2)}H${r1(R - pd)}V${r1(pcy + ph / 2)}H${R}`;
  goalLines += `M${R} ${r1(pcy - gh / 2)}H${r1(R - ga)}V${r1(pcy + gh / 2)}H${R}`;
  goalLines += `M${r1(R - pd)} ${r1(pcy - dyA)}A${r1(rA)} ${r1(rA)} 0 0 0 ${r1(R - pd)} ${r1(pcy + dyA)}`;
  goalLines += `M${R - 14} ${T}A14 14 0 0 1 ${R} ${T + 14}M${R} ${B - 14}A14 14 0 0 1 ${R - 14} ${B}`;

  const spots = [
    { x: midX, y: pcy, r: 2.2 },
    { x: r1(L + pd * 0.7), y: pcy, r: 1.8 },
    { x: r1(R - pd * 0.7), y: pcy, r: 1.8 },
  ];

  const g = { x: R, y: Math.round(gb.y), w: Math.round(gb.w), h: Math.round(gb.h) };
  const goalFrame = `M${R} ${hp(g.y)}H${hp(g.x + g.w)}V${hp(g.y + g.h)}H${R}`;
  const goalNet = net(g, 6, 8);

  const a0 = start.x;
  const a1 = end.x;
  const tt = (v: number) => Math.min(1, Math.max(0, (v - a0) / (a1 - a0)));

  return {
    key: "",
    layout: "h",
    w: W,
    h: H,
    start,
    end,
    main,
    branch,
    tip,
    bracket,
    pitchSoft: soft,
    pitchGoal: goalLines,
    spots,
    goalFrame,
    goalNet,
    ring: { cx: g.x + g.w / 2, cy, r: g.h * 0.62 },
    hole: null,
    t: {
      nodes: S.map((p) => tt(p.x)),
      fork: tt(S3.x),
      with: tt(wb.x + wb.w / 2),
      bracketFrom: tt(S[0].x),
      bracketTo: tt(S[2].x),
    },
  };
}

/**
 * Ease, die den Scrollfortschritt auf die Laufachse abbildet: Der Ball bewegt
 * sich gleichmäßig in x (breit) bzw. y (mobil), nicht gleichmäßig entlang der
 * Kurvenlänge. Mobil bleibt er so auf Augenhöhe, breit beschleunigt der Schuss.
 */
export function axisEase(path: SVGPathElement, total: number, axis: "x" | "y") {
  const N = 320;
  const a: number[] = new Array(N + 1);
  for (let k = 0; k <= N; k++) {
    const p = path.getPointAtLength((total * k) / N);
    a[k] = axis === "x" ? p.x : p.y;
  }
  for (let k = 1; k <= N; k++) if (a[k] < a[k - 1]) a[k] = a[k - 1];
  const a0 = a[0];
  const span = a[N] - a0 || 1;
  return (t: number) => {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    const target = a0 + t * span;
    let lo = 0;
    let hi = N;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (a[mid] < target) lo = mid;
      else hi = mid;
    }
    const seg = a[hi] - a[lo];
    return (lo + (seg > 0 ? (target - a[lo]) / seg : 0)) / N;
  };
}
