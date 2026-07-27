"use client";

import { useRef, useState } from "react";

/**
 * A genuinely working model preview: the prompt goes to /api/infer (server-side,
 * hosted inference) and returns a real generation. Framed honestly — this is a
 * preview of the model experience; serving it on Vortano's decentralized compute
 * is the roadmap, and the copy says so.
 */

const SUGGESTIONS = [
  "Explain what Vortano does in one line.",
  "Write a haiku about GPUs.",
  "Why is compute a real-world asset?",
  "Give me 3 uses for a rented H100.",
];

export function VortanoPlayground() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const outRef = useRef<HTMLDivElement>(null);

  const run = async (raw: string) => {
    const prompt = raw.trim();
    if (!prompt || busy) return;
    setBusy(true);
    setErr(null);
    setOutput("");
    try {
      const r = await fetch("/api/infer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const j = await r.json();
      if (!r.ok) {
        setErr(j?.message || "The model is offline right now — check back soon.");
      } else {
        setOutput(j.text || "(no output)");
      }
    } catch {
      setErr("Network error — please try again.");
    } finally {
      setBusy(false);
      setTimeout(() => outRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" }), 50);
    }
  };

  return (
    <div className="panel beam overflow-hidden rounded-3xl">
      <div className="flex items-center justify-between gap-3 border-b border-accent/15 px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-xl border border-accent/25 bg-accent/10 text-accent-pale">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 3v3M12 18v3M3 12h3M18 12h3M6 6l2 2M18 6l-2 2M6 18l2-2M18 18l-2-2" strokeLinecap="round" />
              <circle cx="12" cy="12" r="3.5" />
            </svg>
          </span>
          <span className="text-base font-semibold text-ink">Try the model</span>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 font-mono text-[11px] text-positive">
          <span className="h-1.5 w-1.5 rounded-full bg-positive animate-pulse-dot" />
          LIVE
        </span>
      </div>

      <div className="p-6">
        <div className="flex items-end gap-2 rounded-2xl border border-accent/20 bg-black/40 p-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) run(input);
            }}
            rows={2}
            placeholder="Ask the model anything…  (⌘/Ctrl + Enter to run)"
            className="min-w-0 flex-1 resize-none bg-transparent text-sm text-ink placeholder:text-dim focus:outline-none"
          />
          <button
            onClick={() => run(input)}
            disabled={busy || !input.trim()}
            className="btn-gold shrink-0 rounded-xl px-4 py-2 text-sm font-bold disabled:opacity-50"
          >
            {busy ? "Running…" : "Run"}
          </button>
        </div>

        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => {
                setInput(s);
                run(s);
              }}
              disabled={busy}
              className="rounded-full border border-accent/20 bg-accent/[0.05] px-2.5 py-1 text-[11px] text-muted transition-colors hover:border-accent/45 hover:text-accent-pale disabled:opacity-50"
            >
              {s}
            </button>
          ))}
        </div>

        {(output || busy || err) && (
          <div
            ref={outRef}
            className="mt-4 min-h-[64px] rounded-2xl border border-accent/20 bg-accent/[0.05] p-4 text-sm leading-relaxed text-ink"
          >
            {busy && (
              <span className="inline-flex items-center gap-1.5 text-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-pale animate-pulse-dot" />
                <span className="h-1.5 w-1.5 rounded-full bg-accent-pale animate-pulse-dot [animation-delay:150ms]" />
                <span className="h-1.5 w-1.5 rounded-full bg-accent-pale animate-pulse-dot [animation-delay:300ms]" />
                generating…
              </span>
            )}
            {err && <span className="text-negative">{err}</span>}
            {output && <span className="whitespace-pre-wrap">{output}</span>}
          </div>
        )}

        <p className="mt-4 text-[11px] leading-relaxed text-dim">
          Preview — a hosted model, live now so you can feel the product. Serving inference across
          Vortano&apos;s decentralized GPU/NPU network (settled in USDG on Robinhood Chain) is on
          the roadmap. Not financial advice.
        </p>
      </div>
    </div>
  );
}
