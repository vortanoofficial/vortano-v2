"use client";

import Image from "next/image";
import { useMarket } from "./MarketProvider";
import { fmtUsd, fmtPrice, fmtPct, type Market } from "@/lib/market";

type Key = "eth" | "usdc" | "vrtn";
type Item = {
  name: string;
  sym: string;
  amt: string;
  qty: number;
  img: string;
  key?: Key;
  stable?: boolean; // pegged $1 (USDG)
};

const HOLD: Item[] = [
  { name: "Ethereum", sym: "ETH", amt: "0.91", qty: 0.91, img: "/token-eth.png", key: "eth" },
  { name: "Global Dollar", sym: "USDG", amt: "980.00", qty: 980, img: "/token-usdg.png", stable: true },
  { name: "USD Coin", sym: "USDC", amt: "1,240.55", qty: 1240.55, img: "/token-usdc.png", key: "usdc" },
  { name: "Vortano", sym: "VRTN", amt: "1,500,000", qty: 1_500_000, img: "/token-vrtn.png", key: "vrtn" },
];

const priceOf = (h: Item, m: Market) => (h.stable ? 1 : m[h.key!].price);
const changeOf = (h: Item, m: Market) => (h.stable ? 0 : m[h.key!].change24h);

function TokenIcon({ src }: { src: string }) {
  return (
    <span className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full ring-1 ring-black/25">
      <Image src={src} alt="" width={40} height={40} className="h-9 w-9 object-cover" />
    </span>
  );
}

export function WalletBalance() {
  const m = useMarket();
  let total = 0;
  let weighted = 0;
  for (const h of HOLD) {
    const v = h.qty * priceOf(h, m);
    total += v;
    weighted += v * changeOf(h, m);
  }
  const pct = total ? weighted / total : 0;
  const up = pct >= 0;
  return (
    <>
      <div className="mt-0.5 text-[42px] font-extrabold leading-none tracking-tight text-[#211505]">
        {fmtUsd(total)}
      </div>
      <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-[#1c130322] px-2.5 py-1 text-[12px] font-semibold" style={{ color: up ? "#20460f" : "#7a1f14" }}>
        {up ? "▲" : "▼"} {fmtPct(pct)} today
      </span>
    </>
  );
}

export function WalletTokens() {
  const m = useMarket();
  return (
    <div className="space-y-0.5">
      {HOLD.map((h) => {
        const price = priceOf(h, m);
        const change = changeOf(h, m);
        const up = change >= 0;
        return (
          <div key={h.sym} className="wallet-row flex items-center gap-3 rounded-2xl px-2.5 py-2.5">
            <TokenIcon src={h.img} />
            <div className="min-w-0 flex-1">
              <div className="text-[14px] font-semibold text-ink">{h.name}</div>
              <div className="text-[12px] text-dim">
                {h.amt} {h.sym} · {fmtPrice(price)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[14px] font-semibold text-ink">{fmtUsd(h.qty * price)}</div>
              <div className={`text-[11px] font-medium ${up ? "text-positive" : "text-negative"}`}>
                {fmtPct(change)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
