// Automatisch erzeugt von scripts/assets.mjs. Nicht von Hand ändern.
export type Still = { d: string; m: string };
export type Img = { src: string; w: number; h: number };
export const media: {
  seq: { count: number; source: string; desktop: string; mobile: string; mobileCrop: boolean };
  stills: { start: Still | null; end: Still | null };
  bier: { wide?: Img; square?: Img } | null;
  flutlicht: Img[];
} = {
  "seq": {
    "count": 120,
    "source": "assets-ki/sequenz/desktop",
    "desktop": "/seq/d/f_",
    "mobile": "/seq/m/f_",
    "mobileCrop": true
  },
  "stills": {
    "start": {
      "d": "/seq/start-1600.webp",
      "m": "/seq/start-m.webp"
    },
    "end": {
      "d": "/seq/ende-1600.webp",
      "m": "/seq/ende-m.webp"
    }
  },
  "bier": {
    "wide": {
      "src": "/ki/bier-wide-2048.webp",
      "w": 2048,
      "h": 1152
    },
    "square": {
      "src": "/ki/bier-quadrat-1200.webp",
      "w": 1200,
      "h": 1200
    }
  },
  "flutlicht": [
    {
      "src": "/ki/flutlicht-1.webp",
      "w": 2400,
      "h": 1029
    },
    {
      "src": "/ki/flutlicht-3.webp",
      "w": 2400,
      "h": 1029
    }
  ]
};
