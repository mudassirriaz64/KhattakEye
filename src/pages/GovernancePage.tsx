import { PageHeader } from "@/components/shared/PageHeader";
import { SurfaceCard } from "@/components/shared/SurfaceCard";
import { governanceRules } from "@/lib/site-data";

export function GovernancePage() {
  return (
    <>
      <PageHeader
        eyebrow="Systems / Governance"
        title="Scalable naming, folders, and contribution rules keep the system coherent."
        description="Because the final product will span more than 60 screens, governance matters as much as aesthetics. Naming, folders, and extension rules prevent quality drift as the team grows."
      />

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <SurfaceCard title="Operating rules">
          <ul className="space-y-3">
            {governanceRules.map((rule) => (
              <li
                key={rule}
                className="rounded-[18px] border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-3 text-sm leading-7 text-[color:var(--color-text-secondary)]"
              >
                {rule}
              </li>
            ))}
          </ul>
        </SurfaceCard>

        <SurfaceCard title="Naming and folders">
          <div className="space-y-4 text-sm leading-7 text-[color:var(--color-text-secondary)]">
            <p>
              Token names use semantic paths like <code>color.text.primary</code>, <code>space.6</code>, and <code>motion.card.hover</code>.
            </p>
            <p>
              Components are split into <code>foundations</code>, <code>primitives</code>, <code>commerce</code>, <code>navigation</code>, and <code>feedback</code>.
            </p>
            <div className="rounded-[24px] border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] p-5 font-mono text-[13px]">
              src/components/primitives/Button.tsx
              <br />
              src/components/commerce/ProductCard.tsx
              <br />
              src/lib/tokens/
              <br />
              src/lib/motion/
            </div>
          </div>
        </SurfaceCard>
      </section>
    </>
  );
}
