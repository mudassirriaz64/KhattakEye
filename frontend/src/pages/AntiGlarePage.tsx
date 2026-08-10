import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, HelpCircle, ChevronDown, CheckCircle2, ShieldCheck, Sun, Eye, Zap, RefreshCw } from "lucide-react";
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
    q: "Why is Anti-Glare Coating so Important?",
    a: "Anti-glare (AR) coating eliminates internal and external reflections from your spectacle lenses. This allows 99.5% of light to reach your eyes, providing sharper contrast, clearer vision, reduced halo reflections during night driving, and a transparent look that makes your eyes visible in photos."
  },
  {
    q: "Do Anti-Glare Glasses Help Night Driving?",
    a: "Yes! Night driving glare from oncoming LED headlights and street lamps creates distracting starbursts and reflections. Anti-reflective lenses eliminate these reflections, allowing for safer, clearer, and more comfortable night-time navigation."
  },
  {
    q: "How to Remove Scratches from Anti-Glare Glasses?",
    a: "Anti-reflective coatings should always be cleaned with micro-fiber cloths and specialized optical spray. Never use harsh chemical cleaners or paper towels. Khattak Eyewear AR coatings include a hard-sealed anti-scratch topcoat for extra durability."
  },
  {
    q: "Does Anti-Glare Have Blue Light Filter?",
    a: "All our Anti-Reflective options come bundled with integrated UV400 and blue-light protective layers, giving you total digital and environmental protection in one lens."
  },
  {
    q: "How to Know If the Lenses Have Anti-Reflective Coating?",
    a: "Hold the glasses under a light source. Standard lenses bounce white glare back. Genuine anti-reflective lenses exhibit a subtle green, blue, or violet residual reflection hue."
  }
];

const comparisonData = [
  { feature: "Anti-Glare Rating", dark: "★★★★★", clear: "★★★★☆", photo: "★★★★★" },
  { feature: "Anti-Reflective Coating", dark: "✔", clear: "✔", photo: "✔" },
  { feature: "Night Driving", dark: "✔", clear: "✔", photo: "✔" },
  { feature: "UV Protection", dark: "✔", clear: "✔", photo: "✔" },
  { feature: "Scratch Resistant", dark: "✔", clear: "✔", photo: "✔" },
  { feature: "Coat Cleaning", dark: "✔", clear: "✔", photo: "✔" },
  { feature: "Water Resistant", dark: "✔", clear: "✔", photo: "✔" }
];

const ITEMS_PER_PAGE = 12;

