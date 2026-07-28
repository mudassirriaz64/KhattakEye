import type { TokenRow, TypeScaleRow } from "@/lib/site-data";

type TokenTableProps = {
  rows: TokenRow[];
};

export function TokenTable({ rows }: TokenTableProps) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-[color:var(--color-border)]">
      <div className="grid grid-cols-[1.1fr_160px_1.2fr] bg-[color:var(--color-surface-muted)] px-4 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--color-text-secondary)]">
        <span>Token</span>
        <span>Value</span>
        <span>Usage</span>
      </div>
      {rows.map((row) => (
        <div
          key={row.token}
          className="grid grid-cols-1 gap-3 border-t border-[color:var(--color-border)] px-4 py-4 text-sm text-[color:var(--color-text-primary)] md:grid-cols-[1.1fr_160px_1.2fr]"
        >
          <code className="font-medium">{row.token}</code>
          <div className="flex items-center gap-3">
            <span
              className="h-5 w-5 rounded-full border border-black/5"
              style={{ backgroundColor: row.value.startsWith("#") ? row.value : undefined }}
            />
            <span className="font-medium text-[color:var(--color-text-secondary)]">{row.value}</span>
          </div>
          <span className="leading-6 text-[color:var(--color-text-secondary)]">{row.usage}</span>
        </div>
      ))}
    </div>
  );
}

type TypeScaleTableProps = {
  rows: TypeScaleRow[];
};

export function TypeScaleTable({ rows }: TypeScaleTableProps) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-[color:var(--color-border)]">
      <div className="grid grid-cols-[1.1fr_repeat(3,120px)_1.4fr] bg-[color:var(--color-surface-muted)] px-4 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--color-text-secondary)]">
        <span>Style</span>
        <span>Size</span>
        <span>Line</span>
        <span>Weight</span>
        <span>Usage</span>
      </div>
      {rows.map((row) => (
        <div
          key={row.name}
          className="grid grid-cols-1 gap-3 border-t border-[color:var(--color-border)] px-4 py-4 text-sm md:grid-cols-[1.1fr_repeat(3,120px)_1.4fr]"
        >
          <span className="font-medium text-[color:var(--color-text-primary)]">{row.name}</span>
          <span className="text-[color:var(--color-text-secondary)]">{row.size}</span>
          <span className="text-[color:var(--color-text-secondary)]">{row.lineHeight}</span>
          <span className="text-[color:var(--color-text-secondary)]">{row.weight}</span>
          <span className="leading-6 text-[color:var(--color-text-secondary)]">{row.useCase}</span>
        </div>
      ))}
    </div>
  );
}
