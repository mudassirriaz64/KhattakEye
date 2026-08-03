import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart, Search, SlidersHorizontal, ChevronDown, Eye, Download, FileText, Calendar } from "lucide-react";
import { adminOrders } from "@/lib/admin-data";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { cn } from "@/lib/utils";

const statusFilters = ["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
const paymentFilters = ["All Methods", "Bank Transfer", "JazzCash", "EasyPaisa"];

const paymentColors: Record<string, string> = {
  "bank-transfer": "bg-[color:var(--color-accent-blue)]/10 text-[color:var(--color-accent-blue)]",
  jazzcash: "bg-rose-500/10 text-rose-600",
  easypaisa: "bg-emerald-500/10 text-emerald-600",
};

export function AdminOrdersListPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All Methods");

  const filtered = adminOrders.filter((o) => {
    const matchStatus = statusFilter === "All" || o.status === statusFilter.toLowerCase();
    const matchPayment = paymentFilter === "All Methods" || o.paymentMethod === paymentFilter;
    const matchSearch = !search || o.orderNumber.toLowerCase().includes(search.toLowerCase()) || o.customer.name.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchPayment && matchSearch;
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-[color:var(--color-text-primary)] md:text-3xl">Orders</h1>
          <p className="mt-0.5 text-sm text-[color:var(--color-text-secondary)]">{adminOrders.length} total orders</p>
        </div>
      </div>

      <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)]">
        <div className="flex flex-col gap-4 border-b border-[color:var(--color-border)] p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--color-text-tertiary)]" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search orders..." className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] py-2.5 pl-10 pr-4 text-sm text-[color:var(--color-text-primary)] placeholder:text-[color:var(--color-text-tertiary)] focus:border-[color:var(--color-accent-teal)] focus:outline-none focus:ring-4 focus:ring-[color:var(--color-focus-ring)]" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex gap-1">
              {statusFilters.map((f) => (
                <button key={f} type="button" onClick={() => setStatusFilter(f)} className={cn("rounded-lg px-3 py-1.5 text-xs font-medium transition-colors", statusFilter === f ? "bg-[color:var(--color-brand-primary)] text-white" : "bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)]")}>{f}</button>
              ))}
            </div>
            <select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)} className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-3 py-2 text-xs text-[color:var(--color-text-secondary)]">
              {paymentFilters.map((p) => <option key={p}>{p}</option>)}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[color:var(--color-border)]">
                {["Order", "Customer", "Items", "Total", "Payment", "Status", "Date", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-tertiary)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((order, i) => (
                <motion.tr key={order.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }} className="border-b border-[color:var(--color-border)] transition-colors last:border-0 hover:bg-[color:var(--color-surface-muted)]">
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-[color:var(--color-text-primary)]">{order.orderNumber}</span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-[color:var(--color-text-primary)]">{order.customer.name}</p>
                    <p className="text-[10px] text-[color:var(--color-text-tertiary)]">{order.customer.email}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-[color:var(--color-text-tertiary)]">{order.items.length}</td>
                  <td className="px-4 py-3 text-sm font-semibold">Rs. {order.total.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={cn("rounded-lg px-2.5 py-1 text-[10px] font-semibold", paymentColors[order.paymentMethod.toLowerCase().replace(/\s+/g, "-")] || "bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-tertiary)]")}>
                      {order.paymentMethod}
                    </span>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                  <td className="px-4 py-3 text-xs text-[color:var(--color-text-tertiary)]">{order.date}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Link to={`/admin/orders/${order.id}`} className="flex h-8 w-8 items-center justify-center rounded-lg text-[color:var(--color-text-tertiary)] hover:bg-[color:var(--color-surface-muted)] hover:text-[color:var(--color-accent-blue)]">
                        <Eye className="h-3.5 w-3.5" />
                      </Link>
                      <button type="button" className="flex h-8 w-8 items-center justify-center rounded-lg text-[color:var(--color-text-tertiary)] hover:bg-[color:var(--color-surface-muted)] hover:text-[color:var(--color-accent-teal)]">
                        <Download className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <ShoppingCart className="mx-auto h-8 w-8 text-[color:var(--color-text-tertiary)]" />
            <p className="mt-2 text-sm text-[color:var(--color-text-secondary)]">No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
}
