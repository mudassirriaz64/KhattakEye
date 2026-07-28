import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BadgeTone = "default" | "teal" | "blue" | "danger" | "warning" | "soft";

const toneClasses: Record<BadgeTone, string> = {
  default: "bg-[color:var(--color-brand-primary)] text-white",
  teal: "bg-[color:var(--color-accent-teal)] text-white",
  blue: "bg-[color:var(--color-accent-blue)] text-white",
  danger: "bg-[#FEE2E2] text-[#991B1B]",
  warning: "bg-[#FEF3C7] text-[#92400E]",
  soft: "bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-primary)]",
};

type BadgeProps = {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
};

export function Badge({ children, tone = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em]",
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
