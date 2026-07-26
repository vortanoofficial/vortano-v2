import { SectionHeader } from "./SectionHeader";
import { Reveal } from "./Reveal";
import { SavingsCalculator } from "./SavingsCalculator";
import { PRICE_TABLE } from "@/lib/data";

export function Routing() {
  return (
    <section className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
      <SectionHeader index="07" eyebrow="Hybrid Routing Engine" title={<><em>5–10× cheaper</em> than the hyperscalers.</>}>
        Our <strong className="font-bold text-ink">hybrid NPU + GPU router</strong>{" "}
        sends ultra-efficient edge inference to NPUs
        and heavy training to GPUs, load-balancing to slash cost-per-token to
        industry-leading lows. No rack rental, no markup, no quarterly board — you
        pay the silicon, not the suit.
      </SectionHeader>

      <Reveal delay={0.1}>
        <div className="mt-10 overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-accent/20 text-left font-mono text-[11px] uppercase tracking-wider text-dim">
                <th className="py-3 pr-4 font-medium">Accelerator</th>
                <th className="py-3 px-4 font-medium text-accent-pale">Vortano</th>
                <th className="py-3 px-4 font-medium">AWS</th>
                <th className="py-3 px-4 font-medium">Google Cloud</th>
                <th className="py-3 px-4 font-medium">Azure</th>
              </tr>
            </thead>
            <tbody className="font-mono">
              {PRICE_TABLE.map((r) => (
                <tr key={r.chip} className="border-b border-white/6 transition-colors hover:bg-accent/[0.05]">
                  <td className="py-4 pr-4">
                    <div className="font-sans font-semibold text-ink">{r.chip}</div>
                    <div className="text-xs text-dim">{r.spec}</div>
                  </td>
                  <td className="px-4">
                    <span className="rounded-lg bg-accent/12 px-2.5 py-1 font-semibold text-accent-pale">
                      {r.vortano}
                    </span>
                    <span className="ml-1 text-xs text-dim">/hr</span>
                  </td>
                  <td className="px-4 text-muted">{r.aws}{r.aws !== "—" && <span className="text-dim"> /hr</span>}</td>
                  <td className="px-4 text-muted">{r.gcp}{r.gcp !== "—" && <span className="text-dim"> /hr</span>}</td>
                  <td className="px-4 text-muted">{r.azure}{r.azure !== "—" && <span className="text-dim"> /hr</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>
      <Reveal delay={0.16}>
        <p className="mt-5 font-mono text-xs text-dim">
          benchmark refreshed every 4h · on-demand list pricing · region-normalised to us-east
        </p>
      </Reveal>

      {/* Interactive savings estimator */}
      <Reveal delay={0.1} className="mt-8 min-w-0 lg:max-w-2xl">
        <SavingsCalculator />
      </Reveal>
    </section>
  );
}
