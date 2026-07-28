import { Truck, Shield, Gem, BadgeCheck, ScanFace, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { trustFeatures } from "@/lib/landing-data";
import { ScrollReveal } from "@/components/shared/ScrollReveal";

const iconMap: Record<string, typeof Truck> = {
  Truck,
  Shield,
  Gem,
  BadgeCheck,
  ScanFace,
  RefreshCw,
};

export function BrandTrust() {
  return (
    <section className="relative border-b border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)]">
      <div className="mx-auto max-w-[1440px] px-4 py-16 md:px-8 md:py-20">
        <ScrollReveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-app-bg)] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-[color:var(--color-text-secondary)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-accent-teal)]" />
              Why Shop With Us
            </p>
            <h2 className="mt-4 font-display text-3xl leading-tight text-[color:var(--color-text-primary)] md:text-5xl">
              Luxury you can trust
            </h2>
          </div>
        </ScrollReveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trustFeatures.map((feature, index) => {
            const Icon = iconMap[feature.icon] || Truck;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="group rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-app-bg)] p-6 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-soft)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[color:var(--color-surface-muted)] text-[color:var(--color-accent-teal)] transition-colors group-hover:bg-[color:var(--color-accent-teal)] group-hover:text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-xl text-[color:var(--color-text-primary)]">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-[color:var(--color-text-secondary)]">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
