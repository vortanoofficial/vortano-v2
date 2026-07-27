/**
 * @vortano/sdk — a tiny, dependency-free TypeScript SDK for the Vortano
 * on-chain compute marketplace on Robinhood Chain.
 *
 * Reads only public data (Dexscreener market data + Robinhood Chain Blockscout).
 * Zero dependencies; works in Node 18+ and modern browsers (global fetch).
 */

export const CHAIN = {
  id: 4663,
  name: "Robinhood Chain",
  rpc: "https://rpc.mainnet.chain.robinhood.com",
  explorer: "https://robinhoodchain.blockscout.com",
} as const;

export const VRTN = {
  address: "0xe81DC008231035C91F09633c541394B9DdF53673",
  symbol: "VRTN",
  decimals: 18,
  pair: "0x1a9b626ba0be56f0cfb3e55d4d0b71c942f0a461",
} as const;

const DEX = `https://api.dexscreener.com/latest/dex/pairs/robinhood/${VRTN.pair}`;
const SCOUT = `${CHAIN.explorer}/api/v2`;

export type Market = {
  priceUsd: number;
  change24h: number;
  volume24h: number;
  liquidity: number;
  marketCap: number;
};

export type OnChain = {
  holders: number;
  transfers: number;
  totalSupply: number;
};

/** Live $VRTN market data (Dexscreener). */
export async function getMarket(): Promise<Market> {
  const j = await fetch(DEX, { cache: "no-store" } as RequestInit).then((r) => r.json());
  const p = (j?.pairs ?? [j?.pair])[0] ?? {};
  return {
    priceUsd: Number(p.priceUsd ?? 0),
    change24h: Number(p.priceChange?.h24 ?? 0),
    volume24h: Number(p.volume?.h24 ?? 0),
    liquidity: Number(p.liquidity?.usd ?? 0),
    marketCap: Number(p.marketCap ?? p.fdv ?? 0),
  };
}

/** Real on-chain $VRTN stats from the Robinhood Chain explorer. */
export async function getOnChain(): Promise<OnChain> {
  const [tok, ctr] = await Promise.all([
    fetch(`${SCOUT}/tokens/${VRTN.address}`).then((r) => r.json()),
    fetch(`${SCOUT}/tokens/${VRTN.address}/counters`).then((r) => r.json()),
  ]);
  const dec = Number(tok?.decimals ?? 18);
  return {
    holders: Number(ctr?.token_holders_count ?? tok?.holders_count ?? 0),
    transfers: Number(ctr?.transfers_count ?? 0),
    totalSupply: Number(tok?.total_supply ?? 0) / 10 ** dec,
  };
}

// ---- pricing helpers (marketplace rates, USDG/GPU-hour) ----

export const GPU_RATES: Record<string, number> = {
  "rtx-4090": 0.41,
  l40s: 0.92,
  a100: 1.42,
  h100: 2.18,
  mi300x: 2.74,
  h200: 3.1,
};

const HOURS_PER_MONTH = 24 * 30.4;
const FEE = 0.025;

/** Estimate provider earnings (USDG/month) after the 2.5% protocol fee. */
export function estimateEarnings(gpu: keyof typeof GPU_RATES, count = 1, utilization = 0.78) {
  const rate = GPU_RATES[gpu];
  if (!rate) throw new Error(`unknown gpu: ${gpu}`);
  const gross = rate * HOURS_PER_MONTH * count * utilization;
  return Math.round(gross * (1 - FEE));
}

/** Wallet params for wallet_addEthereumChain (EIP-3085). */
export function addNetworkParams() {
  return {
    chainId: "0x" + CHAIN.id.toString(16),
    chainName: CHAIN.name,
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: [CHAIN.rpc],
    blockExplorerUrls: [CHAIN.explorer],
  };
}

/** Token params for wallet_watchAsset (EIP-747). */
export function addTokenParams() {
  return {
    type: "ERC20" as const,
    options: { address: VRTN.address, symbol: VRTN.symbol, decimals: VRTN.decimals },
  };
}
