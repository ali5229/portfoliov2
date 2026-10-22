import type { Metadata, Viewport } from "next";
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

// Same stylesheet as the reference design. next/font is deliberately not used: under Turbopack it
// always injects a local(Arial) fallback face ahead of the stack, which changes glyphs the Google
// subsets lack (e.g. →) and shifts rendering away from the design.
const FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,500..900&family=Public+Sans:ital,wght@0,400;0,500;0,600;1,400&family=IBM+Plex+Mono:wght@400;500;600&display=swap";

// Arms scroll/motion styles before first paint, exactly when the reference did:
// IntersectionObserver available and the user hasn't asked for reduced motion.
const armMotion = `if('IntersectionObserver' in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('js')`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: armMotion }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link rel="stylesheet" href={FONTS_HREF} />
      </head>
      {/* Extensions (Grammarly, dark-mode tools…) often add attributes to <body>; don't treat that as a mismatch. */}
      <body suppressHydrationWarning>
        <MotionArming />
        {children}
      </body>
    </html>
  );
}
