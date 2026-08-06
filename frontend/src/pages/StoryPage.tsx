import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Compass, Heart } from "lucide-react";
import { Button } from "@/components/primitives/Button";
import { ScrollReveal } from "@/components/shared/ScrollReveal";

const milestones = [
  {
    year: "2018",
    title: "The First Frame",
    description: "Started on a single workbench in Lahore, driven by a desire to create premium, hand-finished eyewear that competes globally."
  },
  {
    year: "2020",
    title: "Italian Acetate Partnership",
    description: "Partnered with historic Italian block makers to source the finest premium organic acetates for our frames."
  },
  {
    year: "2022",
    title: "Virtual Try-On Launch",
    description: "Introduced our state-of-the-art AI virtual try-on, allowing wearers to find their perfect fit from anywhere in Pakistan."
  },
  {
    year: "2024",
    title: "The Titanium Atelier",
    description: "Opened our dedicated titanium studio, hand-assembling feather-light aerospace-grade titanium frames."
  }
];

export function StoryPage() {
  return (
    <div className="bg-[color:var(--color-app-bg)]">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[color:var(--color-brand-soft)]/20 blur-3xl" />
        <div className="mx-auto max-w-[1440px] px-4 md:px-8">
          <div className="max-w-3xl">
            <ScrollReveal>
              <p className="editorial-eyebrow">Our Story</p>
              <h1 className="mt-5 font-display text-4xl leading-[1.05] text-[color:var(--color-text-primary)] md:text-6xl">
                A legacy of sight, <span className="italic text-gradient-brand">built by hand</span>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-[color:var(--color-text-secondary)] md:text-lg">
                Khattak Eyewear was born out of a simple vision: to design and build the finest eyewear in Pakistan. What began as a small family project has grown into an independent design house, merging heritage craftsmanship with modern optical science.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Chapters */}
      <section className="py-16 md:py-24 bg-[color:var(--color-panel)] border-y border-[color:var(--color-border)]">
        <div className="mx-auto max-w-[1440px] px-4 md:px-8">
          <div className="grid gap-12 lg:grid-cols-3">
            <ScrollReveal className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--color-brand-soft)]/20 text-[color:var(--color-brand-primary)]">
                <Compass className="h-6 w-6" />
              </div>
              <h3 className="font-display text-2xl text-[color:var(--color-text-primary)]">Independent Path</h3>
              <p className="text-sm leading-7 text-[color:var(--color-text-secondary)]">
                We design every silhouette in-house, bypassing license holders and middlemen to bring you premium luxury directly from our ateliers.
              </p>
            </ScrollReveal>
            <ScrollReveal className="space-y-4" delay={0.1}>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--color-brand-soft)]/20 text-[color:var(--color-brand-primary)]">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="font-display text-2xl text-[color:var(--color-text-primary)]">Atelier Heritage</h3>
              <p className="text-sm leading-7 text-[color:var(--color-text-secondary)]">
                Our design processes take months of research and iteration, referencing vintage shapes and proportion metrics.
              </p>
            </ScrollReveal>
            <ScrollReveal className="space-y-4" delay={0.2}>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--color-brand-soft)]/20 text-[color:var(--color-brand-primary)]">
                <Heart className="h-6 w-6" />
              </div>
              <h3 className="font-display text-2xl text-[color:var(--color-text-primary)]"> লাহোরে তৈরি (Made in Lahore)</h3>
              <p className="text-sm leading-7 text-[color:var(--color-text-secondary)]">
                Our main workshop is located in Lahore, where master optical artisans finish every frame by hand, carrying forward a legacy of precision.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-[1440px] px-4 md:px-8">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <p className="editorial-eyebrow">Milestones</p>
            <h2 className="mt-3 font-display text-3xl md:text-5xl text-[color:var(--color-text-primary)]">Our Journey So Far</h2>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* Center line */}
            <div className="absolute left-1/2 top-0 h-full w-px bg-[color:var(--color-border-strong)] -translate-x-1/2 hidden md:block" />

            <div className="space-y-12 md:space-y-20">
              {milestones.map((m, index) => (
                <ScrollReveal key={m.year} className={`relative flex flex-col md:flex-row gap-6 md:gap-0 ${index % 2 === 1 ? "md:flex-row-reverse" : ""}`}>
                  <div className="md:w-1/2 md:px-12 flex items-center md:justify-end justify-start">
                    <span className="font-display text-5xl md:text-7xl font-bold text-[color:var(--color-brand-primary)]/30">{m.year}</span>
                  </div>
                  
                  {/* Point */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-[color:var(--color-brand-primary)] border-4 border-[color:var(--color-app-bg)] hidden md:block" />

                  <div className="md:w-1/2 md:px-12">
                    <h3 className="font-display text-xl font-semibold text-[color:var(--color-text-primary)]">{m.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-[color:var(--color-text-secondary)]">{m.description}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 text-center bg-[color:var(--color-panel)] border-t border-[color:var(--color-border)]">
        <div className="mx-auto max-w-[1440px] px-4 md:px-8">
          <h2 className="font-display text-3xl md:text-5xl text-[color:var(--color-text-primary)]">Experience the Craft</h2>
          <p className="mt-4 max-w-lg mx-auto text-sm text-[color:var(--color-text-secondary)]">Explore our collections, handcrafted from premium Italian acetates and Japanese titanium.</p>
          <div className="mt-8">
            <Link to="/shop">
              <Button variant="cta-lg" iconRight={<ArrowRight className="h-4 w-4" />}>Shop Collection</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
