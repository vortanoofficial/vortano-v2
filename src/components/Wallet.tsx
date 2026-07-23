import Image from "next/image";
import { SectionHeader } from "./SectionHeader";
import { Reveal } from "./Reveal";
import { ShineImage } from "./ShineImage";
import { WalletBalance, WalletTokens } from "./WalletLive";
import { AiWalletDemo } from "./AiWalletDemo";
import { CHAIN } from "@/lib/data";

const ACTIONS = [
  { label: "Receive", icon: <path d="M12 4v13m0 0l-5-5m5 5l5-5" strokeLinecap="round" strokeLinejoin="round" /> },
  { label: "Send", icon: <path d="M12 20V7m0 0l-5 5m5-5l5 5" strokeLinecap="round" strokeLinejoin="round" /> },
  { label: "Swap", icon: <path d="M7 8h11m0 0l-3-3m3 3l-3 3M17 16H6m0 0l3 3m-3-3l3-3" strokeLinecap="round" strokeLinejoin="round" /> },
  { label: "Buy", icon: <path d="M12 6v12M6 12h12" strokeLinecap="round" /> },
];

const FEATURES = [
  {
    title: "AI & scheduled swaps",
    desc: "Say it in plain words — “every day at 20:00, swap $500 USDG → VRTN.” Vortano schedules and executes it for you.",
    icon: <path d="M12 3v3m0 12v3M5.6 5.6l2.1 2.1m8.6 8.6l2.1 2.1M3 12h3m12 0h3M5.6 18.4l2.1-2.1m8.6-8.6l2.1-2.1" strokeLinecap="round" />,
  },
  {
    title: "Self-custodial by design",
    desc: "Your seed phrase is encrypted on your device and never leaves it. No accounts, no custody, no middleman.",
    icon: <path d="M12 3l7 3v5c0 4.4-3 8.3-7 10-4-1.7-7-5.6-7-10V6l7-3z" />,
  },
  {
    title: "Live balances & prices",
    desc: "Track ETH, USDG, USDC and VRTN with real-time prices pulled straight from the Vortano DEX and on-chain.",
    icon: <path d="M4 18l5-6 4 3 6-8M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />,
  },
  {
    title: "One-click connect to Vortano",
    desc: "Auto-detected by vortano.org via EIP-6963 — rent compute, deploy agents and stream payments from the wallet.",
    icon: <path d="M9 7H6a4 4 0 000 8h3m6-8h3a4 4 0 010 8h-3M8 11h8" strokeLinecap="round" />,
  },
];

export function Wallet() {
  return (
    <section id="wallet" className="relative border-y border-accent/15 bg-bg-soft/50">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
        <SectionHeader
          index="10"
          eyebrow="Vortano Wallet · AI-powered · Chrome extension"
          title={<>The wallet you can <em>talk to.</em></>}
        >
          A <strong className="font-bold text-ink">self-custodial wallet you can just talk to</strong>.
          Say “every day at 20:00, swap $500 USDG → VRTN” and Vortano schedules and
          executes it for you — on top of live balances, send &amp; receive, and
          one-click connect to compute. All on {CHAIN.name}, keys never leaving
          your device.
        </SectionHeader>

        <div className="mt-12 grid items-start gap-8 lg:grid-cols-2">
          {/* Wallet popup mockup (live) */}
          <Reveal>
            <div className="mx-auto w-full max-w-[380px]">
              <div className="wallet-card relative overflow-hidden rounded-[30px] p-5">
                <ShineImage
                  src="/vortano-emblem.png"
                  alt=""
                  width={640}
                  height={640}
                  className="pointer-events-none absolute -bottom-12 -right-10 w-60 rotate-6 opacity-[0.07]"
                />
                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <ShineImage src="/vortano-emblem.png" alt="Vortano Wallet" width={640} height={640} className="h-7 w-auto" />
                      <span className="text-[15px] font-semibold">Vortano Wallet</span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/25 bg-accent/[0.08] px-2.5 py-1 text-[11px] font-medium text-accent-pale">
                      <span className="h-1.5 w-1.5 rounded-full bg-positive animate-pulse-dot" />
                      {CHAIN.name}
                    </span>
                  </div>

                  <div className="wallet-balance relative mt-4 overflow-hidden rounded-[24px] px-5 py-6 text-center">
                    <Image
                      src="/vortano-emblem.png"
                      alt=""
                      aria-hidden
                      width={640}
                      height={640}
                      className="pointer-events-none absolute left-1/2 top-1/2 w-52 -translate-x-1/2 -translate-y-1/2 opacity-[0.13] mix-blend-overlay"
                    />
                    <div className="relative z-10">
                      <span className="wallet-chip mx-auto inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[11px]">
                        0x7Ae2…3f9C
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V5a2 2 0 012-2h8" />
                        </svg>
                      </span>
                      <div className="mt-3 text-[13px] font-medium text-[#4a3611]">Total balance</div>
                      <WalletBalance />
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-4 gap-2.5">
                    {ACTIONS.map((a) => (
                      <button key={a.label} className="flex flex-col items-center gap-1.5">
                        <span className="wallet-action grid h-12 w-12 place-items-center rounded-2xl text-accent-pale">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">{a.icon}</svg>
                        </span>
                        <span className="text-[11px] text-muted">{a.label}</span>
                      </button>
                    ))}
                  </div>

                  <div className="mt-5">
                    <div className="mb-1 flex items-center justify-between px-1.5 text-[11px] font-medium text-dim">
                      <span>Tokens</span>
                      <span className="inline-flex items-center gap-1 text-positive">
                        <span className="h-1 w-1 rounded-full bg-positive animate-pulse-dot" /> live
                      </span>
                    </div>
                    <WalletTokens />
                  </div>
                </div>
              </div>
              <p className="mt-3 text-center font-mono text-[11px] text-dim">
                Preview · live prices · Vortano Wallet v0.1
              </p>
            </div>
          </Reveal>

          {/* AI Swaps — interactive demo */}
          <Reveal delay={0.1} className="min-w-0">
            <AiWalletDemo />
          </Reveal>
        </div>

        {/* Features */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.06}>
              <div className="panel h-full rounded-3xl p-6">
                <span className="grid h-11 w-11 place-items-center rounded-2xl border border-accent/25 bg-accent/10 text-accent-pale">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">{f.icon}</svg>
                </span>
                <h3 className="mt-4 text-base font-semibold text-ink">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button className="btn-gold inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 2v6M12 8l4-3M12 8L8 5M4 12h16M6 12v6a2 2 0 002 2h8a2 2 0 002-2v-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Add to Chrome
            </button>
            <button className="btn-ghost rounded-xl px-5 py-3 text-sm font-semibold">Join the waitlist</button>
            <span className="rounded-full border border-accent/20 bg-accent/[0.05] px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-dim">
              Extension · coming soon
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
