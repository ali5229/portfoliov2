"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { isMotionArmed } from "./useMotionArmed";

const OPTIONS: IntersectionObserverInit = { threshold: 0.18, rootMargin: "0px 0px -6% 0px" };

/** One-shot scroll trigger. Does nothing unless motion is armed, so with reduced motion
 *  (or no JS) content simply stays in its final, visible state. */
export function useInView<T extends Element>(ref: RefObject<T | null>, onEnter?: () => void) {
  const [inView, setInView] = useState(false);
  const onEnterRef = useRef(onEnter);

  useEffect(() => {
    onEnterRef.current = onEnter;
  });

  useEffect(() => {
    const el = ref.current;
    if (!el || !isMotionArmed()) return;
    const io = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      io.disconnect();
      setInView(true);
      onEnterRef.current?.();
    }, OPTIONS);
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);

  return inView;
}
