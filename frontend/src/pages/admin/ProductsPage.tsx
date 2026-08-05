import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Search, Plus, Download, Upload, MoreHorizontal, Eye, Edit3, Copy, Trash2, SlidersHorizontal, LoaderCircle } from "lucide-react";
import { StatusBadge, StockBadge } from "@/components/admin/StatusBadge";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { cn } from "@/lib/utils";
import { adminGetProductsApi } from "@/lib/api/admin";
import { useToastStore } from "@/lib/stores/toast-store";

const statusFilters = ["All", "Active", "Draft", "Archived"];

export function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [selected, setSelected] = useState<string[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const addToast = useToastStore((s) => s.addToast);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await adminGetProductsApi();
      if (res && res.items) {
        // Map backend schema to frontend table structure
        const formatted = res.items.map((p: any) => ({
          id: p._id,
          name: p.name,
          sku: p.sku || 'N/A',
          category: p.category,
          stock: p.stock || 0,
          price: p.price,
          status: p.status || 'draft',
          featured: p.featured || false,
          image: p.images && p.images.length > 0 ? p.images[0] : 'https://via.placeholder.com/150',
        }));
        setProducts(formatted);
      }
    } catch (error) {
      addToast({ title: "Error", description: "Failed to load products", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const filtered = products.filter((p) => {
    const matchStatus = activeFilter === "All" || p.status === activeFilter.toLowerCase();
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
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

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-[color:var(--color-text-primary)] md:text-3xl">Products</h1>
          <p className="mt-0.5 text-sm text-[color:var(--color-text-secondary)]">{products.length} total products</p>
        </div>
        <Link to="/admin/products/add" className="flex items-center gap-2 rounded-xl bg-[color:var(--color-brand-primary)] px-4 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-black">
          <Plus className="h-4 w-4" /> Add Product
        </Link>
      </div>

      <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)]">
        <div className="flex flex-col gap-4 border-b border-[color:var(--color-border)] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-3">
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--color-text-tertiary)]" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] py-2.5 pl-10 pr-4 text-sm text-[color:var(--color-text-primary)] placeholder:text-[color:var(--color-text-tertiary)] focus:border-[color:var(--color-accent-teal)] focus:outline-none focus:ring-4 focus:ring-[color:var(--color-focus-ring)]" />
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

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[color:var(--color-border)]">
                <th className="px-4 py-3 text-left">
                  <input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} className="h-4 w-4 rounded border-[color:var(--color-border)] text-[color:var(--color-accent-teal)]" />
                </th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-tertiary)]">Product</th>
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
                    <td colSpan={9} className="py-16 text-center">
                      <LoaderCircle className="mx-auto h-8 w-8 animate-spin text-[color:var(--color-brand-primary)]" />
                      <p className="mt-2 text-sm text-[color:var(--color-text-secondary)]">Loading products...</p>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={9} className="py-16 text-center"><Package className="mx-auto h-8 w-8 text-[color:var(--color-text-tertiary)]" /><p className="mt-2 text-sm text-[color:var(--color-text-secondary)]">No products found</p></td></tr>
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
                          <Link to={`/admin/products/${product.id}/edit`} className="flex h-8 w-8 items-center justify-center rounded-lg text-[color:var(--color-text-tertiary)] hover:bg-[color:var(--color-surface-muted)] hover:text-[color:var(--color-accent-teal)]">
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
          <p className="text-xs text-[color:var(--color-text-tertiary)]">Showing {filtered.length} of {products.length} products</p>
          <div className="flex gap-1">
            {[1, 2, 3].map((p) => (
              <button key={p} type="button" className={cn("flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium", p === 1 ? "bg-[color:var(--color-brand-primary)] text-white" : "text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-muted)]")}>{p}</button>
            ))}
          </div>
        </div>
      </div>

      <ConfirmModal open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={removeProduct} title="Delete Product" message="This action cannot be undone. The product will be permanently removed." confirmLabel="Delete" variant="danger" />
    </div>
  );
}
