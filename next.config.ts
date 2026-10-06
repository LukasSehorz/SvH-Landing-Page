import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  agentRules: false,
  // Die frühere Vorschau-Adresse /b (Variante B) führt jetzt auf die Startseite
  async redirects() {
    return [{ source: "/b", destination: "/", permanent: false }];
  },
  // Sicherheits-Header (HSTS setzt der Hoster)
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [70, 75, 82, 85, 90],
    deviceSizes: [390, 640, 828, 1080, 1280, 1600, 1920, 2560],
  },
};

export default nextConfig;
