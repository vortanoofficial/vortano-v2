"use client";

import { useState } from "react";
import Image from "next/image";

const TOKEN_ICON: Record<string, string> = {
  USDG: "/token-usdg.png",
  USDC: "/token-usdc.png",
  ETH: "/token-eth.png",
  VRTN: "/token-vrtn.png",
};
type Kind = "Scheduled" | "DCA" | "Limit" | "Instant";
type Order = {
  id: string;
  from: string;
  to: string;
  amount: string;
  kind: Kind;
  detail: string;
  status: "Active" | "Armed" | "Filled";
  fresh?: boolean;
};

const EXAMPLES = [
  "Every day at 20:00, swap $500 USDG → VRTN",
  "Buy VRTN when price < $0.00005",
  "DCA $50 into VRTN weekly",
  "Swap 200 USDG to VRTN now",
];

let uid = 100;

function parse(raw: string): Order {
  const text = raw.trim();
  const lower = text.toLowerCase();

  // tokens in the order they appear in the sentence
  const seq: string[] = [];
  const tokRe = /\b(USDG|USDC|ETH|VRTN)\b/gi;
  let tm: RegExpExecArray | null;
  while ((tm = tokRe.exec(text))) {
    const t = tm[1].toUpperCase();
    if (!seq.includes(t)) seq.push(t);
  }
  let from: string;
  let to: string;
  if (seq.length >= 2) {
    [from, to] = seq;
  } else if (seq.length === 1) {
    const tok = seq[0];
    if (/\bsell\b/.test(lower)) {
      from = tok;
      to = tok === "USDG" ? "VRTN" : "USDG";
    } else {
      to = tok; // buy / into / DCA → acquire this token
      from = tok === "USDG" ? "ETH" : "USDG";
    }
  } else {
    from = "USDG";
    to = "VRTN";
  }

  // strip clock times (20:00) so they aren't read as amounts, then take the
  // first number >= 1 (sub-1 values are trigger prices, not swap amounts).
  const noTime = text.replace(/\b\d{1,2}:\d{2}\b/g, " ");
  const nums = [...noTime.matchAll(/\$?\s?(\d[\d,]*(?:\.\d+)?)\s?(k|m)?/gi)]
    .map((m) => ({ raw: m[1].replace(/,/g, ""), suffix: (m[2] || "").toUpperCase() }))
    .filter((n) => parseFloat(n.raw) >= 1);
  const amount = nums.length ? `$${nums[0].raw}${nums[0].suffix}` : "$500";

  if (/\b(when|if|below|under|above|over|price|<|>)\b/.test(lower)) {
    const dir = /\b(above|over|>)\b/.test(lower) ? ">" : "<";
    const price = text.match(/\$?0\.0*\d+/);
    return {
      id: `o${Date.now()}-${uid++}`,
      from,
      to,
      amount,
      kind: "Limit",
      status: "Armed",
      detail: `When ${to} ${dir} ${price ? (price[0].startsWith("$") ? price[0] : "$" + price[0]) : "target"} · limit order`,
      fresh: true,
    };
  }
  if (/\b(dca|every|daily|day|weekly|week|monthly|month|schedule|hour)\b/.test(lower)) {
    const freq = /\bweek/.test(lower) ? "Weekly" : /\bmonth/.test(lower) ? "Monthly" : /\bhour/.test(lower) ? "Hourly" : "Daily";
    const time = text.match(/(\d{1,2})(?::(\d{2}))?\s?(am|pm)?/i);
    const t = time && (time[3] || time[2]) ? ` · ${time[0].trim().toUpperCase()}` : "";
    return {
      id: `o${Date.now()}-${uid++}`,
      from,
      to,
      amount,
      kind: /\bdca\b/.test(lower) ? "DCA" : "Scheduled",
      status: "Active",
      detail: `${freq}${t} · max 1% slippage`,
      fresh: true,
    };
  }
  return {
    id: `o${Date.now()}-${uid++}`,
    from,
    to,
    amount,
    kind: "Instant",
    status: "Filled",
    detail: "Executed now · best market route",
    fresh: true,
  };
}

function Chip({ label }: { label: string }) {
  const src = TOKEN_ICON[label];
  return (
    <span className="inline-flex items-center gap-1.5">
      {src && (
        <span className="grid h-5 w-5 overflow-hidden rounded-full ring-1 ring-black/20">
          <Image src={src} alt="" width={20} height={20} className="h-5 w-5 object-cover" />
        </span>
      )}
      <span className="font-mono text-[11px] text-muted">{label}</span>
    </span>
  );
}

const STATUS_STYLE: Record<Order["status"], string> = {
  Active: "bg-positive/12 text-positive",
  Armed: "bg-accent/12 text-accent-pale",
  Filled: "bg-accent/12 text-accent-pale",
};

