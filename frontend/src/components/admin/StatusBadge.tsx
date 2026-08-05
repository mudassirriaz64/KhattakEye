import { cn } from "@/lib/utils";

const variants: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-600",
  draft: "bg-amber-500/10 text-amber-600",
  archived: "bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-tertiary)]",
  published: "bg-[color:var(--color-accent-teal)]/10 text-[color:var(--color-accent-teal)]",
  pending: "bg-amber-500/10 text-amber-600",
  "payment-verification": "bg-purple-500/10 text-purple-600",
  confirmed: "bg-indigo-500/10 text-indigo-600",
  processing: "bg-[color:var(--color-accent-blue)]/10 text-[color:var(--color-accent-blue)]",
  shipped: "bg-[color:var(--color-accent-teal)]/10 text-[color:var(--color-accent-teal)]",
  delivered: "bg-emerald-500/10 text-emerald-600",
  cancelled: "bg-red-500/10 text-red-600",
  inactive: "bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-tertiary)]",
  "in-stock": "bg-emerald-500/10 text-emerald-600",
  "low-stock": "bg-amber-500/10 text-amber-600",
  "out-of-stock": "bg-red-500/10 text-red-600",
  yes: "bg-[color:var(--color-accent-teal)]/10 text-[color:var(--color-accent-teal)]",
  no: "bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-tertiary)]",
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  return (
    <span className={cn("rounded-lg px-2.5 py-1 text-[10px] font-semibold capitalize", variants[status] || "bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-tertiary)]", className)}>
      {status.replace(/-/g, " ")}
    </span>
  );
}

export function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) return <StatusBadge status="out-of-stock" />;
  if (stock <= 5) return <StatusBadge status="low-stock" />;
  return <StatusBadge status="in-stock" />;
}
