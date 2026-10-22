import type { CSSProperties } from "react";
import { architecture } from "@/lib/data";
import { LiveLog } from "./LiveLog";
import { Reveal } from "./Reveal";

const d = (n: number) => ({ "--d": n }) as CSSProperties;

const TENANTS = [
  { y: 30, label: "Tyre co. DB", begin: "0s" },
  { y: 124, label: "Poultry DB", begin: "1.4s" },
  { y: 218, label: "Cement DB", begin: "2.8s" },
];
const ROUTES = [
  { id: "r1", begin: "0s" },
  { id: "r2", begin: "1.4s" },
  { id: "r3", begin: "2.8s" },
];

/** Nodes assemble, wires draw, then packets travel to each tenant DB (SMIL) while the log ticks. */
export function ArchitectureDiagram() {
  return (
    <section className="wrap pt-24 pb-6" id="architecture">
      <Reveal
        id="arch"
        className="arch reveal grid grid-cols-[minmax(0,.8fr)_minmax(0,1.4fr)] items-center gap-9 rounded-[10px] bg-ink p-[34px] text-paper upto-860:grid-cols-[1fr] upto-860:p-6"
      >
        <div>
          <span className="label">{architecture.label}</span>
          <h3 className="mt-[10px] text-step2 font-extrabold [font-stretch:105%]">
            {architecture.title}
          </h3>
          <p>{architecture.body}</p>
        </div>
        <Reveal id="dia" className="dia reveal">
          <svg
            className="arch-svg"
            viewBox="0 0 620 300"
            role="img"
            aria-label="Request flow: user signs in, Next.js API resolves tenant, Prisma connects to that tenant's PostgreSQL database; nightly backups go to Cloudflare R2."
          >
            <defs>
              <marker
                id="ah"
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="7"
                markerHeight="7"
                orient="auto-start-reverse"
              >
                <path d="M0 0L10 5L0 10z" fill="var(--paper)" />
              </marker>
              <path id="r1" d="M120 146H451C475 120 475 60 496 54" />
              <path id="r2" d="M120 146H496" />
              <path id="r3" d="M120 146H451C475 172 475 232 496 238" />
            </defs>
            <g fontFamily="IBM Plex Mono, monospace" fontSize="12" fill="var(--paper)">
              <g className="nd" style={d(0)}>
                <rect x="10" y="118" width="110" height="56" rx="6" fill="none" stroke="var(--paper)" strokeOpacity=".5" />
                <text x="65" y="142" textAnchor="middle">
                  User login
                </text>
                <text x="65" y="160" textAnchor="middle" opacity=".6">
                  session
                </text>
              </g>
              <g className="nd" style={d(1)}>
                <rect className="api-glow" x="164" y="102" width="152" height="88" rx="9" fill="none" stroke="var(--accent)" strokeWidth="2" />
                <rect x="170" y="108" width="140" height="76" rx="6" fill="var(--accent)" />
                <text x="240" y="136" textAnchor="middle" fill="var(--accent-ink)" fontWeight="600">
                  Next.js API
                </text>
                <text x="240" y="154" textAnchor="middle" fill="var(--accent-ink)">
                  tenant resolver
                </text>
                <text x="240" y="170" textAnchor="middle" fill="var(--accent-ink)" opacity=".8">
                  + permissions
                </text>
              </g>
              <g className="nd" style={d(2)}>
                <rect x="355" y="118" width="96" height="56" rx="6" fill="none" stroke="var(--paper)" strokeOpacity=".5" />
                <text x="403" y="142" textAnchor="middle">
                  Prisma
                </text>
                <text x="403" y="160" textAnchor="middle" opacity=".6">
                  client pool
                </text>
              </g>
              <g className="nd" style={d(3)}>
                {TENANTS.flatMap((t) => [
                  <rect
                    key={t.label + "-box"}
                    x="500"
                    y={t.y}
                    width="110"
                    height="44"
                    rx="6"
                    fill="var(--accent)"
                    fillOpacity="0"
                    stroke="var(--paper)"
                    strokeOpacity=".5"
                  >
                    <animate
                      attributeName="fill-opacity"
                      values="0;0;.55;0"
                      keyTimes="0;.86;.92;1"
                      dur="4.2s"
                      begin={t.begin}
                      repeatCount="indefinite"
                    />
                  </rect>,
                  <text key={t.label} x="555" y={t.y + 27} textAnchor="middle">
                    {t.label}
                  </text>,
                ])}
              </g>

              <g className="wires" stroke="var(--paper)" strokeWidth="1.5" fill="none" markerEnd="url(#ah)">
                <path pathLength={1} d="M120 146H166" />
                <path pathLength={1} d="M310 146H351" />
                <path pathLength={1} d="M451 140C475 120 475 60 496 54" />
                <path pathLength={1} d="M451 146H496" />
                <path pathLength={1} d="M451 152C475 172 475 232 496 238" />
              </g>

              <g className="packets">
                {ROUTES.map((r) => (
                  <circle key={r.id} r="5" fill="var(--paper)">
                    <animateMotion
                      dur="4.2s"
                      begin={r.begin}
                      repeatCount="indefinite"
                      keyPoints="0;1;1"
                      keyTimes="0;.88;1"
                      calcMode="linear"
                    >
                      <mpath href={`#${r.id}`} />
                    </animateMotion>
                    <animate
                      attributeName="opacity"
                      values="0;1;1;0"
                      keyTimes="0;.05;.86;.9"
                      dur="4.2s"
                      begin={r.begin}
                      repeatCount="indefinite"
                    />
                  </circle>
                ))}
              </g>

              <path
                className="backup"
                d="M555 262V284H240V188"
                stroke="var(--paper)"
                strokeOpacity=".5"
                strokeDasharray="4 4"
                fill="none"
              />
              <text className="nd" style={d(4)} x="300" y="278" opacity=".75">
                nightly → Cloudflare R2 backups
              </text>
            </g>
          </svg>
          <LiveLog logs={architecture.logs} />
        </Reveal>
      </Reveal>
    </section>
  );
}
