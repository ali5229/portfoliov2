"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { stack } from "@/lib/data";
import { useInView } from "@/hooks/useInView";
import { useMotionArmed } from "@/hooks/useMotionArmed";
import { SectionHead } from "./SectionHead";

const TOTAL = stack.groups.reduce((n, g) => n + g.items.length, 0);
const SWEEP_MS = 1100;
const GROUP_STAGGER_MS = 380;

/** A barcode laser sweeps each group; items light up as the beam crosses them and the tally counts up. */
export function StackScanner() {
  const armed = useMotionArmed();
  const ref = useRef<HTMLDivElement>(null);
  const groupRefs = useRef<(HTMLDivElement | null)[]>([]);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const [scanning, setScanning] = useState<Set<number>>(() => new Set());
  const [lit, setLit] = useState<Set<string>>(() => new Set());
  const [started, setStarted] = useState(false);

  const runScan = () => {
    setStarted(true);
    groupRefs.current.forEach((g, gi) => {
      if (!g) return;
      timers.current.push(
        setTimeout(() => {
          setScanning((s) => new Set(s).add(gi));
          const gr = g.getBoundingClientRect();
          g.querySelectorAll("li").forEach((li, ii) => {
            const y = (li.getBoundingClientRect().top + li.offsetHeight / 2 - gr.top) / gr.height;
            timers.current.push(
              setTimeout(() => setLit((s) => new Set(s).add(`${gi}-${ii}`)), Math.max(0, y) * SWEEP_MS),
            );
          });
        }, gi * GROUP_STAGGER_MS),
      );
    });
  };

  const inView = useInView(ref, runScan);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  // Without armed motion (no JS / reduced motion) the scanner shows its finished state, like the reference.
  const count = armed ? lit.size : TOTAL;
  const done = count === TOTAL;
  const status = done ? stack.status.done : started ? stack.status.scanning : stack.status.ready;

  return (
    <section className="wrap pt-24 pb-6" id="stack">
      <SectionHead label={stack.label} title={stack.title} intro={stack.intro} />
      <div ref={ref} id="scanner" className={inView ? "scanner reveal in" : "scanner reveal"}>
        <div className="mb-[14px] flex flex-wrap items-baseline gap-x-[18px] gap-y-2">
          <span className="label">{stack.tallyLabel}</span>
          <span className="mono text-[1.4rem] text-muted tabular-nums">
            <b className="font-semibold text-ink">{count}</b> / <span>{TOTAL}</span>
          </span>
          <span className={done ? "label scan-status done ml-auto" : "label scan-status ml-auto"}>
            {status}
          </span>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(210px,1fr))] gap-px overflow-hidden rounded-[10px] border border-rule bg-rule">
          {stack.groups.map((g, gi) => (
            <div
              key={g.code}
              ref={(el) => {
                groupRefs.current[gi] = el;
              }}
              className={scanning.has(gi) ? "grp scanning" : "grp"}
              data-code={g.code}
              style={{ "--dur": `${SWEEP_MS}ms` } as CSSProperties}
            >
              <h4>{g.name}</h4>
              <ul>
                {g.items.map((item, ii) => {
                  const cls = [item.core && "core", lit.has(`${gi}-${ii}`) && "lit"].filter(Boolean).join(" ");
                  return (
                    <li key={item.name} className={cls || undefined}>
                      {item.name}
                    </li>
                  );
                })}
              </ul>
              <span className="laser" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
