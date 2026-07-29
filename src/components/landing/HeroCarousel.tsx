import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HeroSlide } from "./HeroSlide";
import { getActiveSlides, type HeroSlide as HeroSlideType } from "@/lib/hero-data";

export function HeroCarousel() {
  const [slides, setSlides] = useState<HeroSlideType[]>([]);
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();
  const DURATION = 5000;

  useEffect(() => {
    const active = getActiveSlides();
    if (active.length > 0) {
      setSlides(active);
    } else {
      setSlides([
        {
          id: "fallback",
          desktopImage: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=1920&q=85",
          headline: "Premium Eyewear",
          highlightedText: "Define Your Style.",
          subtitle: "Discover frames that elevate every look.",
          primaryCta: { label: "Shop Now", link: "/shop" },
          order: 1,
          active: true,
        },
      ]);
    }
  }, []);

  const goTo = useCallback((index: number) => {
    setCurrent((index + slides.length) % slides.length);
    setProgress(0);
  }, [slides.length]);

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      setProgress(Math.min((elapsed / DURATION) * 100, 100));
      if (elapsed >= DURATION) {
        next();
      }
    };
    intervalRef.current = setInterval(tick, 30);
    return () => clearInterval(intervalRef.current);
  }, [current, next, slides.length]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [prev, next]);

  if (slides.length === 0) return null;

  const slide = slides[current];

  return (
    <section className="relative h-dvh w-full overflow-hidden bg-[#0C111B]">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          <HeroSlide slide={slide} isActive />
        </motion.div>
      </AnimatePresence>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-1"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/30">Scroll</span>
          <div className="h-5 w-[1px] bg-gradient-to-b from-white/30 to-transparent" />
        </motion.div>
      </motion.div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20 h-0.5 bg-white/5">
        <motion.div
          className="h-full bg-gradient-to-r from-[#0D9488] to-[#14B8A6]"
          style={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Navigation arrows */}
      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/10 bg-white/5 p-3 text-white/60 backdrop-blur-xl transition-all hover:bg-white/20 hover:text-white"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/10 bg-white/5 p-3 text-white/60 backdrop-blur-xl transition-all hover:bg-white/20 hover:text-white"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => goTo(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current
                  ? "w-8 bg-white"
                  : "w-1.5 bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
