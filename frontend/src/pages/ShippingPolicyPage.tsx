import { Link } from "react-router-dom";
import { Truck, ShieldCheck, Clock, PackageCheck, MessageCircle } from "lucide-react";
import { Button } from "@/components/primitives/Button";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { ProductAccordion } from "@/components/product/ProductAccordion";

const deliveryRegions = [
  {
    region: "Major Metro Cities",
    cities: "Lahore, Karachi, Islamabad, Rawalpindi, Faisalabad",
    timeframe: "2 – 3 Business Days",
    cost: "FREE",
    badge: "Fastest Express"
  },
  {
    region: "Urban Punjab & Sindh",
    cities: "Multan, Sialkot, Gujranwala, Hyderabad, Sukkur",
    timeframe: "3 – 4 Business Days",
    cost: "FREE",
    badge: "Standard Express"
  },
  {
    region: "KPK, Balochistan & AJK",
    cities: "Peshawar, Quetta, Abbottabad, Muzaffarabad, Mardan",
    timeframe: "4 – 5 Business Days",
    cost: "FREE",
    badge: "Regional Express"
  },
  {
    region: "Remote & Rural Regions",
    cities: "All other postal codes nationwide",
    timeframe: "5 – 7 Business Days",
    cost: "FREE",
    badge: "Extended Coverage"
  }
];

const shippingFaqs = [
  {
    title: "How do I track my shipment?",
    content: "Once your order is processed and handed over to our courier partner (TCS / Leopards), you will receive an automated SMS and email containing your tracking tracking code. You can also track live status anytime on our <a href='/track-order' class='underline text-[color:var(--color-accent-teal)]'>Track Order page</a>."
  },
  {
    title: "Are there any shipping charges?",
    content: "We offer FREE nationwide express shipping across Pakistan on all orders. There are no hidden delivery fees or surcharge costs at checkout."
  },
  {
    title: "What happens if I am not available at the delivery address?",
    content: "Our courier partner will make up to three delivery attempts. They will call you prior to delivery. If you are unavailable, you can reschedule the delivery time or designate someone else to collect on your behalf."
  },
  {
    title: "What packaging is used to protect my eyewear during transit?",
    content: "Every frame is double-boxed inside a rigid hard-shell leather case, wrapped in protective bubble lining, and sealed within a tamper-proof Khattak Eyewear courier satchel to ensure 100% safe arrival."
  }
];

export function ShippingPolicyPage() {
  return (
    <div className="bg-[color:var(--color-app-bg)] min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-24">
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[color:var(--color-brand-soft)]/20 blur-3xl" />
        <div className="mx-auto max-w-[1440px] px-4 md:px-8">
          <div className="max-w-3xl">
            <ScrollReveal>
              <p className="editorial-eyebrow">Logistics & Fulfillment</p>
              <h1 className="mt-5 font-display text-4xl leading-[1.05] text-[color:var(--color-text-primary)] md:text-6xl">
                Shipping & <span className="italic text-gradient-brand">Delivery Policy</span>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-[color:var(--color-text-secondary)] md:text-lg">
                Complimentary nationwide express delivery delivered directly to your doorstep. Handcrafted, inspected, and shipped with white-glove care across Pakistan.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="pb-16">
        <div className="mx-auto max-w-[1440px] px-4 md:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <ScrollReveal delay={0.05}>
              <div className="flex h-full flex-col rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl brand-gradient-soft text-[color:var(--color-brand-primary)]">
                  <Truck className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-display text-xl text-[color:var(--color-text-primary)]">Free Nationwide Shipping</h3>
                <p className="mt-2 text-xs leading-6 text-[color:var(--color-text-secondary)]">
                  Complimentary express shipping on all orders with zero hidden delivery charges across Pakistan.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="flex h-full flex-col rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl brand-gradient-soft text-[color:var(--color-brand-primary)]">
                  <Clock className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-display text-xl text-[color:var(--color-text-primary)]">2–5 Business Days</h3>
                <p className="mt-2 text-xs leading-6 text-[color:var(--color-text-secondary)]">
                  Rapid fulfillment. Major metro cities receive packages within 48 to 72 hours of dispatch.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <div className="flex h-full flex-col rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl brand-gradient-soft text-[color:var(--color-brand-primary)]">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-display text-xl text-[color:var(--color-text-primary)]">100% Insured Transit</h3>
                <p className="mt-2 text-xs leading-6 text-[color:var(--color-text-secondary)]">
                  Every order is fully insured against theft, loss, or transit damage until signed at your door.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="flex h-full flex-col rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl brand-gradient-soft text-[color:var(--color-brand-primary)]">
                  <PackageCheck className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-display text-xl text-[color:var(--color-text-primary)]">Rigid Vault Packaging</h3>
                <p className="mt-2 text-xs leading-6 text-[color:var(--color-text-secondary)]">
                  Sealed in leather hard-shell cases with anti-scratch microfiber cloth and tamper-evident packaging.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Region Delivery Schedule */}
      <section className="py-12">
        <div className="mx-auto max-w-[1440px] px-4 md:px-8">
          <ScrollReveal>
            <div className="rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 md:p-10">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end mb-8">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-text-tertiary)]">Estimated Timelines</p>
                  <h2 className="mt-1 font-display text-2xl text-[color:var(--color-text-primary)] md:text-3xl">Delivery Schedule by Region</h2>
                </div>
                <p className="text-xs text-[color:var(--color-text-tertiary)]">Orders placed before 2:00 PM PKT dispatch same business day.</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {deliveryRegions.map((item, idx) => (
                  <div key={idx} className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] p-5">
                    <span className="rounded-full bg-[color:var(--color-accent-teal)]/10 px-2.5 py-0.5 text-[10px] font-semibold text-[color:var(--color-accent-teal)] uppercase tracking-wider">
                      {item.badge}
                    </span>
                    <h4 className="mt-3 font-display text-lg text-[color:var(--color-text-primary)]">{item.region}</h4>
                    <p className="mt-1 text-xs text-[color:var(--color-text-tertiary)]">{item.cities}</p>
                    <div className="mt-4 pt-3 border-t border-[color:var(--color-border)] flex justify-between items-center text-xs">
                      <span className="text-[color:var(--color-text-secondary)]">Est. Time:</span>
                      <span className="font-bold text-[color:var(--color-text-primary)]">{item.timeframe}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Shipping FAQs */}
      <section className="py-12">
        <div className="mx-auto max-w-[1440px] px-4 md:px-8">
          <ScrollReveal>
            <div className="mx-auto max-w-4xl">
              <h2 className="font-display text-2xl text-center text-[color:var(--color-text-primary)] md:text-3xl mb-8">Frequently Asked Questions</h2>
              <ProductAccordion items={shippingFaqs.map((faq) => ({
                title: faq.title,
                content: <p dangerouslySetInnerHTML={{ __html: faq.content }} className="text-xs leading-6 text-[color:var(--color-text-secondary)]" />
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
                <h3 className="font-display text-2xl md:text-3xl">Have questions about your delivery?</h3>
                <p className="mt-2 text-sm text-white/80 max-w-xl">
                  Our concierge team is available 6 days a week to assist you with order status, address modifications, or carrier tracking details.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 shrink-0">
                <Link to="/track-order">
                  <Button className="bg-white text-[color:var(--color-brand-primary)] hover:bg-white/90">
                    Track Order
                  </Button>
                </Link>
                <a href="https://wa.me/923001234567" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                    <MessageCircle className="h-4 w-4 mr-2" /> WhatsApp Concierge
                  </Button>
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
