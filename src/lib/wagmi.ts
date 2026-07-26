import { http, createConfig } from "wagmi";
import { mainnet, base } from "wagmi/chains";
import { injected } from "wagmi/connectors";
import { defineChain } from "viem";

/**
 * Robinhood Chain — the real mainnet (L2 on Arbitrum Orbit, settles on Ethereum).
 * Verified against the ethereum-lists registry: chainId 4663, official RPC and
 * Blockscout explorer. Everything in the app reads from here.
 */
export const robinhoodChain = defineChain({
  id: 4663,
  name: "Robinhood Chain",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.mainnet.chain.robinhood.com"] },
  },
  blockExplorers: {
    default: { name: "Robinhood Explorer", url: "https://robinhoodchain.blockscout.com" },
  },
});

export const wagmiConfig = createConfig({
  chains: [robinhoodChain, base, mainnet],
  connectors: [injected()],
  transports: {
    [robinhoodChain.id]: http(),
    [base.id]: http(),
    [mainnet.id]: http(),
  },
  ssr: true,
});

declare module "wagmi" {
  interface Register {
    config: typeof wagmiConfig;
  }
}
