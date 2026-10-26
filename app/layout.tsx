import type { Metadata, Viewport } from "next";
import { preload } from "react-dom";
import { MotionArming } from "@/components/MotionArming";
import { site } from "@/lib/data";
import "./globals.css";

export const metadata: Metadata = {
  title: site.title,
  description: site.description,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

// Fonts are the exact Google Fonts files, self-hosted (see @font-face in globals.css). next/font is
// deliberately not used: under Turbopack it always injects a local(Arial) fallback face ahead of the
// stack, which changes glyphs the subsets lack (e.g. →). Preloading the faces the first screen uses
// lets them arrive with the HTML instead of after a second round-trip to Google.
const PRELOAD_FONTS = [
  "/fonts/archivo-latin.woff2",
  "/fonts/public-sans-latin.woff2",
  "/fonts/plex-mono-400-latin.woff2",
];

// Before first paint: `js` arms scroll/motion styles (IntersectionObserver available, no reduced-motion
// request), and `trace-on` swaps the native scrollbar for the scroll trace on mouse/trackpad devices.
// Doing it here, not after hydration, means the page never shifts sideways when the scrollbar goes.
// `fonts-pending` holds all animations at their first frame until releaseFonts (below) runs.
const armMotion = `var c=document.documentElement.classList;c.add('fonts-pending');if('IntersectionObserver' in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches)c.add('js');if(matchMedia('(hover: hover) and (pointer: fine)').matches)c.add('trace-on')`;

// Runs at the top of <body>, after the stylesheet (so the @font-face rules are known): releases the
// animations once the three main faces have loaded, or after 800ms at most on a slow connection.
const releaseFonts = `(function(){var c=document.documentElement.classList,go=function(){c.remove('fonts-pending')};if(!document.fonts||!document.fonts.load)return go();Promise.all(['850 1em Archivo','400 1em "Public Sans"','400 1em "IBM Plex Mono"'].map(function(f){return document.fonts.load(f)})).then(go,go);setTimeout(go,800)})()`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  for (const href of PRELOAD_FONTS)
    preload(href, { as: "font", type: "font/woff2", crossOrigin: "" });
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: armMotion }} />
      </head>
      {/* Extensions (Grammarly, dark-mode tools…) often add attributes to <body>; don't treat that as a mismatch. */}
      <body suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: releaseFonts }} />
        <MotionArming />
        {children}
      </body>
    </html>
  );
}
