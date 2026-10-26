"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
} from "react";
import { traceSections } from "@/lib/data";
import { columnLeft, gridLayout, PITCH } from "@/lib/grid";
import { traceEnabled } from "./MotionArming";

const HEADER = 72; // track starts on the first grid row below the sticky header
const EDGE = 10; // min px between the trace and the screen edge
const CLEAR = 4; // min px between the trace and the content column
const TRAIL_MAX = 90; // px
const HIT = 14; // px, width of the draggable strip

type Pad = { label: string; y: number; anchor: number };
type Layout = {
  x: number;
  top: number;
  bottom: number;
  maxScroll: number;
  pads: Pad[];
};

const reducedMotion = () =>
  matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Replaces the native scrollbar on mouse/trackpad devices: a trace on the rightmost background grid
 *  line, a pad per section, and a light at the scroll position that leaves a trail while moving.
 *  Drag the light (or anywhere on the trace) to scroll; click a pad to jump to its section. */
export function ScrollTrace() {
  const [layout, setLayout] = useState<Layout | null>(null);
  const [passed, setPassed] = useState(0); // pads at or above the light
  const layoutRef = useRef<Layout | null>(null);
  const lightRef = useRef<HTMLSpanElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const trailRef = useRef<HTMLSpanElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  // Current press: where it started, the pad under it (if any), and whether it has become a drag.
  const press = useRef<{ y: number; pad: number | null; drag: boolean } | null>(
    null,
  );

  // Layout: on the grid, below the header, pads at each section's scroll position.
  useEffect(() => {
    if (!traceEnabled()) return;
    const measure = () => {
      const w = document.documentElement.clientWidth;
      const h = window.innerHeight;
      const maxScroll = document.documentElement.scrollHeight - h;
      if (maxScroll <= 0) {
        layoutRef.current = null;
        setLayout(null);
        return;
      }
      const colLeft = columnLeft();
      const contentRight = w - colLeft;
      const { ox } = gridLayout(w, colLeft);
      let x = ox + Math.floor((w - EDGE - ox) / PITCH) * PITCH + 0.5; // grid lines draw at +0.5
      if (x < contentRight + CLEAR) x = w - EDGE - 2; // narrow gutter: hug the edge instead
      const top = Math.ceil((HEADER + 8) / PITCH) * PITCH + 0.5;
      const bottom = Math.floor((h - 16) / PITCH) * PITCH + 0.5;
      const span = bottom - top;
      const pads = traceSections.map(({ label, target }, i) => {
        const el = document.querySelector<HTMLElement>(target);
        const anchor =
          i === 0 || !el
            ? 0
            : Math.min(
                maxScroll,
                el.getBoundingClientRect().top + window.scrollY,
              );
        const y =
          Math.round((top + (anchor / maxScroll) * span - 0.5) / PITCH) *
            PITCH +
          0.5;
        return { label, anchor, y: Math.min(bottom, Math.max(top, y)) };
      });
      const next = { x, top, bottom, maxScroll, pads };
      layoutRef.current = next;
      setLayout(next);
    };
    // ResizeObserver fires once on observe, so this also does the initial measurement.
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  // Light, fill and trail follow the scroll position; the trail stretches with speed and decays.
  useEffect(() => {
    if (!layout) return;
    let raf = 0;
    let prev = -1;
    let vel = 0;
    const reduce = reducedMotion();

    const frame = () => {
      raf = 0;
      const l = layoutRef.current;
      if (!l) return;
      const ly =
        (Math.min(l.maxScroll, Math.max(0, window.scrollY)) / l.maxScroll) *
        (l.bottom - l.top);
      if (prev >= 0 && !reduce) vel = vel * 0.8 + (ly - prev) * 0.2 * 6;
      else vel = 0;
      prev = ly;
      if (lightRef.current)
        lightRef.current.style.transform = `translateY(${ly}px)`;
      if (fillRef.current) fillRef.current.style.height = `${ly}px`;
      const len = Math.min(TRAIL_MAX, Math.abs(vel));
      if (trailRef.current) {
        const down = vel >= 0;
        trailRef.current.style.height = `${len}px`;
        trailRef.current.style.transform = `translateY(${down ? ly - len : ly}px)`;
        trailRef.current.dataset.dir = down ? "down" : "up";
      }
      setPassed(l.pads.filter((p) => window.scrollY >= p.anchor - 2).length);
      if (Math.abs(vel) > 0.5) raf = requestAnimationFrame(frame); // keep decaying the trail
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    kick();
    window.addEventListener("scroll", kick, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", kick);
    };
  }, [layout]);

  if (!layout) return null;

  const scrollToPointer = (clientY: number) => {
    const l = layoutRef.current;
    if (!l) return;
    const p = Math.min(1, Math.max(0, (clientY - l.top) / (l.bottom - l.top)));
    window.scrollTo({ top: p * l.maxScroll, behavior: "instant" });
  };
  const jumpTo = (anchor: number) =>
    window.scrollTo({
      top: anchor,
      behavior: reducedMotion() ? "instant" : "smooth",
    });
  const startDrag = () => {
    if (press.current) press.current.drag = true;
    if (trackRef.current) trackRef.current.dataset.drag = "";
  };

  // One handler for the whole trace. Pads sit on the line (and the light rests on the "Top" pad), so
  // a press on a pad that moves is a drag; a press that doesn't move is a jump to that section.
  const onDown = (e: PointerEvent<HTMLElement>) => {
    if (e.button !== 0) return;
    e.preventDefault(); // no text selection or focus ring while dragging
    e.currentTarget.setPointerCapture(e.pointerId);
    const padEl = (e.target as HTMLElement).closest<HTMLElement>(".trace-pad");
    press.current = {
      y: e.clientY,
      pad: padEl ? Number(padEl.dataset.index) : null,
      drag: false,
    };
    if (!padEl) {
      startDrag(); // on the bare track: jump the light here and keep following
      scrollToPointer(e.clientY);
    }
  };
  const onMove = (e: PointerEvent<HTMLElement>) => {
    const pr = press.current;
    if (!pr) return;
    if (!pr.drag && Math.abs(e.clientY - pr.y) > 3) startDrag();
    if (pr.drag) scrollToPointer(e.clientY);
  };
  const onUp = () => {
    const pr = press.current;
    press.current = null;
    if (trackRef.current) delete trackRef.current.dataset.drag;
    if (pr && !pr.drag && pr.pad !== null) jumpTo(layout.pads[pr.pad].anchor);
  };

  return (
    <nav
      className="trace"
      aria-label="Page sections"
      style={{ "--trace-x": `${layout.x}px` } as CSSProperties}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
    >
      <div
        ref={trackRef}
        className="trace-track"
        aria-hidden="true"
        style={{
          top: layout.top,
          height: layout.bottom - layout.top,
          width: HIT,
        }}
      >
        <span className="trace-line" />
        <span className="trace-fill" ref={fillRef} />
        <span className="trace-trail" ref={trailRef} />
        <span className="trace-light" ref={lightRef} />
      </div>
      {layout.pads.map((p, i) => (
        <button
          key={p.label}
          type="button"
          className={i < passed ? "trace-pad on" : "trace-pad"}
          style={{ top: p.y }}
          data-index={i}
          aria-label={`Scroll to ${p.label}`}
          // Pointer presses are handled on the nav; this covers keyboard activation (detail === 0).
          onClick={(e) => {
            if (e.detail === 0) jumpTo(p.anchor);
          }}
        >
          <span className="trace-label" aria-hidden="true">
            {p.label}
          </span>
        </button>
      ))}
    </nav>
  );
}
