import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ScanFace, Camera, Sparkles, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/primitives/Button";
import { ScrollReveal } from "@/components/shared/ScrollReveal";

const features = [
  {
    icon: ScanFace,
    title: "Instant fit",
    description: "See any frame on your face in seconds, with adjustable bridge and temple guides.",
  },
  {
    icon: Camera,
    title: "Real-time preview",
    description: "Live camera tracking keeps the frame perfectly aligned as you move and turn.",
  },
  {
    icon: Sparkles,
    title: "Artisan recommendations",
    description: "Our fit algorithm suggests silhouettes tailored to your face shape.",
  },
];

const steps = ["Enable camera", "Frame your face", "Try any silhouette", "Checkout with confidence"];

export function TryOnPromo() {
  return (
    <section className="bg-[color:var(--color-panel)] py-20 md:py-28">
      <div className="mx-auto max-w-[1440px] px-4 md:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="order-2 lg:order-1 lg:col-span-6">
            <ScrollReveal>
              <p className="editorial-eyebrow">Virtual Try-On</p>
              <h2 className="mt-4 font-display text-4xl leading-tight text-[color:var(--color-text-primary)] md:text-6xl">
                Try it on before you <span className="italic text-gradient-brand">commit</span>
              </h2>
              <p className="mt-6 max-w-lg text-base leading-8 text-[color:var(--color-text-secondary)]">
                No boutique, no queues. Our AI-powered fitting room lets you preview frames in
                photorealistic detail from the comfort of your home.
              </p>
            </ScrollReveal>

            <div className="mt-10 space-y-6">
              {features.map((feature, index) => (
                <ScrollReveal key={feature.title} delay={index * 0.1}>
                  <div className="flex items-start gap-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl brand-gradient-soft text-[color:var(--color-brand-primary)]">
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg text-[color:var(--color-text-primary)]">
                        {feature.title}
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-[color:var(--color-text-secondary)]">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal className="mt-10">
              <Link to="/virtual-try-on">
                <Button variant="cta-lg" iconRight={<ArrowRight className="h-4 w-4" />}>
                  Open the Fitting Room
                </Button>
              </Link>
            </ScrollReveal>
          </div>

          <div className="order-1 lg:order-2 lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative mx-auto max-w-[480px] overflow-hidden"
            >
              <div className="absolute -right-6 -top-6 h-full w-full rounded-[40px] bg-[color:var(--color-brand-soft)]/30" />
              <div className="relative overflow-hidden rounded-[40px] border border-[color:var(--color-border)] shadow-[var(--shadow-strong)]">
                <img
                  src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=900&q=80"
                  alt="Virtual try-on preview"
                  className="aspect-[4/5] w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--color-text-primary)]/30 via-transparent to-transparent" />

                <div className="absolute inset-x-5 top-5 flex items-center justify-between rounded-2xl bg-[color:var(--color-panel)]/90 px-4 py-3 shadow-[var(--shadow-soft)] backdrop-blur">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[color:var(--color-danger)] opacity-60" />
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[color:var(--color-danger)]" />
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--color-text-secondary)]">
                      Live Preview
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-[color:var(--color-brand-primary)]">
                    Noir Line Titanium
                  </span>
                </div>

                <div className="absolute bottom-5 left-1/2 w-[86%] -translate-x-1/2 rounded-2xl bg-[color:var(--color-panel)]/95 p-4 shadow-[var(--shadow-strong)] backdrop-blur">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-text-tertiary)]">
                      Fit confidence
                    </span>
                    <span className="text-xs font-bold text-[color:var(--color-brand-primary)]">98%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-[color:var(--color-surface-muted)]">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "98%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.4, ease: "easeOut", delay: 0.4 }}
                      className="h-full rounded-full brand-gradient"
                    />
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5">
                    {steps.map((step) => (
                      <span key={step} className="flex items-center gap-1.5 text-[11px] text-[color:var(--color-text-secondary)]">
                        <Check className="h-3 w-3 text-[color:var(--color-success)]" />
                        {step}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
