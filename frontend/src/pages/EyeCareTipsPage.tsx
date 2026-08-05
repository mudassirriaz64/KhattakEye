import { Eye, Sun, Sparkles, Shield, CheckCircle2 } from "lucide-react";
import { ScrollReveal } from "@/components/shared/ScrollReveal";

const tips = [
  {
    title: "Protect Against Blue Light",
    desc: "Digital screens emit high-energy visible (HEV) blue light. Wear anti-blue light coating lenses during extended computer sessions to reduce eye strain, headaches, and sleep disruption."
  },
  {
    title: "Clean Lenses with Microfiber Only",
    desc: "Always clean your frames with a lens-safe liquid cleaner and the provided ultra-fine microfiber cloth. Avoid using paper towels or shirt fabric which contain abrasive fibers."
  },
  {
    title: "Store in a Rigid Vault Case",
    desc: "When not wearing your glasses, store them in your Khattak leather hard case. Leaving frames loose in bags or upside down on hard surfaces risks surface scratches and alignment warps."
  },
  {
    title: "100% UV Protection for Outdoor Soles",
    desc: "Ensure your sunglasses provide full UV400 protection to block both UVA and UVB rays. All Khattak sun lenses are laboratory certified for 100% UV filtration."
  }
];

export function EyeCareTipsPage() {
  return (
    <div className="bg-[color:var(--color-app-bg)] min-h-screen">
      <section className="relative overflow-hidden py-20 md:py-24">
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[color:var(--color-brand-soft)]/20 blur-3xl" />
        <div className="mx-auto max-w-[1440px] px-4 md:px-8">
          <div className="max-w-3xl">
            <ScrollReveal>
              <p className="editorial-eyebrow">Optical Wellness & Care</p>
              <h1 className="mt-5 font-display text-4xl leading-[1.05] text-[color:var(--color-text-primary)] md:text-6xl">
                Eye Care & <span className="italic text-gradient-brand">Maintenance Tips</span>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-[color:var(--color-text-secondary)] md:text-lg">
                Expert advice from our master opticians on maintaining your vision health and extending the lifespan of your luxury eyewear.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="mx-auto max-w-[1440px] px-4 md:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            {tips.map((t, idx) => (
              <ScrollReveal key={idx} delay={idx * 0.05}>
                <div className="rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8 shadow-sm h-full flex flex-col justify-between">
                  <div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl brand-gradient-soft text-[color:var(--color-brand-primary)]">
                      <Eye className="h-6 w-6" />
                    </div>
                    <h3 className="mt-6 font-display text-xl text-[color:var(--color-text-primary)]">{t.title}</h3>
                    <p className="mt-3 text-xs leading-6 text-[color:var(--color-text-secondary)]">{t.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
