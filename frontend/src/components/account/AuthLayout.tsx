import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

type Props = {
  children: ReactNode;
  imageSide?: "left" | "right";
  imageUrl?: string;
};

export function AuthLayout({ children, imageSide = "right" }: Props) {
  const isLeft = imageSide === "left";

  return (
    <div className="flex min-h-screen bg-[color:var(--color-app-bg)]">
      <div className={`flex w-full items-center justify-center px-6 py-12 lg:w-1/2 ${isLeft ? "order-2" : "order-1"}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="mb-8 flex items-center gap-3">
            <img src="/khattak.png" alt="Khattak Eyewear" className="h-10 w-10 object-contain" />
            <div className="flex flex-col leading-none">
              <span className="font-display text-xl font-semibold tracking-tight text-[color:var(--color-text-primary)]">
                Khattak
              </span>
              <span className="text-[9px] font-medium uppercase tracking-[0.34em] text-[color:var(--color-brand-primary)]">
                Eyewear
              </span>
            </div>
          </Link>
          {children}
        </motion.div>
      </div>

      <div className={`hidden w-1/2 lg:block ${isLeft ? "order-1" : "order-2"}`}>
        <div className="relative h-full w-full overflow-hidden bg-[#0F0D0C]">
          {/* Background Eyewear Image with Soft Dark Gradient */}
          <img
            src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=1200&fit=crop"
            alt="Khattak Eyewear Craftsmanship"
            className="h-full w-full object-cover opacity-45 transition-scale duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F0D0C] via-[#0F0D0C]/60 to-transparent" />

          {/* Floating Glassmorphic Content Card */}
          <div className="absolute inset-0 flex flex-col justify-between p-16">
            <div className="flex justify-end">
              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-md">
                Masterpiece Collection 2026
              </span>
            </div>

            <div className="max-w-md space-y-4">
              <h2 className="font-display text-4xl leading-tight text-white md:text-5xl">
                Precision Crafted <br />
                <span className="text-[color:var(--color-brand-soft)]">For Your Vision</span>
              </h2>
              <p className="text-sm leading-relaxed text-white/70">
                Every frame tells a story of heritage, handcrafted Italian acetates, Japanese titanium, and the relentless pursuit of optical perfection.
              </p>
              <div className="flex items-center gap-6 pt-4 text-xs font-semibold uppercase tracking-wider text-white/80">
                <span>Handcrafted</span>
                <span>•</span>
                <span>100% UV Protection</span>
                <span>•</span>
                <span>Free Express Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
