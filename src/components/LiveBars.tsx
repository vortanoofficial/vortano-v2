import type { CSSProperties } from "react";

/**
 * A live GPU-load bar graph: a row of gold bars that continuously pulse
 * (pure CSS, staggered per index so it reads as real activity, not a sine wave).
 * `intensity` (0–1) biases the bar heights so a busier node graphs taller.
 * Deterministic per-index values keep SSR and client render identical.
 */
export function LiveBars({
  active = true,
  intensity = 0.8,
  bars = 30,
  height = 34,
}: {
  active?: boolean;
  intensity?: number;
  bars?: number;
  height?: number;
}) {
  const ceiling = 0.5 + 0.5 * intensity; // taller peaks for busier nodes
  return (
    <div
      className={`live-bars${active ? "" : " live-bars--idle"}`}
      aria-hidden
      style={{ "--max": ceiling, height: `${height}px` } as CSSProperties}
    >
      {Array.from({ length: bars }).map((_, i) => {
        const dur = 0.9 + ((i * 37) % 95) / 100; // 0.90s – 1.85s
        const delay = ((i * 53) % 110) / 100; // 0 – 1.1s
        const jitter = ((i * 17) % 46) / 100; // 0 – 0.45
        const min = (0.12 + 0.45 * intensity) * (0.55 + jitter); // resting height
        return (
          <span
            key={i}
            className="live-bar"
            style={
              {
                animationDuration: `${dur}s`,
                animationDelay: `${delay}s`,
                "--min": min,
              } as CSSProperties
            }
          />
        );
      })}
    </div>
  );
}
