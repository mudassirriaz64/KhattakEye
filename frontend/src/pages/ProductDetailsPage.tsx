import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Heart, ShoppingBag, Truck, Shield, RefreshCw, BadgeCheck, Star, Share2, GitCompare, Minus, Plus, Glasses } from "lucide-react";
import { motion } from "framer-motion";
import { Breadcrumb } from "@/components/shop/Breadcrumb";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductAccordion } from "@/components/product/ProductAccordion";
import { ProductReviews } from "@/components/product/ProductReviews";
import { ProductRecommendations } from "@/components/product/ProductRecommendations";
import { StickyAddToCart } from "@/components/product/StickyAddToCart";
import { Button } from "@/components/primitives/Button";
import { getProductBySlug, getRelatedProducts } from "@/lib/shop-data";
import { useCartStore } from "@/lib/stores/cart-store";
import { useShopStore } from "@/lib/stores/shop-store";
import { QuickCheckoutModal } from "@/components/shop/QuickCheckoutModal";

import { cn } from "@/lib/utils";

const mockReviews = [
  { id: "r1", name: "Ayesha Khan", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face", rating: 5, date: "2 weeks ago", text: "Absolutely stunning frames! The quality is exceptional and they feel incredibly lightweight. Received so many compliments." },
  { id: "r2", name: "Usman Malik", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face", rating: 5, date: "1 month ago", text: "Premium quality that rivals international brands. The titanium construction is barely noticeable on the face. Worth every rupee." },
  { id: "r3", name: "Fatima Ahmed", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face", rating: 4, date: "3 weeks ago", text: "Beautiful design and great customer service. The virtual try-on helped me choose the perfect frame size." },
  { id: "r4", name: "Ali Raza", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face", rating: 5, date: "2 months ago", text: "My go-to brand for eyewear now. The blue light blocking lenses are perfect for my long work hours." },
];

export function ProductDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const product = slug ? getProductBySlug(slug) : null;
  const [wishlisted, setWishlisted] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const addToRecentlyViewed = useShopStore((s) => s.addToRecentlyViewed);
  const toggleCompare = useShopStore((s) => s.toggleCompare);
  const compareList = useShopStore((s) => s.compareList);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    if (product) addToRecentlyViewed(product.id);
    window.scrollTo(0, 0);
  }, [product?.id]);

  if (!product) {
    return (
      <div className="mx-auto max-w-[1440px] px-4 py-20 text-center md:px-8">
        <h1 className="font-display text-3xl text-[color:var(--color-text-primary)]">Product not found</h1>
        <Link to="/shop"><Button variant="primary" className="mt-6">Back to Shop</Button></Link>
      </div>
    );
  }

  const related = getRelatedProducts(product);

  const accordionItems = [
    {
      title: "Description",
      content: <p>{product.description}</p>,
    },
    {
      title: "Specifications",
      content: (
        <div className="grid grid-cols-2 gap-3">
          {product.specs.map((spec) => (
            <div key={spec.label} className="flex justify-between border-b border-[color:var(--color-border)] pb-2">
              <span className="text-[color:var(--color-text-tertiary)]">{spec.label}</span>
              <span className="font-medium">{spec.value}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Features",
      content: (
        <ul className="space-y-2">
          {product.features.map((f) => (
            <li key={f} className="flex items-center gap-2"><Shield className="h-3.5 w-3.5 text-[color:var(--color-accent-teal)]" />{f}</li>
          ))}
        </ul>
      ),
    },
    {
      title: "Shipping & Returns",
      content: (
        <div className="space-y-4">
          <p>Free shipping across Pakistan on all orders. Orders are processed within 24 hours and delivered within 3-5 business days.</p>
          <p>We offer a 14-day satisfaction guarantee. If you're not completely satisfied, contact us for a free return pick-up.</p>
        </div>
      ),
    },
    {
      title: `Reviews (${product.reviewCount})`,
      content: <ProductReviews reviews={mockReviews} rating={product.rating} reviewCount={product.reviewCount} />,
    },
  ];

  return (
    <>
      <div className="mx-auto max-w-[1440px] px-4 py-10 md:px-8">
        <Breadcrumb items={[
          { label: "Shop", path: "/shop" },
          { label: product.category.charAt(0).toUpperCase() + product.category.slice(1), path: `/shop?category=${product.category}` },
          { label: product.name },
        ]} />

        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
            <ProductGallery images={product.images} name={product.name} />
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-text-tertiary)]">{product.brand}</p>
              <h1 className="mt-1 font-display text-3xl text-[color:var(--color-text-primary)] md:text-4xl">{product.name}</h1>

              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={cn("h-4 w-4", i < Math.round(product.rating) ? "fill-amber-400 text-amber-400" : "text-[color:var(--color-border)]")} />
                  ))}
                  <span className="ml-1 font-medium text-[color:var(--color-text-primary)]">{product.rating}</span>
                  <span className="text-[color:var(--color-text-tertiary)]">({product.reviewCount} reviews)</span>
                </div>
                <span className={cn(
                  "text-xs font-medium",
                  product.stock > 10 ? "text-green-600" : product.stock > 0 ? "text-amber-600" : "text-[color:var(--color-danger)]",
                )}>
                  {product.stock > 0 ? "In Stock" : "Out of Stock"}
                </span>
                <span className="text-xs text-[color:var(--color-text-tertiary)]">SKU: {product.sku}</span>
              </div>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-semibold text-[color:var(--color-text-primary)]">
                {product.currency} {product.price.toLocaleString()}
              </span>
              {product.oldPrice && (
                <span className="text-lg text-[color:var(--color-text-tertiary)] line-through">
                  {product.currency} {product.oldPrice.toLocaleString()}
                </span>
              )}
              {product.discount && (
                <span className="rounded-full bg-[color:var(--color-danger)]/10 px-3 py-1 text-xs font-semibold text-[color:var(--color-danger)]">
                  Save {product.discount}%
                </span>
              )}
            </div>

            <p className="text-sm leading-7 text-[color:var(--color-text-secondary)]">{product.shortDescription}</p>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--color-text-tertiary)]">
                Color: <span className="text-[color:var(--color-text-primary)]">{product.variants[selectedVariant]?.colorName}</span>
              </p>
              <div className="mt-3 flex gap-3">
                {product.variants.map((v, i) => (
                  <button
                    key={v.color}
                    type="button"
                    onClick={() => setSelectedVariant(i)}
                    className={cn(
                      "h-10 w-10 rounded-full transition-all",
                      selectedVariant === i && "ring-2 ring-[color:var(--color-brand-primary)] ring-offset-2",
                    )}
                    style={{ backgroundColor: v.color }}
                    title={v.colorName}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Truck, text: "Free Shipping" },
                { icon: Shield, text: "Secure Payment" },
                { icon: RefreshCw, text: "Easy Returns" },
                { icon: BadgeCheck, text: "2 Yr Warranty" },
              ].map((item) => (
                <div key={item.text} className="flex flex-col items-center gap-1.5 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] py-3">
                  <item.icon className="h-4 w-4 text-[color:var(--color-accent-teal)]" />
                  <span className="text-[10px] font-medium text-[color:var(--color-text-secondary)]">{item.text}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center rounded-xl border border-[color:var(--color-border)]">
                <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="flex h-12 w-12 items-center justify-center text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)]">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="flex h-12 w-12 items-center justify-center text-sm font-medium text-[color:var(--color-text-primary)]">{quantity}</span>
                <button type="button" onClick={() => setQuantity(quantity + 1)} className="flex h-12 w-12 items-center justify-center text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)]">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button variant="primary" iconLeft={<ShoppingBag className="h-4 w-4" />} className="flex-1 px-8 py-4 text-base">
                Add to Cart — {product.currency} {product.price.toLocaleString()}
              </Button>
              <Button variant="cta-sm" className="px-8 py-4 text-base" onClick={() => setCheckoutOpen(true)}>Buy Now</Button>
              <Link
                to={`/virtual-try-on?product=${product.slug}`}
                className="flex items-center gap-2 rounded-2xl border border-[color:var(--color-accent-teal)] px-5 py-4 text-sm font-semibold text-[color:var(--color-accent-teal)] transition-all hover:bg-[color:var(--color-accent-teal)] hover:text-white"
              >
                <Glasses className="h-5 w-5" />
                Try On
              </Link>
              <button
                type="button"
                onClick={() => setWishlisted(!wishlisted)}
                className={cn("flex h-12 w-12 items-center justify-center rounded-2xl border transition-all", wishlisted ? "border-[color:var(--color-danger)] text-[color:var(--color-danger)]" : "border-[color:var(--color-border)] text-[color:var(--color-text-tertiary)] hover:text-[color:var(--color-text-primary)]")}
              >
                <Heart className={cn("h-5 w-5", wishlisted && "fill-current")} />
              </button>
              <button type="button" onClick={() => toggleCompare(product.id)} className={cn("flex h-12 w-12 items-center justify-center rounded-2xl border transition-colors", compareList.includes(product.id) ? "border-[color:var(--color-accent-teal)] text-[color:var(--color-accent-teal)]" : "border-[color:var(--color-border)] text-[color:var(--color-text-tertiary)] hover:text-[color:var(--color-text-primary)]")}>
                <GitCompare className="h-5 w-5" />
              </button>
              <button type="button" className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[color:var(--color-border)] text-[color:var(--color-text-tertiary)] hover:text-[color:var(--color-text-primary)]">
                <Share2 className="h-5 w-5" />
              </button>
            </div>

            <QuickCheckoutModal
              open={checkoutOpen}
              onClose={() => setCheckoutOpen(false)}
              product={{ name: product.name, price: product.price, currency: product.currency, image: product.images[0] }}
            />

            <ProductAccordion items={accordionItems} />
          </motion.div>
        </div>

        <div id="product-end" />
        <ProductRecommendations title="You May Also Like" products={related} />
        <ProductRecommendations title="Recently Viewed" products={related.slice(0, 2)} />
      </div>

      <StickyAddToCart product={product} />
    </>
  );
}
