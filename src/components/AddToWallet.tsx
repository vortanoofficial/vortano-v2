"use client";

import { useState } from "react";
import { VRTN_CONTRACT, TOKEN_LIVE, LAUNCH_URL } from "@/lib/market";

/**
 * One-tap: add the real Robinhood Chain network and the $VRTN token to any
 * injected wallet (MetaMask, Rabby, Robinhood Wallet, …). Uses standard EIP-3085
 * (wallet_addEthereumChain) and EIP-747 (wallet_watchAsset). All parameters are
 * the real, verified mainnet values — nothing here is a placeholder.
 */

const RH_CHAIN = {
  chainId: "0x1237", // 4663
  chainName: "Robinhood Chain",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: ["https://rpc.mainnet.chain.robinhood.com"],
  blockExplorerUrls: ["https://robinhoodchain.blockscout.com"],
};

const VRTN_TOKEN = {
  type: "ERC20" as const,
  options: {
    address: VRTN_CONTRACT,
    symbol: "VRTN",
    decimals: 18,
    image: "https://vortano.ai/token-vrtn.png",
  },
};

type Status = "idle" | "pending" | "ok" | "error";

function getProvider(): { request: (a: { method: string; params?: unknown }) => Promise<unknown> } | null {
  if (typeof window === "undefined") return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (window as any).ethereum ?? null;
}

export function AddToWallet() {
  const [chainStatus, setChainStatus] = useState<Status>("idle");
  const [tokenStatus, setTokenStatus] = useState<Status>("idle");
  const [err, setErr] = useState<string | null>(null);

  const hasWallet = getProvider() !== null;

  const addChain = async () => {
    const p = getProvider();
    if (!p) return;
    setErr(null);
    setChainStatus("pending");
    try {
      await p.request({ method: "wallet_addEthereumChain", params: [RH_CHAIN] });
      setChainStatus("ok");
    } catch (e) {
      setChainStatus("error");
      setErr(e instanceof Error ? e.message : "Could not add the network.");
    }
  };

  const addToken = async () => {
    const p = getProvider();
    if (!p) return;
    setErr(null);
    setTokenStatus("pending");
    try {
      const added = await p.request({ method: "wallet_watchAsset", params: VRTN_TOKEN });
      setTokenStatus(added ? "ok" : "idle");
    } catch (e) {
      setTokenStatus("error");
      setErr(e instanceof Error ? e.message : "Could not add the token.");
    }
  };

  const label = (base: string, s: Status) =>
    s === "pending" ? "Confirm in wallet…" : s === "ok" ? "Added ✓" : base;

  return (
    <div className="panel beam rounded-3xl p-7">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-xl border border-accent/25 bg-accent/10 text-accent-pale">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="3" y="6" width="18" height="13" rx="3" />
              <path d="M16 12h.01M3 10h18" strokeLinecap="round" />
            </svg>
          </span>
          <span className="text-base font-semibold text-ink">Add $VRTN to your wallet</span>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-positive/40 bg-positive/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-positive">
          <span className="h-1 w-1 rounded-full bg-positive animate-pulse-dot" /> Live
        </span>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-muted">
        One tap adds the <strong className="font-semibold text-ink">real Robinhood Chain</strong>{" "}
        network and the <strong className="font-semibold text-ink">$VRTN</strong> token to your
        wallet — no copy-pasting contract addresses.
      </p>

      {hasWallet ? (
        <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
          <button
            onClick={addChain}
            disabled={chainStatus === "pending"}
            className="rounded-xl border border-accent/25 bg-accent/[0.06] px-4 py-3 text-sm font-semibold text-ink transition-colors hover:border-accent/50 disabled:opacity-60"
          >
            {label("Add Robinhood Chain", chainStatus)}
          </button>
          <button
            onClick={addToken}
            disabled={tokenStatus === "pending" || !TOKEN_LIVE}
            className="btn-gold rounded-xl px-4 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5 disabled:opacity-60"
          >
            {TOKEN_LIVE ? label("Add $VRTN token", tokenStatus) : "Token at pools.trade launch"}
          </button>
        </div>
      ) : (
        <div className="mt-5 rounded-xl border border-accent/15 bg-black/30 p-4 text-sm text-muted">
          No browser wallet detected. Install MetaMask, Rabby or Robinhood Wallet and reload to
          add the network and token in one tap.
        </div>
      )}

      {err && <p className="mt-3 text-[11px] leading-relaxed text-negative">{err}</p>}

      <div className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-accent/15 bg-black/40 px-3.5 py-2.5">
        {TOKEN_LIVE ? (
          <>
            <span className="min-w-0 flex-1 truncate font-mono text-xs tracking-wide text-accent-pale">
              {VRTN_CONTRACT}
            </span>
            <a
              href={`https://robinhoodchain.blockscout.com/token/${VRTN_CONTRACT}`}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 font-mono text-[11px] uppercase tracking-wider text-dim transition-colors hover:text-accent-pale"
            >
              Explorer ↗
            </a>
          </>
        ) : (
          <>
            <span className="min-w-0 flex-1 truncate font-mono text-xs tracking-wide text-muted">
              New $VRTN address published at the pools.trade relaunch
            </span>
            <a
              href={LAUNCH_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 font-mono text-[11px] uppercase tracking-wider text-dim transition-colors hover:text-accent-pale"
            >
              pools.trade ↗
            </a>
          </>
        )}
      </div>
      <p className="mt-3 text-[11px] leading-relaxed text-dim">
        Chain ID 4663 · settles on Ethereum. Vortano never has custody of your funds — this only
        adds the network and token to your own wallet.
      </p>
    </div>
  );
}
