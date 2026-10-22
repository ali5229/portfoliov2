import { Reveal } from "./Reveal";

export function SectionHead({ label, title, intro }: { label: string; title: string; intro?: string }) {
  return (
    <Reveal className="sec-head reveal mb-11 grid grid-cols-[minmax(0,220px)_minmax(0,1fr)] items-end gap-6 upto-760:grid-cols-[1fr] upto-760:gap-2">
      <span className="label">{label}</span>
      <div>
        <h2 className="relative text-step3 font-extrabold tracking-[-.02em] [font-stretch:110%]">{title}</h2>
        {intro && <p className="mx-0 mt-3 mb-0 max-w-[60ch] text-muted">{intro}</p>}
      </div>
    </Reveal>
  );
}
