import { Link } from "react-router-dom";
import { ArrowRight, Cpu, Eye, Gem, PenTool } from "lucide-react";
import { Button } from "@/components/primitives/Button";
import { ScrollReveal } from "@/components/shared/ScrollReveal";

const steps = [
  {
    icon: PenTool,
    title: "1. Sculpting & Prototype",
    description: "Every frame begins as a physical pencil sketch in our Lahore studio, before being translated into detailed CAD drawings and structural prototypes."
  },
  {
    icon: Gem,
    title: "2. Meticulous Milling",
    description: "We cut organic Italian cellulose acetate sheets using precise CNC milling, yielding raw frame bases ready for refined shaping."
  },
  {
    icon: Cpu,
    title: "3. Aerospace Titanium Artistry",
    description: "Our metal frames utilize Japanese medical-grade titanium, laser-welded with absolute precision to create featherweight structures."
  },
  {
    icon: Eye,
    title: "4. Multi-Stage Tumbling & Polishing",
    description: "Frames spend up to 72 hours tumbling in organic wood chips and pumice, finished by hand-polishing on dynamic muslin wheels."
  }
];

export function CraftsmanshipPage() {
  return (
    <div className="bg-[color:var(--color-app-bg)]">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[color:var(--color-brand-soft)]/20 blur-3xl" />
        <div className="mx-auto max-w-[1440px] px-4 md:px-8">
          <div className="max-w-3xl">
            <ScrollReveal>
              <p className="editorial-eyebrow">Craftsmanship</p>
              <h1 className="mt-5 font-display text-4xl leading-[1.05] text-[color:var(--color-text-primary)] md:text-6xl">
                Precision you can feel, <span className="italic text-gradient-brand">refinement</span> in every line
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-[color:var(--color-text-secondary)] md:text-lg">
                At the core of Khattak Eyewear is our Lahore atelier. We treat eyewear as structural art, subjecting every individual frame to over 45 quality checks and days of manual polishing.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Steps Grid */}
      <section className="py-20 md:py-28 bg-[color:var(--color-panel)] border-y border-[color:var(--color-border)]">
        <div className="mx-auto max-w-[1440px] px-4 md:px-8">
          <div className="max-w-2xl mb-16">
            <p className="editorial-eyebrow">The Atelier Process</p>
            <h2 className="mt-3 font-display text-3xl md:text-5xl text-[color:var(--color-text-primary)]">How Our Frames Are Made</h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, idx) => (
              <ScrollReveal key={s.title} className="flex flex-col gap-4 rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-app-bg)] p-6 shadow-[var(--shadow-input)]" delay={idx * 0.08}>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--color-brand-soft)]/20 text-[color:var(--color-brand-primary)]">
                  <s.icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-xl text-[color:var(--color-text-primary)]">{s.title}</h3>
                <p className="text-sm leading-6 text-[color:var(--color-text-secondary)]">{s.description}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Detail Showcase */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-[1440px] px-4 md:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-6">
              <ScrollReveal>
                <div className="relative">
                  <div className="absolute -left-4 -top-4 h-full w-full rounded-[40px] bg-[color:var(--color-brand-soft)]/30" />
                  <img
                    src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=900&q=80"
                    alt="Polishing raw acetate frames"
                    className="relative aspect-[4/3] w-full rounded-[40px] border border-[color:var(--color-border)] object-cover shadow-[var(--shadow-strong)]"
                  />
                </div>
              </ScrollReveal>
            </div>
            <div className="lg:col-span-6 space-y-6">
              <ScrollReveal>
                <h2 className="font-display text-3xl md:text-5xl text-[color:var(--color-text-primary)]">Organic Italian Acetates</h2>
                <p className="mt-4 text-base leading-8 text-[color:var(--color-text-secondary)]">
                  We use organic cellulose acetate, derived from natural cotton fibers and wood pulp. Unlike petroleum-based plastics, organic acetate adapts to the warmth of your skin, developing a beautiful luster and offering hypoallergenic comfort that feels completely natural.
                </p>
                <div className="mt-8">
                  <Link to="/shop">
                    <Button variant="cta-lg" iconRight={<ArrowRight className="h-4 w-4" />}>Shop Acetate Frames</Button>
                  </Link>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
