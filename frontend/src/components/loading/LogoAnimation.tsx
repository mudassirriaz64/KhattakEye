import { motion } from "framer-motion";

export function LogoAnimation() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, filter: "blur(8px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative text-center"
    >
      <div className="absolute inset-0 -m-8 rounded-3xl bg-[color:var(--color-accent-teal)]/5 blur-2xl" />
      <h1 className="font-display text-5xl font-bold tracking-[0.15em] text-[color:var(--color-text-primary)] md:text-7xl">
        KHATTAK
      </h1>
      <p className="mt-2 text-xs tracking-[0.35em] text-[color:var(--color-text-tertiary)] md:text-sm">
        EYEWEAR
      </p>
    </motion.div>
  );
}
