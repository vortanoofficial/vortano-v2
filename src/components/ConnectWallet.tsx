"use client";

import { useEffect, useRef, useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";

function short(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export function ConnectWallet({ className = "" }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // de-duplicate connectors by name (injected + EIP-6963 discovery can overlap)
  const seen = new Set<string>();
  const wallets = connectors.filter((c) => {
    const key = c.name.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const base = `btn-gold rounded-lg px-4 py-2 text-sm font-semibold transition-transform hover:-translate-y-0.5 active:translate-y-0 ${className}`;

  // Stable SSR render
  if (!mounted) {
    return <button className={base}>Connect Wallet</button>;
  }

  if (isConnected && address) {
    return (
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="inline-flex items-center gap-2 rounded-lg border border-accent/30 bg-accent/[0.08] px-3.5 py-2 font-mono text-sm text-accent-pale transition-colors hover:border-accent/60"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-positive animate-pulse-dot" />
          {short(address)}
        </button>
        {menuOpen && (
          <div className="absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-xl border border-accent/20 bg-panel-2 p-1 shadow-2xl">
            <button
              onClick={() => {
                navigator.clipboard?.writeText(address);
                setCopied(true);
                setTimeout(() => setCopied(false), 1200);
              }}
              className="block w-full rounded-lg px-3 py-2 text-left text-sm text-muted hover:bg-accent/10 hover:text-ink"
            >
              {copied ? "Copied ✓" : "Copy address"}
            </button>
            <button
              onClick={() => {
                disconnect();
                setMenuOpen(false);
              }}
              className="block w-full rounded-lg px-3 py-2 text-left text-sm text-negative hover:bg-negative/10"
            >
              Disconnect
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <button className={base} onClick={() => setPickerOpen(true)}>
        Connect Wallet
      </button>

      {pickerOpen && (
        <div
          className="fixed inset-0 z-[100] grid place-items-center bg-black/70 p-5 backdrop-blur-sm"
          onClick={() => setPickerOpen(false)}
        >
          <div
            className="lux w-full max-w-sm rounded-3xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-ink">Connect a wallet</h3>
              <button onClick={() => setPickerOpen(false)} className="text-dim hover:text-ink">✕</button>
            </div>
            <p className="mt-1 text-xs text-muted">Choose how you want to connect.</p>

            <div className="mt-5 space-y-2">
              {wallets.length === 0 && (
                <p className="rounded-xl border border-accent/15 bg-black/30 p-4 text-sm text-muted">
                  No wallet detected. Install a browser wallet (MetaMask, Rabby, Robinhood
                  Wallet…) and reload.
                </p>
              )}
              {wallets.map((c) => (
                <button
                  key={c.uid}
                  disabled={isPending}
                  onClick={() => {
                    connect({ connector: c });
                    setPickerOpen(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-xl border border-accent/15 bg-accent/[0.04] px-4 py-3 text-left transition-colors hover:border-accent/45 disabled:opacity-60"
                >
                  {c.icon ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.icon} alt="" className="h-7 w-7 rounded-lg" />
                  ) : (
                    <span className="grid h-7 w-7 place-items-center rounded-lg bg-accent/15 text-accent-pale">
                      {c.name.charAt(0)}
                    </span>
                  )}
                  <span className="text-sm font-medium text-ink">{c.name}</span>
                </button>
              ))}
            </div>

            <p className="mt-5 text-[11px] leading-relaxed text-dim">
              By connecting, you agree to interact with the Vortano protocol on Robinhood Chain.
              Vortano never has custody of your funds.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
