import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Search, Plus, Download, Upload, Eye, Edit3, Copy, Trash2, LoaderCircle, ChevronLeft, ChevronRight, ChevronDown, X } from "lucide-react";
import { StatusBadge, StockBadge } from "@/components/admin/StatusBadge";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { cn } from "@/lib/utils";
import { adminGetProductsApi, getCategoriesApi, adminGetBrandsApi, type AdminProductFilters } from "@/lib/api/admin";
import type { ApiCategory } from "@/lib/admin-data";
import { useToastStore } from "@/lib/stores/toast-store";

const statusFilters = ["All", "Active", "Draft", "Archived"];

const stockLabels: Record<string, string> = {
  "in-stock": "In Stock",
  "out-of-stock": "Out of Stock",
  preorder: "Preorder",
};

type FilterOption = { value: string; label: string };

type ProductRow = {
  id: string;
  name: string;
  kind: string;
  sku: string;
  category: string;
  stock: number;
  price: number;
  status: string;
  featured: boolean;
  image: string;
};

const FilterSelect = ({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: FilterOption[] }) => (
  <div className="relative min-w-[130px]">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "w-full appearance-none rounded-xl border bg-[color:var(--color-surface-muted)] py-2 pl-3 pr-8 text-xs font-medium focus:outline-none focus:ring-4 focus:ring-[color:var(--color-focus-ring)]",
        value
          ? "border-[color:var(--color-accent-teal)] text-[color:var(--color-text-primary)]"
          : "border-[color:var(--color-border)] text-[color:var(--color-text-secondary)]"
      )}
    >
      <option value="">{label}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
    <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[color:var(--color-text-tertiary)]" />
  </div>
);

