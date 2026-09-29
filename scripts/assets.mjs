#!/usr/bin/env node
// Holt die Medien aus ../assets und ../assets-ki (nur lesen!) nach public/
// und schreibt app/generated/media.ts mit dem, was tatsächlich da ist.
// Aufruf: npm run assets   (erneut ausführen, sobald neue KI-Medien da sind)
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import os from "node:os";
import sharp from "sharp";

const SITE = path.resolve(import.meta.dirname, "..");
const ROOT = path.resolve(SITE, "..");
const A = path.join(ROOT, "assets");
const K = path.join(ROOT, "assets-ki");
const PUB = path.join(SITE, "public");

const exists = (p) => fs.existsSync(p);
const mk = (p) => fs.mkdirSync(p, { recursive: true });
const log = (...a) => console.log("·", ...a);

function copy(src, dst) {
  mk(path.dirname(dst));
  fs.copyFileSync(src, dst);
}

async function webp(src, dst, width, quality = 78, extract) {
  mk(path.dirname(dst));
  let img = sharp(src);
  if (extract) img = img.extract(extract);
  const info = await img.resize({ width, withoutEnlargement: true, kernel: "lanczos3" }).webp({ quality, effort: 6 }).toFile(dst);
  return info;
}

const media = {
  seq: { count: 0, source: "keine", desktop: "", mobile: "", mobileCrop: false },
  stills: { start: null, end: null },
  bier: null,
  flutlicht: [],
};

// ---------- Logo ----------
mk(path.join(PUB, "logo"));
for (const f of ["svh-wort-96.webp", "svh-bild-160.webp", "svh-wort-2400.webp"]) {
  copy(path.join(A, "logo", f), path.join(PUB, "logo", f));
}
copy(path.join(A, "logo", "icon.png"), path.join(SITE, "app", "icon.png"));
copy(path.join(A, "logo", "apple-icon.png"), path.join(SITE, "app", "apple-icon.png"));
// Nur das Wort CONSULTING aus der Wortmarke (für die große Marke am Fuß)
{
  const src = path.join(A, "logo", "svh-wort.png");
  const meta = await sharp(src).metadata();
  const left = Math.round(meta.width * 0.355);
  const top = Math.round(meta.height * 0.36);
  const height = Math.round(meta.height * 0.36);
  const cut = await sharp(src).extract({ left, top, width: meta.width - left, height }).png().toBuffer();
  const trimmed = await sharp(cut).trim({ threshold: 1 }).png().toBuffer();
  await sharp(trimmed)
    .resize({ width: 2400 })
    .webp({ quality: 90 })
    .toFile(path.join(PUB, "logo", "consulting-2400.webp"));
  log("Logo + CONSULTING-Schnitt");
}

// ---------- Aktuelles ----------
mk(path.join(PUB, "aktuelles"));
for (const f of fs.readdirSync(path.join(A, "aktuelles")).filter((f) => f.endsWith(".webp"))) {
  copy(path.join(A, "aktuelles", f), path.join(PUB, "aktuelles", f));
}
log("Aktuelles-Vorschaubilder");

// ---------- Referenzen ----------
for (const n of ["estera", "fuchs"]) {
  const src = path.join(A, "referenzen", `${n}-hero-2x.png`);
  if (!exists(src)) continue;
  await webp(src, path.join(PUB, "referenzen", `${n}-1600.webp`), 1600, 80);
  log(`Referenz ${n}`);
}

// ---------- KI: Bier ----------
{
  const wide = path.join(K, "bier", "kasten-bier-16x9-2048.webp");
  const sq = path.join(K, "bier", "kasten-bier-1x1-1600.webp");
  if (exists(wide) || exists(sq)) {
    media.bier = {};
    if (exists(wide)) {
      await webp(wide, path.join(PUB, "ki", "bier-wide-2048.webp"), 2048, 80);
      media.bier.wide = { src: "/ki/bier-wide-2048.webp", w: 2048, h: 1152 };
    }
    if (exists(sq)) {
      await webp(sq, path.join(PUB, "ki", "bier-quadrat-1200.webp"), 1200, 80);
      media.bier.square = { src: "/ki/bier-quadrat-1200.webp", w: 1200, h: 1200 };
    }
    log("Bierkasten");
  }
}

