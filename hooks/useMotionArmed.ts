"use client";

import { useSyncExternalStore } from "react";

/** Motion is allowed when IntersectionObserver exists and the user hasn't asked for reduced motion.
 *  Same condition as the pre-paint script in app/layout.tsx that adds the `.js` class, but read from
 *  the browser directly: if React ever re-renders <html> (e.g. after a hydration mismatch caused by
 *  an extension) and drops that class, motion still knows it's allowed. */
export function isMotionArmed() {
  return (
    "IntersectionObserver" in window &&
    !matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

const subscribe = () => () => {};

export function useMotionArmed() {
  return useSyncExternalStore(subscribe, isMotionArmed, () => false);
}
