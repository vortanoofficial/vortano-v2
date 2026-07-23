"use client";

import { useEffect, useState } from "react";
import { ShineImage } from "./ShineImage";
import { ConnectWallet } from "./ConnectWallet";
import { TanoAgent } from "./TanoAgent";
import { VrtnPill } from "./VrtnPill";
import { NAV } from "@/lib/data";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? "border-b border-accent/15 bg-bg/80 backdrop-blur-xl" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        {/* Logo */}
        <a href="#top" id="vortano-logo" className="flex items-center">
          <ShineImage
            src="/vortano-lockup.png"
            alt="Vortano"
            width={1000}
            height={340}
            priority
            className="h-8 w-auto sm:h-9"
          />
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <a
              key={n.label}
              href={n.href}
              className="rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:text-ink"
            >
              {n.label}
            </a>
          ))}
        </nav>

        {/* Right cluster */}
        <div className="flex items-center gap-2.5">
          <VrtnPill />
          <ConnectWallet />
          <button
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
            className="grid h-9 w-9 place-items-center rounded-lg border border-accent/15 md:hidden"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="border-t border-accent/15 bg-bg/95 px-5 py-3 md:hidden">
          {NAV.map((n) => (
            <a
              key={n.label}
              href={n.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm text-muted hover:text-ink"
            >
              {n.label}
            </a>
          ))}
        </nav>
      )}

      {/* TANO — AI agent */}
      <TanoAgent />
    </header>
  );
}
