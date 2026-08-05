import { Link } from "react-router-dom";
import { ShieldCheck, Lock, Eye, FileText, Database, UserCheck, MessageCircle } from "lucide-react";
import { Button } from "@/components/primitives/Button";
import { ScrollReveal } from "@/components/shared/ScrollReveal";

const privacySections = [
  {
    title: "Information We Collect",
    icon: Database,
    content: "We collect personal information necessary for completing your orders and personalizing your luxury eyewear experience. This includes your name, email address, phone number, shipping and billing addresses, and optical prescription details (if applicable)."
  },
  {
    title: "How We Use Your Data",
    icon: Eye,
    content: "Your data is strictly utilized to process transactions, dispatch shipments via courier partners, communicate order status updates, provide customer support, and send newsletter updates (only if opted in). We never sell your personal data to third parties."
  },
  {
    title: "Data Security & Encryption",
    icon: Lock,
    content: "We implement industry-standard 256-bit SSL encryption and strict database security protocols to protect your personal and payment details. Account access requires secure JWT authentication."
  },
  {
    title: "Your Rights & Control",
    icon: UserCheck,
    content: "You have full control over your personal data. You may request access to, correction of, or deletion of your personal account data at any time by contacting our privacy compliance team."
  }
];

export function PrivacyPolicyPage() {
  return (
    <div className="bg-[color:var(--color-app-bg)] min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-24">
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[color:var(--color-brand-soft)]/20 blur-3xl" />
        <div className="mx-auto max-w-[1440px] px-4 md:px-8">
          <div className="max-w-3xl">
            <ScrollReveal>
              <p className="editorial-eyebrow">Trust & Transparency</p>
              <h1 className="mt-5 font-display text-4xl leading-[1.05] text-[color:var(--color-text-primary)] md:text-6xl">
                Privacy <span className="italic text-gradient-brand">Policy</span>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-[color:var(--color-text-secondary)] md:text-lg">
                At Khattak Eyewear, your privacy and personal data protection are foundational to our commitment to luxury service.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-16">
        <div className="mx-auto max-w-[1440px] px-4 md:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            {privacySections.map((sec, idx) => (
              <ScrollReveal key={idx} delay={idx * 0.05}>
                <div className="flex h-full flex-col rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl brand-gradient-soft text-[color:var(--color-brand-primary)]">
                    <sec.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 font-display text-xl text-[color:var(--color-text-primary)]">{sec.title}</h3>
                  <p className="mt-3 text-xs leading-6 text-[color:var(--color-text-secondary)]">{sec.content}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={0.2}>
            <div className="mt-8 rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8">
              <h3 className="font-display text-xl text-[color:var(--color-text-primary)]">Cookies & Tracking</h3>
              <p className="mt-3 text-xs leading-6 text-[color:var(--color-text-secondary)]">
                We use cookies to maintain your shopping cart state, keep you securely logged in, and analyze site performance. You can disable cookies in your browser settings at any time, though some store features may require cookies for seamless functionality.
              </p>

              <h3 className="mt-6 font-display text-xl text-[color:var(--color-text-primary)]">Contacting Our Privacy Officer</h3>
              <p className="mt-2 text-xs leading-6 text-[color:var(--color-text-secondary)]">
                For questions or requests regarding your personal data under Pakistan data protection laws, please email <a href="mailto:privacy@khattak.com" className="underline text-[color:var(--color-accent-teal)]">privacy@khattak.com</a> or message our client concierge.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
