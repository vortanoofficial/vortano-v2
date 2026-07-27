import { SectionHeader } from "./SectionHeader";
import { Reveal } from "./Reveal";
import { AgentBuilder } from "./AgentBuilder";
import { VortanoPlayground } from "./VortanoPlayground";
import { MODEL_SUITE } from "@/lib/data";

export function ModelSuite() {
  return (
    <section id="chat" className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
      <SectionHeader index="05" eyebrow="AI Model Suite" title={<>A full-stack <em>AI model suite.</em></>}>
        Text, images, <strong className="font-bold text-ink">autonomous agents</strong>{" "}
        and an <strong className="font-bold text-ink">AI-native OS</strong> — every
        model runs on decentralized compute and every output is cryptographically
        attributable on Robinhood Chain.
      </SectionHeader>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {MODEL_SUITE.map((m, i) => (
          <Reveal key={m.tag} delay={i * 0.06}>
            <div className="panel panel-hover beam beam--slow flex h-full flex-col rounded-3xl p-6">
              <span className="grid h-11 w-11 place-items-center rounded-2xl border border-accent/30 bg-accent/10 font-mono text-xs font-semibold tracking-wider text-accent-pale">
                {m.tag}
              </span>
              <h3 className="mt-5 text-lg font-bold text-ink">{m.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{m.desc}</p>
              <div className="mt-5 flex items-center justify-between border-t border-accent/15 pt-4 font-mono text-xs">
                <span className="text-dim">{m.chip}</span>
                <span className="text-accent-pale">{m.price}</span>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Try the model — a genuinely working preview */}
      <Reveal delay={0.1} className="mt-6 min-w-0">
        <VortanoPlayground />
      </Reveal>

      {/* Build your own on-chain agent */}
      <Reveal delay={0.1} className="mt-6 min-w-0">
        <AgentBuilder />
      </Reveal>
    </section>
  );
}
