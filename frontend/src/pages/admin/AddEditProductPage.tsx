import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Eye, Plus, X, ImagePlus } from "lucide-react";
import { Button } from "@/components/primitives/Button";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { cn } from "@/lib/utils";

export function AddEditProductPage() {
  const [form, setForm] = useState({
    name: "", brand: "khattak-atelier", category: "sunglasses", description: "", shortDescription: "",
    price: "", oldPrice: "", cost: "", sku: "", stock: "", status: "draft", featured: false,
    weight: "", frameMaterial: "", lensMaterial: "", lensType: "standard", frameWidth: "",
    lensWidth: "", bridgeWidth: "", templeLength: "",
    metaTitle: "", metaDescription: "", metaKeywords: "",
  });

  const [variants, setVariants] = useState<{ color: string; colorName: string; stock: number }[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [relatedProducts] = useState<string[]>([]);

  const set = (key: string, value: any) => setForm((p) => ({ ...p, [key]: value }));

  const addVariant = () => setVariants((prev) => [...prev, { color: "", colorName: "", stock: 0 }]);
  const updateVariant = (i: number, key: string, value: any) => setVariants((prev) => prev.map((v, j) => j === i ? { ...v, [key]: value } : v));
  const removeVariant = (i: number) => setVariants((prev) => prev.filter((_, j) => j !== i));

  const sections = [
    { id: "general", label: "General Information" },
    { id: "images", label: "Images" },
    { id: "variants", label: "Variants" },
    { id: "frame", label: "Frame Details" },
    { id: "lens", label: "Lens Details" },
    { id: "pricing", label: "Pricing & Inventory" },
    { id: "seo", label: "SEO" },
  ];

  const [activeSection, setActiveSection] = useState("general");

  const inputClass = "w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm text-[color:var(--color-text-primary)] shadow-[var(--shadow-input)] transition-all placeholder:text-[color:var(--color-text-tertiary)] focus:border-[color:var(--color-accent-teal)] focus:outline-none focus:ring-4 focus:ring-[color:var(--color-focus-ring)]";
  const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-secondary)]";

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link to="/admin/products" className="inline-flex items-center gap-1.5 text-xs text-[color:var(--color-text-tertiary)] hover:text-[color:var(--color-text-primary)]">
            <ArrowLeft className="h-3 w-3" /> Back to Products
          </Link>
          <h1 className="mt-2 font-display text-2xl text-[color:var(--color-text-primary)] md:text-3xl">Add New Product</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" iconLeft={<Eye className="h-4 w-4" />} className="text-xs">Preview</Button>
          <Button variant="primary" iconLeft={<Save className="h-4 w-4" />} className="text-xs">Save Product</Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <nav className="space-y-1">
          {sections.map((s) => (
            <button key={s.id} type="button" onClick={() => setActiveSection(s.id)} className={cn("flex w-full items-center rounded-xl px-3.5 py-2.5 text-left text-xs font-medium transition-colors", activeSection === s.id ? "bg-[color:var(--color-brand-primary)] text-white" : "text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-muted)] hover:text-[color:var(--color-text-primary)]")}>
              {s.label}
            </button>
          ))}
        </nav>

        <div className="space-y-8">
          {activeSection === "general" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className={labelClass}>Product Name</label>
                  <input type="text" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Noir Line Titanium" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Brand</label>
                  <select value={form.brand} onChange={(e) => set("brand", e.target.value)} className={inputClass}>
                    <option value="khattak-atelier">Khattak Atelier</option>
                    <option value="khattak-signature">Khattak Signature</option>
                    <option value="khattak-heritage">Khattak Heritage</option>
                    <option value="khattak-performance">Khattak Performance</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Category</label>
                  <select value={form.category} onChange={(e) => set("category", e.target.value)} className={inputClass}>
                    <option value="sunglasses">Sunglasses</option>
                    <option value="eyeglasses">Eyeglasses</option>
                    <option value="sports">Sports</option>
                    <option value="kids">Kids</option>
                    <option value="blue-light">Blue Light</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>Short Description</label>
                  <input type="text" value={form.shortDescription} onChange={(e) => set("shortDescription", e.target.value)} placeholder="Brief product description" className={inputClass} />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>Full Description</label>
                  <textarea rows={4} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Detailed product description..." className={inputClass} />
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} className="h-4 w-4 rounded border-[color:var(--color-border)] text-[color:var(--color-accent-teal)]" />
                    <span className="text-sm text-[color:var(--color-text-secondary)]">Featured product</span>
                  </label>
                  <StatusBadge status={form.status} />
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === "images" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="grid grid-cols-4 gap-4">
                {images.map((img, i) => (
                  <div key={i} className="relative aspect-square rounded-xl bg-[color:var(--color-surface-muted)]">
                    <img src={img} alt="" className="h-full w-full rounded-xl object-cover" />
                    <button type="button" onClick={() => setImages((prev) => prev.filter((_, j) => j !== i))} className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[color:var(--color-danger)] text-white shadow-[var(--shadow-soft)]">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => setImages((prev) => [...prev, "https://via.placeholder.com/400"])} className="flex aspect-square items-center justify-center rounded-xl border-2 border-dashed border-[color:var(--color-border)] transition-colors hover:border-[color:var(--color-accent-teal)]">
                  <div className="text-center">
                    <ImagePlus className="mx-auto h-8 w-8 text-[color:var(--color-text-tertiary)]" />
                    <p className="mt-2 text-xs text-[color:var(--color-text-tertiary)]">Add Image</p>
                  </div>
                </button>
              </div>
            </motion.div>
          )}

          {activeSection === "variants" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              {variants.map((v, i) => (
                <div key={i} className="flex items-end gap-3 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] p-4">
                  <div className="flex-1">
                    <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-tertiary)]">Color Name</label>
                    <input type="text" value={v.colorName} onChange={(e) => updateVariant(i, "colorName", e.target.value)} placeholder="e.g. Matte Black" className={inputClass} />
                  </div>
                  <div className="flex-1">
                    <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-tertiary)]">Hex Color</label>
                    <input type="text" value={v.color} onChange={(e) => updateVariant(i, "color", e.target.value)} placeholder="#111111" className={inputClass} />
                  </div>
                  <div className="w-20">
                    <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-tertiary)]">Stock</label>
                    <input type="number" value={v.stock} onChange={(e) => updateVariant(i, "stock", Number(e.target.value))} className={inputClass} />
                  </div>
                  <button type="button" onClick={() => removeVariant(i)} className="flex h-10 w-10 items-center justify-center rounded-lg text-[color:var(--color-text-tertiary)] hover:text-[color:var(--color-danger)]">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button type="button" onClick={addVariant} className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[color:var(--color-border)] py-3 text-sm font-medium text-[color:var(--color-text-secondary)] transition-colors hover:border-[color:var(--color-accent-teal)] hover:text-[color:var(--color-accent-teal)]">
                <Plus className="h-4 w-4" /> Add Variant
              </button>
            </motion.div>
          )}

          {activeSection === "frame" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-5 sm:grid-cols-2">
              <div><label className={labelClass}>Frame Material</label><input type="text" value={form.frameMaterial} onChange={(e) => set("frameMaterial", e.target.value)} placeholder="e.g. Japanese Titanium" className={inputClass} /></div>
              <div><label className={labelClass}>Weight (g)</label><input type="text" value={form.weight} onChange={(e) => set("weight", e.target.value)} placeholder="e.g. 18" className={inputClass} /></div>
              <div><label className={labelClass}>Frame Width (mm)</label><input type="text" value={form.frameWidth} onChange={(e) => set("frameWidth", e.target.value)} placeholder="e.g. 140" className={inputClass} /></div>
              <div><label className={labelClass}>Bridge Width (mm)</label><input type="text" value={form.bridgeWidth} onChange={(e) => set("bridgeWidth", e.target.value)} placeholder="e.g. 18" className={inputClass} /></div>
              <div><label className={labelClass}>Lens Width (mm)</label><input type="text" value={form.lensWidth} onChange={(e) => set("lensWidth", e.target.value)} placeholder="e.g. 52" className={inputClass} /></div>
              <div><label className={labelClass}>Temple Length (mm)</label><input type="text" value={form.templeLength} onChange={(e) => set("templeLength", e.target.value)} placeholder="e.g. 145" className={inputClass} /></div>
            </motion.div>
          )}

          {activeSection === "lens" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-5 sm:grid-cols-2">
              <div><label className={labelClass}>Lens Material</label><input type="text" value={form.lensMaterial} onChange={(e) => set("lensMaterial", e.target.value)} placeholder="e.g. Polycarbonate" className={inputClass} /></div>
              <div><label className={labelClass}>Lens Type</label><select value={form.lensType} onChange={(e) => set("lensType", e.target.value)} className={inputClass}>
                <option value="standard">Standard</option>
                <option value="blue-light">Blue Light Blocking</option>
                <option value="photochromic">Photochromic</option>
                <option value="polarized">Polarized</option>
                <option value="progressive">Progressive</option>
              </select></div>
            </motion.div>
          )}

          {activeSection === "pricing" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-5 sm:grid-cols-3">
              <div><label className={labelClass}>Price (Rs.)</label><input type="text" value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="e.g. 28500" className={inputClass} /></div>
              <div><label className={labelClass}>Old Price (Rs.)</label><input type="text" value={form.oldPrice} onChange={(e) => set("oldPrice", e.target.value)} placeholder="e.g. 34000" className={inputClass} /></div>
              <div><label className={labelClass}>Cost (Rs.)</label><input type="text" value={form.cost} onChange={(e) => set("cost", e.target.value)} placeholder="e.g. 12000" className={inputClass} /></div>
              <div><label className={labelClass}>SKU</label><input type="text" value={form.sku} onChange={(e) => set("sku", e.target.value)} placeholder="e.g. KT-AT-001" className={inputClass} /></div>
              <div><label className={labelClass}>Stock</label><input type="number" value={form.stock} onChange={(e) => set("stock", e.target.value)} placeholder="e.g. 15" className={inputClass} /></div>
              <div><label className={labelClass}>Status</label><select value={form.status} onChange={(e) => set("status", e.target.value)} className={inputClass}>
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select></div>
            </motion.div>
          )}

          {activeSection === "seo" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
              <div><label className={labelClass}>Meta Title</label><input type="text" value={form.metaTitle} onChange={(e) => set("metaTitle", e.target.value)} placeholder="SEO title" className={inputClass} /></div>
              <div><label className={labelClass}>Meta Description</label><textarea rows={3} value={form.metaDescription} onChange={(e) => set("metaDescription", e.target.value)} placeholder="SEO description..." className={inputClass} /></div>
              <div><label className={labelClass}>Meta Keywords</label><input type="text" value={form.metaKeywords} onChange={(e) => set("metaKeywords", e.target.value)} placeholder="eyewear, sunglasses, titanium" className={inputClass} /></div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
