import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { type Product } from "@/lib/shop-data";
import { Button } from "@/components/primitives/Button";

type StickyAddToCartProps = {
  product: Product;
};

export function StickyAddToCart({ product }: StickyAddToCartProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const productEnd = document.getElementById("product-end");
      if (productEnd) {
        const rect = productEnd.getBoundingClientRect();
        setVisible(rect.top < 0);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 border-t border-[color:var(--color-border)] bg-[color:var(--color-app-bg)]/90 backdrop-blur-xl"
        >
          <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-3 md:px-8">
            <div className="flex items-center gap-4">
              <img src={product.images[0]} alt={product.name} className="h-12 w-12 rounded-lg object-cover" />
              <div>
                <p className="text-sm font-medium text-[color:var(--color-text-primary)]">{product.name}</p>
                <p className="text-sm font-semibold text-[color:var(--color-text-primary)]">
                  {product.currency} {product.price.toLocaleString()}
                  {product.oldPrice && (
                    <span className="ml-2 text-xs text-[color:var(--color-text-tertiary)] line-through">
                      {product.currency} {product.oldPrice.toLocaleString()}
                    </span>
                  )}
                </p>
              </div>
            </div>
            <Button variant="primary" iconLeft={<ShoppingBag className="h-4 w-4" />}>
              Add to Cart
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
