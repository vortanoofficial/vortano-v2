import { ShineImage } from "./ShineImage";
import { SectionHeader } from "./SectionHeader";
import { Reveal } from "./Reveal";
import { VrtnStats } from "./VrtnStats";
import { StakingPreview } from "./StakingPreview";
import { StakingDashboard } from "./StakingDashboard";
import { AddToWallet } from "./AddToWallet";
import { OnChainStats } from "./OnChainStats";
import { LiveTransfers } from "./LiveTransfers";
import { TOKEN_DIST } from "@/lib/data";

export function Token() {
  return (
    <section className="relative border-y border-accent/15 bg-bg-soft/50">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
        <SectionHeader index="11" eyebrow="Token · Launching on Robinhood Chain" title={<><em>$VRTN</em> — the compute credit of the network.</>}>
          Stake to provide GPU &amp; NPU nodes. Pay-as-you-go for inference,
          training and agents. Vote on slashing rules. Launching on Robinhood
          Chain mainnet via a fair-launch LBP.
        </SectionHeader>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_1fr]">
          {/* Token card */}
          <Reveal className="min-w-0">
            <div className="panel beam rounded-3xl p-7">
              <div className="flex items-center gap-4">
                <ShineImage
                  src="/vortano-emblem.png"
                  alt="Vortano"
                  width={640}
                  height={640}
                  className="h-14 w-auto drop-shadow-[0_6px_22px_rgba(201,162,75,0.45)]"
                />
                <div>
                  <div className="text-lg font-semibold text-ink">Vortano Token</div>
                  <div className="font-mono text-xs text-dim">ERC-20 · Robinhood Chain · 18 decimals</div>
                </div>
              </div>
              <p className="mt-6 text-sm leading-relaxed text-muted">
                $VRTN settles every job, bonds every provider and governs every
                protocol parameter. Holders earn a slice of each rental in
                real-time, streamed via Superfluid on Robinhood Chain.
              </p>
              <div className="mt-6">
                <VrtnStats />
              </div>
            </div>
          </Reveal>

          {/* Distribution */}
          <Reveal delay={0.1} className="min-w-0">
            <div className="panel beam rounded-3xl p-7">
              <div className="eyebrow">Token distribution</div>
              <ul className="mt-6 space-y-4">
                {TOKEN_DIST.map((d) => (
                  <li key={d.label}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted">{d.label}</span>
                      <span className="font-mono text-ink">{d.pct}%</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/6">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-accent to-accent-light"
                        style={{ width: `${d.pct}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-7 rounded-2xl border border-accent/15 bg-accent/[0.05] p-4 text-sm text-muted">
                Launching on Robinhood Chain mainnet · audited by{" "}
                <span className="text-accent-pale">Spearbit</span>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Real, verifiable on-chain stats from Robinhood Chain */}
        <Reveal className="mt-6 min-w-0">
          <OnChainStats />
        </Reveal>

        {/* Live real $VRTN transfers from the explorer */}
        <Reveal className="mt-6 min-w-0">
          <LiveTransfers />
        </Reveal>

        {/* Add network + token to wallet — genuinely functional, all users */}
        <Reveal className="mt-6 min-w-0">
          <AddToWallet />
        </Reveal>

        {/* Staking preview */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <Reveal className="min-w-0">
            <StakingPreview />
          </Reveal>
          <Reveal delay={0.1} className="min-w-0">
            <div className="panel h-full rounded-3xl p-7">
              <div className="eyebrow">Why stake</div>
              <h3 className="mt-3 text-xl font-semibold text-ink">
                Every job pays the people securing the mesh.
              </h3>
              <ul className="mt-6 space-y-4">
                {[
                  ["Revenue share, in real time", "Stakers earn a slice of every rental — protocol revenue settled in USDG, streamed as jobs complete."],
                  ["Secures the network", "Providers post a VRTN bond as collateral. Downtime or fraudulent output gets slashed; honest nodes get paid."],
                  ["Governance weight", "VRTN holders govern protocol parameters — fees, emissions and treasury spend — on-chain."],
                ].map(([t, d]) => (
                  <li key={t} className="flex gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    <div>
                      <div className="font-semibold text-ink">{t}</div>
                      <div className="mt-1 text-sm leading-relaxed text-muted">{d}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        {/* Live staking dashboard */}
        <Reveal className="mt-6 min-w-0">
          <StakingDashboard />
        </Reveal>
      </div>
    </section>
  );
}
