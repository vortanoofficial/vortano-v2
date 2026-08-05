import type { Metadata } from "next";
import { PaperShell, Sec, Callout, Metrics, Bullets } from "@/components/paper";
import { CHAIN } from "@/lib/data";

export const metadata: Metadata = {
  title: "Vortano · Whitepaper — the on-chain intelligence economy",
  description:
    "The Vortano whitepaper: a Robinhood Chain-native protocol turning idle GPU & NPU capacity into a permissionless, verifiable compute economy settled in USDG, powered by the $VRTN token.",
};

export default function WhitepaperPage() {
  return (
    <PaperShell
      current="whitepaper"
      kicker="Vortano · Whitepaper · v2.0 · July 2026"
      title={<>The engine of the <em>on-chain intelligence economy.</em></>}
      lede="Vortano is a Robinhood Chain-native protocol that turns idle GPU & NPU capacity into a permissionless, cryptographically verifiable supercomputer — where every job, payment and provider claim settles transparently on-chain."
    >
      <Sec n="01" title="Abstract">
        <p>
          The AI era runs on compute, yet access to it is concentrated in a handful of
          hyperscalers — expensive, gated, and opaque. <strong>Vortano</strong> replaces that
          model with an open marketplace: providers contribute GPU, NPU and TPU capacity,
          developers rent it by the second, and every transaction settles trustlessly on{" "}
          <strong>{CHAIN.name}</strong>. The network is coordinated by the <strong>$VRTN</strong>{" "}
          token, secured by slashing bonds and fraud proofs, and settled in <strong>USDG</strong>,
          the Global Dollar native to the Robinhood ecosystem.
        </p>
        <Callout>
          Vortano is <strong>relaunching on flap.sh</strong>. Every existing $VRTN holder receives
          the new token <strong>1:1 through a snapshot airdrop</strong> — you keep your tokens and
          receive the new one automatically, no action required.
          <span className="mt-3 flex flex-wrap gap-3 font-mono text-xs">
            <a href="https://flap.sh" target="_blank" rel="noopener noreferrer" className="text-accent-pale hover:text-ink">flap.sh ↗</a>
          </span>
        </Callout>
      </Sec>

      <Sec n="02" title="The problem">
        <Bullets
          items={[
            <><strong>Scarcity &amp; cost.</strong> On-demand H100 capacity at hyperscalers runs 5–10× the price of the silicon itself — margin, not value.</>,
            <><strong>Gatekeeping.</strong> Quotas, waitlists and KYC walls exclude builders precisely when they need to move fastest.</>,
            <><strong>Opacity.</strong> Centralized providers offer no cryptographic proof that a job ran, on which hardware, or that output was untampered.</>,
            <><strong>Idle supply.</strong> Millions of GPUs sit under-utilized in data centers, studios and rigs with no permissionless way to monetize them.</>,
          ]}
        />
      </Sec>

      <Sec n="03" title="The Vortano protocol">
        <p>
          Vortano is a two-sided compute market with settlement, reputation and governance
          written to {CHAIN.name}. <strong>Providers</strong> post capacity and a slashing bond;{" "}
          <strong>developers</strong> filter nodes by class, memory, region and framework, then
          stream payment per second from an on-chain escrow. Bad actors are burned; honest
          providers earn a continuous USDG stream.
        </p>
        <Metrics
          items={[
            ["Accelerators", "GPU · TPU · NPU"],
            ["Settlement", "USDG on-chain"],
            ["Pricing", "Order book"],
            ["Trust", "Bonds + proofs"],
          ]}
        />
      </Sec>

      <Sec n="04" title="Architecture">
        <Bullets
          items={[
            <><strong>Compute Marketplace</strong> — verified nodes, slashing-bonded, rented per second from escrow.</>,
            <><strong>Hybrid NPU + GPU Router</strong> — routes edge inference to efficient NPUs and heavy training to GPUs, driving cost-per-token to industry-leading lows.</>,
            <><strong>AI Model Suite</strong> — text generation, image synthesis, autonomous agents and an AI-native OS, all running on decentralized compute.</>,
            <><strong>Verifiable inference</strong> — optional zk-fraud proofs make every output cryptographically attributable.</>,
            <><strong>Network Pulse</strong> — job intents, payment streams and slashings stream live and are auditable by anyone.</>,
          ]}
        />
      </Sec>

      <Sec n="05" title="Settlement &amp; stablecoins">
        <p>
          Vortano settles in <strong>USDG</strong> — the Global Dollar, native to the Robinhood
          ecosystem — streamed to wallets every block via Superfluid. <strong>USDC</strong>, ETH
          and VRTN are accepted through auto-swap, so anyone can pay in what they hold while the
          network settles in a single, ecosystem-aligned unit of account.
        </p>
      </Sec>

      <Sec n="06" title="The $VRTN token">
        <p>
          <strong>$VRTN</strong> is the coordination asset of the network: it settles jobs, bonds
          every provider, governs every protocol parameter, and shares protocol revenue with
          stakers in real time.
        </p>
        <Metrics
          items={[
            ["Standard", "ERC-20 · 18 dec"],
            ["Chain", CHAIN.name],
            ["Total supply", "1.0B VRTN"],
            ["Status", "Bonded · live"],
          ]}
        />
        <p className="font-mono text-xs text-dim">Contract · new token published at the flap.sh relaunch</p>
        <p className="mt-2 font-mono text-xs">
          <a href="https://flap.sh" target="_blank" rel="noopener noreferrer" className="text-accent-pale hover:text-ink">Relaunching on flap.sh ↗</a>
        </p>
        <p className="mt-4">
          <strong>Distribution:</strong> Node providers 38% · Public sale 22% · DAO treasury 18% ·
          Core contributors 14% · Liquidity &amp; LPs 8%. Emissions and treasury spending are
          governed on-chain by VRTN holders.
        </p>
      </Sec>

      <Sec n="07" title="Provider economics">
        <p>
          Providers install a containerized agent, post a VRTN bond (~$200 per accelerator), set a
          refusal price, and begin earning. Revenue streams from escrow to the provider wallet
          every block; the protocol takes a transparent <strong>2.5%</strong> fee. Downtime or
          fraudulent output slashes the bond — aligning every participant with network integrity.
        </p>
      </Sec>

      <Sec n="08" title="Vortano AI Wallet">
        <p>
          The <strong>Vortano AI Wallet</strong> is a self-custodial browser extension you can talk
          to. Beyond live balances and send/receive, it turns plain language into on-chain action —
          <em> “every day at 20:00, swap $500 USDG → VRTN”</em> — executed by capped, allowlisted,
          revocable session keys. Your seed phrase never signs a bot; policies are enforced on-chain.
        </p>
      </Sec>

      <Sec n="09" title="Security &amp; trust">
        <Bullets
          items={[
            <><strong>Slashing bonds</strong> make dishonesty economically irrational.</>,
            <><strong>zk-fraud proofs</strong> make inference verifiable for jobs that require it.</>,
            <><strong>Session-key policies</strong> cap what any automation can ever do with user funds.</>,
            <><strong>Independent audits</strong> by Spearbit &amp; Trail of Bits, with contracts open on Robinscan.</>,
          ]}
        />
        <Callout>
          Every claim in this document is verifiable on-chain. Vortano is built for people who
          trust math over marketing — transparency is the product, not a promise.
        </Callout>
      </Sec>

      <Sec n="10" title="Roadmap">
        <Bullets
          items={[
            <><strong>Shipped</strong> — mainnet on {CHAIN.name}, GPU marketplace, Spearbit audit, $VRTN relaunching on flap.sh with a 1:1 holder airdrop.</>,
            <><strong>In progress</strong> — hybrid NPU + GPU router, AI model suite, Vortano AI Wallet.</>,
            <><strong>Planned</strong> — autonomous on-chain agents, AI-native OS, zk-fraud proofs, DAO governance v1.</>,
          ]}
        />
      </Sec>

      <p className="mt-12 border-t border-accent/10 pt-6 text-xs leading-relaxed text-dim">
        This document is informational and describes the Vortano protocol and $VRTN utility token.
        It is not investment advice or an offer of securities. Figures reflect on-chain and market
        data available at time of writing and may change. Always verify contracts and data
        independently before interacting with the protocol.
      </p>
    </PaperShell>
  );
}
