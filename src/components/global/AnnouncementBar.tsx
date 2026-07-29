import { useState, useEffect, useCallback } from "react";
import { X, Truck, ShieldCheck, RotateCcw, CreditCard, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { announcements } from "@/lib/landing-data";
import { useUiStore } from "@/lib/stores/ui-store";

const icons = [Truck, ShieldCheck, RotateCcw, CreditCard, Sparkles];

const items = announcements.map((text, i) => ({
  text,
  icon: icons[i % icons.length],
}));

export function AnnouncementBar() {
  const dismissed = useUiStore((s) => s.announcementDismissed);
  const setDismissed = useUiStore((s) => s.setAnnouncementDismissed);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((i) => (i + 1) % items.length);
  }, []);

  useEffect(() => {
    if (paused || items.length <= 1) return;
    const timer = setInterval(next, 3000);
    return () => clearInterval(timer);
  }, [paused, next]);

  if (items.length === 0) return null;

  const active = items[current];

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="fixed left-0 right-0 top-0 z-[60] bg-gradient-to-r from-[#0C111B] via-[#0D9488]/20 to-[#0C111B]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="relative mx-auto flex h-9 max-w-[1440px] items-center justify-center px-4 md:px-8">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-center gap-2.5"
                >
                  <active.icon className="h-3 w-3 shrink-0 text-[color:var(--color-accent-teal)]" />
                  <span className="whitespace-nowrap text-[11px] font-medium tracking-[0.04em] text-white/70">
                    {active.text}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>

            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="absolute right-3 top-1/2 z-10 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full text-white/30 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Dismiss announcement"
            >
              <X className="h-2.5 w-2.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
