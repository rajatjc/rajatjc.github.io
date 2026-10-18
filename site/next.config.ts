import type { NextConfig } from "next";

// Static export for GitHub Pages. `npm run publish-site` copies out/ to the repo root.
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
