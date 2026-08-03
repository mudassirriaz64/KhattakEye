import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type BarChartProps = {
  data: { label: string; value: number; color?: string }[];
  height?: number;
  showValues?: boolean;
};

export function BarChart({ data, height = 200, showValues = true }: BarChartProps) {
  const max = Math.max(...data.map((d) => d.value));

  return (
    <div className="flex items-end gap-2" style={{ height }}>
      {data.map((item, i) => {
        const pct = (item.value / max) * 100;
        return (
          <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
            {showValues && (
              <span className="text-[9px] font-medium text-[color:var(--color-text-tertiary)]">
                {item.value >= 1000 ? `${(item.value / 1000).toFixed(1)}k` : item.value}
              </span>
            )}
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${pct}%` }}
              transition={{ delay: i * 0.03, duration: 0.5, ease: "easeOut" }}
              className={cn("w-full rounded-lg transition-colors", item.color || "bg-[color:var(--color-brand-primary)]")}
              style={{ minHeight: 4 }}
            />
            <span className="text-[9px] text-[color:var(--color-text-tertiary)]">{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}

type DonutChartProps = {
  data: { label: string; value: number; color: string }[];
  size?: number;
};

export function DonutChart({ data, size = 140 }: DonutChartProps) {
  const total = data.reduce((s, d) => s + d.value, 0);
  let cumulative = 0;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
        {data.map((item) => {
          const pct = item.value / total;
          const startAngle = cumulative * 360;
          cumulative += pct;
          const endAngle = cumulative * 360;
          const x1 = 18 + 15.5 * Math.cos((startAngle * Math.PI) / 180);
          const y1 = 18 + 15.5 * Math.sin((startAngle * Math.PI) / 180);
          const x2 = 18 + 15.5 * Math.cos((endAngle * Math.PI) / 180);
          const y2 = 18 + 15.5 * Math.sin((endAngle * Math.PI) / 180);
          const largeArc = pct > 0.5 ? 1 : 0;
          return (
            <path
              key={item.label}
              d={`M 18 18 L ${x1} ${y1} A 15.5 15.5 0 ${largeArc} 1 ${x2} ${y2} Z`}
              fill={item.color}
              stroke="none"
            />
          );
        })}
        <circle cx="18" cy="18" r="10" fill="var(--color-app-bg)" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold text-[color:var(--color-text-primary)]">{total}</span>
      </div>
    </div>
  );
}
