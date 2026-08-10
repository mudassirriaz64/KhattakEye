import { useState, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/primitives/Button";
import { heroSlides } from "@/lib/hero-data";
import { stats } from "@/lib/landing-data";
import axios from "@/lib/api/axios";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

interface SlideData {
  id: string;
  image: string;
  headline?: string;
  discountBadge?: string;
  floatingProduct?: typeof heroSlides[0]["floatingProduct"];
}

export function EditorialHero() {
  const [banners, setBanners] = useState<{ _id?: string; image?: string; title?: string }[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    axios.get("/banners?type=homepage-slider")
      .then((res) => {
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          setBanners(res.data);
        }
      })
      .catch((err) => console.error("Failed to load hero banners:", err));
  }, []);

  // Map active slides from API banners or fallback to rich heroSlides
  const slides: SlideData[] = banners.length > 0
    ? banners.map((b, idx) => ({
        id: b._id || `banner-${idx}`,
        image: b.image || heroSlides[idx % heroSlides.length].desktopImage,
        headline: b.title,
        discountBadge: heroSlides[idx % heroSlides.length]?.discountBadge,
        floatingProduct: heroSlides[idx % heroSlides.length]?.floatingProduct,
      }))
    : heroSlides.map((s) => ({
        id: s.id,
        image: s.desktopImage,
        headline: s.headline,
        discountBadge: s.discountBadge,
        floatingProduct: s.floatingProduct,
      }));

  // Auto-advance slide every 5.5 seconds
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const activeSlide = slides[currentIndex] || slides[0];

  return (
    <section className="relative min-h-[85vh] w-full overflow-hidden bg-stone-950 text-white flex flex-col justify-between">
      {/* ─── FULL-BLEED SHUFFLING BACKGROUND IMAGES ─── */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={activeSlide.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <img
              src={activeSlide.image}
              alt="Handcrafted eyewear background"
              className="h-full w-full object-cover object-center animate-ken-burns"
            />
          </motion.div>
        </AnimatePresence>

        {/* Continuous Scrim Gradient extending seamlessly to the bottom edge */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/70 to-stone-950/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/85 via-stone-950/50 to-transparent" />
      </div>

      {/* ─── TOP / MAIN HERO OVERLAY CONTENT ─── */}
      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-4 pt-20 pb-8 md:px-8 md:pt-28 md:pb-12 flex-1 flex flex-col justify-center">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          
          {/* Main Copy & CTAs */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="lg:col-span-8 max-w-2xl"
          >
            <motion.div variants={item} className="inline-flex items-center gap-2.5 rounded-full border border-red-500/30 bg-red-950/30 px-3.5 py-1.5 backdrop-blur-md shadow-lg">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-600/30 p-0.5 border border-red-400/40">
                <img
                  src="/khattak.png"
                  alt="Khattak Monogram"
                  className="h-3 w-3 object-contain"
                />
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-100">
                Khattak Eyewear
              </span>
            </motion.div>

            <motion.h1
              variants={item}
              className="mt-6 font-display text-5xl font-bold leading-[1.08] tracking-tight text-white md:text-7xl lg:text-[80px] drop-shadow-md"
            >
              The World is Worth Seeing.
            </motion.h1>

            <motion.p
              variants={item}
              className="mt-6 max-w-xl text-base leading-relaxed text-stone-200 md:text-lg font-light drop-shadow"
            >
              Hand-finished frames in Italian acetate and Japanese titanium — quiet luxury, impeccable precision, and optics engineered for the way you live.
            </motion.p>

            <motion.div variants={item} className="mt-8 flex flex-wrap items-center gap-4">
              <Link to="/shop">
                <Button variant="cta-lg" iconRight={<ArrowRight className="h-4 w-4" />}>
                  Explore the Collection
                </Button>
              </Link>
              <Link to="/virtual-try-on">
                <Button variant="outline" className="border-white/30 bg-stone-900/40 text-white hover:bg-white hover:text-stone-950 backdrop-blur-sm">
                  Virtual Try-On
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Featured Frame Floating Card + Integrated Ribbon Tag */}
          <div className="lg:col-span-4 flex flex-col items-start lg:items-end justify-end">
            {activeSlide.floatingProduct && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="relative flex items-center gap-4 rounded-2xl border border-white/20 bg-stone-900/90 p-4 pr-7 shadow-2xl backdrop-blur-xl max-w-xs"
              >
                {/* Integrated Ribbon Badge on Top Edge */}
                {activeSlide.discountBadge && (
                  <div className="absolute -top-3.5 right-4 rounded-full bg-red-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg border border-red-400/40">
                    {activeSlide.discountBadge}
                  </div>
                )}

                <img
                  src={activeSlide.floatingProduct.image}
                  alt={activeSlide.floatingProduct.name}
                  className="h-16 w-16 rounded-xl object-cover border border-white/10 shrink-0"
                />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-400">
                    Featured Frame
                  </p>
                  <p className="mt-0.5 font-display text-base font-semibold text-white">
                    {activeSlide.floatingProduct.name}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="flex items-center gap-1 text-xs font-semibold text-amber-300">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      {activeSlide.floatingProduct.rating}
                    </span>
                    <span className="text-xs font-bold text-red-400">{activeSlide.floatingProduct.price}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* ─── CONTINUOUS SCRIM BOTTOM STRIP: STATS & CAROUSEL NAV ─── */}
      <div className="relative z-10 border-t border-white/10 bg-gradient-to-b from-stone-950/40 to-stone-950/80 backdrop-blur-md py-6">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-6 px-4 sm:flex-row md:px-8">
          
          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-8 sm:gap-14">
            {stats.slice(0, 3).map((stat) => (
              <div key={stat.label} className="text-center sm:text-left">
                <p className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {stat.value}
                  {stat.suffix}
                </p>
                <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.2em] text-stone-300">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* Prominent Carousel Controls & Indicators */}
          {slides.length > 1 && (
            <div className="flex items-center gap-4 bg-stone-900/60 p-2 rounded-full border border-white/15 backdrop-blur-lg shadow-xl">
              <button
                onClick={() => setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white hover:bg-red-600 hover:border-red-500 transition-all shadow-md active:scale-95"
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2 px-1">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === currentIndex ? "w-7 bg-red-500 shadow-sm" : "w-2 bg-white/40 hover:bg-white/70"
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={() => setCurrentIndex((prev) => (prev + 1) % slides.length)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white hover:bg-red-600 hover:border-red-500 transition-all shadow-md active:scale-95"
                aria-label="Next slide"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

