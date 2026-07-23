"use client";

import { useEffect, useRef, useState } from "react";
import { SectionHeader } from "./SectionHeader";
import { Reveal } from "./Reveal";
import { NODES, CHAIN } from "@/lib/data";

type Line = { kind: "in" | "out" | "sys"; text: string };

const PROMPT = "vortano@robinhood-chain:~$";

const BANNER: Line[] = [
  { kind: "sys", text: `Vortano CLI v0.4.2 — connected to robinhood-chain-mainnet · block ${CHAIN.block}` },
  { kind: "sys", text: "Type `help` for commands. ↑/↓ navigates history. Try `ls gpu` or `deploy llama-3`." },
];

const QUICK = ["help", "ls gpu", "whoami", "rent g1 -h 4", "deploy llama-3", "status", "gas", "clear"];

function runCommand(raw: string): Line[] | "clear" {
  const cmd = raw.trim();
  const [base, ...args] = cmd.split(/\s+/);
  switch (base) {
    case "":
      return [];
    case "clear":
      return "clear";
    case "help":
      return [
        { kind: "out", text: "Available commands:" },
        { kind: "out", text: "  ls gpu            list available accelerators" },
        { kind: "out", text: "  rent <id> -h <n>  rent a node for n hours" },
        { kind: "out", text: "  deploy <model>    deploy a model to the mesh" },
        { kind: "out", text: "  status            network + wallet status" },
        { kind: "out", text: "  whoami            show connected wallet" },
        { kind: "out", text: "  gas               current Robinhood Chain gas" },
        { kind: "out", text: "  clear             clear the screen" },
      ];
    case "ls": {
      if (args[0] === "gpu" || args.length === 0) {
        const head = "  ID              CHIP                 $/hr    STATUS";
        const rows = NODES.map(
          (n) =>
            `  ${n.id.padEnd(15)} ${n.chip.padEnd(20)} ${n.price.padEnd(7)} ${n.status}`,
        );
        return [{ kind: "out", text: head }, ...rows.map((r) => ({ kind: "out" as const, text: r }))];
      }
      return [{ kind: "out", text: `ls: unknown resource '${args[0]}'` }];
    }
    case "whoami":
      return [
        { kind: "out", text: "0x7Ae…3f9C · connected via EIP-6963 (Robinhood Wallet)" },
        { kind: "out", text: "balance: 980.00 USDG · 1,240.55 USDC · 84.20 VRTN · 0.91 ETH" },
      ];
    case "gas":
      return [{ kind: "out", text: `Robinhood Chain · base fee ${CHAIN.gas} · priority 0.001 gwei · block ${CHAIN.block}` }];
    case "status":
      return [
        { kind: "out", text: "network   ● online   · 14,832 nodes · 2,418 PFLOPs" },
        { kind: "out", text: "jobs      3,418 in flight · 1.2M settled (30d)" },
        { kind: "out", text: "wallet    connected · escrow 250.00 USDG" },
      ];
    case "rent": {
      const id = args[0] ?? "g1";
      const node = NODES.find((n) => n.id.startsWith(id)) ?? NODES[0];
      const hIdx = args.indexOf("-h");
      const hours = hIdx >= 0 ? Number(args[hIdx + 1]) || 4 : 4;
      const cost = (Number(node.price) * hours).toFixed(2);
      return [
        { kind: "out", text: `→ reserving ${node.id} (${node.chip}) for ${hours}h …` },
        { kind: "out", text: `→ escrow locked: ${cost} USDG · streaming per-second` },
        { kind: "sys", text: `✓ rental active · receipt settles on ${CHAIN.explorer}` },
      ];
    }
    case "deploy": {
      const model = args[0] ?? "llama-3";
      return [
        { kind: "out", text: `→ scheduling ${model} on 2× H100 SXM5 …` },
        { kind: "out", text: "→ pulling weights · warming kv-cache · 128k ctx" },
        { kind: "sys", text: `✓ ${model} live · endpoint https://mesh.vortano.org/${model}` },
      ];
    }
    default:
      return [{ kind: "out", text: `command not found: ${base} — try \`help\`` }];
  }
}

