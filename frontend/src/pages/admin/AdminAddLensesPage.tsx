import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, X, ImagePlus, LoaderCircle, Eye } from "lucide-react";
import { Button } from "@/components/primitives/Button";
import { createProductApi, adminGetProductByIdApi } from "@/lib/api/admin";
import { useToastStore } from "@/lib/stores/toast-store";

export function AdminAddLensesPage() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const addToast = useToastStore((s) => s.addToast);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    kind: "lenses",
    name: "",
    brand: "Bella",
    category: "contact-lenses",
    subcategory: "",
    description: "",
    shortDescription: "",
    price: "",
    oldPrice: "",
    cost: "",
    sku: "",
    stock: "",
    status: "active",
    featured: false,
    isNewArrival: false,
    isBestSeller: false,
    wearDuration: "monthly",
    disposalType: "Monthly Disposable",
    packSize: "30",
    baseCurve: "8.6",
    diameter: "14.2",
    waterContent: "58",
    powerMin: "-10.00",
    powerMax: "+6.00",
    isToric: false,
    isMultifocal: false,
    colorTint: "",
  });

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (id) {
      adminGetProductByIdApi(id).then((product) => {
        if (product) {
          setForm({
            kind: "lenses",
            name: product.name || "",
            brand: product.brand || "Bella",
            category: product.category || "contact-lenses",
            subcategory: product.subcategory || "",
            description: product.description || "",
            shortDescription: product.shortDescription || "",
            price: product.price ? String(product.price) : "",
            oldPrice: product.oldPrice ? String(product.oldPrice) : "",
            cost: product.cost ? String(product.cost) : "",
            sku: product.sku || "",
            stock: product.stock ? String(product.stock) : "",
            status: product.status || "active",
            featured: Boolean(product.featured),
            isNewArrival: Boolean(product.isNewArrival),
            isBestSeller: Boolean(product.isBestSeller),
            wearDuration: product.wearDuration || "monthly",
            disposalType: product.disposalType || "Monthly Disposable",
            packSize: product.packSize ? String(product.packSize) : "30",
            baseCurve: product.baseCurve ? String(product.baseCurve) : "8.6",
            diameter: product.diameter ? String(product.diameter) : "14.2",
            waterContent: product.waterContent ? String(product.waterContent) : "58",
            powerMin: product.powerRange?.min ? String(product.powerRange.min) : "-10.00",
            powerMax: product.powerRange?.max ? String(product.powerRange.max) : "+6.00",
            isToric: Boolean(product.isToric),
            isMultifocal: Boolean(product.isMultifocal),
            colorTint: product.colorTint || "",
          });
          if (Array.isArray(product.images)) {
            setImagePreviews(product.images);
          }
        }
      }).catch((err) => console.error("Failed to fetch lenses details for edit:", err));
    }
  }, [id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImages((prev) => [...prev, ...filesArray]);
      const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price) {
      addToast({ title: "Validation Error", description: "Name and price are required", type: "error" });
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("kind", "lenses");
      formData.append("name", form.name);
      formData.append("brand", form.brand);
      formData.append("category", "contact-lenses");
      formData.append("subcategory", form.subcategory);
      formData.append("description", form.description);
      formData.append("shortDescription", form.shortDescription);
      formData.append("price", form.price);
      if (form.oldPrice) formData.append("oldPrice", form.oldPrice);
      if (form.cost) formData.append("cost", form.cost);
      formData.append("sku", form.sku || `LNS-${Date.now()}`);
      formData.append("stock", form.stock || "20");
      formData.append("status", form.status);
      formData.append("featured", String(form.featured));
      formData.append("isNewArrival", String(form.isNewArrival));
      formData.append("isBestSeller", String(form.isBestSeller));
      
      // Lenses fields
      formData.append("wearDuration", form.wearDuration);
      formData.append("disposalType", form.disposalType);
      formData.append("packSize", form.packSize);
      formData.append("baseCurve", form.baseCurve);
      formData.append("diameter", form.diameter);
      formData.append("waterContent", form.waterContent);
      formData.append("powerMin", form.powerMin);
      formData.append("powerMax", form.powerMax);
      formData.append("isToric", String(form.isToric));
      formData.append("isMultifocal", String(form.isMultifocal));
      formData.append("colorTint", form.colorTint);

      images.forEach((file) => {
        formData.append("images", file);
      });

      await createProductApi(formData);
      addToast({ title: "Success", description: id ? "Contact Lenses updated successfully" : "Contact Lenses added successfully", type: "success" });
      navigate("/admin/products");
    } catch (err: any) {
      console.error(err);
      addToast({ title: "Error", description: err.response?.data?.message || "Failed to save lenses product", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pb-16">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/admin/products" className="flex h-10 w-10 items-center justify-center rounded-xl border border-[color:var(--color-border)] text-[color:var(--color-text-secondary)] transition-colors hover:bg-[color:var(--color-surface-muted)]">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-teal-500" />
              <h1 className="font-display text-2xl text-[color:var(--color-text-primary)] md:text-3xl">
                {id ? "Edit Contact Lenses" : "Add Contact Lenses Product"}
              </h1>
            </div>
            <p className="mt-0.5 text-xs text-[color:var(--color-text-secondary)]">Transparent & Colored contact lenses inventory</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button type="button" variant="outline" onClick={() => navigate("/admin/products")}>Cancel</Button>
          <Button type="button" onClick={handleSubmit} disabled={isSubmitting} className="flex items-center gap-2 bg-[color:var(--color-brand-primary)] text-white">
            {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Contact Lenses
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Basic Info */}
          <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 space-y-4">
            <h2 className="font-display text-lg text-[color:var(--color-text-primary)] border-b border-[color:var(--color-border)] pb-3">Basic Information</h2>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[color:var(--color-text-secondary)]">Lens Name *</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="e.g. Bella Glow Hazel" className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm text-[color:var(--color-text-primary)]" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[color:var(--color-text-secondary)]">Brand *</label>
                <input type="text" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} required placeholder="e.g. Bella, Acuvue, Solotica" className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm text-[color:var(--color-text-primary)]" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[color:var(--color-text-secondary)]">Category</label>
                <input type="text" disabled value="Contact Lenses" className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm text-[color:var(--color-text-tertiary)] opacity-70" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[color:var(--color-text-secondary)]">Short Description</label>
              <input type="text" value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} placeholder="One-line summary" className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm text-[color:var(--color-text-primary)]" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[color:var(--color-text-secondary)]">Full Description</label>
              <textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Detailed product description..." className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm text-[color:var(--color-text-primary)]" />
            </div>
          </div>

          {/* Lenses Optical Specifications */}
          <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 space-y-4">
            <h2 className="font-display text-lg text-[color:var(--color-text-primary)] border-b border-[color:var(--color-border)] pb-3">Optical & Physical Specifications</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[color:var(--color-text-secondary)]">Wear Duration *</label>
                <select value={form.wearDuration} onChange={(e) => setForm({ ...form, wearDuration: e.target.value })} className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-3 py-2 text-sm text-[color:var(--color-text-primary)]">
                  <option value="daily">Daily</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[color:var(--color-text-secondary)]">Disposal Type</label>
                <input type="text" value={form.disposalType} onChange={(e) => setForm({ ...form, disposalType: e.target.value })} placeholder="e.g. Daily Disposable" className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-3.5 py-2 text-sm text-[color:var(--color-text-primary)]" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[color:var(--color-text-secondary)]">Pack Size (Lenses/Box)</label>
                <input type="number" value={form.packSize} onChange={(e) => setForm({ ...form, packSize: e.target.value })} placeholder="30" className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-3.5 py-2 text-sm text-[color:var(--color-text-primary)]" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[color:var(--color-text-secondary)]">Base Curve (BC mm)</label>
                <input type="number" step="0.1" value={form.baseCurve} onChange={(e) => setForm({ ...form, baseCurve: e.target.value })} placeholder="8.6" className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-3.5 py-2 text-sm text-[color:var(--color-text-primary)]" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[color:var(--color-text-secondary)]">Diameter (DIA mm)</label>
                <input type="number" step="0.1" value={form.diameter} onChange={(e) => setForm({ ...form, diameter: e.target.value })} placeholder="14.2" className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-3.5 py-2 text-sm text-[color:var(--color-text-primary)]" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[color:var(--color-text-secondary)]">Water Content (%)</label>
                <input type="number" value={form.waterContent} onChange={(e) => setForm({ ...form, waterContent: e.target.value })} placeholder="58" className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-3.5 py-2 text-sm text-[color:var(--color-text-primary)]" />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[color:var(--color-text-secondary)]">Color / Tint (leave blank for transparent)</label>
              <input type="text" value={form.colorTint} onChange={(e) => setForm({ ...form, colorTint: e.target.value })} placeholder="e.g. Hazel Green, Sapphire Blue" className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2 text-sm text-[color:var(--color-text-primary)]" />
            </div>

            <div className="flex flex-wrap gap-6 pt-2">
              <label className="flex items-center gap-2.5 text-xs text-[color:var(--color-text-primary)] font-medium">
                <input type="checkbox" checked={form.isToric} onChange={(e) => setForm({ ...form, isToric: e.target.checked })} className="h-4 w-4 rounded border-[color:var(--color-border)] text-teal-600" />
                Toric Lens (Astigmatism Correction)
              </label>
              <label className="flex items-center gap-2.5 text-xs text-[color:var(--color-text-primary)] font-medium">
                <input type="checkbox" checked={form.isMultifocal} onChange={(e) => setForm({ ...form, isMultifocal: e.target.checked })} className="h-4 w-4 rounded border-[color:var(--color-border)] text-teal-600" />
                Multifocal Lens (Presbyopia Correction)
              </label>
            </div>
          </div>

          {/* Media Upload */}
          <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 space-y-4">
            <h2 className="font-display text-lg text-[color:var(--color-text-primary)] border-b border-[color:var(--color-border)] pb-3">Product Media</h2>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {imagePreviews.map((src, idx) => (
                <div key={idx} className="group relative aspect-square overflow-hidden rounded-xl border border-[color:var(--color-border)] bg-black/5">
                  <img src={src} alt="" className="h-full w-full object-cover" />
                  <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => fileInputRef.current?.click()} className="flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-[color:var(--color-border)] text-[color:var(--color-text-tertiary)] hover:border-[color:var(--color-brand-primary)] hover:text-[color:var(--color-brand-primary)]">
                <ImagePlus className="h-5 w-5" />
                <span className="text-[10px] font-semibold">Add Image</span>
              </button>
              <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
            </div>
          </div>
        </div>

        {/* Pricing & Visibility Sidebar */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 space-y-4">
            <h2 className="font-display text-base font-bold text-[color:var(--color-text-primary)] border-b border-[color:var(--color-border)] pb-3">Pricing & Stock</h2>
            <div>
              <label className="mb-1 block text-xs font-semibold text-[color:var(--color-text-secondary)]">Price per Box (PKR) *</label>
              <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required placeholder="4500" className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-3.5 py-2 text-sm text-[color:var(--color-text-primary)]" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-[color:var(--color-text-secondary)]">Original Price (PKR)</label>
              <input type="number" value={form.oldPrice} onChange={(e) => setForm({ ...form, oldPrice: e.target.value })} placeholder="5200" className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-3.5 py-2 text-sm text-[color:var(--color-text-primary)]" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-[color:var(--color-text-secondary)]">Stock (Boxes) *</label>
                <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required placeholder="25" className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-3.5 py-2 text-sm text-[color:var(--color-text-primary)]" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-[color:var(--color-text-secondary)]">SKU</label>
                <input type="text" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} placeholder="LNS-BLL-01" className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-3.5 py-2 text-sm text-[color:var(--color-text-primary)]" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 space-y-4">
            <h2 className="font-display text-base font-bold text-[color:var(--color-text-primary)] border-b border-[color:var(--color-border)] pb-3">Status & Visibility</h2>
            <div>
              <label className="mb-1 block text-xs font-semibold text-[color:var(--color-text-secondary)]">Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-3 py-2 text-sm text-[color:var(--color-text-primary)]">
                <option value="active">Active (Published)</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div className="space-y-2 pt-2">
              <label className="flex items-center gap-2.5 text-xs text-[color:var(--color-text-primary)]">
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="h-4 w-4 rounded border-[color:var(--color-border)] text-[color:var(--color-brand-primary)]" />
                Featured Product
              </label>
              <label className="flex items-center gap-2.5 text-xs text-[color:var(--color-text-primary)]">
                <input type="checkbox" checked={form.isNewArrival} onChange={(e) => setForm({ ...form, isNewArrival: e.target.checked })} className="h-4 w-4 rounded border-[color:var(--color-border)] text-[color:var(--color-brand-primary)]" />
                New Arrival Tag
              </label>
              <label className="flex items-center gap-2.5 text-xs text-[color:var(--color-text-primary)]">
                <input type="checkbox" checked={form.isBestSeller} onChange={(e) => setForm({ ...form, isBestSeller: e.target.checked })} className="h-4 w-4 rounded border-[color:var(--color-border)] text-[color:var(--color-brand-primary)]" />
                Best Seller Tag
              </label>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
