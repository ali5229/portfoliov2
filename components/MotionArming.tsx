"use client";

import { useEffect } from "react";
import { isMotionArmed } from "@/hooks/useMotionArmed";

/** Mouse/trackpad devices get the scroll trace instead of the native scrollbar. */
export function traceEnabled() {
  return matchMedia("(hover: hover) and (pointer: fine)").matches;
}

/** Re-applies the `js` and `trace-on` classes after hydration. The pre-paint script in app/layout.tsx
 *  sets them first, but if React has to rebuild the page on the client it resets <html>'s attributes,
 *  which would switch off the motion CSS and bring the native scrollbar back. */
export function MotionArming() {
  useEffect(() => {
    const c = document.documentElement.classList;
    if (isMotionArmed()) c.add("js");
    if (traceEnabled()) c.add("trace-on");
  }, []);
  return null;
}
