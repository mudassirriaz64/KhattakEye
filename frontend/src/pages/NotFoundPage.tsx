import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Glasses, Home } from "lucide-react";
import { Button } from "@/components/primitives/Button";

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[color:var(--color-app-bg)] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-[color:var(--color-surface-muted)]"
        >
          <Glasses className="h-10 w-10 text-[color:var(--color-text-tertiary)]" />
        </motion.div>
        <motion.h1
          className="font-display text-7xl font-bold text-[color:var(--color-text-primary)] md:text-9xl"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
        >
          404
        </motion.h1>
        <p className="mt-4 text-lg text-[color:var(--color-text-secondary)]">Page not found</p>
        <p className="mt-2 text-sm text-[color:var(--color-text-tertiary)]">The page you're looking for doesn't exist.</p>
        <Link to="/" className="mt-8 inline-block">
          <Button iconLeft={<Home className="h-4 w-4" />}>Back to Home</Button>
        </Link>
      </motion.div>
    </div>
  );
}
