"use client";

import { useEffect, useState } from "react";
import { fetchOnChain, CHAIN_FALLBACK, fmtInt, fmtCompact, RH_EXPLORER, type OnChain } from "@/lib/chain";
import { VRTN_CONTRACT, TOKEN_LIVE, LAUNCH_URL } from "@/lib/market";

/**
 * Live, verifiable on-chain stats for $VRTN pulled straight from the Robinhood
 * Chain Blockscout explorer. These are REAL numbers (holders, transfers, supply,
 * network) — not estimates. Anyone can verify them on the explorer.
 */
export function OnChainStats() {
  const [d, setD] = useState<OnChain>(CHAIN_FALLBACK);

  useEffect(() => {
    if (!TOKEN_LIVE) return; // relaunch pending — don't fetch the old token
    let alive = true;
    const load = () => fetchOnChain().then((x) => alive && setD(x));
    load();
    const iv = setInterval(load, 45000);
    return () => {
      alive = false;
      clearInterval(iv);
    };
  }, []);

  if (!TOKEN_LIVE) {
    return (
      <div className="rounded-3xl border border-accent/20 bg-accent/[0.05] p-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/[0.06] px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-accent-pale">
          <span className="h-1.5 w-1.5 rounded-full bg-positive animate-pulse-dot" /> Relaunch pending
        </div>
        <div className="mt-4 text-lg font-semibold text-ink">Live on-chain stats go live at the pools.trade relaunch</div>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
          Holders, transfers and supply for the new token will stream here — verifiable on the
          explorer — the moment it launches.
        </p>
        <a href={LAUNCH_URL} target="_blank" rel="noopener noreferrer" className="btn-gold mt-5 inline-block rounded-xl px-5 py-2.5 text-sm font-semibold">
          Follow on pools.trade ↗
        </a>
      </div>
    );
  }

  const stats: { k: string; v: string; sub: string; accent?: boolean }[] = [
    { k: "$VRTN holders", v: fmtInt(d.holders), sub: "on Robinhood Chain", accent: true },
    { k: "Transfers", v: fmtInt(d.transfers), sub: "all-time, on-chain" },
    { k: "Total supply", v: fmtCompact(d.totalSupply) + " VRTN", sub: "fixed · 18 decimals" },
    { k: "Network blocks", v: fmtCompact(d.totalBlocks), sub: `~${d.gasAvg} gwei gas` },
  ];

  return (
    <div className="panel beam overflow-hidden rounded-3xl">
      <div className="flex items-center justify-between gap-3 border-b border-accent/15 px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-xl border border-accent/25 bg-accent/10 text-accent-pale">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19" strokeLinecap="round" opacity="0.5" />
              <circle cx="12" cy="12" r="4" />
            </svg>
          </span>
          <span className="text-base font-semibold text-ink">Live on Robinhood Chain</span>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 font-mono text-[11px] text-positive">
          <span className="h-1.5 w-1.5 rounded-full bg-positive animate-pulse-dot" />
          {d.live ? "LIVE" : "CACHED"}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-px bg-accent/15 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.k} className="bg-panel p-5">
            <div className="text-[11px] uppercase tracking-wide text-dim">{s.k}</div>
            <div
              className={`mt-1.5 font-mono text-2xl font-semibold tabular-nums ${
                s.accent ? "text-accent-pale" : "text-ink"
              }`}
            >
              {s.v}
            </div>
            <div className="mt-0.5 text-[11px] text-dim">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3.5">
        <span className="font-mono text-[11px] text-dim">
          Real data · Chain ID 4663 · refreshes every 45s
        </span>
        <a
          href={`${RH_EXPLORER}/token/${VRTN_CONTRACT}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[11px] uppercase tracking-wider text-accent-pale transition-colors hover:text-ink"
        >
          Verify on explorer ↗
        </a>
      </div>
    </div>
  );
}
