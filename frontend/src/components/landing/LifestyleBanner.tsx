import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Quote } from "lucide-react";
import { Button } from "@/components/primitives/Button";

export function LifestyleBanner() {
  return (
    <section className="bg-[color:var(--color-app-bg)] py-20 md:py-28">
      <div className="mx-auto max-w-[1440px] px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[40px] shadow-[var(--shadow-strong)]"
        >
          <img
            src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=1920&q=80"
            alt="Luxury eyewear in an elegant setting"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(25,19,13,0.78)_0%,rgba(25,19,13,0.45)_45%,rgba(25,19,13,0.1)_100%)]" />

          <div className="relative mx-auto max-w-2xl px-6 py-20 text-left md:px-16 md:py-32">
            <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/70">
              <span className="h-px w-8 bg-[#D3A095]" />
              The Art of Seeing
            </p>
            <h2 className="mt-6 font-display text-4xl leading-tight text-white md:text-6xl">
              Luxury is a habit of the eye, refined over a lifetime.
            </h2>
            <p className="mt-6 max-w-md text-base leading-8 text-white/80">
              Beyond the frame is a philosophy — light, proportion, and the quiet confidence of a perfect fit.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link to="/shop">
                <Button variant="cta-lg" iconRight={<ArrowRight className="h-4 w-4" />}>
                  Discover the Difference
                </Button>
              </Link>
            </div>

            <div className="mt-12 flex items-center gap-4 border-t border-white/15 pt-8">
              <Quote className="h-6 w-6 text-[#D3A095]" />
              <p className="text-sm italic leading-6 text-white/70">
                “Precision you can feel, elegance you can wear.”
              </p>
              <span className="ml-auto text-[10px] font-medium uppercase tracking-[0.24em] text-white/50">
                The Khattak Atelier
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
