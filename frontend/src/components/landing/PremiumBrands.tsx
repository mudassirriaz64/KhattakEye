import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
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
    <div className="mt-14 grid grid-cols-2 gap-6 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="animate-pulse flex flex-col items-center rounded-[32px] border border-[color:var(--color-border)] bg-[color:var(--color-app-bg)] px-6 py-12 text-center">
          <div className="h-24 w-24 rounded-full bg-[color:var(--color-surface-muted)]" />
          <div className="mt-6 h-4 w-2/3 rounded bg-[color:var(--color-surface-muted)]" />
          <div className="mt-2 h-3 w-1/3 rounded bg-[color:var(--color-surface-muted)]" />
        </div>
      ))}
    </div>
  );
}

export function PremiumBrands() {
  const [brands, setBrands] = useState<{ name: string; logo?: string; tagline?: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBrands()
      .then((data) => {
        if (data && Array.isArray(data)) {
          setBrands(data);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch brands:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="bg-[color:var(--color-panel)] py-20 md:py-28">
        <div className="mx-auto max-w-[1440px] px-4 md:px-8">
          <SectionHeading
            eyebrow="Premium Brands"
            title="Our houses of design"
            description="Four in-house ateliers, each with its own philosophy — from sculptural acetate to feather-light titanium."
          />
          <BrandSkeleton />
        </div>
      </section>
    );
  }

  if (brands.length === 0) return null;

  return (
    <section className="bg-[color:var(--color-panel)] py-20 md:py-28">
      <div className="mx-auto max-w-[1440px] px-4 md:px-8">
        <SectionHeading
          eyebrow="Premium Brands"
          title="Our houses of design"
          description="Four in-house ateliers, each with its own philosophy — from sculptural acetate to feather-light titanium."
        />

        <div className="mt-14 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {brands.map((brand, index) => (
            <Link
              key={brand.name}
              to={`/shop?brand=${encodeURIComponent(brand.name)}`}
              className="block cursor-pointer"
            >
              <motion.div
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="group flex flex-col items-center rounded-[32px] border border-[color:var(--color-border)] bg-[color:var(--color-app-bg)] px-6 py-12 text-center shadow-[var(--shadow-input)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-strong)]"
              >
                <div className="relative">
                  {brand.logo ? (
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="flex h-24 w-24 items-center justify-center rounded-full bg-[color:var(--color-panel)] object-cover shadow-[var(--shadow-soft)] ring-1 ring-[color:var(--color-border)] transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[color:var(--color-panel)] font-display text-4xl text-[color:var(--color-brand-primary)] shadow-[var(--shadow-soft)] ring-1 ring-[color:var(--color-border)] transition-transform duration-300 group-hover:scale-105">
                      {brand.name.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                  <span className={`absolute -bottom-1 -right-1 h-6 w-6 rounded-full ${accents[index % accents.length].tint} ring-4 ring-[color:var(--color-panel)]`} />
                </div>
                <h3 className="mt-6 font-display text-xl text-[color:var(--color-text-primary)]">
                  {brand.name}
                </h3>
                <p className="mt-2 text-xs uppercase tracking-[0.22em] text-[color:var(--color-text-tertiary)]">
                  {brand.tagline || (index === 0 ? "Sculptural" : index === 1 ? "Distinctive" : index === 2 ? "Timeless" : "Engineered")}
                </p>
              </motion.div>
            </Link>
          ))}
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
