import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Eye, Plus, X, ImagePlus, LoaderCircle } from "lucide-react";
import { Button } from "@/components/primitives/Button";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { BrandSelect } from "@/components/admin/BrandSelect";
import { cn } from "@/lib/utils";
import { createProductApi, getCategoriesApi, adminGetProductByIdApi } from "@/lib/api/admin";
import { type ApiCategory } from "@/lib/admin-data";
import { useToastStore } from "@/lib/stores/toast-store";
import { isAxiosError } from "axios";

export function AddEditProductPage() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const addToast = useToastStore((s) => s.addToast);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "", brand: "Louis Vuitton", category: "", subcategory: "", description: "", shortDescription: "",
    price: "", oldPrice: "", cost: "", sku: "", stock: "", status: "draft", featured: false,
    isNewArrival: false, isBestSeller: false, gender: [] as string[],
    weight: "", frameMaterial: "", lensMaterial: "", lensType: "standard", frameShape: "", frameWidth: "",
    lensWidth: "", bridgeWidth: "", templeLength: "",
    metaTitle: "", metaDescription: "", metaKeywords: "",
  });

  const [originalPrice, setOriginalPrice] = useState("");
  const [hasDiscount, setHasDiscount] = useState(false);
  const [discountPercent, setDiscountPercent] = useState("");

  useEffect(() => {
    if (id) {
      adminGetProductByIdApi(id).then((product) => {
        if (product) {
          const baseOrig = product.oldPrice && Number(product.oldPrice) > Number(product.price)
            ? String(product.oldPrice)
            : product.price ? String(product.price) : "";
          const hasDisc = Boolean(product.oldPrice && Number(product.oldPrice) > Number(product.price));
          const discPct = hasDisc
            ? String(product.discount || Math.round(((Number(product.oldPrice) - Number(product.price)) / Number(product.oldPrice)) * 100))
            : "";

          setOriginalPrice(baseOrig);
          setHasDiscount(hasDisc);
          setDiscountPercent(discPct);

          setForm({
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
            frameMaterial: product.frameMaterial || "",
            lensMaterial: product.lensMaterial || "",
            lensType: product.lensType || "standard",
            frameShape: product.frameShape || "",
            frameWidth: product.frameWidth ? String(product.frameWidth) : "",
            lensWidth: product.lensWidth ? String(product.lensWidth) : "",
            bridgeWidth: product.bridgeWidth ? String(product.bridgeWidth) : "",
            templeLength: product.templeLength ? String(product.templeLength) : "",
            metaTitle: product.metaTitle || "",
            metaDescription: product.metaDescription || "",
            metaKeywords: product.metaKeywords || "",
          });
          if (Array.isArray(product.variants)) {
            setVariants(product.variants);
          }
        }
      }).catch((err) => console.error("Failed to fetch product details for edit:", err));
    }
  }, [id]);

  const [dbCategories, setDbCategories] = useState<ApiCategory[]>([]);

  useEffect(() => {
    getCategoriesApi().then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setDbCategories(data);
      }
    }).catch(() => {});
  }, []);

  // Pre-defined exact 4 subcategories per parent
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

  // Dynamically extract from selected parent in DB or use exact 4 fallback
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

  const [variants, setVariants] = useState<{ color: string; colorName: string; stock: number }[]>([]);
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const set = (key: keyof typeof form, value: string | boolean) => setForm((p) => ({ ...p, [key]: value }));

  const toggleGender = (g: string) => {
    setForm(p => ({
      ...p,
      gender: p.gender.includes(g) ? p.gender.filter(x => x !== g) : [...p.gender, g]
    }));
  };

  const addVariant = () => setVariants((prev) => [...prev, { color: "", colorName: "", stock: 0 }]);
  const updateVariant = (i: number, key: keyof { color: string; colorName: string; stock: number }, value: string | number) => setVariants((prev) => prev.map((v, j) => j === i ? { ...v, [key]: value } : v));
  const removeVariant = (i: number) => setVariants((prev) => prev.filter((_, j) => j !== i));

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));
      setImages(prev => [...prev, ...newImages]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => {
      const newArr = [...prev];
      URL.revokeObjectURL(newArr[index].preview);
      newArr.splice(index, 1);
      return newArr;
    });
  };

  const handleSave = async () => {
    const origNum = Number(originalPrice) || 0;
    const discNum = Number(discountPercent) || 0;
    const isDiscApplied = hasDiscount && discNum > 0 && origNum > 0;
    const finalPriceNum = isDiscApplied ? Math.round(origNum * (1 - discNum / 100)) : origNum;

    const missingFields: string[] = [];
    if (!form.name.trim()) missingFields.push("Product Name");
    if (!form.brand.trim()) missingFields.push("Brand");
    if (!form.category.trim()) missingFields.push("Category");
    if (!form.shortDescription.trim()) missingFields.push("Short Description");
    if (!form.description.trim()) missingFields.push("Detailed Description");
    if (!originalPrice.trim() || origNum <= 0) missingFields.push("Original Base Price");

    if (missingFields.length > 0) {
      const msg = `Please fill required fields: ${missingFields.join(", ")}`;
      addToast({
        title: "Missing Required Fields",
        description: msg,
        type: "error",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => {
        if (key === "price" || key === "oldPrice" || key === "discount") return;
        if (key === "gender") {
          if ((val as string[]).length > 0) formData.append(key, JSON.stringify(val));
        } else if (val !== "") {
          formData.append(key, String(val));
        }
      });
      formData.append("price", String(finalPriceNum));
      if (isDiscApplied) {
        formData.append("oldPrice", String(origNum));
        formData.append("discount", String(discNum));
      } else {
        formData.append("oldPrice", "");
        formData.append("discount", "0");
      }
      formData.append("variants", JSON.stringify(variants));
      
      images.forEach(img => formData.append("images", img.file));

      await createProductApi(formData);
      addToast({ title: "Product created", description: "Product has been successfully saved.", type: "success" });
      navigate("/admin/products");
    } catch (error) {
      let message = "Failed to create product";
      if (isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }
      addToast({ title: "Error", description: message, type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <h1 className="mt-2 font-display text-2xl text-[color:var(--color-text-primary)] md:text-3xl">{id ? "Edit Product" : "Add New Product"}</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" iconLeft={<Eye className="h-4 w-4" />} className="text-xs">Preview</Button>
          <Button variant="primary" onClick={handleSave} disabled={isSubmitting} className="text-xs">
            {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {isSubmitting ? "Saving..." : "Save Product"}
          </Button>
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
                  <BrandSelect value={form.brand} onChange={(brand) => set("brand", brand)} />
                </div>
                <div>
                  <label className={labelClass}>Parent Category</label>
                  <select 
                    value={form.category} 
                    onChange={(e) => {
                      set("category", e.target.value);
                      set("subcategory", ""); // reset subcategory on parent change
                    }} 
                    className={inputClass}
                  >
                    <option value="">Select Parent Category...</option>
                    <option value="sunglasses">Sunglasses</option>
                    <option value="eyeglasses">Eyeglasses</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Subcategory</label>
                  <select 
                    value={form.subcategory} 
                    onChange={(e) => set("subcategory", e.target.value)} 
                    disabled={!form.category}
                    className={cn(inputClass, !form.category && "opacity-50 cursor-not-allowed bg-[color:var(--color-surface-muted)]")}
                  >
                    <option value="">
                      {!form.category ? "Select Parent Category First..." : `Select Subcategory (${form.category === 'sunglasses' ? 'Sunglasses' : 'Eyeglasses'})`}
                    </option>
                    {availableSubcategories.map((c) => (
                      <option key={c.slug} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Gender</label>
                  <div className="flex flex-wrap gap-3 pt-2">
                    {["men", "women", "kids", "unisex"].map((g) => (
                      <label key={g} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={form.gender.includes(g)} onChange={() => toggleGender(g)} className="h-4 w-4 rounded border-[color:var(--color-border)] text-[color:var(--color-accent-teal)]" />
                        <span className="text-sm capitalize text-[color:var(--color-text-secondary)]">{g}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>Short Description</label>
                  <input type="text" value={form.shortDescription} onChange={(e) => set("shortDescription", e.target.value)} placeholder="Brief product description" className={inputClass} />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>Full Description</label>
                  <textarea rows={4} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Detailed product description..." className={inputClass} />
                </div>
                <div className="flex flex-wrap items-center gap-6">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} className="h-4 w-4 rounded border-[color:var(--color-border)] text-[color:var(--color-accent-teal)]" />
                    <span className="text-sm text-[color:var(--color-text-secondary)]">Featured product</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input type="checkbox" checked={form.isNewArrival} onChange={(e) => set("isNewArrival", e.target.checked)} className="h-4 w-4 rounded border-[color:var(--color-border)] text-[color:var(--color-accent-teal)]" />
                    <span className="text-sm text-[color:var(--color-text-secondary)]">New Arrival</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input type="checkbox" checked={form.isBestSeller} onChange={(e) => set("isBestSeller", e.target.checked)} className="h-4 w-4 rounded border-[color:var(--color-border)] text-[color:var(--color-accent-teal)]" />
                    <span className="text-sm text-[color:var(--color-text-secondary)]">Best Seller</span>
                  </label>
                  <StatusBadge status={form.status} />
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === "images" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <input type="file" multiple accept="image/*" ref={fileInputRef} onChange={handleImageSelect} className="hidden" />
              <div className="grid grid-cols-4 gap-4">
                {images.map((img, i) => (
                  <div key={i} className="relative aspect-square rounded-xl bg-[color:var(--color-surface-muted)]">
                    <img src={img.preview} alt="" className="h-full w-full rounded-xl object-cover" />
                    <button type="button" onClick={() => handleRemoveImage(i)} className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[color:var(--color-danger)] text-white shadow-[var(--shadow-soft)]">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => fileInputRef.current?.click()} className="flex aspect-square items-center justify-center rounded-xl border-2 border-dashed border-[color:var(--color-border)] transition-colors hover:border-[color:var(--color-accent-teal)]">
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
              <div><label className={labelClass}>Frame Shape</label>
                <select value={form.frameShape} onChange={(e) => set("frameShape", e.target.value)} className={inputClass}>
                  <option value="">Select Shape</option>
                  <option value="aviator">Aviator</option>
                  <option value="round">Round</option>
                  <option value="square">Square</option>
                  <option value="rectangle">Rectangle</option>
                  <option value="cat-eye">Cat Eye</option>
                  <option value="geometric">Geometric</option>
                  <option value="wayfarer">Wayfarer</option>
                  <option value="oval">Oval</option>
                  <option value="butterfly">Butterfly</option>
                  <option value="shield">Shield</option>
                  <option value="rimless">Rimless</option>
                  <option value="half-rim">Half Rim</option>
                  <option value="sports">Sports</option>
                </select>
              </div>
              <div><label className={labelClass}>Frame Material</label><input type="text" value={form.frameMaterial} onChange={(e) => set("frameMaterial", e.target.value)} placeholder="e.g. Japanese Titanium, Acetate" className={inputClass} /></div>
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Original Base Price (Rs.) *</label>
                  <input type="text" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} placeholder="e.g. 28500" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Cost (Rs.)</label>
                  <input type="text" value={form.cost} onChange={(e) => set("cost", e.target.value)} placeholder="e.g. 12000" className={inputClass} />
                </div>
              </div>

              {/* Discount Percentage Checkbox */}
              <div className="pt-2 border-t border-[color:var(--color-border)]">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={hasDiscount}
                    onChange={(e) => {
                      setHasDiscount(e.target.checked);
                      if (!e.target.checked) setDiscountPercent("");
                    }}
                    className="h-4 w-4 rounded border-[color:var(--color-border)] text-[color:var(--color-brand-primary)]"
                  />
                  <span className="text-sm font-semibold text-[color:var(--color-text-primary)]">Apply Discount Percentage (% OFF)</span>
                </label>
              </div>

              {hasDiscount && (
                <div className="space-y-2 rounded-xl bg-amber-500/10 p-4 border border-amber-500/30">
                  <label className={labelClass}>Discount Percentage (%) *</label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="99"
                      value={discountPercent}
                      onChange={(e) => setDiscountPercent(e.target.value)}
                      placeholder="e.g. 5 or 10"
                      className={inputClass}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[color:var(--color-brand-primary)]">%</span>
                  </div>

                  {Number(originalPrice) > 0 && Number(discountPercent) > 0 && (
                    <div className="mt-2 text-xs space-y-1 pt-2 border-t border-amber-500/20">
                      <div className="flex justify-between text-[color:var(--color-text-secondary)]">
                        <span>Original Price:</span>
                        <span className="line-through">Rs. {Number(originalPrice).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-amber-700 dark:text-amber-300 font-semibold">
                        <span>Discount ({discountPercent}% OFF):</span>
                        <span>-Rs. {Math.round((Number(originalPrice) * Number(discountPercent)) / 100).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-emerald-700 dark:text-emerald-400 font-bold text-sm pt-1 border-t border-amber-500/20">
                        <span>Final Selling Price:</span>
                        <span>Rs. {Math.round(Number(originalPrice) * (1 - Number(discountPercent) / 100)).toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="grid gap-5 sm:grid-cols-3 pt-2 border-t border-[color:var(--color-border)]">
                <div><label className={labelClass}>SKU</label><input type="text" value={form.sku} onChange={(e) => set("sku", e.target.value)} placeholder="e.g. KT-AT-001" className={inputClass} /></div>
                <div><label className={labelClass}>Stock</label><input type="number" value={form.stock} onChange={(e) => set("stock", e.target.value)} placeholder="e.g. 15" className={inputClass} /></div>
                <div><label className={labelClass}>Status</label><select value={form.status} onChange={(e) => set("status", e.target.value)} className={inputClass}>
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="archived">Archived</option>
                </select></div>
              </div>
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
