import { motion } from "framer-motion";

export function GlassesOutline() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 2.8 }}
      className="mt-8"
    >
      <svg
        width="80"
        height="36"
        viewBox="0 0 80 36"
        className="overflow-visible"
      >
        <motion.ellipse
          cx="18"
          cy="18"
          rx="14"
          ry="10"
          fill="none"
          stroke="var(--color-accent-teal)"
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, delay: 2.8, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.line
          x1="32"
          y1="18"
          x2="48"
          y2="18"
          stroke="var(--color-accent-teal)"
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.3, delay: 3.0, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.ellipse
          cx="62"
          cy="18"
          rx="14"
          ry="10"
          fill="none"
          stroke="var(--color-accent-teal)"
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, delay: 2.9, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.path
          d="M4 14 Q0 8 6 4"
          fill="none"
          stroke="var(--color-accent-teal)"
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.4, delay: 3.1, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.path
          d="M76 14 Q80 8 74 4"
          fill="none"
          stroke="var(--color-accent-teal)"
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.4, delay: 3.2, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
    </motion.div>
  );
}
