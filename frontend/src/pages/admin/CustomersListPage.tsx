import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Eye, Ban, CheckCircle } from "lucide-react";
import { adminCustomerDetails } from "@/lib/admin-data";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { cn } from "@/lib/utils";
import axios from "@/lib/api/axios";

type CustomerRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  blocked: boolean;
  gender: string;
  dateOfBirth: string;
  joined?: string;
  joinedDate?: string;
};

export function AdminCustomersListPage() {
  const [customers, setCustomers] = useState<CustomerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [blockId, setBlockId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/admin/users");
      if (res.data && res.data.items && Array.isArray(res.data.items) && res.data.items.length > 0) {
        setCustomers(res.data.items.map((u: { _id: string; fullName?: string; email: string; phone?: string; ordersCount?: number; totalSpent?: number; isBlocked?: boolean; createdAt?: string }) => ({
          id: u._id,
          name: u.fullName || "Customer",
          email: u.email,
          phone: u.phone || "N/A",
          totalOrders: u.ordersCount || 0,
          totalSpent: u.totalSpent || 0,
          blocked: u.isBlocked || false,
          gender: "",
          dateOfBirth: "",
          joinedDate: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "Recent"
        })));
      }
    } catch {
      /* user list is optional; keep existing data */
    } finally {
      setLoading(false);
    }
  };

  const filtered = customers.filter((c) => !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()));

  const toggleBlock = async () => {
    if (blockId) {
      try {
        await axios.put(`/admin/users/${blockId}/block`);
        await fetchUsers();
      } catch {
        setCustomers((prev) => prev.map((c) => c.id === blockId ? { ...c, blocked: !c.blocked } : c));
      }
      setBlockId(null);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl text-[color:var(--color-text-primary)] md:text-3xl">Customers</h1>
        <p className="mt-0.5 text-sm text-[color:var(--color-text-secondary)]">{customers.length} registered customers</p>
      </div>

      <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)]">
        <div className="flex items-center gap-3 border-b border-[color:var(--color-border)] p-4">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--color-text-tertiary)]" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search customers..." className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] py-2.5 pl-10 pr-4 text-sm" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[color:var(--color-border)]">
                {["Customer", "Contact", "Orders", "Total Spent", "Joined", "Status", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-tertiary)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-[color:var(--color-border)] animate-pulse">
                    <td className="px-4 py-4" colSpan={7}>
                      <div className="h-6 w-full rounded bg-[color:var(--color-surface-muted)]" />
                    </td>
                  </tr>
                ))
              ) : (
                <AnimatePresence>
                  {filtered.map((c, i) => (
                    <motion.tr key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-[color:var(--color-border)] transition-colors last:border-0 hover:bg-[color:var(--color-surface-muted)]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[color:var(--color-brand-primary)] text-[10px] font-bold text-white">
                          {c.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[color:var(--color-text-primary)]">{c.name}</p>
                          <p className="text-xs text-[color:var(--color-text-tertiary)]">{c.gender} · {c.dateOfBirth}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-[color:var(--color-text-primary)]">{c.email}</p>
                      <p className="text-xs text-[color:var(--color-text-tertiary)]">{c.phone}</p>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">{c.totalOrders}</td>
                    <td className="px-4 py-3 text-sm font-semibold">Rs. {c.totalSpent.toLocaleString()}</td>
                    <td className="px-4 py-3 text-xs text-[color:var(--color-text-tertiary)]">{c.joined}</td>
                    <td className="px-4 py-3">{c.blocked ? <StatusBadge status="cancelled" /> : <StatusBadge status="active" />}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Link to={`/admin/customers/${c.id}`} className="flex h-8 w-8 items-center justify-center rounded-lg text-[color:var(--color-text-tertiary)] hover:bg-[color:var(--color-surface-muted)] hover:text-[color:var(--color-accent-blue)]">
                          <Eye className="h-3.5 w-3.5" />
                        </Link>
                        <button type="button" onClick={() => setBlockId(c.id)} className={cn("flex h-8 w-8 items-center justify-center rounded-lg", c.blocked ? "text-emerald-500 hover:bg-emerald-500/10" : "text-[color:var(--color-text-tertiary)] hover:bg-[color:var(--color-surface-muted)] hover:text-[color:var(--color-danger)]")}>
                          {c.blocked ? <CheckCircle className="h-3.5 w-3.5" /> : <Ban className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal open={!!blockId} onClose={() => setBlockId(null)} onConfirm={toggleBlock} title={blockId ? `${customers.find((c) => c.id === blockId)?.blocked ? "Unblock" : "Block"} User` : ""} message="This action will affect the user's ability to access their account." confirmLabel={blockId ? `${customers.find((c) => c.id === blockId)?.blocked ? "Unblock" : "Block"}` : ""} variant={blockId && customers.find((c) => c.id === blockId)?.blocked ? "primary" : "danger"} />
    </div>
  );
}
