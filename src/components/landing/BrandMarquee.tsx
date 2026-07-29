import { motion } from "framer-motion";
import { brands } from "@/lib/landing-data";

export function BrandMarquee() {
  const items = [...brands, ...brands, ...brands];

  return (
    <div className="relative overflow-hidden border-y border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] py-4">
      <motion.div
        className="flex items-center gap-16"
        animate={{ x: [0, -1920] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        whileHover={{ paused: true } as any}
      >
        {items.map((brand, i) => (
          <div
            key={`${brand.name}-${i}`}
            className="flex shrink-0 items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--color-brand-primary)] text-[11px] font-bold text-white">
              {brand.logo}
            </div>
            <span className="whitespace-nowrap text-sm font-medium tracking-wider text-[color:var(--color-text-tertiary)]">
              {brand.name}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