export function ShellTerminal() {
  const [lines, setLines] = useState<Line[]>(BANNER);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [hIndex, setHIndex] = useState(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines]);

  const submit = (raw: string) => {
    const result = runCommand(raw);
    setHistory((h) => (raw.trim() ? [raw, ...h] : h));
    setHIndex(-1);
    setValue("");
    if (result === "clear") {
      setLines(BANNER);
      return;
    }
    setLines((prev) => [...prev, { kind: "in", text: raw }, ...result]);
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") submit(value);
    else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length) {
        const ni = Math.min(hIndex + 1, history.length - 1);
        setHIndex(ni);
        setValue(history[ni]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const ni = Math.max(hIndex - 1, -1);
      setHIndex(ni);
      setValue(ni === -1 ? "" : history[ni]);
    }
  };

  return (
    <section id="shell" className="relative border-y border-accent/15 bg-bg-soft/50">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
        <SectionHeader index="06" eyebrow="Live Shell Terminal" title={<>The cockpit for the <em>on-chain AI economy.</em></>}>
          A live, in-browser command interface to the network via the{" "}
          <strong className="font-bold text-ink">voltra CLI</strong>.
          Spin up models, deploy agents, run inference and stream payments — all
          from a single pane of glass.
        </SectionHeader>

        <div className="mt-10 grid gap-5 lg:grid-cols-[1.55fr_1fr]">
          {/* Terminal */}
          <Reveal>
            <div
              className="panel beam overflow-hidden rounded-3xl"
              onClick={() => inputRef.current?.focus()}
            >
              <div className="flex items-center justify-between border-b border-accent/15 px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-negative/70" />
                  <span className="h-3 w-3 rounded-full bg-[#f5c451]/70" />
                  <span className="h-3 w-3 rounded-full bg-positive/70" />
                  <span className="ml-3 font-mono text-xs text-dim">
                    ~/vortano · zsh — vortano-cli v0.4.2
                  </span>
                </div>
                <span className="rounded border border-accent/20 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-dim">
                  Sandbox
                </span>
              </div>

              <div ref={scrollRef} className="scroll-thin h-[360px] overflow-y-auto p-4 font-mono text-[13px] leading-relaxed">
                {lines.map((l, i) => (
                  <div
                    key={i}
                    className={
                      l.kind === "in"
                        ? "text-ink"
                        : l.kind === "sys"
                        ? "text-accent-pale"
                        : "whitespace-pre text-muted"
                    }
                  >
                    {l.kind === "in" ? (
                      <>
                        <span className="text-positive">{PROMPT}</span> {l.text}
                      </>
                    ) : (
                      l.text
                    )}
                  </div>
                ))}

                {/* Active input line */}
                <div className="flex items-center text-ink">
                  <span className="text-positive">{PROMPT}</span>
                  <span className="ml-2 flex-1">
                    {value}
                    <span className="ml-0.5 inline-block h-4 w-2 -translate-y-px bg-accent-light align-middle animate-blink" />
                  </span>
                </div>
                <input
                  ref={inputRef}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={onKey}
                  spellCheck={false}
                  autoComplete="off"
                  className="sr-only"
                  aria-label="Terminal input"
                />
              </div>
            </div>
          </Reveal>

          {/* Quick commands + install */}
          <div className="flex flex-col gap-5">
            <Reveal delay={0.08}>
              <div className="panel rounded-3xl p-6">
                <div className="eyebrow">Quick commands</div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {QUICK.map((q) => (
                    <button
                      key={q}
                      onClick={() => submit(q)}
                      className="rounded-lg border border-accent/20 bg-accent/[0.05] px-3 py-1.5 font-mono text-xs text-muted transition-colors hover:border-accent/50 hover:text-ink"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.14}>
              <div className="panel rounded-3xl p-6">
                <div className="eyebrow">Install on your machine</div>
                <div className="mt-4 flex items-center justify-between rounded-lg border border-accent/20 bg-black/40 px-4 py-3 font-mono text-sm">
                  <span className="text-accent-pale">curl vortano.org | sh</span>
                  <span className="text-dim">copy</span>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted">
                  macOS · Linux · WSL2. Auto-detects your wallet via EIP-6963. No
                  daemon — single 4.2MB binary.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
