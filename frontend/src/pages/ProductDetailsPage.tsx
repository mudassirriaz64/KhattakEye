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
import { getProductBySlug as getApiProductBySlug, getProducts, mapProductCard } from "@/lib/api/products";
import { useCartStore } from "@/lib/stores/cart-store";
import { useShopStore } from "@/lib/stores/shop-store";
import { QuickCheckoutModal } from "@/components/shop/QuickCheckoutModal";

import { cn } from "@/lib/utils";

export function ProductDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [wishlisted, setWishlisted] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const addToRecentlyViewed = useShopStore((s) => s.addToRecentlyViewed);
  const toggleCompare = useShopStore((s) => s.toggleCompare);
  const compareList = useShopStore((s) => s.compareList);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!slug) return;

    setLoading(true);
    getApiProductBySlug(slug)
      .then((data) => {
        if (data) {
          const mapped = {
            id: data._id || data.id,
            slug: data.slug || slug,
            name: data.name,
            brand: data.brand || "Khattak Atelier",
            price: data.price,
            originalPrice: data.originalPrice || data.price,
            rating: data.rating || 5.0,
            reviewCount: data.reviewCount || 14,
            description: data.description || "",
            shortDescription: data.shortDescription || data.description || "",
            images: data.images && data.images.length > 0 ? data.images : ["/hero-sunglasses.png"],
            colors: data.variants ? data.variants.map((v: any) => ({ name: v.colorName || "Default", hex: v.hexCode || "#000", image: data.images[0] || "" })) : [{ name: "Black", hex: "#000" }],
            sku: data.sku || `KT-${data._id?.substring(0, 6) || "SPEC"}`,
            inStock: data.stock > 0,
            stock: data.stock !== undefined ? data.stock : 10,
            category: data.category || "Sunglasses",
            subcategory: data.subcategory || "Fashion & Luxury",
            frameShape: data.frameShape || "Aviator",
            frameMaterial: data.frameMaterial || "Acetate",
            lensType: data.lensType || "Polarized",
            gender: Array.isArray(data.gender) ? data.gender[0] : (data.gender || "Unisex"),
            badges: data.badges || ["Handcrafted"],
            variants: data.variants || [],
            dimensions: {
              eyeWidth: data.eyeWidth || 54,
              bridgeWidth: data.bridgeWidth || 18,
              templeLength: data.templeLength || 145
            }
          };
          setProduct(mapped);
          addToRecentlyViewed(mapped.id);
          getProducts({ category: mapped.category, limit: 5 })
            .then((res) => {
              const list = (res.items || []).map(mapProductCard).filter((p) => p.id !== mapped.id);
              setRelated(list.slice(0, 4));
            })
            .catch(() => setRelated([]));
        }
      })
      .catch(() => {
        setProduct(null);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (!product) {
    return (
      <div className="mx-auto max-w-[1440px] px-4 py-20 text-center md:px-8">
        <h1 className="font-display text-3xl text-[color:var(--color-text-primary)]">Product not found</h1>
        <Link to="/shop"><Button variant="primary" className="mt-6">Back to Shop</Button></Link>
      </div>
    );
  }

  const accordionItems = [
    {
      title: "Description",
      content: <p>{product.description}</p>,
    },
    {
      title: "Specifications",
      content: (
        <div className="grid grid-cols-2 gap-3">
          {(product.specs && product.specs.length > 0
            ? product.specs
            : [
                { label: "Frame Shape", value: product.frameShape || "Aviator" },
                { label: "Frame Material", value: product.frameMaterial || "Acetate" },
                { label: "Lens Type", value: product.lensType || "Polarized" },
                { label: "Gender", value: product.gender || "Unisex" },
              ]
          ).map((spec: any) => (
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
          {(product.features && product.features.length > 0
            ? product.features
            : [
                "Italian Acetate Construction",
                "UV400 100% Protection",
                "Anti-Scratch Coating",
                "Ergonomic Handcrafted Fit"
              ]
          ).map((f: string) => (
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
      content: <ProductReviews reviews={[]} rating={product.rating} reviewCount={product.reviewCount} />,
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
            <ProductGallery 
              images={
                product.variants[selectedVariant]?.image 
                  ? [product.variants[selectedVariant].image, ...product.images.filter(img => img !== product.variants[selectedVariant].image)]
                  : product.images
              } 
              name={product.name} 
            />
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {product.category === "sunglasses" && (
                  <>
                    <span className="rounded-md bg-blue-600 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">Polarized</span>
                    <span className="rounded-md bg-amber-400 px-2.5 py-0.5 text-[10px] font-bold text-black uppercase tracking-wider">Premium</span>
                  </>
                )}
              </div>
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
              </div>
            </div>

            {/* Price & Package Includes Card */}
            <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-[color:var(--color-text-tertiary)] font-medium">Price includes</p>
                <ul className="text-xs text-[color:var(--color-text-secondary)] mt-1 space-y-0.5">
                  <li>• {product.category === 'sunglasses' ? 'Sunglasses' : 'Frames'}</li>
                  <li>• Cleaning cloth & Hard Box</li>
                </ul>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-[color:var(--color-text-primary)]">
                  {product.currency} {product.price.toLocaleString()}
                </span>
                {product.oldPrice && (
                  <p className="text-xs text-[color:var(--color-text-tertiary)] line-through">
                    {product.currency} {product.oldPrice.toLocaleString()}
                  </p>
                )}
              </div>
            </div>

            <p className="text-sm leading-7 text-[color:var(--color-text-secondary)]">{product.shortDescription}</p>

            {/* Color Swatches Grid (Ainak.pk Style) */}
            <div>
              <p className="text-xs font-semibold text-[color:var(--color-text-primary)] mb-2">
                Color: <span className="font-bold">{product.variants[selectedVariant]?.colorName || "Standard"}</span>
              </p>
              <div className="grid grid-cols-5 gap-2.5 sm:grid-cols-6">
                {product.variants.map((v, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedVariant(i)}
                    className={cn(
                      "relative aspect-video rounded-xl border-2 overflow-hidden bg-white p-0.5 transition-all shadow-sm",
                      selectedVariant === i
                        ? "border-[color:var(--color-brand-primary)] ring-2 ring-[color:var(--color-brand-primary)]/20"
                        : "border-[color:var(--color-border)] hover:border-[color:var(--color-text-tertiary)]"
                    )}
                    title={v.colorName}
                  >
                    <img 
                      src={v.image || product.images[0]} 
                      alt={v.colorName} 
                      className="h-full w-full object-contain"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Frame Size Information */}
            <div className="text-xs text-[color:var(--color-text-secondary)] font-medium">
              Size : <span className="font-bold text-[color:var(--color-text-primary)]">Large ( 54 ▢ 18 - 145 )</span>
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
              <div className="flex gap-2">
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
                <Link
                  to={`/virtual-try-on?product=${product.slug}`}
                  className="flex items-center justify-center h-12 w-12 rounded-2xl border border-[color:var(--color-accent-teal)] text-[color:var(--color-accent-teal)] transition-all hover:bg-[color:var(--color-accent-teal)] hover:text-white"
                >
                  <Glasses className="h-5 w-5" />
                </Link>
              </div>
            </div>

            {/* Ainak.pk Action Buttons */}
            <div className="space-y-3 pt-2">
              <Button 
                variant="primary" 
                className="w-full py-4 bg-[#b91c1c] hover:bg-[#991b1b] text-white flex flex-col items-center justify-center gap-0.5 h-auto rounded-xl"
                onClick={() => {
                  addItem(product, quantity);
                  setCheckoutOpen(true);
                }}
              >
                <span className="font-bold text-sm sm:text-base tracking-wider text-white">BUY NOW</span>
                <span className="text-xs font-normal text-white/80">sunglasses with box</span>
              </Button>

              <Button 
                variant="outline" 
                className="w-full py-4 border-[#B81D1D] text-[#B81D1D] hover:bg-[#B81D1D]/5 flex flex-col items-center justify-center gap-0.5 h-auto rounded-xl"
                onClick={() => setCheckoutOpen(true)}
              >
                <span className="font-bold text-sm sm:text-base tracking-wider text-[#B81D1D]">SELECT LENSES</span>
                <span className="text-xs font-normal text-[#B81D1D]/80">eyesight or customise glasses color</span>
              </Button>
            </div>

            {/* Ainak.pk Callout Banner */}
            <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 text-xs text-amber-900 leading-relaxed font-medium">
              To order sunglasses with your eyesight number or customize sunglasses lens color, Choose <strong>SELECT LENSES</strong>.
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
        {related.length > 0 && (
          <>
            <ProductRecommendations title="You May Also Like" products={related} />
            <ProductRecommendations title="Recently Viewed" products={related.slice(0, 2)} />
          </>
        )}
      </div>

      <StickyAddToCart product={product} />
    </>
  );
}
