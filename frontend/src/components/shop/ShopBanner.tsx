import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

type ShopBannerProps = {
  title: string;
  description: string;
  image: string;
  count?: number;
};

export function ShopBanner({ title, description, image, count }: ShopBannerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);

  return (
    <section ref={ref} className="relative overflow-hidden rounded-3xl border border-[color:var(--color-border)]">
      <motion.div style={{ y }} className="absolute inset-0">
        <img src={image} alt={title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,0,0,0.7)_0%,rgba(0,0,0,0.3)_100%)]" />
      </motion.div>
      <div className="relative px-6 py-16 md:px-10 md:py-20">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/60">Category</p>
          <h1 className="mt-2 font-display text-4xl text-white md:text-6xl">{title}</h1>
          <p className="mt-4 max-w-lg text-sm leading-7 text-white/70 md:text-base">{description}</p>
          {count !== undefined && (
            <p className="mt-4 text-sm text-white/50">{count} Products</p>
          )}
        </div>
      </div>
    </section>
  );
}
