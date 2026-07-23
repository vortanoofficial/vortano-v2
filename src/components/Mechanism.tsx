import { SectionHeader } from "./SectionHeader";
import { Reveal } from "./Reveal";
import { MECHANISM } from "@/lib/data";

export function Mechanism() {
  return (
    <section className="relative border-y border-accent/15 bg-bg-soft/50">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
        <SectionHeader index="08" eyebrow="Mechanism" title={<>Trustless compute, in <em>three movements.</em></>}>
          Verifiable inference via fraud proofs. Every output cryptographically
          attributable. Settlement on Robinhood Chain, reputation written to a
          public registry.
        </SectionHeader>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {MECHANISM.map((m, i) => (
            <Reveal key={m.num} delay={i * 0.08}>
              <div className="panel h-full rounded-3xl p-7">
                <span className="metal-gold font-display text-5xl font-black">{m.num}</span>
                <h3 className="mt-4 text-xl font-semibold text-ink">{m.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{m.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
