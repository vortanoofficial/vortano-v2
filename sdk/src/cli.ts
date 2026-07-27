#!/usr/bin/env node
/**
 * vortano — a tiny CLI over @vortano/sdk.
 *
 *   npx vortano price
 *   npx vortano onchain
 *   npx vortano earn h100 2 0.8
 *   npx vortano network
 */
import { getMarket, getOnChain, estimateEarnings, addNetworkParams, GPU_RATES, CHAIN, VRTN } from "./index.js";

const usd = (n: number) => "$" + n.toLocaleString("en-US", { maximumFractionDigits: 6 });
const int = (n: number) => n.toLocaleString("en-US");

async function main() {
  const [cmd, ...args] = process.argv.slice(2);

  switch (cmd) {
    case "price": {
      const m = await getMarket();
      console.log(`\n  $VRTN  ${usd(m.priceUsd)}   ${m.change24h >= 0 ? "▲" : "▼"} ${m.change24h.toFixed(2)}% (24h)`);
      console.log(`  vol ${usd(m.volume24h)}  ·  liq ${usd(m.liquidity)}  ·  mcap ${usd(m.marketCap)}\n`);
      break;
    }
    case "onchain": {
      const o = await getOnChain();
      console.log(`\n  Live on Robinhood Chain (id ${CHAIN.id})`);
      console.log(`  holders     ${int(o.holders)}`);
      console.log(`  transfers   ${int(o.transfers)}`);
      console.log(`  supply      ${int(o.totalSupply)} VRTN`);
      console.log(`  explorer    ${CHAIN.explorer}/token/${VRTN.address}\n`);
      break;
    }
    case "earn": {
      const gpu = (args[0] ?? "h100") as keyof typeof GPU_RATES;
      const count = Number(args[1] ?? 1);
      const util = Number(args[2] ?? 0.78);
      const est = estimateEarnings(gpu, count, util);
      console.log(`\n  ${count}× ${gpu} @ ${Math.round(util * 100)}% utilization`);
      console.log(`  ≈ ${usd(est)} / month in USDG (after 2.5% fee) — estimate, not a guarantee\n`);
      break;
    }
    case "network": {
      console.log("\n  Add Robinhood Chain to your wallet:\n");
      console.log(JSON.stringify(addNetworkParams(), null, 2));
      console.log("");
      break;
    }
    default:
      console.log(`
  vortano — CLI for the Vortano compute marketplace (Robinhood Chain)

  Commands:
    price              Live $VRTN market data
    onchain            Real on-chain stats (holders, transfers, supply)
    earn <gpu> <n> <u> Estimate provider earnings (e.g. earn h100 2 0.8)
    network            Print Robinhood Chain network params for your wallet

  Learn more: https://vortano.ai  ·  https://github.com/vortanoofficial/vortano-v2
`);
  }
}

main().catch((e) => {
  console.error("error:", e?.message ?? e);
  process.exit(1);
});
