# Vortano V2

**The on-chain compute marketplace for the intelligence economy — built on Robinhood Chain.**

Vortano turns idle GPU & NPU capacity into a decentralized compute network: providers
rent out real accelerators, renters pay per-second, and every job settles in USDG on
Robinhood Chain. `$VRTN` is the coordination asset — it settles jobs, bonds providers,
governs the protocol, and shares protocol revenue with stakers.

- 🌐 Live site: **https://vortano.ai**
- 📈 `$VRTN` on Dexscreener: https://dexscreener.com/robinhood/0x1a9b626ba0be56f0cfb3e55d4d0b71c942f0a461
- 🐦 X: **@Vortanoofficial**

---

## ⚠️ Project status — read this first

This repository is the **V2 web application** (the site at vortano.ai). We build in public,
so we're being equally public about where things stand:

**Live today**
- The full product experience: marketplace, provider tools, AI-wallet demo, TANO (the
  on-chain agent), earnings/rent/staking/agent-builder interfaces.
- **Real live market data** for `$VRTN` (Dexscreener) and ETH/USDC (CoinGecko).

**On the roadmap (not yet on-chain)**
- Smart contracts for renting, staking, provider bonding and settlement.
- Mainnet wiring to Robinhood Chain (the wallet layer currently targets a placeholder
  network in [`src/lib/wagmi.ts`](src/lib/wagmi.ts)).
- On-chain rewards, slashing and governance.

Interactive figures shown in the UI (earnings, staking APY, rent cost, pool stats) are
**estimates and previews** at the live token price — they are labelled as such in-product
and are **not** guarantees or live on-chain balances. We'd rather ship transparently and
grow into the protocol than overstate what's wired up today.

---

## Tech stack

- **Next.js 15** (App Router) · **React 19** · **TypeScript**
- **Tailwind CSS v4**
- **wagmi v2** + **viem** + **@tanstack/react-query** (wallet layer)
- **three.js** + **@react-three/fiber** + **drei** (TANO, the 3D agent)

## Getting started

```bash
npm install --legacy-peer-deps
npm run dev
```

Then open http://localhost:3000.

```bash
npm run build   # production build (runs typecheck + lint)
npm start       # serve the production build
```

## Project layout

```
src/
  app/          # routes, layout, whitepaper & platformpaper pages
  components/   # UI + interactive modules (marketplace, wallet, TANO, staking, …)
  lib/          # market data, node data, wagmi config
public/         # brand assets, token icons
```

## Deployment

The app builds to a **Next.js standalone server** and ships as a Docker image
(see [`Dockerfile`](Dockerfile)):

```bash
docker build -t vortano-web .
docker run -p 3000:3000 vortano-web
```

Any runtime secrets are supplied via environment variables and are **never** committed.

---

## Contributing

We ship every day. Issues and PRs are welcome — especially around the contract layer as we
move on-chain. Open an issue to discuss anything substantial first.

## License

© Vortano. All rights reserved (a formal open-source license may be added later).
