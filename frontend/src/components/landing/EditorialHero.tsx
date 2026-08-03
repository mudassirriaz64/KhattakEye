import { motion, type Variants } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Sparkles } from "lucide-react";
import { Button } from "@/components/primitives/Button";
import { heroSlides } from "@/lib/hero-data";
import { stats } from "@/lib/landing-data";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export function EditorialHero() {
  const slide = heroSlides[0];

  return (
    <section className="relative overflow-hidden bg-[color:var(--color-app-bg)]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-40 top-10 h-[520px] w-[520px] rounded-full bg-[color:var(--color-brand-soft)]/20 blur-3xl" />
        <div className="absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-[color:var(--color-brand-primary)]/[0.06] blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-[1440px] items-center gap-12 px-4 py-16 md:px-8 md:py-24 lg:grid-cols-12 lg:gap-8 lg:py-28">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="lg:col-span-6"
        >
          <motion.div variants={item} className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-4 py-1.5 shadow-[var(--shadow-input)]">
            <Sparkles className="h-3.5 w-3.5 text-[color:var(--color-brand-primary)]" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[color:var(--color-text-secondary)]">
              Khattak Eyewear · New Season 2026
            </span>
          </motion.div>

          <motion.h1
            variants={item}
            className="mt-7 font-display text-[44px] font-semibold leading-[1.05] text-[color:var(--color-text-primary)] md:text-7xl lg:text-[84px]"
          >
            Eyewear that
            <br />
            <span className="italic text-gradient-brand">speaks</span> before
            <br />
            you do.
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-7 max-w-lg text-base leading-8 text-[color:var(--color-text-secondary)] md:text-lg"
          >
            Hand-finished frames in Italian acetate and Japanese titanium — quiet luxury, impeccable
            precision, and optics engineered for the way you live.
          </motion.p>

          <motion.div variants={item} className="mt-9 flex flex-wrap items-center gap-4">
            <Link to="/shop">
              <Button variant="cta-lg" iconRight={<ArrowRight className="h-4 w-4" />}>
                Explore the Collection
              </Button>
            </Link>
            <Link to="/virtual-try-on">
              <Button variant="outline">Virtual Try-On</Button>
            </Link>
          </motion.div>

          <motion.div variants={item} className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-[color:var(--color-border)] pt-8">
            {stats.slice(0, 3).map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-3xl text-[color:var(--color-brand-primary)]">
                  {stat.value}
                  {stat.suffix}
                </p>
                <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[color:var(--color-text-tertiary)]">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <div className="relative lg:col-span-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            className="relative ml-auto max-w-[520px]"
          >
            <div className="absolute -left-6 -top-6 h-full w-full rounded-[40px] border border-[color:var(--color-brand-soft)]/60" />
            <div className="relative overflow-hidden rounded-[40px] shadow-[var(--shadow-strong)]">
              <img
                src={slide.desktopImage}
                alt="Premium eyewear from the Khattak collection"
                className="aspect-[4/5] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--color-text-primary)]/20 via-transparent to-transparent" />
            </div>

            {slide.floatingProduct && (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="absolute -bottom-8 -left-6 flex items-center gap-4 rounded-[28px] border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-4 pr-6 shadow-[var(--shadow-strong)] md:-left-12"
              >
                <img
                  src={slide.floatingProduct.image}
                  alt={slide.floatingProduct.name}
                  className="h-20 w-20 rounded-2xl object-cover"
                />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-text-tertiary)]">
                    Featured Frame
                  </p>
                  <p className="mt-0.5 font-display text-lg text-[color:var(--color-text-primary)]">
                    {slide.floatingProduct.name}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="flex items-center gap-1 text-sm font-semibold text-[color:var(--color-text-primary)]">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      {slide.floatingProduct.rating}
                    </span>
                    <span className="text-sm text-[color:var(--color-brand-primary)]">{slide.floatingProduct.price}</span>
                  </div>
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.9 }}
              className="absolute right-6 top-6 rounded-full bg-[color:var(--color-panel)]/90 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-brand-primary)] shadow-[var(--shadow-soft)] backdrop-blur"
            >
              {slide.discountBadge ?? "Handcrafted"}
            </motion.div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.8 }}
        className="flex items-center justify-center gap-3 pb-8 text-[color:var(--color-text-tertiary)]"
      >
        <span className="h-8 w-px bg-[color:var(--color-border-strong)]" />
        <span className="text-[10px] font-medium uppercase tracking-[0.3em]">Scroll to explore</span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="h-8 w-px bg-[color:var(--color-brand-primary)]"
        />
      </motion.div>
    </section>
  );
}
