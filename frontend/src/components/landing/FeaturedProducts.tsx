import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, TrendingUp, Flame } from "lucide-react";
import { ProductCard } from "@/components/shop/ProductCard";
import { type Product } from "@/lib/shop-data";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { getProducts, mapProductCard } from "@/lib/api/products";
import { cn } from "@/lib/utils";

type TabKey = "featured" | "bestsellers" | "newarrivals";

const tabs: { key: TabKey; label: string; icon: any; eyebrow: string; title: string; subtitle: string }[] = [
  {
    key: "featured",
    label: "Featured",
    icon: Sparkles,
    eyebrow: "Handpicked Selection",
    title: "Signature Atelier Frames",
    subtitle: "Exquisite materials, modern silhouettes, and meticulous craftsmanship."
  },
  {
    key: "bestsellers",
    label: "Best Sellers",
    icon: Flame,
    eyebrow: "Most Popular",
    title: "The Most Coveted Frames",
    subtitle: "Consistently top-rated styles loved by our eyewear connoisseurs."
  },
  {
    key: "newarrivals",
    label: "New Arrivals",
    icon: TrendingUp,
    eyebrow: "Fresh Release",
    title: "Just Landed Collections",
    subtitle: "The latest seasonal arrivals and avant-garde designs."
  }
];

function ProductGridSkeleton() {
  return (
    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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

export function FeaturedProducts() {
  const [activeTab, setActiveTab] = useState<TabKey>("featured");
  const [productsMap, setProductsMap] = useState<Record<TabKey, Product[]>>({
    featured: [],
    bestsellers: [],
    newarrivals: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getProducts({ featured: true, limit: 8 }),
      getProducts({ isBestSeller: true, limit: 8 }),
      getProducts({ isNewArrival: true, limit: 8 })
    ])
      .then(([featRes, bestRes, newRes]) => {
        setProductsMap({
          featured: (featRes?.items || []).map((p) => mapProductCard(p) as unknown as Product),
          bestsellers: (bestRes?.items || []).map((p) => mapProductCard(p) as unknown as Product),
          newarrivals: (newRes?.items || []).map((p) => mapProductCard(p) as unknown as Product)
        });
      })
      .catch((err) => console.error("Failed to load catalog products:", err))
      .finally(() => setLoading(false));
  }, []);

  const activeTabMeta = tabs.find((t) => t.key === activeTab)!;
  const currentProducts = productsMap[activeTab] || [];

  return (
    <section className="bg-[color:var(--color-app-bg)] pt-20 pb-10 md:pt-28 md:pb-12">
      <div className="mx-auto max-w-[1440px] px-4 md:px-8">
        <ScrollReveal>
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--color-brand-soft)]/20 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-[color:var(--color-brand-primary)]">
                <activeTabMeta.icon className="h-3.5 w-3.5" />
                {activeTabMeta.eyebrow}
              </span>
              <h2 className="font-display text-4xl leading-tight text-[color:var(--color-text-primary)] md:text-5xl">
                {activeTabMeta.title}
              </h2>
              <p className="text-sm leading-relaxed text-[color:var(--color-text-secondary)]">
                {activeTabMeta.subtitle}
              </p>
            </div>

            {/* Tab Controls */}
            <div className="flex items-center gap-2 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-1.5 shadow-sm">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.key;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className={cn(
                      "relative flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all duration-200",
                      isActive
                        ? "bg-[color:var(--color-brand-primary)] text-white shadow-md"
                        : "text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-muted)] hover:text-[color:var(--color-text-primary)]"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </ScrollReveal>

        {loading ? (
          <ProductGridSkeleton />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
            >
              {currentProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        <div className="mt-8 text-center">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-6 py-3 text-xs font-bold uppercase tracking-wider text-[color:var(--color-text-primary)] shadow-sm hover:border-[color:var(--color-brand-primary)] hover:text-[color:var(--color-brand-primary)] transition-all"
          >
            Explore Complete Collection
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
