import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Heart, Truck, Shield, RefreshCw, BadgeCheck, Star, GitCompare, Minus, Plus, Glasses } from "lucide-react";
import { motion } from "framer-motion";
import { Breadcrumb } from "@/components/shop/Breadcrumb";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductAccordion } from "@/components/product/ProductAccordion";
import { ProductReviews } from "@/components/product/ProductReviews";
import { ProductRecommendations } from "@/components/product/ProductRecommendations";
import { StickyAddToCart } from "@/components/product/StickyAddToCart";
import { Button } from "@/components/primitives/Button";
import { getProductBySlug as getApiProductBySlug, getProducts, mapProductCard, sanitizeProductImages, productImageFallback } from "@/lib/api/products";
import { useCartStore } from "@/lib/stores/cart-store";
import { useShopStore } from "@/lib/stores/shop-store";

import { cn, formatCurrency } from "@/lib/utils";
import { type Product } from "@/lib/shop-data";

interface ProductDetailsVariant {
  colorName?: string;
  hexCode?: string;
  image?: string;
  images?: string[];
  lensWidth?: string;
  bridgeWidth?: string;
  templeLength?: string;
  frameMaterial?: string;
}

interface ProductDetailsData {
  id: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  description: string;
  shortDescription: string;
  images: string[];
  videos?: string[];
  colors: { name: string; hex: string }[];
  sku: string;
  inStock: boolean;
  stock: number;
  category: string;
  subcategory: string;
  frameShape: string;
  frameMaterial: string;
  lensType: string;
  gender: string;
  isPolarized?: boolean;
  isPremium?: boolean;
  badges: string[];
  variants: ProductDetailsVariant[];
  dimensions: { eyeWidth: number; bridgeWidth: number; templeLength: number };
  specs?: { label: string; value: string }[];
  features?: string[];
  currency?: string;
  oldPrice?: number;
  _id?: string;
  size?: string;
}

