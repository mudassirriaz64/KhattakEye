import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { categories } from "@/lib/landing-data";
import { SectionHeading } from "@/components/shared/SectionHeading";

export function ShopByCategory() {
  return (
    <section className="relative">
      <div className="mx-auto max-w-[1440px] px-4 py-16 md:px-8 md:py-20">
        <SectionHeading
          eyebrow="Categories"
          title="Shop by category"
          description="Explore our curated collections, each crafted with precision and designed for the discerning individual."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {categories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                to={category.path}
                className="group relative block overflow-hidden rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)]"
              >
                <div className="relative h-64 overflow-hidden md:h-80">
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(0,0,0,0.7)_100%)] z-10" />
                  <img
                    src={category.image}
                    alt={category.title}
                    className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 left-0 right-0 z-20 p-6 md:p-8">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/60">
                          {category.count}
                        </p>
                        <h3 className="mt-1 font-display text-3xl text-white md:text-4xl">
                          {category.title}
                        </h3>
                      </div>
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-all group-hover:bg-white group-hover:text-[color:var(--color-brand-primary)]">
                        <ArrowRight className="h-5 w-5" />
                      </div>
                    </div>
                    <p className="mt-3 max-w-md text-sm leading-6 text-white/70">
                      {category.description}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
