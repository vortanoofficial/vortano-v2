import type { Metadata } from "next";
import { PaperShell, Sec, Callout, Metrics, Bullets } from "@/components/paper";
import { CHAIN } from "@/lib/data";

export const metadata: Metadata = {
  title: "Vortano · Platformpaper — utility & how the platform works",
  description:
    "The Vortano platformpaper: how to rent compute, deploy models and agents, automate swaps with the AI Wallet, become a provider, and how $VRTN and USDG power every action on Robinhood Chain.",
};

export default function PlatformpaperPage() {
  return (
    <PaperShell
      current="platformpaper"
      kicker="Vortano · Platformpaper · Utility &amp; usage"
      title={<>Everything you can <em>do with Vortano.</em></>}
      lede="A practical guide to the platform: rent a supercomputer by the second, deploy models and autonomous agents, automate swaps by talking to your wallet, and monetize idle silicon — every action settled transparently on Robinhood Chain."
    >
      <Sec n="01" title="What the platform does">
        <p>
          Vortano turns compute into a liquid, on-chain commodity. Whether you are a builder who
          needs GPUs, a trader who wants automation, or a provider with idle hardware, the platform
          gives you a single, transparent surface to act.
        </p>
        <Metrics
          items={[
            ["Rent", "Compute nodes"],
            ["Build", "Models &amp; agents"],
            ["Automate", "AI Wallet"],
            ["Earn", "Provide capacity"],
          ]}
        />
      </Sec>

      <Sec n="02" title="Getting started">
        <Bullets
          items={[
            <><strong>Install the Vortano AI Wallet</strong> — the Chrome extension auto-detects Vortano via EIP-6963.</>,
            <><strong>Fund it</strong> — deposit <strong>USDG</strong> (or USDC / ETH / VRTN via auto-swap) into the rental escrow.</>,
            <><strong>Connect</strong> — one click links your wallet to vortano.org. No KYC for jobs under 10,000 USDG.</>,
          ]}
        />
      </Sec>

      <Sec n="03" title="Renting compute">
        <p>
          Open the <strong>Marketplace</strong>, filter by accelerator class, memory, region or
          framework, and rent in under nine seconds. Payment streams per second from your escrow —
          pause, resume, or fail over to a hot replica at any time. Receipts settle automatically on{" "}
          {CHAIN.name}.
        </p>
        <Callout>
          Typical rates: RTX 4090 from <strong>0.41</strong> · A100 80GB <strong>1.42</strong> ·
          H100 SXM5 <strong>2.18</strong> USDG / GPU·hour — 5–10× below hyperscaler list pricing.
        </Callout>
      </Sec>

      <Sec n="04" title="Deploying models &amp; agents">
        <p>
          Use the in-browser <strong>Live Shell Terminal</strong> (the <strong>voltra CLI</strong>)
          or the SDK to spin up the <strong>AI Model Suite</strong>: high-throughput text
          generation, image synthesis, and <strong>autonomous agents</strong> that transact and
          self-execute on-chain. Every output is cryptographically attributable.
        </p>
        <Bullets
          items={[
            <><code className="font-mono text-accent-pale">ls gpu</code> — list available accelerators</>,
            <><code className="font-mono text-accent-pale">rent h100 -h 4</code> — reserve a node for four hours</>,
            <><code className="font-mono text-accent-pale">deploy llama-3</code> — schedule a model to the mesh</>,
          ]}
        />
      </Sec>

      <Sec n="05" title="Automating with the AI Wallet">
        <p>
          The wallet&apos;s standout utility is <strong>AI &amp; scheduled swaps</strong>. Describe
          what you want in plain words and Vortano schedules and executes it:
        </p>
        <Callout>
          <span className="font-mono text-accent-pale">›</span> “Every day at 20:00, swap $500 USDG →
          VRTN, keep max slippage 1%.” — armed as a recurring order, executed by capped, revocable
          session keys.
        </Callout>
        <p>
          Supports recurring (DCA), limit and conditional orders. Policies bound every automation —
          token allowlist, per-transaction and daily caps, slippage limits and expiry — so a bot can
          never exceed what you approved, and your seed phrase never signs on its behalf.
        </p>
      </Sec>

      <Sec n="06" title="Becoming a provider">
        <Bullets
          items={[
            <><strong>Install the agent</strong> — <code className="font-mono text-accent-pale">curl vortano.org/agent | sh</code>, isolated in a container.</>,
            <><strong>Post a bond in VRTN</strong> — ~$200 per accelerator, recovered on graceful exit.</>,
            <><strong>Set your floor price</strong> — the market discovers price; you set the refusal threshold.</>,
            <><strong>Stream revenue</strong> — USDG streamed to your wallet every block. Est. ~$1,210 / H100 / month at 78% utilization, after the 2.5% protocol fee. Model your own hardware with the live calculator on vortano.ai — estimates only, not a guarantee.</>,
          ]}
        />
      </Sec>

      <Sec n="07" title="Where $VRTN is used">
        <Bullets
          items={[
            <><strong>Bond</strong> — providers stake VRTN as collateral; misbehavior is slashed.</>,
            <><strong>Govern</strong> — holders vote on fees, slashing rules and treasury.</>,
            <><strong>Revenue share</strong> — stakers earn a slice of every rental in real time.</>,
            <><strong>Pay</strong> — settle jobs directly, or auto-swap to USDG at checkout.</>,
          ]}
        />
      </Sec>

      <Sec n="08" title="Fees &amp; settlement">
        <p>
          The protocol fee is a transparent <strong>2.5%</strong>. Settlement is in <strong>USDG</strong>{" "}
          on {CHAIN.name} at ~{CHAIN.gas} gas, streamed via Superfluid. Every rental, payout and
          governance action is visible on Robinscan — the platform&apos;s books are open by design,
          which is exactly what serious builders and long-term holders should expect.
        </p>
      </Sec>

      <p className="mt-12 border-t border-accent/10 pt-6 text-xs leading-relaxed text-dim">
        This guide describes platform functionality and $VRTN utility. It is informational, not
        investment advice. Verify contracts, rates and on-chain data independently before use.
      </p>
    </PaperShell>
  );
}
