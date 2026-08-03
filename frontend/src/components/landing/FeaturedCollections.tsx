import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { categories } from "@/lib/landing-data";
import { cn } from "@/lib/utils";

const tiles = [
  { colClass: "lg:col-span-7 lg:row-span-2", itemClass: "aspect-[16/10] lg:aspect-auto lg:h-full", wrapClass: "lg:h-full" },
  { colClass: "lg:col-span-5", itemClass: "aspect-[16/10]", wrapClass: "" },
  { colClass: "lg:col-span-5", itemClass: "aspect-[16/10]", wrapClass: "" },
];

export function FeaturedCollections() {
  return (
    <section className="bg-[color:var(--color-panel)] py-20 md:py-28">
      <div className="mx-auto max-w-[1440px] px-4 md:px-8">
        <ScrollReveal>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-xl space-y-4">
              <p className="editorial-eyebrow">Featured Collections</p>
              <h2 className="font-display text-4xl leading-tight text-[color:var(--color-text-primary)] md:text-6xl">
                Curated for the <span className="italic text-gradient-brand">connoisseur</span>
              </h2>
              <p className="text-base leading-7 text-[color:var(--color-text-secondary)]">
                Four distinct ateliers of design — each a study in material, proportion, and restraint.
              </p>
            </div>
            <Link
              to="/shop"
              className="group inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-[color:var(--color-brand-primary)] transition-colors hover:text-[color:var(--color-brand-hover)]"
            >
              View all collections
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </ScrollReveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-12">
          {categories.map((category, index) => (
            <ScrollReveal
              key={category.title}
              delay={index * 0.1}
              direction={index % 2 === 0 ? "up" : "down"}
              className={cn(tiles[Math.min(index, 2)].colClass, tiles[Math.min(index, 2)].wrapClass)}
            >
              <Link
                to={category.path}
                className="group relative block h-full overflow-hidden rounded-[36px] shadow-[var(--shadow-soft)]"
              >
                <div className={cn("overflow-hidden", tiles[Math.min(index, 2)].itemClass)}>
                  <img
                    src={category.image}
                    alt={category.title}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--color-text-primary)]/70 via-[color:var(--color-text-primary)]/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-7 md:p-9">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/70">
                      {category.count}
                    </p>
                    <h3 className="mt-2 font-display text-2xl text-white md:text-3xl">{category.title}</h3>
                    <p className="mt-2 max-w-xs text-sm leading-6 text-white/80 md:block">
                      {category.description}
                    </p>
                  </div>
                  <span className="mb-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur transition-all duration-300 group-hover:bg-[color:var(--color-brand-primary)] group-hover:border-[color:var(--color-brand-primary)]">
                    <ArrowUpRight className="h-5 w-5" />
                  </span>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
