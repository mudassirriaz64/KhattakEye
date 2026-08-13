import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tag, Plus, Edit3, Trash2, X, Sparkles, Check, AlertCircle } from "lucide-react";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { Button } from "@/components/primitives/Button";
import {
  type Promotion,
  getAdminPromotionsApi,
  createAdminPromotionApi,
  updateAdminPromotionApi,
  deleteAdminPromotionApi
} from "@/lib/api/promotions";
import { getProducts } from "@/lib/api/products";
import { getCategories } from "@/lib/api/categories";

const formDefault = {
  name: "",
  type: "bogo" as "bogo" | "category-percent-off",
  targetCategory: "eyeglasses",
  targetSubCategory: "",
  targetProduct: "",
  discountPercent: 20,
  startDate: new Date().toISOString().split("T")[0],
  endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  isActive: true,
  badgeText: "BUY 1 GET 1 FREE"
};

export function AdminPromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [products, setProducts] = useState<{ id: string; name: string; brand: string; category: string; subcategory?: string }[]>([]);
  const [categories, setCategories] = useState<{ slug: string; name: string; subcategories?: { slug: string; name: string }[] }[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Promotion | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(formDefault);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetchPromotions();
    fetchOptions();
  }, []);

  const fetchPromotions = async () => {
    try {
      const items = await getAdminPromotionsApi();
      setPromotions(items);
    } catch (err) {
      console.error("Failed to load promotions:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOptions = async () => {
    try {
      const pRes = await getProducts({ limit: 200 });
      if (pRes && pRes.items) {
        setProducts(pRes.items.map((p) => ({
          id: p._id,
          name: p.name,
          brand: p.brand,
          category: String(p.category || "").toLowerCase(),
          subcategory: String(p.subcategory || "").toLowerCase()
        })));
      }
      const cRes = await getCategories();
      if (cRes && cRes.length > 0) {
        setCategories(cRes.map((c) => ({
          slug: c.slug,
          name: c.name,
          subcategories: (c as any).subcategories || []
        })));
      } else {
        setCategories([
          { slug: "eyeglasses", name: "Eyeglasses" },
          { slug: "sunglasses", name: "Sunglasses" },
          { slug: "contact-lenses", name: "Contact Lenses" }
        ]);
      }
    } catch {
      setCategories([
        { slug: "eyeglasses", name: "Eyeglasses" },
        { slug: "sunglasses", name: "Sunglasses" },
        { slug: "contact-lenses", name: "Contact Lenses" }
      ]);
    }
  };

  const resetForm = () => {
    setForm(formDefault);
    setErrorMsg("");
  };

  const openEdit = (p: Promotion) => {
    setEditing(p);
    const targetProdId = typeof p.targetProduct === "object" && p.targetProduct ? p.targetProduct._id : typeof p.targetProduct === "string" ? p.targetProduct : "";
    setForm({
      name: p.name,
      type: p.type,
      targetCategory: p.targetCategory || "eyeglasses",
      targetSubCategory: p.targetSubCategory || "",
      targetProduct: targetProdId,
      discountPercent: p.discountPercent || 20,
      startDate: p.startDate ? new Date(p.startDate).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
      endDate: p.endDate ? new Date(p.endDate).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
      isActive: p.isActive,
      badgeText: p.badgeText || (p.type === "bogo" ? "BUY 1 GET 1 FREE" : `${p.discountPercent}% OFF`)
    });
    setErrorMsg("");
    setShowForm(true);
  };

  const savePromotion = async () => {
    setErrorMsg("");
    if (!form.name.trim()) {
      setErrorMsg("Promotion name is required.");
      return;
    }
    if (form.type === "bogo" && !form.targetProduct && !form.targetCategory && !form.targetSubCategory) {
      setErrorMsg("BOGO requires a target category, sub-category, or specific product.");
      return;
    }
    if (form.type === "category-percent-off" && !form.targetCategory && !form.targetSubCategory) {
      setErrorMsg("Category percent discount requires a target category or sub-category.");
      return;
    }

    try {
      const payload: Partial<Promotion> = {
        name: form.name.trim(),
        type: form.type,
        targetCategory: form.targetCategory || undefined,
        targetSubCategory: form.targetSubCategory || undefined,
        targetProduct: form.targetProduct || undefined,
        discountPercent: form.type === "category-percent-off" ? Number(form.discountPercent) : 0,
        startDate: form.startDate,
        endDate: form.endDate,
        isActive: form.isActive,
        badgeText: form.badgeText.trim() || (form.type === "bogo" ? "BUY 1 GET 1 FREE" : `${form.discountPercent}% OFF`)
      };

      if (editing) {
        await updateAdminPromotionApi(editing._id, payload);
      } else {
        await createAdminPromotionApi(payload);
      }
      setShowForm(false);
      resetForm();
      await fetchPromotions();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Failed to save promotion");
    }
  };

  const removePromotion = async () => {
    if (!deleteId) return;
    try {
      await deleteAdminPromotionApi(deleteId);
      setPromotions((prev) => prev.filter((p) => p._id !== deleteId));
    } catch (err) {
      console.error("Failed to delete promotion:", err);
    }
    setDeleteId(null);
  };

  const toggleActive = async (p: Promotion) => {
    try {
      await updateAdminPromotionApi(p._id, { isActive: !p.isActive });
      fetchPromotions();
    } catch (err) {
      console.error("Failed to toggle promotion active status:", err);
    }
  };

  const selectedCategoryObj = categories.find((c) => c.slug === form.targetCategory);
  const availableSubcategories = selectedCategoryObj?.subcategories || [];
  const selectedSubcategoryObj = availableSubcategories.find((s) => s.slug === form.targetSubCategory);

  const availableProducts = products.filter((p) => {
    if (!form.targetCategory || !form.targetSubCategory) return false;
    return p.category === form.targetCategory && p.subcategory === form.targetSubCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl text-[color:var(--color-text-primary)] md:text-3xl">Promotions & Offers</h1>
          <p className="mt-0.5 text-sm text-[color:var(--color-text-secondary)]">Manage automatic BOGO deals and category-wide percentage sales</p>
        </div>
        <Button
          variant="primary"
          iconLeft={<Plus className="h-4 w-4" />}
          onClick={() => {
            resetForm();
            setEditing(null);
            setShowForm(true);
          }}
          className="text-xs"
        >
          Add Promotion
        </Button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[color:var(--color-text-primary)]">{editing ? "Edit Promotion" : "New Promotion"}</h3>
                <button type="button" onClick={() => setShowForm(false)} className="text-[color:var(--color-text-tertiary)] hover:text-[color:var(--color-text-primary)]">
                  <X className="h-4 w-4" />
                </button>
              </div>

              {errorMsg && (
                <div className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-600">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {errorMsg}
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-[color:var(--color-text-secondary)]">Promotion Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Ray-Ban BOGO Offer"
                    className="mt-1 w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-app-bg)] px-3.5 py-2.5 text-sm text-[color:var(--color-text-primary)]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[color:var(--color-text-secondary)]">Promotion Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => {
                      const newType = e.target.value as "bogo" | "category-percent-off";
                      setForm({
                        ...form,
                        type: newType,
                        badgeText: newType === "bogo" ? "BUY 1 GET 1 FREE" : `${form.discountPercent}% OFF`
                      });
                    }}
                    className="mt-1 w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-app-bg)] px-3.5 py-2.5 text-sm text-[color:var(--color-text-primary)]"
                  >
                    <option value="bogo">Buy 1 Get 1 Free (BOGO)</option>
                    <option value="category-percent-off">Category Percentage Off</option>
                  </select>
                </div>

                {/* 1. Target Main Category */}
                <div>
                  <label className="text-xs font-semibold text-[color:var(--color-text-secondary)]">Target Main Category</label>
                  <select
                    value={form.targetCategory}
                    onChange={(e) => setForm({ ...form, targetCategory: e.target.value, targetSubCategory: "", targetProduct: "" })}
                    className="mt-1 w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-app-bg)] px-3.5 py-2.5 text-sm text-[color:var(--color-text-primary)]"
                  >
                    <option value="">-- All Main Categories --</option>
                    {categories.map((c) => (
                      <option key={c.slug} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* 2. Target Sub-Category (Optional) */}
                <div>
                  <label className="text-xs font-semibold text-[color:var(--color-text-secondary)]">Target Sub-Category (Optional)</label>
                  <select
                    value={form.targetSubCategory}
                    onChange={(e) => setForm({ ...form, targetSubCategory: e.target.value, targetProduct: "" })}
                    disabled={!form.targetCategory}
                    className="mt-1 w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-app-bg)] px-3.5 py-2.5 text-sm text-[color:var(--color-text-primary)] disabled:opacity-50"
                  >
                    <option value="">
                      {form.targetCategory
                        ? `-- All Sub-Categories in ${selectedCategoryObj?.name || form.targetCategory} --`
                        : "-- Select Main Category First --"}
                    </option>
                    {availableSubcategories.map((sub) => (
                      <option key={sub.slug} value={sub.slug}>{sub.name}</option>
                    ))}
                  </select>
                </div>

                {/* 3. Target Specific Product (Optional) */}
                <div>
                  <label className="text-xs font-semibold text-[color:var(--color-text-secondary)]">Target Specific Product (Optional)</label>
                  <select
                    value={form.targetProduct}
                    onChange={(e) => setForm({ ...form, targetProduct: e.target.value })}
                    disabled={!form.targetSubCategory}
                    className="mt-1 w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-app-bg)] px-3.5 py-2.5 text-sm text-[color:var(--color-text-primary)] disabled:opacity-50"
                  >
                    <option value="">
                      {form.targetSubCategory
                        ? `-- All Products in ${selectedSubcategoryObj?.name || form.targetSubCategory} --`
                        : form.targetCategory
                        ? "-- Select Sub-Category First --"
                        : "-- Select Main Category First --"}
                    </option>
                    {availableProducts.map((p) => (
                      <option key={p.id} value={p.id}>{p.brand} - {p.name}</option>
                    ))}
                  </select>
                </div>

                {form.type === "category-percent-off" && (
                  <div>
                    <label className="text-xs font-semibold text-[color:var(--color-text-secondary)]">Discount Percent (%)</label>
                    <input
                      type="number"
                      min="1"
                      max="99"
                      value={form.discountPercent}
                      onChange={(e) => setForm({ ...form, discountPercent: Number(e.target.value) })}
                      className="mt-1 w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-app-bg)] px-3.5 py-2.5 text-sm text-[color:var(--color-text-primary)]"
                    />
                  </div>
                )}

                <div>
                  <label className="text-xs font-semibold text-[color:var(--color-text-secondary)]">Customer Badge Text</label>
                  <input
                    type="text"
                    value={form.badgeText}
                    onChange={(e) => setForm({ ...form, badgeText: e.target.value })}
                    placeholder="e.g. BUY 1 GET 1 FREE"
                    className="mt-1 w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-app-bg)] px-3.5 py-2.5 text-sm text-[color:var(--color-text-primary)]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[color:var(--color-text-secondary)]">Start Date</label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-app-bg)] px-3.5 py-2.5 text-sm text-[color:var(--color-text-primary)]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[color:var(--color-text-secondary)]">End Date</label>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-app-bg)] px-3.5 py-2.5 text-sm text-[color:var(--color-text-primary)]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button variant="secondary" onClick={() => setShowForm(false)} className="text-xs">Cancel</Button>
                <Button variant="primary" onClick={savePromotion} className="text-xs">{editing ? "Update" : "Create"} Promotion</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="py-12 text-center text-sm text-[color:var(--color-text-secondary)]">Loading promotions…</div>
      ) : promotions.length === 0 ? (
        <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-12 text-center">
          <Sparkles className="mx-auto h-10 w-10 text-[color:var(--color-text-tertiary)]" />
          <h3 className="mt-3 font-display text-lg text-[color:var(--color-text-primary)]">No Active Promotions</h3>
          <p className="mt-1 text-sm text-[color:var(--color-text-secondary)]">Create automatic BOGO or Category %-Off offers to engage shoppers.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {promotions.map((p) => {
            const targetProdName = typeof p.targetProduct === "object" && p.targetProduct ? `${p.targetProduct.brand} - ${p.targetProduct.name}` : null;
            const now = new Date();
            const start = new Date(p.startDate);
            const end = new Date(p.endDate);
            const isCurrentlyActive = p.isActive && now >= start && now <= end;

            return (
              <div key={p._id} className="flex flex-col justify-between rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-5">
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="rounded-lg bg-[color:var(--color-brand-primary)] px-2.5 py-1 text-xs font-bold text-white uppercase tracking-wider">
                        {p.type === "bogo" ? "BOGO" : `${p.discountPercent}% OFF`}
                      </span>
                      <h3 className="font-semibold text-sm text-[color:var(--color-text-primary)]">{p.name}</h3>
                    </div>
                    <div className="flex items-center gap-1">
                      <button type="button" onClick={() => openEdit(p)} className="flex h-7 w-7 items-center justify-center rounded-lg text-[color:var(--color-text-tertiary)] hover:bg-[color:var(--color-surface-muted)]">
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                      <button type="button" onClick={() => setDeleteId(p._id)} className="flex h-7 w-7 items-center justify-center rounded-lg text-[color:var(--color-text-tertiary)] hover:bg-red-500/10 hover:text-red-500">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 space-y-1.5 text-xs text-[color:var(--color-text-secondary)]">
                    <p><strong className="text-[color:var(--color-text-primary)]">Target:</strong> {targetProdName ? `Product: ${targetProdName}` : `Category: ${p.targetCategory}`}</p>
                    <p><strong className="text-[color:var(--color-text-primary)]">Badge:</strong> <span className="rounded bg-[color:var(--color-accent-teal)]/10 px-2 py-0.5 font-bold text-[color:var(--color-accent-teal)]">{p.badgeText}</span></p>
                    <p><strong className="text-[color:var(--color-text-primary)]">Duration:</strong> {new Date(p.startDate).toLocaleDateString()} – {new Date(p.endDate).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-[color:var(--color-border)] pt-3 text-xs">
                  <span className="flex items-center gap-1.5 font-medium">
                    Status: <StatusBadge status={isCurrentlyActive ? "active" : "inactive"} />
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleActive(p)}
                    className="text-[11px] font-semibold text-[color:var(--color-accent-teal)] hover:underline"
                  >
                    {p.isActive ? "Pause Offer" : "Enable Offer"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmModal open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={removePromotion} title="Delete Promotion" message="Are you sure you want to delete this promotion offer?" />
    </div>
  );
}
