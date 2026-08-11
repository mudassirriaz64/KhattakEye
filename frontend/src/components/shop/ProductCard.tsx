import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { type Product } from "@/lib/shop-data";
import { useShopStore } from "@/lib/stores/shop-store";
import { useCartStore } from "@/lib/stores/cart-store";
import { useWishlistStore } from "@/lib/stores/wishlist-store";
import { cn } from "@/lib/utils";

type ProductCardProps = {
  product: Product;
  viewMode?: "grid" | "list";
};

export const ProductCard = React.forwardRef(
  ({ product, viewMode = "grid" }: ProductCardProps, ref: React.Ref<HTMLDivElement>) => {
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);
  const wishlistItems = useWishlistStore((s) => s.items);
  const targetId = String((product as any)._id || product.id || "");
  const isWishlisted = wishlistItems.some((i) => String(i._id || i.id || "") === targetId);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const addToRecentlyViewed = useShopStore((s) => s.addToRecentlyViewed);
  const addItem = useCartStore((s) => s.addItem);

  const isList = viewMode === "list";
  const images = (product.images && product.images.length > 0)
    ? product.images
    : ["https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=600&fit=crop"];

  const handleClick = () => addToRecentlyViewed(product.id);

  // Format brand name cleanly (remove hyphens, capitalize words)
  const rawBrand = product.brand || "Khattak Atelier";
  const formattedBrand = rawBrand.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleDotClick = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex(index);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      name: product.name,
      brand: formattedBrand,
      image: images[0],
      price: product.price,
      quantity: 1,
      color: product.variants[0]?.color || "#000",
      colorName: product.variants[0]?.colorName || "Standard",
      size: product.frameSize || "Medium",
      lensType: product.lensType || "Standard",
      sku: product.sku || product.id,
      stock: product.stock || 10
    });
  };

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseLeave={() => setCurrentImageIndex(0)}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-soft)]",
        isList ? "flex-row" : ""
      )}
    >
      {/* Image Container with 4:3 Aspect Ratio */}
      <div className={cn("relative overflow-hidden bg-white", isList ? "w-56 shrink-0" : "aspect-[4/3] w-full")}>
        <Link to={`/product/${product.slug}`} onClick={handleClick} className="block h-full w-full">
          <img
            src={images[currentImageIndex] || images[0]}
            alt={product.name}
            className="h-full w-full object-contain transition-transform duration-500"
          />
        </Link>

        {/* Top Right Overlay: ONLY Wishlist (Heart) with 12px Margins */}
        <div className="absolute right-3 top-3 z-10">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product);
            }}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-[color:var(--color-text-primary)] shadow-sm backdrop-blur-md transition-all hover:scale-110 hover:bg-white",
              isWishlisted && "text-[color:var(--color-danger)]"
            )}
            title="Wishlist"
          >
            <Heart className={cn("h-4 w-4", isWishlisted && "fill-current")} />
          </button>
        </div>

        {/* Hover Navigation Chevrons & Pagination Dots */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black/40 text-white opacity-0 transition-opacity duration-200 hover:bg-black/70 group-hover:opacity-100"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black/40 text-white opacity-0 transition-opacity duration-200 hover:bg-black/70 group-hover:opacity-100"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-1.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => handleDotClick(e, idx)}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    currentImageIndex === idx ? "w-4 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"
                  )}
                />
              ))}
            </div>
          </>
        )}

        {/* Always Visible Prominent Try-On Badge Overlay */}
        <div className="absolute bottom-2.5 left-2.5 z-20">
          <Link
            to={`/virtual-try-on?product=${encodeURIComponent(product.slug || product.name)}`}
            onClick={handleClick}
            className="flex items-center gap-1.5 rounded-full border border-white/20 bg-black/75 px-3 py-1 text-[11px] font-bold text-white shadow-md backdrop-blur-md transition-all hover:bg-black hover:scale-105 hover:border-white/40"
          >
            <span className="font-mono text-xs text-[color:var(--color-accent-teal)]">[oo]</span>
            <span>Try On</span>
          </Link>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="flex flex-1 flex-col p-4">
        {/* Brand Name */}
        <div className="text-[10px] font-semibold tracking-wide text-[color:var(--color-text-tertiary)]">
          <span className="uppercase tracking-[0.16em]">{formattedBrand}</span>
        </div>

        {/* Clean Modern Sans-Serif Title with Line-Clamp */}
        <Link to={`/product/${product.slug}`} onClick={handleClick} className="mt-1">
          <h3 className="font-sans text-sm font-medium leading-snug text-[color:var(--color-text-primary)] line-clamp-1 transition-colors hover:text-[color:var(--color-accent-teal)]">
            {product.name}
          </h3>
        </Link>

        {/* Rating & Review Count */}
        <div className="mt-1 flex items-center gap-1 text-xs">
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
          <span className="font-semibold text-[color:var(--color-text-primary)]">{product.rating}</span>
          <span className="text-[10px] text-[color:var(--color-text-tertiary)]">({product.reviewCount})</span>
        </div>

        {/* Clean Inline Prices with Crisp Neutral Light Grey for Discounted Price */}
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-base font-bold text-[color:var(--color-text-primary)]">
            Rs. {product.price.toLocaleString()}
          </span>
          {product.oldPrice && (
            <span className="text-xs font-medium text-[color:var(--color-text-tertiary)] line-through">
              Rs. {product.oldPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
});
