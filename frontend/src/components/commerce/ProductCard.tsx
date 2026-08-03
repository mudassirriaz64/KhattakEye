import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Star, Zap } from "lucide-react";
import { Badge } from "@/components/primitives/Badge";
import { Button } from "@/components/primitives/Button";
import { cn } from "@/lib/utils";

type ProductCardProps = {
  brand: string;
  name: string;
  price: string;
  oldPrice: string;
  rating: string;
  stock: string;
  image: string;
  hoverImage: string;
  discount: string;
  swatches: string[];
};

export function ProductCard({
  brand,
  name,
  price,
  oldPrice,
  rating,
  stock,
  image,
  hoverImage,
  discount,
  swatches,
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <motion.article
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden rounded-[28px] border border-[color:var(--color-border)] bg-[color:var(--color-panel)] shadow-[var(--shadow-soft)] transition-shadow duration-300 hover:shadow-[var(--shadow-strong)]"
    >
      <motion.div
        className="pointer-events-none absolute inset-0 z-30 rounded-[28px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: "linear-gradient(135deg, rgba(182,25,27,0.05), rgba(211,160,149,0.06))",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.05)",
        }}
      />
      <div className="relative overflow-hidden border-b border-[color:var(--color-border)] bg-[linear-gradient(180deg,#FFF8F3,#F3E6D8)] p-5">
        <div className="absolute left-5 top-5 z-20">
          <Badge>{discount}</Badge>
        </div>
        <motion.button
          type="button"
          onClick={() => setIsWishlisted(!isWishlisted)}
          aria-label={isWishlisted ? `Remove ${name} from wishlist` : `Save ${name}`}
          whileTap={{ scale: 0.85 }}
          className="absolute right-5 top-5 z-20 rounded-full border border-white/60 bg-white/80 p-2 text-[color:var(--color-text-primary)] shadow-sm backdrop-blur transition-all hover:scale-105"
        >
          <motion.div
            animate={isWishlisted ? { scale: [1, 1.3, 1] } : { scale: 1 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <Heart className={cn("h-4 w-4 transition-colors", isWishlisted && "fill-red-500 text-red-500")} />
          </motion.div>
        </motion.button>
        <div className="relative h-72 overflow-hidden rounded-[24px]">
          <img
            src={image}
            alt={name}
            className="absolute inset-0 h-full w-full object-cover transition-all duration-500 ease-out group-hover:scale-[1.06] group-hover:opacity-0"
          />
          <img
            src={hoverImage}
            alt={`${name} alternate view`}
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-all duration-500 ease-out group-hover:scale-[1.06] group-hover:opacity-100"
          />
        </div>
      </div>
      <div className="space-y-5 p-5">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.22em] text-[color:var(--color-text-secondary)]">
          <span>{brand}</span>
          <span className="inline-flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-current text-amber-400" />
            {rating}
          </span>
        </div>
        <div className="space-y-2">
          <h3 className="font-display text-2xl leading-tight text-[color:var(--color-text-primary)]">{name}</h3>
          <div className="flex items-baseline gap-3">
            <span className="text-lg font-semibold text-[color:var(--color-text-primary)]">{price}</span>
            <span className="text-sm text-[color:var(--color-text-secondary)] line-through">{oldPrice}</span>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-surface-muted)] px-3 py-1 text-xs text-[color:var(--color-text-secondary)]">
            <Zap className="h-3.5 w-3.5 text-[color:var(--color-accent-teal)]" />
            {stock}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {swatches.map((swatch, index) => (
            <motion.span
              key={`${name}-${swatch}`}
              whileHover={{ scale: 1.2 }}
              className={cn("h-5 w-5 cursor-pointer rounded-full border border-white/80 shadow-sm ring-1 ring-black/5 transition-shadow", swatch, index === 0 && "ring-2 ring-[color:var(--color-brand-primary)]")}
            />
          ))}
        </div>
        <div className="flex gap-3">
          <Button className="flex-1" iconLeft={<ShoppingBag className="h-4 w-4" />}>
            Add to Cart
          </Button>
          <Button variant="outline">Quick View</Button>
        </div>
      </div>
    </motion.article>
  );
}
