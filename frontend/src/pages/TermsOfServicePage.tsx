import { ScrollReveal } from "@/components/shared/ScrollReveal";

const terms = [
  {
    title: "1. Acceptance of Terms",
    content: "By accessing or placing an order on Khattak Eyewear (khattakov.com), you agree to be bound by these Terms of Service, all applicable laws and regulations in Pakistan, and agree that you are responsible for compliance."
  },
  {
    title: "2. Product Availability & Pricing",
    content: "All frame prices are listed in Pakistani Rupees (PKR) and include applicable taxes. We reserve the right to update prices or discontinue products at any time without prior notice."
  },
  {
    title: "3. Orders & Payment",
    content: "Orders are subject to acceptance and verification. For online payments (Bank Transfer, JazzCash, EasyPaisa), orders are confirmed once payment verification is completed."
  },
  {
    title: "4. Intellectual Property",
    content: "All content on this website, including frame designs, imagery, brand marks, typography, and software, is the exclusive property of Khattak Eyewear."
  }
];

export function TermsOfServicePage() {
  return (
    <div className="bg-[color:var(--color-app-bg)] min-h-screen">
      <section className="relative overflow-hidden py-20 md:py-24">
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[color:var(--color-brand-soft)]/20 blur-3xl" />
        <div className="mx-auto max-w-[1440px] px-4 md:px-8">
          <div className="max-w-3xl">
            <ScrollReveal>
              <p className="editorial-eyebrow">Legal & Operating Guidelines</p>
              <h1 className="mt-5 font-display text-4xl leading-[1.05] text-[color:var(--color-text-primary)] md:text-6xl">
                Terms of <span className="italic text-gradient-brand">Service</span>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-[color:var(--color-text-secondary)] md:text-lg">
                Please review the terms and conditions governing your purchases and use of our online atelier.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="mx-auto max-w-[1440px] px-4 md:px-8">
          <div className="space-y-6 max-w-4xl mx-auto">
            {terms.map((t, i) => (
              <ScrollReveal key={i} delay={i * 0.05}>
                <div className="rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8">
                  <h3 className="font-display text-xl text-[color:var(--color-text-primary)]">{t.title}</h3>
                  <p className="mt-3 text-xs leading-6 text-[color:var(--color-text-secondary)]">{t.content}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
