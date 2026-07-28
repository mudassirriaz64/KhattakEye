type InsightCardProps = {
  title: string;
  body: string;
};

export function InsightCard({ title, body }: InsightCardProps) {
  return (
    <article className="rounded-[24px] border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-5 shadow-[var(--shadow-soft)]">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--color-text-secondary)]">Insight</p>
      <div className="mt-4 space-y-3">
        <h3 className="font-display text-2xl leading-tight text-[color:var(--color-text-primary)]">{title}</h3>
        <p className="text-sm leading-7 text-[color:var(--color-text-secondary)]">{body}</p>
      </div>
    </article>
  );
}
