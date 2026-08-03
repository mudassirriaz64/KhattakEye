import { motion } from "framer-motion";
import { whyChooseUs } from "@/lib/landing-data";
import { ScrollReveal } from "@/components/shared/ScrollReveal";

export function BrandStory() {
  return (
    <section className="bg-[color:var(--color-app-bg)] py-20 md:py-28">
      <div className="mx-auto max-w-[1440px] px-4 md:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-[440px]">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden rounded-[36px] shadow-[var(--shadow-strong)]"
              >
                <img
                  src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=900&q=80"
                  alt="Inside the Khattak atelier"
                  className="aspect-[4/5] w-full object-cover"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="absolute -bottom-10 -right-4 w-48 overflow-hidden rounded-[28px] border-4 border-[color:var(--color-panel)] shadow-[var(--shadow-strong)] md:-right-10 md:w-60"
              >
                <img
                  src="https://images.unsplash.com/photo-1508296695146-257a814070b4?w=600&q=80"
                  alt="Craftsmanship detail"
                  className="aspect-square w-full object-cover"
                />
              </motion.div>
              <div className="absolute -left-4 -top-6 rounded-2xl bg-[color:var(--color-panel)] px-4 py-3 shadow-[var(--shadow-strong)] md:-left-8">
                <p className="font-display text-3xl text-[color:var(--color-brand-primary)]">45+</p>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-text-tertiary)]">
                  Quality checks
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <ScrollReveal>
              <p className="editorial-eyebrow">Our Story</p>
              <h2 className="mt-4 font-display text-4xl leading-tight text-[color:var(--color-text-primary)] md:text-6xl">
                A family atelier, raised on <span className="italic text-gradient-brand">precision</span>
              </h2>
              <p className="mt-6 max-w-2xl text-base leading-8 text-[color:var(--color-text-secondary)] md:text-lg">
                Khattak Eyewear began with a single bench and an uncompromising belief: that eyewear
                should feel as extraordinary as it looks. Today every frame still passes through the
                same hands — Italian acetates, Japanese titanium, and optics that have earned a
                following across the country.
              </p>
            </ScrollReveal>

            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {whyChooseUs.map((pillar, index) => (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className="rounded-[28px] border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 shadow-[var(--shadow-input)] transition-shadow hover:shadow-[var(--shadow-soft)]"
                >
                  <p className="font-display text-lg text-[color:var(--color-brand-primary)]">
                    0{index + 1}
                  </p>
                  <h3 className="mt-2 font-display text-xl text-[color:var(--color-text-primary)]">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[color:var(--color-text-secondary)]">
                    {pillar.description}
                  </p>
                </motion.div>
              ))}
            </div>

            <ScrollReveal className="mt-10">
              <p className="font-display text-2xl italic text-[color:var(--color-text-secondary)]">
                — The Khattak Family
              </p>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
