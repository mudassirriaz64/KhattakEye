import { useState } from "react";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { featuredProducts } from "@/lib/landing-data";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { Button } from "@/components/primitives/Button";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "all", label: "All" },
  { id: "best-seller", label: "Best Sellers" },
  { id: "trending", label: "Trending" },
  { id: "premium", label: "Premium" },
  { id: "new", label: "New Arrivals" },
];

export function FeaturedCollection() {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <section className="relative border-t border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)]">
      <div className="mx-auto max-w-[1440px] px-4 py-16 md:px-8 md:py-20">
        <ScrollReveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-app-bg)] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-[color:var(--color-text-secondary)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-accent-teal)]" />
              Featured Collection
            </p>
            <h2 className="mt-4 font-display text-3xl leading-tight text-[color:var(--color-text-primary)] md:text-5xl">
              Discover your perfect frame
            </h2>
          </div>
        </ScrollReveal>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "rounded-full px-5 py-2.5 text-sm font-medium transition-all",
                activeTab === tab.id
                  ? "bg-[color:var(--color-brand-primary)] text-white shadow-[var(--shadow-soft)]"
                  : "bg-[color:var(--color-app-bg)] text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-app-bg)] hover:text-[color:var(--color-text-primary)]",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-10">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {featuredProducts.slice(0, 6).map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="group cursor-pointer"
                >
                  <div className="overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-app-bg)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-soft)]">
                    <div className="relative overflow-hidden bg-[color:var(--color-surface-muted)]">
                      <div className="aspect-[4/5]">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:opacity-0"
                        />
                        {product.hoverImage && (
                          <img
                            src={product.hoverImage}
                            alt={`${product.name} view`}
                            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
                          />
                        )}
                      </div>
                      <div className="absolute left-3 top-3">
                        {product.badge && (
                          <span className="rounded-full bg-[color:var(--color-brand-primary)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white">
                            {product.badge}
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-[color:var(--color-text-primary)] opacity-0 shadow-sm backdrop-blur-sm transition-all hover:scale-105 group-hover:opacity-100"
                        aria-label="Add to wishlist"
                      >
                        <Heart className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="p-5">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-text-secondary)]">
                        {product.brand}
                      </p>
                      <h3 className="mt-1 font-display text-xl text-[color:var(--color-text-primary)]">
                        {product.name}
                      </h3>
                      <div className="mt-3 flex items-center gap-3">
                        <span className="text-lg font-semibold text-[color:var(--color-text-primary)]">
                          {product.price}
                        </span>
                        {product.oldPrice && (
                          <span className="text-sm text-[color:var(--color-text-tertiary)] line-through">
                            {product.oldPrice}
                          </span>
                        )}
                      </div>
                      <div className="mt-2 flex items-center gap-1 text-xs text-[color:var(--color-text-secondary)]">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        {product.rating}
                      </div>
                      <Button
                        variant="primary"
                        iconLeft={<ShoppingBag className="h-4 w-4" />}
                        className="mt-4 w-full"
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
