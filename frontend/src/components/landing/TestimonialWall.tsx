import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { testimonials as fallbackTestimonials, type Testimonial } from "@/lib/landing-data";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import axios from "@/lib/api/axios";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? "fill-amber-400 text-amber-400" : "text-[color:var(--color-border-strong)]"}`}
        />
      ))}
    </div>
  );
}

export function TestimonialWall() {
  const [list, setList] = useState<Testimonial[]>(fallbackTestimonials);

  useEffect(() => {
    axios.get("/testimonials")
      .then((res) => {
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          setList(res.data.map(t => ({
            id: t._id,
            name: t.customerName,
            avatar: t.customerImage || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop",
            location: "Verified Buyer",
            text: t.text,
            rating: t.rating
          })));
        }
      })
      .catch(() => {});
  }, []);

  const [featured, ...rest] = list.length > 0 ? list : fallbackTestimonials;

  return (
    <section className="bg-[color:var(--color-panel)] py-20 md:py-28">
      <div className="mx-auto max-w-[1440px] px-4 md:px-8">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <ScrollReveal className="lg:sticky lg:top-28">
              <p className="editorial-eyebrow">Testimonials</p>
              <h2 className="mt-4 font-display text-4xl leading-tight text-[color:var(--color-text-primary)] md:text-6xl">
                In their <span className="italic text-gradient-brand">own words</span>
              </h2>
              <p className="mt-6 text-base leading-8 text-[color:var(--color-text-secondary)]">
                Thousands of wearers across Pakistan trust Khattak Eyewear with their vision. Here are
                a few of their stories.
              </p>

              <motion.figure
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="relative mt-10 rounded-[32px] border border-[color:var(--color-border)] bg-[color:var(--color-app-bg)] p-8 shadow-[var(--shadow-soft)]"
              >
                <Quote className="h-8 w-8 text-[color:var(--color-brand-soft)]" />
                <blockquote className="mt-4 font-display text-2xl leading-snug text-[color:var(--color-text-primary)] md:text-3xl">
                  {featured.text}
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-4">
                  <img
                    src={featured.avatar}
                    alt={featured.name}
                    className="h-14 w-14 rounded-full object-cover ring-2 ring-[color:var(--color-brand-soft)]"
                  />
                  <div>
                    <p className="font-display text-lg text-[color:var(--color-text-primary)]">{featured.name}</p>
                    <p className="text-xs text-[color:var(--color-text-tertiary)]">{featured.location}</p>
                  </div>
                  <div className="ml-auto">
                    <Stars rating={featured.rating} />
                  </div>
                </figcaption>
              </motion.figure>
            </ScrollReveal>
          </div>

          <div className="space-y-5 lg:col-span-7">
            {rest.map((testimonial, index) => (
              <motion.figure
                key={testimonial.id}
                initial={{ opacity: 0, x: 28 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col gap-5 rounded-[28px] border border-[color:var(--color-border)] bg-[color:var(--color-app-bg)] p-7 shadow-[var(--shadow-input)] transition-shadow hover:shadow-[var(--shadow-soft)] sm:flex-row sm:items-start"
              >
                <div className="flex items-center gap-4 sm:w-44 sm:shrink-0 sm:flex-col sm:items-start">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="h-14 w-14 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-display text-lg leading-tight text-[color:var(--color-text-primary)]">
                      {testimonial.name}
                    </p>
                    <p className="mt-0.5 text-xs text-[color:var(--color-text-tertiary)]">
                      {testimonial.location}
                    </p>
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <Stars rating={testimonial.rating} />
                  <blockquote className="mt-3 text-sm leading-7 text-[color:var(--color-text-secondary)]">
                    “{testimonial.text}”
                  </blockquote>
                </div>
              </motion.figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
