import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { getProducts, mapProductCard } from "@/lib/api/products";
import { type Product } from "@/lib/shop-data";

function NewArrivalsListSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-5 py-6 border-b border-[color:var(--color-border-strong)]">
          <div className="h-28 w-28 rounded-2xl bg-[color:var(--color-surface-muted)]" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-1/4 rounded bg-[color:var(--color-surface-muted)]" />
            <div className="h-4 w-2/3 rounded bg-[color:var(--color-surface-muted)]" />
            <div className="h-3 w-1/5 rounded bg-[color:var(--color-surface-muted)]" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function NewArrivals() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts({ isNewArrival: true, limit: 4 })
      .then((data) => {
        if (data && Array.isArray(data.items)) {
          setProducts(data.items.map((p) => mapProductCard(p) as unknown as Product));
        }
      })
      .catch((err) => console.error("Failed to load new arrivals:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="bg-[color:var(--color-app-bg)] py-20 md:py-28">
        <div className="mx-auto max-w-[1440px] px-4 md:px-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-28">
                <p className="editorial-eyebrow">New Arrivals</p>
                <h2 className="mt-4 font-display text-4xl leading-tight text-[color:var(--color-text-primary)] md:text-6xl">
                  Just landed
                </h2>
              </div>
            </div>
            <div className="lg:col-span-8">
              <NewArrivalsListSkeleton />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="bg-[color:var(--color-app-bg)] py-20 md:py-28">
      <div className="mx-auto max-w-[1440px] px-4 md:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <ScrollReveal className="lg:sticky lg:top-28">
              <p className="editorial-eyebrow">New Arrivals</p>
              <h2 className="mt-4 font-display text-4xl leading-tight text-[color:var(--color-text-primary)] md:text-6xl">
                Just landed
              </h2>
              <p className="mt-6 text-base leading-8 text-[color:var(--color-text-secondary)]">
                The latest silhouettes from our ateliers — released in limited quantities and never
                reproduced the same way twice.
              </p>
              <Link
                to="/shop"
                className="group mt-8 inline-flex items-center gap-2 rounded-[16px] brand-gradient px-5 py-3 text-sm font-semibold text-white shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--glow-brand)]"
              >
                Browse all arrivals
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </ScrollReveal>
          </div>

          <div className="lg:col-span-8">
            <div className="border-t border-[color:var(--color-border-strong)]">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    to={`/product/${product.slug}`}
                    className="group flex items-center gap-5 border-b border-[color:var(--color-border-strong)] py-6 transition-colors hover:bg-[color:var(--color-surface-muted)] md:gap-8 md:px-4"
                  >
                    <span className="hidden w-12 shrink-0 font-display text-2xl italic text-[color:var(--color-text-tertiary)] md:block">
                      0{index + 1}
                    </span>
                    <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-[color:var(--color-surface-muted)] md:h-32 md:w-32">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-text-tertiary)]">
                        {product.brand}
                      </p>
                      <h3 className="mt-1 truncate font-display text-xl text-[color:var(--color-text-primary)] md:text-2xl">
                        {product.name}
                      </h3>
                      <p className="mt-1.5 text-sm text-[color:var(--color-text-secondary)]">
                        {product.currency} {product.price.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      {product.badges.includes("new-arrival") && (
                        <span className="hidden rounded-full bg-[color:var(--color-brand-primary)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white md:inline">
                          New
                        </span>
                      )}
                      <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--color-border)] text-[color:var(--color-text-secondary)] transition-all duration-300 group-hover:border-[color:var(--color-brand-primary)] group-hover:bg-[color:var(--color-brand-primary)] group-hover:text-white">
                        <ArrowUpRight className="h-5 w-5" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
