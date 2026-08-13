import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit3, Trash2, Search, UserX, UserCheck } from "lucide-react";
import { adminUsers } from "@/lib/admin-data";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { Button } from "@/components/primitives/Button";
import { cn } from "@/lib/utils";
import { getRoleLabel } from "@/lib/utils/enum-labels";

export function AdminAdminUsersPage() {
  const [users, setUsers] = useState(adminUsers);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = users.filter((u) => !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  const removeUser = () => {
    if (deleteId) { setUsers((prev) => prev.filter((u) => u.id !== deleteId)); setDeleteId(null); }
  };

  const toggleStatus = (id: string) => {
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, status: u.status === "active" ? "inactive" : "active" } : u));
  };

  const roleColors: Record<string, string> = {
    "Super Admin": "bg-red-500/10 text-red-600",
    Manager: "bg-[color:var(--color-accent-blue)]/10 text-[color:var(--color-accent-blue)]",
    Staff: "bg-[color:var(--color-accent-teal)]/10 text-[color:var(--color-accent-teal)]",
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-[color:var(--color-text-primary)] md:text-3xl">Admin Users</h1>
          <p className="mt-0.5 text-sm text-[color:var(--color-text-secondary)]">{users.length} admin users</p>
        </div>
        <div className="flex gap-2">
          <Button variant="primary" iconLeft={<Plus className="h-4 w-4" />} className="text-xs">Add User</Button>
        </div>
      </div>

      <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)]">
        <div className="flex items-center gap-3 border-b border-[color:var(--color-border)] p-4">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--color-text-tertiary)]" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..." className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] py-2.5 pl-10 pr-4 text-sm text-[color:var(--color-text-primary)] placeholder:text-[color:var(--color-text-tertiary)] focus:border-[color:var(--color-accent-teal)] focus:outline-none focus:ring-4 focus:ring-[color:var(--color-focus-ring)]" />
          </div>
        </div>

        <div className="divide-y divide-[color:var(--color-border)]">
          <AnimatePresence>
            {filtered.map((user, i) => (
              <motion.div key={user.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} transition={{ delay: i * 0.03 }} className="flex items-center gap-4 px-5 py-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[color:var(--color-brand-primary)] to-[color:var(--color-accent-teal)] text-xs font-bold text-white">
                  {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-[color:var(--color-text-primary)]">{user.name}</p>
                  <p className="text-xs text-[color:var(--color-text-secondary)]">{user.email}</p>
                </div>
                <span className={cn("rounded-lg px-2.5 py-1 text-[10px] font-semibold", roleColors[user.role] || "bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-tertiary)]")}>{getRoleLabel(user.role)}</span>
                <StatusBadge status={user.status} />
                <div className="text-right">
                  <p className="text-[10px] text-[color:var(--color-text-tertiary)]">Last login</p>
                  <p className="text-[10px] font-medium text-[color:var(--color-text-primary)]">{user.lastLogin}</p>
                </div>
                <div className="flex gap-1">
                  <button type="button" onClick={() => toggleStatus(user.id)} className={cn("flex h-8 w-8 items-center justify-center rounded-lg transition-colors", user.status === "active" ? "text-amber-500 hover:bg-amber-500/10" : "text-emerald-500 hover:bg-emerald-500/10")}>
                    {user.status === "active" ? <UserX className="h-3.5 w-3.5" /> : <UserCheck className="h-3.5 w-3.5" />}
                  </button>
                  <button type="button" className="flex h-8 w-8 items-center justify-center rounded-lg text-[color:var(--color-text-tertiary)] hover:bg-[color:var(--color-surface-muted)]"><Edit3 className="h-3.5 w-3.5" /></button>
                  <button type="button" onClick={() => setDeleteId(user.id)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[color:var(--color-text-tertiary)] hover:bg-red-500/10 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <ConfirmModal open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={removeUser} title="Delete Admin User" message="Are you sure you want to delete this user?" />
    </div>
  );
}
