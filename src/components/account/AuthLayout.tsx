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
    <div className="flex min-h-screen">
      <div className={`flex w-full items-center justify-center px-6 py-12 lg:w-1/2 ${isLeft ? "order-2" : "order-1"}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="mb-8 inline-block">
            <span className="font-display text-2xl font-bold tracking-tight text-[color:var(--color-text-primary)]">Khattak</span>
            <span className="font-display text-2xl font-light text-[color:var(--color-accent-teal)]"> Eyewear</span>
          </Link>
          {children}
        </motion.div>
      </div>

      <div className={`hidden w-1/2 lg:block ${isLeft ? "order-1" : "order-2"}`}>
        <div className="relative h-full w-full overflow-hidden bg-[color:var(--color-brand-primary)]">
          <div className="absolute inset-0 bg-gradient-to-br from-[color:var(--color-brand-primary)] via-[#1a1a2e] to-[color:var(--color-accent-teal)] opacity-80" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(15,118,110,0.4),transparent_60%),radial-gradient(ellipse_at_bottom_left,rgba(37,99,235,0.2),transparent_50%)]" />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-16 text-center">
            <div className="h-80 w-80 rounded-full border border-white/10 bg-white/5 backdrop-blur-3xl" />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-16 text-center">
              <h2 className="font-display text-4xl leading-tight text-white">Precision Crafted<br /><span className="text-[color:var(--color-accent-teal)]">For Your Vision</span></h2>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">Every frame tells a story of heritage, craftsmanship, and the pursuit of perfection.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
