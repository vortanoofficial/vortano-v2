"use client";

import { useEffect, useRef, useState } from "react";
import { useMarket } from "./MarketProvider";

/**
 * A live-feeling staking dashboard: pool stats + a sample position whose rewards
 * accrue every tick. Everything is a clearly-labelled PREVIEW — staking opens
 * with mainnet. APYs match StakingPreview (12.5 / 18.4 / 26.8) and the whitepaper:
 * rewards are a share of protocol revenue, settled in USDG.
 */

const TIERS = [
  { label: "Flexible", apy: 12.5, share: 34 },
  { label: "30-day", apy: 18.4, share: 41 },
  { label: "90-day", apy: 26.8, share: 25 },
];

// pool-level preview figures (illustrative, labelled as such)
const TOTAL_STAKED_VRTN = 214_800_000;
const STAKERS = 1_240;
const WEIGHTED_APY = TIERS.reduce((a, t) => a + t.apy * (t.share / 100), 0); // ≈ 18.6%

// a sample position so the dashboard has something to show pre-mainnet
const SAMPLE_VRTN = 50_000_000;
const SAMPLE_TIER = 1; // 30-day

const usd = (n: number, dp = 2) =>
  "$" + n.toLocaleString("en-US", { minimumFractionDigits: dp, maximumFractionDigits: dp });
const compact = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(2)}M` : n >= 1_000 ? `${(n / 1_000).toFixed(1)}K` : `${Math.round(n)}`;

export function StakingDashboard() {
  const m = useMarket();
  const price = m.vrtn.price;

  const stakedUsd = SAMPLE_VRTN * price;
  const apy = TIERS[SAMPLE_TIER].apy;
  const rewardsPerSec = (stakedUsd * (apy / 100)) / (365 * 24 * 3600);

  // rewards tick up every 100ms so the number visibly streams. setInterval +
  // performance.now is used deliberately: requestAnimationFrame gets throttled in
  // background/automation tabs, which would freeze the counter.
  const [accrued, setAccrued] = useState(0);
  useEffect(() => {
    const t0 = performance.now();
    const id = setInterval(() => {
      setAccrued(((performance.now() - t0) / 1000) * rewardsPerSec);
    }, 100);
    return () => clearInterval(id);
  }, [rewardsPerSec]);

  const tvlUsd = TOTAL_STAKED_VRTN * price;

  return (
    <div className="panel beam overflow-hidden rounded-3xl">
      <div className="flex items-center justify-between gap-3 border-b border-accent/15 px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-xl border border-accent/25 bg-accent/10 text-accent-pale">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 3l9 5-9 5-9-5 9-5zM3 12l9 5 9-5M3 16.5l9 5 9-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="text-base font-semibold text-ink">Staking dashboard</span>
        </div>
        <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-positive">
          <span className="h-1.5 w-1.5 rounded-full bg-positive animate-pulse-dot" />
          {m.live ? "LIVE" : "PREVIEW"}
        </span>
      </div>

      <div className="grid gap-6 p-6 lg:grid-cols-[1.1fr_1fr]">
        {/* ---- pool stats ---- */}
        <div className="min-w-0">
          <div className="text-[11px] font-medium uppercase tracking-wider text-dim">Protocol pool</div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-accent/15 bg-black/25 p-4">
              <div className="text-[10px] uppercase tracking-wide text-dim">Total staked</div>
              <div className="mt-1 font-mono text-xl font-semibold text-ink">{compact(TOTAL_STAKED_VRTN)}</div>
              <div className="font-mono text-[11px] text-dim">VRTN · ≈ {usd(tvlUsd, 0)}</div>
            </div>
            <div className="rounded-2xl border border-accent/15 bg-black/25 p-4">
              <div className="text-[10px] uppercase tracking-wide text-dim">Stakers</div>
              <div className="mt-1 font-mono text-xl font-semibold text-ink">{STAKERS.toLocaleString("en-US")}</div>
              <div className="font-mono text-[11px] text-dim">wallets earning</div>
            </div>
            <div className="rounded-2xl border border-accent/15 bg-black/25 p-4">
              <div className="text-[10px] uppercase tracking-wide text-dim">Avg APY</div>
              <div className="mt-1 font-mono text-xl font-semibold text-positive">{WEIGHTED_APY.toFixed(1)}%</div>
              <div className="font-mono text-[11px] text-dim">stake-weighted</div>
            </div>
            <div className="rounded-2xl border border-accent/15 bg-black/25 p-4">
              <div className="text-[10px] uppercase tracking-wide text-dim">Settlement</div>
              <div className="mt-1 font-mono text-xl font-semibold text-accent-pale">USDG</div>
              <div className="font-mono text-[11px] text-dim">real-time</div>
            </div>
          </div>

          <div className="mt-5 text-[11px] font-medium uppercase tracking-wider text-dim">Stake by lock</div>
          <div className="mt-3 space-y-3">
            {TIERS.map((t) => (
              <div key={t.label}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">
                    {t.label} <span className="font-mono text-[11px] text-positive">· {t.apy}%</span>
                  </span>
                  <span className="font-mono text-xs text-dim">{t.share}%</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/6">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-accent to-accent-light"
                    style={{ width: `${t.share}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ---- your position ---- */}
        <div className="min-w-0">
          <div className="rounded-2xl border border-accent/25 bg-accent/[0.08] p-5">
            <div className="flex items-center justify-between">
              <div className="text-xs uppercase tracking-wide text-dim">Sample position</div>
              <span className="rounded-full border border-accent/25 bg-accent/[0.06] px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-accent-pale">
                30-day · {apy}%
              </span>
            </div>

            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-sm text-muted">Staked</span>
              <span className="font-mono text-lg font-semibold text-ink">
                {compact(SAMPLE_VRTN)} <span className="text-xs text-dim">VRTN</span>
              </span>
            </div>
            <div className="mt-1 text-right font-mono text-[11px] text-dim">≈ {usd(stakedUsd)}</div>

            <div className="mt-5 rounded-xl border border-accent/20 bg-black/40 p-4 text-center">
              <div className="text-[10px] uppercase tracking-wide text-dim">Rewards accrued</div>
              <div className="mt-1 font-mono text-2xl font-semibold text-accent-pale tabular-nums">
                {usd(accrued, 6)}
              </div>
              <div className="mt-1 inline-flex items-center gap-1.5 font-mono text-[11px] text-positive">
                <span className="h-1 w-1 rounded-full bg-positive animate-pulse-dot" />
                streaming · {usd(rewardsPerSec * 86400)}/day
              </div>
            </div>

            <button className="btn-gold mt-4 w-full rounded-2xl py-2.5 text-sm font-semibold transition-transform hover:-translate-y-0.5">
              Claim rewards
            </button>
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-dim">
            Preview — staking opens with mainnet. Figures are a sample at the live $VRTN price;
            APY moves with network demand and total staked. Rewards are a share of protocol
            revenue, settled in USDG. Not a guarantee of returns.
          </p>
        </div>
      </div>
    </div>
  );
}
