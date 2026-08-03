import { motion } from "framer-motion";
import { Heart, Instagram } from "lucide-react";
import { instagramPosts } from "@/lib/landing-data";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { cn } from "@/lib/utils";

const layout = [
  { className: "sm:col-span-2 sm:row-span-2", imgClass: "h-full" },
  { className: "", imgClass: "aspect-square" },
  { className: "", imgClass: "aspect-square" },
  { className: "", imgClass: "aspect-square" },
  { className: "", imgClass: "aspect-square" },
  { className: "", imgClass: "aspect-square" },
];

export function CustomerGallery() {
  return (
    <section className="bg-[color:var(--color-app-bg)] py-20 md:py-28">
      <div className="mx-auto max-w-[1440px] px-4 md:px-8">
        <SectionHeading
          eyebrow="@khattakeyewear"
          title="Worn by you"
          description="The finest frames we make, in the wild — shared by our customers across the country and beyond."
        />

        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {instagramPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className={cn("group relative overflow-hidden rounded-[28px] shadow-[var(--shadow-input)]", layout[Math.min(index, 5)].className)}
            >
              <img
                src={post.image}
                alt={`Customer gallery photo ${index + 1}`}
                className={cn("w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105", layout[Math.min(index, 5)].imgClass)}
              />
              <div className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-[color:var(--color-text-primary)]/60 via-transparent to-transparent p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="flex items-center gap-1.5 text-sm font-semibold text-white">
                  <Heart className="h-4 w-4 fill-white" />
                  {post.likes}
                </span>
                <Instagram className="h-5 w-5 text-white/80" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
