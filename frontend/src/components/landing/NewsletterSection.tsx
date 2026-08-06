import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Mail, Check, ArrowRight } from "lucide-react";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import axios from "@/lib/api/axios";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!email.trim()) return;
    try {
      await axios.post("/newsletter/subscribe", { email });
      setSubscribed(true);
    } catch {
      setSubscribed(true);
    }
  };

  return (
    <section className="bg-[color:var(--color-app-bg)] py-20 md:py-28">
      <div className="mx-auto max-w-[1440px] px-4 md:px-8">
        <ScrollReveal>
          <div className="relative overflow-hidden rounded-[40px] border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-6 py-16 shadow-[var(--shadow-soft)] md:px-16 md:py-24">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[color:var(--color-brand-soft)]/20 blur-3xl" />
              <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-[color:var(--color-brand-primary)]/[0.07] blur-3xl" />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--color-brand-soft)] to-transparent" />
            </div>

            <div className="relative mx-auto max-w-2xl text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full brand-gradient-soft text-[color:var(--color-brand-primary)]">
                <Mail className="h-7 w-7" />
              </div>
              <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.3em] text-[color:var(--color-brand-primary)]">
                The Khattak Letter
              </p>
              <h2 className="mt-4 font-display text-4xl leading-tight text-[color:var(--color-text-primary)] md:text-5xl">
                Style notes, before they sell out
              </h2>
              <p className="mx-auto mt-5 max-w-md text-base leading-7 text-[color:var(--color-text-secondary)]">
                Join the list for private releases, atelier stories, and first access to limited
                silhouettes. No noise — only the good things.
              </p>

              {subscribed ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mx-auto mt-9 flex max-w-md items-center justify-center gap-3 rounded-full border border-[color:var(--color-success)]/30 bg-[#15803D]/[0.08] px-6 py-4 text-sm font-semibold text-[#15803D]"
                >
                  <Check className="h-5 w-5" />
                  Welcome to the atelier. Your first note is on its way.
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="mx-auto mt-9 flex max-w-md flex-col gap-3 sm:flex-row">
                  <div className="relative flex-1">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--color-text-tertiary)]" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="Your email address"
                      className="w-full rounded-[16px] border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] py-3.5 pl-11 pr-4 text-sm text-[color:var(--color-text-primary)] placeholder:text-[color:var(--color-text-tertiary)] transition-colors focus:border-[color:var(--color-brand-primary)] focus:outline-none focus:ring-4 focus:ring-[color:var(--color-focus-ring)]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="group inline-flex items-center justify-center gap-2 rounded-[16px] brand-gradient px-6 py-3.5 text-sm font-semibold text-white shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--glow-brand)]"
                  >
                    Subscribe
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </form>
              )}

              <p className="mt-5 text-xs text-[color:var(--color-text-tertiary)]">
                Unsubscribe anytime. Crafted with care in Lahore, Pakistan.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
