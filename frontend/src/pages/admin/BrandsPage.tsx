import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, Plus, Edit3, Trash2, ExternalLink, X, AlertCircle } from "lucide-react";
import { adminBrands, type AdminBrand } from "@/lib/admin-data";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { Button } from "@/components/primitives/Button";
import { adminGetBrandsApi, adminCreateBrandApi, adminUpdateBrandApi, adminDeleteBrandApi } from "@/lib/api/admin";
import { useToastStore } from "@/lib/stores/toast-store";

export function AdminBrandsPage() {
  const addToast = useToastStore((s) => s.addToast);
  const [brands, setBrands] = useState<AdminBrand[]>([]);
  const [loading, setLoading] = useState(true);
  const [search] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<AdminBrand | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [form, setForm] = useState<{ name: string; slug: string; tagline: string; description: string; website: string; featured: boolean; status: "active" | "inactive" }>({ name: "", slug: "", tagline: "", description: "", website: "", featured: false, status: "active" });

  useEffect(() => {
    adminGetBrandsApi()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped: AdminBrand[] = data.map((b: { _id?: string; id?: string; name: string; slug?: string; tagline?: string; description?: string; logo?: string; website?: string; productCount?: number; featured?: boolean; status?: string; createdAt?: string }) => ({
            id: b._id || b.id || "",
            name: b.name,
            slug: b.slug || b.name.toLowerCase().replace(/\s+/g, "-"),
            tagline: b.tagline || "",
            description: b.description || "",
            logo: b.logo || "",
            website: b.website || "#",
            productCount: b.productCount || 0,
            featured: b.featured !== undefined ? b.featured : true,
            status: (b.status === "inactive" ? "inactive" : "active") as "active" | "inactive",
            createdAt: b.createdAt ? new Date(b.createdAt).toLocaleDateString() : new Date().toLocaleDateString()
          }));
          setBrands(mapped);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = brands.filter((b) => !search || b.name.toLowerCase().includes(search.toLowerCase()));

  const resetForm = () => {
    setForm({ name: "", slug: "", tagline: "", description: "", website: "", featured: false, status: "active" });
    setFormError(null);
  };

  const openEdit = (brand: AdminBrand) => {
    setForm({ name: brand.name, slug: brand.slug, tagline: brand.tagline || "", description: brand.description, website: brand.website, featured: brand.featured, status: brand.status });
    setEditing(brand);
    setFormError(null);
    setShowForm(true);
  };

  const saveBrand = async () => {
    if (!form.name.trim()) {
      const msg = "Please enter Brand Name";
      setFormError(msg);
      addToast({ title: "Missing Required Field", description: msg, type: "error" });
      return;
    }
    setFormError(null);

    if (editing) {
      setBrands((prev) => prev.map((b) => b.id === editing.id ? { ...b, ...form } : b));
      try {
        await adminUpdateBrandApi(editing.id, { name: form.name, tagline: form.tagline });
      } catch (err) {
        console.error("Failed to update brand:", err);
      }
    } else {
      const newBrand: AdminBrand = { id: `brd-${Date.now()}`, ...form, logo: "", productCount: 0, createdAt: new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) };
      setBrands((prev) => [newBrand, ...prev]);
      try {
        await adminCreateBrandApi({ name: form.name, tagline: form.tagline });
      } catch (err) {
        console.error("Failed to create brand:", err);
      }
    }
    setShowForm(false);
    setEditing(null);
    resetForm();
    addToast({ title: "Success", description: editing ? "Brand updated successfully" : "Brand created successfully", type: "success" });
  };

  const removeBrand = async () => {
    if (deleteId) {
      const idToDelete = deleteId;
      setBrands((prev) => prev.filter((b) => b.id !== deleteId));
      setDeleteId(null);
      try {
        await adminDeleteBrandApi(idToDelete);
      } catch (err) {
        console.error("Failed to delete brand:", err);
      }
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-[color:var(--color-text-primary)] md:text-3xl">Brands</h1>
          <p className="mt-0.5 text-sm text-[color:var(--color-text-secondary)]">{brands.length} brands</p>
        </div>
        <Button variant="primary" iconLeft={<Plus className="h-4 w-4" />} onClick={() => { resetForm(); setEditing(null); setShowForm(true); }} className="text-xs">Add Brand</Button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mb-6 overflow-hidden">
          <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-5">
            <div className="flex items-center justify-between"><h3 className="text-sm font-semibold">{editing ? "Edit Brand" : "New Brand"}</h3><button type="button" onClick={() => setShowForm(false)}><X className="h-4 w-4" /></button></div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div><label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em]">Brand Name</label><input type="text" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") }))} className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm" /></div>
              <div><label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em]">Slug</label><input type="text" value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm" /></div>
              <div><label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em]">Tagline (e.g. Sculptural, Timeless)</label><input type="text" value={form.tagline} onChange={(e) => setForm((p) => ({ ...p, tagline: e.target.value }))} placeholder="Luxury, Artisanal, etc." className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm" /></div>
              <div><label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em]">Website (optional)</label><input type="url" value={form.website} onChange={(e) => setForm((p) => ({ ...p, website: e.target.value }))} placeholder="https://" className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm" /></div>
              <div className="sm:col-span-2"><label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em]">Description</label><input type="text" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm" /></div>
              <div className="flex items-end gap-4">
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.featured} onChange={(e) => setForm((p) => ({ ...p, featured: e.target.checked }))} className="h-4 w-4 rounded" /><span className="text-xs">Featured</span></label>
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.status === "active"} onChange={(e) => setForm((p) => ({ ...p, status: e.target.checked ? "active" : "inactive" }))} className="h-4 w-4 rounded" /><span className="text-xs">Active</span></label>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Button variant="primary" onClick={saveBrand} className="text-xs">{editing ? "Update" : "Create"} Brand</Button>
              <Button variant="ghost" onClick={() => { setShowForm(false); setFormError(null); }} className="text-xs">Cancel</Button>
              {formError && (
                <div className="flex items-center gap-1.5 rounded-xl border border-red-300 bg-red-50 dark:bg-red-950/40 dark:border-red-800 px-3.5 py-2 text-xs font-semibold text-red-600 dark:text-red-400 shadow-sm animate-pulse">
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
                  <span>{formError}</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-5 space-y-4">
              <div className="h-12 w-12 rounded-xl bg-[color:var(--color-surface-muted)]" />
              <div className="h-5 w-2/3 rounded bg-[color:var(--color-surface-muted)]" />
              <div className="h-4 w-full rounded bg-[color:var(--color-surface-muted)]" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence>
          {filtered.map((brand, i) => (
            <motion.div key={brand.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.04 }} className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-5">
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[color:var(--color-surface-muted)]">
                  <Bookmark className="h-6 w-6 text-[color:var(--color-text-tertiary)]" />
                </div>
                <div className="flex gap-1">
                  <button type="button" onClick={() => openEdit(brand)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[color:var(--color-text-tertiary)] hover:bg-[color:var(--color-surface-muted)] hover:text-[color:var(--color-accent-teal)]"><Edit3 className="h-3.5 w-3.5" /></button>
                  <button type="button" onClick={() => setDeleteId(brand.id)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[color:var(--color-text-tertiary)] hover:bg-[color:var(--color-surface-muted)] hover:text-[color:var(--color-danger)]"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </div>
              <h3 className="mt-4 font-display text-lg text-[color:var(--color-text-primary)]">{brand.name}</h3>
              <p className="mt-1 text-xs leading-relaxed text-[color:var(--color-text-secondary)]">{brand.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-[color:var(--color-text-tertiary)]">{brand.productCount} products</span>
                  <StatusBadge status={brand.status} />
                </div>
                <div className="flex items-center gap-2">
                  {brand.featured && <StatusBadge status="featured" />}
                  {brand.website && (
                    <a href={brand.website} target="_blank" rel="noopener noreferrer" className="flex h-7 w-7 items-center justify-center rounded-lg text-[color:var(--color-text-tertiary)] hover:text-[color:var(--color-accent-teal)]">
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="py-16 text-center">
          <Bookmark className="mx-auto h-10 w-10 text-[color:var(--color-text-tertiary)]" />
          <p className="mt-3 text-sm text-[color:var(--color-text-secondary)]">No brands found</p>
        </div>
      )}

      <ConfirmModal open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={removeBrand} title="Delete Brand" message="Products under this brand will not be deleted." confirmLabel="Delete" variant="danger" />
    </div>
  );
}
