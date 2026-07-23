"use client";

import { useState } from "react";
import { SectionHeader } from "./SectionHeader";
import { Reveal } from "./Reveal";
import { highlightServices } from "@/lib/highlight";
import { FAQ } from "@/lib/data";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="relative border-y border-accent/15 bg-bg-soft/50">
      <div className="mx-auto max-w-3xl px-5 py-24 sm:px-8 sm:py-32">
        <SectionHeader index="13" eyebrow="FAQ" title={<>Frequently asked <em>questions.</em></>} />

        <div className="mt-10 divide-y divide-accent/15 border-y border-accent/15">
          {FAQ.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.q} delay={i * 0.04}>
                <div>
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left"
                  >
                    <span className="min-w-0 text-base font-medium text-ink sm:text-lg">{f.q}</span>
                    <span
                      className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border border-accent/25 text-muted transition-transform ${
                        isOpen ? "rotate-45" : ""
                      }`}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                      </svg>
                    </span>
                  </button>
                  <div
                    className={`grid transition-all duration-300 ${
                      isOpen ? "grid-rows-[1fr] pb-5 opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="text-sm leading-relaxed text-muted sm:text-base">{highlightServices(f.a)}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
