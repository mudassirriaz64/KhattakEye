import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Truck, ShieldCheck, Clock, PackageCheck, MessageCircle } from "lucide-react";
import { Button } from "@/components/primitives/Button";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { ProductAccordion } from "@/components/product/ProductAccordion";
import axios from "@/lib/api/axios";

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
    region: "KPK & Balochistan Metros",
    cities: "Peshawar, Quetta, Abbottabad, Mardan",
    timeframe: "4 – 5 Business Days",
    cost: "FREE",
    badge: "Standard Express"
  },
  {
    region: "Rest of Pakistan / Remote",
    cities: "Gilgit-Baltistan, Azad Kashmir, Rural Tehsils",
    timeframe: "5 – 7 Business Days",
    cost: "FREE",
    badge: "Special Delivery"
  }
];

const shippingFaqs = [
  {
    id: "faq-1",
    title: "Do you offer Cash on Delivery (COD) across Pakistan?",
    content: "Yes! We offer 100% Cash on Delivery on all non-prescription frames and sunglasses nationwide. For prescription custom lenses or specialized orders, a minimum 50% advance payment is required per company policy before lens grinding begins."
  },
  {
    id: "faq-2",
    title: "How can I track my shipment once dispatched?",
    content: "As soon as your order is handed over to our courier partner (Leopard / TCS / M&P), you will receive an SMS and email notification with your tracking code. You can also track real-time progress on our website using your order number."
  },
  {
    id: "faq-3",
    title: "What happens if I am not available at the delivery address?",
    content: "Our courier rider will attempt delivery up to 2–3 times and will call your provided mobile number. If you are unavailable, you can request a re-delivery date or pick up your package from the nearest courier express center."
  },
  {
    id: "faq-4",
    title: "Can I inspect the parcel before paying the rider?",
    content: "Under standard courier regulations in Pakistan, riders cannot allow open-box inspection before cash collection. However, Khattak Eyewear guarantees a hassle-free 14-Day No-Questions-Asked Return & Replacement Policy if anything does not match your expectations after opening."
  }
];

export function ShippingPolicyPage() {
  const [waNumber, setWaNumber] = useState("923001234567");

  useEffect(() => {
    axios.get("/settings").then((res) => {
      if (res.data?.contact) {
        const raw = res.data.contact.whatsapp || res.data.contact.phone || "923001234567";
        setWaNumber(raw.replace(/[^0-9]/g, ""));
      }
    }).catch(() => {});
  }, []);

  return (
    <div className="bg-[color:var(--color-app-bg)] py-16 md:py-24">
      {/* Hero */}
      <section className="relative overflow-hidden pb-16">
        <div className="mx-auto max-w-[1440px] px-4 md:px-8">
          <div className="max-w-3xl">
            <ScrollReveal>
              <p className="editorial-eyebrow">Delivery & Fulfillment</p>
              <h1 className="mt-5 font-display text-4xl leading-[1.05] text-[color:var(--color-text-primary)] md:text-6xl">
                Nationwide <span className="italic text-gradient-brand">Express Shipping</span>
              </h1>
              <p className="mt-6 text-base leading-8 text-[color:var(--color-text-secondary)] md:text-lg">
                We deliver nationwide across Pakistan with premium express couriers. Every order is securely packaged in rigid shockproof casing to ensure your eyewear arrives in pristine condition.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="pb-16">
        <div className="mx-auto max-w-[1440px] px-4 md:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <ScrollReveal delay={0.05}>
              <div className="rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--color-brand-soft)]/20 text-[color:var(--color-brand-primary)]">
                  <Truck className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold text-[color:var(--color-text-primary)]">Free Express Shipping</h3>
                <p className="mt-2 text-xs leading-6 text-[color:var(--color-text-secondary)]">Complimentary shipping on all orders nationwide without any minimum spend requirement.</p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--color-brand-soft)]/20 text-[color:var(--color-brand-primary)]">
                  <Clock className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold text-[color:var(--color-text-primary)]">Fast Processing</h3>
                <p className="mt-2 text-xs leading-6 text-[color:var(--color-text-secondary)]">Standard frames ship within 24 hours. Custom prescription lenses crafted & inspected within 2–3 days.</p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <div className="rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--color-brand-soft)]/20 text-[color:var(--color-brand-primary)]">
                  <PackageCheck className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold text-[color:var(--color-text-primary)]">Protected Casing</h3>
                <p className="mt-2 text-xs leading-6 text-[color:var(--color-text-secondary)]">Includes signature hardshell leather case, micro-fiber cleaning cloth, and protective box.</p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--color-brand-soft)]/20 text-[color:var(--color-brand-primary)]">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold text-[color:var(--color-text-primary)]">Insured Transport</h3>
                <p className="mt-2 text-xs leading-6 text-[color:var(--color-text-secondary)]">100% insured against loss or damage in transit. Full free replacement provided immediately.</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Delivery Timelines Table */}
      <section className="pb-16">
        <div className="mx-auto max-w-[1440px] px-4 md:px-8">
          <ScrollReveal>
            <div className="rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8 md:p-12">
              <h2 className="font-display text-2xl text-[color:var(--color-text-primary)] md:text-3xl">Estimated Delivery Times</h2>
              <p className="mt-2 text-sm text-[color:var(--color-text-secondary)]">Estimated delivery windows after order dispatch across major regions in Pakistan.</p>

              <div className="mt-8 overflow-hidden rounded-2xl border border-[color:var(--color-border)]">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[color:var(--color-surface-muted)] text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--color-text-tertiary)]">
                    <tr>
                      <th className="px-6 py-4">Region</th>
                      <th className="px-6 py-4">Coverage Cities</th>
                      <th className="px-6 py-4">Est. Timeframe</th>
                      <th className="px-6 py-4">Shipping Fee</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[color:var(--color-border)]">
                    {deliveryRegions.map((row) => (
                      <tr key={row.region} className="transition-colors hover:bg-[color:var(--color-surface-muted)]/50">
                        <td className="px-6 py-4 font-semibold text-[color:var(--color-text-primary)]">
                          {row.region}
                          <span className="ml-2 inline-block rounded-md bg-[color:var(--color-brand-soft)]/20 px-2 py-0.5 text-[10px] font-semibold text-[color:var(--color-brand-primary)]">
                            {row.badge}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-[color:var(--color-text-secondary)]">{row.cities}</td>
                        <td className="px-6 py-4 font-medium text-[color:var(--color-text-primary)]">{row.timeframe}</td>
                        <td className="px-6 py-4 font-bold text-[color:var(--color-accent-teal)]">{row.cost}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="pb-16">
        <div className="mx-auto max-w-[1440px] px-4 md:px-8">
          <ScrollReveal>
            <div className="max-w-3xl">
              <h2 className="font-display text-2xl text-[color:var(--color-text-primary)] md:text-3xl">Shipping FAQs</h2>
              <p className="mt-2 text-sm text-[color:var(--color-text-secondary)]">Frequently asked questions regarding delivery, COD policies, and order tracking.</p>
              <div className="mt-8">
                <ProductAccordion items={shippingFaqs} />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA Help Banner */}
      <section>
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
                <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer">
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
