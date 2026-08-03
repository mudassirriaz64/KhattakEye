import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BadgeTone = "default" | "teal" | "blue" | "danger" | "warning" | "soft" | "sale" | "new" | "premium" | "best-seller";

const toneClasses: Record<BadgeTone, string> = {
  default: "brand-gradient text-white",
  teal: "bg-[color:var(--color-brand-primary)] text-white",
  blue: "bg-[#19130D] text-[#FFF8F3]",
  danger: "bg-[color:var(--color-danger)] text-white",
  warning: "bg-[color:var(--color-brand-soft)] text-[#19130D]",
  soft: "bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-primary)]",
  sale: "brand-gradient text-white",
  new: "bg-[#19130D] text-[#FFF8F3]",
  premium: "gold-gradient text-[#19130D]",
  "best-seller": "bg-[#6D1F22] text-[#F9E3DF]",
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
        "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] shadow-sm",
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
