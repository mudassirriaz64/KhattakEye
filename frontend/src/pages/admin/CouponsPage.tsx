import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tag, Plus, Edit3, Trash2, X, Copy } from "lucide-react";
import { cmsCoupons, type CmsCoupon } from "@/lib/admin-data";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { Button } from "@/components/primitives/Button";
import axios from "@/lib/api/axios";

const formDefault = { code: "", description: "", discount: 10, type: "percentage", minOrder: 0, usageLimit: 100, used: 0, expiresAt: "2026-12-31", active: true };

export function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>(cmsCoupons);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(formDefault);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const res = await axios.get("/admin/coupons");
      if (res.data && res.data.items && Array.isArray(res.data.items) && res.data.items.length > 0) {
        setCoupons(res.data.items.map((c: any) => ({
          id: c._id,
          code: c.code,
          description: `${c.discountPercent}% Discount`,
          discount: c.discountPercent,
          type: "percentage",
          minOrder: c.minOrderValue || 0,
          usageLimit: c.usageLimit || 100,
          used: c.usedCount || 0,
          expiresAt: c.expiryDate ? new Date(c.expiryDate).toISOString().split("T")[0] : "2026-12-31",
          active: c.isActive
        })));
      }
    } catch (err) {}
  };

  const resetForm = () => setForm(formDefault);

  const openEdit = (c: any) => {
    setForm({ code: c.code, description: c.description || "", discount: c.discount, type: c.type || "percentage", minOrder: c.minOrder, usageLimit: c.usageLimit, used: c.used, expiresAt: c.expiresAt, active: c.active });
    setEditing(c);
    setShowForm(true);
  };

  const saveCoupon = async () => {
    try {
      const payload = {
        code: form.code,
        discountPercent: Number(form.discount),
        expiryDate: form.expiresAt || "2026-12-31",
        isActive: form.active,
        minOrderValue: Number(form.minOrder),
        usageLimit: Number(form.usageLimit)
      };

      if (editing && editing.id && !editing.id.startsWith("cp-")) {
        await axios.put(`/admin/coupons/${editing.id}`, payload);
      } else {
        await axios.post("/admin/coupons", payload);
      }
      await fetchCoupons();
    } catch (err) {
      console.error("Failed to save coupon:", err);
    }
    setShowForm(false);
    setEditing(null);
    resetForm();
  };

  const removeCoupon = async () => {
    if (deleteId) {
      if (!deleteId.startsWith("cp-")) {
        try {
          await axios.delete(`/admin/coupons/${deleteId}`);
        } catch (err) {}
      }
      setCoupons((prev) => prev.filter((c) => c.id !== deleteId));
      setDeleteId(null);
    }
  };

  const copyCode = async (code: string) => {
    try { await navigator.clipboard.writeText(code); setCopied(code); setTimeout(() => setCopied(null), 2000); } catch {}
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-[color:var(--color-text-primary)] md:text-3xl">Coupons</h1>
          <p className="mt-0.5 text-sm text-[color:var(--color-text-secondary)]">{coupons.length} coupons</p>
        </div>
        <Button variant="primary" iconLeft={<Plus className="h-4 w-4" />} onClick={() => { resetForm(); setEditing(null); setShowForm(true); }} className="text-xs">Add Coupon</Button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mb-6 overflow-hidden">
          <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-5">
            <div className="flex items-center justify-between"><h3 className="text-sm font-semibold">{editing ? "Edit Coupon" : "New Coupon"}</h3><button type="button" onClick={() => setShowForm(false)}><X className="h-4 w-4" /></button></div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div><label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em]">Code</label><input type="text" value={form.code} onChange={(e) => setForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))} className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm uppercase" /></div>
              <div><label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em]">Discount</label><input type="number" min={0} value={form.discount} onChange={(e) => setForm((p) => ({ ...p, discount: parseInt(e.target.value) || 0 }))} className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm" /></div>
              <div className="sm:col-span-2"><label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em]">Description</label><input type="text" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm" /></div>
              <div><label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em]">Type</label><select value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value as "percentage" | "fixed" }))} className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm">
                <option value="percentage">Percentage (%)</option><option value="fixed">Fixed (Rs.)</option>
              </select></div>
              <div><label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em]">Min Order (Rs.)</label><input type="number" min={0} value={form.minOrder} onChange={(e) => setForm((p) => ({ ...p, minOrder: parseInt(e.target.value) || 0 }))} className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm" /></div>
              <div><label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em]">Usage Limit</label><input type="number" min={1} value={form.usageLimit} onChange={(e) => setForm((p) => ({ ...p, usageLimit: parseInt(e.target.value) || 1 }))} className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm" /></div>
              <div><label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em]">Expires At</label><input type="text" value={form.expiresAt} onChange={(e) => setForm((p) => ({ ...p, expiresAt: e.target.value }))} placeholder="Dec 31, 2026" className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm" /></div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.active} onChange={(e) => setForm((p) => ({ ...p, active: e.target.checked }))} className="h-4 w-4 rounded" /><span className="text-xs">Active</span></label>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="primary" onClick={saveCoupon} className="text-xs">{editing ? "Update" : "Create"} Coupon</Button>
              <Button variant="ghost" onClick={() => setShowForm(false)} className="text-xs">Cancel</Button>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence>
          {coupons.map((coupon, i) => (
            <motion.div key={coupon.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.04 }} className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-5">
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--color-accent-teal)]/10"><Tag className="h-5 w-5 text-[color:var(--color-accent-teal)]" /></div>
                <div className="flex gap-1">
                  <button type="button" onClick={() => openEdit(coupon)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[color:var(--color-text-tertiary)] hover:bg-[color:var(--color-surface-muted)]"><Edit3 className="h-3.5 w-3.5" /></button>
                  <button type="button" onClick={() => setDeleteId(coupon.id)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[color:var(--color-text-tertiary)] hover:bg-red-500/10 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <code className="rounded-lg bg-[color:var(--color-brand-primary)] px-2.5 py-1 text-xs font-bold tracking-wider text-white">{coupon.code}</code>
                <button type="button" onClick={() => copyCode(coupon.code)} className="flex h-6 w-6 items-center justify-center rounded text-[color:var(--color-text-tertiary)] hover:text-[color:var(--color-accent-teal)]">
                  {copied === coupon.code ? <span className="text-[10px] font-medium text-[color:var(--color-accent-teal)]">Copied!</span> : <Copy className="h-3 w-3" />}
                </button>
              </div>
              <p className="mt-2 text-xs text-[color:var(--color-text-secondary)]">{coupon.description}</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="rounded-lg bg-[color:var(--color-surface-muted)] px-2 py-0.5 text-[10px] font-semibold">{coupon.type === "percentage" ? `${coupon.discount}%` : `Rs. ${coupon.discount}`}</span>
                <StatusBadge status={coupon.active ? "active" : "inactive"} />
              </div>
              <div className="mt-2 flex items-center justify-between text-[10px] text-[color:var(--color-text-tertiary)]">
                <span>Used: {coupon.used}/{coupon.usageLimit}</span>
                <span>Min: Rs. {coupon.minOrder.toLocaleString()}</span>
                <span>Exp: {coupon.expiresAt}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <ConfirmModal open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={removeCoupon} title="Delete Coupon" message="Are you sure you want to delete this coupon?" />
    </div>
  );
}
