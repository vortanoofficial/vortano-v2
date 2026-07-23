"use client";

import { useMemo, useState } from "react";
import { SectionHeader } from "./SectionHeader";
import { Reveal } from "./Reveal";
import { LiveBars } from "./LiveBars";
import { LiveUtil } from "./LiveUtil";
import { RentModal } from "./RentModal";
import { NODES, type Node } from "@/lib/data";

function KindBadge({ kind }: { kind: Node["kind"] }) {
  return (
    <span className="rounded-md border border-accent/20 bg-accent/[0.06] px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted">
      {kind}
    </span>
  );
}

// ---- derive filterable facets straight from the real node data ----
type RegionBucket = "US" | "EU" | "APAC";
function regionOf(n: Node): RegionBucket {
  if (/US-/.test(n.region)) return "US";
  if (/EU/.test(n.region)) return "EU";
  return "APAC";
}
const vramOf = (n: Node) => parseInt(n.memory, 10) || 0;
const tflopsOf = (n: Node) => parseFloat(n.perf) || 0;
const priceOf = (n: Node) => parseFloat(n.price) || 0;

const CLASSES = ["All", "GPU", "TPU", "NPU / ASIC"] as const;
const REGIONS = ["All", "US", "EU", "APAC"] as const;
const SORTS = {
  "price-asc": { label: "Price ↑", cmp: (a: Node, b: Node) => priceOf(a) - priceOf(b) },
  "price-desc": { label: "Price ↓", cmp: (a: Node, b: Node) => priceOf(b) - priceOf(a) },
  vram: { label: "VRAM", cmp: (a: Node, b: Node) => vramOf(b) - vramOf(a) },
  perf: { label: "TFLOPs", cmp: (a: Node, b: Node) => tflopsOf(b) - tflopsOf(a) },
} as const;
type SortKey = keyof typeof SORTS;

