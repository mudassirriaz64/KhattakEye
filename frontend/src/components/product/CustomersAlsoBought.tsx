import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Product = {
  id: string;
  name: string;
  brand: string;
  price: string;
  image: string;
};

type Props = {
  products: Product[];
};

export function CustomersAlsoBought({ products }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <h3 className="font-display text-xl text-[color:var(--color-text-primary)]">Customers Also Bought</h3>

      <div className="group relative mt-4">
        <button
          type="button"
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[color:var(--color-panel)] shadow-[var(--shadow-soft)] opacity-0 transition-opacity group-hover:opacity-100 md:flex"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div ref={scrollRef} className="flex gap-4 overflow-x-auto scroll-smooth pb-2" style={{ scrollbarWidth: "none" }}>
          {products.map((product) => (
            <motion.div
              key={product.id}
              whileHover={{ y: -4 }}
              className="flex-shrink-0 w-44"
            >
              <div className="overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-36 w-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="p-3">
                  <p className="text-[10px] uppercase tracking-wider text-[color:var(--color-text-tertiary)]">{product.brand}</p>
                  <p className="mt-1 text-sm font-medium text-[color:var(--color-text-primary)] truncate">{product.name}</p>
                  <p className="mt-1 text-sm font-semibold text-[color:var(--color-text-primary)]">{product.price}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[color:var(--color-panel)] shadow-[var(--shadow-soft)] opacity-0 transition-opacity group-hover:opacity-100 md:flex"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
