"use client";

import { useMemo, useState } from "react";
import { PRICE_TABLE } from "@/lib/data";

/**
 * Renter-side savings estimator, driven by the same PRICE_TABLE the comparison
 * table above uses. Competitor prices are public on-demand list pricing and are
 * clearly labelled as illustrative — not a live quote.
 */

const num = (s: string) => parseFloat(s.replace(/[^0-9.]/g, "")) || 0;

// only accelerators that a hyperscaler actually offers (so a comparison exists)
const OPTIONS = PRICE_TABLE.map((r) => {
  const clouds = [
    { name: "AWS", rate: num(r.aws), has: r.aws !== "—" },
    { name: "Google Cloud", rate: num(r.gcp), has: r.gcp !== "—" },
    { name: "Azure", rate: num(r.azure), has: r.azure !== "—" },
  ].filter((c) => c.has);
  return { chip: r.chip, spec: r.spec, vortano: num(r.vortano), clouds };
}).filter((o) => o.clouds.length > 0);

const HOUR_PRESETS = [
  { label: "8h/day", hours: 8 * 30.4 },
  { label: "Business", hours: 12 * 30.4 },
  { label: "24/7", hours: 24 * 30.4 },
];

const usd = (n: number) => "$" + Math.round(n).toLocaleString("en-US");

export function SavingsCalculator() {
  const [idx, setIdx] = useState(0); // accelerator
  const [gpus, setGpus] = useState(2);
  const [preset, setPreset] = useState(2); // 24/7

  const opt = OPTIONS[idx];
  const hours = HOUR_PRESETS[preset].hours;

  const { vCost, best, savings, pct } = useMemo(() => {
    const vCost = opt.vortano * gpus * hours;
    // compare against the CHEAPEST hyperscaler that offers this chip (conservative)
    const best = opt.clouds.reduce((a, b) => (b.rate < a.rate ? b : a));
    const cloudCost = best.rate * gpus * hours;
    const savings = cloudCost - vCost;
    const pct = cloudCost > 0 ? (savings / cloudCost) * 100 : 0;
    return { vCost, best, cloudCost, savings, pct };
  }, [opt, gpus, hours]);

  const cloudCost = best.rate * gpus * hours;
  const vBarPct = cloudCost > 0 ? (vCost / cloudCost) * 100 : 100;

  return (
    <div className="panel beam rounded-3xl p-7">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-xl border border-accent/25 bg-accent/10 text-accent-pale">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 18V8M10 18V5M16 18v-6M4 21h16" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="text-base font-semibold text-ink">What would you save?</span>
        </div>
        <span className="shrink-0 rounded-full border border-accent/25 bg-accent/[0.06] px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-accent-pale">
          Estimate
        </span>
      </div>

      {/* accelerator */}
      <div className="mt-5 text-[11px] font-medium uppercase tracking-wider text-dim">Accelerator</div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {OPTIONS.map((o, i) => (
          <button
            key={o.chip}
            onClick={() => setIdx(i)}
            className={`rounded-lg border px-2.5 py-1.5 text-[12px] font-medium transition-colors ${
              i === idx
                ? "border-accent/60 bg-accent/15 text-accent-pale"
                : "border-accent/15 bg-accent/[0.04] text-muted hover:border-accent/40 hover:text-ink"
            }`}
          >
            {o.chip}
          </button>
        ))}
      </div>

      {/* gpus + usage */}
      <div className="mt-5 flex items-center justify-between text-sm">
        <span className="text-muted">GPUs</span>
        <span className="font-mono text-ink">×{gpus}</span>
      </div>
      <input
        type="range"
        min={1}
        max={16}
        value={gpus}
        onChange={(e) => setGpus(Number(e.target.value))}
        className="mt-2 w-full accent-[#C9A24B]"
        aria-label="Number of GPUs"
      />

      <div className="mt-4 grid grid-cols-3 gap-1.5">
        {HOUR_PRESETS.map((p, i) => (
          <button
            key={p.label}
            onClick={() => setPreset(i)}
            className={`rounded-xl border py-2 text-center text-[12px] font-semibold transition-colors ${
              i === preset
                ? "border-accent/60 bg-accent/15 text-accent-pale"
                : "border-accent/15 bg-accent/[0.04] text-muted hover:border-accent/40 hover:text-ink"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* comparison bars */}
      <div className="mt-6 space-y-3">
        <div>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="text-muted">{best.name} <span className="text-dim">· on-demand</span></span>
            <span className="font-mono text-ink">{usd(cloudCost)}/mo</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-white/6">
            <div className="h-full rounded-full bg-white/20" style={{ width: "100%" }} />
          </div>
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="text-accent-pale">Vortano</span>
            <span className="font-mono text-ink">{usd(vCost)}/mo</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-white/6">
            <div
              className="h-full rounded-full bg-gradient-to-r from-accent to-accent-light transition-all duration-500"
              style={{ width: `${Math.max(4, vBarPct)}%` }}
            />
          </div>
        </div>
      </div>

      {/* headline savings */}
      <div className="mt-6 rounded-2xl border border-accent/25 bg-accent/[0.08] p-5">
        <div className="text-xs uppercase tracking-wide text-dim">You&apos;d save</div>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="font-mono text-4xl font-semibold text-accent-pale">{usd(savings)}</span>
          <span className="font-mono text-lg text-positive">/mo</span>
        </div>
        <div className="mt-1 font-mono text-sm text-muted">
          {pct.toFixed(0)}% cheaper · {usd(savings * 12)}/year on {gpus}× {opt.chip}
        </div>
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-dim">
        Estimate. Competitor figures are public on-demand list pricing (region-normalised to
        us-east) for comparison — not a live quote. Your real cost depends on availability and
        the price you accept on the marketplace.
      </p>
    </div>
  );
}
