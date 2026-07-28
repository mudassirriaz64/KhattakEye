import { motion } from "framer-motion";
import { brands } from "@/lib/landing-data";
import { SectionHeading } from "@/components/shared/SectionHeading";

export function FeaturedBrands() {
  return (
    <section className="border-b border-[color:var(--color-border)]">
      <div className="mx-auto max-w-[1440px] px-4 py-16 md:px-8 md:py-20">
        <SectionHeading
          eyebrow="Our Brands"
          title="Featured brands"
          description="Discover our collection of premium sub-brands, each with its own distinct character and craftsmanship heritage."
        />

        <div className="relative mt-12 overflow-hidden">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="flex gap-8"
          >
            {[...brands, ...brands].map((brand, index) => (
              <div
                key={`${brand.name}-${index}`}
                className="flex h-24 w-48 shrink-0 items-center justify-center rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-6"
              >
                <div className="text-center">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-[color:var(--color-brand-primary)] text-xs font-bold text-white">
                    {brand.logo}
                  </div>
                  <p className="mt-2 text-xs font-medium text-[color:var(--color-text-secondary)]">
                    {brand.name}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
