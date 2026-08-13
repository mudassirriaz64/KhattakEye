import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { cn } from "@/lib/utils";
import { getCategories } from "@/lib/api/products";
import { categories as fallbackCategories, type Category } from "@/lib/landing-data";

const tileConfigs = [
  { colClass: "lg:col-span-8", itemClass: "h-[280px] sm:h-[340px] lg:h-[380px]" },
  { colClass: "lg:col-span-4", itemClass: "h-[280px] sm:h-[340px] lg:h-[380px]" },
  { colClass: "lg:col-span-4", itemClass: "h-[240px] sm:h-[280px] lg:h-[300px]" },
  { colClass: "lg:col-span-4", itemClass: "h-[240px] sm:h-[280px] lg:h-[300px]" },
  { colClass: "lg:col-span-4", itemClass: "h-[240px] sm:h-[280px] lg:h-[300px]" },
  { colClass: "lg:col-span-12", itemClass: "h-[200px] sm:h-[240px] lg:h-[260px]" },
];

function CategoryGridSkeleton() {
  return (
    <div className="mt-12 grid gap-6 lg:grid-cols-12">
      <div className="lg:col-span-8 h-[380px] animate-pulse rounded-[36px] bg-[color:var(--color-surface-muted)]" />
      <div className="lg:col-span-4 h-[380px] animate-pulse rounded-[36px] bg-[color:var(--color-surface-muted)]" />
      <div className="lg:col-span-4 h-[300px] animate-pulse rounded-[36px] bg-[color:var(--color-surface-muted)]" />
      <div className="lg:col-span-4 h-[300px] animate-pulse rounded-[36px] bg-[color:var(--color-surface-muted)]" />
      <div className="lg:col-span-4 h-[300px] animate-pulse rounded-[36px] bg-[color:var(--color-surface-muted)]" />
      <div className="lg:col-span-12 h-[260px] animate-pulse rounded-[36px] bg-[color:var(--color-surface-muted)]" />
    </div>
  );
}

export function FeaturedCollections() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories({ featured: true })
      .then((data) => {
        if (data && Array.isArray(data) && data.length > 0) {
          const dbMapped = data.map((c) => ({
            title: c.name,
            image: c.image || "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800",
            description: c.description || "Premium designer frames",
            count: `${c.productCount || 0} products`,
            path: `/shop/${c.slug}`
          }));

          const merged = [...dbMapped];
          for (const fb of fallbackCategories) {
            if (merged.length >= 6) break;
            if (!merged.some(item => item.title.toLowerCase() === fb.title.toLowerCase())) {
              merged.push(fb);
            }
          }
          setCategories(merged.slice(0, 6));
        } else {
          setCategories(fallbackCategories);
        }
      })
      .catch((err) => {
        console.error("Failed to load featured categories:", err);
        setCategories(fallbackCategories);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="bg-[color:var(--color-panel)] py-20 md:py-28">
        <div className="mx-auto max-w-[1440px] px-4 md:px-8">
          <div className="max-w-xl space-y-4">
            <p className="editorial-eyebrow">Featured Collections</p>
            <h2 className="font-display text-4xl leading-tight text-[color:var(--color-text-primary)] md:text-6xl">
              Curated for the <span className="italic text-gradient-brand">connoisseur</span>
            </h2>
          </div>
          <CategoryGridSkeleton />
        </div>
      </section>
    );
  }

  if (categories.length === 0) return null;

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
                Six distinct ateliers of design & precision optical engineering — each a study in material, proportion, and restraint.
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
          {categories.map((category, index) => {
            const config = tileConfigs[index % tileConfigs.length];
            return (
              <ScrollReveal
                key={category.title}
                delay={index * 0.08}
                direction="up"
                className={cn(config.colClass, "w-full")}
              >
                <Link
                  to={category.path}
                  className="group relative block h-full w-full overflow-hidden rounded-[36px] shadow-[var(--shadow-soft)]"
                >
                  <div className={cn("w-full overflow-hidden", config.itemClass)}>
                    <img
                      src={category.image}
                      alt={category.title}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6 md:p-8">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/70">
                        {category.count}
                      </p>
                      <h3 className="mt-1 font-display text-2xl text-white md:text-3xl font-bold">{category.title}</h3>
                      <p className="mt-1.5 max-w-sm text-xs leading-5 text-white/80 line-clamp-2 md:block">
                        {category.description}
                      </p>
                    </div>
                    <span className="mb-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur transition-all duration-300 group-hover:bg-[color:var(--color-brand-primary)] group-hover:border-[color:var(--color-brand-primary)]">
                       <ArrowUpRight className="h-5 w-5" />
                    </span>
                  </div>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
