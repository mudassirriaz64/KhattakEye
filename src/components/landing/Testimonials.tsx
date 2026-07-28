import { useState } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { testimonials } from "@/lib/landing-data";
import { SectionHeading } from "@/components/shared/SectionHeading";

export function Testimonials() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-[1440px] px-4 py-16 md:px-8 md:py-20">
        <SectionHeading
          eyebrow="Testimonials"
          title="What our customers say"
          description="Real stories from real customers who trust Khattak Eyewear for their premium eyewear needs."
        />

        <div className="relative mt-12">
          <div className="mx-auto max-w-3xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.4 }}
                className="relative rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8 md:p-10"
              >
                <Quote className="h-10 w-10 text-[color:var(--color-accent-teal)]/20" />
                <p className="mt-4 text-lg leading-8 text-[color:var(--color-text-primary)] md:text-xl">
                  {testimonials[current].text}
                </p>
                <div className="mt-6 flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < testimonials[current].rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-[color:var(--color-border)]"
                      }`}
                    />
                  ))}
                </div>
                <div className="mt-6 flex items-center gap-4">
                  <img
                    src={testimonials[current].avatar}
                    alt={testimonials[current].name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-[color:var(--color-text-primary)]">
                      {testimonials[current].name}
                    </p>
                    <p className="text-sm text-[color:var(--color-text-secondary)]">
                      {testimonials[current].location}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={prev}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-[color:var(--color-border)] text-[color:var(--color-text-secondary)] transition-all hover:bg-[color:var(--color-surface-muted)] hover:text-[color:var(--color-text-primary)]"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrent(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === current
                      ? "w-8 bg-[color:var(--color-brand-primary)]"
                      : "w-2 bg-[color:var(--color-border)]"
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={next}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-[color:var(--color-border)] text-[color:var(--color-text-secondary)] transition-all hover:bg-[color:var(--color-surface-muted)] hover:text-[color:var(--color-text-primary)]"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
