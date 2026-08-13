import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { getBrands } from "@/lib/api/products";

const accents = [
  { ring: "hover:border-[color:var(--color-brand-primary)]", tint: "brand-gradient" },
  { ring: "hover:border-[color:var(--color-text-primary)]", tint: "bg-[color:var(--color-text-primary)]" },
  { ring: "hover:border-[color:var(--color-brand-soft)]", tint: "bg-[color:var(--color-brand-soft)]" },
  { ring: "hover:border-[color:var(--color-brand-hover)]", tint: "bg-[color:var(--color-brand-hover)]" },
];

function BrandSkeleton() {
  return (
    <div className="mt-14 flex gap-6 overflow-hidden py-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="animate-pulse flex w-[260px] shrink-0 flex-col items-center rounded-[32px] border border-[color:var(--color-border)] bg-[color:var(--color-app-bg)] px-6 py-10 text-center">
          <div className="h-20 w-20 rounded-full bg-[color:var(--color-surface-muted)]" />
          <div className="mt-5 h-4 w-2/3 rounded bg-[color:var(--color-surface-muted)]" />
          <div className="mt-2 h-3 w-1/3 rounded bg-[color:var(--color-surface-muted)]" />
        </div>
      ))}
    </div>
  );
}

export function PremiumBrands() {
  const [brands, setBrands] = useState<{ name: string; logo?: string; tagline?: string; featured?: boolean }[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getBrands({ featured: true })
      .then((data) => {
        if (data && Array.isArray(data)) {
          const featuredOnly = data.filter((b) => b.featured !== false);
          setBrands(featuredOnly);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch featured brands:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const distance = 300;
    scrollContainerRef.current.scrollBy({
      left: direction === "left" ? -distance : distance,
      behavior: "smooth"
    });
  };

  if (loading) {
    return (
      <section className="bg-[color:var(--color-panel)] py-20 md:py-28">
        <div className="mx-auto max-w-[1440px] px-4 md:px-8">
          <SectionHeading
            eyebrow="Featured Brands"
            title="Our houses of design"
            description="Explore our curated atelier collections — from sculptural acetate to feather-light titanium."
          />
          <BrandSkeleton />
        </div>
      </section>
    );
  }

  if (brands.length === 0) return null;

  // Duplicate list to achieve continuous rolling marquee effect
  const marqueeList = [...brands, ...brands, ...brands];

  return (
    <section className="relative overflow-hidden bg-[color:var(--color-panel)] py-20 md:py-28">
      <div className="mx-auto max-w-[1440px] px-4 md:px-8">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Featured Brands"
            title="Our houses of design"
            description="Explore our curated atelier collections — from sculptural acetate to feather-light titanium."
          />
          <div className="hidden gap-2 md:flex">
            <button
              type="button"
              onClick={() => handleScroll("left")}
              aria-label="Previous brand"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-app-bg)] text-[color:var(--color-text-primary)] transition-all hover:bg-[color:var(--color-brand-primary)] hover:text-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => handleScroll("right")}
              aria-label="Next brand"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-app-bg)] text-[color:var(--color-text-primary)] transition-all hover:bg-[color:var(--color-brand-primary)] hover:text-white"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Rolling Marquee Container */}
        <div
          ref={scrollContainerRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="mt-12 overflow-hidden w-full [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          <motion.div
            className="flex w-max gap-6 py-4"
            animate={isPaused ? false : { x: ["0%", "-33.333%"] }}
            transition={{
              repeat: Infinity,
              duration: Math.max(15, brands.length * 5),
              ease: "linear",
            }}
          >
            {marqueeList.map((brand, index) => (
              <Link
                key={`${brand.name}-${index}`}
                to={`/shop?brand=${encodeURIComponent(brand.name)}`}
                className="block cursor-pointer"
              >
                <div className="group flex w-[260px] shrink-0 flex-col items-center rounded-[32px] border border-[color:var(--color-border)] bg-[color:var(--color-app-bg)] px-6 py-10 text-center shadow-[var(--shadow-input)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[color:var(--color-brand-primary)] hover:shadow-[var(--shadow-strong)]">
                  <div className="relative">
                    {brand.logo ? (
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        className="flex h-20 w-20 items-center justify-center rounded-full bg-[color:var(--color-panel)] object-cover shadow-[var(--shadow-soft)] ring-1 ring-[color:var(--color-border)] transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[color:var(--color-panel)] font-display text-3xl text-[color:var(--color-brand-primary)] shadow-[var(--shadow-soft)] ring-1 ring-[color:var(--color-border)] transition-transform duration-300 group-hover:scale-105">
                        {brand.name.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    <span className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full ${accents[index % accents.length].tint} ring-4 ring-[color:var(--color-panel)]`} />
                  </div>
                  <h3 className="mt-5 font-display text-lg text-[color:var(--color-text-primary)]">
                    {brand.name}
                  </h3>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-[color:var(--color-text-tertiary)]">
                    {brand.tagline || (index % 4 === 0 ? "Sculptural" : index % 4 === 1 ? "Distinctive" : index % 4 === 2 ? "Timeless" : "Engineered")}
                  </p>
                </div>
              </Link>
            ))}
          </motion.div>
        </div>

        <ScrollReveal className="mt-12 text-center">
          <Link
            to="/shop"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--color-brand-primary)] transition-colors hover:text-[color:var(--color-brand-hover)]"
          >
            Meet the ateliers
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
