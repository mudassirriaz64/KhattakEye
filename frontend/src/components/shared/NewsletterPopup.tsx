import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/primitives/Button";

const POPUP_KEY = "khattak-newsletter-popup";

export function NewsletterPopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(POPUP_KEY);
    if (dismissed) return;
    const timer = setTimeout(() => setShow(true), 15000);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    localStorage.setItem(POPUP_KEY, "dismissed");
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[180] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={dismiss}
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-[color:var(--color-panel)] p-8 shadow-[var(--shadow-strong)] backdrop-blur-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={dismiss}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-[color:var(--color-text-tertiary)] hover:bg-[color:var(--color-surface-muted)] hover:text-[color:var(--color-text-primary)]"
              aria-label="Close popup"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="text-center">
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[color:var(--color-surface-muted)]"
              >
                <Sparkles className="h-7 w-7 text-[color:var(--color-accent-teal)]" />
              </motion.div>
              <h2 className="font-display text-2xl text-[color:var(--color-text-primary)]">Join the Club</h2>
              <p className="mt-2 text-sm text-[color:var(--color-text-secondary)]">
                Be the first to know about new collections, exclusive offers, and eyewear trends.
              </p>
              <div className="mt-6 flex items-center gap-3 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2">
                <Mail className="h-4 w-4 text-[color:var(--color-text-tertiary)]" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 bg-transparent text-sm text-[color:var(--color-text-primary)] outline-none placeholder:text-[color:var(--color-text-tertiary)]"
                  aria-label="Email for newsletter"
                />
              </div>
              <Button className="mt-3 w-full" iconLeft={<Mail className="h-4 w-4" />}>
                Subscribe
              </Button>
              <p className="mt-4 text-[10px] text-[color:var(--color-text-tertiary)]">
                No spam. Unsubscribe anytime.
              </p>
            </div>

            <button
              type="button"
              onClick={dismiss}
              className="mt-4 w-full text-center text-xs text-[color:var(--color-text-tertiary)] hover:text-[color:var(--color-text-secondary)]"
            >
              No thanks, I'll browse
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
