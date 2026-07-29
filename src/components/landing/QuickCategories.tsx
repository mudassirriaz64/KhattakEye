import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Glasses, Sun, Contact, Eye, Monitor, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

const quickCategories = [
  { title: "Eyeglasses", icon: Glasses, path: "/shop/eyeglasses", count: "48 Styles", image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&h=400&fit=crop" },
  { title: "Sunglasses", icon: Sun, path: "/shop/sunglasses", count: "36 Styles", image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop" },
  { title: "Contact Lenses", icon: Contact, path: "/shop/contact-lenses", count: "24 Options", image: "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=400&h=400&fit=crop" },
  { title: "Prescription", icon: Eye, path: "/shop/prescription", count: "All Lenses", image: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=400&h=400&fit=crop" },
  { title: "Computer Glasses", icon: Monitor, path: "/shop/computer", count: "12 Styles", image: "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=400&h=400&fit=crop" },
  { title: "Reading", icon: BookOpen, path: "/shop/reading", count: "18 Styles", image: "https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=400&h=400&fit=crop" },
];

export function QuickCategories() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 md:px-8">
      <div className="grid grid-cols-3 gap-3 md:grid-cols-6 md:gap-4">
        {quickCategories.map((cat, i) => {
          const Icon = cat.icon;
          return (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
            >
              <Link
                to={cat.path}
                className={cn(
                  "group relative flex flex-col items-center gap-2 overflow-hidden rounded-2xl p-5 text-center transition-all duration-300",
                  "border border-[color:var(--color-border)] bg-[color:var(--color-panel)]",
                  "hover:-translate-y-1 hover:shadow-[var(--shadow-soft)] hover:border-[color:var(--color-accent-teal)]/30",
                )}
              >
                <div className="absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <img
                    src={cat.image}
                    alt=""
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-[color:var(--color-panel)]/80 backdrop-blur-[2px]" />
                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[color:var(--color-surface-muted)] text-[color:var(--color-accent-teal)] transition-all duration-300 group-hover:scale-110 group-hover:bg-[color:var(--color-accent-teal)] group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <span className="text-xs font-semibold text-[color:var(--color-text-primary)]">
                  {cat.title}
                </span>
                <span className="text-[10px] text-[color:var(--color-text-tertiary)]">
                  {cat.count}
                </span>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
