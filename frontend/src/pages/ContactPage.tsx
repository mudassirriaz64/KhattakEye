import { useState } from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/primitives/Button";
import { TextField, TextAreaField, SelectField } from "@/components/primitives/FormControls";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { footerLinks } from "@/lib/landing-data";

const contactChannels = [
  {
    icon: Phone,
    title: "Call Us",
    detail: footerLinks.contact.phone,
    sub: "Mon–Sat, 10am–8pm PKT",
    href: `tel:${footerLinks.contact.phone}`,
  },
  {
    icon: Mail,
    title: "Email Us",
    detail: footerLinks.contact.email,
    sub: "We reply within 24 hours",
    href: `mailto:${footerLinks.contact.email}`,
  },
  {
    icon: MapPin,
    title: "Visit the Atelier",
    detail: footerLinks.contact.address,
    sub: "Walk-ins welcome",
    href: undefined,
  },
  {
    icon: Clock,
    title: "Hours",
    detail: "10:00 AM – 8:00 PM",
    sub: "Open Mon–Sat, closed Sunday",
    href: undefined,
  },
];

const inquiryTypes = [
  "General Question",
  "Order Support",
  "Shipping & Delivery",
  "Returns & Exchange",
  "Warranty",
  "Wholesale & Partnership",
  "Other",
];

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-[color:var(--color-app-bg)]">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-24">
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[color:var(--color-brand-soft)]/20 blur-3xl" />
        <div className="mx-auto max-w-[1440px] px-4 md:px-8">
          <div className="max-w-3xl">
            <ScrollReveal>
              <p className="editorial-eyebrow">Contact Us</p>
              <h1 className="mt-5 font-display text-4xl leading-[1.05] text-[color:var(--color-text-primary)] md:text-6xl">
                We'd love to <span className="italic text-gradient-brand">hear from you</span>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-[color:var(--color-text-secondary)] md:text-lg">
                Questions about an order, sizing, or lens options? Our concierge team is here to help —
                by phone, email, or at the atelier.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Contact Channels */}
      <section className="pb-20 md:pb-24">
        <div className="mx-auto max-w-[1440px] px-4 md:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {contactChannels.map((channel, index) => (
              <ScrollReveal key={channel.title} delay={index * 0.08}>
                <div className="flex h-full flex-col rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[color:var(--color-brand-primary)] hover:shadow-[var(--shadow-soft)]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl brand-gradient-soft text-[color:var(--color-brand-primary)]">
                    <channel.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-text-tertiary)]">
                    {channel.title}
                  </h3>
                  {channel.href ? (
                    <a
                      href={channel.href}
                      className="mt-2 text-sm font-medium text-[color:var(--color-text-primary)] transition-colors hover:text-[color:var(--color-brand-primary)]"
                    >
                      {channel.detail}
                    </a>
                  ) : (
                    <p className="mt-2 text-sm font-medium text-[color:var(--color-text-primary)]">{channel.detail}</p>
                  )}
                  <p className="mt-1 text-xs text-[color:var(--color-text-secondary)]">{channel.sub}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Form + Sidebar */}
      <section className="pb-20 md:pb-24">
        <div className="mx-auto max-w-[1440px] px-4 md:px-8">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <ScrollReveal>
                <div className="rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 md:p-10">
                  <SectionHeading
                    align="left"
                    eyebrow="Send a Message"
                    title="How can we help?"
                    description="Fill in the form below and our team will get back to you within one business day."
                  />
                  {submitted ? (
                    <div className="mt-10 rounded-2xl border border-[color:var(--color-success)]/30 bg-[color:var(--color-success)]/5 p-10 text-center">
                      <CheckCircle2 className="mx-auto h-12 w-12 text-[color:var(--color-success)]" />
                      <h3 className="mt-4 font-display text-2xl text-[color:var(--color-text-primary)]">
                        Message received!
                      </h3>
                      <p className="mt-2 text-sm leading-7 text-[color:var(--color-text-secondary)]">
                        Thank you for reaching out. Our concierge team will reply to you within 24 hours.
                      </p>
                      <Button
                        variant="outline"
                        className="mt-6"
                        onClick={() => setSubmitted(false)}
                      >
                        Send Another Message
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                      <div className="grid gap-5 sm:grid-cols-2">
                        <TextField label="Full Name" name="name" placeholder="Ahmed Khan" required />
                        <TextField label="Email Address" name="email" type="email" placeholder="you@example.com" required />
                      </div>
                      <div className="grid gap-5 sm:grid-cols-2">
                        <TextField label="Phone" name="phone" type="tel" placeholder="+92 300 0000000" />
                        <SelectField label="Inquiry Type" name="subject" defaultValue="General Question">
                          {inquiryTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </SelectField>
                      </div>
                      <TextAreaField
                        label="Message"
                        name="message"
                        placeholder="Tell us how we can help…"
                        className="min-h-40"
                        required
                      />
                      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                        <p className="text-xs leading-5 text-[color:var(--color-text-secondary)]">
                          By submitting, you agree to our privacy policy.
                        </p>
                        <Button type="submit" iconRight={<Send className="h-4 w-4" />}>
                          Send Message
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              </ScrollReveal>
            </div>

            <div className="lg:col-span-5">
              <div className="space-y-6">
                <ScrollReveal>
                  <div className="rounded-3xl brand-gradient p-8">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-white">
                      <MessageCircle className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 font-display text-2xl text-white">Prefer to chat?</h3>
                    <p className="mt-2 text-sm leading-7 text-white/80">
                      Our live chat and WhatsApp concierge are available during atelier hours for instant answers.
                    </p>
                    <Button className="mt-6 bg-white text-[color:var(--color-brand-primary)] hover:bg-white/90 hover:shadow-none">
                      Start a Chat
                    </Button>
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={0.08}>
                  <div className="rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8">
                    <h3 className="font-display text-xl text-[color:var(--color-text-primary)]">
                      Visit the Atelier
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-[color:var(--color-text-secondary)]">
                      {footerLinks.contact.address}
                    </p>
                    <div className="mt-6 overflow-hidden rounded-2xl border border-[color:var(--color-border)]">
                      <img
                        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=900&q=80"
                        alt="Khattak Eyewear atelier"
                        className="aspect-[16/9] w-full object-cover"
                      />
                    </div>
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={0.16}>
                  <div className="rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8">
                    <h3 className="font-display text-xl text-[color:var(--color-text-primary)]">Quick answers</h3>
                    <p className="mt-2 text-sm leading-7 text-[color:var(--color-text-secondary)]">
                      Most questions are answered in our help center — from shipping times to returns.
                    </p>
                    <Link to="/faqs" className="mt-4 inline-block">
                      <Button variant="outline">Browse FAQs</Button>
                    </Link>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
