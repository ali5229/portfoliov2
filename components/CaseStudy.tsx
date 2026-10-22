import type { CSSProperties } from "react";
import type { Case } from "@/lib/data";
import { Reveal } from "./Reveal";

const idx = (i: number) => ({ "--i": i }) as CSSProperties;

function Tags({ tags }: { tags: string[] }) {
  return (
    <div className="tags">
      {tags.map((t, i) => (
        <span key={t} className="tag" style={idx(i)}>
          {t}
        </span>
      ))}
    </div>
  );
}

/** Featured: two columns, header row, tags under the summary. Otherwise: single column, tags last. */
export function CaseStudy({ data }: { data: Case }) {
  const { featured } = data;
  return (
    <Reveal
      as="article"
      spot
      className={
        featured
          ? "case reveal spot grid grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] gap-9 p-[34px] upto-860:grid-cols-[1fr] upto-860:gap-6 upto-860:p-6"
          : "case reveal spot grid grid-cols-[1fr] gap-[18px] p-[34px] upto-860:p-6"
      }
    >
      <div>
        <span className="label">{data.label}</span>
        <h3 className="mt-[10px] text-step2 font-extrabold tracking-[-.015em] [font-stretch:105%]">
          {data.title}
        </h3>
        <p className="mx-0 mt-[14px] mb-0 max-w-[46ch] text-muted">{data.summary}</p>
        {featured && <Tags tags={data.tags} />}
      </div>
      <table className="ledger">
        {featured && (
          <thead>
            <tr>
              <th>Entry</th>
              <th>What I built</th>
            </tr>
          </thead>
        )}
        <tbody>
          {data.ledger.map((row, i) => (
            <tr key={row.entry} style={idx(i)}>
              <td>{row.entry}</td>
              <td>{row.text}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {!featured && <Tags tags={data.tags} />}
    </Reveal>
  );
}
