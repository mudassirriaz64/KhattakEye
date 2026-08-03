import { motion, AnimatePresence } from "framer-motion";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type LoadingOverlayProps = {
  show: boolean;
  message?: string;
  variant?: "fullscreen" | "inline" | "modal";
};

export function LoadingOverlay({ show, message, variant = "inline" }: LoadingOverlayProps) {
  const base = (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3",
        variant === "fullscreen" && "fixed inset-0 z-[9998] bg-[color:var(--color-app-bg)]/80 backdrop-blur-sm",
        variant === "modal" && "absolute inset-0 z-50 rounded-2xl bg-[color:var(--color-panel)]/90 backdrop-blur-sm",
        variant === "inline" && "py-12",
      )}
    >
      <LoaderCircle className="h-6 w-6 animate-spin text-[color:var(--color-accent-teal)]" />
      {message && (
        <p className="text-sm text-[color:var(--color-text-secondary)]">{message}</p>
      )}
    </div>
  );

  if (variant === "fullscreen" || variant === "modal") {
    return <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {base}
        </motion.div>
      )}
    </AnimatePresence>;
  }

  return show ? base : null;
}
