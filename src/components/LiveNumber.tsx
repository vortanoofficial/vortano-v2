"use client";

import { useEffect, useState } from "react";

/**
 * A number that updates on an interval so a stat feels live.
 * - mode "drift": jitters a few units around `base` (e.g. jobs in flight, revenue)
 * - mode "climb": monotonically counts upward by `step` (e.g. USDC streamed today)
 *
 * SSR renders `base` formatted; ticking begins after mount → no hydration mismatch.
 */
export function LiveNumber({
  base,
  mode = "drift",
  drift = 8,
  step = 24,
  prefix = "",
  suffix = "",
  intervalMs = 1200,
}: {
  base: number;
  mode?: "drift" | "climb";
  drift?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  intervalMs?: number;
}) {
  const [val, setVal] = useState(base);

  useEffect(() => {
    const iv = setInterval(() => {
      setVal((prev) =>
        mode === "climb"
          ? prev + Math.round(Math.random() * step) + 1
          : base + Math.round((Math.random() - 0.5) * drift * 2),
      );
    }, intervalMs);
    return () => clearInterval(iv);
  }, [base, mode, drift, step, intervalMs]);

  return (
    <span className="tabular-nums">
      {prefix}
      {val.toLocaleString("en-US")}
      {suffix}
    </span>
  );
}
