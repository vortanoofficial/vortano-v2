import { SectionHeader } from "./SectionHeader";
import { Reveal } from "./Reveal";
import { highlightServices } from "@/lib/highlight";
import { ROADMAP } from "@/lib/data";

const statusStyle: Record<string, string> = {
  Shipped: "border-positive/30 bg-positive/10 text-positive",
  "In progress": "border-accent/40 bg-accent/12 text-accent-pale",
  Planned: "border-accent/20 bg-accent/[0.06] text-dim",
};

export function Roadmap() {
  return (
    <section className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
      <SectionHeader index="12" eyebrow="Roadmap" title={<>Where the protocol is <em>going.</em></>}>
        Major milestones on the path to full protocol sovereignty — shipped on
        schedule and governed on-chain by the DAO.
      </SectionHeader>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {ROADMAP.map((r, i) => (
          <Reveal key={r.title} delay={i * 0.07}>
            <div className="panel beam beam--slow flex h-full flex-col rounded-3xl p-6">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-dim">{r.phase}</span>
                <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${statusStyle[r.status]}`}>
                  {r.status}
                </span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-ink">{r.title}</h3>
              <ul className="mt-4 space-y-2.5 text-sm">
                {r.items.map((it) => (
                  <li key={it} className="flex gap-2.5 text-muted">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent-light" />
                    <span>{highlightServices(it)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
