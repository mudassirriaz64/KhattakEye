import { useEffect, useRef, useState } from "react";
import { Search, X, TrendingUp, Clock, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useUiStore } from "@/lib/stores/ui-store";

const popularSearches = [
  "Titanium frames",
  "Aviator sunglasses",
  "Blue light glasses",
  "Prescription eyewear",
  "Round frames",
];

const trendingProducts = [
  { name: "Noir Line Titanium", price: "Rs. 28,500" },
  { name: "Verde Artisan Acetate", price: "Rs. 19,900" },
  { name: "Rose Gold Aviator", price: "Rs. 32,000" },
];

export function SearchOverlay() {
  const searchOpen = useUiStore((state) => state.searchOpen);
  const setSearchOpen = useUiStore((state) => state.setSearchOpen);
  const recentSearches = useUiStore((state) => state.recentSearches);
  const addRecentSearch = useUiStore((state) => state.addRecentSearch);
  const clearRecentSearches = useUiStore((state) => state.clearRecentSearches);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (term: string) => {
    if (term.trim()) addRecentSearch(term.trim());
  };

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setQuery("");
    }
    return () => { document.body.style.overflow = ""; };
  }, [searchOpen]);

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[60] bg-[color:var(--color-app-bg)]/95 backdrop-blur-2xl"
        >
          <div className="mx-auto max-w-3xl px-4 pt-20 md:pt-28">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[color:var(--color-text-secondary)]" />
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleSearch(query); }}
                    placeholder="Search eyewear, collections, brands..."
                    className="w-full rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] py-5 pl-14 pr-5 text-lg text-[color:var(--color-text-primary)] shadow-[var(--shadow-soft)] outline-none transition-all placeholder:text-[color:var(--color-text-tertiary)] focus:border-[color:var(--color-accent-blue)] focus:ring-4 focus:ring-[color:var(--color-focus-ring)]"
                  />
              </div>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-[color:var(--color-border)] text-[color:var(--color-text-secondary)] transition-colors hover:bg-[color:var(--color-surface-muted)] hover:text-[color:var(--color-text-primary)]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-10 grid gap-10 md:grid-cols-2">
              <div>
                <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--color-text-secondary)]">
                  <TrendingUp className="h-3 w-3" />
                  Popular Searches
                </div>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => { setQuery(term); handleSearch(term); }}
                      className="rounded-full border border-[color:var(--color-border)] px-4 py-2 text-sm text-[color:var(--color-text-secondary)] transition-colors hover:border-[color:var(--color-accent-teal)] hover:text-[color:var(--color-accent-teal)]"
                    >
                      {term}
                    </button>
                  ))}
                </div>
                <div className="mt-8">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--color-text-secondary)]">
                      <Clock className="h-3 w-3" />
                      Recent Searches
                    </div>
                    {recentSearches.length > 0 && (
                      <button
                        type="button"
                        onClick={clearRecentSearches}
                        className="text-[10px] text-[color:var(--color-text-tertiary)] hover:text-[color:var(--color-text-primary)]"
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                  {recentSearches.length === 0 ? (
                    <p className="text-sm text-[color:var(--color-text-tertiary)]">No recent searches</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((term) => (
                        <button
                          key={term}
                          type="button"
                          onClick={() => { setQuery(term); handleSearch(term); }}
                          className="rounded-full border border-[color:var(--color-border)] px-4 py-2 text-sm text-[color:var(--color-text-secondary)] transition-colors hover:border-[color:var(--color-accent-teal)] hover:text-[color:var(--color-accent-teal)]"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--color-text-secondary)]">
                  Trending Products
                </div>
                <div className="space-y-3">
                  {trendingProducts.map((product) => (
                    <Link
                      key={product.name}
                      to="/shop"
                      onClick={() => setSearchOpen(false)}
                      className="flex items-center justify-between rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-5 py-4 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]"
                    >
                      <span className="text-sm font-medium text-[color:var(--color-text-primary)]">
                        {product.name}
                      </span>
                      <span className="text-sm text-[color:var(--color-text-secondary)]">
                        {product.price}
                      </span>
                    </Link>
                  ))}
                </div>
                <Link
                  to="/shop"
                  onClick={() => setSearchOpen(false)}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[color:var(--color-accent-teal)] transition-colors hover:text-[color:var(--color-text-primary)]"
                >
                  Browse all products
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
