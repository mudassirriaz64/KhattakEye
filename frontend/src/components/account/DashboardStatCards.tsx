import { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";
import { ShoppingBag, Package, Heart } from "lucide-react";

type Props = {
  totalOrders: number;
  pendingOrders: number;
  wishlistCount: number;
};

const EASE = [0.22, 1, 0.36, 1] as const;

function useCountUp(target: number, duration = 1.2) {
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, target, {
      duration,
      ease: EASE,
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, target, duration]);

  return { ref, value };
}

function StatValue({ value }: { value: number }) {
  const { ref, value: count } = useCountUp(value);
  return (
    <p ref={ref} className="mt-4 text-3xl font-bold tabular-nums text-[color:var(--color-text-primary)]">
      {count.toLocaleString()}
    </p>
  );
}

export function DashboardStatCards({ totalOrders, pendingOrders, wishlistCount }: Props) {
  const statCards = [
    {
      label: "Total Orders",
      value: totalOrders,
      icon: ShoppingBag,
      color: "text-[color:var(--color-brand-primary)]",
      bg: "bg-[color:var(--color-brand-primary)]/10",
    },
    {
      label: "Pending Orders",
      value: pendingOrders,
      icon: Package,
      color: "text-amber-700 dark:text-amber-400",
      bg: "bg-amber-100 dark:bg-amber-950/40",
    },
    {
      label: "Wishlist Items",
      value: wishlistCount,
      icon: Heart,
      color: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-100 dark:bg-rose-950/40",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {statCards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08, duration: 0.3, ease: EASE }}
          className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]"
        >
          <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.bg}`}>
            <card.icon className={`h-5 w-5 ${card.color}`} />
          </div>
          <StatValue value={card.value} />
          <p className="mt-1 text-xs font-medium text-[color:var(--color-text-tertiary)]">{card.label}</p>
        </motion.div>
      ))}
    </div>
  );
}
