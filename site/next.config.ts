import type { NextConfig } from "next";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

// Résumé links carry a hash of the PDF, so a new résumé gets a new URL and browsers
// and the GitHub Pages CDN can't keep serving a cached old copy.
const resumeVersion = createHash("sha1").update(readFileSync("public/resume.pdf")).digest("hex").slice(0, 8);

// Static export for GitHub Pages. `npm run publish-site` copies out/ to the repo root.
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_RESUME_URL: `/resume.pdf?v=${resumeVersion}` },
};

export default nextConfig;
