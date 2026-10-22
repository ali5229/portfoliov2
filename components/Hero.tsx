import { Fragment } from "react";
import { hero, site } from "@/lib/data";
import { CopyEmailButton } from "./CopyEmailButton";
import { Receipt } from "./Receipt";

/** Each word sits in its own overflow mask so it can rise into view (delays keyed by nth-child in CSS). */
function Words({ text }: { text: string }) {
  return text.split(" ").map((word, i) => (
    <Fragment key={i}>
      {i > 0 && " "}
      <span className="w">
        <span>{word}</span>
      </span>
    </Fragment>
  ));
}

export function Hero() {
  return (
    <div className="wrap hero grid grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] items-start gap-14 pt-[72px] pb-16 upto-880:grid-cols-[1fr] upto-880:gap-11 upto-880:py-12">
      <div>
        <span className="label">{hero.label}</span>
        <h1
          className="h-anim mt-[18px] text-step4 font-[850] tracking-[-.025em] [font-stretch:112%]"
          aria-label={`${hero.headline} ${hero.headlineEmphasis}`}
        >
          <span aria-hidden="true">
            <Words text={hero.headline} />{" "}
            <em className="hl text-accent not-italic">
              <Words text={hero.headlineEmphasis} />
              <svg className="squig" viewBox="0 0 300 14" preserveAspectRatio="none" aria-hidden="true">
                <path d="M2 9C40 3 70 12 110 7S190 3 230 8 280 6 298 5" />
              </svg>
            </em>
          </span>
        </h1>
        <p className="lede mt-[26px] mb-0 max-w-[34ch] text-step1 leading-[1.5] text-muted">
          {hero.lede} <strong className="font-semibold text-ink">{hero.ledeStrong}</strong>
        </p>
        <div className="cta mt-[34px] flex flex-wrap gap-3">
          <a className="btn primary" href={hero.primaryCta.href}>
            {hero.primaryCta.label}
          </a>
          <CopyEmailButton className="btn" email={site.email} label={hero.copyLabel} />
        </div>
        <div className="meta-row mt-10 flex flex-wrap gap-x-[22px] gap-y-2 [border-top:1px_dashed_var(--rule)] pt-5">
          {hero.meta.map((m) => (
            <div key={m.label} className="flex flex-col gap-0.5">
              <span className="label">{m.label}</span>
              <b className="font-semibold">{m.value}</b>
            </div>
          ))}
        </div>
      </div>
      <Receipt />
    </div>
  );
}
