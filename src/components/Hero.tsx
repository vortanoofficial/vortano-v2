"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ShineImage } from "./ShineImage";
import { Reveal } from "./Reveal";
import { RelaunchBanner } from "./RelaunchBanner";
import { HERO_STATS, PRICE_TICKER, CHAIN } from "@/lib/data";

function HeroLogo() {
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    const forceReplay = /[?&]tano/.test(window.location.search);
    try {
      if (!forceReplay && sessionStorage.getItem("tano-intro-v2")) {
        setRevealed(true);
        return;
      }
    } catch {}
    const on = () => setRevealed(true);
    window.addEventListener("tano-reached-emblem", on);
    return () => window.removeEventListener("tano-reached-emblem", on);
  }, []);
  return (
    <div className="mb-6 flex items-center gap-3">
      <span id="hero-emblem" className="inline-flex">
        <ShineImage
          src="/vortano-emblem.png"
          alt="Vortano"
          width={640}
          height={640}
          priority
          className="h-16 w-auto drop-shadow-[0_8px_28px_rgba(201,162,75,0.45)]"
        />
      </span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/vortano-wordmark.png"
        alt="VORTANO"
        className="h-8 w-auto sm:h-9"
        style={{
          opacity: revealed ? 1 : 0,
          transform: revealed ? "translateX(0)" : "translateX(-12px)",
          transition: "opacity .6s ease, transform .6s cubic-bezier(.2,.7,.2,1)",
        }}
      />
    </div>
  );
}

function CopyCA() {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(CHAIN.contract).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    });
  };
  return (
    <div className="lux beam rounded-3xl px-5 py-4">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <span className="shine-gold text-[11px] font-bold uppercase tracking-[0.18em] sm:text-xs">
          Official Contract Address
        </span>
        <span className="inline-flex items-center gap-2">
          <Image
            src="/robinhood.png"
            alt="Robinhood"
            width={256}
            height={256}
            className="h-9 w-9 drop-shadow-[0_2px_10px_rgba(163,230,53,0.45)]"
          />
          <span className="text-xs font-medium text-muted">On {CHAIN.name}</span>
        </span>
      </div>
      <div className="mt-3 flex items-center gap-3 rounded-2xl border border-accent/15 bg-black/50 px-3.5 py-2.5">
        <code className="min-w-0 flex-1 truncate font-robo text-[13px] tracking-[0.04em] text-accent-pale sm:text-[15px]">
          {CHAIN.contract}
        </code>
        <button
          onClick={copy}
          className="btn-gold shrink-0 rounded-lg px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}

function PriceMarquee() {
  const row = [...PRICE_TICKER, ...PRICE_TICKER];
  return (
    <div className="mask-x relative overflow-hidden border-y border-accent/15 py-3">
      <div className="flex w-max animate-marquee gap-8">
        {row.map((t, i) => (
          <div key={i} className="flex items-center gap-2 whitespace-nowrap font-mono text-sm">
            <span className="text-muted">{t.name}</span>
            <span className="text-ink">{t.price}</span>
            <span className={t.up ? "text-positive" : "text-negative"}>{t.delta}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-28 sm:pt-36">
      {/* backdrop */}
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-70" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[560px] glow-radial" />
      <Image
        src="/vortano-emblem-glow.png"
        alt=""
        aria-hidden
        width={1600}
        height={1600}
        priority
        className="pointer-events-none absolute -top-24 right-[-14%] hidden w-[720px] max-w-none opacity-25 mix-blend-screen lg:block"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <RelaunchBanner />
        <Reveal>
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/[0.06] px-3.5 py-1.5 text-xs text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-positive animate-pulse-dot" />
              Live on {CHAIN.name} · 14,832 GPU + NPU nodes online
            </div>
            <a
              href="#wallet"
              className="group inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/[0.1] px-3 py-1.5 text-xs font-medium text-accent-pale transition-colors hover:border-accent/70"
            >
              <span className="rounded-full bg-accent/30 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-ink">
                New
              </span>
              AI Wallet — talk to swap
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
            </a>
          </div>
        </Reveal>

        <div className="mt-8 grid items-start gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Left */}
          <div className="min-w-0">
            <Reveal delay={0.04}>
              <HeroLogo />
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="display text-5xl leading-[1.02] sm:text-6xl md:text-7xl">
                The engine of the <br className="hidden sm:block" />
                <em>on-chain intelligence</em> economy
              </h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
                A {CHAIN.name}-native compute layer that turns idle GPU &amp; NPU
                capacity into a permissionless supercomputer for the AI age. Run
                inference, train models, deploy{" "}
                <strong className="font-bold text-ink">autonomous agents</strong> —
                settled trustlessly in USDG on {CHAIN.name}.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="#marketplace"
                  className="btn-gold rounded-2xl px-5 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5"
                >
                  Rent the supercomputer
                </a>
                <a
                  href="#shell"
                  className="btn-ghost rounded-2xl px-5 py-3 text-sm font-semibold"
                >
                  Connect &amp; browse
                </a>
              </div>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="mt-8 max-w-xl">
                <CopyCA />
              </div>
            </Reveal>
          </div>

          {/* Right — stat panel */}
          <Reveal delay={0.2} className="min-w-0">
            <div className="panel beam rounded-3xl p-6">
              <div className="flex items-center justify-between">
                <span className="eyebrow">Network · live</span>
                <span className="inline-flex items-center gap-1.5 font-mono text-xs text-positive">
                  <span className="h-1.5 w-1.5 rounded-full bg-positive animate-pulse-dot" />
                  online
                </span>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-accent/25">
                {HERO_STATS.map((s) => (
                  <div key={s.label} className="min-w-0 bg-panel p-4 sm:p-5">
                    <div className="truncate font-mono text-xl font-semibold text-ink sm:text-2xl">
                      {s.value}
                      {s.unit && (
                        <span className="ml-1 text-sm font-normal text-dim">{s.unit}</span>
                      )}
                    </div>
                    <div className="mt-1 text-xs uppercase tracking-wide text-dim">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between rounded-2xl border border-accent/15 bg-accent/[0.05] px-4 py-3 font-mono text-xs text-muted">
                <span>block {CHAIN.block}</span>
                <span>gas {CHAIN.gas}</span>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Price marquee */}
        <div className="mt-14">
          <PriceMarquee />
        </div>
      </div>
    </section>
  );
}
