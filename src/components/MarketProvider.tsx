"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { fetchMarket, FALLBACK, type Market } from "@/lib/market";

const MarketContext = createContext<Market>(FALLBACK);

export function useMarket() {
  return useContext(MarketContext);
}

export function MarketProvider({ children }: { children: ReactNode }) {
  const [market, setMarket] = useState<Market>(FALLBACK);

  useEffect(() => {
    let alive = true;
    const load = () =>
      fetchMarket().then((m) => {
        if (alive) setMarket(m);
      });
    load();
    const iv = setInterval(load, 45000);
    return () => {
      alive = false;
      clearInterval(iv);
    };
  }, []);

  return <MarketContext.Provider value={market}>{children}</MarketContext.Provider>;
}
