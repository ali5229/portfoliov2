import type { CSSProperties } from "react";
import { experience } from "@/lib/data";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";

export function Experience() {
  return (
    <section className="wrap pt-24 pb-6" id="experience">
      <SectionHead label={experience.label} title={experience.title} />
      <Reveal className="reveal-kids grid gap-0 border-t border-ink">
        {experience.jobs.map((job, i) => (
          <div
            key={job.role}
            style={{ "--i": i } as CSSProperties}
            className="grid grid-cols-[minmax(0,220px)_minmax(0,1fr)] gap-6 border-b border-rule py-7 upto-760:grid-cols-[1fr] upto-760:gap-1.5"
          >
            <div>
              <span className="label mono">{job.period}</span>
            </div>
            <div>
              <h3 className="text-step1 font-[750] [font-stretch:100%]">
                {job.role} · <span className="font-semibold text-accent">{job.org}</span>
              </h3>
              {job.bullets && (
                <ul className="mx-0 mt-3 mb-0 max-w-[68ch] pl-[18px] text-muted [&>li+li]:mt-1.5">
                  {job.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              )}
              {job.body && <p className="mx-0 mt-[10px] mb-0 text-muted">{job.body}</p>}
            </div>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
