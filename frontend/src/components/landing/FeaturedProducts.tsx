import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/shop/ProductCard";
import { type Product } from "@/lib/shop-data";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { getProducts, mapProductCard } from "@/lib/api/products";

function ProductGridSkeleton() {
  return (
    <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts({ featured: true, limit: 8 })
      .then((data) => {
        if (data && Array.isArray(data.items)) {
          setProducts(data.items.map((p) => mapProductCard(p) as unknown as Product));
        }
      })
      .catch((err) => console.error("Failed to load featured products:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="bg-[color:var(--color-app-bg)] py-20 md:py-28">
        <div className="mx-auto max-w-[1440px] px-4 md:px-8">
          <div className="max-w-xl space-y-4">
            <p className="editorial-eyebrow">Featured Products</p>
            <h2 className="font-display text-4xl leading-tight text-[color:var(--color-text-primary)] md:text-6xl">
              Signature <span className="italic text-gradient-brand">Atelier</span> frames
            </h2>
          </div>
          <ProductGridSkeleton />
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="bg-[color:var(--color-app-bg)] py-20 md:py-28">
      <div className="mx-auto max-w-[1440px] px-4 md:px-8">
        <ScrollReveal>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-xl space-y-4">
              <p className="editorial-eyebrow">Featured Products</p>
              <h2 className="font-display text-4xl leading-tight text-[color:var(--color-text-primary)] md:text-6xl">
                Signature <span className="italic text-gradient-brand">Atelier</span> frames
              </h2>
              <p className="text-base leading-7 text-[color:var(--color-text-secondary)]">
                Exquisite materials, modern silhouettes, and meticulous craftsmanship designed to stand out.
              </p>
            </div>
            <Link
              to="/shop"
              className="group inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-[color:var(--color-brand-primary)] transition-colors hover:text-[color:var(--color-brand-hover)]"
            >
              Explore all frames
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </ScrollReveal>

        <motion.div
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
        >
          {products.map((product) => (
            <motion.div
              key={product.id}
              variants={{
                hidden: { opacity: 0, y: 36 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
              }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
