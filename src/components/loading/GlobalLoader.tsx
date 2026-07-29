import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const loadingTexts = [
  "Loading your experience...",
  "Preparing your collection...",
  "Finding your perfect frame...",
  "Curating your style...",
  "Almost ready...",
];

export function GlobalLoader({ onComplete }: { onComplete?: () => void }) {
  const [progress, setProgress] = useState(0);
  const [textIndex, setTextIndex] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((i) => (i + 1) % loadingTexts.length);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) return;
    const timeout = setTimeout(() => {
      const next = Math.min(100, progress + Math.random() * 18 + 5);
      setProgress(next);
    }, 180 + Math.random() * 250);
    return () => clearTimeout(timeout);
  }, [progress]);

  useEffect(() => {
    if (progress >= 100) {
      const timeout = setTimeout(() => {
        setShow(false);
        onComplete?.();
      }, 400);
      return () => clearTimeout(timeout);
    }
  }, [progress, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0C111B]"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex items-center justify-center"
          >
            <svg width="80" height="80" viewBox="0 0 80 80" className="overflow-visible">
              <motion.rect
                x="4" y="4" width="72" height="72" rx="20"
                fill="none" stroke="#0D9488" strokeWidth="1.5"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              />
              <motion.ellipse
                cx="28" cy="38" rx="18" ry="10"
                fill="none" stroke="white" strokeWidth="2.5"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              />
              <motion.ellipse
                cx="52" cy="38" rx="18" ry="10"
                fill="none" stroke="white" strokeWidth="2.5"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
              />
              <motion.line
                x1="46" y1="38" x2="34" y2="38"
                stroke="white" strokeWidth="2" strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.9 }}
              />
              <motion.path
                d="M8 32 Q0 20 8 16"
                fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.1 }}
              />
              <motion.path
                d="M72 32 Q80 20 72 16"
                fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.3 }}
              />
            </svg>
            <motion.div
              className="absolute -inset-4 rounded-3xl"
              animate={{
                boxShadow: [
                  "0 0 0 0 rgba(13, 148, 136, 0)",
                  "0 0 40px 8px rgba(13, 148, 136, 0.15)",
                  "0 0 0 0 rgba(13, 148, 136, 0)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>

          <motion.div
            className="mt-8 h-1 w-48 overflow-hidden rounded-full bg-white/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#0D9488] to-[#14B8A6]"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>

          <motion.p
            className="mt-4 text-sm text-white/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {Math.round(progress)}%
          </motion.p>

          <AnimatePresence mode="wait">
            <motion.p
              key={textIndex}
              className="mt-6 text-xs tracking-[0.2em] text-white/30"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
            >
              {loadingTexts[textIndex]}
            </motion.p>
          </AnimatePresence>

          <motion.p
            className="mt-16 font-display text-lg tracking-[0.15em] text-white/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ delay: 0.8 }}
          >
            KHATTAK
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
