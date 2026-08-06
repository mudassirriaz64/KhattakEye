import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/shop/ProductCard";
import { type Product } from "@/lib/shop-data";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { getProducts, mapProductCard } from "@/lib/api/products";
import { cn } from "@/lib/utils";

function ProductGridSkeleton() {
  return (
    <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="animate-pulse space-y-4">
          <div className="aspect-[4/5] w-full rounded-3xl bg-[color:var(--color-surface-muted)]" />
          <div className="h-4 w-2/3 rounded bg-[color:var(--color-surface-muted)]" />
          <div className="h-4 w-1/3 rounded bg-[color:var(--color-surface-muted)]" />
        </div>
      ))}
    </div>
  );
}

export function GenderCollections() {
  const [activeGender, setActiveGender] = useState<"men" | "women">("men");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getProducts({ gender: activeGender, limit: 8 })
      .then((data) => {
        if (data && Array.isArray(data.items)) {
          setProducts(data.items.map((p) => mapProductCard(p) as unknown as Product));
        }
      })
      .catch((err) => console.error(`Failed to load ${activeGender} products:`, err))
      .finally(() => setLoading(false));
  }, [activeGender]);

  return (
    <section className="bg-[color:var(--color-panel)] py-20 md:py-28">
      <div className="mx-auto max-w-[1440px] px-4 md:px-8">
        <ScrollReveal>
          <div className="flex flex-col gap-6 md:flex-row md:items-end justify-between">
            <div className="max-w-xl space-y-4">
              <p className="editorial-eyebrow">Gender Collections</p>
              <h2 className="font-display text-4xl leading-tight text-[color:var(--color-text-primary)] md:text-6xl">
                Curated by <span className="italic text-gradient-brand">silhouette</span>
              </h2>
            </div>
            
            {/* Gender Toggle tabs */}
            <div className="flex rounded-full border border-[color:var(--color-border)] p-1 bg-[color:var(--color-surface-muted)]">
              {(["men", "women"] as const).map((gender) => (
                <button
                  key={gender}
                  onClick={() => setActiveGender(gender)}
                  className={cn(
                    "relative rounded-full px-6 py-2.5 text-xs font-semibold capitalize transition-all duration-300",
                    activeGender === gender 
                      ? "bg-[color:var(--color-brand-primary)] text-white shadow-[var(--shadow-soft)]" 
                      : "text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)]"
                  )}
                >
                  {gender}'s Collection
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {loading ? (
          <ProductGridSkeleton />
        ) : products.length === 0 ? (
          <div className="mt-12 text-center text-sm text-[color:var(--color-text-tertiary)] py-12">
            No frames available in this collection yet.
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeGender}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
            >
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        <div className="mt-12 text-center">
          <Link
            to={`/shop?gender=${activeGender}`}
            className="group inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--color-brand-primary)] transition-colors hover:text-[color:var(--color-brand-hover)]"
          >
            Shop the entire {activeGender}'s line
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
