"use client";

import { useEffect, useRef, useState } from "react";
import { SectionHeader } from "./SectionHeader";
import { Reveal } from "./Reveal";
import { LiveBars } from "./LiveBars";
import { LiveNumber } from "./LiveNumber";
import { LOG_NODES, LOG_KINDS, LOG_AMOUNTS, type LogKind } from "@/lib/data";

type Row = { t: string; kind: LogKind; node: string; amt: string; id: number };

const kindColor: Record<LogKind, string> = {
  SETTLE: "text-positive",
  RENT: "text-accent-light",
  BOND: "text-accent-pale",
  DEPLOY: "text-chrome",
  STREAM: "text-accent",
};

let counter = 0;

function clock(offsetSec: number) {
  // Build a HH:MM:SS string counting down from a fixed anchor so SSR/CSR agree
  const base = 2 * 3600 + 24 * 60 + 13; // 02:24:13
  const total = ((base - offsetSec) % 86400 + 86400) % 86400;
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}

function makeRow(offset: number, seed: number): Row {
  const kind = LOG_KINDS[seed % LOG_KINDS.length];
  const node = LOG_NODES[(seed * 7 + 3) % LOG_NODES.length];
  const amt = LOG_AMOUNTS[(seed * 3 + 1) % LOG_AMOUNTS.length];
  return { t: clock(offset), kind, node, amt, id: counter++ };
}

const INITIAL: Row[] = Array.from({ length: 14 }, (_, i) => makeRow(i * 2, i));

export function NetworkPulse() {
  const [rows, setRows] = useState<Row[]>(INITIAL);
  const tick = useRef(0);

  useEffect(() => {
    const iv = setInterval(() => {
      tick.current += 1;
      setRows((prev) => {
        const next = makeRow(-tick.current * 2, tick.current * 13 + 5);
        return [next, ...prev].slice(0, 14);
      });
    }, 1600);
    return () => clearInterval(iv);
  }, []);

  return (
    <section id="dashboard" className="relative border-y border-accent/15 bg-bg-soft/50">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
        <SectionHeader index="03" eyebrow="Network Pulse" title={<>Every job, <em>on-chain &amp; visible.</em></>}>
          Job intents, agent transactions, payment streams and slashings stream
          live from Robinhood Chain. Every output cryptographically attributable —
          verify any settlement on Robinscan.
        </SectionHeader>

        <div className="mt-10 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
          {/* Live log */}
          <Reveal>
            <div className="panel beam overflow-hidden rounded-3xl">
              <div className="flex items-center justify-between border-b border-accent/15 px-4 py-3">
                <span className="font-mono text-xs text-dim">
                  ~/vortano/network.log — robinhood-chain/mainnet
                </span>
                <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-positive">
                  <span className="h-1.5 w-1.5 rounded-full bg-positive animate-pulse-dot" />
                  LIVE
                </span>
              </div>
              <div className="scroll-thin max-h-[380px] overflow-hidden p-2 font-mono text-sm">
                {rows.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center gap-4 rounded-lg px-3 py-2 transition-colors hover:bg-accent/[0.06]"
                  >
                    <span className="text-dim">{r.t}</span>
                    <span className={`w-16 font-semibold ${kindColor[r.kind]}`}>{r.kind}</span>
                    <span className="min-w-0 flex-1 truncate text-muted">{r.node}</span>
                    <span className="text-ink">{r.amt} ETH</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Side stats */}
          <div className="flex flex-col gap-5">
            <Reveal delay={0.08}>
              <div className="panel rounded-3xl p-6">
                <div className="text-xs uppercase tracking-wide text-dim">Jobs in flight</div>
                <div className="mt-2 font-mono text-4xl font-semibold text-ink">
                  <LiveNumber base={3418} drift={14} intervalMs={1500} />
                </div>
                <div className="mt-1 text-sm text-positive">↑ 12.4% · last 24h</div>
              </div>
            </Reveal>
            <Reveal delay={0.14}>
              <div className="panel rounded-3xl p-6">
                <div className="text-xs uppercase tracking-wide text-dim">Network throughput</div>
                <div className="mt-3">
                  <LiveBars bars={18} intensity={0.9} height={72} />
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="panel rounded-3xl p-6">
                <div className="text-xs uppercase tracking-wide text-dim">USDG streamed today</div>
                <div className="mt-2 font-mono text-4xl font-semibold text-ink">
                  <LiveNumber base={184720} mode="climb" step={38} prefix="$" intervalMs={1000} />
                </div>
                <div className="mt-1 text-sm text-muted">across 947 active rentals</div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
