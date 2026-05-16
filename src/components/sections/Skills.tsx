import { motion } from "framer-motion";
import { Section, SectionHeader } from "./Section";

const groups = [
  {
    title: "Languages",
    items: ["JavaScript", "TypeScript", "C++", "Java", "Python", "SQL"],
  },
  {
    title: "Frontend",
    items: ["React", "Next.js", "Tailwind", "Shadcn UI", "React Native"],
  },
  {
    title: "Backend",
    items: ["Node.js", "Express", "Redis", "Firebase", "MongoDB"],
  },
  {
    title: "Database",
    items: ["PostgreSQL", "MongoDB", "MySQL", "SQLite", "Prisma"],
  },
  {
    title: "Tooling",
    items: ["Docker", "Dokploy", "Vercel", "GitHub Actions", "Postman"],
  },
  {
    title: "IDEs",
    items: ["VS Code", "Cursor", "Antigravity", "Google Colab"],
  },
  {
    title: "Designing",
    items: ["Canva", "Figma", "Photoshop", "Premiere Pro"],
  },
  {
    title: "Cloud",
    items: ["AWS", "Cloudflare", "Azure", "Digital Ocean", "Netlify"],
  },
];

export function Skills() {
  return (
    <Section id="skills">
      <SectionHeader index="01 / SKILLS" title="THE TOOLBOX" kicker="STACK" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {groups.map((g, i) => (
          <motion.div
            key={g.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: i * 0.3, duration: 0.6 }}
            className="group relative border border-border bg-card p-6 transition-colors hover:border-primary"
          >
            <div className="mb-4 flex items-center gap-2">
              <span className="h-2 w-8 bg-primary transition-all group-hover:w-12" />
              <h3 className="font-display text-xl tracking-wider">{g.title}</h3>
            </div>
            <ul className="space-y-2">
              {g.items.map((it) => (
                <li
                  key={it}
                  className="text-sm text-muted-foreground transition-colors group-hover:text-foreground"
                >
                  {it}
                </li>
              ))}
            </ul>
            <span className="absolute right-4 top-4 font-display text-xs text-muted-foreground">
              0{i + 1}
            </span>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
