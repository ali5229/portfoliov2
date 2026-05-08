import { motion } from "framer-motion";
import { Section, SectionHeader } from "./Section";

const items = [
  {
    year: "2024 — Now",
    role: "Senior Software Engineer",
    company: "Vertex Labs",
    desc: "Leading platform engineering for a realtime collaboration product.",
  },
  {
    year: "2022 — 2024",
    role: "Full-stack Engineer",
    company: "Northwind Studio",
    desc: "Built design systems and headless commerce experiences for global brands.",
  },
  {
    year: "2020 — 2022",
    role: "Frontend Engineer",
    company: "Loop & Co.",
    desc: "Shipped marketing sites and interactive editorials with motion-first design.",
  },
  {
    year: "2019 — 2020",
    role: "Engineering Intern",
    company: "Stratus Inc.",
    desc: "Worked on internal tooling and dashboards used by 200+ engineers.",
  },
];

export function Experience() {
  return (
    <Section id="experience">
      <SectionHeader
        index="03 / PATH"
        title="EXPERIENCE"
        kicker="JOURNEY"
      />
      <div className="relative">
        <div className="absolute bottom-0 left-3 top-0 w-px bg-border md:left-1/2" />
        <div className="space-y-12">
          {items.map((it, i) => (
            <motion.div
              key={it.role}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
              className="relative grid grid-cols-1 gap-4 pl-10 md:grid-cols-2 md:gap-12 md:pl-0"
            >
              <span className="absolute left-0 top-2 z-10 h-6 w-6 -translate-x-[11px] border-2 border-background bg-primary md:left-1/2 md:-translate-x-1/2" />
              <div className="md:text-right md:pr-12">
                <span className="font-display text-2xl tracking-wider text-primary">
                  {it.year}
                </span>
              </div>
              <div className="md:pl-12">
                <h3 className="font-display text-2xl tracking-wide">
                  {it.role}
                </h3>
                <p className="mt-1 text-sm uppercase tracking-[0.2em] text-muted-foreground">
                  {it.company}
                </p>
                <p className="mt-3 max-w-md text-sm text-muted-foreground">
                  {it.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}
