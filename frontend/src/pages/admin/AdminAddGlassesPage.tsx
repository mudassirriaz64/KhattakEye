import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Plus, X, ImagePlus, LoaderCircle, Glasses } from "lucide-react";
import { Button } from "@/components/primitives/Button";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { cn } from "@/lib/utils";
import { createProductApi, getCategoriesApi, adminGetProductByIdApi } from "@/lib/api/admin";
import { useToastStore } from "@/lib/stores/toast-store";

export function AdminAddGlassesPage() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const addToast = useToastStore((s) => s.addToast);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    kind: "glasses",
    name: "",
    brand: "Louis Vuitton",
    category: "sunglasses",
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
    gender: [] as string[],
    weight: "",
    frameMaterial: "Acetate",
    frameShape: "Square",
    frameColor: "Black",
    lensType: "UV400 Protected",
    lensColor: "Standard Tint",
    frameWidth: "54",
    lensWidth: "18",
    bridgeWidth: "145",
    templeLength: "145",
    warranty: "1 Year Warranty",
  });

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [variants, setVariants] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (id) {
      adminGetProductByIdApi(id).then((product) => {
        if (product) {
          setForm({
            kind: "glasses",
            name: product.name || "",
            brand: product.brand || "Louis Vuitton",
            category: product.category || "sunglasses",
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
            gender: Array.isArray(product.gender) ? product.gender : [],
            weight: product.weight ? String(product.weight) : "",
            frameMaterial: product.frameMaterial || "Acetate",
            frameShape: product.frameShape || "Square",
            frameColor: product.frameColor || "Black",
            lensType: product.lensType || "UV400 Protected",
            lensColor: product.lensColor || "Standard Tint",
            frameWidth: "54",
            lensWidth: "18",
            bridgeWidth: "145",
            templeLength: "145",
            warranty: product.warranty || "1 Year Warranty",
          });
          if (Array.isArray(product.images)) {
            setImagePreviews(product.images);
          }
          if (Array.isArray(product.variants)) {
            setVariants(product.variants);
          }
        }
      }).catch((err) => console.error("Failed to fetch glasses details for edit:", err));
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

  const toggleGender = (g: string) => {
    setForm((prev) => ({
      ...prev,
      gender: prev.gender.includes(g)
        ? prev.gender.filter((x) => x !== g)
        : [...prev.gender, g],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.category) {
      addToast({ title: "Validation Error", description: "Name, price, and category are required", type: "error" });
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("kind", "glasses");
      formData.append("name", form.name);
      formData.append("brand", form.brand);
      formData.append("category", form.category);
      formData.append("subcategory", form.subcategory);
      formData.append("description", form.description);
      formData.append("shortDescription", form.shortDescription);
      formData.append("price", form.price);
      if (form.oldPrice) formData.append("oldPrice", form.oldPrice);
      if (form.cost) formData.append("cost", form.cost);
      formData.append("sku", form.sku || `GLS-${Date.now()}`);
      formData.append("stock", form.stock || "10");
      formData.append("status", form.status);
      formData.append("featured", String(form.featured));
      formData.append("isNewArrival", String(form.isNewArrival));
      formData.append("isBestSeller", String(form.isBestSeller));
      formData.append("gender", JSON.stringify(form.gender));
      formData.append("frameShape", form.frameShape);
      formData.append("frameMaterial", form.frameMaterial);
      formData.append("frameColor", form.frameColor);
      formData.append("lensType", form.lensType);
      formData.append("lensColor", form.lensColor);
      formData.append("weight", form.weight);
      formData.append("warranty", form.warranty);
      formData.append("variants", JSON.stringify(variants));

      images.forEach((file) => {
        formData.append("images", file);
      });

      await createProductApi(formData);
      addToast({ title: "Success", description: id ? "Glasses updated successfully" : "Glasses added successfully", type: "success" });
      navigate("/admin/products");
    } catch (err: any) {
      console.error(err);
      addToast({ title: "Error", description: err.response?.data?.message || "Failed to save product", type: "error" });
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
              <Glasses className="h-5 w-5 text-amber-500" />
              <h1 className="font-display text-2xl text-[color:var(--color-text-primary)] md:text-3xl">
                {id ? "Edit Glasses Product" : "Add Glasses Product"}
              </h1>
            </div>
            <p className="mt-0.5 text-xs text-[color:var(--color-text-secondary)]">Eyeglasses & Sunglasses inventory</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button type="button" variant="outline" onClick={() => navigate("/admin/products")}>Cancel</Button>
          <Button type="button" onClick={handleSubmit} disabled={isSubmitting} className="flex items-center gap-2 bg-[color:var(--color-brand-primary)] text-white">
            {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Glasses
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Main Info */}
          <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 space-y-4">
            <h2 className="font-display text-lg text-[color:var(--color-text-primary)] border-b border-[color:var(--color-border)] pb-3">Basic Information</h2>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[color:var(--color-text-secondary)]">Product Title *</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="e.g. Aviator Classic Gold" className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm text-[color:var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-brand-primary)]" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[color:var(--color-text-secondary)]">Brand *</label>
                <input type="text" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} required placeholder="e.g. Louis Vuitton" className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm text-[color:var(--color-text-primary)]" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[color:var(--color-text-secondary)]">Category *</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm text-[color:var(--color-text-primary)]">
                  <option value="sunglasses">Sunglasses</option>
                  <option value="eyeglasses">Eyeglasses</option>
                </select>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[color:var(--color-text-secondary)]">Short Description</label>
              <input type="text" value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} placeholder="One-line summary for cards" className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm text-[color:var(--color-text-primary)]" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[color:var(--color-text-secondary)]">Full Description</label>
              <textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Detailed product description..." className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm text-[color:var(--color-text-primary)]" />
            </div>
          </div>

          {/* Glasses Specifications */}
          <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 space-y-4">
            <h2 className="font-display text-lg text-[color:var(--color-text-primary)] border-b border-[color:var(--color-border)] pb-3">Frame & Lens Specifications</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[color:var(--color-text-secondary)]">Frame Shape</label>
                <select value={form.frameShape} onChange={(e) => setForm({ ...form, frameShape: e.target.value })} className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm text-[color:var(--color-text-primary)]">
                  <option value="Aviator">Aviator</option>
                  <option value="Wayfarer">Wayfarer</option>
                  <option value="Round">Round</option>
                  <option value="Square">Square</option>
                  <option value="Cat-Eye">Cat-Eye</option>
                  <option value="Rectangle">Rectangle</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[color:var(--color-text-secondary)]">Frame Material</label>
                <select value={form.frameMaterial} onChange={(e) => setForm({ ...form, frameMaterial: e.target.value })} className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm text-[color:var(--color-text-primary)]">
                  <option value="Acetate">Acetate</option>
                  <option value="Titanium">Titanium</option>
                  <option value="Metal">Metal</option>
                  <option value="TR90">TR90 Flexible</option>
                  <option value="Stainless Steel">Stainless Steel</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[color:var(--color-text-secondary)]">Lens Type</label>
                <input type="text" value={form.lensType} onChange={(e) => setForm({ ...form, lensType: e.target.value })} placeholder="e.g. UV400 Polarized" className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm text-[color:var(--color-text-primary)]" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[color:var(--color-text-secondary)]">Frame Color</label>
                <input type="text" value={form.frameColor} onChange={(e) => setForm({ ...form, frameColor: e.target.value })} placeholder="e.g. Matte Black" className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm text-[color:var(--color-text-primary)]" />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold text-[color:var(--color-text-secondary)]">Target Gender</label>
              <div className="flex flex-wrap gap-2">
                {["men", "women", "unisex", "kids"].map((g) => (
                  <button key={g} type="button" onClick={() => toggleGender(g)} className={cn("rounded-xl px-3 py-1.5 text-xs font-semibold uppercase transition-colors", form.gender.includes(g) ? "bg-[color:var(--color-brand-primary)] text-white" : "border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-secondary)]")}>
                    {g}
                  </button>
                ))}
              </div>
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

        {/* Pricing & Settings Sidebar */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 space-y-4">
            <h2 className="font-display text-base font-bold text-[color:var(--color-text-primary)] border-b border-[color:var(--color-border)] pb-3">Pricing & Stock</h2>
            <div>
              <label className="mb-1 block text-xs font-semibold text-[color:var(--color-text-secondary)]">Price (PKR) *</label>
              <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required placeholder="18500" className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-3.5 py-2 text-sm text-[color:var(--color-text-primary)]" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-[color:var(--color-text-secondary)]">Original Price (PKR)</label>
              <input type="number" value={form.oldPrice} onChange={(e) => setForm({ ...form, oldPrice: e.target.value })} placeholder="22000" className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-3.5 py-2 text-sm text-[color:var(--color-text-primary)]" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-[color:var(--color-text-secondary)]">Stock *</label>
                <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required placeholder="15" className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-3.5 py-2 text-sm text-[color:var(--color-text-primary)]" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-[color:var(--color-text-secondary)]">SKU</label>
                <input type="text" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} placeholder="KT-AV-101" className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-3.5 py-2 text-sm text-[color:var(--color-text-primary)]" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 space-y-4">
            <h2 className="font-display text-base font-bold text-[color:var(--color-text-primary)] border-b border-[color:var(--color-border)] pb-3">Status & Visibility</h2>
            <div>
              <label className="mb-1 block text-xs font-semibold text-[color:var(--color-text-secondary)]">Product Status</label>
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
