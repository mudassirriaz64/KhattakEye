import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Package, Search, Download, Eye, MapPin } from "lucide-react";
import { AccountLayout } from "@/components/account/AccountLayout";
import { cn } from "@/lib/utils";
import { getMyOrdersApi } from "@/lib/api/orders";

interface DbOrder {
  id?: string;
  orderNumber: string;
  date: string;
  status: string;
  total: number;
  itemCount: number;
  items: number;
}

const filters = ["All", "Processing", "Shipped", "Delivered", "Cancelled"];

const statusColor: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-600",
  processing: "bg-[color:var(--color-accent-blue)]/10 text-[color:var(--color-accent-blue)]",
  shipped: "bg-[color:var(--color-accent-teal)]/10 text-[color:var(--color-accent-teal)]",
  delivered: "bg-emerald-500/10 text-emerald-600",
  cancelled: "bg-red-500/10 text-red-600",
};

export function MyOrdersPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [dbOrders, setDbOrders] = useState<DbOrder[]>([]);

  useEffect(() => {
    getMyOrdersApi().then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        const mapped = data.map((o) => ({
          orderNumber: o.orderNumber,
          date: o.createdAt ? new Date(o.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
          status: o.status || "pending",
          total: o.total || 0,
          itemCount: o.items ? o.items.length : 1,
          items: (o.items || []).map((i) => ({
            name: i.name,
            color: i.color,
            quantity: i.quantity,
            price: i.price,
            image: i.image
          })) as unknown as number
        }));
        setDbOrders(mapped);
      }
    }).catch(() => {});
  }, []);

  const activeOrdersList = dbOrders;

  const filtered = activeOrdersList.filter((o) => {
    const matchFilter = activeFilter === "All" || o.status.toLowerCase() === activeFilter.toLowerCase();
    const matchSearch = !search || o.orderNumber.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <AccountLayout title="My Orders" subtitle={`${dbOrders.length} total orders`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-xs">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--color-text-tertiary)]" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search orders..." className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] py-2.5 pl-10 pr-4 text-sm text-[color:var(--color-text-primary)] placeholder:text-[color:var(--color-text-tertiary)] focus:border-[color:var(--color-accent-teal)] focus:outline-none focus:ring-4 focus:ring-[color:var(--color-focus-ring)]" />
        </div>
        <div className="flex gap-1.5">
          {filters.map((f) => (
            <button key={f} type="button" onClick={() => setActiveFilter(f)} className={cn("rounded-lg px-3 py-1.5 text-xs font-medium transition-colors", activeFilter === f ? "bg-[color:var(--color-brand-primary)] text-white" : "bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)]")}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[color:var(--color-surface-muted)]"><Package className="h-8 w-8 text-[color:var(--color-text-tertiary)]" /></div>
          <h3 className="mt-4 font-display text-xl text-[color:var(--color-text-primary)]">No orders found</h3>
          <p className="mt-1 text-sm text-[color:var(--color-text-secondary)]">Try adjusting your search or filter.</p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {filtered.map((order, i) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-5 backdrop-blur-2xl">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--color-surface-muted)]">
                      <Package className="h-5 w-5 text-[color:var(--color-text-tertiary)]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[color:var(--color-text-primary)]">{order.orderNumber}</p>
                      <p className="text-xs text-[color:var(--color-text-tertiary)]">{order.date} · {order.items} item{order.items > 1 ? "s" : ""}</p>
                    </div>
                  </div>
                  <span className={`rounded-lg px-2.5 py-1 text-[10px] font-semibold capitalize ${statusColor[order.status] || "bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-tertiary)]"}`}>{order.status}</span>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-[color:var(--color-border)] pt-3">
                  <span className="text-sm font-bold text-[color:var(--color-text-primary)]">Rs. {order.total.toLocaleString()}</span>
                  <div className="flex gap-2">
                    <Link to={`/track-order?id=${order.orderNumber}`} className="flex items-center gap-1 rounded-lg border border-[color:var(--color-border)] px-3 py-1.5 text-[11px] font-medium text-[color:var(--color-text-secondary)] transition-colors hover:bg-[color:var(--color-surface-muted)]">
                      <MapPin className="h-3 w-3" /> Track
                    </Link>
                    <Link to={`/invoice?id=${order.orderNumber}`} className="flex items-center gap-1 rounded-lg border border-[color:var(--color-border)] px-3 py-1.5 text-[11px] font-medium text-[color:var(--color-text-secondary)] transition-colors hover:bg-[color:var(--color-surface-muted)]">
                      <Download className="h-3 w-3" /> Invoice
                    </Link>
                    <Link to={`/account/orders?id=${order.orderNumber}`} className="flex items-center gap-1 rounded-lg bg-[color:var(--color-brand-primary)] px-3 py-1.5 text-[11px] font-medium text-white transition-colors hover:bg-black">
                      <Eye className="h-3 w-3" /> View
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </AccountLayout>
  );
}
