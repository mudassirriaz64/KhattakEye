import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Images, Plus, Edit3, Trash2, X, AlertCircle, Search } from "lucide-react";
import { BANNER_PLACEMENTS, type CmsBanner, type FeaturedProductSummary } from "@/lib/admin-data";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { Button } from "@/components/primitives/Button";
import axios from "@/lib/api/axios";
import { useToastStore } from "@/lib/stores/toast-store";

const defaultForm = { title: "", subtitle: "", link: "", active: true, type: "homepage-slider", position: 1, placement: [] as string[], image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=1200&fit=crop", featuredProductId: "" };

export function AdminBannerManagementPage() {
  const addToast = useToastStore((s) => s.addToast);
  const [banners, setBanners] = useState<CmsBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<CmsBanner | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [featuredProductSummary, setFeaturedProductSummary] = useState<FeaturedProductSummary | null>(null);
  const [productSearch, setProductSearch] = useState("");
  const [productResults, setProductResults] = useState<FeaturedProductSummary[]>([]);
  const [searchingProducts, setSearchingProducts] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    fetchBanners();
  }, []);

  useEffect(() => {
    if (!pickerOpen || !productSearch.trim()) {
      setProductResults([]);
      return;
    }
    setSearchingProducts(true);
    const timer = setTimeout(() => {
      axios.get("/admin/products", { params: { search: productSearch.trim(), limit: 8 } })
        .then((res) => {
          const items = (res.data?.items || []) as {
            _id: string; name: string; slug: string; price: number; oldPrice?: number | null;
            rating?: number; reviewCount?: number; images?: string[]; hoverImage?: string;
          }[];
          setProductResults(items.map((p) => ({
            _id: p._id,
            name: p.name,
            slug: p.slug,
            price: p.price,
            oldPrice: p.oldPrice ?? null,
            rating: p.rating || 0,
            reviewCount: p.reviewCount || 0,
            images: p.images || [],
            hoverImage: p.hoverImage
          })));
        })
        .catch(() => setProductResults([]))
        .finally(() => setSearchingProducts(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [productSearch, pickerOpen]);

  const fetchBanners = async () => {
    try {
      const res = await axios.get("/admin/banners");
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setBanners(res.data.map((b: { _id: string; title: string; subtitle?: string; link: string; isActive: boolean; type: string; order: number; image: string; placement?: string[]; featuredProduct?: FeaturedProductSummary | null }) => ({
          id: b._id,
          title: b.title || "Banner",
          subtitle: b.subtitle || "",
          link: b.link || "/shop",
          active: b.isActive,
          type: b.type === "homepage-slider" ? "slider" : (b.type === "promotional" ? "offer" : (b.type as CmsBanner["type"])),
          position: b.order || 1,
          placement: b.placement || [],
          image: b.image,
          featuredProduct: b.featuredProduct || null
        })));
      }
    } catch {
      /* banner list is optional; keep existing data */
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm(defaultForm);
    setFormError(null);
    setFeaturedProductSummary(null);
    setProductSearch("");
    setProductResults([]);
    setPickerOpen(false);
  };

  const openEdit = (b: CmsBanner) => {
    setForm({ title: b.title, subtitle: b.subtitle || "", link: b.link, active: b.active, type: b.type || "homepage-slider", position: b.position || 1, placement: b.placement || [], image: b.image || "", featuredProductId: b.featuredProduct?._id || b.featuredProduct?.id || "" });
    setFeaturedProductSummary(b.featuredProduct ? { ...b.featuredProduct, id: b.featuredProduct._id || b.featuredProduct.id } : null);
    setProductSearch("");
    setProductResults([]);
    setPickerOpen(false);
    setEditing(b);
    setFormError(null);
    setShowForm(true);
  };

  const saveBanner = async () => {
    if (!form.title.trim()) {
      const msg = "Please enter Banner Title";
      setFormError(msg);
      addToast({ title: "Missing Required Field", description: msg, type: "error" });
      return;
    }
    setFormError(null);

    try {
      const backendType = form.type === "slider" ? "homepage-slider" : form.type === "offer" ? "promotional" : form.type;
      const payload = {
        title: form.title,
        subtitle: form.subtitle,
        link: form.link,
        type: backendType,
        order: form.position,
        isActive: form.active,
        placement: form.placement,
        image: form.image || "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=1200&fit=crop",
        featuredProduct: form.featuredProductId || null
      };

      if (editing && editing.id && !editing.id.startsWith("bn-")) {
        await axios.put(`/admin/banners/${editing.id}`, payload);
      } else {
        await axios.post("/admin/banners", payload);
      }
      await fetchBanners();
      addToast({ title: "Success", description: editing ? "Banner updated successfully" : "Banner created successfully", type: "success" });
    } catch (err) {
      console.error("Failed to save banner:", err);
      addToast({ title: "Error", description: "Failed to save banner", type: "error" });
    }
    setShowForm(false);
    setEditing(null);
    resetForm();
  };

  const removeBanner = async () => {
    if (deleteId) {
      if (!deleteId.startsWith("bn-")) {
        try {
          await axios.delete(`/admin/banners/${deleteId}`);
        } catch {
          /* best-effort delete on the server */
        }
      }
      setBanners((prev) => prev.filter((b) => b.id !== deleteId));
      setDeleteId(null);
    }
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
              <div className="sm:col-span-2"><label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em]">Image URL</label><input type="url" value={form.image} onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))} placeholder="https://images.unsplash.com/..." className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm" /></div>
              <div><label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em]">Link</label><input type="text" value={form.link} onChange={(e) => setForm((p) => ({ ...p, link: e.target.value }))} placeholder="/shop" className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm" /></div>
              <div><label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em]">Type</label><select value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value as CmsBanner["type"] }))} className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm">
                <option value="slider">Slider</option><option value="offer">Offer</option><option value="popup">Popup</option><option value="seasonal">Seasonal</option>
              </select></div>
              <div><label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em]">Position</label><input type="number" min={1} value={form.position} onChange={(e) => setForm((p) => ({ ...p, position: parseInt(e.target.value) || 1 }))} className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm" /></div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.active} onChange={(e) => setForm((p) => ({ ...p, active: e.target.checked }))} className="h-4 w-4 rounded" /><span className="text-xs">Active</span></label>
              </div>
              <div className="sm:col-span-2 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-app-bg)] p-4">
                <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-brand-primary)]">
                  Placement
                  <span className="ml-1.5 normal-case font-normal text-[color:var(--color-text-tertiary)]">
                    — where this banner renders (multiple allowed)
                  </span>
                </label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {BANNER_PLACEMENTS.map((pl) => {
                    const isSelected = form.placement.includes(pl.value);
                    return (
                      <button
                        key={pl.value}
                        type="button"
                        onClick={() => setForm((p) => ({
                          ...p,
                          placement: isSelected ? p.placement.filter((v) => v !== pl.value) : [...p.placement, pl.value]
                        }))}
                        className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                          isSelected
                            ? "border-[color:var(--color-brand-primary)] bg-[color:var(--color-brand-soft)]/20 text-[color:var(--color-brand-primary)] font-semibold shadow-sm"
                            : "border-[color:var(--color-border)] bg-[color:var(--color-panel)] text-[color:var(--color-text-secondary)] hover:border-[color:var(--color-text-tertiary)]"
                        }`}
                      >
                        <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 ${
                          isSelected
                            ? "border-[color:var(--color-brand-primary)] bg-[color:var(--color-brand-primary)]"
                            : "border-[color:var(--color-border)] bg-transparent"
                        }`}>
                          {isSelected && (
                            <svg viewBox="0 0 10 10" className="h-2.5 w-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M1.5 5.5l2.2 2.2L8.5 2.5" />
                            </svg>
                          )}
                        </div>
                        <span className="truncate">{pl.label}</span>
                      </button>
                    );
                  })}
                </div>
                {form.placement.length === 0 && (
                  <p className="mt-2 text-[10px] text-[color:var(--color-text-tertiary)]">
                    No placement selected — this banner will not render anywhere until assigned.
                  </p>
                )}
              </div>
              {form.placement.includes("homepage-hero") && (
                <div className="sm:col-span-2 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-app-bg)] p-4">
                  <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-brand-primary)]">
                    Featured Product
                    <span className="ml-1.5 normal-case font-normal text-[color:var(--color-text-tertiary)]">
                      — shown as the floating card on this hero slide
                    </span>
                  </label>
                  {featuredProductSummary ? (
                    <div className="flex items-center gap-3 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-3">
                      <img src={featuredProductSummary.images[0] || featuredProductSummary.hoverImage || ""} alt={featuredProductSummary.name} className="h-12 w-12 rounded-lg object-cover border border-[color:var(--color-border)]" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-semibold text-[color:var(--color-text-primary)]">{featuredProductSummary.name}</p>
                        <p className="text-[10px] text-[color:var(--color-text-secondary)]">Rs. {featuredProductSummary.price.toLocaleString()}</p>
                      </div>
                      <button type="button" onClick={() => { setForm((p) => ({ ...p, featuredProductId: "" })); setFeaturedProductSummary(null); setProductSearch(""); setPickerOpen(false); }} className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[color:var(--color-text-tertiary)] hover:bg-[color:var(--color-surface-muted)] hover:text-red-500"><X className="h-3.5 w-3.5" /></button>
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="relative">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--color-text-tertiary)]" />
                        <input
                          type="text"
                          value={productSearch}
                          onFocus={() => setPickerOpen(true)}
                          onChange={(e) => { setProductSearch(e.target.value); setPickerOpen(true); }}
                          placeholder="Search products by name or SKU..."
                          className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] pl-9 pr-4 py-2.5 text-sm"
                        />
                      </div>
                      {pickerOpen && (
                        <div className="absolute z-20 mt-2 max-h-64 w-full overflow-y-auto rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-1.5 shadow-xl">
                          {searchingProducts ? (
                            <p className="px-3 py-2 text-xs text-[color:var(--color-text-tertiary)]">Searching...</p>
                          ) : productResults.length > 0 ? (
                            productResults.map((p) => (
                              <button
                                key={p._id || p.slug}
                                type="button"
                                onClick={() => { setForm((prev) => ({ ...prev, featuredProductId: p._id || "" })); setFeaturedProductSummary(p); setPickerOpen(false); }}
                                className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left hover:bg-[color:var(--color-surface-muted)]"
                              >
                                <img src={p.images[0] || p.hoverImage || ""} alt={p.name} className="h-9 w-9 rounded-md object-cover border border-[color:var(--color-border)]" />
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-xs font-semibold text-[color:var(--color-text-primary)]">{p.name}</p>
                                  <p className="text-[10px] text-[color:var(--color-text-secondary)]">Rs. {p.price.toLocaleString()}</p>
                                </div>
                              </button>
                            ))
                          ) : (
                            <p className="px-3 py-2 text-xs text-[color:var(--color-text-tertiary)]">{productSearch.trim() ? "No products found" : "Type to search products"}</p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Button variant="primary" onClick={saveBanner} className="text-xs">{editing ? "Update" : "Create"} Banner</Button>
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
            <div key={i} className="animate-pulse rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-5 space-y-3">
              <div className="h-36 w-full rounded-xl bg-[color:var(--color-surface-muted)]" />
              <div className="h-4 w-3/4 rounded bg-[color:var(--color-surface-muted)]" />
              <div className="h-3 w-1/2 rounded bg-[color:var(--color-surface-muted)]" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence>
            {banners.sort((a, b) => a.position - b.position).map((banner, i) => (
              <motion.div key={banner.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.04 }} className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-5 overflow-hidden">
                <div className="relative h-36 w-full overflow-hidden rounded-xl bg-black/5 mb-3 border border-[color:var(--color-border)]">
                  {banner.image ? (
                    <img src={banner.image} alt={banner.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[color:var(--color-text-tertiary)]">
                      <Images className="h-8 w-8" />
                    </div>
                  )}
                </div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-[color:var(--color-text-primary)]">{banner.title}</h3>
                    <p className="mt-0.5 text-xs text-[color:var(--color-text-secondary)]">{banner.subtitle}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button type="button" onClick={() => openEdit(banner)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[color:var(--color-text-tertiary)] hover:bg-[color:var(--color-surface-muted)] hover:text-[color:var(--color-text-primary)]"><Edit3 className="h-3.5 w-3.5" /></button>
                    <button type="button" onClick={() => setDeleteId(banner.id)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[color:var(--color-text-tertiary)] hover:bg-red-500/10 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span className={`rounded-lg px-2 py-0.5 text-[10px] font-semibold ${typeColors[banner.type] || typeColors.slider}`}>{banner.type}</span>
                  <StatusBadge status={banner.active ? "active" : "inactive"} />
                  <span className="text-[10px] text-[color:var(--color-text-tertiary)]">Pos: {banner.position}</span>
                </div>
                <p className="mt-2 text-[10px] text-[color:var(--color-text-tertiary)]">Link: {banner.link}</p>
                {banner.featuredProduct && (
                  <p className="mt-1 text-[10px] text-[color:var(--color-brand-hover)]">Featured: {banner.featuredProduct.name}</p>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <ConfirmModal open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={removeBanner} title="Delete Banner" message="Are you sure you want to delete this banner?" />
    </div>
  );
}
