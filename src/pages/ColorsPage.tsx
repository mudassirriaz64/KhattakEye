import { Badge } from "@/components/primitives/Badge";
import { PageHeader } from "@/components/shared/PageHeader";
import { SurfaceCard } from "@/components/shared/SurfaceCard";
import { TokenTable } from "@/components/shared/TokenTable";
import { colorTokens, interactionTokens } from "@/lib/site-data";

const badgeExamples = [
  { label: "Discount", tone: "default" as const },
  { label: "New Arrival", tone: "teal" as const },
  { label: "Focus", tone: "blue" as const },
  { label: "Warning", tone: "warning" as const },
  { label: "Alert", tone: "danger" as const },
  { label: "Muted", tone: "soft" as const },
];

export function ColorsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Foundations / Color"
        title="Neutral luxury first, accents only where meaning needs them."
        description="The palette stays disciplined so products can feel premium and photography can lead. Teal and blue work as semantic accents rather than decorative noise."
      />

      <SurfaceCard title="Core tokens" description="Every color used in the system maps back to a named semantic token.">
        <TokenTable rows={colorTokens} />
      </SurfaceCard>

      <SurfaceCard title="Interactive states" description="Hover, pressed, disabled, and focus treatments stay consistent across buttons, forms, and navigation.">
        <TokenTable rows={interactionTokens} />
      </SurfaceCard>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <SurfaceCard title="Surface hierarchy">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["Canvas", "var(--color-app-bg)"],
              ["Panel", "var(--color-panel)"],
              ["Muted Surface", "var(--color-surface-muted)"],
            ].map(([label, value]) => (
              <div key={label} className="space-y-3 rounded-[24px] border border-[color:var(--color-border)] p-4">
                <div className="h-28 rounded-[20px]" style={{ backgroundColor: value }} />
                <div>
                  <p className="font-medium text-[color:var(--color-text-primary)]">{label}</p>
                  <p className="text-sm text-[color:var(--color-text-secondary)]">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </SurfaceCard>

        <SurfaceCard title="Badge tones">
          <div className="flex flex-wrap gap-3">
            {badgeExamples.map((badge) => (
              <Badge key={badge.label} tone={badge.tone}>
                {badge.label}
              </Badge>
            ))}
          </div>
          <div className="mt-6 rounded-[24px] bg-[linear-gradient(135deg,#FFFFFF_0%,#F8F9FA_50%,#EEF2F7_100%)] p-6 dark:bg-[linear-gradient(135deg,#0B0B0C_0%,#121214_50%,#17202A_100%)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--color-text-secondary)]">Gradient guidance</p>
            <p className="mt-3 max-w-md text-sm leading-7 text-[color:var(--color-text-secondary)]">
              Hero gradients stay subtle and atmospheric. They should support premium composition, not compete with product imagery.
            </p>
          </div>
        </SurfaceCard>
      </section>
    </>
  );
}
