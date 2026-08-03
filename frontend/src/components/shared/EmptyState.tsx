import type { ReactNode } from "react";
import { Inbox } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <motion.div
      className={cn("flex flex-col items-center justify-center px-6 py-16 text-center", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-tertiary)]"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
      >
        {icon || <Inbox className="h-7 w-7" />}
      </motion.div>
      <h3 className="font-display text-xl text-[color:var(--color-text-primary)]">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-[color:var(--color-text-secondary)]">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </motion.div>
  );
}
