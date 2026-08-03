import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Tab = {
  id: string;
  label: string;
  count?: number;
};

type TabsProps = {
  tabs: Tab[];
  active: string;
  onChange: (id: string) => void;
  className?: string;
};

export function Tabs({ tabs, active, onChange, className }: TabsProps) {
  return (
    <div className={cn("flex gap-1 rounded-2xl bg-[color:var(--color-surface-muted)] p-1", className)} role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={active === tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            "relative flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors",
            active === tab.id
              ? "text-[color:var(--color-text-primary)]"
              : "text-[color:var(--color-text-tertiary)] hover:text-[color:var(--color-text-secondary)]",
          )}
        >
          {active === tab.id && (
            <motion.span
              layoutId="tabs-active"
              className="absolute inset-0 rounded-xl bg-[color:var(--color-panel)] shadow-[var(--shadow-soft)]"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10">{tab.label}</span>
          {tab.count !== undefined && (
            <span className={cn("relative z-10 rounded-full bg-[color:var(--color-border)] px-2 py-0.5 text-[10px] font-semibold")}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
