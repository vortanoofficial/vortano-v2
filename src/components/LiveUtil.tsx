"use client";

import { useEffect, useState } from "react";

/**
 * A live utilization readout that jitters a few percent around a baseline
 * every ~1.2s, so the node feels genuinely busy. SSR renders the baseline;
 * the ticking starts only after mount (no hydration mismatch).
 */
export function LiveUtil({ base }: { base: number }) {
  const [val, setVal] = useState(base);

  useEffect(() => {
    const iv = setInterval(() => {
      const drift = Math.round((Math.random() - 0.5) * 6);
      setVal(Math.max(52, Math.min(99, base + drift)));
    }, 1200);
    return () => clearInterval(iv);
  }, [base]);

  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-positive tabular-nums">
      <span className="h-1 w-1 rounded-full bg-positive animate-pulse-dot" />
      {val}%
    </span>
  );
}
