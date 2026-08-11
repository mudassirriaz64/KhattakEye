import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, HeadphonesIcon } from "lucide-react";
import { Button } from "@/components/primitives/Button";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ProductAccordion } from "@/components/product/ProductAccordion";
import axios from "@/lib/api/axios";

type FaqItem = {
  q: string;
  a: string;
};

type FaqGroup = {
  title: string;
  items: FaqItem[];
};

const defaultFaqGroups: FaqGroup[] = [
  {
    title: "Products & Sizing",
    items: [
      {
        q: "How do I find my frame size?",
        a: "Check the inside of your current frames for measurements (e.g., 52-18-145). The first number is lens width, the second is bridge width, and the third is temple length. You can also use our virtual try-on or message our stylists for a recommendation.",
      },
      {
        q: "Do you offer prescription lenses?",
        a: "Yes. Most of our frames can be fitted with prescription lenses. Simply choose SELECT LENSES on the product page and follow the instructions, or contact our team and we'll guide you through the process.",
      },
      {
        q: "What materials are your frames made from?",
        a: "We use Italian acetates, Japanese titanium, and stainless steel, finished with German-engineered lens coatings. Each frame passes 45+ quality checks before shipping.",
      },
      {
        q: "How do I take care of my lenses?",
        a: "Clean with a microfiber cloth and lens-safe spray only. Avoid paper towels and household cleaners, which can scratch the coatings. Store frames in the included hard case when not in use.",
      },
    ],
  },
  {
    title: "Orders & Payments",
    items: [
      {
        q: "What payment methods do you accept?",
        a: "We accept Bank Transfer, JazzCash, EasyPaisa, and Cash on Delivery. For online payments, use the transaction ID from your payment app at checkout.",
      },
      {
        q: "How do I use a coupon code?",
        a: "Enter your coupon code in the 'Coupon' field at checkout. The discount will be applied to your order total automatically. Only one code can be used per order.",
      },
      {
        q: "How can I track my order?",
        a: "Use the Track Order page with your order number (and phone number, if asked). We also email you a tracking link once your order ships.",
      },
      {
        q: "Can I change or cancel my order?",
        a: "If your order hasn't shipped yet, contact us within 24 hours and we'll update or cancel it free of charge. Once shipped, you can still return it within the 14-day window.",
      },
    ],
  },
  {
    title: "Shipping & Returns",
    items: [
      {
        q: "How long does shipping take?",
        a: "Standard shipping takes 3–5 business days within Pakistan. Express shipping (1–2 days) is available at checkout. Shipping is free on orders over Rs. 3,000.",
      },
      {
        q: "Can I return or exchange my frames?",
        a: "Yes, you can return or exchange within 14 days of delivery. Items must be unused and in original packaging. Return pick-up is free, and refunds are processed within 3–5 business days.",
      },
      {
        q: "What if I receive a damaged or incorrect item?",
        a: "We're sorry for the trouble. Contact us within 48 hours with your order number and a photo of the item, and we'll arrange a replacement or full refund right away.",
      },
      {
        q: "Do you deliver internationally?",
        a: "Not yet. We currently deliver across Pakistan. International shipping is on our roadmap — sign up for the newsletter to be the first to know.",
      },
    ],
  },
  {
    title: "Warranty & Support",
    items: [
      {
        q: "What does the warranty cover?",
        a: "Every pair includes a 2-year warranty covering manufacturing defects in frames and lenses, including hinge and coating issues under normal use.",
      },
      {
        q: "How do I file a warranty claim?",
        a: "Email or message our support team with your order number, a photo of the issue, and a short description. Approved claims are repaired or replaced free of charge.",
      },
      {
        q: "Can you adjust or repair my frames?",
        a: "Yes. Bring any pair to the atelier and our technicians will adjust the fit. Minor repairs on Khattak frames are free within the warranty period.",
      },
    ],
  },
];

export function FAQPage() {
  const [groups, setGroups] = useState<FaqGroup[]>(defaultFaqGroups);

  useEffect(() => {
    axios.get("/faqs").then((res) => {
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        const categoryMap: Record<string, FaqItem[]> = {};
        res.data.forEach((faq: { category?: string; question: string; answer: string }) => {
          const catName = faq.category || "General";
          if (!categoryMap[catName]) categoryMap[catName] = [];
          categoryMap[catName].push({ q: faq.question, a: faq.answer });
        });
        const formatted = Object.entries(categoryMap).map(([title, items]) => ({
          title,
          items,
        }));
        if (formatted.length > 0) {
          setGroups(formatted);
        }
      }
    }).catch(() => {});
  }, []);
  return (
    <div className="bg-[color:var(--color-app-bg)]">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-24">
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[color:var(--color-brand-soft)]/20 blur-3xl" />
        <div className="mx-auto max-w-[1440px] px-4 md:px-8">
          <div className="max-w-3xl">
            <ScrollReveal>
              <p className="editorial-eyebrow">Help Center</p>
              <h1 className="mt-5 font-display text-4xl leading-[1.05] text-[color:var(--color-text-primary)] md:text-6xl">
                Frequently asked <span className="italic text-gradient-brand">questions</span>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-[color:var(--color-text-secondary)] md:text-lg">
                Everything you need to know about our products, ordering, shipping, and warranty. Can't find
                your answer? Our team is one message away.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* FAQ Accordions */}
      <section className="pb-20 md:pb-24">
        <div className="mx-auto max-w-3xl px-4 md:px-8">
          <div className="space-y-12">
            {groups.map((group, index) => (
              <ScrollReveal key={group.title} delay={index * 0.05}>
                <div>
                  <h2 className="mb-2 flex items-center gap-3 font-display text-2xl text-[color:var(--color-text-primary)]">
                    <span className="h-2 w-2 rounded-full bg-[color:var(--color-accent-teal)]" />
                    {group.title}
                  </h2>
                  <div className="rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-6 md:px-8">
                    <ProductAccordion
                      items={group.items.map((item) => ({ title: item.q, content: item.a }))}
                    />
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Still have questions */}
      <section className="pb-20 md:pb-28">
        <div className="mx-auto max-w-3xl px-4 md:px-8">
          <ScrollReveal>
            <div className="relative overflow-hidden rounded-[40px] border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-10 text-center md:p-14">
              <div className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-[color:var(--color-brand-soft)]/25 blur-3xl" />
              <SectionHeading
                eyebrow="Still Stuck?"
                title="Talk to a real person"
                description="Our concierge team replies within 24 hours — by chat, phone, email, or at the atelier in Lahore."
              />
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link to="/contact">
                  <Button variant="primary" iconLeft={<MessageCircle className="h-4 w-4" />}>
                    Contact Us
                  </Button>
                </Link>
                <Link to="/track-order">
                  <Button variant="outline" iconLeft={<HeadphonesIcon className="h-4 w-4" />}>
                    Track an Order
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
