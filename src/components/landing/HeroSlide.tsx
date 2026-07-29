import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/primitives/Button";
import { FloatingProductCard } from "./FloatingProductCard";
import type { HeroSlide as HeroSlideType } from "@/lib/hero-data";

type HeroSlideProps = {
  slide: HeroSlideType;
  isActive: boolean;
};

const textStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
};

const easeOut = [0.22, 1, 0.36, 1] as const;

const textItem = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeOut } },
};

export function HeroSlide({ slide, isActive }: HeroSlideProps) {
  const animationClass =
    slide.animationStyle === "kenBurns"
      ? "motion-safe:animate-ken-burns"
      : slide.animationStyle === "zoom"
        ? "scale-105 motion-safe:animate-ken-burns"
        : "scale-100";

  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={slide.desktopImage}
          alt=""
          className={`h-full w-full object-cover transition-transform duration-[8s] ${
            isActive ? animationClass : "scale-100"
          }`}
          loading={isActive ? "eager" : "lazy"}
        />
        <img
          src={slide.themeDarkImage || slide.desktopImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-0 dark:opacity-100 transition-opacity duration-500"
          loading="lazy"
        />

        <div
          className="absolute inset-0"
          style={{
            background: slide.overlayColor
              ? `linear-gradient(135deg, ${slide.overlayColor}, transparent 60%)`
              : "linear-gradient(135deg, rgba(12,17,27,0.75) 0%, rgba(12,17,27,0.3) 50%, rgba(12,17,27,0.1) 100%)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0C111B]/60 via-transparent to-transparent" />
      </div>

      <motion.div
        variants={textStagger}
        initial="hidden"
        animate={isActive ? "visible" : "hidden"}
        className="relative z-10 flex h-full items-start pt-28 md:pt-32"
      >
        <div className="mx-auto w-full max-w-6xl px-4 md:px-8">
          <motion.div variants={textItem} className="max-w-2xl">
            {slide.discountBadge && (
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1 backdrop-blur-sm">
                <Sparkles className="h-2.5 w-2.5 text-[color:var(--color-accent-teal)]" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/80">
                  {slide.discountBadge}
                </span>
              </div>
            )}

            <h1 className="font-display text-4xl leading-[1.1] tracking-tight text-white md:text-6xl lg:text-7xl">
              {slide.headline}
            </h1>

            {slide.highlightedText && (
              <p className="mt-2 text-lg font-medium leading-relaxed text-white/70 md:text-xl">
                {slide.highlightedText}
              </p>
            )}

            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/50 md:text-base">
              {slide.subtitle}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link to={slide.primaryCta.link}>
                <Button
                  variant="cta-lg"
                  iconRight={<ArrowRight className="h-4 w-4" />}
                  className="px-7 py-3.5 text-sm"
                >
                  {slide.primaryCta.label}
                </Button>
              </Link>
              {slide.secondaryCta && (
                <Link to={slide.secondaryCta.link}>
                  <Button
                    variant="outline"
                    className="border-white/20 bg-white/5 px-7 py-3.5 text-sm text-white hover:bg-white/10"
                  >
                    {slide.secondaryCta.label}
                  </Button>
                </Link>
              )}
            </div>

            {slide.offerBadge && (
              <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur-sm">
                <span className="text-xs text-white/60">{slide.offerBadge}</span>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>

      {slide.floatingProduct && (
        <FloatingProductCard product={slide.floatingProduct} side="right" />
      )}
    </div>
  );
}
