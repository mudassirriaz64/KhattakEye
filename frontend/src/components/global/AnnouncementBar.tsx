import { useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { announcements } from "@/lib/landing-data";
import { useUiStore } from "@/lib/stores/ui-store";

const icons = [
  "✦",
  "◆",
  "◈",
];

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
    const timer = setInterval(next, 3500);
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
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed left-0 right-0 top-0 z-[60] brand-gradient"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="relative mx-auto flex h-9 max-w-[1440px] items-center justify-center px-4 md:px-8">
            <div className="flex min-w-0 flex-1 items-center gap-2.5 overflow-hidden pr-10 md:mr-20">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, y: 12, filter: "blur(2px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -12, filter: "blur(2px)" }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="flex min-w-0 items-center gap-2"
                >
                  <span className="text-[10px] text-[#D3A095]">
                    {active.icon}
                  </span>
                  <span className="truncate whitespace-nowrap text-[11px] font-medium tracking-[0.06em] text-white/85">
                    {active.text}
                  </span>
                </motion.div>
              </AnimatePresence>

              <div className="ml-3 flex items-center gap-1.5">
                {items.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCurrent(i)}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      i === current
                        ? "w-3 bg-[#D3A095]"
                        : "w-1 bg-white/25 hover:bg-white/50"
                    }`}
                    aria-label={`Show announcement ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="absolute right-4 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full text-white/30 transition-colors hover:bg-white/10 hover:text-white"
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
