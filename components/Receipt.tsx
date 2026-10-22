import { receipt } from "@/lib/data";

function Row({ label, value, ok, className }: { label: string; value: string; ok?: boolean; className?: string }) {
  return (
    <div className={className ? `row ${className}` : "row"}>
      <span>{label}</span>
      <span className={ok ? "ok" : undefined}>{value}</span>
    </div>
  );
}

/** Prints in, barcode glitches, then the SHIPPED stamp lands. Pure CSS (see globals.css). */
export function Receipt() {
  return (
    <div className="receipt-wrap" aria-label="Summary of shipped work, styled as a sales receipt">
      <div className="printer" />
      <div className="receipt">
        <div className="c">
          <b>{receipt.title}</b>
          <br />
          {receipt.subtitle}
        </div>
        <hr />
        {receipt.header.map((r) => (
          <Row key={r.label} {...r} />
        ))}
        <hr />
        {receipt.items.map((r) => (
          <Row key={r.label} {...r} />
        ))}
        <hr />
        <Row {...receipt.sectorsServed} />
        <Row {...receipt.total} className="tot" />
        <div className="bar" aria-hidden="true" />
        <div className="c mt-2">{receipt.thanks}</div>
        <div className="stampmark" aria-hidden="true">
          {receipt.stamp}
        </div>
      </div>
    </div>
  );
}
