import type { CSSProperties } from "react";
import { projects } from "@/lib/data";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";

export function SideProjects() {
  return (
    <section className="wrap pt-24 pb-6" id="projects">
      <SectionHead label={projects.label} title={projects.title} />
      <Reveal className="side reveal-kids grid grid-cols-3 border-t border-ink upto-860:grid-cols-[1fr]">
        {projects.items.map((p, i) => (
          <article
            key={p.title}
            style={{ "--i": i } as CSSProperties}
            className={`border-b border-rule pt-[22px] pr-[22px] pb-[26px] ${i > 0 ? "border-l pl-[22px]" : "pl-0"} upto-860:border-l-0 upto-860:px-0 upto-860:py-5`}
          >
            <span className="label">{p.label}</span>
            <h4 className="mx-0 my-2 font-display text-[1.15rem] font-[750]">{p.title}</h4>
            <p className="m-0 text-[.95rem] text-muted">{p.body}</p>
            {p.tags && (
              <div className="tags">
                {p.tags.map((t) => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </article>
        ))}
      </Reveal>
    </section>
  );
}
