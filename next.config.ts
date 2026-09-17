import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pin the workspace root so Turbopack doesn't pick up stray lockfiles in parent folders.
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
