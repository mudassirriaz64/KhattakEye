import { useState } from "react";
import { ArrowRight, Briefcase, MapPin, Search } from "lucide-react";
import { Button } from "@/components/primitives/Button";
import { ScrollReveal } from "@/components/shared/ScrollReveal";

const jobs = [
  {
    title: "Senior Optical Artisan",
    department: "Workshop & Assembly",
    location: "Lahore, Pakistan",
    type: "Full-Time",
    description: "Lead our hand-polishing and final assembly lines. Requires 5+ years of experience with precision optical craftsmanship."
  },
  {
    title: "Product Designer (Eyewear)",
    department: "Design Studio",
    location: "Lahore, Pakistan (Hybrid)",
    type: "Full-Time",
    description: "Translate sketch concepts into CAD data, working with acetates and titanium construction. Optical design experience preferred."
  },
  {
    title: "Retail Styling Specialist",
    department: "Customer Experience",
    location: "Lahore, Pakistan",
    type: "Full-Time",
    description: "Help customers discover their ideal silhouettes in our styling suites and virtually. Passion for style and optics is required."
  }
];

export function CareersPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", resume: "" });

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name && form.email) {
      setSubmitted(true);
    }
  };

  return (
    <div className="bg-[color:var(--color-app-bg)]">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[color:var(--color-brand-soft)]/20 blur-3xl" />
        <div className="mx-auto max-w-[1440px] px-4 md:px-8">
          <div className="max-w-3xl">
            <ScrollReveal>
              <p className="editorial-eyebrow">Careers</p>
              <h1 className="mt-5 font-display text-4xl leading-[1.05] text-[color:var(--color-text-primary)] md:text-6xl">
                Shape the future of <span className="italic text-gradient-brand">optical design</span>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-[color:var(--color-text-secondary)] md:text-lg">
                Join an independent studio dedicated to modern eyewear design, precision craftsmanship, and high-fidelity customer care. We are always looking for visionary designers, master makers, and style specialists.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Jobs Grid */}
      <section className="py-20 bg-[color:var(--color-panel)] border-y border-[color:var(--color-border)]">
        <div className="mx-auto max-w-[1440px] px-4 md:px-8">
          <div className="max-w-xl mb-12">
            <p className="editorial-eyebrow">Open Opportunities</p>
            <h2 className="mt-3 font-display text-3xl md:text-5xl text-[color:var(--color-text-primary)]">Current Openings</h2>
          </div>

          <div className="grid gap-6">
            {jobs.map((job) => (
              <ScrollReveal key={job.title} className="flex flex-col md:flex-row md:items-center justify-between gap-6 rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-app-bg)] p-8 shadow-[var(--shadow-input)] transition-all hover:shadow-[var(--shadow-soft)]">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-[color:var(--color-brand-soft)]/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[color:var(--color-brand-primary)]">{job.department}</span>
                    <span className="flex items-center gap-1 text-xs text-[color:var(--color-text-tertiary)]"><MapPin className="h-3.5 w-3.5" />{job.location}</span>
                  </div>
                  <h3 className="font-display text-2xl text-[color:var(--color-text-primary)]">{job.title}</h3>
                  <p className="text-sm text-[color:var(--color-text-secondary)] max-w-xl">{job.description}</p>
                </div>
                <button onClick={() => {
                  const el = document.getElementById("apply-form");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }} className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-[color:var(--color-brand-primary)] px-6 py-3.5 text-xs font-semibold text-white shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--glow-brand)]">
                  Apply Now
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="apply-form" className="py-20 md:py-28">
        <div className="mx-auto max-w-[1440px] px-4 md:px-8">
          <div className="max-w-xl mx-auto rounded-[32px] border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8 shadow-[var(--shadow-strong)]">
            <h3 className="font-display text-3xl text-center text-[color:var(--color-text-primary)]">Submit Application</h3>
            <p className="mt-2 text-center text-sm text-[color:var(--color-text-secondary)] mb-6">Send us your portfolio or resume to join the talent pool.</p>

            {submitted ? (
              <div className="text-center py-10 text-[color:var(--color-brand-primary)] font-semibold">
                ✓ Thank you for applying! Our talent team will review your application soon.
              </div>
            ) : (
              <form onSubmit={handleApply} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-secondary)]">Name</label>
                  <input required type="text" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name" className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-secondary)]">Email</label>
                  <input required type="email" value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} placeholder="Your email address" className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-secondary)]">Resume / Portfolio Link</label>
                  <input required type="url" value={form.resume} onChange={(e) => setForm(f => ({ ...f, resume: e.target.value }))} placeholder="Link to document or website" className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm" />
                </div>
                <button type="submit" className="w-full justify-center group inline-flex items-center gap-2 rounded-2xl bg-[color:var(--color-brand-primary)] px-6 py-4 text-xs font-semibold text-white shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5">
                  Submit Application
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
