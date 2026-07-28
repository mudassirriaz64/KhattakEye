import { motion } from "framer-motion";
import { PageHeader } from "@/components/shared/PageHeader";
import { SurfaceCard } from "@/components/shared/SurfaceCard";
import { motionPresets } from "@/lib/site-data";

export function MotionPage() {
  return (
    <>
      <PageHeader
        eyebrow="Systems / Motion"
        title="Movement is elegant support, not decorative noise."
        description="Framer Motion is used for premium reveal, hover, and navigation transitions. Motion should emphasize clarity, depth, and tactility while remaining accessible and restrained."
      />

      <SurfaceCard title="Motion presets">
        <div className="space-y-3">
          {motionPresets.map(([name, description], index) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.35 }}
              className="flex flex-col gap-2 rounded-[20px] border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-5 py-4 md:flex-row md:items-center md:justify-between"
            >
              <span className="font-medium text-[color:var(--color-text-primary)]">{name}</span>
              <span className="max-w-2xl text-sm leading-7 text-[color:var(--color-text-secondary)]">{description}</span>
            </motion.div>
          ))}
        </div>
      </SurfaceCard>

      <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <SurfaceCard title="Parallax language">
          <div className="rounded-[26px] bg-[linear-gradient(145deg,#111111,#1F2937)] p-6 text-white">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">Approved areas</p>
              <ul className="space-y-2 text-sm leading-7 text-white/80">
                <li>Hero background drift</li>
                <li>Floating glasses and layered photography</li>
                <li>Brand story sections and premium collection bands</li>
                <li>Testimonial backdrops and CTA panels</li>
              </ul>
            </div>
          </div>
        </SurfaceCard>

        <SurfaceCard title="Reduced motion">
          <p className="text-sm leading-7 text-[color:var(--color-text-secondary)]">
            When reduced motion is preferred, all non-essential transforms should collapse to clean opacity transitions. Navigation, modal, and feedback interactions must stay clear even without depth or travel.
          </p>
        </SurfaceCard>
      </section>
    </>
  );
}
