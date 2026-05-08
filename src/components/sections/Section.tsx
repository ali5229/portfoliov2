import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function SectionHeader({
  index,
  title,
  kicker,
}: {
  index: string;
  title: string;
  kicker?: string;
}) {
  return (
    <div className="mb-16 flex flex-col gap-3">
      <div className="flex items-center gap-4">
        <span className="font-display text-sm tracking-[0.3em] text-primary">
          {index}
        </span>
        <span className="h-px flex-1 bg-border" />
        {kicker && (
          <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            {kicker}
          </span>
        )}
      </div>
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        className="font-display text-5xl leading-none md:text-7xl"
      >
        {title}
      </motion.h2>
    </div>
  );
}

export function Section({
  id,
  children,
  className = "",
}: {
  id: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`mx-auto w-full max-w-7xl px-6 py-24 md:px-16 md:py-32 ${className}`}
    >
      {children}
    </section>
  );
}
