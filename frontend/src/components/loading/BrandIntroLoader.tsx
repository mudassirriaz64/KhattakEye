import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import App from "@/App";
import { RevealProvider, type RevealPhase } from "./RevealContext";

export function BrandIntroLoader() {
  const [showLoader, setShowLoader] = useState(true);
  const [ready, setReady] = useState(false);
  const [phase, setPhase] = useState<RevealPhase>("loading");

  useEffect(() => {
    const seen = sessionStorage.getItem("khattak-brand-intro");
    if (seen) {
      setPhase("revealed");
      setShowLoader(false);
      setReady(true);
    } else {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (showLoader) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showLoader]);

  useEffect(() => {
    if (!ready || !showLoader) return;
    const timer = setTimeout(() => {
      setPhase("revealing");
      setShowLoader(false);
    }, 3400);
    return () => clearTimeout(timer);
  }, [ready, showLoader]);

  const handleExitComplete = () => {
    setPhase("revealed");
    sessionStorage.setItem("khattak-brand-intro", "true");
  };

  if (!ready) return null;

  return (
    <RevealProvider phase={phase}>
      <App />

      <AnimatePresence onExitComplete={handleExitComplete}>
        {showLoader && (
          <motion.div
            exit={{ opacity: 0, filter: "blur(4px)", scale: 0.95 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#19130D]"
          >
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute left-1/2 top-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-accent-teal)]/10 blur-3xl"
              />
              <motion.div
                animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.15, 1] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-[#C8A96E]/10 blur-3xl"
              />
              <motion.div
                animate={{ opacity: [0.15, 0.4, 0.15], scale: [1, 1.2, 1] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute left-1/4 top-3/4 h-72 w-72 rounded-full bg-[var(--color-accent-teal)]/8 blur-3xl"
              />
            </div>

            <div className="relative flex flex-col items-center justify-center px-6 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, filter: "blur(6px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.div
                  animate={{ boxShadow: ["0 0 0 0 rgba(182, 25, 27, 0)", "0 0 60px 12px rgba(182, 25, 27, 0.25)", "0 0 0 0 rgba(182, 25, 27, 0)"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
                  className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10"
                >
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <ellipse cx="8" cy="14" rx="6" ry="4.5" stroke="#B6191B" strokeWidth="1.5" fill="none" />
                    <ellipse cx="24" cy="14" rx="6" ry="4.5" stroke="#B6191B" strokeWidth="1.5" fill="none" />
                    <line x1="14" y1="14" x2="18" y2="14" stroke="#B6191B" strokeWidth="1.5" />
                    <path d="M2 10 Q0 4 4 2" stroke="#B6191B" strokeWidth="1.2" strokeLinecap="round" fill="none" />
                    <path d="M30 10 Q32 4 28 2" stroke="#B6191B" strokeWidth="1.2" strokeLinecap="round" fill="none" />
                  </svg>
                </motion.div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="font-display text-5xl font-bold tracking-[0.12em] text-white md:text-6xl"
              >
                KHATTAK
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="mt-2 text-xs tracking-[0.35em] text-white/40 md:text-sm"
              >
                EYEWEAR
              </motion.p>

              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="mt-6 h-px w-48 origin-left bg-gradient-to-r from-transparent via-white/30 to-transparent"
              />

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.8, ease: [0.22, 1, 0.36, 1] }}
                className="mt-5 text-sm italic tracking-wide text-white/50 md:text-base"
              >
                "Precision Crafted For Your Vision"
              </motion.p>

              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: 2.3, ease: [0.22, 1, 0.36, 1] }}
                className="mt-8 h-[1.5px] w-32 origin-left bg-gradient-to-r from-[var(--color-brand-primary)] to-[#C8A96E]"
              />
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.8 }}
              className="absolute bottom-10"
            >
              <motion.div
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="h-8 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </RevealProvider>
  );
}
