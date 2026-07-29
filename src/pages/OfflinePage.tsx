import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { WifiOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/primitives/Button";

export function OfflinePage() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  if (isOnline) {
    window.location.href = "/";
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[color:var(--color-app-bg)] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-[color:var(--color-surface-muted)]"
        >
          <WifiOff className="h-10 w-10 text-[color:var(--color-text-tertiary)]" />
        </motion.div>
        <h1 className="font-display text-4xl font-bold text-[color:var(--color-text-primary)] md:text-5xl">No Connection</h1>
        <p className="mt-4 text-sm text-[color:var(--color-text-secondary)]">You are currently offline. Check your connection and try again.</p>
        <Button
          className="mt-8"
          onClick={() => window.location.reload()}
          iconLeft={<RefreshCw className="h-4 w-4" />}
        >
          Try Again
        </Button>
      </motion.div>
    </div>
  );
}
