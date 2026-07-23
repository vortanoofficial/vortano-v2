import { http, createConfig } from "wagmi";
import { mainnet, base } from "wagmi/chains";
import { injected } from "wagmi/connectors";
import { defineChain } from "viem";

/**
 * Robinhood Chain config.
 * ⚠️ Replace `id` and the RPC URL with the real Robinhood Chain values once you
 * have them (from the Robinhood Chain docs / your VPS RPC). Everything else in the
 * app already reads from here, so this is the single place to update.
 */
export const robinhoodChain = defineChain({
  id: 42161, // TODO: real Robinhood Chain id
  name: "Robinhood Chain",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://arb1.arbitrum.io/rpc"] }, // TODO: real Robinhood Chain RPC
  },
  blockExplorers: {
    default: { name: "Robinscan", url: "https://robinscan.io" },
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
