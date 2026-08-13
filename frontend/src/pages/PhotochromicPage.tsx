import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, HelpCircle, ChevronDown, CheckCircle2, ShieldCheck, Sparkles, Eye, Moon, Zap } from "lucide-react";
import { Breadcrumb } from "@/components/shop/Breadcrumb";
import { ProductToolbar } from "@/components/shop/ProductToolbar";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { Pagination } from "@/components/shared/Pagination";
import { QuickViewModal } from "@/components/quickview/QuickViewModal";
import { useShopStore } from "@/lib/stores/shop-store";
import { getProducts, mapProductCard } from "@/lib/api/products";
import { type Product } from "@/lib/shop-data";

const faqs = [
  {
    q: "How do Photochromic / Transition Lenses work?",
    a: "Photochromic lenses contain billions of micro-photochromic molecules (such as silver halide or oxazines). When exposed to ultraviolet (UV) sunlight outdoors, these molecules undergo a chemical reaction that causes them to darken rapidly. Indoors, away from UV light, the lenses quickly fade back to 100% clear."
  },
  {
    q: "Are Photochromic Lenses Good for the Eyes?",
    a: "Yes! Photochromic lenses provide continuous 100% protection against UVA and UVB rays while dynamically adjusting tint levels to prevent eye squinting, fatigue, and glare-induced eye strain in bright light."
  },
  {
    q: "Who should wear Photochromic Lenses?",
    a: "Anyone who frequently transitions between indoor environments (office, home, classroom) and outdoor sunlight will love transition lenses. They eliminate the hassle of carrying two separate pairs of glasses."
  },
  {
    q: "What is the difference between Photochromic and Polarized Lenses?",
    a: "Photochromic lenses change tint automatically based on UV exposure (clear indoors, dark outdoors). Polarized lenses have a fixed dark tint that specifically eliminates horizontal blinding glare (ideal for driving or water sports)."
  },
  {
    q: "What colors do Transition Lenses come in?",
    a: "Our photochromic lenses are available in Classic Grey, Warm Brown, Emerald Green, and Sapphire Blue transition tints."
  },
  {
    q: "How fast do Transition Lenses darken and clear?",
    a: "Khattak High-Definition Photochromic lenses darken in under 30 seconds outdoors and clear back to transparent indoors within 2-3 minutes."
  }
];

const comparisonData = [
  { feature: "UV Protection", glass: "★★★★★", plastic: "★★★★★", hd: "★★★★★" },
  { feature: "Sun Tint Darkness", glass: "★★★☆☆", plastic: "★★★★☆", hd: "★★★★★" },
  { feature: "Clear Indoor Clarity", glass: "★★★★☆", plastic: "★★★★★", hd: "★★★★★" },
  { feature: "Fade Speed Back to Clear", glass: "★★★☆☆", plastic: "★★★★☆", hd: "★★★★★" },
  { feature: "Anti-Glare Coating", glass: "✔", plastic: "✔", hd: "✔" },
  { feature: "Scratch Resistant", glass: "✔", plastic: "✔", hd: "✔" },
  { feature: "Light Weight", glass: "✖", plastic: "✔", hd: "✔" }
];

const ITEMS_PER_PAGE = 12;

