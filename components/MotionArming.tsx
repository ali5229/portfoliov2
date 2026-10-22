"use client";

import { useEffect } from "react";
import { isMotionArmed } from "@/hooks/useMotionArmed";

/** Re-applies the `.js` class after hydration. The pre-paint script in app/layout.tsx sets it first,
 *  but if React has to rebuild the page on the client it resets <html>'s attributes and the class,
 *  which arms all the scroll/motion CSS, would be lost. */
export function MotionArming() {
  useEffect(() => {
    if (isMotionArmed()) document.documentElement.classList.add("js");
  }, []);
  return null;
}
