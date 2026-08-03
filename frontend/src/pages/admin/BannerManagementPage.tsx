import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Images, Plus, Edit3, Trash2, X } from "lucide-react";
import { cmsBanners, type CmsBanner } from "@/lib/admin-data";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { Button } from "@/components/primitives/Button";

const defaultForm = { title: "", subtitle: "", link: "", active: true, type: "slider" as CmsBanner["type"], position: 1 };

export function AdminBannerManagementPage() {
  const [banners, setBanners] = useState(cmsBanners);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<CmsBanner | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<{ title: string; subtitle: string; link: string; active: boolean; type: CmsBanner["type"]; position: number }>(defaultForm);

  const resetForm = () => setForm(defaultForm);

  const openEdit = (b: CmsBanner) => {
    setForm({ title: b.title, subtitle: b.subtitle, link: b.link, active: b.active, type: b.type, position: b.position });
    setEditing(b);
    setShowForm(true);
  };

  const saveBanner = () => {
    if (editing) {
      setBanners((prev) => prev.map((b) => b.id === editing.id ? { ...b, ...form } : b));
    } else {
      const newB: CmsBanner = { id: `bn-${Date.now()}`, ...form, image: "" };
      setBanners((prev) => [newB, ...prev]);
    }
    setShowForm(false);
    setEditing(null);
    resetForm();
  };

  const removeBanner = () => {
    if (deleteId) { setBanners((prev) => prev.filter((b) => b.id !== deleteId)); setDeleteId(null); }
  };

  const typeColors: Record<string, string> = { slider: "bg-[color:var(--color-brand-hover)]/10 text-[color:var(--color-brand-hover)]", offer: "bg-emerald-500/10 text-emerald-600", popup: "bg-[color:var(--color-brand-primary)]/10 text-[color:var(--color-brand-primary)]", seasonal: "bg-amber-500/10 text-amber-600" };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-[color:var(--color-text-primary)] md:text-3xl">Banners</h1>
          <p className="mt-0.5 text-sm text-[color:var(--color-text-secondary)]">{banners.length} banners</p>
        </div>
        <Button variant="primary" iconLeft={<Plus className="h-4 w-4" />} onClick={() => { resetForm(); setEditing(null); setShowForm(true); }} className="text-xs">Add Banner</Button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mb-6 overflow-hidden">
          <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-5">
            <div className="flex items-center justify-between"><h3 className="text-sm font-semibold">{editing ? "Edit Banner" : "New Banner"}</h3><button type="button" onClick={() => setShowForm(false)}><X className="h-4 w-4" /></button></div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2"><label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em]">Title</label><input type="text" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm" /></div>
              <div className="sm:col-span-2"><label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em]">Subtitle</label><input type="text" value={form.subtitle} onChange={(e) => setForm((p) => ({ ...p, subtitle: e.target.value }))} className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm" /></div>
              <div><label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em]">Link</label><input type="text" value={form.link} onChange={(e) => setForm((p) => ({ ...p, link: e.target.value }))} placeholder="/shop" className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm" /></div>
              <div><label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em]">Type</label><select value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value as CmsBanner["type"] }))} className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm">
                <option value="slider">Slider</option><option value="offer">Offer</option><option value="popup">Popup</option><option value="seasonal">Seasonal</option>
              </select></div>
              <div><label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em]">Position</label><input type="number" min={1} value={form.position} onChange={(e) => setForm((p) => ({ ...p, position: parseInt(e.target.value) || 1 }))} className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm" /></div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.active} onChange={(e) => setForm((p) => ({ ...p, active: e.target.checked }))} className="h-4 w-4 rounded" /><span className="text-xs">Active</span></label>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="primary" onClick={saveBanner} className="text-xs">{editing ? "Update" : "Create"} Banner</Button>
              <Button variant="ghost" onClick={() => setShowForm(false)} className="text-xs">Cancel</Button>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence>
          {banners.sort((a, b) => a.position - b.position).map((banner, i) => (
            <motion.div key={banner.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.04 }} className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-5">
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--color-surface-muted)]">
                  <Images className="h-5 w-5 text-[color:var(--color-text-tertiary)]" />
                </div>
                <div className="flex gap-1">
                  <button type="button" onClick={() => openEdit(banner)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[color:var(--color-text-tertiary)] hover:bg-[color:var(--color-surface-muted)] hover:text-[color:var(--color-text-primary)]"><Edit3 className="h-3.5 w-3.5" /></button>
                  <button type="button" onClick={() => setDeleteId(banner.id)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[color:var(--color-text-tertiary)] hover:bg-red-500/10 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </div>
              <h3 className="mt-3 text-sm font-semibold text-[color:var(--color-text-primary)]">{banner.title}</h3>
              <p className="mt-0.5 text-xs text-[color:var(--color-text-secondary)]">{banner.subtitle}</p>
              <div className="mt-3 flex items-center gap-2">
                <span className={`rounded-lg px-2 py-0.5 text-[10px] font-semibold ${typeColors[banner.type]}`}>{banner.type}</span>
                <StatusBadge status={banner.active ? "active" : "inactive"} />
                <span className="text-[10px] text-[color:var(--color-text-tertiary)]">Pos: {banner.position}</span>
              </div>
              <p className="mt-2 text-[10px] text-[color:var(--color-text-tertiary)]">Link: {banner.link}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <ConfirmModal open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={removeBanner} title="Delete Banner" message="Are you sure you want to delete this banner?" />
    </div>
  );
}
