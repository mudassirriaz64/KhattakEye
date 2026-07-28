import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShoppingBag, Star } from "lucide-react";
import { type Product } from "@/lib/shop-data";
import { useShopStore } from "@/lib/stores/shop-store";

type ProductRecommendationsProps = {
  title: string;
  products: Product[];
};

export function ProductRecommendations({ title, products }: ProductRecommendationsProps) {
  const addToRecentlyViewed = useShopStore((s) => s.addToRecentlyViewed);

  return (
    <section className="mt-14">
      <h2 className="font-display text-2xl text-[color:var(--color-text-primary)] md:text-3xl">{title}</h2>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
          >
            <Link
              to={`/product/${product.slug}`}
              onClick={() => addToRecentlyViewed(product.id)}
              className="group block"
            >
              <div className="overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-soft)]">
                <div className="aspect-[4/5] overflow-hidden bg-[color:var(--color-surface-muted)]">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-text-tertiary)]">{product.brand}</p>
                  <h3 className="mt-0.5 font-display text-base text-[color:var(--color-text-primary)]">{product.name}</h3>
                  <div className="mt-1 flex items-center gap-1 text-xs text-[color:var(--color-text-tertiary)]">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {product.rating}
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-sm font-semibold">{product.currency} {product.price.toLocaleString()}</span>
                    {product.oldPrice && <span className="text-xs line-through text-[color:var(--color-text-tertiary)]">{product.currency} {product.oldPrice.toLocaleString()}</span>}
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
