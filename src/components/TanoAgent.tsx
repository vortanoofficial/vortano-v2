"use client";

import { useEffect, useRef, useState } from "react";
import { useAccount } from "wagmi";
import dynamic from "next/dynamic";
import { TanoChat } from "./TanoChat";

const Tano3D = dynamic(() => import("./Tano3D").then((m) => m.Tano3D), {
  ssr: false,
  loading: () => <div className="h-full w-full" />,
});

const HAIRS = ["Bald", "Tuft", "Mohawk", "Spikes", "Bristles", "Curls", "Bangs", "Buns", "Tech-Fin"];

function hairFromAddress(addr: string): number {
  let h = 0;
  for (let i = 0; i < addr.length; i++) h = (h * 31 + addr.charCodeAt(i)) >>> 0;
  return 1 + (h % (HAIRS.length - 1));
}

let tanoIntroStarted = false;

function speakGreeting() {
  try {
    const synth = window.speechSynthesis;
    if (!synth) return;
    const u = new SpeechSynthesisUtterance("Hi, I'm TANO. I can help you with whatever you need here.");
    u.lang = "en-US";
    u.rate = 1.02;
    u.pitch = 1.12;
    const voices = synth.getVoices();
    const v =
      voices.find((x) => /^en/i.test(x.lang) && /google|natural|samantha|daniel|aria|jenny/i.test(x.name)) ||
      voices.find((x) => /^en/i.test(x.lang));
    if (v) u.voice = v;
    synth.cancel();
    synth.speak(u);
  } catch {}
}

