import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  agentRules: false,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [70, 75, 82, 85, 90],
    deviceSizes: [390, 640, 828, 1080, 1280, 1600, 1920, 2560],
  },
};

export default nextConfig;
