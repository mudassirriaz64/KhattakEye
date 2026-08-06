import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, X } from "lucide-react";
import { Breadcrumb } from "@/components/shop/Breadcrumb";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { QuickViewModal } from "@/components/quickview/QuickViewModal";
import { getProducts, mapProductCard } from "@/lib/api/products";
import { type Product } from "@/lib/shop-data";

export function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [localQuery, setLocalQuery] = useState(query);
  const [liveProducts, setLiveProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.trim()) {
      setLoading(true);
      getProducts({ q: query.trim(), limit: 50 })
        .then((res) => {
          const mapped = (res.items || []).map(mapProductCard) as unknown as Product[];
          setLiveProducts(mapped);
        })
        .catch(() => setLiveProducts([]))
        .finally(() => setLoading(false));
    } else {
      setLiveProducts([]);
    }
  }, [query]);

  const results = liveProducts;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(localQuery ? { q: localQuery } : {});
  };

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-10 md:px-8">
      <Breadcrumb items={query ? [{ label: "Search", path: "/search" }, { label: `"${query}"` }] : [{ label: "Search" }]} />

      <div className="mt-6">
        <h1 className="font-display text-3xl text-[color:var(--color-text-primary)] md:text-4xl">Search Results</h1>

        <form onSubmit={handleSearch} className="mt-6">
          <div className="relative mx-auto max-w-2xl">
            <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[color:var(--color-text-tertiary)]" />
            <input
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              placeholder="Search eyewear, collections, brands..."
              className="w-full rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] py-4 pl-14 pr-12 text-base text-[color:var(--color-text-primary)] shadow-[var(--shadow-soft)] outline-none transition-all placeholder:text-[color:var(--color-text-tertiary)] focus:border-[color:var(--color-accent-blue)] focus:ring-4 focus:ring-[color:var(--color-focus-ring)]"
            />
            {localQuery && (
              <button type="button" onClick={() => setLocalQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-[color:var(--color-text-tertiary)] hover:text-[color:var(--color-text-primary)]">
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </form>
      </div>

      {query && (
        <p className="mt-6 text-sm text-[color:var(--color-text-secondary)]">
          {loading ? "Searching..." : `${results.length} ${results.length === 1 ? "result" : "results"} for `}
          {!loading && <span className="font-medium text-[color:var(--color-text-primary)]">"{query}"</span>}
        </p>
      )}

      <div className="mt-6">
        {query ? (
          loading ? (
            <div className="py-20 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[color:var(--color-surface-muted)]">
                <Search className="h-10 w-10 text-[color:var(--color-text-tertiary)]" />
              </div>
              <p className="mt-6 font-display text-2xl text-[color:var(--color-text-primary)]">Searching...</p>
            </div>
          ) : results.length > 0 ? (
            <ProductGrid products={results} />
          ) : (
            <div className="py-20 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[color:var(--color-surface-muted)]">
                <Search className="h-10 w-10 text-[color:var(--color-text-tertiary)]" />
              </div>
              <p className="mt-6 font-display text-2xl text-[color:var(--color-text-primary)]">No results found</p>
              <p className="mt-2 text-sm text-[color:var(--color-text-secondary)]">Try adjusting your search terms or browse our categories.</p>
            </div>
          )
        ) : (
          <div className="py-20 text-center">
            <p className="text-sm text-[color:var(--color-text-secondary)]">Enter a search term to find products.</p>
          </div>
        )}
      </div>

      <QuickViewModal />
    </div>
  );
}
