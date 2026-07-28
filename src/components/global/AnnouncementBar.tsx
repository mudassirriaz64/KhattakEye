import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { announcements } from "@/lib/landing-data";
import { cn } from "@/lib/utils";

export function AnnouncementBar() {
  const [current, setCurrent] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="relative overflow-hidden bg-[linear-gradient(135deg,#111111,#1F2937)]"
        >
          <div className="mx-auto flex h-10 max-w-[1440px] items-center justify-center px-4">
            <div className="relative h-full w-full max-w-3xl overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.p
                  key={current}
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -12, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute left-0 right-0 top-1/2 -translate-y-1/2 text-center text-xs font-medium tracking-[0.08em] text-white/90"
                >
                  {announcements[current]}
                </motion.p>
              </AnimatePresence>
            </div>
            <button
              type="button"
              onClick={() => setDismissed(true)}
              className={cn(
                "relative ml-auto flex h-6 w-6 items-center justify-center rounded-full",
                "text-white/60 transition-colors hover:bg-white/10 hover:text-white",
              )}
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
