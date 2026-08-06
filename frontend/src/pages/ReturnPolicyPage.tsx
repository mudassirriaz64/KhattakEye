import { Link } from "react-router-dom";
import { RotateCcw, ShieldCheck, RefreshCw, CheckCircle2, AlertCircle, MessageCircle } from "lucide-react";
import { Button } from "@/components/primitives/Button";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { ProductAccordion } from "@/components/product/ProductAccordion";

const steps = [
  {
    step: "01",
    title: "Initiate Request",
    desc: "Contact our concierge team via WhatsApp (+92 300 1234567) or email with your Order Number and preferred action (Return or Exchange)."
  },
  {
    step: "02",
    title: "Complimentary Doorstep Pickup",
    desc: "We schedule a free courier pickup from your address. Place the unworn frames inside their original hard leather case and box."
  },
  {
    step: "03",
    title: "Swift Inspection & Refund",
    desc: "Once received at our atelier, our artisans inspect the item within 24 hours. Your refund or replacement is dispatched immediately."
  }
];

const returnFaqs = [
  {
    title: "What is the return window?",
    content: "You have 14 calendar days from the date of delivery to request a return or style exchange."
  },
  {
    title: "Are prescription custom lenses eligible for returns?",
    content: "Frames can be exchanged or returned for a 100% refund. For custom prescription lenses crafted specifically to your optical optical formula, a standard 20% lens lab processing fee applies if returning for a cash refund, or 100% store credit towards a replacement frame."
  },
  {
    title: "How long does a bank or mobile wallet refund take?",
    content: "Refunds are processed to your original payment method (Bank Transfer, JazzCash, EasyPaisa, or Cash on Delivery refund bank account) within 3 to 5 business days after quality inspection."
  },
  {
    title: "Can I exchange for a different color or frame style?",
    content: "Absolutely! Exchanges are 100% complimentary. If the replacement frame is higher in value, you can pay the difference; if lower, we refund the balance."
  }
];

