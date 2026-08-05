import { motion } from "framer-motion";
import { CheckCircle2, Circle, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { OrderTimelineEntry, OrderStatus } from "@/lib/order-data";

type OrderTimelineProps = {
  entries: OrderTimelineEntry[];
  currentStatus: OrderStatus;
};

const statusIndex: Record<OrderStatus, number> = {
  pending: 0,
  "payment-verification": 1,
  confirmed: 2,
  processing: 3,
  shipped: 4,
  delivered: 5,
  cancelled: 6,
};

export function OrderTimeline({ entries, currentStatus }: OrderTimelineProps) {
  const currentIdx = statusIndex[currentStatus] ?? 0;

  return (
    <div className="relative space-y-0">
      {entries.map((entry, i) => {
        const isCompleted = entry.completed;
        const isCurrent = i === currentIdx;
        const isPast = i < currentIdx;

        return (
          <motion.div
            key={entry.status}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08, duration: 0.3 }}
            className="relative flex gap-5 pb-8 last:pb-0"
          >
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all",
                  isCompleted && "bg-[color:var(--color-accent-teal)] text-white",
                  isCurrent && !isCompleted && "border-2 border-[color:var(--color-accent-teal)] bg-[color:var(--color-accent-teal)]/10",
                  !isCompleted && !isCurrent && "border-2 border-[color:var(--color-border)] bg-[color:var(--color-app-bg)]",
                )}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : isCurrent ? (
                  <LoaderCircle className="h-4 w-4 animate-spin text-[color:var(--color-accent-teal)]" />
                ) : (
                  <Circle className="h-4 w-4 text-[color:var(--color-text-tertiary)]" />
                )}
              </div>
              {i < entries.length - 1 && (
                <div className={cn("mt-1 h-full w-0.5", isPast ? "bg-[color:var(--color-accent-teal)]" : "bg-[color:var(--color-border)]")} />
              )}
            </div>

            <div className={cn("min-w-0 flex-1 pb-4", isCurrent && !isCompleted && "bg-[color:var(--color-surface-muted)] -mx-3 rounded-xl px-3 py-2")}>
              <p className={cn(
                "text-sm font-medium",
                isCompleted ? "text-[color:var(--color-accent-teal)]" : "text-[color:var(--color-text-primary)]",
              )}>
                {entry.label}
              </p>
              <p className="mt-0.5 text-xs text-[color:var(--color-text-tertiary)]">{entry.date}</p>
              <p className="mt-1 text-xs leading-5 text-[color:var(--color-text-secondary)]">{entry.description}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
