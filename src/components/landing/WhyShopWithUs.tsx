import { Eye, ShieldCheck, Gem, Award, ScanLine, RotateCcw } from "lucide-react";
import SpotlightCard from "@/components/primitives/SpotlightCard";

const features = [
  { icon: Eye, title: "Free Eye Test", desc: "Complimentary eye examination with every purchase." },
  { icon: ShieldCheck, title: "Secure Payments", desc: "Encrypted transactions with 100% payment protection." },
  { icon: Gem, title: "Premium Materials", desc: "Italian acetates, Japanese titanium, precision optics." },
  { icon: Award, title: "2 Year Warranty", desc: "Comprehensive coverage on frames and lens defects." },
  { icon: ScanLine, title: "Virtual Try-On", desc: "AI-powered frame fitting from the comfort of your home." },
  { icon: RotateCcw, title: "Easy Returns", desc: "14-day satisfaction guarantee with free pick-up." },
];

export function WhyShopWithUs() {
  return (
    <section className="py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mb-8 text-center md:mb-10">
          <h2 className="font-display text-2xl font-bold text-[color:var(--color-text-primary)] md:text-3xl">
            Why Shop With Us
          </h2>
          <p className="mt-1.5 text-sm text-[color:var(--color-text-tertiary)]">
            Luxury you can trust
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <SpotlightCard
                key={feature.title}
                spotlightColor="rgba(0, 229, 255, 0.2)"
                className="!rounded-2xl !border-neutral-700/50 !bg-neutral-900/50 !p-5 !backdrop-blur-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color:var(--color-accent-teal)]/10 text-[color:var(--color-accent-teal)]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-white">
                      {feature.title}
                    </h3>
                    <p className="mt-0.5 text-xs leading-relaxed text-white/50">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              </SpotlightCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