export function AdminProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [selected, setSelected] = useState<string[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const addToast = useToastStore((s) => s.addToast);

  const kindFilter = searchParams.get("kind") || "";
  const categoryFilter = searchParams.get("category") || "";
  const subcategoryFilter = searchParams.get("subcategory") || "";
  const brandFilter = searchParams.get("brand") || "";
  const stockFilter = searchParams.get("stock") || "";
  const featuredFilter = searchParams.get("featured") || "";

  const hasActiveFilters = !![kindFilter, categoryFilter, subcategoryFilter, brandFilter, stockFilter, featuredFilter].find(Boolean);

  useEffect(() => {
    getCategoriesApi().then((data) => {
      if (Array.isArray(data)) setCategories(data);
    }).catch(() => {});
    adminGetBrandsApi().then((data) => {
      if (Array.isArray(data)) setBrands(data.map((b: { name: string }) => b.name));
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchInput.trim()), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const fetchProducts = async (pageToLoad = 1) => {
    try {
      setLoading(true);
      const filters: AdminProductFilters = {
        kind: kindFilter,
        category: categoryFilter,
        subcategory: subcategoryFilter,
        brand: brandFilter,
        stock: stockFilter,
        featured: featuredFilter,
        search: debouncedSearch || undefined,
      };
      const res = await adminGetProductsApi(pageToLoad, 50, filters);
      if (res && res.items) {
        // Map backend schema to frontend table structure
        const formatted = res.items.map((p: {
          _id: string;
          name: string;
          kind?: string;
          sku?: string;
          category: string;
          stock?: number;
          price: number;
          status?: string;
          featured?: boolean;
          images?: string[];
        }) => ({
          id: p._id,
          name: p.name,
          kind: p.kind || 'glasses',
          sku: p.sku || 'N/A',
          category: p.category,
          stock: p.stock || 0,
          price: p.price,
          status: p.status || 'draft',
          featured: p.featured || false,
          image: p.images && p.images.length > 0 ? p.images[0] : 'https://via.placeholder.com/150',
        }));
        setProducts(formatted);
        setTotal(res.total || 0);
        setPage(res.page || pageToLoad);
        setTotalPages(res.totalPages || 1);
      }
    } catch {
      addToast({ title: "Error", description: "Failed to load products", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, page, debouncedSearch]);

  const updateFilter = (key: keyof AdminProductFilters, value: string) => {
    const next = new URLSearchParams(searchParams.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    if (key === "kind") {
      next.delete("category");
      next.delete("subcategory");
    }
    if (key === "category") {
      next.delete("subcategory");
    }
    setSearchParams(next, { replace: true });
    setPage(1);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams(), { replace: true });
    setPage(1);
  };

  const categoryOptions = categories.filter((c) => (!c.type || c.type === "category") && (!kindFilter || c.productKind === kindFilter));
  const selectedCategory = categories.find((c) => c.slug === categoryFilter);
  const subcategoryOptions: FilterOption[] = (selectedCategory?.subcategories || []).map((s) => ({ value: s.slug, label: s.name }));

  const chips: { key: keyof AdminProductFilters; label: string; value: string }[] = [];
  if (kindFilter) chips.push({ key: "kind", label: "Kind", value: kindFilter === "lenses" ? "Lenses" : "Glasses" });
  if (categoryFilter) chips.push({ key: "category", label: "Category", value: selectedCategory?.name || categoryFilter });
  if (subcategoryFilter) {
    const sub = (selectedCategory?.subcategories || []).find((s) => s.slug === subcategoryFilter);
    chips.push({ key: "subcategory", label: "Subcategory", value: sub?.name || subcategoryFilter });
  }
  if (brandFilter) chips.push({ key: "brand", label: "Brand", value: brandFilter });
  if (stockFilter) chips.push({ key: "stock", label: "Stock", value: stockLabels[stockFilter] || stockFilter });
  if (featuredFilter) chips.push({ key: "featured", label: "Featured", value: featuredFilter === "true" ? "Yes" : "No" });

  const filtered = products.filter((p) => {
    const matchStatus = activeFilter === "All" || p.status === activeFilter.toLowerCase();
    const matchSearch = !debouncedSearch || p.name.toLowerCase().includes(debouncedSearch.toLowerCase()) || p.sku.toLowerCase().includes(debouncedSearch.toLowerCase());
    return matchStatus && matchSearch;
  });

  const toggleAll = () => {
    if (selected.length === filtered.length) setSelected([]);
    else setSelected(filtered.map((p) => p.id));
  };

  const toggleOne = (id: string) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const removeProduct = () => {
    if (deleteId) {
      setProducts((prev) => prev.filter((p) => p.id !== deleteId));
      setDeleteId(null);
    }
  };

  const goToPage = (p: number) => {
    if (p < 1 || p > totalPages || p === page) return;
    setPage(p);
  };

  const getPageNumbers = (): (number | "...")[] => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }
    pages.push(1);
    if (page > 3) pages.push("...");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-[color:var(--color-text-primary)] md:text-3xl">Products</h1>
          <p className="mt-0.5 text-sm text-[color:var(--color-text-secondary)]">{total} total products</p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/admin/products/add-glasses" className="flex items-center gap-1.5 rounded-xl bg-[color:var(--color-brand-primary)] px-3.5 py-2.5 text-xs font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-black">
            <Plus className="h-4 w-4" /> Add Glasses
          </Link>
          <Link to="/admin/products/add-lenses" className="flex items-center gap-1.5 rounded-xl bg-teal-600 px-3.5 py-2.5 text-xs font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-teal-700">
            <Plus className="h-4 w-4" /> Add Contact Lenses
          </Link>
        </div>
      </div>

      <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)]">
        <div className="flex flex-col gap-4 border-b border-[color:var(--color-border)] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-3">
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--color-text-tertiary)]" />
              <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Search products..." className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] py-2.5 pl-10 pr-4 text-sm text-[color:var(--color-text-primary)] placeholder:text-[color:var(--color-text-tertiary)] focus:border-[color:var(--color-accent-teal)] focus:outline-none focus:ring-4 focus:ring-[color:var(--color-focus-ring)]" />
            </div>
            <div className="flex gap-1.5">
              {statusFilters.map((f) => (
                <button key={f} type="button" onClick={() => setActiveFilter(f)} className={cn("rounded-lg px-3 py-1.5 text-xs font-medium transition-colors", activeFilter === f ? "bg-[color:var(--color-brand-primary)] text-white" : "bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)]")}>{f}</button>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button type="button" className="flex items-center gap-1.5 rounded-xl border border-[color:var(--color-border)] px-3.5 py-2 text-xs font-medium text-[color:var(--color-text-secondary)] transition-colors hover:bg-[color:var(--color-surface-muted)]">
              <Upload className="h-3.5 w-3.5" /> Import
            </button>
            <button type="button" className="flex items-center gap-1.5 rounded-xl border border-[color:var(--color-border)] px-3.5 py-2 text-xs font-medium text-[color:var(--color-text-secondary)] transition-colors hover:bg-[color:var(--color-surface-muted)]">
              <Download className="h-3.5 w-3.5" /> Export
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-b border-[color:var(--color-border)] p-4">
          <FilterSelect label="Kind" value={kindFilter} onChange={(v) => updateFilter("kind", v)} options={[{ value: "glasses", label: "Glasses" }, { value: "lenses", label: "Lenses" }]} />
          <FilterSelect label="Category" value={categoryFilter} onChange={(v) => updateFilter("category", v)}           options={categoryOptions.map((c) => ({ value: c.slug, label: c.name }))} />
          <FilterSelect label="Subcategory" value={subcategoryFilter} onChange={(v) => updateFilter("subcategory", v)} options={subcategoryOptions} />
          <FilterSelect label="Brand" value={brandFilter} onChange={(v) => updateFilter("brand", v)} options={brands.map((b) => ({ value: b, label: b }))} />
          <FilterSelect label="Stock" value={stockFilter} onChange={(v) => updateFilter("stock", v)} options={[{ value: "in-stock", label: "In Stock" }, { value: "out-of-stock", label: "Out of Stock" }, { value: "preorder", label: "Preorder" }]} />
          <FilterSelect label="Featured" value={featuredFilter} onChange={(v) => updateFilter("featured", v)} options={[{ value: "true", label: "Yes" }, { value: "false", label: "No" }]} />
        </div>

        {chips.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 border-b border-[color:var(--color-border)] px-4 py-3">
            {chips.map((c) => (
              <span key={c.key} className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--color-surface-muted)] px-3 py-1 text-xs font-medium text-[color:var(--color-text-primary)]">
                <span className="text-[color:var(--color-text-tertiary)]">{c.label}:</span> {c.value}
                <button type="button" onClick={() => updateFilter(c.key, "")} className="text-[color:var(--color-text-tertiary)] hover:text-[color:var(--color-danger)]">
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            <button type="button" onClick={clearAllFilters} className="ml-1 text-xs font-medium text-[color:var(--color-accent-teal)] hover:underline">Clear all</button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[color:var(--color-border)]">
                <th className="px-4 py-3 text-left">
                  <input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} className="h-4 w-4 rounded border-[color:var(--color-border)] text-[color:var(--color-accent-teal)]" />
                </th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-tertiary)]">Product</th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-tertiary)]">Type</th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-tertiary)]">SKU</th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-tertiary)]">Category</th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-tertiary)]">Stock</th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-tertiary)]">Price</th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-tertiary)]">Status</th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-tertiary)]">Featured</th>
                <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-tertiary)]">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {loading ? (
                  <tr>
                    <td colSpan={10} className="py-16 text-center">
                      <LoaderCircle className="mx-auto h-8 w-8 animate-spin text-[color:var(--color-brand-primary)]" />
                      <p className="mt-2 text-sm text-[color:var(--color-text-secondary)]">Loading products...</p>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  hasActiveFilters ? (
                    <tr><td colSpan={10} className="py-16 text-center">
                      <Package className="mx-auto h-8 w-8 text-[color:var(--color-text-tertiary)]" />
                      <p className="mt-2 text-sm text-[color:var(--color-text-secondary)]">No products match these filters</p>
                      <button type="button" onClick={clearAllFilters} className="mt-3 rounded-xl bg-[color:var(--color-brand-primary)] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-black">Clear Filters</button>
                    </td></tr>
                  ) : (
                    <tr><td colSpan={10} className="py-16 text-center"><Package className="mx-auto h-8 w-8 text-[color:var(--color-text-tertiary)]" /><p className="mt-2 text-sm text-[color:var(--color-text-secondary)]">No products found</p></td></tr>
                  )
                ) : (
                  filtered.map((product, i) => (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: i * 0.02 }}
                      className="border-b border-[color:var(--color-border)] transition-colors last:border-0 hover:bg-[color:var(--color-surface-muted)]"
                    >
                      <td className="px-4 py-3">
                        <input type="checkbox" checked={selected.includes(product.id)} onChange={() => toggleOne(product.id)} className="h-4 w-4 rounded border-[color:var(--color-border)] text-[color:var(--color-accent-teal)]" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={product.image} alt="" className="h-10 w-10 rounded-lg object-cover" />
                          <span className="text-sm font-medium text-[color:var(--color-text-primary)]">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn("inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider", product.kind === "lenses" ? "bg-teal-500/10 text-teal-600" : "bg-amber-500/10 text-amber-600")}>
                          {product.kind === "lenses" ? "Lenses" : "Glasses"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-[color:var(--color-text-tertiary)]">{product.sku}</td>
                      <td className="px-4 py-3 text-xs text-[color:var(--color-text-tertiary)]">{product.category}</td>
                      <td className="px-4 py-3"><StockBadge stock={product.stock} /></td>
                      <td className="px-4 py-3 text-sm font-semibold">Rs. {product.price.toLocaleString()}</td>
                      <td className="px-4 py-3"><StatusBadge status={product.status} /></td>
                      <td className="px-4 py-3"><StatusBadge status={product.featured ? "yes" : "no"} /></td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link to={`/admin/products/${product.id}`} className="flex h-8 w-8 items-center justify-center rounded-lg text-[color:var(--color-text-tertiary)] hover:bg-[color:var(--color-surface-muted)] hover:text-[color:var(--color-accent-blue)]">
                            <Eye className="h-3.5 w-3.5" />
                          </Link>
                          <Link to={product.kind === "lenses" ? `/admin/products/${product.id}/edit-lenses` : `/admin/products/${product.id}/edit-glasses`} className="flex h-8 w-8 items-center justify-center rounded-lg text-[color:var(--color-text-tertiary)] hover:bg-[color:var(--color-surface-muted)] hover:text-[color:var(--color-accent-teal)]">
                            <Edit3 className="h-3.5 w-3.5" />
                          </Link>
                          <button type="button" className="flex h-8 w-8 items-center justify-center rounded-lg text-[color:var(--color-text-tertiary)] hover:bg-[color:var(--color-surface-muted)] hover:text-[color:var(--color-accent-teal)]">
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                          <button type="button" onClick={() => setDeleteId(product.id)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[color:var(--color-text-tertiary)] hover:bg-[color:var(--color-surface-muted)] hover:text-[color:var(--color-danger)]">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-[color:var(--color-border)] px-4 py-3">
          <p className="text-xs text-[color:var(--color-text-tertiary)]">Showing {filtered.length} of {total} products</p>
          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button type="button" disabled={page <= 1} onClick={() => goToPage(page - 1)} className={cn("flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium", page <= 1 ? "cursor-not-allowed text-[color:var(--color-text-tertiary)] opacity-40" : "text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-muted)]")}>
                <ChevronLeft className="h-4 w-4" />
              </button>
              {getPageNumbers().map((p, i) => (
                p === "..." ? (
                  <span key={`ellipsis-${i}`} className="px-1 text-xs text-[color:var(--color-text-tertiary)]">…</span>
                ) : (
                  <button key={p} type="button" onClick={() => goToPage(p)} className={cn("flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium", p === page ? "bg-[color:var(--color-brand-primary)] text-white" : "text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-muted)]")}>{p}</button>
                )
              ))}
              <button type="button" disabled={page >= totalPages} onClick={() => goToPage(page + 1)} className={cn("flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium", page >= totalPages ? "cursor-not-allowed text-[color:var(--color-text-tertiary)] opacity-40" : "text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-muted)]")}>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={removeProduct} title="Delete Product" message="This action cannot be undone. The product will be permanently removed." confirmLabel="Delete" variant="danger" />
    </div>
  );
}
