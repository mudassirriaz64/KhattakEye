import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/primitives/Button";
import { TextField, TextAreaField, SelectField } from "@/components/primitives/FormControls";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import axios from "@/lib/api/axios";

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
  const [contactInfo, setContactInfo] = useState({
    phone: "+92 300 1234567",
    email: "hello@khattakeye.com",
    address: "57-E, Gulberg III, Lahore, Pakistan",
    whatsapp: "923001234567",
    hours: "10:00 AM – 8:00 PM (Mon–Sat)"
  });

  useEffect(() => {
    axios.get("/settings").then((res) => {
      if (res.data?.contact) {
        const c = res.data.contact;
        setContactInfo({
          phone: c.phone || "+92 300 1234567",
          email: c.email || "hello@khattakeye.com",
          address: c.address || "57-E, Gulberg III, Lahore, Pakistan",
          whatsapp: (c.whatsapp || c.phone || "923001234567").replace(/[^0-9]/g, ""),
          hours: c.hours || "10:00 AM – 8:00 PM (Mon–Sat)"
        });
      }
    }).catch(() => {});
  }, []);

  const contactChannels = [
    {
      icon: Phone,
      title: "Call Us",
      detail: contactInfo.phone,
      sub: "Mon–Sat, 10am–8pm PKT",
      href: `tel:${contactInfo.phone}`,
    },
    {
      icon: Mail,
      title: "Email Us",
      detail: contactInfo.email,
      sub: "We reply within 24 hours",
      href: `mailto:${contactInfo.email}`,
    },
    {
      icon: MapPin,
      title: "Visit the Atelier",
      detail: contactInfo.address,
      sub: "Walk-ins welcome",
      href: undefined,
    },
    {
      icon: Clock,
      title: "Hours",
      detail: contactInfo.hours,
      sub: "Open Mon–Sat, closed Sunday",
      href: undefined,
    },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const body = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    try {
      await axios.post("/contact", body);
      setSubmitted(true);
    } catch (err) {
      console.error("Contact submission error:", err);
    }
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
                <div className="group relative h-full overflow-hidden rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8 transition-all duration-300 hover:border-[color:var(--color-brand-soft)] hover:shadow-xl">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--color-brand-soft)]/20 text-[color:var(--color-brand-primary)]">
                    <channel.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 font-display text-lg text-[color:var(--color-text-primary)]">{channel.title}</h3>
                  {channel.href ? (
                    <a href={channel.href} className="mt-2 block font-medium text-[color:var(--color-text-primary)] transition-colors hover:text-[color:var(--color-brand-primary)]">
                      {channel.detail}
                    </a>
                  ) : (
                    <p className="mt-2 font-medium text-[color:var(--color-text-primary)]">{channel.detail}</p>
                  )}
                  <p className="mt-1 text-xs text-[color:var(--color-text-tertiary)]">{channel.sub}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Form & Map Section */}
      <section className="pb-24">
        <div className="mx-auto max-w-[1440px] px-4 md:px-8">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <ScrollReveal>
                <div className="rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8 md:p-12">
                  <h2 className="font-display text-2xl text-[color:var(--color-text-primary)] md:text-3xl">Send us a message</h2>
                  <p className="mt-2 text-sm text-[color:var(--color-text-secondary)]">Fill out the form below and our customer concierge team will respond within 24 hours.</p>

                  {submitted ? (
                    <div className="mt-8 rounded-2xl bg-emerald-500/10 p-8 text-center text-emerald-600">
                      <CheckCircle2 className="mx-auto h-12 w-12" />
                      <h3 className="mt-4 font-display text-xl font-semibold">Message Received</h3>
                      <p className="mt-2 text-sm">Thank you for reaching out. We have received your inquiry and will get back to you shortly.</p>
                      <Button variant="outline" className="mt-6" onClick={() => setSubmitted(false)}>Send Another Message</Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                      <div className="grid gap-6 sm:grid-cols-2">
                        <TextField label="Your Name" name="name" required placeholder="Ayesha Khan" />
                        <TextField label="Email Address" name="email" type="email" required placeholder="ayesha@example.com" />
                      </div>

                      <div className="grid gap-6 sm:grid-cols-2">
                        <TextField label="Phone Number" name="phone" placeholder="+92 300 1234567" />
                        <SelectField label="Inquiry Type" name="subject">
                          {inquiryTypes.map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </SelectField>
                      </div>

                      <TextAreaField label="Message" name="message" required rows={5} placeholder="How can we help you today?" />

                      <Button type="submit" variant="primary" iconRight={<Send className="h-4 w-4" />} className="w-full sm:w-auto">
                        Send Message
                      </Button>
                    </form>
                  )}
                </div>
              </ScrollReveal>
            </div>

            <div className="lg:col-span-5">
              <div className="space-y-8">
                <ScrollReveal>
                  <div className="rounded-3xl bg-[color:var(--color-brand-primary)] p-8 text-white">
                    <h3 className="mt-4 font-display text-2xl text-white">Prefer to chat?</h3>
                    <p className="mt-2 text-sm leading-7 text-white/80">Our live chat and WhatsApp concierge are available during atelier hours for instant answers.</p>
                    <a href={`https://wa.me/${contactInfo.whatsapp}`} target="_blank" rel="noopener noreferrer">
                      <Button className="mt-6 bg-white text-[color:var(--color-brand-primary)] hover:bg-white/90 hover:shadow-none">Start WhatsApp Chat</Button>
                    </a>
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={0.08}>
                  <div className="rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8">
                    <h3 className="font-display text-xl text-[color:var(--color-text-primary)]">Visit the Atelier</h3>
                    <p className="mt-3 text-sm leading-7 text-[color:var(--color-text-secondary)]">{contactInfo.address}</p>
                    <div className="mt-6 overflow-hidden rounded-2xl border border-[color:var(--color-border)] aspect-[16/9] w-full">
                      <iframe
                        title="Khattak Eyewear Atelier Location"
                        src={`https://maps.google.com/maps?q=${encodeURIComponent(contactInfo.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                        className="h-full w-full border-0"
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={0.16}>
                  <div className="rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8">
                    <h3 className="font-display text-xl text-[color:var(--color-text-primary)]">Quick answers</h3>
                    <p className="mt-2 text-sm leading-7 text-[color:var(--color-text-secondary)]">Most questions are answered in our help center — from shipping times to returns.</p>
                    <Link to="/faqs" className="mt-4 inline-block"><Button variant="outline">Browse FAQs</Button></Link>
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
