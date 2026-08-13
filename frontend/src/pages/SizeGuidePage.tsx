import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Ruler,
  HelpCircle,
  CheckCircle2,
  Sparkles,
  CreditCard,
  Glasses,
  ArrowRight,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { Breadcrumb } from "@/components/shop/Breadcrumb";
import { Button } from "@/components/primitives/Button";

type SizeCategory = "small" | "medium" | "large";

const sizeDetails: Record<SizeCategory, { title: string; lensWidth: string; bridgeWidth: string; templeLength: string; bestFor: string; frameWidth: string }> = {
  small: {
    title: "Narrow / Small Fit",
    lensWidth: "45mm – 50mm",
    bridgeWidth: "15mm – 18mm",
    templeLength: "135mm – 140mm",
    bestFor: "Petite face shapes, narrow cheekbones, or snug vintage proportions.",
    frameWidth: "125mm – 133mm"
  },
  medium: {
    title: "Regular / Medium Fit (Standard)",
    lensWidth: "51mm – 54mm",
    bridgeWidth: "18mm – 21mm",
    templeLength: "140mm – 145mm",
    bestFor: "Fits over 80% of adults cleanly with balanced proportions.",
    frameWidth: "134mm – 142mm"
  },
  large: {
    title: "Wide / Large Fit",
    lensWidth: "55mm – 60mm+",
    bridgeWidth: "20mm – 24mm",
    templeLength: "145mm – 150mm",
    bestFor: "Broader face shapes, wide jawlines, or dramatic oversized fashion silhouettes.",
    frameWidth: "143mm – 152mm+"
  }
};

