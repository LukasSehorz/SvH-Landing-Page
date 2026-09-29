/** Feines Filmkorn als SVG-Kachel im Markup (kein Netzaufruf). Von der alten Seite. */
const TILE =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='128' height='128'>" +
      "<filter id='n' color-interpolation-filters='sRGB'>" +
      "<feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/>" +
      "<feColorMatrix type='matrix' values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 1 0 0 0 0'/>" +
      "</filter>" +
      "<rect width='128' height='128' filter='url(#n)'/></svg>",
  );

export default function Noise({ opacity = 0.045, fixed = false }: Readonly<{ opacity?: number; fixed?: boolean }>) {
  return <span className={fixed ? "noise-fixed" : "noise"} aria-hidden="true" style={{ opacity, backgroundImage: `url("${TILE}")` }} />;
}
