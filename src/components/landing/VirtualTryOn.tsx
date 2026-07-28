import { motion } from "framer-motion";
import { ScanFace, ArrowRight } from "lucide-react";
import { Button } from "@/components/primitives/Button";
import { ScrollReveal } from "@/components/shared/ScrollReveal";

export function VirtualTryOn() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-[1440px] px-4 py-16 md:px-8 md:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <ScrollReveal direction="left">
            <div className="space-y-6">
              <p className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-[color:var(--color-text-secondary)]">
                <ScanFace className="h-3 w-3 text-[color:var(--color-accent-teal)]" />
                Virtual Try-On
              </p>
              <h2 className="font-display text-3xl leading-tight text-[color:var(--color-text-primary)] md:text-5xl">
                Try frames from
                <br />
                the comfort of home
              </h2>
              <p className="max-w-md text-sm leading-7 text-[color:var(--color-text-secondary)] md:text-base">
                Our AI-powered virtual try-on lets you see how any frame looks on your face instantly. No appointments, no pressure, just perfect frames.
              </p>
              <ul className="space-y-3">
                {[
                  "Real-time face mapping technology",
                  "360-degree frame preview",
                  "Compare multiple styles side by side",
                  "Share with friends for feedback",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-[color:var(--color-text-secondary)]">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[color:var(--color-accent-teal)]/10 text-[10px] text-[color:var(--color-accent-teal)]">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <Button variant="cta-lg" iconRight={<ArrowRight className="h-4 w-4" />}>
                Try It Now
              </Button>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" className="relative">
            <div className="relative mx-auto aspect-[4/5] max-w-md overflow-hidden rounded-3xl border border-[color:var(--color-border)] bg-[linear-gradient(145deg,#f0f0f0,#e0e0e0)] dark:bg-[linear-gradient(145deg,#1a1a1a,#222222)]">
              <div className="flex h-full items-center justify-center p-8">
                <div className="text-center">
                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[color:var(--color-surface-muted)]">
                    <ScanFace className="h-10 w-10 text-[color:var(--color-accent-teal)]" />
                  </div>
                  <p className="mt-6 font-display text-2xl text-[color:var(--color-text-primary)]">
                    Virtual Try-On
                  </p>
                  <p className="mt-2 text-sm text-[color:var(--color-text-secondary)]">
                    Point your camera to see how frames look on you
                  </p>
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="mt-8"
                  >
                    <Button variant="primary" className="px-8">
                      Start Camera
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
