import { cn } from "@/lib/utils";
import { getOrderStatusLabel, getAvailabilityLabel } from "@/lib/utils/enum-labels";

const variants: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-600",
  draft: "bg-amber-500/10 text-amber-600",
  archived: "bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-tertiary)]",
  published: "bg-[color:var(--color-accent-teal)]/10 text-[color:var(--color-accent-teal)]",
  pending: "bg-amber-500/10 text-amber-600",
  "pending-quote": "bg-orange-500/10 text-orange-600",
  "payment-verification": "bg-purple-500/10 text-purple-600",
  confirmed: "bg-cyan-500/10 text-cyan-600",
  processing: "bg-[color:var(--color-accent-blue)]/10 text-[color:var(--color-accent-blue)]",
  packed: "bg-indigo-500/10 text-indigo-600",
  shipped: "bg-[color:var(--color-accent-teal)]/10 text-[color:var(--color-accent-teal)]",
  "out-for-delivery": "bg-teal-500/10 text-teal-600",
  delivered: "bg-emerald-500/10 text-emerald-600",
  cancelled: "bg-red-500/10 text-red-600",
  inactive: "bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-tertiary)]",
  "in-stock": "bg-emerald-500/10 text-emerald-600",
  "low-stock": "bg-amber-500/10 text-amber-600",
  "out-of-stock": "bg-red-500/10 text-red-600",
  preorder: "bg-blue-500/10 text-blue-600",
  yes: "bg-[color:var(--color-accent-teal)]/10 text-[color:var(--color-accent-teal)]",
  no: "bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-tertiary)]",
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const normalized = status?.toLowerCase().trim() || "";
  const label = variants[normalized]
    ? (normalized.includes("stock") || normalized === "preorder" ? getAvailabilityLabel(status) : getOrderStatusLabel(status))
    : status.replace(/-/g, " ");

  return (
    <span className={cn("rounded-lg px-2.5 py-1 text-[10px] font-semibold", variants[normalized] || "bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-tertiary)]", className)}>
      {label}
    </span>
  );
}

export function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) return <StatusBadge status="out-of-stock" />;
  if (stock <= 5) return <StatusBadge status="low-stock" />;
  return <StatusBadge status="in-stock" />;
}
