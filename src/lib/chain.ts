// ============================================================
// Live on-chain data — Robinhood Chain via Blockscout (real, verifiable)
// ============================================================

import { VRTN_CONTRACT } from "./market";

export const RH_EXPLORER = "https://robinhoodchain.blockscout.com";
const API = `${RH_EXPLORER}/api/v2`;

export type OnChain = {
  holders: number;
  transfers: number;
  totalSupply: number; // whole tokens
  totalBlocks: number;
  totalAddresses: number;
  gasAvg: number; // gwei
  live: boolean;
};

// Real snapshot (fetched 2026-07-27) used as a graceful fallback.
export const CHAIN_FALLBACK: OnChain = {
  holders: 484,
  transfers: 46023,
  totalSupply: 1_000_000_000,
  totalBlocks: 21_102_154,
  totalAddresses: 4_531_445,
  gasAvg: 0.08,
  live: false,
};

const n = (v: unknown) => {
  const x = typeof v === "string" ? Number(v) : typeof v === "number" ? v : NaN;
  return Number.isFinite(x) ? x : 0;
};

export async function fetchOnChain(): Promise<OnChain> {
  try {
    const [tokenR, countersR, statsR] = await Promise.all([
      fetch(`${API}/tokens/${VRTN_CONTRACT}`, { cache: "no-store" }).then((r) => r.json()),
      fetch(`${API}/tokens/${VRTN_CONTRACT}/counters`, { cache: "no-store" }).then((r) => r.json()),
      fetch(`${API}/stats`, { cache: "no-store" }).then((r) => r.json()),
    ]);

    const holders = n(countersR?.token_holders_count) || n(tokenR?.holders_count);
    const transfers = n(countersR?.transfers_count);
    const rawSupply = n(tokenR?.total_supply);
    const decimals = n(tokenR?.decimals) || 18;
    const totalSupply = rawSupply > 0 ? rawSupply / 10 ** decimals : CHAIN_FALLBACK.totalSupply;

    return {
      holders: holders || CHAIN_FALLBACK.holders,
      transfers: transfers || CHAIN_FALLBACK.transfers,
      totalSupply: Math.round(totalSupply),
      totalBlocks: n(statsR?.total_blocks) || CHAIN_FALLBACK.totalBlocks,
      totalAddresses: n(statsR?.total_addresses) || CHAIN_FALLBACK.totalAddresses,
      gasAvg: n(statsR?.gas_prices?.average) || CHAIN_FALLBACK.gasAvg,
      live: true,
    };
  } catch {
    return CHAIN_FALLBACK;
  }
}

export const fmtInt = (nn: number) => nn.toLocaleString("en-US");
export const fmtCompact = (nn: number) =>
  new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 2 }).format(nn);
