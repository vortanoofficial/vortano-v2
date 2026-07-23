import { Reveal } from "./Reveal";

export function SectionHeader({
  index,
  eyebrow,
  title,
  children,
}: {
  index: string;
  eyebrow: string;
  title: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="max-w-3xl">
      <Reveal>
        <div className="flex items-center gap-3">
          <span className="index-plate">{index}</span>
          <span className="eyebrow">{eyebrow}</span>
          <span className="rule-gold h-px flex-1" />
        </div>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="display mt-5 text-4xl sm:text-5xl md:text-[3.5rem]">
          {title}
        </h2>
      </Reveal>
      {children && (
        <Reveal delay={0.1}>
          <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">
            {children}
          </p>
        </Reveal>
      )}
    </div>
  );
}
