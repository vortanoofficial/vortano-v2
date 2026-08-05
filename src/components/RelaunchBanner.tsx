"use client";

import { useEffect, useState } from "react";
import { FLAP_URL } from "@/lib/market";

/**
 * Site-wide relaunch notice: Vortano is relaunching on flap.sh with a 1:1 snapshot
 * airdrop. Doubles as scam protection — it tells holders they NEVER need to send
 * tokens to anyone. Dismissible (remembered in localStorage).
 */
export function RelaunchBanner() {
  // Shown by default (renders on SSR so the relaunch notice appears instantly);
  // hidden only once the visitor has dismissed it.
  const [show, setShow] = useState(true);

  useEffect(() => {
    try {
      if (localStorage.getItem("vortano-relaunch-dismissed") === "1") setShow(false);
    } catch {}
  }, []);

  if (!show) return null;

  const dismiss = () => {
    setShow(false);
    try {
      localStorage.setItem("vortano-relaunch-dismissed", "1");
    } catch {}
  };

  return (
    <div className="relative mb-8 overflow-hidden rounded-2xl border border-accent/30 bg-gradient-to-r from-accent/[0.12] via-accent/[0.06] to-positive/[0.08] p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3 pr-6">
          <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl border border-accent/30 bg-accent/10 text-lg">
            🟡
          </span>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-ink sm:text-base">
              Vortano is relaunching on{" "}
              <span className="text-accent-pale">flap.sh</span> — every $VRTN holder gets the new
              token <span className="text-accent-pale">1:1, automatically</span>.
            </div>
            <div className="mt-1 text-[12px] leading-relaxed text-muted">
              It&apos;s a snapshot airdrop: you keep your tokens and receive the new one — no action
              needed.{" "}
              <span className="font-semibold text-positive">
                You never need to send tokens to anyone.
              </span>{" "}
              Anyone asking you to &ldquo;send to claim&rdquo; is a scam.
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <a
            href={FLAP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold rounded-xl px-4 py-2 text-sm font-semibold"
          >
            Follow on flap.sh ↗
          </a>
        </div>
      </div>

      <button
        onClick={dismiss}
        aria-label="Dismiss"
        className="absolute right-2.5 top-2.5 grid h-7 w-7 place-items-center rounded-lg text-dim transition-colors hover:text-ink"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
