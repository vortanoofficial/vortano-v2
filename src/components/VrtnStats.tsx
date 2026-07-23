"use client";

import { useState } from "react";
import { useMarket } from "./MarketProvider";
import { fmtPrice, fmtCompact, fmtPct, VRTN_PAIR, VRTN_CONTRACT } from "@/lib/market";

export function VrtnStats() {
  const m = useMarket();
  const v = m.vrtn;
  const up = v.change24h >= 0;
  const [full, setFull] = useState(false);

  const stats = [
    ["Volume 24h", fmtCompact(v.volume24h)],
    ["Liquidity", fmtCompact(v.liquidity)],
    ["Market cap", fmtCompact(v.mcap)],
    ["Txns 24h", v.txns24h.toLocaleString("en-US")],
  ];

  return (
    <div>
      {/* price + change */}
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-dim">
            VRTN / VIRTUAL
            <span className="inline-flex items-center gap-1 text-positive">
              <span className="h-1 w-1 rounded-full bg-positive animate-pulse-dot" />
              {m.live ? "live" : "cached"}
            </span>
          </div>
          <div className="mt-1 font-mono text-3xl font-semibold text-ink sm:text-4xl">
            {fmtPrice(v.price)}
          </div>
        </div>
        <span
          className={`rounded-lg px-2.5 py-1 font-mono text-sm font-semibold ${
            up ? "bg-positive/12 text-positive" : "bg-negative/12 text-negative"
          }`}
        >
          {up ? "▲" : "▼"} {fmtPct(v.change24h)}
        </span>
      </div>

      {/* mini chart with expand / minimize toggle */}
      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-wide text-dim">Price chart</span>
          <button
            onClick={() => setFull((f) => !f)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-accent/25 bg-accent/[0.06] px-2.5 py-1 text-[11px] font-medium text-accent-pale transition-colors hover:border-accent/50 hover:text-ink"
            aria-expanded={full}
          >
            {full ? (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 9L4 4m0 5V4h5M15 15l5 5m0-5v5h-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Minimize
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Expand chart
              </>
            )}
          </button>
        </div>
        <div
          className={`mx-auto overflow-hidden rounded-2xl border border-accent/20 bg-black/40 shadow-[0_14px_36px_-22px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.05)] transition-all duration-300 ${
            full ? "h-[440px] w-full" : "h-[210px] w-full max-w-[280px]"
          }`}
        >
          <iframe
            src={`https://dexscreener.com/robinhood/${VRTN_PAIR}?embed=1&theme=dark&trades=0&info=0&tabs=0&chartLeftToolbar=0&chartTheme=dark&chartType=usd&interval=15`}
            title="VRTN price chart"
            loading="lazy"
            className="h-full w-full border-0"
          />
        </div>
      </div>

      {/* stat grid */}
      <div className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-accent/15 bg-accent/15 sm:grid-cols-4">
        {stats.map(([k, val]) => (
          <div key={k} className="bg-panel p-3.5">
            <div className="text-[10px] uppercase tracking-wide text-dim">{k}</div>
            <div className="mt-1 font-mono text-sm font-semibold text-ink">{val}</div>
          </div>
        ))}
      </div>

      {/* real contract */}
      <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-accent/15 bg-black/40 px-3.5 py-2.5">
        <span className="min-w-0 flex-1 truncate font-robo text-xs tracking-wide text-accent-pale">{VRTN_CONTRACT}</span>
        <a
          href={`https://dexscreener.com/robinhood/${VRTN_PAIR}`}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 font-mono text-[11px] uppercase tracking-wider text-dim transition-colors hover:text-accent-pale"
        >
          Dexscreener ↗
        </a>
      </div>
    </div>
  );
}
