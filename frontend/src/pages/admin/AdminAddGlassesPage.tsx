import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, X, ImagePlus, LoaderCircle, Glasses, Plus, Video } from "lucide-react";
import { Button } from "@/components/primitives/Button";
import { cn } from "@/lib/utils";
import { createProductApi, updateProductApi, adminGetProductByIdApi, getCategoriesApi } from "@/lib/api/admin";
import { type ApiCategory } from "@/lib/admin-data";
import { useToastStore } from "@/lib/stores/toast-store";
import { isAxiosError } from "axios";

const MAX_PHOTO_SIZE = 10 * 1024 * 1024; // 10 MB per photo
const MAX_VIDEO_SIZE = 200 * 1024 * 1024; // 200 MB per video
const MAX_VIDEO_DURATION = 60; // 60 seconds max

export interface VariantItem {
  color: string;
  colorName: string;
  stock: number;
  lensWidth?: string;
  bridgeWidth?: string;
  templeLength?: string;
  frameMaterial?: string;
  images?: File[];
  imagePreviews?: string[];
}

export function AdminAddGlassesPage() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const addToast = useToastStore((s) => s.addToast);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [dbCategories, setDbCategories] = useState<ApiCategory[]>([]);

  useEffect(() => {
    getCategoriesApi()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setDbCategories(data);
        }
      })
      .catch(() => {});
  }, []);

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
    isPolarized: false,
    isPremium: false,
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
  const [videos, setVideos] = useState<File[]>([]);
  const [videoPreviews, setVideoPreviews] = useState<string[]>([]);
  const [variants, setVariants] = useState<VariantItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

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
            isPolarized: Boolean(product.isPolarized),
            isPremium: Boolean(product.isPremium),
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
          if (Array.isArray(product.videos)) {
            setVideoPreviews(product.videos);
          }
          if (Array.isArray(product.variants)) {
            setVariants(product.variants.map((v: any) => ({
              color: v.color || "#000000",
              colorName: v.colorName || "",
              stock: v.stock || 0,
              lensWidth: v.lensWidth || "",
              bridgeWidth: v.bridgeWidth || "",
              templeLength: v.templeLength || "",
              frameMaterial: v.frameMaterial || "",
              imagePreviews: v.images || (v.image ? [v.image] : [])
            })));
          }
        }
      }).catch((err) => console.error("Failed to fetch glasses details for edit:", err));
    }
  }, [id]);

  // Subcategories logic (from MongoDB DB or fallback)
  const sunglassesSubcategories = [
    { name: "Polarized Shades", slug: "polarized-shades" },
    { name: "Driving Sunglasses", slug: "driving-sunglasses" },
    { name: "Fashion & Luxury", slug: "fashion-luxury" },
    { name: "Sports Performance", slug: "sports-performance" }
  ];

  const eyeglassesSubcategories = [
    { name: "Prescription Glasses", slug: "prescription-glasses" },
    { name: "Computer & Blue Light", slug: "blue-light" },
    { name: "Reading Glasses", slug: "reading-glasses" },
    { name: "Rimless & Minimalist", slug: "rimless-frames" }
  ];

  const selectedParent = dbCategories.find(
    (c) => c.slug === form.category || c.name?.toLowerCase() === form.category.toLowerCase()
  );

  const availableSubcategories = 
    selectedParent?.subcategories && selectedParent.subcategories.length > 0
      ? selectedParent.subcategories
      : form.category === "sunglasses" 
        ? sunglassesSubcategories 
        : form.category === "eyeglasses" 
          ? eyeglassesSubcategories 
          : [];

  const addVariant = () =>
    setVariants((prev) => [
      ...prev,
      {
        color: "#000000",
        colorName: "",
        stock: 0,
        lensWidth: form.lensWidth || "62",
        bridgeWidth: form.bridgeWidth || "14",
        templeLength: form.templeLength || "145",
        frameMaterial: form.frameMaterial || "Metal",
        images: [],
        imagePreviews: [],
      },
    ]);

  const updateVariant = (i: number, key: keyof VariantItem, value: any) =>
    setVariants((prev) => prev.map((v, j) => (j === i ? { ...v, [key]: value } : v)));

  const removeVariant = (i: number) => setVariants((prev) => prev.filter((_, j) => j !== i));

  const handleVariantImagesAdd = (variantIndex: number, files: FileList | null) => {
    if (!files) return;
    const allFiles = Array.from(files);
    const oversized = allFiles.filter((file) => file.size > MAX_PHOTO_SIZE);
    if (oversized.length > 0) {
      addToast({ title: "File Too Large", description: `"${oversized[0].name}" exceeds the 10 MB limit and was skipped.`, type: "error" });
    }
    const newFiles = allFiles.filter((file) => file.size <= MAX_PHOTO_SIZE);
    if (newFiles.length === 0) return;
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));

    setVariants((prev) =>
      prev.map((v, i) => {
        if (i !== variantIndex) return v;
        return {
          ...v,
          images: [...(v.images || []), ...newFiles],
          imagePreviews: [...(v.imagePreviews || []), ...newPreviews],
        };
      })
    );
  };

  const removeVariantImage = (variantIndex: number, imgIndex: number) => {
    setVariants((prev) =>
      prev.map((v, i) => {
        if (i !== variantIndex) return v;
        const updatedFiles = (v.images || []).filter((_, idx) => idx !== imgIndex);
        const updatedPreviews = (v.imagePreviews || []).filter((_, idx) => idx !== imgIndex);
        return { ...v, images: updatedFiles, imagePreviews: updatedPreviews };
      })
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const allFiles = Array.from(e.target.files);
      const oversized = allFiles.filter((file) => file.size > MAX_PHOTO_SIZE);
      if (oversized.length > 0) {
        addToast({ title: "File Too Large", description: `"${oversized[0].name}" exceeds the 10 MB limit and was skipped.`, type: "error" });
      }
      const filesArray = allFiles.filter((file) => file.size <= MAX_PHOTO_SIZE);
      if (filesArray.length === 0) return;
      setImages((prev) => [...prev, ...filesArray]);
      const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);

    if (videoPreviews.length + selectedFiles.length > 3) {
      addToast({ title: "Limit Exceeded", description: "You can upload a maximum of 3 product videos.", type: "error" });
      return;
    }

    for (const file of selectedFiles) {
      // 1. Client-Side Size Validation (200MB limit)
      if (file.size > MAX_VIDEO_SIZE) {
        addToast({
          title: "Video Too Large",
          description: `"${file.name}" exceeds the 200 MB maximum size limit (${(file.size / (1024 * 1024)).toFixed(1)} MB).`,
          type: "error",
        });
        continue;
      }

      // 2. Client-Side Duration Validation (60s limit via hidden HTML5 Video element)
      try {
        const duration = await new Promise<number>((resolve, reject) => {
          const tempVid = document.createElement("video");
          tempVid.preload = "metadata";
          tempVid.src = URL.createObjectURL(file);
          tempVid.onloadedmetadata = () => {
            URL.revokeObjectURL(tempVid.src);
            resolve(tempVid.duration);
          };
          tempVid.onerror = () => reject(new Error("Failed to load video metadata"));
        });

        if (duration > MAX_VIDEO_DURATION) {
          addToast({
            title: "Video Too Long",
            description: `"${file.name}" is ${Math.round(duration)} seconds. Maximum allowed duration is 60 seconds.`,
            type: "error",
          });
          continue;
        }

        setVideos((prev) => [...prev, file]);
        setVideoPreviews((prev) => [...prev, URL.createObjectURL(file)]);
      } catch (err) {
        addToast({ title: "Invalid Video", description: `Could not read video metadata for "${file.name}".`, type: "error" });
      }
    }
  };

  const removeVideo = (index: number) => {
    setVideos((prev) => prev.filter((_, i) => i !== index));
    setVideoPreviews((prev) => prev.filter((_, i) => i !== index));
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
      formData.append("isPolarized", String(form.isPolarized));
      formData.append("isPremium", String(form.isPremium));
      formData.append("gender", JSON.stringify(form.gender));
      formData.append("frameShape", form.frameShape);
      formData.append("frameMaterial", form.frameMaterial);
      formData.append("frameColor", form.frameColor);
      formData.append("lensType", form.lensType);
      formData.append("lensColor", form.lensColor);
      formData.append("weight", form.weight);
      formData.append("lensWidth", form.lensWidth);
      formData.append("bridgeWidth", form.bridgeWidth);
      formData.append("templeLength", form.templeLength);
      formData.append("frameWidth", form.frameWidth);
      formData.append("warranty", form.warranty);
      const cleanedVariants = variants.map((v) => ({
        color: v.color,
        colorName: v.colorName,
        stock: v.stock,
        lensWidth: v.lensWidth,
        bridgeWidth: v.bridgeWidth,
        templeLength: v.templeLength,
        frameMaterial: v.frameMaterial,
        images: (v.imagePreviews || []).filter((img) => typeof img === "string" && !img.startsWith("blob:"))
      }));
      formData.append("variants", JSON.stringify(cleanedVariants));

      images.forEach((file) => {
        formData.append("images", file);
      });

      videos.forEach((file) => {
        formData.append("videos", file);
      });

      const cleanedVideos = videoPreviews.filter((v) => typeof v === "string" && !v.startsWith("blob:"));
      if (cleanedVideos.length > 0) {
        formData.append("videos", JSON.stringify(cleanedVideos));
      }

      // Append variant specific new image files and send exact file counts per variant index
      variants.forEach((v, vIdx) => {
        const fileList = v.images || [];
        formData.append(`variant_images_count_${vIdx}`, String(fileList.length));
        if (fileList.length > 0) {
          fileList.forEach((file) => {
            formData.append(`variant_images_${vIdx}`, file);
          });
        }
      });

      if (id) {
        await updateProductApi(id, formData);
      } else {
        await createProductApi(formData);
      }
      addToast({ title: "Success", description: id ? "Glasses updated successfully" : "Glasses added successfully", type: "success" });
      navigate("/admin/products");
    } catch (err) {
      let message = "Failed to save product";
      if (isAxiosError(err)) {
        message = err.response?.data?.message || message;
      }
      console.error(err);
      addToast({ title: "Error", description: message, type: "error" });
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
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[color:var(--color-text-secondary)]">Brand *</label>
                <input type="text" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} required placeholder="e.g. Ray-Ban" className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm text-[color:var(--color-text-primary)]" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[color:var(--color-text-secondary)]">Parent Category *</label>
                <select
                  value={form.category}
                  onChange={(e) => {
                    setForm({ ...form, category: e.target.value, subcategory: "" });
                  }}
                  className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm text-[color:var(--color-text-primary)]"
                >
                  <option value="">Select Category...</option>
                  <option value="sunglasses">Sunglasses</option>
                  <option value="eyeglasses">Eyeglasses</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[color:var(--color-text-secondary)]">Subcategory</label>
                <select
                  value={form.subcategory}
                  onChange={(e) => setForm({ ...form, subcategory: e.target.value })}
                  disabled={!form.category}
                  className={cn(
                    "w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm text-[color:var(--color-text-primary)]",
                    !form.category && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <option value="">
                    {!form.category ? "Select Parent Category First..." : `Select Subcategory (${form.category})`}
                  </option>
                  {availableSubcategories.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
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

          {/* Main Cover & Feature Media (Primary / Required Photos) */}
          <div className="rounded-2xl border-2 border-[color:var(--color-brand-primary)]/30 bg-[color:var(--color-panel)] p-6 space-y-4 shadow-sm">
            <div className="border-b border-[color:var(--color-border)] pb-3 flex items-center justify-between">
              <div>
                <h2 className="font-display text-lg font-bold text-[color:var(--color-text-primary)] flex items-center gap-2">
                  Main Cover & Feature Media <span className="rounded-md bg-amber-500/10 text-amber-700 text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">Primary / Default</span>
                </h2>
                <p className="text-xs text-[color:var(--color-text-secondary)] mt-0.5">
                  These are the primary photos for this product — shown on listing cards, search results, and as the default gallery for any color variant that doesn&apos;t have its own photos.
                </p>
              </div>
            </div>
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
                <span className="text-[10px] font-semibold">Add Main Photo</span>
              </button>
              <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
            </div>
          </div>

          {/* Color Variants (Multiple Colors & Stock) */}
          <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[color:var(--color-border)] pb-3">
              <div>
                <h2 className="font-display text-lg text-[color:var(--color-text-primary)]">Color Variants & Stock</h2>
                <p className="text-xs text-[color:var(--color-text-secondary)]">Add frame color options, hex codes, and individual stock quantities</p>
              </div>
              <Button type="button" variant="outline" onClick={addVariant} className="flex items-center gap-1.5 text-xs">
                <Plus className="h-3.5 w-3.5" /> Add Color Variant
              </Button>
            </div>

            {variants.length === 0 ? (
              <p className="text-xs text-[color:var(--color-text-tertiary)] italic py-2">No color variants added yet. Click &quot;Add Color Variant&quot; above to create multiple options (e.g., Gold 145mm vs Gunmetal 140mm).</p>
            ) : (
              <div className="space-y-4">
                {variants.map((v, i) => (
                  <div key={i} className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[color:var(--color-brand-primary)]">Variant #{i + 1}</span>
                      <button type="button" onClick={() => removeVariant(i)} className="flex items-center gap-1 text-xs text-red-500 hover:underline">
                        <X className="h-3.5 w-3.5" /> Remove Variant
                      </button>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="sm:col-span-1">
                        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-tertiary)]">Color Name / Option Title *</label>
                        <input type="text" value={v.colorName} onChange={(e) => updateVariant(i, "colorName", e.target.value)} placeholder="e.g. 001 Gold Frame / 145mm" className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-3 py-2 text-xs text-[color:var(--color-text-primary)]" />
                      </div>
                      <div>
                        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-tertiary)]">Color Code / Hex</label>
                        <div className="flex items-center gap-1.5">
                          <input type="color" value={v.color?.startsWith('#') ? v.color : '#000000'} onChange={(e) => updateVariant(i, "color", e.target.value)} className="h-8 w-8 rounded cursor-pointer border-0 bg-transparent" />
                          <input type="text" value={v.color} onChange={(e) => updateVariant(i, "color", e.target.value)} placeholder="#D4AF37" className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-2 py-2 text-xs text-[color:var(--color-text-primary)]" />
                        </div>
                      </div>
                      <div>
                        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-tertiary)]">Stock *</label>
                        <input type="number" value={v.stock} onChange={(e) => updateVariant(i, "stock", Number(e.target.value))} className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-3 py-2 text-xs text-[color:var(--color-text-primary)]" />
                      </div>
                    </div>

                    {/* Variant Specific Frame Dimensions & Material */}
                    <div className="pt-2 border-t border-[color:var(--color-border)]/60">
                      <span className="block mb-2 text-[10px] font-bold uppercase tracking-wider text-[color:var(--color-text-secondary)]">Variant Specific Measurements & Material</span>
                      <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
                        <div>
                          <label className="mb-1 block text-[10px] font-semibold text-[color:var(--color-text-tertiary)]">Lens Width (mm)</label>
                          <input type="text" value={v.lensWidth || ""} onChange={(e) => updateVariant(i, "lensWidth", e.target.value)} placeholder="62" className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-2.5 py-1.5 text-xs" />
                        </div>
                        <div>
                          <label className="mb-1 block text-[10px] font-semibold text-[color:var(--color-text-tertiary)]">Bridge Width (mm)</label>
                          <input type="text" value={v.bridgeWidth || ""} onChange={(e) => updateVariant(i, "bridgeWidth", e.target.value)} placeholder="14" className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-2.5 py-1.5 text-xs" />
                        </div>
                        <div>
                          <label className="mb-1 block text-[10px] font-semibold text-[color:var(--color-text-tertiary)]">Temple Length (mm)</label>
                          <input type="text" value={v.templeLength || ""} onChange={(e) => updateVariant(i, "templeLength", e.target.value)} placeholder="140 or 145" className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-2.5 py-1.5 text-xs" />
                        </div>
                        <div>
                          <label className="mb-1 block text-[10px] font-semibold text-[color:var(--color-text-tertiary)]">Frame Material</label>
                          <input type="text" value={v.frameMaterial || ""} onChange={(e) => updateVariant(i, "frameMaterial", e.target.value)} placeholder="Gunmetal / Gold Metal" className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-2.5 py-1.5 text-xs" />
                        </div>
                      </div>
                    </div>

                    {/* Variant Specific Images Upload */}
                    <div className="pt-2 border-t border-[color:var(--color-border)]/60">
                      <label className="block mb-0.5 text-[10px] font-bold uppercase tracking-wider text-[color:var(--color-text-secondary)]">
                        Variant Photos (Optional Override)
                      </label>
                      <p className="text-[11px] text-[color:var(--color-text-tertiary)] mb-2">
                        Optional. Upload photos specific to this color if you have them — otherwise this variant will use the Main Cover photos above.
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
                        {(v.imagePreviews || []).map((src, imgIdx) => (
                          <div key={imgIdx} className="group relative h-14 w-14 overflow-hidden rounded-lg border border-[color:var(--color-border)] bg-black/5">
                            <img src={src} alt="" className="h-full w-full object-cover" />
                            <button type="button" onClick={() => removeVariantImage(i, imgIdx)} className="absolute top-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                              <X className="h-2.5 w-2.5" />
                            </button>
                          </div>
                        ))}
                        <label className="flex h-14 w-14 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-[color:var(--color-border)] text-[color:var(--color-text-tertiary)] hover:border-[color:var(--color-brand-primary)] hover:text-[color:var(--color-brand-primary)] transition-colors">
                          <ImagePlus className="h-4 w-4" />
                          <span className="text-[9px] font-semibold">Upload</span>
                          <input type="file" multiple accept="image/*" onChange={(e) => handleVariantImagesAdd(i, e.target.files)} className="hidden" />
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
                <label className="mb-1.5 block text-xs font-semibold text-[color:var(--color-text-secondary)]">Default Frame Material</label>
                <select value={form.frameMaterial} onChange={(e) => setForm({ ...form, frameMaterial: e.target.value })} className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm text-[color:var(--color-text-primary)]">
                  <option value="Metal">Metal</option>
                  <option value="Acetate">Acetate</option>
                  <option value="Titanium">Titanium</option>
                  <option value="TR90">TR90 Flexible</option>
                  <option value="Stainless Steel">Stainless Steel</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[color:var(--color-text-secondary)]">Lens Type</label>
                <input type="text" value={form.lensType} onChange={(e) => setForm({ ...form, lensType: e.target.value })} placeholder="e.g. Blue Gradient (Category 2N UV400)" className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm text-[color:var(--color-text-primary)]" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[color:var(--color-text-secondary)]">Default Color / Base Color</label>
                <input type="text" value={form.frameColor} onChange={(e) => setForm({ ...form, frameColor: e.target.value })} placeholder="e.g. Gold / Gunmetal" className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm text-[color:var(--color-text-primary)]" />
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

          {/* Product Showcase Videos (Max 3, Max 200MB, Max 60s) */}
          <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 space-y-4">
            <div className="border-b border-[color:var(--color-border)] pb-3">
              <h2 className="font-display text-lg text-[color:var(--color-text-primary)]">Product Showcase Videos</h2>
              <p className="text-xs text-[color:var(--color-text-secondary)]">Upload up to 3 product videos (max 200 MB, max 60s per video)</p>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {videoPreviews.map((src, idx) => (
                <div key={idx} className="group relative aspect-video overflow-hidden rounded-xl border border-[color:var(--color-border)] bg-black">
                  <video src={src} controls className="h-full w-full object-cover" />
                  <button type="button" onClick={() => removeVideo(idx)} className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100 z-10">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {videoPreviews.length < 3 && (
                <button type="button" onClick={() => videoInputRef.current?.click()} className="flex aspect-video flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-[color:var(--color-border)] text-[color:var(--color-text-tertiary)] hover:border-[color:var(--color-brand-primary)] hover:text-[color:var(--color-brand-primary)]">
                  <Video className="h-6 w-6" />
                  <span className="text-[11px] font-semibold">Add Video (Max 60s)</span>
                </button>
              )}
              <input ref={videoInputRef} type="file" multiple accept="video/*" onChange={handleVideoChange} className="hidden" />
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
              <label className="flex items-center gap-2.5 text-xs text-[color:var(--color-text-primary)]">
                <input type="checkbox" checked={form.isPolarized} onChange={(e) => setForm({ ...form, isPolarized: e.target.checked })} className="h-4 w-4 rounded border-[color:var(--color-border)] text-[color:var(--color-brand-primary)]" />
                Polarized Tag
              </label>
              <label className="flex items-center gap-2.5 text-xs text-[color:var(--color-text-primary)]">
                <input type="checkbox" checked={form.isPremium} onChange={(e) => setForm({ ...form, isPremium: e.target.checked })} className="h-4 w-4 rounded border-[color:var(--color-border)] text-[color:var(--color-brand-primary)]" />
                Premium Tag
              </label>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
