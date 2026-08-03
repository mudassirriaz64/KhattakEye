import { ArrowRight, Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/primitives/Button";
import { PageHeader } from "@/components/shared/PageHeader";
import { SurfaceCard } from "@/components/shared/SurfaceCard";

export function ButtonsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Components / Buttons"
        title="Button hierarchy that feels composed, tactile, and expensive."
        description="Primary CTAs stay assertive, while secondary actions remain refined and quiet. Each button supports hover, focus, disabled, active, and loading behavior through shared styling rules."
      />

      <SurfaceCard title="Variants" description="Use the loudest buttons sparingly so premium hierarchy is preserved.">
        <div className="flex flex-wrap gap-4">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="success">Success</Button>
          <Button variant="icon" aria-label="Save item">
            <Heart className="h-4 w-4" />
          </Button>
          <Button variant="floating" iconLeft={<Sparkles className="h-4 w-4" />}>
            Floating
          </Button>
        </div>
      </SurfaceCard>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <SurfaceCard title="CTA patterns">
          <div className="flex flex-wrap gap-4">
            <Button variant="cta-lg" iconRight={<ArrowRight className="h-4 w-4" />}>
              Explore the premium collection
            </Button>
            <Button variant="cta-sm">Book styling call</Button>
          </div>
        </SurfaceCard>

        <SurfaceCard title="State handling">
          <div className="flex flex-wrap gap-4">
            <Button loading>Loading</Button>
            <Button disabled>Disabled</Button>
            <Button variant="outline" className="translate-y-0.5 shadow-none">
              Pressed
            </Button>
          </div>
        </SurfaceCard>
      </section>
    </>
  );
}
