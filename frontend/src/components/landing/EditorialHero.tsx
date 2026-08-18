import { useState, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Camera, Sparkles, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/primitives/Button";
import { heroSlides } from "@/lib/hero-data";
import { stats } from "@/lib/landing-data";
import axios from "@/lib/api/axios";
import { getProducts, sanitizeProductImages, resolveCloudinaryUrl, type ApiProduct } from "@/lib/api/products";
import { Glasses3DViewer } from "./Glasses3DViewer";
import { InfiniteRollingShowcase } from "./InfiniteRollingShowcase";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

interface FeaturedProduct {
  name: string;
  slug: string;
  price: number;
  oldPrice?: number | null;
  rating: number;
  reviewCount: number;
  image: string;
  brand?: string;
  frameMaterial?: string;
  lensType?: string;
  isPolarized?: boolean;
}

interface BannerPayload {
  _id?: string;
  image?: string;
  title?: string;
  subtitle?: string;
  featuredProduct?: {
    name?: string;
    slug?: string;
    price?: number;
    oldPrice?: number | null;
    rating?: number;
    reviewCount?: number;
    images?: string[];
    hoverImage?: string;
    brand?: string;
    frameMaterial?: string;
    lensType?: string;
    isPolarized?: boolean;
  } | null;
}

const toFeaturedProduct = (p: ApiProduct | NonNullable<BannerPayload["featuredProduct"]>): FeaturedProduct | undefined => {
  if (!p?.name || !p?.slug) return undefined;
  const images = sanitizeProductImages(p.images);
  const image = p.hoverImage ? resolveCloudinaryUrl(p.hoverImage) : images[0];
  if (!image) return undefined;
  return {
    name: p.name,
    slug: p.slug,
    price: p.price || 0,
    oldPrice: p.oldPrice ?? null,
    rating: p.rating || 0,
    reviewCount: p.reviewCount || 0,
    image,
    brand: p.brand || "Khattak Eyewear",
    frameMaterial: p.frameMaterial || "Japanese Titanium",
    lensType: p.lensType || "Precision Optics",
    isPolarized: Boolean(p.isPolarized),
  };
};

export function EditorialHero() {
  const [featuredProducts, setFeaturedProducts] = useState<ApiProduct[]>([]);
  const [settings, setSettings] = useState<{
    policies?: { returnWindowDays?: number; warrantyYears?: number };
  } | null>(null);
  const [activeProductIdx, setActiveProductIdx] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [productRes, settingsRes] = await Promise.all([
          getProducts({ featured: true, limit: 10 }),
          axios.get("/settings"),
        ]);
        if (cancelled) return;
        setSettings(settingsRes.data);
        if (productRes && Array.isArray(productRes.items)) {
          setFeaturedProducts(productRes.items);
        }
      } catch (err) {
        console.error("Failed to load hero data:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Smooth auto-rolling rotation through database featured products
  useEffect(() => {
    if (featuredProducts.length <= 1) return;
    const timer = setInterval(() => {
      setActiveProductIdx((prev) => (prev + 1) % featuredProducts.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [featuredProducts.length]);

  const activeProductRaw = featuredProducts[activeProductIdx] || featuredProducts[0];
  const activeProduct = activeProductRaw ? toFeaturedProduct(activeProductRaw) : undefined;
  const activeProductImage = activeProduct?.image || heroSlides[0].desktopImage;

  const heroStats = [
    { value: stats[0].value, suffix: stats[0].suffix, label: stats[0].label },
    {
      value: settings?.policies?.returnWindowDays ?? stats[1].value,
      suffix: stats[1].suffix,
      label: stats[1].label,
    },
    {
      value: settings?.policies?.warrantyYears ?? stats[2].value,
      suffix: stats[2].suffix,
      label: stats[2].label,
    },
  ];

  if (loading) {
    return (
      <section className="relative min-h-[85vh] w-full overflow-hidden bg-[color:var(--color-app-bg)] text-[color:var(--color-text-primary)] flex flex-col justify-center p-8">
        <div className="mx-auto max-w-[1440px] w-full space-y-8">
          <div className="h-8 w-56 rounded-full bg-[color:var(--color-border)] animate-pulse" />
          <div className="h-24 w-3/4 rounded-3xl bg-[color:var(--color-border)] animate-pulse" />
          <div className="h-12 w-1/2 rounded-xl bg-[color:var(--color-border)] animate-pulse" />
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full overflow-hidden bg-[color:var(--color-app-bg)] text-[color:var(--color-text-primary)] border-b border-[color:var(--color-border)]">
      
      {/* Dynamic Radial Ambient Spotlight */}
      <div className="pointer-events-none absolute top-1/2 right-10 -translate-y-1/2 h-[650px] w-[650px] rounded-full bg-gradient-to-tr from-amber-100/30 via-amber-200/10 to-transparent blur-3xl opacity-80" />
      <div className="pointer-events-none absolute top-10 left-10 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-[color:var(--color-brand-primary)]/5 via-transparent to-transparent blur-3xl opacity-50" />

      <div className="relative mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16 py-10 lg:py-16 min-h-[82vh] flex flex-col justify-between">
        
        {/* ─── ASYMMETRIC 2-COLUMN LUXURY HERO GRID ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto">
          
          {/* Left Column: Bold Headline & Brand CTAs */}
          <div className="lg:col-span-6 relative z-20 space-y-8">
            <motion.div
              variants={container}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {/* Monogram Badge */}
              <motion.div variants={item} className="inline-flex items-center gap-2.5 rounded-full border border-[color:var(--color-brand-primary)]/20 bg-[color:var(--color-panel)]/80 px-4 py-1.5 shadow-sm backdrop-blur-md">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[color:var(--color-brand-primary)]/10 p-0.5 border border-[color:var(--color-brand-primary)]/30">
                  <img
                    src="/khattak.png"
                    alt="K"
                    className="h-3.5 w-3.5 object-contain"
                  />
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[color:var(--color-brand-primary)]">
                  KHATTAK EYEWEAR · NEW SEASON 2026
                </span>
              </motion.div>

              {/* Bold Serif Headline */}
              <motion.h1
                variants={item}
                className="font-display text-5xl sm:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight text-[color:var(--color-text-primary)]"
              >
                The World is<br />
                <span className="italic font-light">Worth Seeing.</span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                variants={item}
                className="max-w-xl text-base leading-relaxed text-[color:var(--color-text-secondary)] sm:text-lg font-normal"
              >
                Italian acetates, Japanese titanium, and optics that have earned a following across the country. Handcrafted with uncompromising precision.
              </motion.p>

              {/* Sleek Action Buttons */}
              <motion.div variants={item} className="pt-2 flex flex-wrap items-center gap-4">
                <Link to="/shop">
                  <Button variant="cta-lg" className="bg-[color:var(--color-text-primary)] hover:bg-[color:var(--color-brand-primary)] text-white px-8 py-4 rounded-2xl shadow-luxury" iconRight={<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}>
                    Explore Collection
                  </Button>
                </Link>
                <Link to="/virtual-try-on">
                  <Button variant="outline" className="border-[color:var(--color-border)] bg-[color:var(--color-panel)]/90 text-[color:var(--color-text-primary)] hover:border-[color:var(--color-brand-primary)] hover:bg-[color:var(--color-brand-primary)] hover:text-white transition-all shadow-xs backdrop-blur-md px-6 py-4 rounded-2xl gap-2">
                    <Camera className="h-4 w-4 text-[color:var(--color-brand-primary)] group-hover:text-white" />
                    <span>Virtual Try-On</span>
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Column: Oversized Active Showcase (Zero Clipping, 100% Transparent Floating Visual) */}
          <div className="lg:col-span-6 relative z-10 flex flex-col items-center justify-center min-h-[480px] lg:min-h-[580px] bg-transparent">
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProduct?.slug || activeProductIdx}
                initial={{ opacity: 0, scale: 0.95, y: 14 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -14 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="relative w-full h-[480px] lg:h-[580px] flex flex-col items-center justify-center bg-transparent"
              >
                {/* Oversized Frame Visual Display */}
                <Link
                  to={activeProduct ? `/product/${activeProduct.slug}` : "/shop"}
                  className="group relative block w-full h-full flex items-center justify-center bg-transparent"
                >
                  <Glasses3DViewer
                    imageSrc={activeProductImage}
                    altText={activeProduct?.name || "Khattak Eyewear"}
                    badgeText="360° Interactive View"
                  />
                </Link>

                {/* Left/Right Floating Navigation Chevrons */}
                {featuredProducts.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setActiveProductIdx((prev) => (prev === 0 ? featuredProducts.length - 1 : prev - 1));
                      }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-panel)]/90 text-[color:var(--color-text-primary)] shadow-md backdrop-blur-md transition-all hover:scale-110 hover:bg-[color:var(--color-brand-primary)] hover:text-white"
                      aria-label="Previous featured product"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setActiveProductIdx((prev) => (prev + 1) % featuredProducts.length);
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-panel)]/90 text-[color:var(--color-text-primary)] shadow-md backdrop-blur-md transition-all hover:scale-110 hover:bg-[color:var(--color-brand-primary)] hover:text-white"
                      aria-label="Next featured product"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}

                {/* Floating Active Frame Info Badge */}
                {activeProduct && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex flex-wrap items-center justify-center gap-3 rounded-full border border-[color:var(--color-border)]/80 bg-[color:var(--color-panel)]/95 px-5 py-2 shadow-sm backdrop-blur-md text-xs"
                  >
                    {activeProduct.oldPrice && activeProduct.oldPrice > activeProduct.price && (
                      <span className="rounded-full bg-[color:var(--color-brand-primary)] px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                        {Math.round(((activeProduct.oldPrice - activeProduct.price) / activeProduct.oldPrice) * 100)}% OFF
                      </span>
                    )}
                    <span className="flex items-center gap-1 font-bold text-amber-500">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      {activeProduct.rating || 5}
                    </span>
                    <span className="h-3 w-px bg-[color:var(--color-border)] hidden sm:inline-block" />
                    <span className="font-display font-bold text-sm text-[color:var(--color-text-primary)]">
                      {activeProduct.name}
                    </span>
                    {activeProduct.frameMaterial && (
                      <>
                        <span className="h-3 w-px bg-[color:var(--color-border)] hidden sm:inline-block" />
                        <span className="inline-flex items-center gap-1 font-semibold text-[color:var(--color-text-secondary)]">
                          <Sparkles className="h-3 w-3 text-[color:var(--color-brand-primary)]" />
                          {activeProduct.frameMaterial}
                        </span>
                      </>
                    )}
                    <span className="h-3 w-px bg-[color:var(--color-border)]" />
                    <div className="flex items-baseline gap-1.5 font-bold">
                      <span className="text-[color:var(--color-brand-primary)]">
                        Rs. {activeProduct.price.toLocaleString()}
                      </span>
                      {activeProduct.oldPrice && activeProduct.oldPrice > activeProduct.price && (
                        <span className="text-[10px] text-[color:var(--color-text-tertiary)] line-through font-normal">
                          Rs. {activeProduct.oldPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>

          </div>

        </div>

        {/* Minimal Horizontal Floating Bar Stats */}
        <div className="mt-8 pt-6 border-t border-[color:var(--color-border)]/60 flex flex-wrap items-center justify-between gap-6 max-w-3xl">
          {heroStats.map((stat, idx) => (
            <div key={stat.label} className="flex items-center gap-6">
              <div>
                <p className="font-display text-2xl sm:text-3xl font-bold text-[color:var(--color-text-primary)] tracking-tight">
                  {stat.value}
                  {stat.suffix}
                </p>
                <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-text-tertiary)]">
                  {stat.label}
                </p>
              </div>
              {idx < heroStats.length - 1 && (
                <div className="h-8 w-px bg-[color:var(--color-border)] hidden sm:block" />
              )}
            </div>
          ))}
        </div>

      </div>

      {/* ─── DYNAMIC MULTI-ITEM ROLLING CAROUSEL STRIP (INTEGRATED AT BOTTOM) ─── */}
      <InfiniteRollingShowcase
        products={featuredProducts}
        title="Curated Atelier Showcase"
        activeIndex={activeProductIdx}
        onSelectProduct={(idx) => setActiveProductIdx(idx)}
      />
    </section>
  );
}
