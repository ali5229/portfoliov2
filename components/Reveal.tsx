"use client";

import { useRef, type ComponentPropsWithoutRef, type ElementType, type PointerEvent } from "react";
import { useInView } from "@/hooks/useInView";
import { isMotionArmed } from "@/hooks/useMotionArmed";

type RevealProps<T extends ElementType> = {
  as?: T;
  /** Cursor spotlight: tracks the pointer into --mx / --my for the .spot::before gradient. */
  spot?: boolean;
} & ComponentPropsWithoutRef<T>;

/** Adds the `in` class once the element scrolls into view (drives .reveal, .reveal-kids, .case, .arch). */
export function Reveal<T extends ElementType = "div">({
  as,
  spot,
  className,
  ...rest
}: RevealProps<T>) {
  const Tag: ElementType = as ?? "div";
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref);

  const onPointerMove = spot
    ? (ev: PointerEvent<HTMLElement>) => {
        if (!isMotionArmed()) return;
        const el = ev.currentTarget;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", ev.clientX - r.left + "px");
        el.style.setProperty("--my", ev.clientY - r.top + "px");
      }
    : undefined;

  return (
    <Tag
      ref={ref}
      className={inView ? `${className ?? ""} in` : className}
      onPointerMove={onPointerMove}
      {...rest}
    />
  );
}
