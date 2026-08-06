import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, AlertTriangle, Plus, Minus, History } from "lucide-react";
import type { InventoryItem, InventoryHistory } from "@/lib/admin-data";
import { StockBadge } from "@/components/admin/StatusBadge";
import { cn } from "@/lib/utils";
import { getPublicProductsApi, adminUpdateProductApi } from "@/lib/api/admin";

const stockFilters = ["All", "In Stock", "Low Stock", "Out of Stock"];

type ApiProduct = {
  _id?: string;
  id?: string;
  sku?: string;
  name: string;
  images?: string[];
  category?: string;
  stock?: number;
  updatedAt?: string;
};

export function AdminInventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState("All");
  const [showHistory, setShowHistory] = useState(false);
  const [selectedSku, setSelectedSku] = useState<string | null>(null);
  const [editStock, setEditStock] = useState<{ id: string; value: number } | null>(null);

  useEffect(() => {
    getPublicProductsApi(1, 1000).then((data) => {
      if (data && data.items) {
        const mapped: InventoryItem[] = data.items.map((p: ApiProduct) => {
          const stock = p.stock !== undefined ? p.stock : 10;
          const status = stock === 0 ? "out-of-stock" : stock <= 5 ? "low-stock" : "in-stock";
          return {
            id: p._id || p.id,
            sku: p.sku || `KT-${p._id?.substring(0, 6) || "INV"}`,
            name: p.name,
            image: p.images && p.images[0] ? p.images[0] : "",
            category: p.category || "Sunglasses",
            stock,
            reserved: 0,
            available: stock,
            reorderPoint: 5,
            lowStockThreshold: 5,
            status,
            lastRestocked: p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : new Date().toLocaleDateString()
          };
        });
        setItems(mapped);
        setTotal(data.total || mapped.length);
      }
    }).catch(() => {});
  }, []);

  const updateStock = async (id: string, delta: number) => {
    const target = items.find((i) => i.id === id);
    if (!target) return;
    const newStock = Math.max(0, target.stock + delta);
    setItems((prev) => prev.map((item) => {
      if (item.id !== id) return item;
      const status: "in-stock" | "low-stock" | "out-of-stock" = newStock === 0 ? "out-of-stock" : newStock <= item.lowStockThreshold ? "low-stock" : "in-stock";
      return { ...item, stock: newStock, available: newStock - item.reserved, status };
    }));
    try {
      await adminUpdateProductApi(id, { stock: newStock });
    } catch (err) {
      console.error("Failed to update stock:", err);
    }
  };

  const bulkUpdate = (amount: number) => {
    setItems((prev) => prev.map((item) => {
      if (item.status !== "low-stock") return item;
      const newStock = item.stock + amount;
      const status: "in-stock" | "low-stock" | "out-of-stock" = newStock <= item.lowStockThreshold ? "low-stock" : "in-stock";
      return { ...item, stock: newStock, available: newStock - item.reserved, status };
    }));
  };

  const lowStockItems = items.filter((i) => i.status === "low-stock" || i.status === "out-of-stock");
  const filtered = items.filter((item) => {
    const matchesSearch = !search || item.name.toLowerCase().includes(search.toLowerCase()) || item.sku.toLowerCase().includes(search.toLowerCase());
    const matchesStock = stockFilter === "All" || (stockFilter === "In Stock" && item.status === "in-stock") || (stockFilter === "Low Stock" && item.status === "low-stock") || (stockFilter === "Out of Stock" && item.status === "out-of-stock");
    return matchesSearch && matchesStock;
  });
  const histForItem: InventoryHistory[] = [];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-[color:var(--color-text-primary)] md:text-3xl">Inventory</h1>
          <p className="mt-0.5 text-sm text-[color:var(--color-text-secondary)]">{total} products · {lowStockItems.length} need attention</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => setShowHistory(!showHistory)} className="flex items-center gap-2 rounded-xl border border-[color:var(--color-border)] px-4 py-2.5 text-xs font-medium text-[color:var(--color-text-secondary)] transition-colors hover:bg-[color:var(--color-surface-muted)]">
            <History className="h-4 w-4" /> {showHistory ? "Stock View" : "History"}
          </button>
          {lowStockItems.length > 0 && !showHistory && (
            <button type="button" onClick={() => bulkUpdate(10)} className="flex items-center gap-2 rounded-xl bg-[color:var(--color-accent-teal)] px-4 py-2.5 text-xs font-semibold text-white">
              <Plus className="h-4 w-4" /> Restock Low ({lowStockItems.length})
            </button>
          )}
        </div>
      </div>

      {lowStockItems.length > 0 && !showHistory && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex items-center gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-500" />
          <p className="text-sm text-amber-700"><span className="font-semibold">{lowStockItems.length} products</span> are running low on stock or are out of stock.</p>
        </motion.div>
      )}

      {!showHistory ? (
        <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)]">
          <div className="flex flex-col gap-4 border-b border-[color:var(--color-border)] p-4 sm:flex-row sm:items-center">
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--color-text-tertiary)]" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search inventory..." className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] py-2.5 pl-10 pr-4 text-sm" />
            </div>
            <div className="flex gap-1">
              {stockFilters.map((f) => (
                <button key={f} type="button" onClick={() => setStockFilter(f)} className={cn("rounded-lg px-3 py-1.5 text-xs font-medium transition-colors", stockFilter === f ? "bg-[color:var(--color-brand-primary)] text-white" : "bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)]")}>{f}</button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[color:var(--color-border)]">
                  {["Product", "SKU", "Stock", "Reserved", "Available", "Status", "Last Restocked", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-tertiary)]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filtered.map((item, i) => (
                    <motion.tr key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }} className="border-b border-[color:var(--color-border)] transition-colors last:border-0 hover:bg-[color:var(--color-surface-muted)]">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={item.image} alt="" className="h-10 w-10 rounded-lg object-cover" />
                          <span className="text-sm font-medium text-[color:var(--color-text-primary)]">{item.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-[color:var(--color-text-tertiary)]">{item.sku}</td>
                      <td className="px-4 py-3">
                        {editStock?.id === item.id ? (
                          <div className="flex items-center gap-1">
                            <button type="button" onClick={() => updateStock(item.id, -1)} className="flex h-7 w-7 items-center justify-center rounded-lg border text-xs"><Minus className="h-3 w-3" /></button>
                            <span className="w-8 text-center text-sm font-bold">{editStock.value}</span>
                            <button type="button" onClick={() => updateStock(item.id, 1)} className="flex h-7 w-7 items-center justify-center rounded-lg border text-xs"><Plus className="h-3 w-3" /></button>
                            <button type="button" onClick={() => setEditStock(null)} className="ml-1 text-[10px] text-[color:var(--color-accent-teal)]">Done</button>
                          </div>
                        ) : (
                          <button type="button" onClick={() => setEditStock({ id: item.id, value: item.stock })} className="text-sm font-semibold text-[color:var(--color-text-primary)] hover:text-[color:var(--color-accent-teal)]">{item.stock}</button>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-[color:var(--color-text-tertiary)]">{item.reserved}</td>
                      <td className="px-4 py-3 text-sm font-medium">{item.available}</td>
                      <td className="px-4 py-3"><StockBadge stock={item.stock} /></td>
                      <td className="px-4 py-3 text-xs text-[color:var(--color-text-tertiary)]">{item.lastRestocked}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button type="button" onClick={() => { setSelectedSku(item.sku); setShowHistory(true); }} className="flex h-8 w-8 items-center justify-center rounded-lg text-[color:var(--color-text-tertiary)] hover:bg-[color:var(--color-surface-muted)] hover:text-[color:var(--color-accent-teal)]">
                            <History className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base text-[color:var(--color-text-primary)]">
              {selectedSku ? `History — ${selectedSku}` : "Inventory History"}
            </h3>
            <div className="flex gap-2">
              {selectedSku && (
                <button type="button" onClick={() => setSelectedSku(null)} className="text-xs text-[color:var(--color-text-tertiary)] hover:text-[color:var(--color-text-primary)]">Show All</button>
              )}
              <button type="button" onClick={() => setShowHistory(false)} className="text-xs text-[color:var(--color-accent-teal)] hover:underline">Back to Stock</button>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {histForItem.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[color:var(--color-border)] p-6 text-center">
                <History className="mx-auto h-6 w-6 text-[color:var(--color-text-tertiary)]" />
                <p className="mt-2 text-xs text-[color:var(--color-text-secondary)]">No inventory history available yet.</p>
              </div>
            ) : (
            histForItem.map((h) => (
              <div key={h.id} className="flex items-center justify-between rounded-xl bg-[color:var(--color-surface-muted)] p-3">
                <div className="flex items-center gap-3">
                  <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold", h.type === "restock" ? "bg-emerald-500/10 text-emerald-600" : h.type === "sale" ? "bg-[color:var(--color-brand-hover)]/10 text-[color:var(--color-brand-hover)]" : h.type === "adjustment" ? "bg-amber-500/10 text-amber-600" : "bg-[color:var(--color-brand-primary)]/10 text-[color:var(--color-brand-primary)]")}>
                    {h.type === "restock" ? "+" : h.type === "sale" ? "-" : "~"}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[color:var(--color-text-primary)]">
                      {h.type.charAt(0).toUpperCase() + h.type.slice(1)} · {h.product}
                    </p>
                    <p className="text-[10px] text-[color:var(--color-text-tertiary)]">{h.date} · {h.user}</p>
                    <p className="text-[10px] text-[color:var(--color-text-tertiary)]">{h.note}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn("text-xs font-semibold", h.quantity > 0 ? "text-emerald-600" : "text-[color:var(--color-text-primary)]")}>
                    {h.quantity > 0 ? "+" : ""}{h.quantity}
                  </p>
                  <p className="text-[10px] text-[color:var(--color-text-tertiary)]">{h.before} → {h.after}</p>
                </div>
              </div>
            )))}
          </div>
        </div>
      )}
    </div>
  );
}
