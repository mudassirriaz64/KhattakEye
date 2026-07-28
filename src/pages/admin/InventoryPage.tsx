import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ClipboardList, Search, AlertTriangle, Plus, Minus, History, Filter } from "lucide-react";
import { adminInventory, inventoryHistory, type InventoryItem, type InventoryHistory } from "@/lib/admin-data";
import { StatusBadge, StockBadge } from "@/components/admin/StatusBadge";
import { cn } from "@/lib/utils";

const stockFilters = ["All", "In Stock", "Low Stock", "Out of Stock"];

export function AdminInventoryPage() {
  const [items, setItems] = useState(adminInventory);
  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState("All");
  const [showHistory, setShowHistory] = useState(false);
  const [selectedSku, setSelectedSku] = useState<string | null>(null);
  const [editStock, setEditStock] = useState<{ id: string; value: number } | null>(null);

  const filtered = items.filter((i) => {
    const matchStock = stockFilter === "All" || i.status === stockFilter.toLowerCase().replace(/\s+/g, "-");
    const matchSearch = !search || i.name.toLowerCase().includes(search.toLowerCase()) || i.sku.toLowerCase().includes(search.toLowerCase());
    return matchStock && matchSearch;
  });

  const updateStock = (id: string, delta: number) => {
    setItems((prev) => prev.map((item) => {
      if (item.id !== id) return item;
      const newStock = Math.max(0, item.stock + delta);
      const status: "in-stock" | "low-stock" | "out-of-stock" = newStock === 0 ? "out-of-stock" : newStock <= item.lowStockThreshold ? "low-stock" : "in-stock";
      return { ...item, stock: newStock, available: newStock - item.reserved, status };
    }));
    setEditStock(null);
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
  const histForItem = selectedSku ? inventoryHistory.filter((h) => h.sku === selectedSku) : inventoryHistory;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-[color:var(--color-text-primary)] md:text-3xl">Inventory</h1>
          <p className="mt-0.5 text-sm text-[color:var(--color-text-secondary)]">{items.length} products · {lowStockItems.length} need attention</p>
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
            {histForItem.map((h, i) => (
              <div key={h.id} className="flex items-center justify-between rounded-xl bg-[color:var(--color-surface-muted)] p-3">
                <div className="flex items-center gap-3">
                  <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold", h.type === "restock" ? "bg-emerald-500/10 text-emerald-600" : h.type === "sale" ? "bg-[color:var(--color-accent-blue)]/10 text-[color:var(--color-accent-blue)]" : h.type === "adjustment" ? "bg-amber-500/10 text-amber-600" : "bg-purple-500/10 text-purple-500")}>
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
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
