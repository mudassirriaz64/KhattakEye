import { Link } from "react-router-dom";
import { ArrowRight, Gem, HeartHandshake, Eye, ScanFace } from "lucide-react";
import { Button } from "@/components/primitives/Button";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { stats, whyChooseUs } from "@/lib/landing-data";

const values = [
  {
    icon: Gem,
    title: "Craftsmanship",
    description:
      "Every frame passes 45+ quality checks and is finished by hand by master artisans with decades of optical experience.",
  },
  {
    icon: Eye,
    title: "Precision Optics",
    description:
      "German-engineered lenses with anti-reflective, scratch-resistant and blue-light filtering coatings on every pair.",
  },
  {
    icon: HeartHandshake,
    title: "Concierge Service",
    description:
      "Personal stylist consultations, home try-ons, and dedicated aftercare support long after your order arrives.",
  },
];

export function AboutPage() {
  return (
    <div className="bg-[color:var(--color-app-bg)]">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[color:var(--color-brand-soft)]/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-[color:var(--color-accent-teal)]/10 blur-3xl" />
        <div className="mx-auto max-w-[1440px] px-4 md:px-8">
          <div className="max-w-3xl">
            <ScrollReveal>
              <p className="editorial-eyebrow">About Khattak Eyewear</p>
              <h1 className="mt-5 font-display text-4xl leading-[1.05] text-[color:var(--color-text-primary)] md:text-6xl">
                Crafting clarity since the <span className="italic text-gradient-brand">very first pair</span>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-[color:var(--color-text-secondary)] md:text-lg">
                Khattak Eyewear is a Pakistani atelier built on a simple belief — that premium eyewear
                should be made for real people, not just runways. We combine Italian acetates, Japanese
                titanium, and German-engineered optics with hand-finished precision, right here in Lahore.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link to="/shop">
                  <Button variant="cta-lg" iconRight={<ArrowRight className="h-4 w-4" />}>
                    Shop the Collection
                  </Button>
                </Link>
                <Link to="/virtual-try-on">
                  <Button variant="outline" iconLeft={<ScanFace className="h-4 w-4" />}>
                    Try On Virtually
                  </Button>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-[color:var(--color-border)] bg-[color:var(--color-panel)]">
        <div className="mx-auto max-w-[1440px] px-4 md:px-8">
          <div className="grid grid-cols-2 divide-x divide-[color:var(--color-border)] lg:grid-cols-4">
            {stats.map((stat) => (
              <ScrollReveal key={stat.label} className="py-10 text-center md:py-14">
                <p className="font-display text-4xl font-semibold text-gradient-brand md:text-5xl">
                  {stat.value}
                  {stat.suffix}
                </p>
                <p className="mt-2 text-xs font-medium uppercase tracking-[0.22em] text-[color:var(--color-text-tertiary)]">
                  {stat.label}
                </p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-[1440px] px-4 md:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-6">
              <ScrollReveal>
                <div className="relative">
                  <div className="absolute -left-4 -top-4 h-full w-full rounded-[40px] bg-[color:var(--color-brand-soft)]/30" />
                  <img
                    src="https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=900&q=80"
                    alt="Hand-finished eyewear craftsmanship"
                    className="relative aspect-[4/3] w-full rounded-[40px] border border-[color:var(--color-border)] object-cover shadow-[var(--shadow-strong)]"
                  />
                </div>
              </ScrollReveal>
            </div>
            <div className="lg:col-span-6">
              <SectionHeading
                align="left"
                eyebrow="Our Story"
                title="From a single workshop to a national obsession"
                description="What began as a family workshop in Lahore has grown into a movement for honest, beautifully made eyewear — without the luxury markup."
              />
              <div className="mt-8 space-y-6">
                {[
                  {
                    title: "The beginning",
                    text: "Founded on the belief that Pakistan deserves world-class optical craftsmanship, we started by hand-assembling frames in small batches and selling them frame by frame.",
                  },
                  {
                    title: "The craft",
                    text: "We source premium acetates from Italy and titanium from Japan, then shape, polish, and test each pair through 45+ quality checks before it reaches your door.",
                  },
                  {
                    title: "The promise",
                    text: "Direct-to-customer pricing, a 2-year warranty, and a 14-day return guarantee — so buying premium eyewear never feels like a gamble.",
                  },
                ].map((block, index) => (
                  <ScrollReveal key={block.title} delay={index * 0.1}>
                    <div className="flex gap-5">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl brand-gradient-soft text-[color:var(--color-brand-primary)]">
                        <span className="font-display text-sm font-semibold">{String(index + 1).padStart(2, "0")}</span>
                      </div>
                      <div>
                        <h3 className="font-display text-lg text-[color:var(--color-text-primary)]">{block.title}</h3>
                        <p className="mt-1 text-sm leading-7 text-[color:var(--color-text-secondary)]">{block.text}</p>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-[color:var(--color-panel)] py-20 md:py-28">
        <div className="mx-auto max-w-[1440px] px-4 md:px-8">
          <SectionHeading
            eyebrow="Why Khattak"
            title="Built different, on purpose"
            description="Every detail of our frames and service is a deliberate choice — from the materials we import to the way we treat every customer."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {whyChooseUs.map((item, index) => (
              <ScrollReveal key={item.title} delay={index * 0.08}>
                <div className="group h-full rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-app-bg)] p-8 transition-all duration-300 hover:-translate-y-1 hover:border-[color:var(--color-brand-primary)] hover:shadow-[var(--shadow-soft)]">
                  <h3 className="font-display text-xl text-[color:var(--color-text-primary)] group-hover:text-[color:var(--color-brand-primary)]">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[color:var(--color-text-secondary)]">{item.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-[1440px] px-4 md:px-8">
          <SectionHeading
            eyebrow="What We Stand For"
            title="Values that shape every pair"
            description="Three commitments guide everything we make, sell, and promise."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {values.map((value, index) => (
              <ScrollReveal key={value.title} delay={index * 0.1}>
                <div className="flex h-full flex-col rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl brand-gradient-soft text-[color:var(--color-brand-primary)]">
                    <value.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 font-display text-xl text-[color:var(--color-text-primary)]">{value.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[color:var(--color-text-secondary)]">{value.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20 md:pb-28">
        <div className="mx-auto max-w-[1440px] px-4 md:px-8">
          <ScrollReveal>
            <div className="relative overflow-hidden rounded-[40px] brand-gradient p-10 text-center md:p-16">
              <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-black/10 blur-3xl" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/70">Ready when you are</p>
              <h2 className="mx-auto mt-4 max-w-xl font-display text-3xl leading-tight text-white md:text-5xl">
                Experience eyewear that feels as good as it looks
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-white/80 md:text-base">
                Browse the collection or try on frames virtually from the comfort of your home.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link to="/shop">
                  <Button className="bg-white text-[color:var(--color-brand-primary)] hover:bg-white/90 hover:shadow-none">
                    Shop the Collection
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button className="border border-white/40 bg-transparent text-white hover:bg-white/10 hover:shadow-none">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
