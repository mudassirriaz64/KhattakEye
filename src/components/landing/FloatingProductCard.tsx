import { motion } from "framer-motion";
import { Star } from "lucide-react";
import type { HeroSlideFloatingProduct } from "@/lib/hero-data";

const easeOut = [0.22, 1, 0.36, 1] as const;

type FloatingProductCardProps = {
  product: HeroSlideFloatingProduct;
  side: "left" | "right";
};

export function FloatingProductCard({ product, side }: FloatingProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: side === "right" ? 40 : -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.8, ease: easeOut }}
      className={`absolute ${side === "right" ? "right-4 top-1/4" : "left-4 top-1/4"} hidden lg:block`}
    >
      <motion.div
        className="group relative w-48 overflow-hidden rounded-2xl border border-white/10 bg-white/10 p-3 shadow-2xl backdrop-blur-xl"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{ scale: 1.03, y: -4 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />

        <div className="relative mb-2 overflow-hidden rounded-xl">
          <img
            src={product.image}
            alt={product.name}
            className="h-24 w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute left-2 top-2 rounded-full bg-[color:var(--color-accent-teal)] px-2 py-0.5 text-[8px] font-bold text-white">
            Bestseller
          </div>
        </div>

        <div className="relative space-y-1">
          <p className="text-[11px] font-semibold text-white/90">{product.name}</p>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-2.5 w-2.5 ${i < Math.round(product.rating) ? "text-yellow-400" : "text-white/20"}`}
                fill={i < Math.round(product.rating) ? "currentColor" : "none"}
              />
            ))}
            <span className="ml-1 text-[9px] text-white/50">{product.rating}</span>
          </div>
          <p className="text-xs font-bold text-white">{product.price}</p>
          <button
            type="button"
            className="mt-1 w-full rounded-lg bg-white/10 py-1 text-[9px] font-semibold text-white/80 transition-colors hover:bg-white/20 hover:text-white"
          >
            Virtual Try-On
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
