import { useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/primitives/Button";

export function NewsletterSection() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#0B0B0C,#1F2937,#0B0B0C)]" />
      <div className="absolute left-1/3 top-0 h-64 w-64 -translate-y-1/2 rounded-full bg-[color:var(--color-accent-teal)]/10 blur-[80px]" />
      <div className="absolute bottom-0 right-1/4 h-48 w-48 translate-y-1/3 rounded-full bg-[color:var(--color-accent-blue)]/8 blur-[60px]" />
      <div className="relative mx-auto max-w-[1440px] px-4 py-20 md:px-8 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
            <Sparkles className="h-8 w-8 text-[color:var(--color-accent-teal)]" />
          </div>
          <h2 className="mt-6 font-display text-3xl leading-tight text-white md:text-5xl">
            Join the inner circle
          </h2>
          <p className="mt-4 text-sm leading-7 text-white/60 md:text-base">
            Be the first to know about new collections, exclusive offers, and limited-edition releases. No spam, just premium content.
          </p>

          <form onSubmit={handleSubmit} className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white outline-none transition-all placeholder:text-white/30 focus:border-[color:var(--color-accent-teal)] focus:ring-4 focus:ring-[color:var(--color-accent-teal)]/20"
              />
            </div>
            <Button
              type="submit"
              variant="cta-lg"
              iconRight={<Send className="h-4 w-4" />}
              className="px-8"
            >
              Subscribe
            </Button>
          </form>

          <p className="mt-4 text-xs text-white/30">
            By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