function OrderCard({ o }: { o: Order }) {
  return (
    <div
      className={`rounded-2xl border p-3.5 transition-all ${
        o.fresh ? "border-accent/40 bg-accent/[0.07]" : "border-accent/15 bg-accent/[0.03]"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Chip label={o.from} />
          <span className="text-dim">→</span>
          <Chip label={o.to} />
          <span className="ml-1 font-mono text-[11px] text-dim">{o.amount}</span>
        </div>
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_STYLE[o.status]}`}>
          {o.status !== "Filled" && <span className="h-1 w-1 rounded-full bg-current animate-pulse-dot" />}
          {o.status}
        </span>
      </div>
      <div className="mt-2 flex items-center justify-between text-[11px] text-muted">
        <span>{o.detail}</span>
        <span className="font-mono text-accent-pale">{o.kind}</span>
      </div>
    </div>
  );
}

export function AiWalletDemo() {
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([
    { id: "seed1", from: "USDG", to: "VRTN", amount: "$500", kind: "Scheduled", status: "Active", detail: "Daily · 20:00 · max 1% slippage" },
    { id: "seed2", from: "ETH", to: "VRTN", amount: "0.5", kind: "Limit", status: "Armed", detail: "When VRTN < $0.00005 · limit order" },
  ]);

  const run = (raw: string) => {
    const text = raw.trim();
    if (!text || busy) return;
    setBusy(true);
    setInput(text);
    window.setTimeout(() => {
      const order = parse(text);
      setOrders((prev) => [order, ...prev.map((o) => ({ ...o, fresh: false }))].slice(0, 5));
      setBusy(false);
      setInput("");
      setFlash(order.kind === "Instant" ? "✓ Swap executed" : "✓ Order scheduled");
      window.setTimeout(() => setFlash(null), 1900);
    }, 780);
  };

  return (
    <div className="panel beam rounded-3xl p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-xl border border-accent/25 bg-accent/10 text-accent-pale">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 3v3m0 12v3M5.6 5.6l2.1 2.1m8.6 8.6l2.1 2.1M3 12h3m12 0h3M5.6 18.4l2.1-2.1m8.6-8.6l2.1-2.1" strokeLinecap="round" />
            </svg>
          </span>
          <span className="text-base font-semibold">AI Swaps</span>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/25 bg-accent/[0.06] px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-accent-pale">
          <span className="h-1 w-1 rounded-full bg-positive animate-pulse-dot" /> Live demo
        </span>
      </div>

      {/* input */}
      <div className="mt-4 rounded-2xl border border-accent/20 bg-black/40 p-2.5">
        <div className="flex items-center gap-2">
          <span className="pl-1 font-mono text-accent-pale">›</span>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && run(input)}
            placeholder="Tell your wallet what to do…"
            className="min-w-0 flex-1 bg-transparent text-sm text-ink placeholder:text-dim focus:outline-none"
            aria-label="AI wallet command"
          />
          <button
            onClick={() => run(input)}
            disabled={busy}
            className="btn-gold shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold disabled:opacity-60"
          >
            {busy ? "Parsing…" : "Run ↵"}
          </button>
        </div>
      </div>

      {/* example chips */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            onClick={() => run(ex)}
            disabled={busy}
            className="rounded-full border border-accent/20 bg-accent/[0.05] px-2.5 py-1 text-[11px] text-muted transition-colors hover:border-accent/45 hover:text-accent-pale disabled:opacity-50"
          >
            {ex}
          </button>
        ))}
      </div>

      {/* status line */}
      <div className="mt-4 flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-wider text-dim">Scheduled orders</span>
        <span className="h-4 min-w-[92px] text-right font-mono text-[11px] text-positive transition-opacity" style={{ opacity: flash ? 1 : 0 }}>
          {flash}
        </span>
      </div>

      {busy && (
        <div className="mt-2 flex items-center gap-2 rounded-2xl border border-accent/20 bg-accent/[0.05] px-3.5 py-3 text-[12px] text-accent-pale">
          <span className="flex gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-pale animate-pulse-dot" />
            <span className="h-1.5 w-1.5 rounded-full bg-accent-pale animate-pulse-dot [animation-delay:150ms]" />
            <span className="h-1.5 w-1.5 rounded-full bg-accent-pale animate-pulse-dot [animation-delay:300ms]" />
          </span>
          Vortano AI is parsing your intent…
        </div>
      )}

      <div className="mt-2 space-y-2.5">
        {orders.map((o) => (
          <OrderCard key={o.id} o={o} />
        ))}
      </div>

      <p className="mt-4 flex items-center gap-2 text-[11px] leading-relaxed text-dim">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="shrink-0 text-accent-pale">
          <path d="M12 3l7 3v5c0 4.4-3 8.3-7 10-4-1.7-7-5.6-7-10V6l7-3z" />
        </svg>
        Executed by capped, allowlisted, revocable session keys — your seed phrase never signs a bot.
      </p>
    </div>
  );
}
