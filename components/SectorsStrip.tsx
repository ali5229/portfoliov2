import { sectors } from "@/lib/data";

export function SectorsStrip() {
  return (
    <div className="sectors border-y border-rule bg-sheet">
      <div className="wrap flex flex-wrap items-center gap-x-7 gap-y-[10px] py-[18px]">
        <span className="label">{sectors.label}</span>
        <ul className="m-0 flex list-none flex-wrap gap-x-[26px] gap-y-2 p-0 font-display text-[1.05rem] font-bold [font-stretch:100%]">
          {sectors.list.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