export function PhotochromicPage() {
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [openPriceAccordion, setOpenPriceAccordion] = useState(false);

  const priceRange = useShopStore((s) => s.priceRange);
  const sortBy = useShopStore((s) => s.sortBy);

  useEffect(() => {
    setLoading(true);
    getProducts({ limit: 100 }).then((data) => {
      if (data && data.items) {
        const mapped = data.items.map(mapProductCard) as unknown as Product[];
        setDbProducts(mapped);
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...dbProducts];

    result = result.filter((p) => {
      const cat = (p.category || "").toLowerCase();
      const sub = (p.subcategory || "").toLowerCase();
      const name = (p.name || "").toLowerCase();
      const desc = (p.description || "").toLowerCase();
      const lensType = (p.lensType || "").toLowerCase();

      return (
        sub.includes("photo") ||
        sub.includes("transition") ||
        cat.includes("photo") ||
        cat.includes("transition") ||
        lensType.includes("photo") ||
        lensType.includes("transition") ||
        name.includes("photo") ||
        name.includes("transition") ||
        desc.includes("photochromic") ||
        desc.includes("transition")
      );
    });

    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    if (sortBy === "price-asc") result.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") result.sort((a, b) => b.price - a.price);
    if (sortBy === "rating") result.sort((a, b) => b.rating - a.rating);

    return result;
  }, [dbProducts, priceRange, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 700, behavior: "smooth" });
  };

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 md:px-8">
      <Breadcrumb items={[{ label: "Shop", path: "/shop" }, { label: "Lenses", path: "/shop/lenses" }, { label: "Photochromic Glasses" }]} />

      {/* Hero Banner (Matching Reference Image Section 1) */}
      <section className="mt-6 overflow-hidden rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] shadow-[var(--shadow-soft)]">
        <div className="grid grid-cols-1 items-center lg:grid-cols-12">
          <div className="p-8 lg:col-span-7 lg:p-12">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--color-brand-soft)]/20 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-[color:var(--color-brand-primary)]">
              <Sun className="h-3.5 w-3.5" /> Smart Adaptive Optics
            </span>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-[color:var(--color-text-primary)] md:text-5xl">
              Photochromic Glasses
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
              Photochromic lenses are optical lenses that darken automatically when exposed to ultraviolet (UV) sunlight outdoors. They fade back to crystal clear indoors away from UV light. These smart lenses offer 2-in-1 convenience, giving you clear prescription vision indoors and stylish sunglasses outdoors without carrying two separate pairs.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <a href="#photochromic-catalog" className="rounded-xl brand-gradient px-6 py-3 text-sm font-semibold text-white shadow-[var(--shadow-soft)] hover:-translate-y-0.5 transition-all">
                Shop Photochromic Collection
              </a>
              <Link to="/product/blue-light-shield-pro/select-lenses" className="rounded-xl border-2 border-[color:var(--color-brand-primary)] px-6 py-3 text-sm font-semibold text-[color:var(--color-brand-primary)] hover:bg-[color:var(--color-brand-primary)] hover:text-white transition-all">
                Customize Transition Lenses
              </Link>
            </div>
          </div>
          <div className="relative h-72 lg:col-span-5 lg:h-full min-h-[320px]">
            <img
              src="https://images.unsplash.com/photo-1577803645773-f96470509666?w=1000&auto=format&fit=crop&q=80"
              alt="Photochromic transition hero"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Feature Section 2: "How do photochromic glasses work?" (Matching Reference Image Section 2) */}
      <section className="mt-12 overflow-hidden rounded-3xl border border-[color:var(--color-border)] bg-[#19130D] p-8 text-white md:p-12 shadow-2xl">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7 space-y-4">
            <h2 className="font-display text-3xl font-bold text-amber-100 md:text-4xl">
              How do photochromic glasses work?
            </h2>
            <p className="text-sm leading-7 text-amber-50/80">
              Photochromic lenses contain billions of embedded micro-molecules that remain clear until hit by UV rays. Outdoors, sunlight triggers these molecules to instantly darken the lens. Indoors, away from UV light, the molecules revert back to clear. This dynamic optical adjustment ensures 100% UV protection and glare elimination in any environment.
            </p>
            <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-amber-200">
              <span className="flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1.5 border border-amber-500/20">
                <Sun className="h-4 w-4 text-amber-400" /> UV-Activated Tinting
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1.5 border border-amber-500/20">
                <Moon className="h-4 w-4 text-amber-400" /> 100% Clear Indoors
              </span>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-amber-900/40 lg:col-span-5">
            <img
              src="https://images.unsplash.com/photo-1508296695146-257a814070b4?w=800&auto=format&fit=crop&q=80"
              alt="Transition lens in sunlight"
              className="h-64 w-full object-cover lg:h-80"
            />
          </div>
        </div>
      </section>

      {/* Feature Section 3: "Photochromic Glasses Price in Pakistan" Banner */}
      <section className="mt-12 overflow-hidden rounded-3xl border border-[color:var(--color-border)] bg-[#A36D48] p-8 text-white md:p-12 shadow-2xl">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7 space-y-4">
            <h2 className="font-display text-3xl font-bold text-amber-100 md:text-4xl">
              Photochromic Glasses Price in Pakistan
            </h2>
            <p className="text-sm leading-7 text-amber-50/90">
              Khattak Eyewear offers high-quality transition lenses in Pakistan at affordable prices. Choose between clear-to-grey, clear-to-brown, and clear-to-blue options starting from Rs. 4,990. Perfect for indoor work and outdoor sun protection in one seamless pair.
            </p>
          </div>
          <div className="overflow-hidden rounded-2xl border border-amber-300/30 lg:col-span-5">
            <img
              src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80"
              alt="Transition woman glasses"
              className="h-64 w-full object-cover lg:h-80"
            />
          </div>
        </div>
      </section>

      {/* Transition Lens Variant Visuals (3 Tiers from reference) */}
      <section className="mt-12">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold text-[color:var(--color-text-primary)]">
            Glass & Plastic Photochromic Options
          </h2>
          <p className="mt-2 text-sm text-[color:var(--color-text-secondary)]">
            Clear indoors, dark outdoors — 3 progressive lens tech tiers
          </p>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {[
            {
              title: "Glass Photochromic Lenses",
              desc: "Traditional mineral glass photochromic lenses with extreme scratch durability.",
              fade: ["bg-white", "bg-gray-400", "bg-gray-800"]
            },
            {
              title: "Anti-Glare Plastic Photochromic",
              desc: "Lightweight polymer photochromic lenses with integrated anti-reflective coating.",
              fade: ["bg-white", "bg-stone-400", "bg-stone-800"]
            },
            {
              title: "High Definition Plastic Photochromic",
              desc: "Fastest transition technology with ultra-dark outdoor tinting & 99.9% UV block.",
              fade: ["bg-white", "bg-zinc-400", "bg-zinc-900"]
            }
          ].map((item, idx) => (
            <div key={idx} className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 shadow-md">
              <h3 className="font-display text-lg font-bold text-[color:var(--color-text-primary)]">{item.title}</h3>
              <p className="mt-2 text-xs text-[color:var(--color-text-secondary)]">{item.desc}</p>
              <div className="mt-6 flex items-center justify-center gap-3">
                {item.fade.map((colorClass, i) => (
                  <div key={i} className={`h-12 w-12 rounded-full border border-[color:var(--color-border)] ${colorClass} shadow-inner flex items-center justify-center text-[10px] font-bold text-gray-500`}>
                    {i === 0 ? "Clear" : i === 1 ? "Mid" : "Dark"}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Technical Comparison Rating Table */}
      <section className="mt-12 overflow-hidden rounded-3xl border border-[color:var(--color-border)] bg-[#19130D] p-6 text-white shadow-2xl">
        <h3 className="font-display text-2xl font-bold text-amber-100 text-center mb-6">
          Photochromic Lens Performance Comparison
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm">
            <thead>
              <tr className="border-b border-amber-900/50 bg-white/5 text-amber-100">
                <th className="p-3.5 font-bold">Performance Feature</th>
                <th className="p-3.5 font-bold text-center">Mineral Glass</th>
                <th className="p-3.5 font-bold text-center">Anti-Glare Plastic</th>
                <th className="p-3.5 font-bold text-center">HD Plastic</th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((row, i) => (
                <tr key={i} className="border-b border-amber-900/30 hover:bg-white/5 transition-colors">
                  <td className="p-3.5 font-medium text-amber-50/90">{row.feature}</td>
                  <td className="p-3.5 text-center font-bold text-amber-300">{row.glass}</td>
                  <td className="p-3.5 text-center font-bold text-amber-300">{row.plastic}</td>
                  <td className="p-3.5 text-center font-bold text-amber-300">{row.hd}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Main Product Catalog Section */}
      <section id="photochromic-catalog" className="mt-16">
        <div className="mb-6">
          <h2 className="font-display text-3xl font-bold text-[color:var(--color-text-primary)]">
            Photochromic Frames Collection
          </h2>
          <p className="mt-1 text-sm text-[color:var(--color-text-secondary)]">
            Showing {paginatedProducts.length} of {filteredProducts.length} frames ready for custom Transition lenses
          </p>
        </div>

        <div>
          <ProductToolbar totalProducts={filteredProducts.length} onFilterToggle={() => {}} />

          <div className="mt-6 relative">
            {loading ? (
              <div className="py-20 text-center">
                <div className="h-8 w-8 animate-spin mx-auto rounded-full border-4 border-[color:var(--color-brand-primary)] border-t-transparent"></div>
                <p className="mt-2 text-xs text-[color:var(--color-text-tertiary)]">Loading Photochromic Frames...</p>
              </div>
            ) : (
              <>
                <ProductGrid products={paginatedProducts} />
                {filteredProducts.length === 0 && (
                  <div className="py-20 text-center text-[color:var(--color-text-secondary)] bg-[color:var(--color-panel)] rounded-2xl border border-[color:var(--color-border)]">
                    No photochromic frames currently available.
                  </div>
                )}
              </>
            )}
          </div>

          {/* Pagination Controls (1, 2, 3...) */}
          {!loading && totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center border-t border-[color:var(--color-border)] pt-8">
              <Pagination current={currentPage} total={totalPages} onChange={handlePageChange} />
            </div>
          )}
        </div>
      </section>

      {/* Price Accordion Section */}
      <section className="mt-16 rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 shadow-[var(--shadow-soft)]">
        <button
          type="button"
          onClick={() => setOpenPriceAccordion(!openPriceAccordion)}
          className="flex w-full items-center justify-between text-left font-display text-lg font-bold text-[color:var(--color-text-primary)]"
        >
          <span>Photochromic Glasses Price in Pakistan</span>
          <ChevronDown className={`h-5 w-5 transition-transform ${openPriceAccordion ? "rotate-180 text-[color:var(--color-brand-primary)]" : ""}`} />
        </button>
        <AnimatePresence>
          {openPriceAccordion && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
              <div className="mt-4 border-t border-[color:var(--color-border)] pt-4 text-sm leading-relaxed text-[color:var(--color-text-secondary)] space-y-2">
                <div className="flex justify-between py-1 border-b border-[color:var(--color-border)]">
                  <span>Standard Plastic Photochromic Lenses</span>
                  <span className="font-semibold text-[color:var(--color-text-primary)]">Rs. 4,990</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[color:var(--color-border)]">
                  <span>Anti-Glare Photochromic Lenses</span>
                  <span className="font-semibold text-[color:var(--color-text-primary)]">Rs. 5,990</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>High-Definition Fast Transition Lenses</span>
                  <span className="font-semibold text-[color:var(--color-text-primary)]">Rs. 7,490</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Comprehensive FAQs Section */}
      <section className="mt-8 rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8 md:p-12 shadow-[var(--shadow-soft)]">
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[color:var(--color-brand-primary)]">
            <HelpCircle className="h-4 w-4" /> Got Questions?
          </span>
          <h2 className="mt-2 font-display text-3xl font-bold text-[color:var(--color-text-primary)] md:text-4xl">
            Photochromic Glasses FAQs
          </h2>
          <p className="mt-2 text-sm text-[color:var(--color-text-secondary)]">
            Everything you need to know about Transition & Photochromic technology
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
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
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
