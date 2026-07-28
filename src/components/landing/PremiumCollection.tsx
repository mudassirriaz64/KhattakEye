import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/primitives/Button";

export function PremiumCollection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const opacity = useTransform(scrollYProgress, [0.2, 0.6], [0, 1]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-[linear-gradient(135deg,#0B0B0C,#1F2937,#0B0B0C)] py-16 md:py-24">
      <div className="absolute inset-0">
        <div className="absolute right-0 top-0 h-96 w-96 translate-x-1/2 -translate-y-1/2 rounded-full bg-[color:var(--color-accent-teal)]/5 blur-[100px]" />
        <div className="absolute bottom-0 left-0 h-64 w-64 -translate-x-1/3 translate-y-1/3 rounded-full bg-[color:var(--color-accent-blue)]/5 blur-[80px]" />
      </div>

      <div className="relative mx-auto max-w-[1440px] px-4 md:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <motion.div style={{ y: bgY }} className="relative">
            <div className="relative mx-auto aspect-[4/5] max-w-md overflow-hidden rounded-3xl border border-white/10">
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_50%,rgba(0,0,0,0.6)_100%)]" />
              <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(145deg,#1a1a2e,#16213e)] p-8">
                <p className="font-display text-6xl text-white/10">K</p>
              </div>
            </div>
          </motion.div>

          <motion.div style={{ opacity }} className="space-y-6">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/60">
              <Sparkles className="h-3 w-3 text-[color:var(--color-accent-teal)]" />
              Premium Collection
            </p>
            <h2 className="font-display text-3xl leading-tight text-white md:text-5xl">
              Crafted for those who
              <br />
              <span className="text-[color:var(--color-accent-teal)]">demand the finest</span>
            </h2>
            <p className="max-w-md text-sm leading-7 text-white/60 md:text-base">
              Each frame in our premium collection undergoes 45+ quality checks. From Italian acetate to Japanese titanium, every material is selected for its exceptional quality and timeless appeal.
            </p>
            <ul className="space-y-3">
              {[
                "Hand-polished Italian acetate frames",
                "Ultra-light Japanese titanium alloy",
                "German-engineered anti-reflective lenses",
                "Premium leather case & cleaning kit included",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-white/60">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[color:var(--color-accent-teal)]/20 text-[10px] text-[color:var(--color-accent-teal)]">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/shop">
              <Button
                variant="cta-lg"
                iconRight={<ArrowRight className="h-4 w-4" />}
              >
                Explore Premium
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
