import { motion } from "framer-motion";
import { ArrowUpRight, Mail } from "lucide-react";
import { Section } from "./Section";

export function Contact() {
  return (
    <Section id="contact" className="!py-32">
      <div className="grid grid-cols-1 gap-16 md:grid-cols-12">
        <div className="md:col-span-7">
          <span className="text-xs uppercase tracking-[0.4em] text-primary">
            04 / CONTACT
          </span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-6 font-display text-6xl leading-[0.9] md:text-8xl"
          >
            LET'S
            <br />
            <span className="text-primary">BUILD</span>{" "}
            <span className="font-script text-primary">something</span>
          </motion.h2>
          <p className="mt-8 max-w-md text-sm text-muted-foreground">
            Open for senior engineering roles, freelance collaborations and
            interesting problems. Drop a line.
          </p>

          <a
            href="mailto:aliabbas55506@gmail.com"
            className="group mt-10 inline-flex items-center gap-3 border-b border-foreground pb-2 font-display text-2xl tracking-wider hover:text-primary"
          >
            <Mail className="h-5 w-5" />
            aliabbas55506@gmail.com
            <ArrowUpRight className="h-5 w-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
          </a>
        </div>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col gap-6 md:col-span-5"
        >
          {[
            { label: "Name", type: "text" },
            { label: "Email", type: "email" },
          ].map((f) => (
            <label key={f.label} className="block">
              <span className="mb-2 block text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                {f.label}
              </span>
              <input
                type={f.type}
                className="w-full border-0 border-b border-border bg-transparent py-2 text-sm text-foreground outline-none transition-colors focus:border-primary"
              />
            </label>
          ))}
          <label className="block">
            <span className="mb-2 block text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Message
            </span>
            <textarea
              rows={4}
              className="w-full resize-none border-0 border-b border-border bg-transparent py-2 text-sm text-foreground outline-none transition-colors focus:border-primary"
            />
          </label>
          <button
            type="submit"
            className="group mt-2 inline-flex w-fit items-center gap-2 bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-primary-foreground transition-transform hover:scale-105"
          >
            Send Message
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </button>
        </form>
      </div>
    </Section>
  );
}
