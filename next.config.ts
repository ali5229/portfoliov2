import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The site is fully static: export plain HTML/CSS/JS to out/ so any static host (Netlify) can serve it.
  output: "export",
};

export default nextConfig;
