import { ScrollReveal } from "./ScrollReveal";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export function SectionHeading({ eyebrow, title, description, align = "center" }: SectionHeadingProps) {
  return (
    <ScrollReveal className={align === "center" ? "mx-auto max-w-2xl text-center" : ""}>
      <div className={align === "center" ? "space-y-4" : "space-y-4"}>
        <p className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-[color:var(--color-text-secondary)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-accent-teal)]" />
          {eyebrow}
        </p>
        <h2 className="font-display text-3xl leading-tight text-[color:var(--color-text-primary)] md:text-5xl">
          {title}
        </h2>
        {description && (
          <p className="text-sm leading-7 text-[color:var(--color-text-secondary)] md:text-base">
            {description}
          </p>
        )}
      </div>
    </ScrollReveal>
  );
}