export function TanoAgent() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [hair, setHair] = useState<number | null>(null);
  const [walking, setWalking] = useState(false);
  const [introActive, setIntroActive] = useState(false);
  const [facing, setFacing] = useState<"forward" | "left" | "right">("forward");
  const wrapRef = useRef<HTMLDivElement>(null);

  const { address, isConnected } = useAccount();
  const connected = mounted && isConnected && !!address;

  useEffect(() => setMounted(true), []);

  // walk to the hero emblem → drop the VORTANO wordmark → walk home.
  // Transform is driven straight on the DOM node (React doesn't manage it),
  // which is the only thing that reliably moves the element here.
  useEffect(() => {
    if (!mounted || tanoIntroStarted) return;
    const forceReplay = /[?&]tano/.test(window.location.search);
    if (!forceReplay) {
      try {
        if (sessionStorage.getItem("tano-intro-v2")) return;
      } catch {}
    }
    tanoIntroStarted = true;

    let tries = 0;
    const startWalk = () => {
      const container = wrapRef.current;
      const emblem = document.getElementById("hero-emblem");
      if (!container || !emblem) {
        if (tries++ < 30) window.setTimeout(startWalk, 120);
        else window.dispatchEvent(new CustomEvent("tano-reached-emblem"));
        return;
      }
      const e = emblem.getBoundingClientRect();
      // TANO's home center from the stable window box (the container's own
      // getBoundingClientRect is unreliable during early layout).
      const canvasW = window.innerWidth >= 640 ? 120 : 100;
      const canvasH = window.innerWidth >= 640 ? 160 : 132;
      const homeX = window.innerWidth - 8 - canvasW / 2;
      const homeY = 58 + canvasH / 2;
      const tx = Math.round(e.left + e.width / 2 - homeX);
      const ty = Math.round(e.top + e.height / 2 - homeY);
      if ((Math.abs(tx) < 250 || e.left < 1) && tries++ < 30) {
        window.setTimeout(startWalk, 120);
        return;
      }

      setIntroActive(true);
      setFacing("left"); // turn to face the walking direction (side profile)
      setWalking(true);
      speakGreeting();
      window.addEventListener("pointerdown", speakGreeting, { once: true });

      // give TANO a beat to turn side-on, then walk out at a slow, steady pace
      window.setTimeout(() => {
        container.style.transform = "translate(0px, 0px)";
        void container.offsetWidth; // force reflow so the transition runs
        // near-linear so the stride reads evenly (no glide at the ends)
        container.style.transition = "transform 9000ms cubic-bezier(.3,.02,.35,1)";
        container.style.transform = `translate(${tx}px, ${ty}px)`;
      }, 700);

      // reveal the wordmark ONLY after TANO has actually arrived (700 + 9000)
      window.setTimeout(() => window.dispatchEvent(new CustomEvent("tano-reached-emblem")), 9800);
      // pause at the emblem, turn around, walk home
      window.setTimeout(() => {
        setFacing("right");
        window.setTimeout(() => {
          container.style.transition = "transform 8000ms cubic-bezier(.3,.02,.35,1)";
          container.style.transform = "translate(0px, 0px)";
        }, 600);
      }, 11200);
      // done → face forward again
      window.setTimeout(() => {
        setWalking(false);
        setIntroActive(false);
        setFacing("forward");
        container.style.transition = "";
        try {
          sessionStorage.setItem("tano-intro-v2", "1");
        } catch {}
      }, 20200);
    };
    window.setTimeout(startWalk, 400);
  }, [mounted]);

  useEffect(() => {
    if (isConnected && address) {
      const saved = typeof window !== "undefined" ? localStorage.getItem(`tano-hair-${address}`) : null;
      setHair(saved !== null ? Number(saved) : hairFromAddress(address));
    } else {
      setHair(null);
      setOpen(false);
    }
  }, [isConnected, address]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  if (!mounted) return null;

  const currentHair = connected ? hair ?? 0 : 0;

  const pick = (h: number) => {
    setHair(h);
    if (address) localStorage.setItem(`tano-hair-${address}`, String(h));
  };

  return (
    <div ref={wrapRef} className="fixed right-1 top-[58px] z-40 flex flex-col items-end sm:right-4">
      <div
        onClick={() => !introActive && setOpen((v) => !v)}
        className={`relative h-[132px] w-[100px] sm:h-[160px] sm:w-[120px] ${
          introActive ? "cursor-default" : "cursor-pointer"
        }`}
        title="Talk to TANO"
      >
        <div className="h-full w-full">
          <Tano3D hair={currentHair} walking={walking} facing={facing} className="!h-full !w-full" />
        </div>
      </div>

      {!open && !introActive && (
        <div className="-mt-2 max-w-[172px] rounded-xl border border-accent/20 bg-panel-2/85 px-3 py-2 text-right text-[11px] leading-snug text-muted backdrop-blur-md">
          Hi, I&apos;m <span className="font-semibold text-accent-pale">TANO</span> — click me, let&apos;s
          talk. 👋
        </div>
      )}

      {open && !introActive && (
        <div className="-mt-1 w-[290px] overflow-hidden rounded-2xl border border-accent/25 bg-panel-2/95 p-4 shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-ink">TANO</div>
              <div className="text-[11px] text-muted">Your on-chain agent</div>
            </div>
            {connected ? (
              <div className="font-mono text-[10px] text-accent-pale">
                {address!.slice(0, 6)}…{address!.slice(-4)}
              </div>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/25 bg-accent/[0.06] px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-accent-pale">
                <span className="h-1 w-1 rounded-full bg-positive animate-pulse-dot" /> online
              </span>
            )}
          </div>

          <div className="mt-3">
            <TanoChat />
          </div>

          {connected ? (
            <>
              <div className="mt-3 text-[11px] font-medium uppercase tracking-wider text-dim">Hair style</div>
              <div className="mt-2 grid grid-cols-3 gap-1.5">
                {HAIRS.map((name, i) => (
                  <button
                    key={name}
                    onClick={() => pick(i)}
                    className={`rounded-lg border px-1 py-1.5 text-[10px] font-medium transition-colors ${
                      i === currentHair
                        ? "border-accent/60 bg-accent/15 text-accent-pale"
                        : "border-accent/15 bg-accent/[0.04] text-muted hover:border-accent/40 hover:text-ink"
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <p className="mt-3 text-[10px] leading-relaxed text-dim">
              Connect your wallet and I&apos;ll get a look that&apos;s uniquely yours. ✨
            </p>
          )}
        </div>
      )}
    </div>
  );
}
