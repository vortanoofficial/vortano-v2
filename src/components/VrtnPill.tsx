"use client";

import { useEffect, useRef, useState } from "react";
import { useMarket } from "./MarketProvider";
import { fmtPct, VRTN_DEX_URL } from "@/lib/market";

/**
 * Renders a sub-cent price the way crypto UIs do: "$0.0₄6287" — the subscript is
 * the count of leading zeros after the decimal, so a tiny number stays compact
 * and readable in the navbar.
 */
function TinyPrice({ n }: { n: number }) {
  if (n >= 0.01) return <>${n.toFixed(4)}</>;
  const s = n.toFixed(12); // "0.000062870000"
  const dec = s.split(".")[1] ?? "";
  const zeros = dec.match(/^0*/)?.[0].length ?? 0;
  const digits = dec.slice(zeros).replace(/0+$/, "").slice(0, 4) || "0";
  return (
    <>
      $0.0<sub className="text-[0.7em]">{zeros}</sub>
      {digits}
    </>
  );
}

export function VrtnPill() {
  const m = useMarket();
  const v = m.vrtn;
  const up = v.change24h >= 0;

  // pulse the price when it changes so the pill visibly "ticks"
  const prev = useRef(v.price);
  const [flash, setFlash] = useState<"up" | "down" | null>(null);
  useEffect(() => {
    if (v.price !== prev.current) {
      setFlash(v.price > prev.current ? "up" : "down");
      prev.current = v.price;
      const t = setTimeout(() => setFlash(null), 700);
      return () => clearTimeout(t);
    }
  }, [v.price]);

  return (
    <a
      href={VRTN_DEX_URL}
      target="_blank"
      rel="noopener noreferrer"
      title={`$VRTN · ${m.live ? "live" : "cached"} price — open Dexscreener`}
      className="hidden items-center gap-2 rounded-lg border border-accent/15 bg-accent/[0.05] px-3 py-1.5 font-mono text-xs text-muted transition-colors hover:border-accent/40 hover:text-ink lg:flex"
    >
      <span className="inline-flex items-center gap-1.5 font-semibold text-accent-pale">
        <span
          className={`h-1.5 w-1.5 rounded-full ${m.live ? "bg-positive animate-pulse-dot" : "bg-dim"}`}
        />
        $VRTN
      </span>
      <span className="h-3 w-px bg-accent/25" />
      <span
        className={`tabular-nums transition-colors duration-300 ${
          flash === "up" ? "text-positive" : flash === "down" ? "text-negative" : "text-ink"
        }`}
      >
        <TinyPrice n={v.price} />
      </span>
      <span className={`font-semibold ${up ? "text-positive" : "text-negative"}`}>
        {up ? "▲" : "▼"} {fmtPct(v.change24h)}
      </span>
    </a>
  );
}
