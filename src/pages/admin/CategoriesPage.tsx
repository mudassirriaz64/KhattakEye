import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Grid3X3, Plus, Edit3, Trash2, Search, Eye, X } from "lucide-react";
import { adminCategories, type AdminCategory } from "@/lib/admin-data";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { Button } from "@/components/primitives/Button";
import { cn } from "@/lib/utils";

export function AdminCategoriesPage() {
  const [categories, setCategories] = useState(adminCategories);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<AdminCategory | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<{ name: string; slug: string; description: string; parent: string; featured: boolean; status: "active" | "inactive" }>({ name: "", slug: "", description: "", parent: "", featured: false, status: "active" });

  const filtered = categories.filter((c) => !search || c.name.toLowerCase().includes(search.toLowerCase()));

  const resetForm = () => setForm({ name: "", slug: "", description: "", parent: "", featured: false, status: "active" });

  const openEdit = (cat: AdminCategory) => {
    setForm({ name: cat.name, slug: cat.slug, description: cat.description, parent: cat.parent || "", featured: cat.featured, status: cat.status });
    setEditing(cat);
    setShowForm(true);
  };

  const saveCategory = () => {
    if (editing) {
      setCategories((prev) => prev.map((c) => c.id === editing.id ? { ...c, ...form, parent: form.parent || null } : c));
    } else {
      const newCat: AdminCategory = { id: `cat-${Date.now()}`, ...form, parent: form.parent || null, image: "", productCount: 0, createdAt: new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) };
      setCategories((prev) => [newCat, ...prev]);
    }
    setShowForm(false);
    setEditing(null);
    resetForm();
  };

  const removeCategory = () => {
    if (deleteId) { setCategories((prev) => prev.filter((c) => c.id !== deleteId)); setDeleteId(null); }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-[color:var(--color-text-primary)] md:text-3xl">Categories</h1>
          <p className="mt-0.5 text-sm text-[color:var(--color-text-secondary)]">{categories.length} categories</p>
        </div>
        <Button variant="primary" iconLeft={<Plus className="h-4 w-4" />} onClick={() => { resetForm(); setEditing(null); setShowForm(true); }} className="text-xs">Add Category</Button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mb-6 overflow-hidden">
          <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-5">
            <div className="flex items-center justify-between"><h3 className="text-sm font-semibold">{editing ? "Edit Category" : "New Category"}</h3><button type="button" onClick={() => setShowForm(false)}><X className="h-4 w-4" /></button></div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div><label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em]">Name</label><input type="text" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") }))} className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm" /></div>
              <div><label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em]">Slug</label><input type="text" value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm" /></div>
              <div className="sm:col-span-2"><label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em]">Description</label><input type="text" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm" /></div>
              <div><label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em]">Parent Category</label><select value={form.parent} onChange={(e) => setForm((p) => ({ ...p, parent: e.target.value }))} className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm">
                <option value="">None (Top Level)</option>
                {categories.filter((c) => !c.parent).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select></div>
              <div className="flex items-end gap-4">
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.featured} onChange={(e) => setForm((p) => ({ ...p, featured: e.target.checked }))} className="h-4 w-4 rounded border-[color:var(--color-border)]" /><span className="text-xs">Featured</span></label>
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.status === "active"} onChange={(e) => setForm((p) => ({ ...p, status: e.target.checked ? "active" : "inactive" }))} className="h-4 w-4 rounded border-[color:var(--color-border)]" /><span className="text-xs">Active</span></label>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="primary" onClick={saveCategory} className="text-xs">{editing ? "Update" : "Create"} Category</Button>
              <Button variant="ghost" onClick={() => setShowForm(false)} className="text-xs">Cancel</Button>
            </div>
          </div>
        </motion.div>
      )}

      <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)]">
        <div className="flex items-center gap-3 border-b border-[color:var(--color-border)] p-4">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--color-text-tertiary)]" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search categories..." className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] py-2.5 pl-10 pr-4 text-sm" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[color:var(--color-border)]">
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-tertiary)]">Category</th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-tertiary)]">Parent</th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-tertiary)]">Products</th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-tertiary)]">Featured</th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-tertiary)]">Status</th>
                <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-tertiary)]">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filtered.map((cat, i) => (
                  <motion.tr key={cat.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-[color:var(--color-border)] transition-colors last:border-0 hover:bg-[color:var(--color-surface-muted)]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {cat.image ? <img src={cat.image} alt="" className="h-10 w-10 rounded-lg object-cover" /> : <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[color:var(--color-surface-muted)]"><Grid3X3 className="h-5 w-5 text-[color:var(--color-text-tertiary)]" /></div>}
                        <div>
                          <p className="text-sm font-medium text-[color:var(--color-text-primary)]">{cat.name}</p>
                          <p className="text-[10px] text-[color:var(--color-text-tertiary)]">{cat.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-[color:var(--color-text-tertiary)]">{cat.parent ? categories.find((c) => c.id === cat.parent)?.name || "—" : "—"}</td>
                    <td className="px-4 py-3 text-sm font-medium">{cat.productCount}</td>
                    <td className="px-4 py-3"><StatusBadge status={cat.featured ? "yes" : "no"} /></td>
                    <td className="px-4 py-3"><StatusBadge status={cat.status} /></td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button type="button" onClick={() => openEdit(cat)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[color:var(--color-text-tertiary)] hover:bg-[color:var(--color-surface-muted)] hover:text-[color:var(--color-accent-teal)]"><Edit3 className="h-3.5 w-3.5" /></button>
                        <button type="button" onClick={() => setDeleteId(cat.id)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[color:var(--color-text-tertiary)] hover:bg-[color:var(--color-surface-muted)] hover:text-[color:var(--color-danger)]"><Trash2 className="h-3.5 w-3.5" /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={removeCategory} title="Delete Category" message="Products in this category will not be deleted." confirmLabel="Delete" variant="danger" />
    </div>
  );
}
