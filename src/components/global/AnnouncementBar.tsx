import { X, Truck, ShieldCheck, RotateCcw, CreditCard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { announcements } from "@/lib/landing-data";
import { useUiStore } from "@/lib/stores/ui-store";

const icons = [Truck, ShieldCheck, RotateCcw, CreditCard];

const items = announcements.map((text, i) => ({
  text,
  icon: icons[i % icons.length],
}));

const MARQUEE_DURATION = 50;

export function AnnouncementBar() {
  const dismissed = useUiStore((s) => s.announcementDismissed);
  const setDismissed = useUiStore((s) => s.setAnnouncementDismissed);

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="fixed left-0 right-0 top-0 z-[60] overflow-hidden bg-[color:var(--color-brand-primary)]"
        >
          <div className="relative mx-auto flex h-10 max-w-[1440px] items-center">
            <div className="flex-1 overflow-hidden">
              <motion.div
                className="flex"
                animate={{ x: [0, -1500] }}
                transition={{ duration: MARQUEE_DURATION, repeat: Infinity, ease: "linear", repeatType: "loop" }}
              >
                {[...items, ...items, ...items, ...items].map((item, i) => (
                  <span
                    key={i}
                    className="flex h-10 shrink-0 items-center gap-2.5 px-6 text-[11px] font-medium tracking-[0.04em] text-white/70"
                    style={{ minWidth: "280px" }}
                  >
                    <item.icon className="h-3.5 w-3.5 shrink-0 text-[color:var(--color-accent-teal)]" />
                    {item.text}
                  </span>
                ))}
              </motion.div>
            </div>

            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="absolute right-3 top-1/2 z-10 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-white/40 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Dismiss announcement"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