export function ProductDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductDetailsData | null>(null);
  const [related, setRelated] = useState<Product[]>([]);

  const [wishlisted, setWishlisted] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const addToRecentlyViewed = useShopStore((s) => s.addToRecentlyViewed);
  const toggleCompare = useShopStore((s) => s.toggleCompare);
  const compareList = useShopStore((s) => s.compareList);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!slug) return;

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
            rating: data.rating !== undefined ? data.rating : 0,
            reviewCount: data.reviewCount !== undefined ? data.reviewCount : 0,
            description: data.description || "",
            shortDescription: data.shortDescription || data.description || "",
            images: sanitizeProductImages(data.images),
            videos: Array.isArray(data.videos) ? data.videos : [],
            colors: data.variants ? data.variants.map((v: { colorName?: string; hexCode?: string }) => ({ name: v.colorName || "Default", hex: v.hexCode || "#000", image: data.images[0] || "" })) : [{ name: "Black", hex: "#000" }],
            sku: data.sku || `KT-${data._id?.substring(0, 6) || "SPEC"}`,
            inStock: data.stock > 0,
            stock: data.stock !== undefined ? data.stock : 10,
            category: (typeof data.category === 'object' && data.category !== null ? (data.category as { name?: string }).name : String(data.category || 'Eyewear')) || 'Eyewear',
            subcategory: data.subcategory || "Fashion & Luxury",
            frameShape: data.frameShape || "Aviator",
            frameMaterial: data.frameMaterial || "Acetate",
            lensType: data.lensType || "Polarized",
            gender: Array.isArray(data.gender) ? data.gender[0] : (data.gender || "Unisex"),
            isPolarized: Boolean(data.isPolarized),
            isPremium: Boolean(data.isPremium),
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
              setRelated(list.slice(0, 4) as unknown as Product[]);
            })
            .catch(() => setRelated([]));
        }
      })
      .catch(() => {
        setProduct(null);
      });
  }, [slug, addToRecentlyViewed]);

  if (!product) {
    return (
      <div className="mx-auto max-w-[1440px] px-4 py-20 text-center md:px-8">
        <h1 className="font-display text-3xl text-[color:var(--color-text-primary)]">Product not found</h1>
        <Link to="/shop"><Button variant="primary" className="mt-6">Back to Shop</Button></Link>
      </div>
    );
  }

  const activeVariant = product.variants[selectedVariant];
  const variantImages = activeVariant?.images && activeVariant.images.length > 0
    ? activeVariant.images
    : activeVariant?.image
      ? [activeVariant.image]
      : [];

  const rawGalleryImages = variantImages.length > 0 ? variantImages : product.images;
  const galleryImages = sanitizeProductImages(rawGalleryImages);
  const displayImages = galleryImages.length > 0 ? galleryImages : [productImageFallback(product.slug || product.name || "eyewear")];

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
          ).map((spec: { label: string; value: string }) => (
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
          <p className="pt-2 text-xs font-semibold">
            <Link to="/shipping-policy" className="text-[color:var(--color-brand-primary)] hover:underline mr-4">Full Shipping Policy →</Link>
            <Link to="/return-policy" className="text-[color:var(--color-brand-primary)] hover:underline">Full Return Policy →</Link>
          </p>
        </div>
      ),
    },
    {
      title: `Reviews (${product.reviewCount})`,
      content: <ProductReviews productId={product.id || product._id} rating={product.rating} reviewCount={product.reviewCount} />,
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

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className="sticky top-[104px] self-start">
            <ProductGallery 
              images={displayImages} 
              videos={product.videos}
              name={product.name}
              action={
                <Link
                  to={`/virtual-try-on?product=${product.slug}`}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-4 py-3 text-sm font-semibold text-[color:var(--color-text-primary)] transition-all hover:border-[color:var(--color-brand-primary)] hover:text-[color:var(--color-brand-primary)]"
                >
                  <Glasses className="h-4 w-4" />
                  Try On
                </Link>
              }
            />
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="card-luxury space-y-6 p-6 sm:p-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {product.isPolarized && (
                  <span className="rounded-md bg-blue-600 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">Polarized</span>
                )}
                {product.isPremium && (
                  <span className="rounded-md bg-amber-400 px-2.5 py-0.5 text-[10px] font-bold text-black uppercase tracking-wider">Premium</span>
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
                  {formatCurrency(product.price)}
                </span>
                {(product.oldPrice || product.originalPrice) && (
                  <p className="text-xs text-[color:var(--color-text-tertiary)] line-through">
                    {formatCurrency(product.oldPrice || product.originalPrice)}
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
                    {(() => {
                      const candidateImgs = [v.image, ...(v.images || []), ...product.images].filter((img): img is string => typeof img === "string" && img.trim().length > 0 && !img.includes("blob:"));
                      const swatchUrl = sanitizeProductImages([candidateImgs[0]])[0];
                      return (
                        <img 
                          src={swatchUrl} 
                          alt={v.colorName || "Variant"} 
                          className="h-full w-full object-contain"
                        />
                      );
                    })()}
                  </button>
                ))}
              </div>
            </div>

            {/* Frame Size Information */}
            <div className="text-xs text-[color:var(--color-text-secondary)] font-medium">
              Size :{" "}
              <span className="font-bold text-[color:var(--color-text-primary)]">
                {activeVariant?.lensWidth || product.dimensions.eyeWidth} ▢ {activeVariant?.bridgeWidth || product.dimensions.bridgeWidth} - {activeVariant?.templeLength || product.dimensions.templeLength}
              </span>
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
              </div>
            </div>

            {/* Ainak.pk Action Buttons */}
            <div className="space-y-3 pt-2">
              <Button 
                variant="primary" 
                className="w-full py-4 bg-[#b91c1c] hover:bg-[#991b1b] text-white flex flex-col items-center justify-center gap-0.5 h-auto rounded-xl"
                onClick={() => {
                  addItem({
                    productId: product.id || product._id,
                    name: product.name,
                    brand: product.brand,
                    image: product.images?.[0] || "",
                    price: product.price,
                    quantity,
                    color: product.colors?.[0]?.hex || "#000",
                    colorName: product.colors?.[0]?.name || "Standard",
                    size: product.size || "Medium",
                    lensType: product.lensType || "Standard",
                    sku: product.sku || product.id,
                    stock: product.stock || 10
                  });
                  navigate("/cart");
                }}
              >
                <span className="font-bold text-sm sm:text-base tracking-wider text-white">BUY NOW</span>
                <span className="text-xs font-normal text-white/80">{product.category === "eyeglasses" ? "frame with box & cloth" : "sunglasses with box"}</span>
              </Button>

              <Button 
                variant="outline" 
                className="w-full py-4 border-[#B81D1D] text-[#B81D1D] hover:bg-[#B81D1D]/5 flex flex-col items-center justify-center gap-0.5 h-auto rounded-xl"
                onClick={() => navigate(`/product/${product.slug}/select-lenses`, { state: { selectedVariant } })}
              >
                <span className="font-bold text-sm sm:text-base tracking-wider text-[#B81D1D]">SELECT LENSES</span>
                <span className="text-xs font-normal text-[#B81D1D]/80">{product.category === "eyeglasses" ? "with or without eyesight glasses" : "eyesight or customise glasses color"}</span>
                {product.category === "eyeglasses" && (
                  <span className="text-xs font-normal text-[#2563EB]">choose blue light glasses</span>
                )}
              </Button>
            </div>

            {/* Ainak.pk Callout Banner */}
            <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 text-xs text-amber-900 leading-relaxed font-medium">
              {product.category === "eyeglasses" ? (
                "To order eyeglasses with your eyesight number or customize the lens coating, Choose "
              ) : (
                "To order sunglasses with your eyesight number or customize sunglasses lens color, Choose "
              )}
              <strong>SELECT LENSES</strong>.
            </div>


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

      <StickyAddToCart product={product as unknown as Product} />
    </>
  );
}
