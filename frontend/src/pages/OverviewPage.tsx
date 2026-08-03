import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { SurfaceCard } from "@/components/shared/SurfaceCard";
import { ShowcaseLinkCard } from "@/components/shared/ShowcaseLinkCard";
import { Button } from "@/components/primitives/Button";
import { InsightCard } from "@/components/commerce/InsightCard";
import { governanceRules, reviewHighlights, showcaseCards } from "@/lib/site-data";

export function OverviewPage() {
  return (
    <>
      <PageHeader
        eyebrow="Design System Overview"
        title="A premium luxury foundation built before the storefront."
        description="This workspace defines the reusable visual language for Khattak Eyewear: brand tokens, motion rules, signature commerce components, and governance standards designed to scale across 60+ future screens."
        aside={
          <div className="space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--color-text-secondary)]">
                Foundation status
              </p>
              <p className="mt-2 font-display text-3xl text-[color:var(--color-text-primary)]">Ready to scale</p>
            </div>
            <ul className="space-y-3 text-sm leading-6 text-[color:var(--color-text-secondary)]">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-1 h-4 w-4 text-[color:var(--color-accent-teal)]" />
                Desktop-first, token-driven, component-based
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-1 h-4 w-4 text-[color:var(--color-accent-blue)]" />
                Luxury editorial direction, not generic ecommerce
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-1 h-4 w-4 text-[color:var(--color-accent-teal)]" />
                Motion and accessibility ready from the start
              </li>
            </ul>
          </div>
        }
      />

      <section className="grid gap-5 xl:grid-cols-3">
        {showcaseCards.map((card) => (
          <ShowcaseLinkCard key={card.path} card={card} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <SurfaceCard
          title="What this foundation solves"
          description="The system makes future page design predictable, consistent, and premium by moving decisions into reusable tokens and approved patterns instead of page-by-page improvisation."
        >
          <div className="grid gap-4 md:grid-cols-2">
            {governanceRules.map((rule) => (
              <div
                key={rule}
                className="rounded-[22px] border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] p-5 text-sm leading-7 text-[color:var(--color-text-secondary)]"
              >
                {rule}
              </div>
            ))}
          </div>
        </SurfaceCard>

        <SurfaceCard title="Next high-value references">
          <div className="space-y-4">
            <Link
              to="/components/cards"
              className="flex items-center justify-between rounded-[22px] border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-5 py-4 text-sm font-medium text-[color:var(--color-text-primary)] transition-all hover:-translate-y-0.5"
            >
              Signature product card
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/components/forms"
              className="flex items-center justify-between rounded-[22px] border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-5 py-4 text-sm font-medium text-[color:var(--color-text-primary)] transition-all hover:-translate-y-0.5"
            >
              Form and field language
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/motion"
              className="flex items-center justify-between rounded-[22px] border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-5 py-4 text-sm font-medium text-[color:var(--color-text-primary)] transition-all hover:-translate-y-0.5"
            >
              Motion system
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Button variant="cta-lg" iconLeft={<Sparkles className="h-4 w-4" />} className="w-full">
              Foundation approved for future page assembly
            </Button>
          </div>
        </SurfaceCard>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        {reviewHighlights.map((item) => (
          <InsightCard key={item.title} title={item.title} body={item.body} />
        ))}
      </section>
    </>
  );
}
