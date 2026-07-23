"use client";

import { useState } from "react";
import { useMarket } from "./MarketProvider";

const LOCKS = [
  { label: "Flexible", days: "unstake anytime", apy: 12.5 },
  { label: "30 days", days: "30-day lock", apy: 18.4 },
  { label: "90 days", days: "90-day lock", apy: 26.8 },
];

const amt = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(2)}M` : n >= 1_000 ? `${(n / 1_000).toFixed(0)}K` : `${Math.round(n)}`;
const usd = (n: number) =>
  n >= 1 ? "$" + n.toLocaleString("en-US", { maximumFractionDigits: 2 }) : "$" + n.toFixed(3);

export function StakingPreview() {
  const m = useMarket();
  const price = m.vrtn.price;
  const [amount, setAmount] = useState(10_000_000); // VRTN
  const [lock, setLock] = useState(1);

  const apy = LOCKS[lock].apy;
  const staked = amount * price;
  // Rewards are a share of protocol revenue, which settles in USDG (see whitepaper §06/§07)
  const rewardsYear = staked * (apy / 100);
  const rewardsMonth = rewardsYear / 12;
  const rewardsDay = rewardsYear / 365;

  return (
    <div className="panel beam rounded-3xl p-7">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-xl border border-accent/25 bg-accent/10 text-accent-pale">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 3l9 5-9 5-9-5 9-5zM3 12l9 5 9-5M3 16.5l9 5 9-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="text-base font-semibold">Stake $VRTN</span>
        </div>
        <span className="rounded-full border border-accent/25 bg-accent/[0.06] px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-accent-pale">
          Preview
        </span>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-muted">
        Stake <strong className="font-bold text-ink">$VRTN</strong> to secure the mesh and earn a
        slice of every rental — protocol revenue, streamed in USDG in real time.
      </p>

      {/* lock tabs */}
      <div className="mt-5 grid grid-cols-3 gap-1.5">
        {LOCKS.map((l, i) => (
          <button
            key={l.label}
            onClick={() => setLock(i)}
            className={`rounded-xl border px-2 py-2.5 text-center transition-colors ${
              i === lock
                ? "border-accent/60 bg-accent/15"
                : "border-accent/15 bg-accent/[0.04] hover:border-accent/40"
            }`}
          >
            <div className={`text-[12px] font-semibold ${i === lock ? "text-accent-pale" : "text-muted"}`}>
              {l.label}
            </div>
            <div className="mt-0.5 font-mono text-[13px] font-bold text-ink">{l.apy}%</div>
          </button>
        ))}
      </div>

      {/* amount */}
      <div className="mt-5 flex items-center justify-between text-sm">
        <span className="text-muted">Amount to stake</span>
        <span className="font-mono text-ink">
          {amt(amount)} <span className="text-accent-pale">VRTN</span>{" "}
          <span className="text-dim">≈ {usd(staked)}</span>
        </span>
      </div>
      <input
        type="range"
        min={1_000_000}
        max={100_000_000}
        step={1_000_000}
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        className="mt-2 w-full accent-[#C9A24B]"
        aria-label="Amount of VRTN to stake"
      />

      <dl className="mt-5 space-y-2.5 text-sm">
        <div className="flex items-center justify-between border-b border-white/6 pb-2.5">
          <dt className="text-muted">Est. APY</dt>
          <dd className="font-mono text-positive">{apy}%</dd>
        </div>
        <div className="flex items-center justify-between border-b border-white/6 pb-2.5">
          <dt className="text-muted">Lock</dt>
          <dd className="font-mono text-ink">{LOCKS[lock].days}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-muted">$VRTN price</dt>
          <dd className="inline-flex items-center gap-1.5 font-mono text-ink">
            <span className="h-1 w-1 rounded-full bg-positive animate-pulse-dot" />
            live
          </dd>
        </div>
      </dl>

      <div className="mt-5 rounded-2xl border border-accent/25 bg-accent/[0.08] p-5">
        <div className="text-xs uppercase tracking-wide text-dim">Est. revenue share / year</div>
        <div className="mt-1 font-mono text-4xl font-semibold text-accent-pale">
          {usd(rewardsYear)} <span className="text-base text-dim">USDG</span>
        </div>
        <div className="mt-1.5 font-mono text-xs text-muted">
          ≈ {usd(rewardsMonth)}/mo &nbsp;·&nbsp; {usd(rewardsDay)}/day &nbsp;·&nbsp; streamed in real time
        </div>
      </div>

      <button className="btn-gold mt-5 w-full rounded-2xl py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5">
        Stake $VRTN
      </button>
      <p className="mt-3 text-[11px] leading-relaxed text-dim">
        Preview — staking opens with mainnet rewards. APY is an estimate that moves with network
        demand and total staked. Not a guarantee of returns.
      </p>
    </div>
  );
}
