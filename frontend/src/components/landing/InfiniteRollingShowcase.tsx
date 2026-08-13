import { useRef } from "react";
import { Link } from "react-router-dom";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { type ApiProduct, sanitizeProductImages, resolveCloudinaryUrl } from "@/lib/api/products";
import { cn } from "@/lib/utils";

interface InfiniteRollingShowcaseProps {
  products: ApiProduct[];
  title?: string;
  onSelectProduct?: (index: number) => void;
  activeIndex?: number;
}

export function InfiniteRollingShowcase({
  products,
  title = "Curated Atelier Showcase",
  onSelectProduct,
  activeIndex = 0,
}: InfiniteRollingShowcaseProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  if (!products || products.length === 0) return null;

  const totalCount = products.length;
  // Duplicate items 3x for continuous seamless loop
  const marqueeItems = [...products, ...products, ...products];

  const handleScrollPrev = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -320, behavior: "smooth" });
    }
  };

  const handleScrollNext = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 320, behavior: "smooth" });
    }
  };

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={title}
      className="w-full border-t border-[color:var(--color-border)] bg-[color:var(--color-panel)] py-6 overflow-hidden"
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-10 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-[color:var(--color-brand-primary)] animate-pulse" />
          <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-[color:var(--color-brand-primary)]">
            {title}
          </p>
        </div>

        {/* Slide Counter & Sleek Navigation Arrows */}
        <div className="flex items-center gap-4">
          <span className="text-xs font-mono font-semibold text-[color:var(--color-text-secondary)]">
            {String(activeIndex + 1).padStart(2, "0")} / {String(totalCount).padStart(2, "0")}
          </span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleScrollPrev}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-app-bg)] text-[color:var(--color-text-primary)] hover:bg-[color:var(--color-brand-primary)] hover:text-white transition-all shadow-xs active:scale-95"
              aria-label="Previous item"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleScrollNext}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-app-bg)] text-[color:var(--color-text-primary)] hover:bg-[color:var(--color-brand-primary)] hover:text-white transition-all shadow-xs active:scale-95"
              aria-label="Next item"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* GPU Accelerated Hardware Infinite Loop Marquee */}
      <div
        ref={containerRef}
        className="relative w-full overflow-x-auto scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        <div
          aria-live="polite"
          className="flex w-max gap-5 px-6 md:px-10 py-2 animate-infinite-scroll hover:[animation-play-state:paused]"
        >
          {marqueeItems.map((prod, index) => {
            const realIdx = index % totalCount;
            const isSelected = realIdx === activeIndex;
            const images = sanitizeProductImages(prod.images);
            const img = prod.hoverImage ? resolveCloudinaryUrl(prod.hoverImage) : images[0];
            const brandName = (prod.brand || "Khattak Atelier").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

            return (
              <div
                key={`${prod._id || prod.id || index}-${index}`}
                onClick={() => onSelectProduct?.(realIdx)}
                className="cursor-pointer"
              >
                <Link
                  to={`/product/${prod.slug}`}
                  className={cn(
                    "group flex w-72 shrink-0 items-center gap-3.5 rounded-2xl border p-3 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-soft)]",
                    isSelected
                      ? "border-[color:var(--color-brand-primary)] bg-[color:var(--color-panel)] ring-1 ring-[color:var(--color-brand-primary)]/30"
                      : "border-[color:var(--color-border)] bg-[color:var(--color-app-bg)] hover:border-[color:var(--color-brand-primary)]/40"
                  )}
                >
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-[color:var(--color-border)] bg-white p-1 flex items-center justify-center">
                    <img
                      src={img}
                      alt={prod.name}
                      className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-[color:var(--color-text-tertiary)] truncate">
                      {brandName}
                    </p>
                    <h4 className="font-display text-sm font-semibold text-[color:var(--color-text-primary)] truncate transition-colors group-hover:text-[color:var(--color-brand-primary)]">
                      {prod.name}
                    </h4>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-xs font-bold text-[color:var(--color-text-primary)]">
                        Rs. {(prod.price || 0).toLocaleString()}
                      </span>
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-amber-500">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        {prod.rating || 5}
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
