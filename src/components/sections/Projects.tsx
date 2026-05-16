import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Section, SectionHeader } from "./Section";

const projects = [
  {
    title: "Distribution System",
    tag: "Business Product",
    desc: "All-in-one system for wholesalers and distributors to run POS, route sales, warehouse stock, and supplier purchases from a single workflow. Sales, payments, and returns flow into accounting through vouchers and a structured chart of accounts, so books stay current without duplicate data entry. Helps businesses track who owes what, monitor cash and bank activity, and make decisions from real-time financial and stock reports.",
    stack: ["Next.js", "Prisma", "PostgreSQL"],
  },
  {
    title: "Poultry Management System",
    tag: "Business Product",
    desc: "Manages the full poultry cycle—flocks, feed, mortality, and stock—linked to purchases, issues, and trading. Automates double-entry accounting with ledgers, vouchers, and trial balance so books stay aligned with daily operations. Delivers FCR, flock timelines, and profit reports so businesses can control costs and improve flock-level returns.",
    stack: ["Next.js", "Prisma", "PostgreSQL"],
  },
  {
    title: "Personalized Workout Application",
    tag: "Final Year Project",
    desc: "Developed an AI-driven mobile app for personalized workout planning. Integrated OpenAI API to generate monthly plans based on user health data. Built custom exercise database with categorized guides and videos.",
    stack: ["React Native", "Firebase", "OpenAI API"],
  },
  {
    title: "Video/Voice Call App",
    tag: "Side Project",
    desc: "On-device transcription and summarization tool for meetings. Integrated ZegoCloud for real-time voice/video calling and Jetpack Compose for a smooth UI experience.",
    stack: ["Java", "ZegoCloud", "JetpackCompose"],
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
            transition={{ delay: (i % 2) * 0.5, duration: 0.9 }}
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
