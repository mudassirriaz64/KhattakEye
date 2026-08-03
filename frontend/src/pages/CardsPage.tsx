import { ProductCard } from "@/components/commerce/ProductCard";
import { Badge } from "@/components/primitives/Badge";
import { PageHeader } from "@/components/shared/PageHeader";
import { SurfaceCard } from "@/components/shared/SurfaceCard";
import { productCardSamples } from "@/lib/site-data";

export function CardsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Components / Cards"
        title="The product card is the signature component of the entire experience."
        description="It combines premium product photography, fashion-led hierarchy, conversion actions, and restrained motion into one reusable pattern that can anchor category, search, and recommendation flows."
      />

      <SurfaceCard title="Signature product card" description="Lift, hover image crossfade, pricing hierarchy, badges, swatches, and cart action are all built into the pattern.">
        <div className="grid gap-6 xl:grid-cols-2">
          {productCardSamples.map((product) => (
            <ProductCard key={product.name} {...product} />
          ))}
        </div>
      </SurfaceCard>

      <section className="grid gap-6 lg:grid-cols-3">
        {[
          ["Category Card", "Large image, short copy, premium CTA, soft hover lift."],
          ["Review Card", "Strong quote styling, subtle star system, customer authenticity cues."],
          ["Statistic Card", "Used for trust, shipping, craftsmanship, and service metrics."],
        ].map(([title, body]) => (
          <SurfaceCard key={title} title={title}>
            <Badge tone="soft">Reusable</Badge>
            <p className="mt-4 text-sm leading-7 text-[color:var(--color-text-secondary)]">{body}</p>
          </SurfaceCard>
        ))}
      </section>
    </>
  );
}
