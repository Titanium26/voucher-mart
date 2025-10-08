import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,        // ✅ don’t fail on ESLint
  },
  typescript: {
    ignoreBuildErrors: true,         // ✅ (optional) don’t fail on TS
  },
};

export default nextConfig;

