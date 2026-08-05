"use client";

import { useEffect, useRef, useState } from "react";

type Msg = { id: string; from: "tano" | "you"; text: string };

/**
 * TANO's knowledge is sourced straight from the whitepaper / platformpaper so the
 * agent can never contradict them. Keep answers factual; never invent numbers.
 */
const KB: { match: RegExp; answer: string }[] = [
  {
    match: /\b(price|cost|rate|how much).*(h100|gpu|rent|compute)|\b(h100|gpu)\b.*(price|cost|rate)/i,
    answer:
      "Renting is per-second from escrow. An H100 SXM5 is 2.18 USDG per GPU-hour — roughly 5–10× below hyperscaler list pricing. An RTX 4090 is 0.41, an H200 NVL is 3.10.",
  },
  {
    match: /\b(earn|income|revenue|provider|provide|my gpu|make money)\b/i,
    answer:
      "Provide idle silicon and earn USDG. Install the containerized agent, post a VRTN bond (~$200 per accelerator) and set a refusal price. Revenue streams to your wallet every block. An H100 earns roughly $1,210/month at 78% utilization, after the 2.5% protocol fee. Try the live calculator in the Provider section — it's an estimate, not a guarantee.",
  },
  {
    match: /\b(stak|apy|yield|reward)\b/i,
    answer:
      "Stake $VRTN and you earn a slice of every rental — protocol revenue settled in USDG, streamed in real time. The preview shows 12.5% flexible, 18.4% for a 30-day lock, 26.8% for 90 days. Those are estimates that move with network demand and total staked, not guarantees.",
  },
  {
    match: /\b(vrtn|token|tokenomic|supply|distribution)\b/i,
    answer:
      "$VRTN is the coordination asset: it settles jobs, bonds every provider, governs protocol parameters, and shares protocol revenue with stakers. ERC-20, 18 decimals, 1.0B total supply, on Robinhood Chain. Vortano is relaunching on flap.sh — every existing holder receives the new token 1:1 via a snapshot airdrop, no action required.",
  },
  {
    match: /\b(fee|commission|cut)\b/i,
    answer: "The protocol fee is a transparent 2.5%. Everything else goes to the provider.",
  },
  {
    match: /\b(wallet|swap|schedule|talk)\b/i,
    answer:
      "The Vortano AI Wallet is self-custodial and you can just talk to it — say “every day at 20:00, swap $500 USDG → VRTN” and it schedules and executes it. Capped, allowlisted, revocable session keys do the signing; your seed phrase never signs a bot.",
  },
  {
    match: /\b(usdg|stablecoin|settle|payment)\b/i,
    answer:
      "Everything settles in USDG — the Global Dollar, native to the Robinhood ecosystem. USDC and ETH work too via auto-swap at checkout.",
  },
  {
    match: /\b(robinhood|chain|network|mainnet)\b/i,
    answer:
      "Vortano is built on Robinhood Chain. We're committed to it long term — helping make it the home of real-world assets, starting with the most valuable RWA of the AI age: compute itself.",
  },
  {
    match: /\b(safe|secur|slash|bond|trust|audit)\b/i,
    answer:
      "Providers post a VRTN bond as collateral. Downtime or fraudulent output slashes it, so dishonesty is economically irrational. Job intents, payment streams and slashings are auditable on-chain by anyone.",
  },
  {
    match: /\b(model|inference|train|agent|ai)\b/i,
    answer:
      "The Model Suite runs on decentralized compute: text generation, image synthesis, autonomous agents and an AI-native OS. Autonomous on-chain agents and the AI-native OS are on the roadmap — shipped items are listed in the whitepaper.",
  },
  {
    match: /\b(who are you|what are you|your name|tano)\b/i,
    answer:
      "I'm TANO, Vortano's on-chain agent. I'm the friendly front door today — a full AI assistant for your compute, swaps and agents is what we're building toward. Connect your wallet and I'll get a look that's uniquely yours.",
  },
  {
    match: /\b(hi|hello|hey|gm|halo)\b/i,
    answer: "Hey! 👋 Ask me about renting compute, earning as a provider, staking $VRTN, or the AI Wallet.",
  },
];

const FALLBACK =
  "I don't have a confident answer for that yet. Try asking about renting compute, earning as a provider, staking $VRTN, the AI Wallet, or fees — or read the whitepaper on the site.";

const SUGGESTIONS = ["How much can I earn?", "What is $VRTN?", "H100 price?", "How does staking work?"];

let uid = 0;
const nid = () => `m${Date.now()}-${uid++}`;

function answerFor(q: string) {
  const hit = KB.find((k) => k.match.test(q));
  return hit ? hit.answer : FALLBACK;
}

export function TanoChat() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { id: "seed", from: "tano", text: "Hi, I'm TANO 👋 Ask me anything about Vortano." },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "nearest" });
  }, [msgs, typing]);

  const send = (raw: string) => {
    const text = raw.trim();
    if (!text || typing) return;
    setMsgs((m) => [...m, { id: nid(), from: "you", text }]);
    setInput("");
    setTyping(true);
    window.setTimeout(() => {
      setMsgs((m) => [...m, { id: nid(), from: "tano", text: answerFor(text) }]);
      setTyping(false);
    }, 650);
  };

  return (
    <div className="flex flex-col">
      <div className="max-h-[220px] space-y-2 overflow-y-auto pr-1">
        {msgs.map((m) => (
          <div
            key={m.id}
            className={`rounded-xl px-3 py-2 text-[12px] leading-relaxed ${
              m.from === "tano"
                ? "border border-accent/25 bg-accent/[0.07] text-ink"
                : "ml-6 border border-white/10 bg-white/[0.04] text-muted"
            }`}
          >
            {m.from === "tano" && (
              <span className="mr-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-accent-pale">
                TANO
              </span>
            )}
            {m.text}
          </div>
        ))}
        {typing && (
          <div className="inline-flex items-center gap-1.5 rounded-xl border border-accent/25 bg-accent/[0.07] px-3 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-pale animate-pulse-dot" />
            <span className="h-1.5 w-1.5 rounded-full bg-accent-pale animate-pulse-dot [animation-delay:150ms]" />
            <span className="h-1.5 w-1.5 rounded-full bg-accent-pale animate-pulse-dot [animation-delay:300ms]" />
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="mt-2 flex flex-wrap gap-1">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => send(s)}
            disabled={typing}
            className="rounded-full border border-accent/20 bg-accent/[0.05] px-2 py-0.5 text-[10px] text-muted transition-colors hover:border-accent/45 hover:text-accent-pale disabled:opacity-50"
          >
            {s}
          </button>
        ))}
      </div>

      <div className="mt-2 flex items-center gap-1.5 rounded-xl border border-accent/20 bg-black/40 px-2 py-1.5">
        <span className="font-mono text-[11px] text-accent-pale">›</span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send(input)}
          placeholder="Ask TANO…"
          aria-label="Ask TANO"
          className="min-w-0 flex-1 bg-transparent text-[12px] text-ink placeholder:text-dim focus:outline-none"
        />
        <button
          onClick={() => send(input)}
          disabled={typing}
          className="btn-gold shrink-0 rounded-md px-2 py-1 text-[10px] font-bold disabled:opacity-60"
        >
          Ask
        </button>
      </div>
    </div>
  );
}
