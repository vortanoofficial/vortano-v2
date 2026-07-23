"use client";

import { useState } from "react";
import { SectionHeader } from "./SectionHeader";
import { Reveal } from "./Reveal";
import { LiveNumber } from "./LiveNumber";
import { NODES, type Node } from "@/lib/data";

/**
 * Equirectangular projection into the 1000×500 viewBox. The backdrop is an
 * explicit lat/lon graticule rather than a drawn coastline — the markers sit at
 * their true coordinates, and nothing pretends to be a coastline that isn't one.
 */
const W = 1000;
const H = 500;
const project = (lat: number, lon: number) => ({
  x: ((lon + 180) / 360) * W,
  y: ((90 - lat) / 180) * H,
});

type Site = { id: string; lat: number; lon: number };

// Coordinates for the regions the marketplace already lists.
const SITES: Site[] = [
  { id: "4090-fra-12", lat: 50.11, lon: 8.68 },
  { id: "l40s-syd-03", lat: -33.87, lon: 151.21 },
  { id: "a100-sgp-09", lat: 1.35, lon: 103.82 },
  { id: "h100-iad-04", lat: 39.04, lon: -77.49 },
  { id: "mi300x-pdx-02", lat: 45.52, lon: -122.68 },
  { id: "h200-tok-01", lat: 35.68, lon: 139.69 },
];

const nodeById = (id: string) => NODES.find((n) => n.id === id) as Node;

// Routing paths drawn between sites — mirrors how the engine spreads a job.
const LINKS: [string, string][] = [
  ["mi300x-pdx-02", "h100-iad-04"],
  ["h100-iad-04", "4090-fra-12"],
  ["4090-fra-12", "a100-sgp-09"],
  ["a100-sgp-09", "h200-tok-01"],
  ["a100-sgp-09", "l40s-syd-03"],
];

function arc(a: Site, b: Site) {
  const p = project(a.lat, a.lon);
  const q = project(b.lat, b.lon);
  const mx = (p.x + q.x) / 2;
  const my = (p.y + q.y) / 2;
  // bow the path away from the equator so the links read as hops, not chords
  const lift = Math.hypot(q.x - p.x, q.y - p.y) * 0.22;
  return `M${p.x},${p.y} Q${mx},${my - lift} ${q.x},${q.y}`;
}

function Graticule() {
  const lons = [];
  for (let l = -150; l <= 150; l += 30) lons.push(l);
  const lats = [];
  for (let l = -60; l <= 60; l += 20) lats.push(l);
  return (
    <g>
      {lons.map((lon) => {
        const { x } = project(0, lon);
        return (
          <line
            key={`lon${lon}`}
            x1={x}
            y1={40}
            x2={x}
            y2={H - 40}
            stroke="currentColor"
            strokeWidth={1}
            className="text-accent/[0.10]"
          />
        );
      })}
      {lats.map((lat) => {
        const { y } = project(lat, 0);
        return (
          <line
            key={`lat${lat}`}
            x1={30}
            y1={y}
            x2={W - 30}
            y2={y}
            stroke="currentColor"
            strokeWidth={lat === 0 ? 1.4 : 1}
            className={lat === 0 ? "text-accent/25" : "text-accent/[0.10]"}
          />
        );
      })}
    </g>
  );
}

