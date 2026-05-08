import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Section, SectionHeader } from "./Section";

const projects = [
  {
    title: "Nebula Analytics",
    tag: "SaaS · Dashboard",
    desc: "Realtime analytics platform processing 2B+ events per day with sub-second queries.",
    stack: ["Next.js", "ClickHouse", "Kafka"],
  },
  {
    title: "Atlas Design System",
    tag: "Open Source",
    desc: "Headless component library powering 40+ products across the company.",
    stack: ["React", "Radix", "TS"],
  },
  {
    title: "Halo Commerce",
    tag: "E-commerce",
    desc: "Headless storefront with custom checkout and 99 Lighthouse score.",
    stack: ["Remix", "Stripe", "Edge"],
  },
  {
    title: "Pulse AI",
    tag: "Machine Learning",
    desc: "On-device transcription and summarization tool for meetings.",
    stack: ["Whisper", "Rust", "WASM"],
  },
];

export function Projects() {
  return (
    <Section id="projects">
      <SectionHeader
        index="02 / WORK"
        title="SELECTED PROJECTS"
        kicker="2021 — 2026"
      />
      <div className="grid grid-cols-1 gap-px bg-border md:grid-cols-2">
        {projects.map((p, i) => (
          <motion.a
            key={p.title}
            href="#"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: (i % 2) * 0.1, duration: 0.6 }}
            className="group relative overflow-hidden bg-background p-8 md:p-10"
          >
            <div className="absolute inset-0 origin-bottom scale-y-0 bg-primary transition-transform duration-500 ease-out group-hover:scale-y-100" />
            <div className="relative flex h-full flex-col justify-between gap-12">
              <div className="flex items-start justify-between">
                <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground transition-colors group-hover:text-primary-foreground">
                  {p.tag}
                </span>
                <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-display text-4xl leading-none tracking-wide transition-colors group-hover:text-primary-foreground md:text-5xl">
                  {p.title}
                </h3>
                <p className="mt-4 max-w-md text-sm text-muted-foreground transition-colors group-hover:text-primary-foreground/90">
                  {p.desc}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {p.stack.map((s) => (
                    <span
                      key={s}
                      className="border border-border px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition-colors group-hover:border-primary-foreground/40 group-hover:text-primary-foreground"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </Section>
  );
}
