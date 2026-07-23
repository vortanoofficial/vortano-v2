import { SectionHeader } from "./SectionHeader";
import { Reveal } from "./Reveal";
import { EarningsCalculator } from "./EarningsCalculator";
import { ProviderOnboarding } from "./ProviderOnboarding";

export function Provider() {
  return (
    <section className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
      <SectionHeader index="09" eyebrow="Become a Provider" title={<>Got idle silicon? <em>Make it earn.</em></>}>
        Monetize idle GPU &amp; NPU capacity on the{" "}
        <strong className="font-bold text-ink">Vortano mesh</strong> — anything from a
        single 4090 to a 64-node H100 cluster. Set your floor price, post a bond
        in VRTN, and start streaming USDG.
      </SectionHeader>

      <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_1fr]">
        {/* Interactive earnings calculator */}
        <Reveal className="min-w-0">
          <EarningsCalculator />
        </Reveal>

        {/* Interactive onboarding wizard */}
        <Reveal delay={0.1} className="min-w-0">
          <ProviderOnboarding />
        </Reveal>
      </div>
    </section>
  );
}
