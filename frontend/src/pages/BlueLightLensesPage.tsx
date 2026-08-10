import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Eye, Zap, Sparkles, CheckCircle2, ChevronDown, HelpCircle, ArrowRight, Laptop, Monitor, Smartphone, Sun } from "lucide-react";
import { Breadcrumb } from "@/components/shop/Breadcrumb";
import { ProductToolbar } from "@/components/shop/ProductToolbar";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { QuickViewModal } from "@/components/quickview/QuickViewModal";
import { useShopStore } from "@/lib/stores/shop-store";
import { getProducts, mapProductCard } from "@/lib/api/products";
import { type Product } from "@/lib/shop-data";

const faqs = [
  {
    q: "Is it harmful to wear blue light lenses all day long?",
    a: "No, blue light blocking lenses are completely safe and beneficial for all-day wear. They function like regular clear lenses while filtering high-energy visible (HEV) screen radiation without distorting natural colors."
  },
  {
    q: "Should I wear blue light glasses to watch TV or play video games?",
    a: "Yes! Modern televisions, gaming monitors, and smartphone screens emit significant amounts of artificial blue light. Wearing blue light glasses reduces eye strain, dryness, and fatigue during long gaming sessions or movie marathons."
  },
  {
    q: "Can I get blue light protection with prescription lenses?",
    a: "Absolutely. All our blue light blocking technologies (Dark Blue-Cut, Clear Blue-Cut, and Photochromic Transition) can be customized with your exact single vision, bifocal, or progressive prescription."
  },
  {
    q: "Who should wear blue light filtering glasses?",
    a: "Anyone who spends 2+ hours daily looking at digital screens—including software developers, office professionals, students, gamers, and night-time readers—can benefit from blue light protection."
  },
  {
    q: "How does blue light affect my sleep quality?",
    a: "Exposure to screen blue light in the evening suppresses melatonin production, delaying your brain's natural sleep signal. Blue light blocking glasses help preserve healthy sleep cycles when using screens at night."
  },
  {
    q: "How to order online Blue Light Glasses in Pakistan?",
    a: "Select any frame from our collection, click 'Select Lenses', choose your prescription type, and select 'Blue Cut' or 'Blue Light Shield' in the lens options. We craft and deliver your custom eyewear anywhere in Pakistan."
  },
  {
    q: "Why choose Khattak Eyewear Blue Light Lenses?",
    a: "Khattak Eyewear uses 99.8% high-clarity anti-reflective blue-blocking polymer lenses. Our lenses offer full UV400 protection, scratch-resistant hard coating, hydrophobic smudge protection, and come backed by our satisfaction warranty."
  }
];

const comparisonData = [
  { feature: "Overall Structure", dark: "✔", clear: "✔", photo: "✔", photoDark: "✔" },
  { feature: "UV Protection", dark: "✔", clear: "✔", photo: "✔", photoDark: "✔" },
  { feature: "Harmful Blue Light Filter", dark: "✔", clear: "✔", photo: "✔", photoDark: "✔" },
  { feature: "Anti-Reflective Coating", dark: "✔", clear: "✔", photo: "✔", photoDark: "✔" },
  { feature: "Clear Outdoor", dark: "✔", clear: "✔", photo: "✔", photoDark: "✖" },
  { feature: "Sun Protection", dark: "✖", clear: "✖", photo: "✔", photoDark: "✔" },
  { feature: "Glare Protection", dark: "✔", clear: "✔", photo: "✔", photoDark: "✔" },
  { feature: "Computer Work", dark: "✔", clear: "✔", photo: "✔", photoDark: "✔" },
  { feature: "Night Driving", dark: "✔", clear: "✔", photo: "✔", photoDark: "✔" },
  { feature: "Prescription Lens Compatibility", dark: "✔", clear: "✔", photo: "✔", photoDark: "✔" }
];

