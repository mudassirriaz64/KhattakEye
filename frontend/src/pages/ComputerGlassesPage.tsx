import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Monitor, HelpCircle, ChevronDown, CheckCircle2, ShieldCheck, Eye } from "lucide-react";
import { Breadcrumb } from "@/components/shop/Breadcrumb";
import { ProductToolbar } from "@/components/shop/ProductToolbar";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { Pagination } from "@/components/shared/Pagination";
import { QuickViewModal } from "@/components/quickview/QuickViewModal";
import { useShopStore } from "@/lib/stores/shop-store";
import { getProducts, mapProductCard } from "@/lib/api/products";
import { type Product } from "@/lib/shop-data";
import axios from "@/lib/api/axios";

const faqs = [
  {
    q: "Do Computer Glasses Really Work?",
    a: "Yes! Computer glasses are specialized eyewear designed with anti-reflective and blue-light filtering technology to protect your eyes from artificial screen radiation. They significantly reduce digital eye strain, blurry vision, dry eyes, and headaches caused by prolonged screen usage."
  },
  {
    q: "What is the difference between Computer Glasses and Regular Glasses?",
    a: "Regular prescription glasses correct distance or reading vision, but computer glasses are specifically optimized for intermediate screen distances (approx. 20-26 inches). They also incorporate anti-glare coatings and blue-light blocking filters that standard clear lenses lack."
  },
  {
    q: "Can I wear Computer Glasses all day long?",
    a: "Absolutely. Khattak Eyewear computer lenses are built on high-clarity polymer bases. They can be worn comfortably throughout the day for both screen work and outdoor activities."
  },
  {
    q: "How to order online Computer Glasses in Pakistan?",
    a: "Browse our Computer Glasses collection below, select your preferred frame, click 'Select Lenses', enter your prescription (or choose non-prescription 0.00 power), and select 'Computer & Blue Cut' lens. We craft and deliver your glasses right to your doorstep."
  },
  {
    q: "What is the price range of Computer Glasses in Pakistan?",
    a: "At Khattak Eyewear, our complete computer glasses (frame + specialized anti-glare blue-light filtering lenses) start from Rs. 2,490 up to premium designer titanium frames."
  }
];

const ITEMS_PER_PAGE = 12;

