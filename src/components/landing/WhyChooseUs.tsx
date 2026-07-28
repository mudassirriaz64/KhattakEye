import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { stats, whyChooseUs } from "@/lib/landing-data";
import { ScrollReveal } from "@/components/shared/ScrollReveal";

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {count.toFixed(value % 1 === 0 ? 0 : 1)}
      {suffix}
    </span>
  );
}

export function WhyChooseUs() {
  return (
    <section className="relative border-b border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)]">
      <div className="mx-auto max-w-[1440px] px-4 py-16 md:px-8 md:py-20">
        <ScrollReveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-app-bg)] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-[color:var(--color-text-secondary)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-accent-teal)]" />
              Why Khattak
            </p>
            <h2 className="mt-4 font-display text-3xl leading-tight text-[color:var(--color-text-primary)] md:text-5xl">
              Craftsmanship meets innovation
            </h2>
          </div>
        </ScrollReveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-app-bg)] p-6 text-center"
            >
              <p className="font-display text-4xl text-[color:var(--color-text-primary)] md:text-5xl">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-2 text-sm text-[color:var(--color-text-secondary)]">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {whyChooseUs.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-app-bg)] p-6 md:p-8"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[color:var(--color-surface-muted)]">
                <span className="font-display text-xl text-[color:var(--color-accent-teal)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-4 font-display text-2xl text-[color:var(--color-text-primary)]">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[color:var(--color-text-secondary)]">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
