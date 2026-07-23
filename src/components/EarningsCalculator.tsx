"use client";

import { useState } from "react";

const GPUS = [
  { name: "RTX 4090", rate: 0.41 },
  { name: "L40S", rate: 0.92 },
  { name: "A100 80GB", rate: 1.42 },
  { name: "H100 SXM5", rate: 2.18 },
  { name: "MI300X", rate: 2.74 },
  { name: "H200 NVL", rate: 3.1 },
];
const FEE = 0.025;
const HOURS_PER_MONTH = 24 * 30.4;

const usd = (n: number) => "$" + Math.round(n).toLocaleString("en-US");

export function EarningsCalculator() {
  const [gpu, setGpu] = useState(3); // H100 SXM5
  const [count, setCount] = useState(2);
  const [util, setUtil] = useState(78);

  const rate = GPUS[gpu].rate;
  const gross = rate * HOURS_PER_MONTH * count * (util / 100);
  const monthly = gross * (1 - FEE);
  const daily = monthly / 30.4;
  const yearly = monthly * 12;

  return (
    <div className="panel beam rounded-3xl p-7">
      <div className="flex items-center justify-between">
        <div className="eyebrow">Earnings calculator</div>
        <span className="rounded-full border border-accent/25 bg-accent/[0.06] px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-accent-pale">
          Live estimate
        </span>
      </div>

      {/* GPU picker */}
      <div className="mt-4 text-[11px] font-medium uppercase tracking-wider text-dim">Your hardware</div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {GPUS.map((g, i) => (
          <button
            key={g.name}
            onClick={() => setGpu(i)}
            className={`rounded-lg border px-2.5 py-1.5 text-[12px] font-medium transition-colors ${
              i === gpu
                ? "border-accent/60 bg-accent/15 text-accent-pale"
                : "border-accent/15 bg-accent/[0.04] text-muted hover:border-accent/40 hover:text-ink"
            }`}
          >
            {g.name}
          </button>
        ))}
      </div>

      {/* count */}
      <div className="mt-5 flex items-center justify-between text-sm">
        <span className="text-muted">How many GPUs</span>
        <span className="font-mono text-ink">
          {count}× <span className="text-accent-pale">{GPUS[gpu].name}</span>
        </span>
      </div>
      <input
        type="range"
        min={1}
        max={8}
        value={count}
        onChange={(e) => setCount(Number(e.target.value))}
        className="mt-2 w-full accent-[#C9A24B]"
        aria-label="Number of GPUs"
      />

      {/* utilization */}
      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-muted">Network utilization</span>
        <span className="font-mono text-ink">{util}%</span>
      </div>
      <input
        type="range"
        min={30}
        max={95}
        value={util}
        onChange={(e) => setUtil(Number(e.target.value))}
        className="mt-2 w-full accent-[#C9A24B]"
        aria-label="Utilization"
      />

      <dl className="mt-5 space-y-2.5 text-sm">
        <div className="flex items-center justify-between border-b border-white/6 pb-2.5">
          <dt className="text-muted">Median rate</dt>
          <dd className="font-mono text-ink">${rate.toFixed(2)} /hr</dd>
        </div>
        <div className="flex items-center justify-between border-b border-white/6 pb-2.5">
          <dt className="text-muted">Gross / month</dt>
          <dd className="font-mono text-ink">{usd(gross)}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-muted">Protocol fee</dt>
          <dd className="font-mono text-dim">2.5%</dd>
        </div>
      </dl>

      <div className="mt-5 rounded-2xl border border-accent/25 bg-accent/[0.08] p-5">
        <div className="text-xs uppercase tracking-wide text-dim">Est. take-home / month</div>
        <div className="mt-1 font-mono text-4xl font-semibold text-accent-pale sm:text-[42px]">
          {usd(monthly)} <span className="text-base text-dim">USDG</span>
        </div>
        <div className="mt-1.5 font-mono text-xs text-muted">
          ≈ {usd(daily)}/day &nbsp;·&nbsp; {usd(yearly)}/yr
        </div>
      </div>

      <button className="btn-gold mt-5 w-full rounded-2xl py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5">
        Start earning with your GPU
      </button>
      <p className="mt-3 text-[11px] leading-relaxed text-dim">
        Estimate only — real earnings vary with demand, uptime and market price. Not a guarantee of income.
      </p>
    </div>
  );
}
