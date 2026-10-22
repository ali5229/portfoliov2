"use client";

import { useSyncExternalStore } from "react";

/** True when the pre-paint script in app/layout.tsx armed motion (IntersectionObserver
 *  available and prefers-reduced-motion not set). Mirrors the reference's `.js` class. */
export function isMotionArmed() {
  return document.documentElement.classList.contains("js");
}

const subscribe = () => () => {};

export function useMotionArmed() {
  return useSyncExternalStore(subscribe, isMotionArmed, () => false);
}
