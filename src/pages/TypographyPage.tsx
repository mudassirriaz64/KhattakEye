import { PageHeader } from "@/components/shared/PageHeader";
import { SurfaceCard } from "@/components/shared/SurfaceCard";
import { TypeScaleTable } from "@/components/shared/TokenTable";
import { typographyScale } from "@/lib/site-data";

export function TypographyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Foundations / Typography"
        title="Playfair Display for prestige, Inter for clarity."
        description="Headings carry editorial weight and luxury emotion, while body copy stays crisp and highly readable for pricing, filters, and service details."
      />

      <SurfaceCard title="Type scale" description="A restrained hierarchy prevents the UI from feeling noisy while keeping enough contrast for premium merchandising.">
        <TypeScaleTable rows={typographyScale} />
      </SurfaceCard>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <SurfaceCard title="Display moments">
          <div className="space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--color-text-secondary)]">Display XL</p>
              <p className="mt-3 font-display text-5xl leading-tight text-[color:var(--color-text-primary)] md:text-6xl">
                Sculpted for a quieter kind of luxury.
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--color-text-secondary)]">Body Large</p>
              <p className="mt-3 max-w-2xl text-lg leading-8 text-[color:var(--color-text-secondary)]">
                Product stories should read like a premium editorial catalog, with deliberate rhythm and strong contrast between image, heading, and utility text.
              </p>
            </div>
          </div>
        </SurfaceCard>

        <SurfaceCard title="Usage rules">
          <ul className="space-y-4 text-sm leading-7 text-[color:var(--color-text-secondary)]">
            <li>Use display typography for section-defining moments only.</li>
            <li>Keep form labels, captions, and microcopy in Inter to preserve usability.</li>
            <li>Let spacing do part of the hierarchy work instead of adding more font styles.</li>
            <li>Maintain dark text on light backgrounds for premium readability and trust.</li>
          </ul>
        </SurfaceCard>
      </section>
    </>
  );
}
