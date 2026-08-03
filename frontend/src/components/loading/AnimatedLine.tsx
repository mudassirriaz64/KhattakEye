import { motion } from "framer-motion";

export function AnimatedLine() {
  return (
    <div className="relative mt-6 h-8 w-64 md:w-80">
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.5, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="absolute left-0 top-1/2 h-[1.5px] w-full origin-left -translate-y-1/2 bg-gradient-to-r from-[color:var(--color-accent-teal)] to-[#C8A96E]"
      />
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.4, delay: 1.8, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 origin-bottom bg-[color:var(--color-app-bg)]"
      />
    </div>
  );
}
