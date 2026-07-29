import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/primitives/Button";

export function ErrorPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[color:var(--color-app-bg)] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-red-50 dark:bg-red-950/20"
        >
          <AlertTriangle className="h-10 w-10 text-[color:var(--color-danger)]" />
        </motion.div>
        <h1 className="font-display text-6xl font-bold text-[color:var(--color-text-primary)] md:text-8xl">500</h1>
        <p className="mt-4 text-lg text-[color:var(--color-text-secondary)]">Something went wrong</p>
        <p className="mt-2 text-sm text-[color:var(--color-text-tertiary)]">Our team has been notified. Please try again.</p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Button onClick={() => window.location.reload()} iconLeft={<RefreshCw className="h-4 w-4" />}>
            Try Again
          </Button>
          <Link to="/">
            <Button variant="outline">Go Home</Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
