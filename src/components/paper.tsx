import type { ReactNode } from "react";
import { ShineImage } from "./ShineImage";
import { CHAIN } from "@/lib/data";

/** Shared shell (sticky header + footer) for the Whitepaper / Platformpaper pages. */
export function PaperShell({
  current,
  kicker,
  title,
  lede,
  children,
}: {
  current: "whitepaper" | "platformpaper";
  kicker: string;
  title: ReactNode;
  lede: string;
  children: ReactNode;
}) {
  const tab = (href: string, label: string, active: boolean) => (
    <a
      href={href}
      className={`rounded-lg px-3 py-2 text-sm transition-colors ${
        active ? "text-accent-pale" : "text-muted hover:text-ink"
      }`}
    >
      {label}
    </a>
  );

  return (
    <main className="relative min-h-screen">
      <div className="grain" aria-hidden />

      {/* Header toolbar */}
      <header className="sticky top-0 z-50 border-b border-accent/15 bg-bg/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5 sm:px-8">
          <a href="/" className="flex items-center">
            <ShineImage src="/vortano-lockup.png" alt="Vortano" width={1000} height={340} className="h-8 w-auto" />
          </a>
          <nav className="hidden items-center gap-1 sm:flex">
            {tab("/", "Home", false)}
            {tab("/whitepaper", "Whitepaper", current === "whitepaper")}
            {tab("/platformpaper", "Platformpaper", current === "platformpaper")}
          </nav>
          <a href="/#wallet" className="btn-gold rounded-lg px-4 py-2 text-sm font-semibold">
            Launch app
          </a>
        </div>
      </header>

      {/* Title block */}
      <section className="relative overflow-hidden border-b border-accent/12">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-60" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-64 glow-radial" />
        <div className="relative mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-24">
          <p className="eyebrow">{kicker}</p>
          <h1 className="display mt-4 text-4xl sm:text-5xl md:text-6xl">{title}</h1>
          <p className="mt-6 text-lg leading-relaxed text-muted">{lede}</p>
          <div className="mt-6 flex flex-wrap gap-2 font-mono text-[11px] text-dim">
            <span className="rounded-full border border-accent/15 px-2.5 py-1">{CHAIN.name}</span>
            <span className="rounded-full border border-accent/15 px-2.5 py-1">$VRTN · {(CHAIN.contract as string).length > 0 ? `${(CHAIN.contract as string).slice(0, 10)}…` : "relaunching on pools.trade"}</span>
            <span className="rounded-full border border-accent/15 px-2.5 py-1">Audited · Spearbit &amp; Trail of Bits</span>
          </div>
        </div>
      </section>

      {/* Body */}
      <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-20">{children}</div>

      {/* Footer */}
      <footer className="border-t border-accent/15 bg-bg-soft">
        <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-4 px-5 py-10 sm:flex-row sm:items-center sm:px-8">
          <ShineImage src="/vortano-lockup.png" alt="Vortano" width={1000} height={340} className="h-8 w-auto" />
          <div className="flex flex-wrap gap-4 text-sm text-muted">
            <a href="/" className="hover:text-ink">Home</a>
            <a href="/whitepaper" className="hover:text-ink">Whitepaper</a>
            <a href="/platformpaper" className="hover:text-ink">Platformpaper</a>
            <a href="/#wallet" className="hover:text-ink">AI Wallet</a>
          </div>
          <span className="font-mono text-xs text-dim">Vortano Labs · 2026</span>
        </div>
      </footer>
    </main>
  );
}

/** A numbered document section. */
export function Sec({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  return (
    <section className="scroll-mt-24 border-t border-accent/10 py-12 first:border-t-0 first:pt-0">
      <div className="flex items-center gap-3">
        <span className="index-plate">{n}</span>
        <h2 className="text-2xl font-bold text-ink sm:text-3xl">{title}</h2>
      </div>
      <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-muted [&_strong]:font-semibold [&_strong]:text-ink">
        {children}
      </div>
    </section>
  );
}

/** Highlighted callout / key point. */
export function Callout({ children }: { children: ReactNode }) {
  return (
    <div className="panel beam my-6 rounded-2xl p-5 text-[15px] leading-relaxed text-ink">
      {children}
    </div>
  );
}

/** A compact stat/metric grid. */
export function Metrics({ items }: { items: [string, string][] }) {
  return (
    <div className="my-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-accent/15 bg-accent/15 sm:grid-cols-4">
      {items.map(([k, v]) => (
        <div key={k} className="bg-panel p-4">
          <div className="text-[11px] uppercase tracking-wide text-dim">{k}</div>
          <div className="mt-1 font-mono text-sm font-semibold text-ink">{v}</div>
        </div>
      ))}
    </div>
  );
}

/** Bulleted list with gold markers. */
export function Bullets({ items }: { items: ReactNode[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((it, i) => (
        <li key={i} className="flex gap-2.5">
          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent-light" />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}
