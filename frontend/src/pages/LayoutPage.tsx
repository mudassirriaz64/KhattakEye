import { PageHeader } from "@/components/shared/PageHeader";
import { SurfaceCard } from "@/components/shared/SurfaceCard";
import { layoutRules } from "@/lib/site-data";

export function LayoutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Foundations / Layout"
        title="Editorial structure anchored by a disciplined 8px system."
        description="The grid must stay flexible enough for immersive merchandising, while the spacing rhythm keeps every future screen recognizably part of the same luxury brand."
      />

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <SurfaceCard title="System rules">
          <div className="space-y-3">
            {layoutRules.map(([label, value]) => (
              <div
                key={label}
                className="flex items-center justify-between rounded-[18px] border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-3 text-sm"
              >
                <span className="text-[color:var(--color-text-secondary)]">{label}</span>
                <span className="font-medium text-[color:var(--color-text-primary)]">{value}</span>
              </div>
            ))}
          </div>
        </SurfaceCard>

        <SurfaceCard title="12-column desktop rhythm">
          <div className="space-y-4">
            <div className="grid grid-cols-12 gap-3">
              {Array.from({ length: 12 }).map((_, index) => (
                <div key={index} className="h-16 rounded-2xl bg-[linear-gradient(180deg,rgba(17,17,17,0.08),rgba(17,17,17,0.03))]" />
              ))}
            </div>
            <div className="grid gap-4 md:grid-cols-[1.4fr_0.6fr]">
              <div className="rounded-[24px] bg-[linear-gradient(135deg,#111111,#1F2937)] p-6 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">Hero media zone</p>
                <p className="mt-4 max-w-md font-display text-3xl leading-tight">Large image-led modules should breathe.</p>
              </div>
              <div className="rounded-[24px] border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--color-text-secondary)]">Support block</p>
                <p className="mt-4 text-sm leading-7 text-[color:var(--color-text-secondary)]">
                  Utility modules align cleanly without breaking the editorial tone.
                </p>
              </div>
            </div>
          </div>
        </SurfaceCard>
      </section>
    </>
  );
}