export function ReturnPolicyPage() {
  return (
    <div className="bg-[color:var(--color-app-bg)] min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-24">
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[color:var(--color-brand-soft)]/20 blur-3xl" />
        <div className="mx-auto max-w-[1440px] px-4 md:px-8">
          <div className="max-w-3xl">
            <ScrollReveal>
              <p className="editorial-eyebrow">Risk-Free Guarantee</p>
              <h1 className="mt-5 font-display text-4xl leading-[1.05] text-[color:var(--color-text-primary)] md:text-6xl">
                Return & <span className="italic text-gradient-brand">Exchange Policy</span>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-[color:var(--color-text-secondary)] md:text-lg">
                Try your frames comfortably at home. If you're not completely in love, return or exchange them within 14 days — no questions asked.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Guarantee Cards */}
      <section className="pb-16">
        <div className="mx-auto max-w-[1440px] px-4 md:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <ScrollReveal delay={0.05}>
              <div className="flex h-full flex-col rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl brand-gradient-soft text-[color:var(--color-brand-primary)]">
                  <RotateCcw className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-display text-xl text-[color:var(--color-text-primary)]">14-Day Open Window</h3>
                <p className="mt-2 text-xs leading-6 text-[color:var(--color-text-secondary)]">
                  Full 14 calendar days from delivery date to decide if the frames fit your personal style.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="flex h-full flex-col rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl brand-gradient-soft text-[color:var(--color-brand-primary)]">
                  <RefreshCw className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-display text-xl text-[color:var(--color-text-primary)]">Free Doorstep Pickup</h3>
                <p className="mt-2 text-xs leading-6 text-[color:var(--color-text-secondary)]">
                  Zero hassle. Our courier collects the return package directly from your home address.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <div className="flex h-full flex-col rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl brand-gradient-soft text-[color:var(--color-brand-primary)]">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-display text-xl text-[color:var(--color-text-primary)]">100% Full Refund</h3>
                <p className="mt-2 text-xs leading-6 text-[color:var(--color-text-secondary)]">
                  No hidden restocking fees. Full monetary reimbursement sent to your bank or wallet.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="flex h-full flex-col rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl brand-gradient-soft text-[color:var(--color-brand-primary)]">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-display text-xl text-[color:var(--color-text-primary)]">Seamless Swap</h3>
                <p className="mt-2 text-xs leading-6 text-[color:var(--color-text-secondary)]">
                  Want a different color, size, or style? Complimentarily exchanged with priority processing.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 3-Step Process */}
      <section className="py-12">
        <div className="mx-auto max-w-[1440px] px-4 md:px-8">
          <ScrollReveal>
            <div className="rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 md:p-12">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-brand-primary)]">Simple Workflow</p>
                <h2 className="mt-2 font-display text-3xl text-[color:var(--color-text-primary)] md:text-4xl">How Returns & Exchanges Work</h2>
              </div>

              <div className="grid gap-8 md:grid-cols-3">
                {steps.map((item, idx) => (
                  <div key={idx} className="relative rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] p-6">
                    <span className="font-mono text-3xl font-bold text-[color:var(--color-accent-teal)]">{item.step}</span>
                    <h4 className="mt-3 font-display text-xl text-[color:var(--color-text-primary)]">{item.title}</h4>
                    <p className="mt-2 text-xs leading-6 text-[color:var(--color-text-secondary)]">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Eligibility Guidelines */}
      <section className="py-12">
        <div className="mx-auto max-w-[1440px] px-4 md:px-8">
          <ScrollReveal>
            <div className="rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 md:p-10 grid md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-600 uppercase tracking-wider">
                  Guidelines
                </span>
                <h3 className="mt-4 font-display text-2xl text-[color:var(--color-text-primary)] md:text-3xl">Conditions for Eligible Returns</h3>
                <p className="mt-3 text-xs leading-6 text-[color:var(--color-text-secondary)]">
                  To ensure a smooth return process and rapid refund dispatch, please confirm your item meets the following standard criteria:
                </p>
                <ul className="mt-4 space-y-2.5 text-xs text-[color:var(--color-text-primary)]">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> Frames must be unworn, scratch-free, and unaltered.</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> Includes original leather case, microfiber cloth, and warranty card.</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> Intact original Khattak packaging & security tag.</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> Submitted within 14 days of delivery arrival.</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 text-left">
                <div className="flex items-center gap-2 text-amber-700 font-bold text-sm">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  Important Note for Custom Lenses
                </div>
                <p className="mt-3 text-xs leading-6 text-[color:var(--color-text-secondary)]">
                  Because prescription lenses are custom-ground to individual doctor specifications, custom prescription lenses themselves carry a modest 20% lab processing fee upon cash refund. Full store credit is always provided for exchanges!
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Return FAQs */}
      <section className="py-12">
        <div className="mx-auto max-w-[1440px] px-4 md:px-8">
          <ScrollReveal>
            <div className="mx-auto max-w-4xl">
              <h2 className="font-display text-2xl text-center text-[color:var(--color-text-primary)] md:text-3xl mb-8">Return FAQs</h2>
              <ProductAccordion items={returnFaqs.map((faq) => ({
                title: faq.title,
                content: <p className="text-xs leading-6 text-[color:var(--color-text-secondary)]">{faq.content}</p>
              }))} />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Support Banner */}
      <section className="py-16">
        <div className="mx-auto max-w-[1440px] px-4 md:px-8">
          <ScrollReveal>
            <div className="rounded-3xl brand-gradient p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="font-display text-2xl md:text-3xl">Need help with a return or exchange?</h3>
                <p className="mt-2 text-sm text-white/80 max-w-xl">
                  Message our client concierge on WhatsApp with your Order Number for instant resolution and free courier pickup booking.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 shrink-0">
                <a href="https://wa.me/923001234567?text=Hello%20Khattak%20Eyewear,%20I%20would%20like%20to%20request%20a%20return/exchange" target="_blank" rel="noopener noreferrer">
                  <Button className="bg-white text-[color:var(--color-brand-primary)] hover:bg-white/90">
                    <MessageCircle className="h-4 w-4 mr-2" /> Start Return via WhatsApp
                  </Button>
                </a>
                <Link to="/contact">
                  <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
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