export function GlobalCoverage() {
  const [active, setActive] = useState<string>("h100-iad-04");
  const sel = nodeById(active);
  const online = NODES.filter((n) => n.status !== "Reserved").length;

  return (
    <section id="coverage" className="relative">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
        <SectionHeader
          index="04"
          eyebrow="Global Coverage"
          title={
            <>
              Compute that lives <em>everywhere at once.</em>
            </>
          }
        >
          No datacenter to walk into, no single region to take down. Vortano routes
          every job across independent providers on four continents — each one
          bonded, each one settling on Robinhood Chain.
        </SectionHeader>

        <div className="mt-10 grid gap-5 lg:grid-cols-[1.5fr_1fr]">
          <Reveal>
            <div className="panel beam beam--slow overflow-hidden rounded-3xl">
              <div className="flex items-center justify-between gap-3 border-b border-accent/15 px-4 py-3">
                <span className="min-w-0 truncate font-mono text-xs text-dim">
                  ~/vortano/coverage — {SITES.length} regions · 4 continents
                </span>
                <span className="inline-flex shrink-0 items-center gap-1.5 font-mono text-[11px] text-positive">
                  <span className="h-1.5 w-1.5 rounded-full bg-positive animate-pulse-dot" />
                  {online} ONLINE
                </span>
              </div>

              {/* the map is inherently wide — let it scroll in its own box on
                  narrow screens rather than shrinking the markers to specks */}
              <div className="scroll-thin overflow-x-auto p-2 sm:p-4">
                <svg
                  viewBox={`0 0 ${W} ${H}`}
                  className="h-auto w-full min-w-[620px]"
                  role="img"
                  aria-label="Vortano provider regions worldwide"
                >
                  <Graticule />

                  {LINKS.map(([a, b], i) => {
                    const sa = SITES.find((s) => s.id === a)!;
                    const sb = SITES.find((s) => s.id === b)!;
                    const d = arc(sa, sb);
                    const lit = active === a || active === b;
                    return (
                      <g key={`${a}-${b}`}>
                        <path
                          d={d}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={lit ? 2 : 1.2}
                          className={lit ? "text-accent/70" : "text-accent/20"}
                        />
                        <circle r={3.2} fill="currentColor" className="text-accent-pale">
                          <animateMotion dur={`${5 + i * 0.8}s`} repeatCount="indefinite" path={d} />
                          <animate
                            attributeName="opacity"
                            values="0;1;1;0"
                            dur={`${5 + i * 0.8}s`}
                            repeatCount="indefinite"
                          />
                        </circle>
                      </g>
                    );
                  })}

                  {SITES.map((s) => {
                    const n = nodeById(s.id);
                    const { x, y } = project(s.lat, s.lon);
                    const reserved = n.status === "Reserved";
                    const isActive = active === s.id;
                    return (
                      <g
                        key={s.id}
                        onMouseEnter={() => setActive(s.id)}
                        onClick={() => setActive(s.id)}
                        className="cursor-pointer"
                      >
                        {!reserved && (
                          <circle cx={x} cy={y} r={6} fill="none" stroke="currentColor" className="text-accent/60">
                            <animate attributeName="r" values="6;20" dur="2.6s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.7;0" dur="2.6s" repeatCount="indefinite" />
                          </circle>
                        )}
                        {/* generous invisible hit area for touch */}
                        <circle cx={x} cy={y} r={22} fill="transparent" />
                        <circle
                          cx={x}
                          cy={y}
                          r={isActive ? 8 : 5.5}
                          fill="currentColor"
                          className={reserved ? "text-dim" : "text-accent"}
                        />
                        <circle cx={x} cy={y} r={2} fill="#0b0805" />
                        <text
                          x={x}
                          y={y - 18}
                          textAnchor="middle"
                          className={`font-mono ${isActive ? "fill-accent-pale" : "fill-dim"}`}
                          style={{ fontSize: 18 }}
                        >
                          {n.region.split(",")[0]}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>
          </Reveal>

          <div className="flex min-w-0 flex-col gap-5">
            <Reveal delay={0.08}>
              <div className="panel rounded-3xl p-6">
                <div className="text-xs uppercase tracking-wide text-dim">Selected region</div>
                <div className="mt-2 truncate text-2xl font-semibold text-ink">{sel.region}</div>
                <div className="mt-0.5 font-mono text-sm text-accent-pale">{sel.id}</div>

                <dl className="mt-5 grid grid-cols-2 gap-y-4 text-sm">
                  <div className="min-w-0">
                    <dt className="text-[11px] uppercase tracking-wide text-dim">Accelerator</dt>
                    <dd className="mt-0.5 truncate text-muted">{sel.chip}</dd>
                  </div>
                  <div className="min-w-0">
                    <dt className="text-[11px] uppercase tracking-wide text-dim">Price</dt>
                    <dd className="mt-0.5 font-mono text-ink">{sel.price} USDG/hr</dd>
                  </div>
                  <div className="min-w-0">
                    <dt className="text-[11px] uppercase tracking-wide text-dim">Uptime 30d</dt>
                    <dd className="mt-0.5 font-mono text-positive">{sel.uptime}</dd>
                  </div>
                  <div className="min-w-0">
                    <dt className="text-[11px] uppercase tracking-wide text-dim">Status</dt>
                    <dd
                      className={`mt-0.5 truncate font-mono ${
                        sel.status === "Reserved" ? "text-dim" : "text-positive"
                      }`}
                    >
                      {sel.status}
                    </dd>
                  </div>
                </dl>
              </div>
            </Reveal>

            <Reveal delay={0.14}>
              <div className="panel rounded-3xl p-6">
                <div className="text-xs uppercase tracking-wide text-dim">Cross-region jobs routed</div>
                <div className="mt-2 font-mono text-4xl font-semibold text-ink">
                  <LiveNumber base={71240} mode="climb" step={9} intervalMs={1400} />
                </div>
                <div className="mt-1 text-sm text-muted">
                  every hop settled on-chain · verifiable on Robinscan
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="panel rounded-3xl p-6">
                <div className="text-xs uppercase tracking-wide text-dim">Regions</div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {SITES.map((s) => {
                    const n = nodeById(s.id);
                    return (
                      <button
                        key={s.id}
                        onClick={() => setActive(s.id)}
                        className={`rounded-lg border px-2 py-1 text-[11px] font-medium transition-colors ${
                          active === s.id
                            ? "border-accent/60 bg-accent/15 text-accent-pale"
                            : "border-accent/15 bg-accent/[0.04] text-muted hover:border-accent/40 hover:text-ink"
                        }`}
                      >
                        {n.region.split(",")[0]}
                      </button>
                    );
                  })}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
