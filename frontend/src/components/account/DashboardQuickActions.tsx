import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, Heart, Star, Settings } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const tileVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: EASE } },
};

export function DashboardQuickActions() {
  const actions = [
    {
      to: "/shop",
      icon: ShoppingBag,
      label: "Shop",
      color: "text-[color:var(--color-brand-primary)]",
      bg: "bg-[color:var(--color-brand-primary)]/10",
    },
    {
      to: "/account/wishlist",
      icon: Heart,
      label: "Wishlist",
      color: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-100 dark:bg-rose-950/40",
    },
    {
      to: "/account/reviews",
      icon: Star,
      label: "Reviews",
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-100 dark:bg-amber-950/40",
    },
    {
      to: "/account/settings",
      icon: Settings,
      label: "Settings",
      color: "text-[color:var(--color-text-secondary)]",
      bg: "bg-[color:var(--color-surface-muted)]",
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg text-[color:var(--color-text-primary)]">Quick Actions</h3>
      </div>
      <motion.div
        className="mt-4 grid grid-cols-2 gap-3"
        variants={listVariants}
        initial="hidden"
        animate="show"
      >
        {actions.map((action) => (
          <motion.div key={action.label} variants={tileVariants}>
            <Link
              to={action.to}
              className="group flex flex-col items-center gap-2.5 rounded-xl px-4 py-5 transition-all duration-200 hover:bg-[color:var(--color-surface-muted)]"
            >
              <span className={`flex h-10 w-10 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-110 ${action.bg}`}>
                <action.icon className={`h-5 w-5 ${action.color}`} />
              </span>
              <span className="text-xs font-medium text-[color:var(--color-text-secondary)]">{action.label}</span>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
