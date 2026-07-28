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
  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="group overflow-hidden rounded-[28px] border border-[color:var(--color-border)] bg-[color:var(--color-panel)] shadow-[var(--shadow-soft)]"
    >
      <div className="relative overflow-hidden border-b border-[color:var(--color-border)] bg-[linear-gradient(180deg,#ffffff,#f3f4f6)] p-5 dark:bg-[linear-gradient(180deg,#121214,#191A1C)]">
        <div className="absolute left-5 top-5 z-20">
          <Badge>{discount}</Badge>
        </div>
        <button
          type="button"
          aria-label={`Save ${name}`}
          className="absolute right-5 top-5 z-20 rounded-full border border-white/60 bg-white/80 p-2 text-[color:var(--color-text-primary)] shadow-sm backdrop-blur transition-all hover:scale-105 dark:border-white/10 dark:bg-black/20"
        >
          <Heart className="h-4 w-4" />
        </button>
        <div className="relative h-72 overflow-hidden rounded-[24px]">
          <img
            src={image}
            alt={name}
            className="absolute inset-0 h-full w-full object-cover transition-all duration-300 group-hover:scale-[1.04] group-hover:opacity-0"
          />
          <img
            src={hoverImage}
            alt={`${name} alternate view`}
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-all duration-300 group-hover:scale-[1.04] group-hover:opacity-100"
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
            <span
              key={`${name}-${swatch}`}
              className={cn("h-5 w-5 rounded-full border border-white/80 shadow-sm ring-1 ring-black/5", swatch, index === 0 && "ring-2 ring-[color:var(--color-brand-primary)]")}
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
