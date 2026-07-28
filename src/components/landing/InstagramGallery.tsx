import { motion } from "framer-motion";
import { Heart, Instagram } from "lucide-react";
import { instagramPosts } from "@/lib/landing-data";
import { ScrollReveal } from "@/components/shared/ScrollReveal";

export function InstagramGallery() {
  return (
    <section className="border-b border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)]">
      <div className="mx-auto max-w-[1440px] px-4 py-16 md:px-8 md:py-20">
        <ScrollReveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-app-bg)] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-[color:var(--color-text-secondary)]">
              <Instagram className="h-3 w-3 text-[color:var(--color-accent-teal)]" />
              Follow Us
            </p>
            <h2 className="mt-4 font-display text-3xl leading-tight text-[color:var(--color-text-primary)] md:text-5xl">
              @khattak_eyewear
            </h2>
          </div>
        </ScrollReveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {instagramPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              className="group relative aspect-square overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-app-bg)]"
            >
              <img
                src={post.image}
                alt={`Instagram post ${post.id}`}
                className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/40">
                <div className="flex items-center gap-2 text-white opacity-0 transition-all duration-300 group-hover:opacity-100">
                  <Heart className="h-5 w-5 fill-white" />
                  <span className="text-sm font-medium">{post.likes}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
