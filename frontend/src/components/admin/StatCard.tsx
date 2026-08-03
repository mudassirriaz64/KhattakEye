import { motion } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  label: string;
  value: string;
  icon: ReactNode;
  trend?: { value: string; positive: boolean };
  color: string;
  bg: string;
  delay?: number;
};

export function StatCard({ label, value, icon, trend, color, bg, delay = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-5 backdrop-blur-2xl"
    >
      <div className="flex items-start justify-between">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${bg}`}>
          <div className={color}>{icon}</div>
        </div>
        {trend && (
          <span className={`rounded-lg px-2 py-0.5 text-[10px] font-semibold ${trend.positive ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-600"}`}>
            {trend.positive ? "+" : "-"}{trend.value}
          </span>
        )}
      </div>
      <p className="mt-4 text-2xl font-bold text-[color:var(--color-text-primary)]">{value}</p>
      <p className="mt-0.5 text-xs text-[color:var(--color-text-tertiary)]">{label}</p>
    </motion.div>
  );
}
