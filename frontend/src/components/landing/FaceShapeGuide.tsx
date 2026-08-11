import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ScrollReveal } from "@/components/shared/ScrollReveal";

const faceShapes = [
  {
    numeral: "I",
    name: "Round",
    guidance: "Angular rectangles and wayfarers lend structure",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900&q=80",
    path: "/shop",
  },
  {
    numeral: "II",
    name: "Oval",
    guidance: "Geometric and bold frames balance soft features",
    image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=900&q=80",
    path: "/shop",
  },
  {
    numeral: "III",
    name: "Square",
    guidance: "Rounded, oval and browline frames soften the jaw",
    image: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=900&q=80",
    path: "/shop",
  },
  {
    numeral: "IV",
    name: "Heart",
    guidance: "Light cat-eye and bottom-heavy silhouettes balance",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=900&q=80",
    path: "/shop",
  },
];

export function FaceShapeGuide() {
  return (
    <section className="bg-[color:var(--color-app-bg)] pt-10 pb-20 md:pt-12 md:pb-28">
      <div className="mx-auto max-w-[1440px] px-4 md:px-8">
        <SectionHeading
          eyebrow="Shop by Face Shape"
          title="Frames that fit, beautifully"
          description="A considered silhouette is the difference between glasses and a signature. Let the geometry of your face guide the frame."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {faceShapes.map((shape, index) => (
            <motion.div
              key={shape.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                to={shape.path}
                className="group block overflow-hidden rounded-[32px] border border-[color:var(--color-border)] bg-[color:var(--color-panel)] shadow-[var(--shadow-input)] transition-shadow duration-300 hover:shadow-[var(--shadow-strong)]"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={shape.image}
                    alt={`${shape.name} face shape eyewear`}
                    className="aspect-[4/5] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <span className="absolute left-5 top-5 font-display text-5xl italic text-white/90 drop-shadow">
                    {shape.numeral}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--color-text-primary)]/60 via-transparent to-transparent" />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-2xl text-[color:var(--color-text-primary)]">
                      {shape.name}
                    </h3>
                    <ArrowRight className="h-4 w-4 text-[color:var(--color-brand-primary)] transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[color:var(--color-text-secondary)]">
                    {shape.guidance}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <ScrollReveal className="mt-12 text-center">
          <Link
            to="/shop"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--color-brand-primary)] transition-colors hover:text-[color:var(--color-brand-hover)]"
          >
            Explore all silhouettes
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
