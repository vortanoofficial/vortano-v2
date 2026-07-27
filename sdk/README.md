# @vortano/sdk

A tiny, **dependency-free** TypeScript SDK + CLI for the [Vortano](https://vortano.ai)
on-chain compute marketplace on **Robinhood Chain** (chainId `4663`).

Reads only public data (Dexscreener market data + Robinhood Chain Blockscout).
Works in Node 18+ and modern browsers (global `fetch`).

## Install

```bash
npm i @vortano/sdk
```

## SDK

```ts
import { getMarket, getOnChain, estimateEarnings, CHAIN, VRTN } from "@vortano/sdk";

const m = await getMarket();     // { priceUsd, change24h, volume24h, ... }
const o = await getOnChain();    // { holders, transfers, totalSupply }
const monthly = estimateEarnings("h100", 2, 0.8); // USDG/month, after 2.5% fee

console.log(CHAIN.id, VRTN.address);
```

Also exports `addNetworkParams()` / `addTokenParams()` — ready to pass to
`wallet_addEthereumChain` / `wallet_watchAsset`.

## CLI

```bash
npx vortano price       # live $VRTN market data
npx vortano onchain     # real on-chain stats (holders, transfers, supply)
npx vortano earn h100 2 0.8   # estimate provider earnings
npx vortano network     # print Robinhood Chain params for your wallet
```

## Build (from the monorepo)

```bash
cd sdk
npm install
npm run build   # → dist/
```

## Publish

```bash
npm publish --access public   # requires an npm account with access to the @vortano scope
```

## Notes

- Estimates (earnings) are illustrative, not guarantees.
- MIT licensed. Part of the open-source Vortano V2 repo:
  https://github.com/vortanoofficial/vortano-v2
