"use client";

import { useState } from "react";
import { useMarket } from "./MarketProvider";

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
const BOND_USD = 200; // ~$200 of VRTN per accelerator (whitepaper)
const STEPS = ["Hardware", "Install", "Floor price", "Go live"];

const usd = (n: number) => "$" + Math.round(n).toLocaleString("en-US");
const compact = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(2)}M` : n >= 1_000 ? `${(n / 1_000).toFixed(0)}K` : `${Math.round(n)}`;

export function ProviderOnboarding() {
  const m = useMarket();
  const [step, setStep] = useState(0);
  const [gpu, setGpu] = useState(3); // H100 SXM5
  const [count, setCount] = useState(2);
  const [floorPct, setFloorPct] = useState(80); // % of market rate
  const [copied, setCopied] = useState(false);

  const g = GPUS[gpu];
  const bondUsd = BOND_USD * count;
  const bondVrtn = m.vrtn.price > 0 ? bondUsd / m.vrtn.price : 0;
  const floorRate = g.rate * (floorPct / 100);
  // lower floor → you accept more jobs; a simple, clearly-labelled heuristic
  const estUtil = Math.max(35, Math.min(94, 130 - floorPct * 0.62));
  const monthly = g.rate * HOURS_PER_MONTH * count * (estUtil / 100) * (1 - FEE);

  const cmd = "curl -sSL vortano.ai/agent | sh";
  const copy = () => {
    navigator.clipboard?.writeText(cmd).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  };

  return (
    <div className="panel beam rounded-3xl p-7">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-xl font-semibold text-ink">Onboard in four steps.</h3>
        <span className="shrink-0 rounded-full border border-accent/25 bg-accent/[0.06] px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-accent-pale">
          Step {step + 1}/4
        </span>
      </div>

      {/* progress rail */}
      <div className="mt-4 flex items-center gap-1.5">
        {STEPS.map((s, i) => (
          <button
            key={s}
            onClick={() => setStep(i)}
            aria-current={i === step}
            className="group min-w-0 flex-1 text-left"
          >
            <div
              className={`h-1.5 rounded-full transition-colors ${
                i <= step ? "bg-accent" : "bg-accent/15"
              }`}
            />
            <div
              className={`mt-1.5 truncate text-[10px] font-medium transition-colors ${
                i <= step ? "text-accent-pale" : "text-dim"
              }`}
            >
              {s}
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6 min-h-[228px]">
        {/* ---------- 1. hardware ---------- */}
        {step === 0 && (
          <div>
            <div className="text-[11px] font-medium uppercase tracking-wider text-dim">Your accelerator</div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {GPUS.map((x, i) => (
                <button
                  key={x.name}
                  onClick={() => setGpu(i)}
                  className={`rounded-lg border px-2.5 py-1.5 text-[12px] font-medium transition-colors ${
                    i === gpu
                      ? "border-accent/60 bg-accent/15 text-accent-pale"
                      : "border-accent/15 bg-accent/[0.04] text-muted hover:border-accent/40 hover:text-ink"
                  }`}
                >
                  {x.name}
                </button>
              ))}
            </div>

            <div className="mt-5 flex items-center justify-between text-sm">
              <span className="text-muted">How many?</span>
              <span className="font-mono text-ink">
                {count} × <span className="text-accent-pale">{g.name}</span>
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={16}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="mt-2 w-full accent-[#C9A24B]"
              aria-label="Number of accelerators"
            />

            <div className="mt-5 rounded-2xl border border-accent/20 bg-black/30 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted">Bond required</span>
                <span className="font-mono text-ink">{usd(bondUsd)}</span>
              </div>
              <div className="mt-1 flex items-center justify-between text-xs text-dim">
                <span>≈ in $VRTN at live price</span>
                <span className="font-mono">{compact(bondVrtn)} VRTN</span>
              </div>
              <p className="mt-2.5 text-[11px] leading-relaxed text-dim">
                ~$200 per accelerator, returned when you exit the network gracefully. It&apos;s
                collateral — downtime or bad output slashes it.
              </p>
            </div>
          </div>
        )}

        {/* ---------- 2. install ---------- */}
        {step === 1 && (
          <div>
            <div className="text-[11px] font-medium uppercase tracking-wider text-dim">
              Run this on your machine
            </div>
            <div className="mt-2 flex items-center gap-2 rounded-xl border border-accent/20 bg-black/50 px-3 py-3">
              <span className="font-mono text-[11px] text-accent-pale">$</span>
              <code className="min-w-0 flex-1 truncate font-mono text-[13px] text-ink">{cmd}</code>
              <button
                onClick={copy}
                className="shrink-0 rounded-lg border border-accent/25 px-2.5 py-1 text-[11px] font-medium text-accent-pale transition-colors hover:border-accent/50 hover:text-ink"
              >
                {copied ? "Copied ✓" : "Copy"}
              </button>
            </div>
            <ul className="mt-5 space-y-3 text-sm text-muted">
              {[
                "Runs in a container, fully isolated from your host.",
                "Auto-detects your accelerators and benchmarks them.",
                "No KYC for nodes under 100 TFLOPs aggregate.",
              ].map((t) => (
                <li key={t} className="flex gap-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span className="leading-relaxed">{t}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ---------- 3. floor price ---------- */}
        {step === 2 && (
          <div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">Your refusal price</span>
              <span className="font-mono text-ink">
                {floorRate.toFixed(2)} <span className="text-dim">USDG/hr</span>
              </span>
            </div>
            <input
              type="range"
              min={50}
              max={110}
              value={floorPct}
              onChange={(e) => setFloorPct(Number(e.target.value))}
              className="mt-2 w-full accent-[#C9A24B]"
              aria-label="Floor price as percent of market rate"
            />
            <div className="mt-1 flex justify-between font-mono text-[10px] text-dim">
              <span>50% of market</span>
              <span>market {g.rate.toFixed(2)}</span>
              <span>110%</span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-accent/20 bg-black/30 p-4">
                <div className="text-[10px] uppercase tracking-wide text-dim">Est. utilization</div>
                <div className="mt-1 font-mono text-2xl font-semibold text-ink">{Math.round(estUtil)}%</div>
              </div>
              <div className="rounded-2xl border border-accent/20 bg-black/30 p-4">
                <div className="text-[10px] uppercase tracking-wide text-dim">Est. monthly</div>
                <div className="mt-1 font-mono text-2xl font-semibold text-accent-pale">{usd(monthly)}</div>
              </div>
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-dim">
              The market discovers price — this is the threshold below which your node refuses
              jobs. Utilization is a rough model, not a forecast.
            </p>
          </div>
        )}

        {/* ---------- 4. go live ---------- */}
        {step === 3 && (
          <div>
            <div className="rounded-2xl border border-accent/25 bg-accent/[0.08] p-5">
              <div className="text-xs uppercase tracking-wide text-dim">Your node, summarised</div>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-muted">Hardware</dt>
                  <dd className="font-mono text-ink">
                    {count} × {g.name}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted">Bond locked</dt>
                  <dd className="font-mono text-ink">
                    {usd(bondUsd)} <span className="text-dim">({compact(bondVrtn)} VRTN)</span>
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted">Floor price</dt>
                  <dd className="font-mono text-ink">{floorRate.toFixed(2)} USDG/hr</dd>
                </div>
                <div className="flex items-center justify-between border-t border-accent/15 pt-2.5">
                  <dt className="font-semibold text-ink">Est. monthly revenue</dt>
                  <dd className="font-mono text-xl font-semibold text-accent-pale">{usd(monthly)}</dd>
                </div>
              </dl>
              <div className="mt-1.5 text-right font-mono text-[11px] text-dim">
                streamed in USDG, after the 2.5% fee
              </div>
            </div>
            <button className="btn-gold mt-4 w-full rounded-2xl py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5">
              Join the provider waitlist
            </button>
            <p className="mt-2.5 text-[11px] leading-relaxed text-dim">
              Estimate only — revenue depends on real demand, your uptime and the price you set.
              Not a guarantee of income. Provider onboarding opens with mainnet.
            </p>
          </div>
        )}
      </div>

      {/* nav */}
      <div className="mt-5 flex items-center justify-between gap-3">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="rounded-xl border border-accent/15 px-4 py-2 text-sm font-medium text-muted transition-colors hover:text-ink disabled:opacity-40"
        >
          Back
        </button>
        <button
          onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
          disabled={step === STEPS.length - 1}
          className="btn-gold rounded-xl px-5 py-2 text-sm font-semibold transition-transform hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0"
        >
          Next step
        </button>
      </div>
    </div>
  );
}
