// ============================================================
// Live market data — Vortano (Dexscreener) + ETH/USDC (CoinGecko)
// ============================================================

// RELAUNCH: the old (Virtuals-era) token is retired. Set VRTN_CONTRACT + VRTN_PAIR
// to the NEW flap.sh token/pair at launch — every on-chain widget (stats, transfers,
// add-to-wallet, chart, price) reads from here and reactivates automatically once
// TOKEN_LIVE becomes true. Until then, the token UI shows a "launching on flap.sh"
// state and NO old contract address is displayed anywhere.
export const VRTN_PAIR = ""; // TODO: new flap.sh pair at launch
export const VRTN_CONTRACT = ""; // TODO: new flap.sh token address at launch
export const TOKEN_LIVE = /^0x[a-fA-F0-9]{40}$/.test(VRTN_CONTRACT);
export const FLAP_URL = "https://flap.sh"; // TODO: exact flap.sh token page after launch
export const VRTN_DEX_URL = FLAP_URL;

export type Coin = { price: number; change24h: number };
export type Vrtn = Coin & {
  volume24h: number;
  liquidity: number;
  mcap: number;
  txns24h: number;
};
export type Market = { eth: Coin; usdc: Coin; vrtn: Vrtn; live: boolean };

// Real snapshot used as a graceful fallback when a fetch fails.
export const FALLBACK: Market = {
  eth: { price: 3128, change24h: 1.6 },
  usdc: { price: 1, change24h: 0 },
  vrtn: {
    price: 0.00006287,
    change24h: -48.55,
    volume24h: 122102.5,
    liquidity: 31899.58,
    mcap: 62874,
    txns24h: 1257,
  },
  live: false,
};

async function fetchVrtn(): Promise<Vrtn | null> {
  try {
    const r = await fetch(
      `https://api.dexscreener.com/latest/dex/pairs/robinhood/${VRTN_PAIR}`,
      { cache: "no-store" },
    );
    const j = await r.json();
    const p = j?.pairs?.[0] ?? j?.pair;
    if (!p?.priceUsd) return null;
    const t = p.txns?.h24 ?? {};
    return {
      price: +p.priceUsd,
      change24h: p.priceChange?.h24 ?? 0,
      volume24h: p.volume?.h24 ?? 0,
      liquidity: p.liquidity?.usd ?? 0,
      mcap: p.marketCap ?? p.fdv ?? 0,
      txns24h: (t.buys ?? 0) + (t.sells ?? 0),
    };
  } catch {
    return null;
  }
}

async function fetchEthUsdc(): Promise<{ eth: Coin; usdc: Coin } | null> {
  try {
    const r = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum,usd-coin&vs_currencies=usd&include_24hr_change=true",
      { cache: "no-store" },
    );
    const j = await r.json();
    if (!j?.ethereum?.usd) return null;
    return {
      eth: { price: j.ethereum.usd, change24h: j.ethereum.usd_24h_change ?? 0 },
      usdc: { price: j["usd-coin"].usd, change24h: j["usd-coin"].usd_24h_change ?? 0 },
    };
  } catch {
    return null;
  }
}

/** Fetch everything in parallel; keep fallback values for whatever fails. */
export async function fetchMarket(): Promise<Market> {
  const [v, eu] = await Promise.all([fetchVrtn(), fetchEthUsdc()]);
  return {
    eth: eu?.eth ?? FALLBACK.eth,
    usdc: eu?.usdc ?? FALLBACK.usdc,
    vrtn: v ?? FALLBACK.vrtn,
    live: !!(v || eu),
  };
}

// ---- formatters -------------------------------------------

export function fmtUsd(n: number): string {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function fmtPrice(n: number): string {
  if (n >= 1) return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (n >= 0.01) return "$" + n.toFixed(4);
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 8, maximumFractionDigits: 8 });
}

export function fmtCompact(n: number): string {
  return "$" + new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(n);
}

export function fmtPct(n: number): string {
  return (n >= 0 ? "+" : "") + n.toFixed(2) + "%";
}
