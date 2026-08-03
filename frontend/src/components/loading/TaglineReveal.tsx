import { motion } from "framer-motion";

export function TaglineReveal() {
  return (
    <motion.p
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 2.3, ease: [0.22, 1, 0.36, 1] }}
      className="mt-5 text-sm tracking-[0.25em] text-[color:var(--color-text-secondary)] md:text-base"
    >
      Precision Crafted For Your Vision
    </motion.p>
  );
}
