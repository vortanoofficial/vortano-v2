"use client";

import { useState } from "react";

/**
 * Compose an on-chain agent: role → hardware → guardrails → spec.
 * Every number here is an estimate derived from the same marketplace rates the
 * rest of the site uses. Deployment opens with mainnet — labelled as a preview.
 */

const ROLES = [
  {
    key: "Trader",
    desc: "Watches markets and executes swaps inside your caps.",
    model: "Llama-3.1-70B",
    gpu: 2, // index into HW
  },
  {
    key: "Researcher",
    desc: "Reads sources, summarises and reports on a schedule.",
    model: "Mixtral-8x22B",
    gpu: 1,
  },
  {
    key: "Compute ops",
    desc: "Rents GPUs when prices dip and babysits your jobs.",
    model: "Qwen-2.5-32B",
    gpu: 0,
  },
  {
    key: "Support",
    desc: "Answers from your docs — like TANO does for Vortano.",
    model: "Llama-3.1-8B",
    gpu: 0,
  },
] as const;

const HW = [
  { name: "RTX 4090", rate: 0.41 },
  { name: "L40S", rate: 0.92 },
  { name: "A100 80GB", rate: 1.42 },
  { name: "H100 SXM5", rate: 2.18 },
];

const usd = (n: number) =>
  "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function AgentBuilder() {
  const [name, setName] = useState("orion-01");
  const [role, setRole] = useState(0);
  const [gpu, setGpu] = useState<number | null>(null); // null → follow the role's suggestion
  const [hours, setHours] = useState(6); // active hours/day
  const [cap, setCap] = useState(250); // USDG/day spend cap

  const r = ROLES[role];
  const hwIdx = gpu ?? r.gpu;
  const hw = HW[hwIdx];
  const daily = hw.rate * hours;
  const monthly = daily * 30.4;

  const slug =
    (name.trim() || "agent")
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-") // collapse runs of junk into a single dash
      .replace(/^-+|-+$/g, "")
      .slice(0, 20) || "agent";

  return (
    <div className="panel beam overflow-hidden rounded-3xl">
      <div className="flex items-center justify-between gap-3 border-b border-accent/15 px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-xl border border-accent/25 bg-accent/10 text-accent-pale">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="4" y="8" width="16" height="12" rx="4" />
              <path d="M12 8V4" strokeLinecap="round" />
              <circle cx="9.5" cy="14" r="1.2" fill="currentColor" />
              <circle cx="14.5" cy="14" r="1.2" fill="currentColor" />
            </svg>
          </span>
          <span className="text-base font-semibold text-ink">Agent builder</span>
        </div>
        <span className="shrink-0 rounded-full border border-accent/25 bg-accent/[0.06] px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-accent-pale">
          Preview
        </span>
      </div>

      <div className="grid gap-6 p-6 lg:grid-cols-[1.1fr_1fr]">
        {/* ---------------- config ---------------- */}
        <div className="min-w-0">
          <label className="text-[11px] font-medium uppercase tracking-wider text-dim" htmlFor="agent-name">
            Agent name
          </label>
          <div className="mt-2 flex items-center gap-2 rounded-xl border border-accent/20 bg-black/40 px-3 py-2.5">
            <span className="font-mono text-[11px] text-accent-pale">@</span>
            <input
              id="agent-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={20}
              className="min-w-0 flex-1 bg-transparent font-mono text-sm text-ink placeholder:text-dim focus:outline-none"
              placeholder="orion-01"
            />
          </div>

          <div className="mt-5 text-[11px] font-medium uppercase tracking-wider text-dim">What should it do?</div>
          <div className="mt-2 grid grid-cols-2 gap-1.5">
            {ROLES.map((x, i) => (
              <button
                key={x.key}
                onClick={() => {
                  setRole(i);
                  setGpu(null);
                }}
                aria-pressed={role === i}
                className={`rounded-xl border px-3 py-2 text-left text-[13px] font-semibold transition-colors ${
                  role === i
                    ? "border-accent/60 bg-accent/15 text-accent-pale"
                    : "border-accent/15 bg-accent/[0.04] text-muted hover:border-accent/40 hover:text-ink"
                }`}
              >
                {x.key}
              </button>
            ))}
          </div>
          <p className="mt-2.5 text-[12px] leading-relaxed text-muted">{r.desc}</p>

          <div className="mt-5 text-[11px] font-medium uppercase tracking-wider text-dim">Runs on</div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {HW.map((h, i) => (
              <button
                key={h.name}
                onClick={() => setGpu(i)}
                className={`rounded-lg border px-2.5 py-1.5 text-[12px] font-medium transition-colors ${
                  i === hwIdx
                    ? "border-accent/60 bg-accent/15 text-accent-pale"
                    : "border-accent/15 bg-accent/[0.04] text-muted hover:border-accent/40 hover:text-ink"
                }`}
              >
                {h.name}
              </button>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between text-sm">
            <span className="text-muted">Active hours / day</span>
            <span className="font-mono text-ink">{hours}h</span>
          </div>
          <input
            type="range"
            min={1}
            max={24}
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            className="mt-2 w-full accent-[#C9A24B]"
            aria-label="Active hours per day"
          />

          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-muted">Daily spend cap</span>
            <span className="font-mono text-ink">{cap} USDG</span>
          </div>
          <input
            type="range"
            min={25}
            max={2000}
            step={25}
            value={cap}
            onChange={(e) => setCap(Number(e.target.value))}
            className="mt-2 w-full accent-[#C9A24B]"
            aria-label="Daily spend cap in USDG"
          />
        </div>

        {/* ---------------- generated spec ---------------- */}
        <div className="min-w-0">
          <div className="rounded-2xl border border-accent/20 bg-black/40 p-4 font-mono text-[12px] leading-relaxed">
            <div className="mb-2 flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-dim">
              <span className="h-1.5 w-1.5 rounded-full bg-positive animate-pulse-dot" />
              agent.spec
            </div>
            <div className="space-y-1">
              <div>
                <span className="text-dim">name:</span> <span className="text-accent-pale">{slug}</span>
              </div>
              <div>
                <span className="text-dim">role:</span> <span className="text-ink">{r.key}</span>
              </div>
              <div>
                <span className="text-dim">model:</span> <span className="text-ink">{r.model}</span>
              </div>
              <div>
                <span className="text-dim">runtime:</span> <span className="text-ink">{hw.name}</span>
              </div>
              <div>
                <span className="text-dim">uptime:</span> <span className="text-ink">{hours}h/day</span>
              </div>
              <div>
                <span className="text-dim">spend_cap:</span> <span className="text-ink">{cap} USDG/day</span>
              </div>
              <div>
                <span className="text-dim">keys:</span>{" "}
                <span className="text-ink">session · allowlisted · revocable</span>
              </div>
              <div>
                <span className="text-dim">settles:</span> <span className="text-ink">USDG · Robinhood Chain</span>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-accent/25 bg-accent/[0.08] p-5">
            <div className="text-xs uppercase tracking-wide text-dim">Est. compute cost</div>
            <div className="mt-1 font-mono text-3xl font-semibold text-accent-pale">
              {usd(monthly)}
              <span className="ml-1.5 text-sm text-dim">/ month</span>
            </div>
            <div className="mt-1 font-mono text-xs text-muted">
              {usd(daily)}/day · {hw.rate} USDG/hr × {hours}h
            </div>
          </div>

          <button className="btn-gold mt-4 w-full rounded-2xl py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5">
            Deploy {slug}
          </button>
          <p className="mt-3 text-[11px] leading-relaxed text-dim">
            Preview — agent deployment opens with mainnet. Your seed phrase never signs: agents
            run on capped, allowlisted, revocable session keys you can kill at any time. Cost is
            an estimate at current marketplace rates.
          </p>
        </div>
      </div>
    </div>
  );
}