// ---------- KI: Flutlicht ----------
for (const i of [1, 3]) {
  // Variante 2 laut Abnahme nicht verwenden
  const src = path.join(K, "flutlicht", `flutlicht-${i}-2400.webp`);
  if (!exists(src)) continue;
  await webp(src, path.join(PUB, "ki", `flutlicht-${i}.webp`), 2400, 72);
  const m = await sharp(src).metadata();
  media.flutlicht.push({ src: `/ki/flutlicht-${i}.webp`, w: m.width, h: m.height });
}
log(`Flutlicht: ${media.flutlicht.length}`);

// ---------- KI: Bildfolge Vom Chaos zur Ruhe ----------
const SEQ = path.join(K, "sequenz");
const OUT_D = path.join(PUB, "seq", "d");
const OUT_M = path.join(PUB, "seq", "m");
const FOCUS_X = 0.66; // Laptop sitzt rechts der Mitte

async function mobileCrop(src, dst) {
  const m = await sharp(src).metadata();
  const w = Math.round((m.height * 9) / 16);
  const left = Math.max(0, Math.min(m.width - w, Math.round(m.width * FOCUS_X - w / 2)));
  await sharp(src).extract({ left, top: 0, width: w, height: m.height }).resize({ height: 900 }).webp({ quality: 60, effort: 5 }).toFile(dst);
}

{
  const startSrc = [path.join(SEQ, "start.webp"), path.join(SEQ, "start-chaos.png")].find(exists);
  const endSrc = [path.join(SEQ, "ende.webp"), path.join(SEQ, "ende-ruhe.png")].find(exists);
  if (startSrc) {
    await webp(startSrc, path.join(PUB, "seq", "start-1600.webp"), 1600, 76);
    await mobileCrop(startSrc, path.join(PUB, "seq", "start-m.webp"));
    media.stills.start = { d: "/seq/start-1600.webp", m: "/seq/start-m.webp" };
  }
  if (endSrc) {
    await webp(endSrc, path.join(PUB, "seq", "ende-1600.webp"), 1600, 76);
    await mobileCrop(endSrc, path.join(PUB, "seq", "ende-m.webp"));
    media.stills.end = { d: "/seq/ende-1600.webp", m: "/seq/ende-m.webp" };
  }

  const dDir = path.join(SEQ, "desktop");
  const frames = exists(dDir) ? fs.readdirSync(dDir).filter((f) => /^f_\d{4}\.webp$/.test(f)).sort() : [];
  fs.rmSync(OUT_D, { recursive: true, force: true });
  fs.rmSync(OUT_M, { recursive: true, force: true });
  if (frames.length > 10) {
    mk(OUT_D);
    mk(OUT_M);
    for (const f of frames) {
      copy(path.join(dDir, f), path.join(OUT_D, f));
      // Hochkant-Schnitt für Telefone, aus dem scharfen Desktop-Bild
      await mobileCrop(path.join(dDir, f), path.join(OUT_M, f));
    }
    media.seq = { count: frames.length, source: "assets-ki/sequenz/desktop", desktop: "/seq/d/f_", mobile: "/seq/m/f_", mobileCrop: true };
    log(`Bildfolge: ${frames.length} Bilder aus assets-ki`);
  } else if (exists(path.join(SEQ, "quelle.mp4"))) {
    // Eigener Auszug aus dem Quellvideo (nur nach public, nie nach assets-ki)
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "svh-seq-"));
    execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-i", path.join(SEQ, "quelle.mp4"), "-vsync", "0", path.join(tmp, "a_%04d.png")]);
    const all = fs.readdirSync(tmp).filter((f) => f.endsWith(".png")).sort();
    const N = Math.min(110, all.length);
    mk(OUT_D);
    mk(OUT_M);
    for (let i = 0; i < N; i++) {
      const src = path.join(tmp, all[Math.round((i * (all.length - 1)) / (N - 1))]);
      const name = `f_${String(i + 1).padStart(4, "0")}.webp`;
      await sharp(src).resize({ width: 1600 }).webp({ quality: 68, effort: 5 }).toFile(path.join(OUT_D, name));
      await mobileCrop(path.join(OUT_D, name), path.join(OUT_M, name));
    }
    fs.rmSync(tmp, { recursive: true, force: true });
    media.seq = { count: N, source: "assets-ki/sequenz/quelle.mp4 (eigener Auszug)", desktop: "/seq/d/f_", mobile: "/seq/m/f_", mobileCrop: true };
    log(`Bildfolge: ${N} Bilder aus quelle.mp4`);
  } else {
    log("Bildfolge fehlt noch, Fallback über Start- und Endbild");
  }
}

