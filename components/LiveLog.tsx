"use client";

import { useEffect, useState } from "react";
import { useMotionArmed } from "@/hooks/useMotionArmed";

/** Cycles request lines every 1.4s, in step with the diagram's packets (4.2s loop, 1.4s offset). */
export function LiveLog({ logs }: { logs: string[] }) {
  const armed = useMotionArmed();
  const [i, setI] = useState(0);
  const [swap, setSwap] = useState(false);

  useEffect(() => {
    if (!armed) return;
    let t: ReturnType<typeof setTimeout>;
    const id = setInterval(() => {
      setSwap(true);
      t = setTimeout(() => {
        setI((n) => (n + 1) % logs.length);
        setSwap(false);
      }, 300);
    }, 1400);
    return () => {
      clearInterval(id);
      clearTimeout(t);
    };
  }, [armed, logs.length]);

  return (
    <p className="live mono" aria-live="off">
      <i />
      <span id="liveLog" className={swap ? "swap" : undefined}>
        {logs[i]}
      </span>
    </p>
  );
}
