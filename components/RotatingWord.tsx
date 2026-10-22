"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionArmed } from "@/hooks/useMotionArmed";

const FIRST_SWAP_MS = 3600; // after the intro rise + underline draw have finished
const INTERVAL_MS = 2800;
const SWAP_MS = 850; // enter delay (.14s) + rise (.7s)

/** Headline noun that cycles through `words`, each rising out of its mask like the intro.
 *  Renders as a `.w` mask so the intro's nth-child delay still applies to the first word.
 *  Only cycles while motion is armed, the word is on screen and the tab is visible. */
export function RotatingWord({ words }: { words: string[] }) {
  const armed = useMotionArmed();
  const ref = useRef<HTMLSpanElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const [index, setIndex] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  // Once cycling, every word uses the swap animation; dropping the class would replay the intro rise.
  const [cycled, setCycled] = useState(false);

  useEffect(() => {
    const el = ref.current;
    const measure = measureRef.current;
    if (!armed || !el || !measure || words.length < 2) return;

    let current = 0;
    let onScreen = true;
    let settle: ReturnType<typeof setTimeout>;
    let interval: ReturnType<typeof setInterval>;

    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
    });
    io.observe(el);

    const swap = () => {
      if (!onScreen || document.hidden) return;
      const next = (current + 1) % words.length;
      // Animate the mask from its current width to the next word's, so the rest of the line slides.
      measure.textContent = words[next];
      el.style.width = `${el.offsetWidth}px`;
      void el.offsetWidth;
      el.style.width = `${measure.offsetWidth}px`;
      setCycled(true);
      setPrev(current);
      setIndex(next);
      current = next;
      clearTimeout(settle);
      settle = setTimeout(() => {
        setPrev(null);
        el.style.width = ""; // back to auto so font-size changes (clamp) never leave a stale width
      }, SWAP_MS + 50);
    };

    const start = setTimeout(() => {
      swap();
      interval = setInterval(swap, INTERVAL_MS);
    }, FIRST_SWAP_MS);

    return () => {
      io.disconnect();
      clearTimeout(start);
      clearTimeout(settle);
      clearInterval(interval);
    };
  }, [armed, words]);

  return (
    <span ref={ref} className="w rot">
      {prev !== null && (
        <span key={`leave-${prev}`} className="leave">
          {words[prev]}
        </span>
      )}
      <span key={`word-${index}`} className={cycled ? "enter" : undefined}>
        {words[index]}
      </span>
      <span ref={measureRef} className="rot-measure" />
    </span>
  );
}
