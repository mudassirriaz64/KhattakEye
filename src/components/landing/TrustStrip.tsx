import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ShieldCheck, Truck, RotateCcw, Star, HeadphonesIcon, Award } from "lucide-react";
import { cn } from "@/lib/utils";

const trustItems = [
  { icon: Star, label: "4.9★ Rating", desc: "From 10,000+ Reviews", value: 4.9, suffix: "★" },
  { icon: Truck, label: "Free Shipping", desc: "Across Pakistan", value: 100, suffix: "%" },
  { icon: ShieldCheck, label: "Authentic", desc: "100% Original Products", value: 100, suffix: "%" },
  { icon: RotateCcw, label: "Easy Returns", desc: "14-Day Return Policy", value: 14, suffix: " Days" },
  { icon: HeadphonesIcon, label: "Support", desc: "24/7 Customer Care", value: 247, suffix: "" },
  { icon: Award, label: "Warranty", desc: "2-Year Quality Guarantee", value: 2, suffix: " Yr" },
];

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const duration = 1500;
    const steps = 30;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  );
}

export function TrustStrip() {
  return (
    <section className="border-y border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)]">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {trustItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-2xl p-4 text-center",
                  "transition-all duration-300 hover:-translate-y-0.5",
                )}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--color-accent-teal)]/10 text-[color:var(--color-accent-teal)]">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="font-display text-lg font-bold text-[color:var(--color-text-primary)]">
                  <AnimatedCounter target={item.value} suffix={item.suffix} />
                </span>
                <span className="text-xs font-semibold text-[color:var(--color-text-primary)]">
                  {item.label}
                </span>
                <span className="text-[10px] text-[color:var(--color-text-tertiary)]">
                  {item.desc}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
