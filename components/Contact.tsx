import { contact, site } from "@/lib/data";
import { CopyEmailButton } from "./CopyEmailButton";
import { Reveal } from "./Reveal";

export function Contact() {
  return (
    <section className="wrap pt-[110px] pb-[60px]" id="contact">
      <span className="label">{contact.label}</span>
      <Reveal as="h2" className="reveal text-step4 font-[850] tracking-[-.03em] [font-stretch:118%]">
        {contact.title}
      </Reveal>
      <div className="mt-[30px] flex flex-wrap items-center gap-[14px]">
        <span
          id="addr"
          className="border-b-2 border-accent pb-0.5 font-mono text-[clamp(1rem,2.6vw,1.45rem)] break-all select-all"
        >
          {site.email}
        </span>
        <CopyEmailButton className="btn primary" email={site.email} label={contact.copyLabel} />
      </div>
      <div className="socials mt-[34px] flex flex-wrap gap-x-[26px] gap-y-[10px]">
        {site.socials.map((s) => (
          <a key={s.href} href={s.href} target="_blank" rel="noopener">
            {s.label}
          </a>
        ))}
      </div>
    </section>
  );
}
