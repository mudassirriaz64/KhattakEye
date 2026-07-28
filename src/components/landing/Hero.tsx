import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, ChevronDown, Sparkles, Shield, Truck, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/primitives/Button";

const floatingGlasses = [
  { x: "15%", y: "20%", delay: 0, rotate: -8, scale: 0.9 },
  { x: "75%", y: "15%", delay: 0.3, rotate: 6, scale: 0.8 },
  { x: "85%", y: "55%", delay: 0.6, rotate: -4, scale: 0.85 },
];

const trustBadges = [
  { icon: Truck, text: "Free Shipping" },
  { icon: Shield, text: "Secure Checkout" },
  { icon: RefreshCw, text: "Easy Returns" },
];

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <motion.div style={{ y: bgY }} className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#0B0B0C_0%,#1A1B2E_40%,#0F1923_70%,#0B0B0C_100%)]" />
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-[color:var(--color-accent-teal)]/10 blur-[120px]" />
        <div className="absolute right-1/4 top-1/3 h-80 w-80 rounded-full bg-[color:var(--color-accent-blue)]/8 blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/3 h-64 w-64 rounded-full bg-white/5 blur-[80px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)]" />
      </motion.div>

      {floatingGlasses.map((item, i) => (
        <motion.div
          key={i}
          className="absolute hidden opacity-20 md:block"
          style={{ left: item.x, top: item.y }}
          animate={{
            y: [0, -20, 0],
            rotate: [item.rotate, item.rotate + 4, item.rotate],
          }}
          transition={{
            duration: 6 + i,
            repeat: Infinity,
            delay: item.delay,
            ease: "easeInOut",
          }}
        >
          <div
            className="flex h-32 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm"
            style={{ transform: `scale(${item.scale})` }}
          >
            <svg viewBox="0 0 100 50" className="h-16 w-20 text-white/40">
              <ellipse cx="50" cy="25" rx="35" ry="18" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <line x1="15" y1="25" x2="5" y2="40" stroke="currentColor" strokeWidth="1.5" />
              <line x1="85" y1="25" x2="95" y2="40" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>
        </motion.div>
      ))}

      <motion.div style={{ opacity }} className="relative z-10 mx-auto max-w-6xl px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-white/70 backdrop-blur-sm">
            <Sparkles className="h-3 w-3 text-[color:var(--color-accent-teal)]" />
            Premium Eyewear Collection 2026
          </p>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-6xl leading-[1.1] tracking-tight text-white md:text-8xl lg:text-9xl"
        >
          See Better.
          <br />
          <span className="bg-[linear-gradient(135deg,#ffffff,#94a3b8,#14b8a6)] bg-clip-text text-transparent">
            Look Better.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-8 max-w-2xl text-base leading-8 text-white/60 md:text-lg"
        >
          Premium eyewear crafted for modern lifestyles with exceptional comfort, timeless style, and advanced lens technology.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <Link to="/shop">
            <Button
              variant="cta-lg"
              iconRight={<ArrowRight className="h-4 w-4" />}
              className="px-8 py-5 text-base"
            >
              Shop Collection
            </Button>
          </Link>
          <Button
            variant="outline"
            className="border-white/20 bg-white/5 px-8 py-5 text-base text-white hover:bg-white/10"
          >
            Virtual Try-On
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-6"
        >
          {trustBadges.map((badge) => (
            <div key={badge.text} className="flex items-center gap-2 text-xs text-white/50">
              <badge.icon className="h-3.5 w-3.5 text-[color:var(--color-accent-teal)]" />
              {badge.text}
            </div>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-xs text-white/40"
        >
          <span className="uppercase tracking-[0.24em]">Scroll</span>
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </motion.div>
    </section>
  );
}