export function BlueLightLensesPage() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const selectedFilters = useShopStore((s) => s.selectedFilters);
  const priceRange = useShopStore((s) => s.priceRange);
  const sortBy = useShopStore((s) => s.sortBy);

  useEffect(() => {
    setLoading(true);
    // Fetch products matching category lenses / eyeglasses / blue-light
    getProducts({ limit: 100 }).then((data) => {
      if (data && data.items) {
        const mapped = data.items.map(mapProductCard) as unknown as Product[];
        setDbProducts(mapped);
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...dbProducts];

    // Filter to blue-light / computer lenses or eyeglasses
    result = result.filter((p) => {
      const cat = (p.category || "").toLowerCase();
      const sub = (p.subcategory || "").toLowerCase();
      const name = (p.name || "").toLowerCase();
      const desc = (p.description || "").toLowerCase();
      const lensType = (p.lensType || "").toLowerCase();

      return (
        cat.includes("blue") ||
        sub.includes("blue") ||
        sub.includes("computer") ||
        lensType.includes("blue") ||
        cat.includes("lens") ||
        cat.includes("eyeglass") ||
        name.includes("blue") ||
        desc.includes("blue light")
      );
    });

    // Apply sidebar filters
    Object.entries(selectedFilters).forEach(([groupId, values]) => {
      if (values.length === 0) return;
      if (groupId === "category") {
        result = result.filter((p) => values.includes(p.subcategory?.toLowerCase()) || values.includes(p.category?.toLowerCase()));
      } else if (groupId === "brand") {
        result = result.filter((p) => values.includes(p.brand.toLowerCase().replace(/\s+/g, "-")));
      } else if (groupId === "gender") {
        result = result.filter((p) => p.gender && p.gender.some((g: string) => values.includes(g)));
      } else if (groupId === "frame-shape") {
        result = result.filter((p) => values.includes(p.frameShape?.toLowerCase()));
      } else if (groupId === "frame-material") {
        result = result.filter((p) => values.includes(p.frameMaterial?.toLowerCase()));
      }
    });

    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    if (sortBy === "price-asc") result.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") result.sort((a, b) => b.price - a.price);
    if (sortBy === "rating") result.sort((a, b) => b.rating - a.rating);

    return result;
  }, [dbProducts, selectedFilters, priceRange, sortBy]);

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 md:px-8">
      <Breadcrumb items={[{ label: "Shop", path: "/shop" }, { label: "Lenses", path: "/shop/lenses" }, { label: "Blue Light Glasses" }]} />

      {/* Hero Section */}
      <section className="mt-6 overflow-hidden rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] shadow-[var(--shadow-soft)]">
        <div className="grid grid-cols-1 items-center lg:grid-cols-12">
          <div className="p-8 lg:col-span-7 lg:p-12">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--color-brand-soft)]/20 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-[color:var(--color-brand-primary)]">
              <Zap className="h-3.5 w-3.5" /> High-Protection Lens Tech
            </span>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-[color:var(--color-text-primary)] md:text-5xl">
              BLUE LIGHT GLASSES
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
              Most people spend 8+ hours in front of screens every day, for work, study, and entertainment. Such prolonged exposure to artificial blue light can cause eye strain, fatigue, headaches, and disrupt your natural sleep cycle. Protect your vision with Khattak Eyewear premium blue-light blocking lenses.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <a href="#collection-grid" className="rounded-xl brand-gradient px-6 py-3 text-sm font-semibold text-white shadow-[var(--shadow-soft)] hover:-translate-y-0.5 transition-all">
                Shop Blue Light Collection
              </a>
              <Link to="/product/blue-light-shield-pro/select-lenses" className="rounded-xl border-2 border-[color:var(--color-brand-primary)] px-6 py-3 text-sm font-semibold text-[color:var(--color-brand-primary)] hover:bg-[color:var(--color-brand-primary)] hover:text-white transition-all">
                Customize Your Prescription
              </Link>
            </div>
          </div>
          <div className="relative h-72 lg:col-span-5 lg:h-full min-h-[320px]">
            <img
              src="https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=1000&auto=format&fit=crop&q=80"
              alt="Blue light glasses hero"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--color-text-primary)]/40 via-transparent to-transparent lg:bg-gradient-to-r" />
          </div>
        </div>
      </section>

      {/* Educational Section 1: How Does Blue Light Affect Us? */}
      <section className="mt-12 rounded-3xl border border-[color:var(--color-border)] bg-[#19130D] p-8 text-white md:p-12 shadow-2xl">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7 space-y-4">
            <h2 className="font-display text-3xl font-bold text-amber-100 md:text-4xl">
              How Does Blue Light Affect Us?
            </h2>
            <p className="text-sm leading-7 text-amber-50/80">
              Blue light is a high-energy visible (HEV) light emitted by smartphones, laptops, TVs, and LED lighting. Long-term exposure to HEV radiation can induce eye fatigue, dry eye syndrome, blurry vision, and circadian rhythm disruption that hinders deep restorative sleep.
            </p>
            <div className="grid grid-cols-3 gap-4 pt-4 text-center">
              <div className="rounded-2xl border border-amber-900/50 bg-white/5 p-4 backdrop-blur-sm">
                <Monitor className="mx-auto h-6 w-6 text-amber-400" />
                <p className="mt-2 text-xs font-semibold text-amber-100">Laptops & PCs</p>
              </div>
              <div className="rounded-2xl border border-amber-900/50 bg-white/5 p-4 backdrop-blur-sm">
                <Smartphone className="mx-auto h-6 w-6 text-amber-400" />
                <p className="mt-2 text-xs font-semibold text-amber-100">Smartphones</p>
              </div>
              <div className="rounded-2xl border border-amber-900/50 bg-white/5 p-4 backdrop-blur-sm">
                <Sun className="mx-auto h-6 w-6 text-amber-400" />
                <p className="mt-2 text-xs font-semibold text-amber-100">LED Lights</p>
              </div>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-amber-900/40 lg:col-span-5">
            <img
              src="https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800&auto=format&fit=crop&q=80"
              alt="Person working on computer"
              className="h-64 w-full object-cover lg:h-80"
            />
          </div>
        </div>
      </section>

      {/* Educational Section 2: Protect Your Eyes */}
      <section className="mt-12 rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8 md:p-12">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
          <div className="overflow-hidden rounded-2xl border border-[color:var(--color-border)] lg:col-span-5">
            <img
              src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80"
              alt="Protect your eyes"
              className="h-64 w-full object-cover lg:h-80"
            />
          </div>
          <div className="lg:col-span-7 space-y-4">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[color:var(--color-brand-primary)]">
              <ShieldCheck className="h-4 w-4" /> Khattak Precision Shield
            </span>
            <h2 className="font-display text-3xl font-bold text-[color:var(--color-text-primary)] md:text-4xl">
              Protect Your Eyes With Blue Light Blocking Glasses
            </h2>
            <p className="text-sm leading-7 text-[color:var(--color-text-secondary)]">
              Our precision-engineered prescription and non-prescription blue light lenses feature multi-layer anti-reflective coatings designed to filter out up to 99% of harmful 400-455nm HEV blue light while maintaining crystal-clear optical clarity and true color perception.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Lens Variant Grid */}
      <section className="mt-12">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold text-[color:var(--color-text-primary)]">
            Blue Light Filtering Lens Options
          </h2>
          <p className="mt-2 text-sm text-[color:var(--color-text-secondary)]">
            Choose the blue light protection tier tailored to your daily screen usage
          </p>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Dark Blue-Cut Lens",
              desc: "Heavy screen protection for night gamers and software engineers.",
              bg: "bg-slate-900 text-white",
              badge: "Max Filter"
            },
            {
              title: "Clear Blue-Cut Lens",
              desc: "Everyday ultra-clear blue light filter for office and study.",
              bg: "bg-[color:var(--color-panel)] text-[color:var(--color-text-primary)]",
              badge: "Popular"
            },
            {
              title: "Sun-Cut Photochromic",
              desc: "Turns dark outdoors in sunlight while blocking indoor blue light.",
              bg: "bg-amber-950/90 text-amber-100",
              badge: "Indoor + Outdoor"
            },
            {
              title: "Photo Dark Blue-Cut",
              desc: "All-in-one maximum transition protection with heavy blue cut.",
              bg: "bg-stone-900 text-white",
              badge: "Ultimate"
            }
          ].map((item, idx) => (
            <div key={idx} className={`flex flex-col justify-between rounded-2xl border border-[color:var(--color-border)] p-6 shadow-md ${item.bg}`}>
              <div>
                <span className="inline-block rounded-full bg-[color:var(--color-brand-primary)]/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[color:var(--color-brand-primary)]">
                  {item.badge}
                </span>
                <h3 className="mt-4 font-display text-xl font-bold">{item.title}</h3>
                <p className="mt-2 text-xs opacity-80 leading-relaxed">{item.desc}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-semibold">
                <span>Prescription Ready</span>
                <Sparkles className="h-4 w-4 text-amber-400" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Technical Feature Comparison Table */}
      <section className="mt-12 overflow-hidden rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 shadow-[var(--shadow-soft)]">
        <h3 className="font-display text-2xl font-bold text-[color:var(--color-text-primary)] text-center mb-6">
          Blue Light Technology Comparison Matrix
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm">
            <thead>
              <tr className="border-b border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-primary)]">
                <th className="p-3.5 font-bold">Lens Feature</th>
                <th className="p-3.5 font-bold text-center">Dark Blue-Cut</th>
                <th className="p-3.5 font-bold text-center">Clear Blue-Cut</th>
                <th className="p-3.5 font-bold text-center">Sun-Cut Photo</th>
                <th className="p-3.5 font-bold text-center">Photo Dark Blue</th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((row, i) => (
                <tr key={i} className="border-b border-[color:var(--color-border)] hover:bg-[color:var(--color-surface-muted)]/50 transition-colors">
                  <td className="p-3.5 font-medium text-[color:var(--color-text-primary)]">{row.feature}</td>
                  <td className="p-3.5 text-center font-bold text-emerald-600">{row.dark}</td>
                  <td className="p-3.5 text-center font-bold text-emerald-600">{row.clear}</td>
                  <td className="p-3.5 text-center font-bold text-emerald-600">{row.photo}</td>
                  <td className="p-3.5 text-center font-bold text-emerald-600">{row.photoDark}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Main Collection Grid */}
      <section id="collection-grid" className="mt-16">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-bold text-[color:var(--color-text-primary)]">
              Blue Light Frames Collection
            </h2>
            <p className="mt-1 text-sm text-[color:var(--color-text-secondary)]">
              {filteredProducts.length} frames ready for custom Blue Light blocking lenses
            </p>
          </div>
        </div>

        <div>
          <ProductToolbar totalProducts={filteredProducts.length} onFilterToggle={() => {}} />
          <div className="mt-5 relative">
            {loading && (
              <div className="py-20 text-center">
                <div className="h-8 w-8 animate-spin mx-auto rounded-full border-4 border-[color:var(--color-brand-primary)] border-t-transparent"></div>
                <p className="mt-2 text-xs text-[color:var(--color-text-tertiary)]">Loading Blue Light Collection...</p>
              </div>
            )}
            {!loading && <ProductGrid products={filteredProducts} />}
            {!loading && filteredProducts.length === 0 && (
              <div className="py-20 text-center text-[color:var(--color-text-secondary)] bg-[color:var(--color-panel)] rounded-2xl border border-[color:var(--color-border)]">
                No frames found in this collection.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Comprehensive FAQ Section */}
      <section className="mt-16 rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8 md:p-12 shadow-[var(--shadow-soft)]">
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[color:var(--color-brand-primary)]">
            <HelpCircle className="h-4 w-4" /> Got Questions?
          </span>
          <h2 className="mt-2 font-display text-3xl font-bold text-[color:var(--color-text-primary)] md:text-4xl">
            Blue Light Glasses FAQs
          </h2>
          <p className="mt-2 text-sm text-[color:var(--color-text-secondary)]">
            Everything you need to know about protecting your eyes from screen glare
          </p>
        </div>

        <div className="mt-8 space-y-4 max-w-4xl mx-auto">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div key={idx} className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-app-bg)] overflow-hidden transition-all">
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between p-5 text-left font-display text-base font-semibold text-[color:var(--color-text-primary)] hover:text-[color:var(--color-brand-primary)]"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`h-5 w-5 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 text-[color:var(--color-brand-primary)]" : "text-[color:var(--color-text-tertiary)]"}`} />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="border-t border-[color:var(--color-border)] px-5 pb-5 pt-3 text-sm leading-relaxed text-[color:var(--color-text-secondary)]">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      <QuickViewModal />
    </div>
  );
}