export function SizeGuidePage() {
  const [selectedCategory, setSelectedCategory] = useState<SizeCategory>("medium");
  const [cardTestResult, setCardTestResult] = useState<SizeCategory | null>(null);

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 md:px-8">
      <Breadcrumb items={[{ label: "Home", path: "/" }, { label: "Size Guide" }]} />

      {/* Hero Banner */}
      <section className="relative mt-6 overflow-hidden rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8 md:p-14 shadow-[var(--shadow-soft)]">
        <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[color:var(--color-brand-soft)]/20 blur-3xl" />
        <div className="grid items-center gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7 space-y-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--color-brand-soft)]/20 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-[color:var(--color-brand-primary)]">
              <Ruler className="h-3.5 w-3.5" /> Eyewear Fit Concierge
            </span>
            <h1 className="font-display text-4xl font-bold leading-tight text-[color:var(--color-text-primary)] md:text-5xl lg:text-6xl">
              FIND YOUR PERFECT <span className="italic text-gradient-brand">FRAME FIT</span>
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
              Great style starts with proper optical proportions. Learn how frame measurements work in millimeters, test your face size at home in 30 seconds, and pick the perfect Khattak Eyewear frame with confidence.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <a href="#credit-card-test" className="rounded-xl brand-gradient px-6 py-3 text-sm font-semibold text-white shadow-[var(--shadow-soft)] hover:-translate-y-0.5 transition-all inline-flex items-center gap-2">
                <span>30-Sec Quick Size Test</span>
                <ChevronRight className="h-4 w-4" />
              </a>
              <a href="#measurement-table" className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-app-bg)] px-6 py-3 text-sm font-semibold text-[color:var(--color-text-primary)] hover:border-[color:var(--color-brand-primary)] transition-all">
                View Size Chart
              </a>
            </div>
          </div>

          {/* Interactive Frame Anatomy Card */}
          <div className="lg:col-span-5 rounded-2xl border border-[color:var(--color-border)] bg-[#111111] p-6 text-white shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400">Frame Stamped Numbers</span>
              <span className="text-xs font-mono text-white/60">52 ☐ 18 — 140</span>
            </div>
            
            <div className="my-6 py-4 text-center border-y border-dashed border-white/15 relative">
              <div className="font-mono text-3xl font-bold tracking-wider text-amber-100">
                <span className="text-amber-400">52</span> <span className="text-white/40">☐</span> <span className="text-emerald-400">18</span> <span className="text-white/40">—</span> <span className="text-sky-400">140</span>
              </div>
              <p className="mt-2 text-[11px] text-white/60">All measurements are in Millimeters (mm)</p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-amber-400 font-semibold">
                  <span className="h-2 w-2 rounded-full bg-amber-400" /> Lens Width
                </span>
                <span className="font-mono font-bold">52 mm</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" /> Bridge Width
                </span>
                <span className="font-mono font-bold">18 mm</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sky-400 font-semibold">
                  <span className="h-2 w-2 rounded-full bg-sky-400" /> Temple Arm Length
                </span>
                <span className="font-mono font-bold">140 mm</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: How Frame Measurements Work */}
      <section className="mt-16">
        <div className="text-center max-w-3xl mx-auto">
          <p className="editorial-eyebrow">Understanding Proportions</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-[color:var(--color-text-primary)] md:text-4xl">
            The Anatomy of Eyewear Sizing
          </h2>
          <p className="mt-3 text-sm text-[color:var(--color-text-secondary)]">
            Look inside the inner side of your current eyeglasses or sunglasses arm temple. You will find 3 numbers printed, such as <strong>52-18-140</strong>. Here is what each number means:
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 shadow-xs space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 font-bold text-sm">
              01
            </div>
            <h3 className="font-display text-xl font-bold text-[color:var(--color-text-primary)]">Lens Width (52mm)</h3>
            <p className="text-xs leading-relaxed text-[color:var(--color-text-secondary)]">
              The horizontal diameter of one lens at its widest point. Typically ranges between 45mm (Small) to 58mm+ (Large).
            </p>
          </div>

          <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 shadow-xs space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 font-bold text-sm">
              02
            </div>
            <h3 className="font-display text-xl font-bold text-[color:var(--color-text-primary)]">Bridge Width (18mm)</h3>
            <p className="text-xs leading-relaxed text-[color:var(--color-text-secondary)]">
              The gap distance between the two lenses that sits over your nose bridge. Ranges from 14mm to 24mm.
            </p>
          </div>

          <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 shadow-xs space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 font-bold text-sm">
              03
            </div>
            <h3 className="font-display text-xl font-bold text-[color:var(--color-text-primary)]">Temple Length (140mm)</h3>
            <p className="text-xs leading-relaxed text-[color:var(--color-text-secondary)]">
              The overall length of the frame arm from the front hinge to the ear curve tip. Standard length is 140mm–145mm.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: Credit Card Sizing Test */}
      <section id="credit-card-test" className="mt-16 rounded-3xl border border-[color:var(--color-border)] bg-[#16120E] p-8 text-white md:p-12 shadow-2xl">
        <div className="grid items-center gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7 space-y-4">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-amber-400">
              <CreditCard className="h-4 w-4" /> Quick Home Measurement Method
            </span>
            <h2 className="font-display text-3xl font-bold text-amber-100 md:text-4xl">
              The Standard Credit Card Fit Test
            </h2>
            <p className="text-sm leading-relaxed text-amber-50/80">
              Don't have a ruler or frame measurements handy? Standard payment cards (CNIC / Credit Cards) match the exact height of a Medium lens size (85.6mm).
            </p>

            <div className="pt-2 space-y-3">
              <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-400 text-[11px] font-bold text-black">1</span>
                <p className="text-xs leading-relaxed text-amber-100">
                  Stand in front of a mirror. Place the long vertical edge of any payment card along the center ridge of your nose.
                </p>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-400 text-[11px] font-bold text-black">2</span>
                <p className="text-xs leading-relaxed text-amber-100">
                  Observe where the outer edge of the card extends relative to the outer corner of your eye.
                </p>
              </div>
            </div>

            {/* Interactive Card Test Result Picker */}
            <div className="pt-4 border-t border-white/10">
              <p className="text-xs font-semibold text-amber-300 mb-3">Where does the card edge end on your face?</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setCardTestResult("small")}
                  className={`rounded-xl border p-3 text-left transition-all ${cardTestResult === "small" ? "border-amber-400 bg-amber-400/20 text-white font-bold" : "border-white/10 bg-white/5 text-amber-100 hover:bg-white/10"}`}
                >
                  <p className="text-xs font-bold">Extends Past Eye</p>
                  <p className="text-[10px] opacity-70 mt-1">➜ Fits Small / Narrow</p>
                </button>
                <button
                  type="button"
                  onClick={() => setCardTestResult("medium")}
                  className={`rounded-xl border p-3 text-left transition-all ${cardTestResult === "medium" ? "border-amber-400 bg-amber-400/20 text-white font-bold" : "border-white/10 bg-white/5 text-amber-100 hover:bg-white/10"}`}
                >
                  <p className="text-xs font-bold">Aligns with Corner</p>
                  <p className="text-[10px] opacity-70 mt-1">➜ Fits Medium / Regular</p>
                </button>
                <button
                  type="button"
                  onClick={() => setCardTestResult("large")}
                  className={`rounded-xl border p-3 text-left transition-all ${cardTestResult === "large" ? "border-amber-400 bg-amber-400/20 text-white font-bold" : "border-white/10 bg-white/5 text-amber-100 hover:bg-white/10"}`}
                >
                  <p className="text-xs font-bold">Ends Before Eye</p>
                  <p className="text-[10px] opacity-70 mt-1">➜ Fits Large / Wide</p>
                </button>
              </div>

              {cardTestResult && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 rounded-xl bg-amber-400/20 border border-amber-400/40 p-4 text-xs text-amber-100 flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-amber-300">Your Recommended Size: </span>
                    <span className="uppercase font-extrabold tracking-wider">{cardTestResult} FIT</span>
                    <p className="mt-1 text-[11px] opacity-90">{sizeDetails[cardTestResult].bestFor}</p>
                  </div>
                  <Link
                    to="/shop"
                    className="shrink-0 rounded-lg bg-amber-400 px-3.5 py-1.5 text-xs font-bold text-black hover:bg-amber-300 transition-colors"
                  >
                    Shop {cardTestResult.toUpperCase()}
                  </Link>
                </motion.div>
              )}
            </div>
          </div>

          <div className="lg:col-span-5 overflow-hidden rounded-2xl border border-white/15">
            <img
              src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80"
              alt="Credit Card Measurement Guide"
              className="h-80 w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Section 3: Interactive Size Chart Table */}
      <section id="measurement-table" className="mt-16">
        <div className="text-center max-w-3xl mx-auto">
          <p className="editorial-eyebrow">Frame Dimensions Matrix</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-[color:var(--color-text-primary)] md:text-4xl">
            Optical Size Reference Chart
          </h2>
          <p className="mt-2 text-sm text-[color:var(--color-text-secondary)]">
            Compare measurements across Small, Medium, and Large optical frames
          </p>
        </div>

        {/* Category Switcher Tabs */}
        <div className="mt-8 flex justify-center gap-2">
          {(["small", "medium", "large"] as SizeCategory[]).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-5 py-2.5 text-xs font-bold capitalize transition-all ${selectedCategory === cat ? "bg-[color:var(--color-brand-primary)] text-white shadow-md" : "border border-[color:var(--color-border)] bg-[color:var(--color-panel)] text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)]"}`}
            >
              {cat} Fit Matrix
            </button>
          ))}
        </div>

        {/* Selected Size Detail Panel */}
        <div className="mt-6 rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 md:p-8 shadow-[var(--shadow-soft)]">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[color:var(--color-border)] pb-6">
            <div>
              <span className="inline-block rounded-full bg-[color:var(--color-brand-primary)]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[color:var(--color-brand-primary)]">
                Active Selection
              </span>
              <h3 className="mt-2 font-display text-2xl font-bold text-[color:var(--color-text-primary)]">
                {sizeDetails[selectedCategory].title}
              </h3>
              <p className="mt-1 text-xs text-[color:var(--color-text-secondary)]">
                {sizeDetails[selectedCategory].bestFor}
              </p>
            </div>
            <Link
              to="/shop"
              className="rounded-xl brand-gradient px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:scale-105 transition-all"
            >
              Browse Collection
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] p-4 text-center">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[color:var(--color-text-tertiary)]">Lens Width</p>
              <p className="mt-2 font-mono text-xl font-bold text-[color:var(--color-text-primary)]">{sizeDetails[selectedCategory].lensWidth}</p>
            </div>
            <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] p-4 text-center">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[color:var(--color-text-tertiary)]">Bridge Width</p>
              <p className="mt-2 font-mono text-xl font-bold text-[color:var(--color-text-primary)]">{sizeDetails[selectedCategory].bridgeWidth}</p>
            </div>
            <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] p-4 text-center">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[color:var(--color-text-tertiary)]">Temple Arm Length</p>
              <p className="mt-2 font-mono text-xl font-bold text-[color:var(--color-text-primary)]">{sizeDetails[selectedCategory].templeLength}</p>
            </div>
            <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] p-4 text-center">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[color:var(--color-text-tertiary)]">Total Front Width</p>
              <p className="mt-2 font-mono text-xl font-bold text-[color:var(--color-brand-primary)]">{sizeDetails[selectedCategory].frameWidth}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Guarantees & Concierge Support */}
      <section className="mt-16 rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8 md:p-12 text-center">
        <ShieldCheck className="mx-auto h-10 w-10 text-[color:var(--color-brand-primary)]" />
        <h2 className="mt-4 font-display text-2xl font-bold text-[color:var(--color-text-primary)] md:text-3xl">
          100% Fit Guarantee & Free Exchanges
        </h2>
        <p className="mt-2 max-w-xl mx-auto text-sm text-[color:var(--color-text-secondary)]">
          Still unsure which size fits best? Order with complete peace of mind. If your frames don't fit perfectly upon arrival, we provide hassle-free exchanges across Pakistan.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Link to="/contact">
            <Button variant="primary">Talk to Fit Concierge</Button>
          </Link>
          <Link to="/shop">
            <Button variant="outline">Explore Eyewear</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
