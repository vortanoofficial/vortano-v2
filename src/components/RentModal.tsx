"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import type { Node } from "@/lib/data";

const GPU_OPTS = [1, 2, 4, 8] as const;
const DURATIONS = [
  { label: "1 hour", hours: 1 },
  { label: "24 hours", hours: 24 },
  { label: "1 week", hours: 168 },
  { label: "1 month", hours: 730 },
] as const;

const FEE = 0.025; // 2.5% protocol fee (whitepaper) — taken from the rate, not added on top

const usd = (n: number) =>
  "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function RentModal({ node, onClose }: { node: Node; onClose: () => void }) {
  const [gpus, setGpus] = useState(1);
  const [dur, setDur] = useState(1); // index into DURATIONS (default 24h)
  const { isConnected } = useAccount();

  const rate = parseFloat(node.price) || 0;
  const hours = DURATIONS[dur].hours;
  const total = rate * gpus * hours; // renter pays the gross rate
  const providerCut = total * (1 - FEE);
  const protocolCut = total * FEE;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Rent ${node.chip}`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="panel beam max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-accent/25 p-6 shadow-2xl sm:rounded-3xl sm:p-7"
      >
        {/* header */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="font-mono text-xs text-dim">{node.arch}</div>
            <div className="mt-0.5 text-xl font-semibold text-ink">{node.chip}</div>
            <div className="mt-0.5 truncate font-mono text-xs text-accent-pale">
              {node.id} · {node.region}
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-accent/15 text-muted transition-colors hover:text-ink"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="mt-3 flex items-baseline gap-1.5">
          <span className="font-mono text-2xl font-semibold text-ink">{node.price}</span>
          <span className="font-mono text-xs text-dim">USDG / GPU·hour</span>
        </div>

        {/* GPU count */}
        <div className="mt-6">
          <div className="mb-2 text-[11px] font-medium uppercase tracking-wider text-dim">GPUs</div>
          <div className="grid grid-cols-4 gap-2">
            {GPU_OPTS.map((g) => (
              <button
                key={g}
                onClick={() => setGpus(g)}
                aria-pressed={gpus === g}
                className={`rounded-xl border py-2.5 font-mono text-sm font-semibold transition-colors ${
                  gpus === g
                    ? "border-accent/60 bg-accent/15 text-accent-pale"
                    : "border-accent/15 bg-accent/[0.04] text-muted hover:border-accent/40 hover:text-ink"
                }`}
              >
                ×{g}
              </button>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div className="mt-5">
          <div className="mb-2 text-[11px] font-medium uppercase tracking-wider text-dim">Duration</div>
          <div className="grid grid-cols-4 gap-2">
            {DURATIONS.map((d, i) => (
              <button
                key={d.label}
                onClick={() => setDur(i)}
                aria-pressed={dur === i}
                className={`rounded-xl border py-2.5 text-center text-[13px] font-semibold transition-colors ${
                  dur === i
                    ? "border-accent/60 bg-accent/15 text-accent-pale"
                    : "border-accent/15 bg-accent/[0.04] text-muted hover:border-accent/40 hover:text-ink"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Cost breakdown */}
        <div className="mt-6 rounded-2xl border border-accent/20 bg-black/30 p-4">
          <dl className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-muted">Rate</dt>
              <dd className="font-mono text-ink">
                {node.price} × {gpus} GPU × {hours}h
              </dd>
            </div>
            <div className="flex items-center justify-between text-xs text-dim">
              <dt>Protocol fee (2.5%)</dt>
              <dd className="font-mono">{usd(protocolCut)}</dd>
            </div>
            <div className="flex items-center justify-between text-xs text-dim">
              <dt>To provider</dt>
              <dd className="font-mono">{usd(providerCut)}</dd>
            </div>
            <div className="mt-1 flex items-center justify-between border-t border-accent/15 pt-2.5">
              <dt className="font-semibold text-ink">You pay</dt>
              <dd className="font-mono text-2xl font-semibold text-accent-pale">{usd(total)}</dd>
            </div>
          </dl>
          <div className="mt-1.5 text-right font-mono text-[11px] text-dim">settled in USDG</div>
        </div>

        {/* CTA — honest: this is a preview, real rental needs a wallet + mainnet */}
        <button
          className="btn-gold mt-5 w-full rounded-2xl py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5"
          onClick={onClose}
        >
          {isConnected ? "Reserve this node" : "Connect wallet to rent"}
        </button>
        <p className="mt-3 text-[11px] leading-relaxed text-dim">
          Preview — rentals go live with mainnet. Every job streams payment per-second from
          escrow and settles on Robinhood Chain; the provider is slashing-bonded against downtime.
        </p>
      </div>
    </div>
  );
}
