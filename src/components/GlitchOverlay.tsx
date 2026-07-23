"use client";

import { useEffect, useState } from "react";

/**
 * Full-screen "signal desync" glitch that fires for ~2s once per minute.
 * Purely decorative → pointer-events none, respects reduced-motion.
 * Visit /#glitch to force it on (debug).
 */
export function GlitchOverlay() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#glitch") {
      setOn(true);
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let clear: ReturnType<typeof setTimeout>;
    const fire = () => {
      setOn(true);
      clear = setTimeout(() => setOn(false), 1900);
    };
    // one dramatic burst shortly after load, then every 60s
    const intro = setTimeout(fire, 2600);
    const iv = setInterval(fire, 60000);
    return () => {
      clearTimeout(intro);
      clearTimeout(clear);
      clearInterval(iv);
    };
  }, []);

  if (!on) return null;

  return (
    <div className="glitch" aria-hidden>
      <div className="glitch-tint glitch-tint--r" />
      <div className="glitch-tint glitch-tint--c" />
      <div className="glitch-bars" />
      <div className="glitch-scan" />
      <div className="glitch-flash" />
      <div className="glitch-text">SIGNAL DESYNC // RE-SYNCING MESH NODES…</div>
    </div>
  );
}
