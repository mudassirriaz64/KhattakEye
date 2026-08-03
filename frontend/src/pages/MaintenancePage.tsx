import { motion } from "framer-motion";
import { Glasses, Clock } from "lucide-react";

export function MaintenancePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[color:var(--color-app-bg)] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-[color:var(--color-surface-muted)]"
        >
          <Glasses className="h-10 w-10 text-[color:var(--color-text-tertiary)]" />
        </motion.div>
        <h1 className="font-display text-4xl font-bold text-[color:var(--color-text-primary)] md:text-5xl">Under Maintenance</h1>
        <p className="mt-4 text-sm text-[color:var(--color-text-secondary)]">We're upgrading our store for a better experience. We'll be back shortly.</p>
        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-[color:var(--color-text-tertiary)]">
          <Clock className="h-4 w-4" />
          Estimated time: 2 hours
        </div>
      </motion.div>
    </div>
  );
}