export function AntiGlarePage() {
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
        sub.includes("anti") ||
        sub.includes("reflective") ||
        sub.includes("glare") ||
        cat.includes("lens") ||
        cat.includes("eyeglass") ||
        lensType.includes("anti") ||
        name.includes("anti") ||
        desc.includes("anti-reflective") ||
        desc.includes("glare")
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
      <Breadcrumb items={[{ label: "Shop", path: "/shop" }, { label: "Lenses", path: "/shop/lenses" }, { label: "Anti-Glare Glasses" }]} />

      {/* Hero Banner (Matching Reference Image Section 1) */}
      <section className="mt-6 overflow-hidden rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] shadow-[var(--shadow-soft)]">
        <div className="grid grid-cols-1 items-center lg:grid-cols-12">
          <div className="p-8 lg:col-span-7 lg:p-12">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--color-brand-soft)]/20 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-[color:var(--color-brand-primary)]">
              <Sparkles className="h-3.5 w-3.5" /> High-Clarity Optical Coating
            </span>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-[color:var(--color-text-primary)] md:text-5xl">
              Anti Glare Glasses
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
              Anti-glare lenses or anti-reflective lenses are designed to eliminate reflections from the front and back surface of your lenses. The lens allows more light to pass through your glasses to improve vision and make your eyes look virtually invisible to others. Choose from our wide selection of anti-glare frames starting from Rs. 2,490.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <a href="#antiglare-catalog" className="rounded-xl brand-gradient px-6 py-3 text-sm font-semibold text-white shadow-[var(--shadow-soft)] hover:-translate-y-0.5 transition-all">
                Shop Anti-Glare Collection
              </a>
              <Link to="/product/blue-light-shield-pro/select-lenses" className="rounded-xl border-2 border-[color:var(--color-brand-primary)] px-6 py-3 text-sm font-semibold text-[color:var(--color-brand-primary)] hover:bg-[color:var(--color-brand-primary)] hover:text-white transition-all">
                Customize AR Lenses
              </Link>
            </div>
          </div>
          <div className="relative h-72 lg:col-span-5 lg:h-full min-h-[320px]">
            <img
              src="https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=1000&auto=format&fit=crop&q=80"
              alt="Anti-glare hero"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Feature Section 2: "What are anti-reflective coating glasses?" (Matching Reference Image Section 2) */}
      <section className="mt-12 overflow-hidden rounded-3xl border border-[color:var(--color-border)] bg-[#8C6D38] p-8 text-white md:p-12 shadow-2xl">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7 space-y-4">
            <h2 className="font-display text-3xl font-bold text-amber-100 md:text-4xl">
              What are anti-reflective coating glasses?
            </h2>
            <p className="text-sm leading-7 text-amber-50/90">
              Anti-reflective (AR) coating is an ultra-thin microscopic layer applied directly to the lens surface. It prevents internal ghosting, reflections from artificial lights, monitor flare, and headlight halos during night driving. AR lenses look virtually invisible, allowing people to see your eyes clearly rather than light reflections.
            </p>
            <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-amber-100">
              <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 backdrop-blur-sm">
                <CheckCircle2 className="h-4 w-4 text-amber-300" /> 99.5% Light Transmission
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 backdrop-blur-sm">
                <CheckCircle2 className="h-4 w-4 text-amber-300" /> Zero Night Headlight Halos
              </span>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-amber-300/30 lg:col-span-5">
            <img
              src="https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800&auto=format&fit=crop&q=80"
              alt="Ordinary lens vs Anti-glare lens"
              className="h-64 w-full object-cover lg:h-80"
            />
          </div>
        </div>
      </section>

      {/* Feature Section 3: Lens Tier Cards (Matching Reference Image Section 3) */}
      <section className="mt-12">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold text-[color:var(--color-text-primary)]">
            Anti Glare Glasses Options & Price in Pakistan
          </h2>
          <p className="mt-2 text-sm text-[color:var(--color-text-secondary)]">
            Select the anti-reflective lens tier tailored to your vision needs
          </p>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {[
            {
              title: "DARK ANTI GLARE LENSES",
              desc: "Maximum glare reduction for high screen time & night driving.",
              img: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=80",
              badge: "Max Anti-Glare"
            },
            {
              title: "CLEAR ANTI GLARE LENSES",
              desc: "Ultra-clear 99.5% light transmission for daily crystal vision.",
              img: "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=600&auto=format&fit=crop&q=80",
              badge: "Ultra Clear"
            },
            {
              title: "PHOTO ANTI GLARE LENSES",
              desc: "Transitions dark in sunlight with full anti-reflective indoors.",
              img: "https://images.unsplash.com/photo-1577803645773-f96470509666?w=600&auto=format&fit=crop&q=80",
              badge: "Photochromic"
            }
          ].map((item, idx) => (
            <div key={idx} className="overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] shadow-md">
              <div className="relative h-60">
                <img src={item.img} alt={item.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-4">
                  <div>
                    <span className="rounded-full bg-[color:var(--color-brand-primary)] px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                      {item.badge}
                    </span>
                    <h3 className="mt-1 font-display text-lg font-bold text-white">{item.title}</h3>
                  </div>
                </div>
              </div>
              <div className="p-4 text-xs text-[color:var(--color-text-secondary)]">
                {item.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Technical Rating Matrix */}
      <section className="mt-12 overflow-hidden rounded-3xl border border-[color:var(--color-border)] bg-[#19130D] p-6 text-white shadow-2xl">
        <h3 className="font-display text-2xl font-bold text-amber-100 text-center mb-6">
          Anti-Glare Coating Rating Matrix
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm">
            <thead>
              <tr className="border-b border-amber-900/50 bg-white/5 text-amber-100">
                <th className="p-3.5 font-bold">Anti Glare Lens Feature</th>
                <th className="p-3.5 font-bold text-center">Dark Anti Glare</th>
                <th className="p-3.5 font-bold text-center">Clear Anti Glare</th>
                <th className="p-3.5 font-bold text-center">Photo Anti Glare</th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((row, i) => (
                <tr key={i} className="border-b border-amber-900/30 hover:bg-white/5 transition-colors">
                  <td className="p-3.5 font-medium text-amber-50/90">{row.feature}</td>
                  <td className="p-3.5 text-center font-bold text-amber-300">{row.dark}</td>
                  <td className="p-3.5 text-center font-bold text-amber-300">{row.clear}</td>
                  <td className="p-3.5 text-center font-bold text-amber-300">{row.photo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Main Product Catalog Section */}
      <section id="antiglare-catalog" className="mt-16">
        <div className="mb-6">
          <h2 className="font-display text-3xl font-bold text-[color:var(--color-text-primary)]">
            Anti-Glare Frames Collection
          </h2>
          <p className="mt-1 text-sm text-[color:var(--color-text-secondary)]">
            Showing {paginatedProducts.length} of {filteredProducts.length} frames optimized for Anti-Reflective coatings
          </p>
        </div>

        <div>
          <ProductToolbar totalProducts={filteredProducts.length} onFilterToggle={() => {}} />

          <div className="mt-6 relative">
            {loading ? (
              <div className="py-20 text-center">
                <div className="h-8 w-8 animate-spin mx-auto rounded-full border-4 border-[color:var(--color-brand-primary)] border-t-transparent"></div>
                <p className="mt-2 text-xs text-[color:var(--color-text-tertiary)]">Loading Anti-Glare Frames...</p>
              </div>
            ) : (
              <>
                <ProductGrid products={paginatedProducts} />
                {filteredProducts.length === 0 && (
                  <div className="py-20 text-center text-[color:var(--color-text-secondary)] bg-[color:var(--color-panel)] rounded-2xl border border-[color:var(--color-border)]">
                    No anti-glare frames currently available.
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
          <span>Anti Glare Glasses Price in Pakistan</span>
          <ChevronDown className={`h-5 w-5 transition-transform ${openPriceAccordion ? "rotate-180 text-[color:var(--color-brand-primary)]" : ""}`} />
        </button>
        <AnimatePresence>
          {openPriceAccordion && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
              <div className="mt-4 border-t border-[color:var(--color-border)] pt-4 text-sm leading-relaxed text-[color:var(--color-text-secondary)] space-y-2">
                <div className="flex justify-between py-1 border-b border-[color:var(--color-border)]">
                  <span>Clear Anti-Reflective Lenses</span>
                  <span className="font-semibold text-[color:var(--color-text-primary)]">Rs. 2,490</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[color:var(--color-border)]">
                  <span>Dark Blue Anti-Glare Lenses</span>
                  <span className="font-semibold text-[color:var(--color-text-primary)]">Rs. 3,500</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Photochromic Anti-Glare Transition Lenses</span>
                  <span className="font-semibold text-[color:var(--color-text-primary)]">Rs. 4,990</span>
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
            Anti Glare Glasses FAQs
          </h2>
          <p className="mt-2 text-sm text-[color:var(--color-text-secondary)]">
            Everything you need to know about Anti-Reflective lens technology
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
