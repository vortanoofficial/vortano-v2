import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Vortano · Ship Log — building in public",
  description:
    "Every feature Vortano has shipped, logged in public. Vortano V2 is open-source on GitHub and built on Robinhood Chain.",
};

type Entry = {
  title: string;
  desc: string;
  tag: "Milestone" | "Marketplace" | "Provider" | "Token" | "Agent" | "Wallet";
  isNew?: boolean;
};

// Newest first. Every entry below is genuinely live on vortano.ai (or, for the
// open-source milestone, on GitHub). This log is a factual record — nothing here
// is aspirational; the roadmap lives in the whitepaper.
const LOG: Entry[] = [
  { title: "Open-sourced the V2 app on GitHub", tag: "Milestone", isNew: true,
    desc: "The full vortano.ai web app is now public — with an honest README on what's live vs on the roadmap." },
  { title: "Staking dashboard", tag: "Token",
    desc: "Pool stats, stake-by-lock tiers and a sample position whose USDG rewards stream every second." },
  { title: "Provider onboarding wizard", tag: "Provider",
    desc: "Four guided steps from your GPU to streaming USDG — bond priced live in $VRTN." },
  { title: "Agent Builder", tag: "Agent",
    desc: "Compose your own on-chain agent: role, hardware, spend cap → a deployable agent.spec." },
  { title: "Rent flow", tag: "Marketplace",
    desc: "Click any node → pick GPUs and hours → the exact USDG cost, 2.5% fee shown, no hidden markup." },
  { title: "Marketplace filters", tag: "Marketplace",
    desc: "Filter by accelerator class, region and availability; sort by price, VRAM or TFLOPs." },
  { title: "Live $VRTN ticker", tag: "Token",
    desc: "Real Dexscreener price and 24h change in the navbar, on every page." },
  { title: "Global Coverage map", tag: "Marketplace",
    desc: "Six regions across four continents — tap any to see the accelerator, price and uptime." },
  { title: "Talk to TANO", tag: "Agent",
    desc: "TANO now answers your questions — sourced from the whitepaper, so it can't make things up." },
  { title: "Staking preview", tag: "Token",
    desc: "Model a stake and see the estimated revenue share, settled in USDG." },
  { title: "Provider earnings calculator", tag: "Provider",
    desc: "Model your hardware and see estimated monthly USDG, after the 2.5% protocol fee." },
  { title: "TANO — the on-chain agent", tag: "Agent",
    desc: "A real-time 3D agent that walks out to greet you and gets a look unique to your wallet." },
  { title: "AI Wallet you can talk to", tag: "Wallet",
    desc: "Say “every day at 20:00, swap $500 USDG → VRTN” and it schedules and executes it." },
];

const TAG_STYLE: Record<Entry["tag"], string> = {
  Milestone: "border-positive/40 bg-positive/10 text-positive",
  Marketplace: "border-accent/30 bg-accent/[0.08] text-accent-pale",
  Provider: "border-accent/30 bg-accent/[0.08] text-accent-pale",
  Token: "border-accent/30 bg-accent/[0.08] text-accent-pale",
  Agent: "border-accent/30 bg-accent/[0.08] text-accent-pale",
  Wallet: "border-accent/30 bg-accent/[0.08] text-accent-pale",
};

export default function ChangelogPage() {
  return (
    <main className="relative min-h-screen">
      <div className="bg-shine" aria-hidden />
      <div className="grain" aria-hidden />

      <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-24">
        <Link href="/" className="font-mono text-xs text-dim transition-colors hover:text-accent-pale">
          ← vortano.ai
        </Link>

        <div className="mt-8 flex items-center gap-3">
          <span className="index-plate">LOG</span>
          <span className="eyebrow">Building in public</span>
          <span className="rule-gold h-px flex-1" />
        </div>

        <h1 className="display mt-5 text-4xl sm:text-5xl">
          Every ship, <em>logged.</em>
        </h1>
        <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">
          We ship every day and record it here. The code behind all of it is public —
          read it on{" "}
          <a
            href="https://github.com/vortanoofficial/vortano-v2"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-pale underline decoration-accent/40 underline-offset-4 hover:decoration-accent"
          >
            GitHub
          </a>
          . The forward-looking roadmap lives in the{" "}
          <Link href="/whitepaper" className="text-accent-pale underline decoration-accent/40 underline-offset-4 hover:decoration-accent">
            whitepaper
          </Link>
          .
        </p>

        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/[0.05] px-3.5 py-1.5 font-mono text-[11px] text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-positive animate-pulse-dot" />
          {LOG.length} ships and counting
        </div>

        {/* timeline */}
        <ol className="relative mt-12 space-y-6 border-l border-accent/15 pl-6">
          {LOG.map((e, i) => (
            <li key={i} className="relative">
              <span
                className={`absolute -left-[31px] top-1.5 h-3 w-3 rounded-full border-2 ${
                  e.isNew ? "border-positive bg-positive/40" : "border-accent/50 bg-bg"
                }`}
              />
              <div className="panel rounded-2xl p-5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span
                    className={`rounded-md border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${TAG_STYLE[e.tag]}`}
                  >
                    {e.tag}
                  </span>
                  {e.isNew && (
                    <span className="rounded-md border border-positive/40 bg-positive/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-positive">
                      New
                    </span>
                  )}
                  <h2 className="text-base font-semibold text-ink">{e.title}</h2>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted">{e.desc}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-14 rounded-2xl border border-accent/15 bg-accent/[0.04] p-6 text-center">
          <p className="text-sm text-muted">
            The list keeps growing — one ship at a time, in public.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://github.com/vortanoofficial/vortano-v2"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold rounded-2xl px-5 py-2.5 text-sm font-semibold"
            >
              View the code
            </a>
            <Link href="/" className="btn-ghost rounded-2xl px-5 py-2.5 text-sm font-semibold">
              Back to vortano.ai
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
