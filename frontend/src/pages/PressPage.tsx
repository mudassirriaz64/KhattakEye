import { ArrowRight, Download, Link2, Newspaper } from "lucide-react";
import { ScrollReveal } from "@/components/shared/ScrollReveal";

const pressReleases = [
  {
    date: "May 12, 2026",
    outlet: "Dawn Style",
    title: "Khattak Eyewear Unveils New High-Precision Titanium Line",
    description: "Lahore's premier optical design studio launches its third collection, constructed entirely from Japanese aerospace-grade titanium.",
    url: "#"
  },
  {
    date: "March 20, 2026",
    outlet: "The Tribune Life",
    title: "How Khattak Eyewear is Reclaiming Luxury Craftsmanship in Pakistan",
    description: "An in-depth look inside Khattak Atelier's workshop, where every frame goes through 45 manual finishing steps.",
    url: "#"
  },
  {
    date: "Jan 15, 2026",
    outlet: "Images Magazine",
    title: "Atelier Aesthetics: Behind Khattak's New Virtual Try-On Fitting Engine",
    description: "Using high-fidelity AI face mapping to deliver virtual fitting sessions directly to Pakistani digital consumers.",
    url: "#"
  }
];

export function PressPage() {
  return (
    <div className="bg-[color:var(--color-app-bg)]">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[color:var(--color-brand-soft)]/20 blur-3xl" />
        <div className="mx-auto max-w-[1440px] px-4 md:px-8">
          <div className="max-w-3xl">
            <ScrollReveal>
              <p className="editorial-eyebrow">Press Room</p>
              <h1 className="mt-5 font-display text-4xl leading-[1.05] text-[color:var(--color-text-primary)] md:text-6xl">
                Stories from <span className="italic text-gradient-brand">the news</span>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-[color:var(--color-text-secondary)] md:text-lg">
                View our latest company announcements, editorial feature stories, brand imagery assets, and press resources.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Press Coverage */}
      <section className="py-20 bg-[color:var(--color-panel)] border-y border-[color:var(--color-border)]">
        <div className="mx-auto max-w-[1440px] px-4 md:px-8">
          <div className="max-w-xl mb-12">
            <p className="editorial-eyebrow">Announcements</p>
            <h2 className="mt-3 font-display text-3xl md:text-5xl text-[color:var(--color-text-primary)]">Latest Coverage</h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {pressReleases.map((pr, idx) => (
              <ScrollReveal key={pr.title} className="flex flex-col justify-between rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-app-bg)] p-6 shadow-[var(--shadow-input)] transition-all hover:shadow-[var(--shadow-soft)]" delay={idx * 0.08}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-[color:var(--color-text-tertiary)] font-medium">
                    <span>{pr.date}</span>
                    <span className="flex items-center gap-1"><Newspaper className="h-3.5 w-3.5" />{pr.outlet}</span>
                  </div>
                  <h3 className="font-display text-xl text-[color:var(--color-text-primary)] leading-tight">{pr.title}</h3>
                  <p className="text-sm leading-6 text-[color:var(--color-text-secondary)]">{pr.description}</p>
                </div>
                <a href={pr.url} onClick={e => e.preventDefault()} className="group mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-[color:var(--color-brand-primary)]">
                  Read Article
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </a>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Media Assets */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-[1440px] px-4 md:px-8">
          <div className="max-w-xl mb-12">
            <p className="editorial-eyebrow">Press Assets</p>
            <h2 className="mt-3 font-display text-3xl md:text-5xl text-[color:var(--color-text-primary)]">Brand Kit Resources</h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <ScrollReveal className="flex items-center justify-between p-6 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] shadow-[var(--shadow-soft)]">
              <div>
                <h4 className="font-semibold text-sm">Media Press Pack (PDF)</h4>
                <p className="text-xs text-[color:var(--color-text-secondary)] mt-1">Company history, milestones, and frame specs.</p>
              </div>
              <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--color-brand-soft)]/20 text-[color:var(--color-brand-primary)] hover:bg-[color:var(--color-brand-primary)] hover:text-white transition-colors">
                <Download className="h-4.5 w-4.5" />
              </button>
            </ScrollReveal>
            <ScrollReveal className="flex items-center justify-between p-6 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] shadow-[var(--shadow-soft)]" delay={0.1}>
              <div>
                <h4 className="font-semibold text-sm">High-Resolution Ateliers Kit</h4>
                <p className="text-xs text-[color:var(--color-text-secondary)] mt-1">Logo assets, artisan studio photos, and model catalogs.</p>
              </div>
              <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--color-brand-soft)]/20 text-[color:var(--color-brand-primary)] hover:bg-[color:var(--color-brand-primary)] hover:text-white transition-colors">
                <Download className="h-4.5 w-4.5" />
              </button>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
}
