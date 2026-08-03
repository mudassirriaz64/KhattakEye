import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

type ImageLoaderProps = {
  src: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
  fallback?: string;
};

export function ImageLoader({ src, alt, className, wrapperClassName, fallback }: ImageLoaderProps) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");

  const retry = useCallback(() => {
    setStatus("loading");
    const img = new Image();
    img.onload = () => setStatus("loaded");
    img.onerror = () => setStatus("error");
    img.src = src;
  }, [src]);

  return (
    <div className={cn("relative isolate overflow-hidden", wrapperClassName)}>
      <AnimatePresence mode="wait">
        {status === "loading" && (
          <motion.div
            key="skeleton"
            className="absolute inset-0 bg-[color:var(--color-surface-muted)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 -translate-x-full motion-safe:animate-shimmer"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
              }}
            />
          </motion.div>
        )}

        {status === "error" && (
          <motion.div
            key="error"
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[color:var(--color-surface-muted)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <AlertTriangle className="h-5 w-5 text-[color:var(--color-text-tertiary)]" />
            <span className="text-xs text-[color:var(--color-text-tertiary)]">Failed to load</span>
            <button
              type="button"
              onClick={retry}
              className="flex items-center gap-1 text-xs text-[color:var(--color-accent-teal)] hover:underline"
            >
              <RefreshCw className="h-3 w-3" /> Retry
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <img
        src={src}
        alt={alt}
        className={cn(
          "transition-opacity duration-500",
          status === "loaded" ? "opacity-100" : "opacity-0",
          className,
        )}
        onLoad={() => setStatus("loaded")}
        onError={() => setStatus("error")}
        loading="lazy"
      />
    </div>
  );
}