export function ComputerGlassesPage() {
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [dynamicFaqs, setDynamicFaqs] = useState<{ q: string; a: string }[]>(faqs);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [openAccordion, setOpenAccordion] = useState(false);

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

    axios.get("/faqs?page=computer")
      .then((res) => {
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          setDynamicFaqs(res.data.map((f: { question: string; answer: string }) => ({ q: f.question, a: f.answer })));
        }
      })
      .catch(() => {});
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...dbProducts];

    // Filter to computer / blue-light / eyeglasses products
    result = result.filter((p) => {
      const cat = (p.category || "").toLowerCase();
      const sub = (p.subcategory || "").toLowerCase();
      const name = (p.name || "").toLowerCase();
      const desc = (p.description || "").toLowerCase();
      const lensType = (p.lensType || "").toLowerCase();

      return (
        sub.includes("computer") ||
        sub.includes("blue") ||
        cat.includes("computer") ||
        cat.includes("eyeglass") ||
        cat.includes("lens") ||
        name.includes("computer") ||
        desc.includes("computer") ||
        lensType.includes("computer")
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
    window.scrollTo({ top: 600, behavior: "smooth" });
  };

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 md:px-8">
      <Breadcrumb items={[{ label: "Shop", path: "/shop" }, { label: "Lenses", path: "/shop/lenses" }, { label: "Computer Glasses" }]} />

      {/* Hero Banner (Matching Reference Image Section 1) */}
      <section className="mt-6 overflow-hidden rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] shadow-[var(--shadow-soft)]">
        <div className="grid grid-cols-1 items-center lg:grid-cols-12">
          <div className="p-8 lg:col-span-7 lg:p-12">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--color-brand-soft)]/20 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-[color:var(--color-brand-primary)]">
              <Monitor className="h-3.5 w-3.5" /> Digital Ergonomics
            </span>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-[color:var(--color-text-primary)] md:text-5xl">
              Computer Glasses
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
              It key to be noted that long term use of digital screens can cause vision problems on a daily basis. Wearing screen glasses for computer users not only protects your eyes from harmful rays but also helps you to sleep better. We offer a wide range of computer glasses in Pakistan from top brands starting from Rs. 2,490.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <a href="#computer-catalog" className="rounded-xl brand-gradient px-6 py-3 text-sm font-semibold text-white shadow-[var(--shadow-soft)] hover:-translate-y-0.5 transition-all">
                Shop Computer Glasses
              </a>
              <Link to="/product/blue-light-shield-pro/select-lenses" className="rounded-xl border-2 border-[color:var(--color-brand-primary)] px-6 py-3 text-sm font-semibold text-[color:var(--color-brand-primary)] hover:bg-[color:var(--color-brand-primary)] hover:text-white transition-all">
                Add Computer Lenses
              </Link>
            </div>
          </div>
          <div className="relative h-72 lg:col-span-5 lg:h-full min-h-[320px]">
            <img
              src="https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=1000&auto=format&fit=crop&q=80"
              alt="Computer glasses hero"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Feature Section: "Do Computer Glasses Really Work?" (Matching Reference Image Section 2) */}
      <section className="mt-12 overflow-hidden rounded-3xl border border-[color:var(--color-border)] bg-[#19130D] p-8 text-white md:p-12 shadow-2xl">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
          <div className="overflow-hidden rounded-2xl border border-amber-900/40 lg:col-span-5">
            <img
              src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80"
              alt="Computer glasses ray reflection"
              className="h-64 w-full object-cover lg:h-80"
            />
          </div>
          <div className="lg:col-span-7 space-y-4">
            <h2 className="font-display text-3xl font-bold text-amber-100 md:text-4xl">
              Do Computer Glasses Really Work?
            </h2>
            <p className="text-sm leading-7 text-amber-50/80">
              Yes, computer glasses help to reduce digital eye strain by filtering high-energy HEV screen radiation. Unlike standard clear lenses, computer glasses have specialized anti-reflective coatings that block glare from monitors, smartphones, and office LED lighting. This relaxes eye accommodation muscles, preventing headaches and double vision during long work shifts.
            </p>
            <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-amber-200">
              <span className="flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1.5 border border-amber-500/20">
                <CheckCircle2 className="h-4 w-4 text-amber-400" /> Anti-Glare Coating
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1.5 border border-amber-500/20">
                <CheckCircle2 className="h-4 w-4 text-amber-400" /> UV400 Protection
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1.5 border border-amber-500/20">
                <CheckCircle2 className="h-4 w-4 text-amber-400" /> Hydrophobic Coating
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Product Catalog Section */}
      <section id="computer-catalog" className="mt-16">
        <div className="mb-6">
          <h2 className="font-display text-3xl font-bold text-[color:var(--color-text-primary)]">
            Computer Glasses Collection
          </h2>
          <p className="mt-1 text-sm text-[color:var(--color-text-secondary)]">
            Showing {paginatedProducts.length} of {filteredProducts.length} frames optimized for computer lenses
          </p>
        </div>

        <div>
          <ProductToolbar totalProducts={filteredProducts.length} onFilterToggle={() => {}} />

          <div className="mt-6 relative">
            {loading ? (
              <div className="py-20 text-center">
                <div className="h-8 w-8 animate-spin mx-auto rounded-full border-4 border-[color:var(--color-brand-primary)] border-t-transparent"></div>
                <p className="mt-2 text-xs text-[color:var(--color-text-tertiary)]">Loading Computer Glasses...</p>
              </div>
            ) : (
              <>
                <ProductGrid products={paginatedProducts} />
                {filteredProducts.length === 0 && (
                  <div className="py-20 text-center text-[color:var(--color-text-secondary)] bg-[color:var(--color-panel)] rounded-2xl border border-[color:var(--color-border)]">
                    No computer frames currently available.
                  </div>
                )}
              </>
            )}
          </div>

          {/* Pagination Controls (Page 1, Page 2, Page 3...) */}
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
          onClick={() => setOpenAccordion(!openAccordion)}
          className="flex w-full items-center justify-between text-left font-display text-lg font-bold text-[color:var(--color-text-primary)]"
        >
          <span>Screen Glasses or Computer Glasses Price in Pakistan</span>
          <ChevronDown className={`h-5 w-5 transition-transform ${openAccordion ? "rotate-180 text-[color:var(--color-brand-primary)]" : ""}`} />
        </button>
        <AnimatePresence>
          {openAccordion && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
              <div className="mt-4 border-t border-[color:var(--color-border)] pt-4 text-sm leading-relaxed text-[color:var(--color-text-secondary)] space-y-2">
                <p>Computer glasses in Pakistan range from Rs. 2,490 for standard blue-light blocking frames to Rs. 15,000+ for high-index anti-reflective progressive lenses from luxury Atelier collections.</p>
                <p>All frames include a free protective hard case, micro-fiber cleaning cloth, and 14-day warranty.</p>
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
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-sm text-[color:var(--color-text-secondary)]">
            Everything you need to know about Computer & Screen Glasses
          </p>
        </div>

        <div className="mt-8 space-y-4 max-w-4xl mx-auto">
          {dynamicFaqs.map((faq, idx) => {
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
