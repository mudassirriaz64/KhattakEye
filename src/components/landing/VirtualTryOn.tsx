import { motion } from "framer-motion";
import { ArrowRight, Camera, Check, MonitorSmartphone } from "lucide-react";
import { Button } from "@/components/primitives/Button";

const features = [
  "Real-time face mapping technology",
  "360-degree frame preview",
  "Compare multiple styles side by side",
  "Share with friends for feedback",
];

export function VirtualTryOn() {
  return (
    <section className="relative overflow-hidden border-y border-[color:var(--color-border)] py-16 md:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--color-accent-teal)/8,transparent_60%)]" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-5">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-3"
          >
            <div className="max-w-xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3.5 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-accent-teal)]" />
                <span className="text-xs font-semibold uppercase tracking-wider text-[color:var(--color-text-secondary)]">
                  Virtual Try-On
                </span>
              </div>

              <h2 className="font-display text-4xl leading-[1.15] tracking-tight text-[color:var(--color-text-primary)] md:text-5xl lg:text-6xl">
                Try frames from
                <br />
                <span className="text-[color:var(--color-accent-teal)]">the comfort of home</span>
              </h2>

              <p className="mt-4 max-w-lg text-base leading-relaxed text-[color:var(--color-text-tertiary)]">
                Our AI-powered virtual try-on lets you see how any frame looks on your face instantly. No appointments, no pressure, just perfect frames.
              </p>

              <div className="mt-6 space-y-3">
                {features.map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-accent-teal)]/10">
                      <Check className="h-3.5 w-3.5 text-[color:var(--color-accent-teal)]" />
                    </div>
                    <span className="text-sm text-[color:var(--color-text-secondary)]">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button variant="cta-lg" iconRight={<ArrowRight className="h-4 w-4" />}>
                  Try It Now
                </Button>
                <Button variant="outline">Learn More</Button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-2"
          >
            <div className="relative mx-auto max-w-xs">
              <div className="relative overflow-hidden rounded-[2.5rem] border-4 border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-2xl">
                <div className="flex h-6 items-center justify-center gap-1.5 border-b border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                  <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                </div>

                <div className="flex aspect-[3/5] flex-col items-center justify-center px-6 py-8 text-center">
                  <div className="relative mb-6">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[color:var(--color-accent-teal)]/20 to-transparent ring-1 ring-[color:var(--color-accent-teal)]/20">
                      <Camera className="h-10 w-10 text-[color:var(--color-accent-teal)]" />
                    </div>
                    <span className="absolute right-0 top-0 flex h-3 w-3">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[color:var(--color-accent-teal)] opacity-75" />
                      <span className="relative inline-flex h-3 w-3 rounded-full bg-[color:var(--color-accent-teal)]" />
                    </span>
                  </div>

                  <h3 className="font-display text-lg font-semibold text-[color:var(--color-text-primary)]">
                    Virtual Try-On
                  </h3>
                  <p className="mt-1.5 text-xs text-[color:var(--color-text-tertiary)]">
                    Point your camera to see how frames look on you
                  </p>

                  <div className="mt-6 w-full">
                    <Button variant="primary" className="w-full text-sm" iconLeft={<Camera className="h-3.5 w-3.5" />}>
                      Start Camera
                    </Button>
                  </div>

                  <div className="mt-4 flex items-center gap-1.5 text-[10px] text-[color:var(--color-text-tertiary)]">
                    <MonitorSmartphone className="h-3 w-3" />
                    Works on any device
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
