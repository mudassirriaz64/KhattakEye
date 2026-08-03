import { motion } from "framer-motion";

export function ProgressIndicator() {
  return (
    <div className="fixed bottom-0 left-0 h-[2px] w-screen">
      <motion.div
        initial={{ width: "0%" }}
        animate={{ width: "100%" }}
        transition={{ duration: 3.5, ease: [0.22, 1, 0.36, 1] }}
        className="h-full bg-gradient-to-r from-[color:var(--color-accent-teal)] to-[#C8A96E]"
      />
    </div>
  );
}
