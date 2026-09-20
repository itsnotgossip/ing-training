import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pin the workspace root so Turbopack doesn't pick up stray lockfiles in parent folders.
  turbopack: {
    root: path.resolve(__dirname),
  },

  // The certificate PDF reads the Nunito files and the logo from disk at
  // request time. Those reads are dynamic, so tracing cannot spot them and the
  // files have to be pulled into the serverless bundle explicitly.
  outputFileTracingIncludes: {
    "/modules/[slug]/certificate/download": [
      "src/lib/certificate/fonts/**/*.ttf",
      "public/logo.png",
    ],
  },
};

export default nextConfig;