function NodeCard({ node, i, onRent }: { node: Node; i: number; onRent: (n: Node) => void }) {
  const reserved = node.status === "Reserved";
  return (
    <Reveal delay={i * 0.05}>
      <div className="panel panel-hover beam beam--slow flex h-full flex-col rounded-3xl p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="font-mono text-xs text-dim">{node.arch}</div>
            <div className="mt-0.5 font-mono text-sm text-accent-pale">{node.id}</div>
          </div>
          <KindBadge kind={node.kind} />
        </div>

        <div className="mt-4 text-lg font-semibold text-ink">{node.chip}</div>
        <div className="mt-0.5 text-xs text-dim">{node.region}</div>

        <dl className="mt-5 grid grid-cols-2 gap-y-3 text-sm">
          <div>
            <dt className="text-[11px] uppercase tracking-wide text-dim">Memory</dt>
            <dd className="mt-0.5 font-mono text-muted">{node.memory}</dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-wide text-dim">Performance</dt>
            <dd className="mt-0.5 font-mono text-muted">{node.perf}</dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-wide text-dim">Uptime 30d</dt>
            <dd className="mt-0.5 font-mono text-positive">{node.uptime}</dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-wide text-dim">Status</dt>
            <dd className={`mt-0.5 font-mono ${reserved ? "text-dim" : "text-positive"}`}>
              {node.status}
            </dd>
          </div>
        </dl>

        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wide text-dim">
              GPU load · live
            </span>
            {reserved ? (
              <span className="font-mono text-[10px] text-dim">idle</span>
            ) : (
              <LiveUtil base={node.util} />
            )}
          </div>
          <LiveBars active={!reserved} intensity={node.util / 100} />
        </div>

        <div className="mt-6 flex items-end justify-between border-t border-accent/15 pt-4">
          <div>
            <span className="font-mono text-2xl font-semibold text-ink">{node.price}</span>
            <span className="ml-1 font-mono text-xs text-dim">USDG / GPU·hour</span>
          </div>
          <button
            disabled={reserved}
            onClick={() => !reserved && onRent(node)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-transform ${
              reserved
                ? "cursor-not-allowed border border-accent/15 text-dim"
                : "btn-gold hover:-translate-y-0.5"
            }`}
          >
            {reserved ? "Reserved" : "Rent"}
          </button>
        </div>
      </div>
    </Reveal>
  );
}

function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div className="inline-flex items-center gap-1 rounded-xl border border-accent/15 bg-accent/[0.04] p-1" role="group" aria-label={label}>
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          aria-pressed={value === o}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
            value === o
              ? "bg-accent/15 text-accent-pale"
              : "text-muted hover:text-ink"
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

export function Marketplace() {
  const [cls, setCls] = useState<(typeof CLASSES)[number]>("All");
  const [region, setRegion] = useState<(typeof REGIONS)[number]>("All");
  const [availOnly, setAvailOnly] = useState(false);
  const [sort, setSort] = useState<SortKey>("price-asc");
  const [renting, setRenting] = useState<Node | null>(null);

  const filtered = useMemo(() => {
    const out = NODES.filter((n) => {
      if (cls !== "All" && n.kind !== cls) return false;
      if (region !== "All" && regionOf(n) !== region) return false;
      if (availOnly && n.status !== "Available now") return false;
      return true;
    });
    return out.sort(SORTS[sort].cmp);
  }, [cls, region, availOnly, sort]);

  const dirty = cls !== "All" || region !== "All" || availOnly || sort !== "price-asc";
  const reset = () => {
    setCls("All");
    setRegion("All");
    setAvailOnly(false);
    setSort("price-asc");
  };

  return (
    <section id="marketplace" className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
      <SectionHeader index="02" eyebrow="Marketplace" title={<>Spin up compute in under <em>nine seconds.</em></>}>
        14,832 verified GPU &amp; NPU nodes, settled trustlessly on Robinhood
        Chain, slashing-bonded against downtime. No gatekeepers, no waitlists, no
        hyperscaler markup — filter by accelerator class, region or framework.
      </SectionHeader>

      {/* Filter bar — operates on the featured nodes below */}
      <Reveal delay={0.1}>
        <div className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-3">
          <Segmented options={CLASSES} value={cls} onChange={setCls} label="Accelerator class" />
          <span className="hidden h-6 w-px bg-accent/20 sm:block" />
          <Segmented options={REGIONS} value={region} onChange={setRegion} label="Region" />

          <button
            onClick={() => setAvailOnly((v) => !v)}
            aria-pressed={availOnly}
            className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
              availOnly
                ? "border-accent/50 bg-accent/15 text-accent-pale"
                : "border-accent/15 bg-accent/[0.04] text-muted hover:text-ink"
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${availOnly ? "bg-positive animate-pulse-dot" : "bg-dim"}`} />
            Available now
          </button>

          <div className="ml-auto flex items-center gap-2">
            {dirty && (
              <button
                onClick={reset}
                className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-dim transition-colors hover:text-accent-pale"
              >
                Clear
              </button>
            )}
            <label className="inline-flex items-center gap-2 rounded-xl border border-accent/15 bg-accent/[0.04] px-3 py-1.5">
              <span className="font-mono text-[11px] uppercase tracking-wide text-dim">Sort</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                aria-label="Sort nodes"
                className="cursor-pointer bg-transparent font-mono text-sm text-ink focus:outline-none"
              >
                {(Object.keys(SORTS) as SortKey[]).map((k) => (
                  <option key={k} value={k} className="bg-panel text-ink">
                    {SORTS[k].label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.14}>
        <div className="mt-4 font-mono text-xs text-dim">
          Showing <span className="text-accent-pale">{filtered.length}</span> of {NODES.length} featured
          {filtered.length === 1 ? " node" : " nodes"} · thousands more live on the network
        </div>
      </Reveal>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((n, i) => (
            <NodeCard key={n.id} node={n} i={i} onRent={setRenting} />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-3xl border border-dashed border-accent/20 bg-accent/[0.03] px-6 py-16 text-center">
          <div className="text-base font-semibold text-ink">
            No featured {cls !== "All" ? cls : ""} nodes match those filters
          </div>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted">
            These are hand-picked showcase nodes — thousands more{" "}
            {cls !== "All" ? `${cls} ` : ""}accelerators are live across the network.
            Adjust the filters, or reset to see them all.
          </p>
          <button
            onClick={reset}
            className="btn-gold mt-5 rounded-xl px-4 py-2 text-sm font-semibold transition-transform hover:-translate-y-0.5"
          >
            Reset filters
          </button>
        </div>
      )}

      {renting && <RentModal node={renting} onClose={() => setRenting(null)} />}
    </section>
  );
}
