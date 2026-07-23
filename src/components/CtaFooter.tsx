import { ShineImage } from "./ShineImage";
import { ConnectWallet } from "./ConnectWallet";
import { Reveal } from "./Reveal";
import { FOOTER, CHAIN } from "@/lib/data";

export function CtaFooter() {
  return (
    <>
      {/* Final CTA */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />
        <div className="pointer-events-none absolute inset-x-0 bottom-[-200px] h-[520px] glow-radial" />
        <div className="relative mx-auto max-w-4xl px-5 py-28 text-center sm:px-8 sm:py-36">
          <Reveal>
            <ShineImage
              src="/vortano-emblem.png"
              alt="Vortano emblem"
              width={640}
              height={640}
              className="mx-auto mb-8 h-24 w-auto drop-shadow-[0_10px_40px_rgba(201,162,75,0.5)]"
            />
          </Reveal>
          <Reveal delay={0.04}>
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/[0.06] px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-widest text-accent-pale">
              <span className="h-1.5 w-1.5 rounded-full bg-positive animate-pulse-dot" />
              Mainnet · {CHAIN.name}
            </span>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="display mt-7 text-5xl sm:text-6xl md:text-7xl">
              The compute is decentralized. <br />
              <em>The terminal is live.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mx-auto mt-6 max-w-xl text-lg text-muted">
              This isn&apos;t a roadmap — it&apos;s the engine of the on-chain
              intelligence economy, and it&apos;s already running. Connect a wallet
              and ship.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <ConnectWallet className="px-6 py-3" />
              <a
                href="/whitepaper"
                className="btn-ghost rounded-2xl px-6 py-3 text-sm font-semibold"
              >
                Read the whitepaper
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-accent/15 bg-bg-soft">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <div>
              <ShineImage
                src="/vortano-lockup.png"
                alt="Vortano"
                width={1000}
                height={340}
                className="h-9 w-auto"
              />
              <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted">
                A {CHAIN.name}-native compute layer for the AI age — decentralized
                GPU + NPU, autonomous agents, settled trustlessly on {CHAIN.name}.
                Audited by Spearbit &amp; Trail of Bits.
              </p>
            </div>

            <FooterCol title="Protocol" items={FOOTER.protocol} />
            <FooterCol title="Developers" items={FOOTER.developers} />
            <FooterCol title="Community" items={FOOTER.community} />
          </div>

          <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-accent/15 pt-6 font-mono text-xs text-dim sm:flex-row sm:items-center">
            <span>Vortano Labs · 2026 · audited rev 0xC3.4a1f</span>
            <span>
              {CHAIN.name} · block {CHAIN.block} · gas {CHAIN.gas}
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}

const FOOTER_LINKS: Record<string, string> = {
  Whitepaper: "/whitepaper",
  Platformpaper: "/platformpaper",
  Marketplace: "#marketplace",
  "VRTN token": "#wallet",
};

function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <div className="eyebrow">{title}</div>
      <ul className="mt-4 space-y-2.5">
        {items.map((it) => (
          <li key={it}>
            <a href={FOOTER_LINKS[it] ?? "#"} className="text-sm text-muted transition-colors hover:text-ink">
              {it}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
