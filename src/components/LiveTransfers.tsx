"use client";

import { useEffect, useState } from "react";
import { fetchTransfers, RH_EXPLORER, fmtCompact, type Transfer } from "@/lib/chain";
import { VRTN_CONTRACT, TOKEN_LIVE, FLAP_URL } from "@/lib/market";

/**
 * Live feed of REAL $VRTN transfers on Robinhood Chain, straight from the
 * Blockscout explorer. Not simulated — every row links to the actual on-chain
 * transaction. Refreshes every 30s.
 */

const short = (a: string) => (a ? `${a.slice(0, 6)}…${a.slice(-4)}` : "—");

// pair/token addresses we can label instead of showing a raw hash
const KNOWN: Record<string, string> = {
  "0x1a9b626ba0be56f0cfb3e55d4d0b71c942f0a461": "Liquidity pool",
  [VRTN_CONTRACT.toLowerCase()]: "VRTN contract",
  "0x0000000000000000000000000000000000000000": "Mint / burn",
};
const label = (a: string) => KNOWN[a?.toLowerCase()] ?? short(a);

function ago(ts: string): string {
  if (!ts) return "";
  const then = new Date(ts).getTime();
  if (!Number.isFinite(then)) return "";
  const s = Math.max(0, Math.floor((Date.now() - then) / 1000));
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export function LiveTransfers() {
  const [rows, setRows] = useState<Transfer[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!TOKEN_LIVE) return; // relaunch pending — don't fetch the old token
    let alive = true;
    const load = () =>
      fetchTransfers(8).then((t) => {
        if (alive) {
          setRows(t);
          setLoaded(true);
        }
      });
    load();
    const iv = setInterval(load, 30000);
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
        <div className="mt-4 text-lg font-semibold text-ink">Live transfers go live at the flap.sh relaunch</div>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
          Real on-chain transfers of the new token will stream here — each verifiable on the
          explorer — the moment it launches.
        </p>
        <a href={FLAP_URL} target="_blank" rel="noopener noreferrer" className="btn-gold mt-5 inline-block rounded-xl px-5 py-2.5 text-sm font-semibold">
          Follow on flap.sh ↗
        </a>
      </div>
    );
  }

  return (
    <div className="panel beam overflow-hidden rounded-3xl">
      <div className="flex items-center justify-between gap-3 border-b border-accent/15 px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-xl border border-accent/25 bg-accent/10 text-accent-pale">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M7 7h11M18 7l-3-3M18 7l-3 3M17 17H6M6 17l3-3M6 17l3 3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="text-base font-semibold text-ink">Live $VRTN transfers</span>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 font-mono text-[11px] text-positive">
          <span className="h-1.5 w-1.5 rounded-full bg-positive animate-pulse-dot" />
          {rows.length ? "LIVE" : "…"}
        </span>
      </div>

      <div className="scroll-thin max-h-[360px] overflow-y-auto p-2">
        {!loaded && <div className="p-5 text-sm text-dim">Loading on-chain transfers…</div>}
        {loaded && rows.length === 0 && (
          <div className="p-5 text-sm text-dim">No recent transfers to show right now.</div>
        )}
        {rows.map((r, i) => (
          <a
            key={`${r.tx}-${i}`}
            href={`${RH_EXPLORER}/tx/${r.tx}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-accent/[0.06]"
          >
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-accent/20 bg-accent/[0.06] font-mono text-[10px] text-accent-pale">
              VR
            </span>
            <div className="min-w-0 flex-1">
              <div className="font-mono text-sm font-semibold text-ink">
                {fmtCompact(r.amount)} <span className="text-dim">VRTN</span>
              </div>
              <div className="truncate font-mono text-[11px] text-muted">
                {label(r.from)} <span className="text-dim">→</span> {label(r.to)}
              </div>
            </div>
            <span className="shrink-0 font-mono text-[11px] text-dim">{ago(r.ts)}</span>
          </a>
        ))}
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-accent/15 px-5 py-3">
        <span className="font-mono text-[11px] text-dim">Real transfers · Robinhood Chain · refresh 30s</span>
        <a
          href={`${RH_EXPLORER}/token/${VRTN_CONTRACT}?tab=token_transfers`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[11px] uppercase tracking-wider text-accent-pale transition-colors hover:text-ink"
        >
          All transfers ↗
        </a>
      </div>
    </div>
  );
}