// ---------- Herkunft ----------
fs.writeFileSync(
  path.join(PUB, "HERKUNFT.md"),
  `# Herkunft der Medien in public/

Erzeugt von \`scripts/assets.mjs\` am ${new Date().toISOString().slice(0, 10)}. Nur Kopien bzw. verkleinerte Fassungen, die Originale liegen im Projektordner.

- \`logo/\` aus \`assets/logo/\` (vom Auftraggeber geliefert, siehe dortige HERKUNFT.md). \`consulting-2400.webp\` ist ein Ausschnitt der Wortmarke.
- \`aktuelles/\` aus \`assets/aktuelles/\` (Vorschaubilder des eigenen YouTube-Kanals, lokal ausgeliefert, damit ohne Einwilligung nichts an Google geht).
- \`referenzen/\` aus \`assets/referenzen/\` (Screenshots der Kundenseiten estera.immobilien und fuchspools.com), auf 1600 px WebP verkleinert.
- \`ki/\` und \`seq/\` aus \`assets-ki/\`: KI-generiert über kie.ai am 29.09.2026 (GPT Image 2.5 Flare für Bilder, Kling 3.0 für das Video der Bildfolge). Prompts und Modelle stehen vollständig in \`assets-ki/HERKUNFT.md\`. Keine echten Personen, keine Marken, keine Texte im Bild.
  - \`ki/bier-*.webp\` Garantie-Motiv „Kasten Bier“
  - \`ki/flutlicht-1.webp\`, \`ki/flutlicht-3.webp\` Atmosphäre (Variante 2 bewusst nicht verwendet)
  - \`seq/d/\` Bildfolge „Vom Chaos zur Ruhe“, 1600 px, Kopie aus \`assets-ki/sequenz/desktop/\`
  - \`seq/m/\` Hochkant-Ausschnitte (9:16, 900 px hoch) aus denselben Desktop-Bildern für Telefone
  - \`seq/start-*.webp\`, \`seq/ende-*.webp\` Start- und Endbild (Poster und Fallback)
`,
);

// ---------- Manifest ----------
mk(path.join(SITE, "app", "generated"));
const ts = `// Automatisch erzeugt von scripts/assets.mjs. Nicht von Hand ändern.
export type Still = { d: string; m: string };
export type Img = { src: string; w: number; h: number };
export const media: {
  seq: { count: number; source: string; desktop: string; mobile: string; mobileCrop: boolean };
  stills: { start: Still | null; end: Still | null };
  bier: { wide?: Img; square?: Img } | null;
  flutlicht: Img[];
} = ${JSON.stringify(media, null, 2)};
`;
fs.writeFileSync(path.join(SITE, "app", "generated", "media.ts"), ts);
log("app/generated/media.ts geschrieben");
