import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Search, Plus, Edit3, Trash2, RotateCcw, LoaderCircle, ChevronLeft, ChevronRight, ChevronDown, X, ClipboardList, Layers } from "lucide-react";
import { StatusBadge, StockBadge } from "@/components/admin/StatusBadge";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { cn } from "@/lib/utils";
import {
  adminGetProductsApi,
  adminDeleteProductApi,
  adminRestoreProductApi,
  adminPermanentDeleteProductApi,
  getCategoriesApi,
  adminGetBrandsApi,
  type AdminProductFilters,
} from "@/lib/api/admin";
import type { ApiCategory } from "@/lib/admin-data";
import { useToastStore } from "@/lib/stores/toast-store";
import { resolveCloudinaryUrl, productImageFallback } from "@/lib/api/products";

const statusFilters = ["All", "Active", "Draft", "Archived", "Trash"];

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
  const statusParam = searchParams.get("status");
  const initialFilter = statusParam && statusFilters.includes(statusParam) ? statusParam : "All";
  const [activeFilter, setActiveFilter] = useState(initialFilter);

  useEffect(() => {
    const statusParam = searchParams.get("status");
    if (statusParam && statusFilters.includes(statusParam)) {
      setActiveFilter(statusParam);
    }
  }, [searchParams]);

  const [selected, setSelected] = useState<string[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [permanentDeleteId, setPermanentDeleteId] = useState<string | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
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
      const isTrash = activeFilter === "Trash";
      const filters: AdminProductFilters = {
        kind: kindFilter,
        category: categoryFilter,
        subcategory: subcategoryFilter,
        brand: brandFilter,
        stock: stockFilter,
        featured: featuredFilter,
        search: debouncedSearch || undefined,
        trashed: isTrash ? "true" : undefined,
      };
      const res = await adminGetProductsApi(pageToLoad, 50, filters);
      if (res && res.items) {
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
          image: p.images && p.images.length > 0 ? resolveCloudinaryUrl(p.images[0]) : productImageFallback(p.name || 'eyewear'),
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
    setSelected([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, page, debouncedSearch, activeFilter]);

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
    if (activeFilter === "Trash") return true;
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

  const removeProduct = async () => {
    if (deleteId) {
      try {
        await adminDeleteProductApi(deleteId);
        addToast({ title: "Moved to Trash", description: "Product has been moved to trash.", type: "success" });
        await fetchProducts(page);
      } catch {
        addToast({ title: "Error", description: "Failed to delete product.", type: "error" });
      } finally {
        setDeleteId(null);
      }
    }
  };

  const handleRestore = async (id: string) => {
    try {
      await adminRestoreProductApi(id);
      addToast({ title: "Restored", description: "Product restored successfully.", type: "success" });
      await fetchProducts(page);
    } catch {
      addToast({ title: "Error", description: "Failed to restore product.", type: "error" });
    }
  };

  const handlePermanentDelete = async () => {
    if (permanentDeleteId) {
      try {
        await adminPermanentDeleteProductApi(permanentDeleteId);
        addToast({ title: "Permanently Deleted", description: "Product and Cloudinary assets removed permanently.", type: "success" });
        await fetchProducts(page);
      } catch {
        addToast({ title: "Error", description: "Failed to permanently delete product.", type: "error" });
      } finally {
        setPermanentDeleteId(null);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selected.length === 0) return;
    const isTrash = activeFilter === "Trash";
    try {
      if (isTrash) {
        await Promise.all(selected.map((id) => adminPermanentDeleteProductApi(id)));
        addToast({ title: "Permanently Deleted", description: `${selected.length} products permanently deleted.`, type: "success" });
      } else {
        await Promise.all(selected.map((id) => adminDeleteProductApi(id)));
        addToast({ title: "Moved to Trash", description: `${selected.length} products moved to trash.`, type: "success" });
      }
      setSelected([]);
      await fetchProducts(page);
    } catch {
      addToast({ title: "Error", description: "Failed to delete selected products.", type: "error" });
    } finally {
      setBulkDeleteOpen(false);
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
          <p className="mt-1 text-sm text-[color:var(--color-text-secondary)]">Manage your inventory, pricing, media, and trash</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link to="/admin/products/add-glasses" className="flex items-center gap-1.5 rounded-xl bg-[color:var(--color-brand-primary)] px-3.5 py-2.5 text-xs font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-black shadow-xs">
            <Plus className="h-4 w-4" /> Add Glasses
          </Link>
          <Link to="/admin/products/add-lenses" className="flex items-center gap-1.5 rounded-xl bg-teal-600 px-3.5 py-2.5 text-xs font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-teal-700 shadow-xs">
            <Plus className="h-4 w-4" /> Add Contact Lenses
          </Link>
        </div>
      </div>

      <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-4 sm:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-1 rounded-xl bg-[color:var(--color-surface-muted)] p-1">
            {statusFilters.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => {
                  setActiveFilter(tab);
                  setPage(1);
                }}
                className={cn(
                  "rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all",
                  activeFilter === tab
                    ? "bg-[color:var(--color-panel)] text-[color:var(--color-brand-primary)] shadow-sm"
                    : "text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)]"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative flex-1 md:max-w-xs">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--color-text-tertiary)]" />
            <input
              type="text"
              placeholder="Search products by name or SKU..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] py-2 pl-9 pr-4 text-xs text-[color:var(--color-text-primary)] placeholder-[color:var(--color-text-tertiary)] focus:outline-none focus:ring-4 focus:ring-[color:var(--color-focus-ring)]"
            />
          </div>
        </div>

        {/* Filters bar */}
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[color:var(--color-border)] pt-4">
          <FilterSelect label="All Kinds" value={kindFilter} onChange={(v) => updateFilter("kind", v)} options={[{ value: "glasses", label: "Glasses" }, { value: "lenses", label: "Contact Lenses" }]} />
          <FilterSelect label="All Categories" value={categoryFilter} onChange={(v) => updateFilter("category", v)} options={categoryOptions.map((c) => ({ value: c.slug, label: c.name }))} />
          {subcategoryOptions.length > 0 && <FilterSelect label="All Subcategories" value={subcategoryFilter} onChange={(v) => updateFilter("subcategory", v)} options={subcategoryOptions} />}
          <FilterSelect label="All Brands" value={brandFilter} onChange={(v) => updateFilter("brand", v)} options={brands.map((b) => ({ value: b, label: b }))} />
          <FilterSelect label="Stock Status" value={stockFilter} onChange={(v) => updateFilter("stock", v)} options={[{ value: "in-stock", label: "In Stock" }, { value: "out-of-stock", label: "Out of Stock" }, { value: "preorder", label: "Preorder" }]} />
          <FilterSelect label="Featured" value={featuredFilter} onChange={(v) => updateFilter("featured", v)} options={[{ value: "true", label: "Featured" }, { value: "false", label: "Not Featured" }]} />

          {hasActiveFilters && (
            <button type="button" onClick={clearAllFilters} className="flex items-center gap-1 text-xs font-semibold text-[color:var(--color-danger)] hover:underline">
              <X className="h-3.5 w-3.5" /> Clear filters
            </button>
          )}
        </div>

        {chips.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-[color:var(--color-text-tertiary)]">Active:</span>
            {chips.map((chip) => (
              <span key={chip.key} className="inline-flex items-center gap-1 rounded-lg border border-[color:var(--color-accent-teal)]/30 bg-[color:var(--color-accent-teal)]/10 px-2 py-0.5 text-[11px] font-medium text-[color:var(--color-accent-teal)]">
                {chip.label}: {chip.value}
                <button type="button" onClick={() => updateFilter(chip.key, "")} className="hover:opacity-70">
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Selection / Bulk Actions Bar */}
        {selected.length > 0 && (
          <div className="mt-4 flex items-center justify-between rounded-xl bg-red-500/10 p-3 border border-red-500/20 text-xs">
            <span className="font-semibold text-red-700">
              {selected.length} {selected.length === 1 ? "product" : "products"} selected
            </span>
            <button
              type="button"
              onClick={() => setBulkDeleteOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 font-semibold text-white transition-all hover:bg-red-700 shadow-sm"
            >
              <Trash2 className="h-3.5 w-3.5" />
              {activeFilter === "Trash" ? `Permanently Delete Selected (${selected.length})` : `Delete Selected (${selected.length})`}
            </button>
          </div>
        )}

        {/* Table */}
        <div className="mt-4 overflow-x-auto rounded-xl border border-[color:var(--color-border)]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)]">
                <th className="w-10 px-4 py-3">
                  <input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} className="h-4 w-4 rounded border-[color:var(--color-border)] text-[color:var(--color-accent-teal)]" />
                </th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-tertiary)]">Product</th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-tertiary)]">Kind</th>
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
                    <tr><td colSpan={10} className="py-16 text-center"><Package className="mx-auto h-8 w-8 text-[color:var(--color-text-tertiary)]" /><p className="mt-2 text-sm text-[color:var(--color-text-secondary)]">{activeFilter === "Trash" ? "Trash is empty" : "No products found"}</p></td></tr>
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
                          {activeFilter === "Trash" ? (
                            <>
                              <button type="button" onClick={() => handleRestore(product.id)} title="Restore Product" className="flex h-8 w-8 items-center justify-center rounded-lg text-emerald-600 hover:bg-emerald-50">
                                <RotateCcw className="h-3.5 w-3.5" />
                              </button>
                              <button type="button" onClick={() => setPermanentDeleteId(product.id)} title="Delete Permanently" className="flex h-8 w-8 items-center justify-center rounded-lg text-red-600 hover:bg-red-50">
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </>
                          ) : (
                            <>
                              <Link to={`/admin/inventory?search=${encodeURIComponent(product.sku)}`} title="Manage Inventory" className="flex h-8 w-8 items-center justify-center rounded-lg text-[color:var(--color-text-tertiary)] hover:bg-[color:var(--color-surface-muted)] hover:text-[color:var(--color-accent-teal)]">
                                <ClipboardList className="h-3.5 w-3.5" />
                              </Link>
                              <Link to={product.kind === "lenses" ? `/admin/products/${product.id}/edit-lenses` : `/admin/products/${product.id}/edit-glasses`} title="Edit Product" className="flex h-8 w-8 items-center justify-center rounded-lg text-[color:var(--color-text-tertiary)] hover:bg-[color:var(--color-surface-muted)] hover:text-[color:var(--color-accent-teal)]">
                                <Edit3 className="h-3.5 w-3.5" />
                              </Link>
                              <button type="button" onClick={() => setDeleteId(product.id)} title="Move to Trash" className="flex h-8 w-8 items-center justify-center rounded-lg text-[color:var(--color-text-tertiary)] hover:bg-[color:var(--color-surface-muted)] hover:text-[color:var(--color-danger)]">
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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

      {/* Confirm Modals */}
      <ConfirmModal open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={removeProduct} title="Move Product to Trash" message="This product will be hidden from the public storefront and moved to the Trash view. You can restore it anytime." confirmLabel="Move to Trash" variant="danger" />
      <ConfirmModal open={!!permanentDeleteId} onClose={() => setPermanentDeleteId(null)} onConfirm={handlePermanentDelete} title="Permanently Delete Product" message="WARNING: This action is permanent and cannot be undone. The product and all attached Cloudinary images/videos will be completely destroyed." confirmLabel="Delete Permanently" variant="danger" />
      <ConfirmModal
        open={bulkDeleteOpen}
        onClose={() => setBulkDeleteOpen(false)}
        onConfirm={handleBulkDelete}
        title={activeFilter === "Trash" ? `Permanently Delete ${selected.length} Products` : `Move ${selected.length} Products to Trash`}
        message={activeFilter === "Trash" ? `WARNING: This action is permanent and cannot be undone. All ${selected.length} selected products and their Cloudinary media will be destroyed.` : `Are you sure you want to move ${selected.length} selected products to Trash?`}
        confirmLabel={activeFilter === "Trash" ? `Permanently Delete (${selected.length})` : `Move (${selected.length}) to Trash`}
        variant="danger"
      />
    </div>
  );
}
