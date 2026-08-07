import { useEffect, useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCartStore, prescriptionFilesCache } from "@/lib/stores/cart-store";
import { useUiStore } from "@/lib/stores/ui-store";
import { getProductBySlug } from "@/lib/api/products";
import { getLensOptionsApi } from "@/lib/api/lens-options";
import { type Product } from "@/lib/shop-data";
import { AudioInstructionPlayer } from "@/components/product/configurator/AudioInstructionPlayer";
import { PrescriptionFormStep } from "@/components/product/configurator/PrescriptionFormStep";
import { LensTypeStep, type LensTypeOption } from "@/components/product/configurator/LensTypeStep";
import { ConfiguratorReviewStep } from "@/components/product/configurator/ConfiguratorReviewStep";
import { SelectableOptionCard } from "@/components/product/configurator/SelectableOptionCard";
import { type PrescriptionData } from "@/components/product/configurator/PrescriptionSummaryTable";

// Usage types for eyeglasses (category "eyeglasses") — ERP.md §6 enum values
const USAGE_OPTIONS: { id: "distance" | "multifocal" | "reading" | "non-prescription"; name: string; description: string }[] = [
  {
    id: "distance",
    name: "Distance",
    description: "For driving, TV, and everyday long-distance vision."
  },
  {
    id: "multifocal",
    name: "Multifocal",
    description: "Multiple focal zones combined into a single lens."
  },
  {
    id: "reading",
    name: "Reading",
    description: "Optimized for close-up work and reading comfort."
  },
  {
    id: "non-prescription",
    name: "Non Prescription / No Eyesight",
    description: "No prescription needed — standard lenses without power."
  }
];

// Revealed inline only when "Multifocal" is selected — ERP.md §6 multifocalSubtype enum
const MULTIFOCAL_SUBTYPES: { id: "progressive" | "bifocal"; name: string; description: string }[] = [
  {
    id: "progressive",
    name: "Progressive (Varifocal)",
    description: "Seamless far, intermediate, and near vision in one lens."
  },
  {
    id: "bifocal",
    name: "Bifocal",
    description: "Two zones — distance and near reading segment below."
  }
];

// Offline fallback only — the API is the source of truth (GET /api/lens-options)
const FALLBACK_LENS_OPTIONS: LensTypeOption[] = [
  {
    id: "basic-tint",
    name: "Basic Tint",
    price: 1000,
    description: "Standard UV protection with classic solid tinting.",
    info: "Best for casual daily wear. Provides 100% UV protection with clear view contrast.",
    strengths: ["Light (35%)", "Medium (50%)", "Dark (85%)"],
    colors: [
      { name: "Solid Black", hex: "#1f2937" },
      { name: "Solid Brown", hex: "#78350f" },
      { name: "Solid Green", hex: "#064e3b" }
    ]
  },
  {
    id: "medium-premium-tint",
    name: "Medium Premium Tint",
    price: 1800,
    description: "Extra optical contrast and anti-glare back coating.",
    info: "Reduces eye strain under bright conditions. Anti-reflective back coatings prevent reflection shadows.",
    strengths: ["Medium (50%)", "Dark (85%)"],
    colors: [
      { name: "Solid Black", hex: "#1f2937" },
      { name: "Solid Brown", hex: "#78350f" },
      { name: "Solid Green", hex: "#064e3b" }
    ]
  },
  {
    id: "gradient-fashion-tint",
    name: "Gradient Fashion Tint",
    price: 2500,
    description: "Dark top fading to clear bottom. Preferred by drivers.",
    info: "Fades down elegantly. The darker top blocks overhead sun rays, while the lighter bottom helps you view dashboards clearly.",
    strengths: ["Standard Gradient"],
    colors: [
      { name: "Smoke Gradient", hex: "linear-gradient(180deg, #1f2937 0%, rgba(31,41,55,0.1) 100%)" },
      { name: "Amber Gradient", hex: "linear-gradient(180deg, #78350f 0%, rgba(120,53,15,0.1) 100%)" },
      { name: "Forest Gradient", hex: "linear-gradient(180deg, #064e3b 0%, rgba(6,78,59,0.1) 100%)" }
    ]
  },
  {
    id: "polarized-hd",
    name: "Polarized HD Anti-Glare",
    price: 3500,
    description: "Ultimate glare reduction. Blocks reflections from water/road.",
    info: "Contains vertical polarization filters. Ideal for driving, sports, marine outings. Eliminates blinding reflections.",
    strengths: ["Dark Polarized (85%)"],
    colors: [
      { name: "HD Polarized Grey", hex: "#0f172a" },
      { name: "HD Polarized Brown", hex: "#451a03" }
    ]
  }
];

// Eyeglasses coating fallback — mirrors the §8b/§14 seed (placeholder prices)
const FALLBACK_EYEGLASSES_OPTIONS: LensTypeOption[] = [
  {
    id: "clear-antiglare",
    name: "Clear & Antiglare",
    price: 0,
    description: "Essential clear lenses with antiglare coating.",
    info: "Reduces reflections from screens and headlights for clearer vision."
  },
  {
    id: "blue-light-filtering",
    name: "Blue Light Filtering",
    price: 1200,
    description: "Filters harmful blue light from digital screens.",
    info: "Reduces eye strain, headaches, and sleep disruption during long screen hours."
  },
  {
    id: "transitions-photochromic",
    name: "Transitions® & Photochromic",
    price: 2500,
    description: "Clear indoors, automatically darkens in sunlight.",
    info: "One pair of glasses for both indoor and outdoor use."
  },
  {
    id: "blue-light-transition",
    name: "Blue Light + Transition",
    price: 3000,
    description: "Blue light filtering combined with light-adaptive lenses.",
    info: "Day-to-night protection with automatic darkening and screen glare reduction."
  },
  {
    id: "sun",
    name: "Sun",
    price: 2000,
    description: "Darkened tint lenses for bright outdoor conditions.",
    info: "Full UV protection with a comfortable dark tint for outdoor wear."
  }
];

// Map lens color names → hex for the image tint overlay
const LENS_COLOR_HEX: Record<string, string> = {
  "Solid Black":        "#1f2937",
  "Solid Brown":        "#78350f",
  "Solid Green":        "#064e3b",
  "Smoke Gradient":     "#1f2937",
  "Amber Gradient":     "#78350f",
  "Forest Gradient":    "#064e3b",
  "HD Polarized Grey":  "#0f172a",
  "HD Polarized Brown": "#451a03",
};

function getLensOverlayStyle(colorName: string, isGradient: boolean): string | undefined {
  const hex = LENS_COLOR_HEX[colorName];
  if (!hex) return undefined;
  if (isGradient) return `linear-gradient(180deg, ${hex}cc 0%, ${hex}22 100%)`;
  return hex;
}


export function SelectLensesPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const locationState = useLocation().state as { selectedVariant?: number } | null;
  const selectedVariantIndex = locationState?.selectedVariant ?? 0;

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);

  const addItem = useCartStore((s) => s.addItem);
  const setCartOpen = useUiStore((s) => s.setCartOpen);

  // Form State
  const [prescriptionType, setPrescriptionType] = useState<"none" | "manual" | "file" | "written">("none");
  const [prescriptionData, setPrescriptionData] = useState<PrescriptionData>({
    od: { sph: "0.00", cyl: "0.00", axis: "", add: "" },
    os: { sph: "0.00", cyl: "0.00", axis: "", add: "" },
    pd: "63"
  });
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null);
  const [prescriptionText, setPrescriptionText] = useState("");

  // Usage state (eyeglasses only) — ERP.md §6 enum values
  const [usageType, setUsageType] = useState<"distance" | "multifocal" | "reading" | "non-prescription">("distance");
  const [multifocalSubtype, setMultifocalSubtype] = useState<"progressive" | "bifocal">("progressive");

  // Lens State — fallback chosen by category once the product loads; the API is the source of truth
  const [lensOptions, setLensOptions] = useState<LensTypeOption[]>(FALLBACK_LENS_OPTIONS);
  const [selectedLensId, setSelectedLensId] = useState(FALLBACK_LENS_OPTIONS[0].id);
  const [selectedLensPrice, setSelectedLensPrice] = useState(FALLBACK_LENS_OPTIONS[0].price);
  const [selectedStrength, setSelectedStrength] = useState(FALLBACK_LENS_OPTIONS[0].strengths?.[0] ?? "");
  const [selectedColorNameOpt, setSelectedColorNameOpt] = useState(FALLBACK_LENS_OPTIONS[0].colors?.[0]?.name ?? "");

  useEffect(() => {
    async function fetchProduct() {
      if (!slug) return;
      try {
        const data = await getProductBySlug(slug);
        setProduct(data);
        // §8b item 2: eyeglasses always start the prescription step at "manual"
        if (data.category === "eyeglasses") {
          setPrescriptionType("manual");
        }
      } catch (err) {
        console.error("Failed to fetch product details:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [slug]);

  useEffect(() => {
    async function fetchLensOptions() {
      if (!product) return;
      const appliesTo = product.category === "eyeglasses" ? "eyeglasses" : "sunglasses";
      const fallback = appliesTo === "eyeglasses" ? FALLBACK_EYEGLASSES_OPTIONS : FALLBACK_LENS_OPTIONS;
      try {
        const options = await getLensOptionsApi(appliesTo);
        if (options.length > 0) {
          setLensOptions(options);
          setSelectedLensId(options[0].id);
          setSelectedLensPrice(options[0].price);
          setSelectedStrength(options[0].strengths?.[0] ?? "");
          setSelectedColorNameOpt(options[0].colors?.[0]?.name ?? "");
        } else {
          setLensOptions(fallback);
          setSelectedLensId(fallback[0].id);
          setSelectedLensPrice(fallback[0].price);
          setSelectedStrength(fallback[0].strengths?.[0] ?? "");
          setSelectedColorNameOpt(fallback[0].colors?.[0]?.name ?? "");
        }
      } catch (err) {
        console.error("Failed to fetch lens options, using fallback:", err);
        setLensOptions(fallback);
        setSelectedLensId(fallback[0].id);
        setSelectedLensPrice(fallback[0].price);
        setSelectedStrength(fallback[0].strengths?.[0] ?? "");
        setSelectedColorNameOpt(fallback[0].colors?.[0]?.name ?? "");
      }
    }
    fetchLensOptions();
  }, [product?.category]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[color:var(--color-brand-primary)] border-t-transparent" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <h2 className="text-xl font-bold text-[color:var(--color-text-primary)]">Product Not Found</h2>
        <Link to="/shop" className="mt-4 text-xs font-bold text-[color:var(--color-brand-primary)] hover:underline">
          Return to Shop
        </Link>
      </div>
    );
  }

  const isEyeglasses = product.category === "eyeglasses";
  // §8b item 2: when usage = "non-prescription" the prescription step is not rendered at all
  const prescriptionSkipped = isEyeglasses && usageType === "non-prescription";
  const totalSteps = isEyeglasses ? (prescriptionSkipped ? 3 : 4) : 3;
  const runningSubtotal = product.price + selectedLensPrice;
  const currentLensOption = lensOptions.find((l) => l.id === selectedLensId) || lensOptions[0];
  const isGradientLens = /gradient/i.test(currentLensOption.name);

  // Prescription lives on step 1 for sunglasses, step 2 for eyeglasses (after Usage).
  // Skipped (never rendered, never used as a step) when usage = "non-prescription".
  const prescriptionStep = isEyeglasses ? (prescriptionSkipped ? -1 : 2) : 1;
  const lensTypeStep = isEyeglasses ? (prescriptionSkipped ? 2 : 3) : 2;
  const stepLabels = isEyeglasses
    ? prescriptionSkipped
      ? ["Usage", "Coating", "Review"]
      : ["Usage", "Prescription", "Coating", "Review"]
    : ["Prescription", "Lens Type", "Review"];

  const handleNext = () => {
    if (step === prescriptionStep) {
      if (prescriptionType === "file" && !prescriptionFile) {
        alert("Please upload a prescription image file to proceed.");
        return;
      }
      if (prescriptionType === "written" && !prescriptionText.trim()) {
        alert("Please enter your eyesight details to proceed.");
        return;
      }
    }
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleAddToCart = () => {
    let fileKey: string | undefined;
    if (prescriptionType === "file" && prescriptionFile) {
      fileKey = `file_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      prescriptionFilesCache.set(fileKey, prescriptionFile);
    }

    const customization = {
      prescriptionType,
      prescriptionData: prescriptionType === "manual" ? prescriptionData : undefined,
      prescriptionFileCacheKey: fileKey,
      prescriptionText: prescriptionType === "written" ? prescriptionText : undefined,
      // §6: lensOptionSlug is sunglasses-only; eyeglasses reference the coating via lensCoating (slug)
      lensOptionSlug: isEyeglasses ? undefined : currentLensOption.id,
      lensType: currentLensOption.name,
      usageType: isEyeglasses ? usageType : undefined,
      multifocalSubtype: isEyeglasses && usageType === "multifocal" ? multifocalSubtype : undefined,
      lensCoating: isEyeglasses ? currentLensOption.id : undefined,
      tintColor: isEyeglasses ? undefined : selectedColorNameOpt,
      tintStrength: isEyeglasses ? undefined : selectedStrength,
      priceAdded: selectedLensPrice
    };

    const variant = product.variants?.[selectedVariantIndex];

    addItem({
      productId: product.id || product._id || "",
      name: product.name,
      brand: product.brand,
      image: variant?.image || product.images?.[0] || "",
      price: runningSubtotal,
      quantity: 1,
      color: variant?.hexCode || "#000",
      colorName: variant?.colorName || "Standard",
      size: "Medium",
      lensType: isEyeglasses
        ? `${currentLensOption.name} • ${usageType === "multifocal"
            ? `${USAGE_OPTIONS.find((u) => u.id === "multifocal")?.name} (${MULTIFOCAL_SUBTYPES.find((s) => s.id === multifocalSubtype)?.name})`
            : USAGE_OPTIONS.find((u) => u.id === usageType)?.name}`
        : `${currentLensOption.name} (${selectedColorNameOpt})`,
      sku: product.sku,
      stock: product.stock,
      customization
    });

    setCartOpen(true);
    navigate("/cart");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Back Link */}
      <div className="mb-6">
        <Link to={`/product/${product.slug}`} className="inline-flex items-center gap-1.5 text-xs font-bold text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-brand-primary)]">
          <ArrowLeft className="h-4 w-4" />
          Back to Product Page
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Left Column: Sticky Product Summary */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
          <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] overflow-hidden shadow-sm">
            {/* Product image with live lens tint overlay */}
            <div className="aspect-square w-full overflow-hidden bg-[color:var(--color-surface-muted)] flex items-center justify-center p-4 relative">
              <img
                src={product.variants?.[selectedVariantIndex]?.image || product.images?.[0] || ""}
                alt={product.name}
                className="h-full w-full object-contain hover:scale-105 transition-transform duration-500"
              />
              {/* Lens color tint overlay — visible on the Lens Type step when a color is selected */}
              {!isEyeglasses && step === lensTypeStep && selectedColorNameOpt && LENS_COLOR_HEX[selectedColorNameOpt] && (
                <motion.div
                  key={selectedColorNameOpt}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.32 }}
                  transition={{ duration: 0.4 }}
                  className="pointer-events-none absolute inset-0 rounded-lg"
                  style={{
                    background: getLensOverlayStyle(selectedColorNameOpt, isGradientLens),
                    mixBlendMode: "multiply",
                  }}
                />
              )}
              {/* Color pill badge */}
              {!isEyeglasses && step === lensTypeStep && selectedColorNameOpt && LENS_COLOR_HEX[selectedColorNameOpt] && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-3 left-0 right-0 flex justify-center"
                >
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-black/65 px-3 py-1 text-[10px] font-bold text-white backdrop-blur-sm">
                    <span
                      className="h-2.5 w-2.5 rounded-full border border-white/30 flex-shrink-0"
                      style={{ background: LENS_COLOR_HEX[selectedColorNameOpt] }}
                    />
                    {selectedColorNameOpt}
                  </span>
                </motion.div>
              )}
            </div>
            <div className="p-6 space-y-1">
              <p className="text-[10px] text-[color:var(--color-text-tertiary)] uppercase font-semibold tracking-wider">{product.brand}</p>
              <h2 className="text-lg font-bold text-[color:var(--color-text-primary)]">{product.name}</h2>
              <div className="pt-3 flex justify-between items-baseline border-t border-[color:var(--color-border)] mt-3">
                <span className="text-xs text-[color:var(--color-text-secondary)] font-medium">Frame Price</span>
                <span className="text-base font-bold text-[color:var(--color-text-primary)]">Rs. {product.price.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Steps Machine */}
        <div className="lg:col-span-7 space-y-5">
          {/* Stepper indicators */}
          <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-6 py-4 flex justify-between items-center text-[10px] font-bold text-[color:var(--color-text-tertiary)] uppercase tracking-wider shadow-sm">
            {stepLabels.map((label, idx) => {
              const stepNumber = idx + 1;
              return (
                <div key={label} className="flex items-center gap-1.5">
                  {idx > 0 && <div className="h-px w-12 bg-[color:var(--color-border)]" />}
                  <span className={cn("flex h-5 w-5 items-center justify-center rounded-full border text-[9px]", step >= stepNumber ? "border-[color:var(--color-brand-primary)] bg-[color:var(--color-brand-primary)] text-white" : "border-[color:var(--color-border)]")}>
                    {step > stepNumber ? <Check className="h-3 w-3" /> : stepNumber}
                  </span>
                  <span className={cn(step === stepNumber && "text-[color:var(--color-text-primary)]")}>{label}</span>
                </div>
              );
            })}
          </div>

          {/* Active Step Panel */}
          <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 shadow-sm min-h-[400px] flex flex-col">
            <div className="flex-1">
              {isEyeglasses && step === 1 && (
                <div className="space-y-6">
                  <AudioInstructionPlayer src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" />
                  <div>
                    <h3 className="text-sm font-bold text-[color:var(--color-text-primary)]">What will you use these glasses for?</h3>
                    <p className="text-[11px] text-[color:var(--color-text-secondary)] mt-0.5 mb-4">Choose the usage that matches your daily needs.</p>
                    <div className="flex flex-col gap-3">
                      {USAGE_OPTIONS.map((usage) => (
                        <div key={usage.id} className="flex flex-col gap-3">
                          <SelectableOptionCard
                            title={usage.name}
                            description={usage.description}
                            selected={usageType === usage.id}
                            onClick={() => setUsageType(usage.id)}
                          />
                          {/* Multifocal sub-choice — reveals inline like the sunglasses tint options */}
                          {usage.id === "multifocal" && usageType === "multifocal" && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              className="overflow-hidden"
                            >
                              <div className="ml-4 border-l-2 border-[color:var(--color-brand-primary)]/30 pl-4 space-y-2">
                                <p className="text-[10px] font-bold text-[color:var(--color-text-tertiary)] uppercase tracking-wider">
                                  Choose your multifocal type
                                </p>
                                {MULTIFOCAL_SUBTYPES.map((sub) => (
                                  <button
                                    key={sub.id}
                                    type="button"
                                    onClick={() => setMultifocalSubtype(sub.id)}
                                    className={cn(
                                      "w-full rounded-xl border p-3.5 transition-all text-left",
                                      multifocalSubtype === sub.id
                                        ? "border-[color:var(--color-brand-primary)] bg-[color:var(--color-brand-primary)]/5"
                                        : "border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] hover:border-[color:var(--color-text-secondary)]"
                                    )}
                                  >
                                    <span className="flex items-center justify-between">
                                      <span className="text-sm font-bold text-[color:var(--color-text-primary)]">{sub.name}</span>
                                      <span
                                        className={cn(
                                          "h-4 w-4 rounded-full border flex items-center justify-center shrink-0 ml-3",
                                          multifocalSubtype === sub.id
                                            ? "border-[color:var(--color-brand-primary)] bg-[color:var(--color-brand-primary)]"
                                            : "border-[color:var(--color-border)]"
                                        )}
                                      >
                                        {multifocalSubtype === sub.id && <Check className="h-2.5 w-2.5 text-white" />}
                                      </span>
                                    </span>
                                    <span className="mt-0.5 block text-[11px] text-[color:var(--color-text-secondary)]">{sub.description}</span>
                                  </button>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === prescriptionStep && (
                <div className="space-y-6">
                  <AudioInstructionPlayer src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" />

                  {isEyeglasses ? (
                    // §8b item 2: eyeglasses have no in-step skip toggle — straight to the entry modes
                    <div>
                      <h3 className="text-sm font-bold text-[color:var(--color-text-primary)]">Enter your prescription</h3>
                      <p className="text-[11px] text-[color:var(--color-text-secondary)] mt-0.5 mb-4">Choose an entry mode for your eyeglass prescription.</p>
                      <p className="text-xs font-bold text-[color:var(--color-text-tertiary)] uppercase tracking-wider">Choose a prescription entry mode:</p>
                      <div className="border-t border-[color:var(--color-border)] pt-4 mt-2 space-y-4">
                        <PrescriptionFormStep
                          data={prescriptionData}
                          selectedType={prescriptionType}
                          prescriptionFile={prescriptionFile}
                          prescriptionText={prescriptionText}
                          onTypeChange={setPrescriptionType}
                          onDataChange={setPrescriptionData}
                          onFileChange={setPrescriptionFile}
                          onTextChange={setPrescriptionText}
                        />
                      </div>
                    </div>
                  ) : (
                    // Option selector to indicate prescription choice (sunglasses)
                    <div className="flex flex-col gap-3">
                      {/* Option A: Skip */}
                      <div
                        onClick={() => setPrescriptionType("none")}
                        className={cn(
                          "rounded-2xl border p-5 transition-all cursor-pointer flex items-center justify-between",
                          prescriptionType === "none"
                            ? "border-[color:var(--color-brand-primary)] bg-[color:var(--color-brand-primary)]/5"
                            : "border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] hover:border-[color:var(--color-text-secondary)]"
                        )}
                      >
                        <div>
                          <p className="text-sm font-bold text-[color:var(--color-text-primary)]">No Prescription (Skip)</p>
                          <p className="text-[11px] text-[color:var(--color-text-secondary)] mt-0.5">I want standard fashion lenses without power details</p>
                        </div>
                        <div className={cn("h-4 w-4 rounded-full border flex items-center justify-center", prescriptionType === "none" ? "border-[color:var(--color-brand-primary)] bg-[color:var(--color-brand-primary)]" : "border-[color:var(--color-border)]")}>
                          {prescriptionType === "none" && <Check className="h-2.5 w-2.5 text-white" />}
                        </div>
                      </div>

                      {/* Option B: Provide Prescription */}
                      <div
                        onClick={() => {
                          if (prescriptionType === "none") {
                            setPrescriptionType("manual");
                          }
                        }}
                        className={cn(
                          "rounded-2xl border p-5 transition-all cursor-pointer flex items-center justify-between",
                          prescriptionType !== "none"
                            ? "border-[color:var(--color-brand-primary)] bg-[color:var(--color-brand-primary)]/5"
                            : "border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] hover:border-[color:var(--color-text-secondary)]"
                        )}
                      >
                        <div>
                          <p className="text-sm font-bold text-[color:var(--color-text-primary)]">Add Eyeglass Prescription</p>
                          <p className="text-[11px] text-[color:var(--color-text-secondary)] mt-0.5">Configure SPH/CYL numbers, upload photo, or write details</p>
                        </div>
                        <div className={cn("h-4 w-4 rounded-full border flex items-center justify-center", prescriptionType !== "none" ? "border-[color:var(--color-brand-primary)] bg-[color:var(--color-brand-primary)]" : "border-[color:var(--color-border)]")}>
                          {prescriptionType !== "none" && <Check className="h-2.5 w-2.5 text-white" />}
                        </div>
                      </div>

                      {/* Accordions: Only shown if Option B is active! */}
                      {prescriptionType !== "none" && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="border-t border-[color:var(--color-border)] pt-4 mt-2 space-y-4"
                        >
                          <p className="text-xs font-bold text-[color:var(--color-text-tertiary)] uppercase tracking-wider">Choose a prescription entry mode:</p>
                          <PrescriptionFormStep
                            data={prescriptionData}
                            selectedType={prescriptionType}
                            prescriptionFile={prescriptionFile}
                            prescriptionText={prescriptionText}
                            onTypeChange={setPrescriptionType}
                            onDataChange={setPrescriptionData}
                            onFileChange={setPrescriptionFile}
                            onTextChange={setPrescriptionText}
                          />
                        </motion.div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {step === lensTypeStep && (
                <LensTypeStep
                  options={lensOptions}
                  selectedLensId={selectedLensId}
                  selectedStrength={selectedStrength}
                  selectedColorName={selectedColorNameOpt}
                  onSelectLens={(id, pr) => {
                    setSelectedLensId(id);
                    setSelectedLensPrice(pr);
                  }}
                  onSelectStrength={setSelectedStrength}
                  onSelectColor={setSelectedColorNameOpt}
                />
              )}

              {step === totalSteps && (
                <ConfiguratorReviewStep
                  product={{
                    name: product.name,
                    brand: product.brand,
                    image: product.variants?.[selectedVariantIndex]?.image || product.images?.[0] || "",
                    price: product.price
                  }}
                  prescriptionType={prescriptionType}
                  prescriptionData={prescriptionData}
                  prescriptionFile={prescriptionFile}
                  prescriptionText={prescriptionText}
                  lensOption={currentLensOption}
                  selectedColorName={selectedColorNameOpt}
                  selectedStrength={selectedStrength}
                  usageType={isEyeglasses ? (usageType === "multifocal"
                    ? `${USAGE_OPTIONS.find((u) => u.id === "multifocal")?.name} (${MULTIFOCAL_SUBTYPES.find((s) => s.id === multifocalSubtype)?.name})`
                    : USAGE_OPTIONS.find((u) => u.id === usageType)?.name) : undefined}
                  lensCoating={isEyeglasses ? currentLensOption.name : undefined}
                />
              )}
            </div>

            {/* Bottom Actions Row inside the main card */}
            <div className="border-t border-[color:var(--color-border)] pt-5 mt-6 flex justify-between items-center gap-4">
              <div className="min-w-0">
                <p className="text-[10px] text-[color:var(--color-text-tertiary)] uppercase font-bold tracking-wider">Subtotal</p>
                <p className="text-base font-bold text-[color:var(--color-text-primary)]">Rs. {runningSubtotal.toLocaleString()}</p>
                <p className="text-[10px] text-[color:var(--color-text-secondary)] font-medium mt-0.5 truncate max-w-[200px] sm:max-w-none">
                  (Rs. {product.price.toLocaleString()} Frame + Rs. {selectedLensPrice.toLocaleString()} {currentLensOption.name})
                </p>
              </div>

              <div className="flex gap-2">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="rounded-xl border border-[color:var(--color-border)] px-5 py-3 text-xs font-bold text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-muted)] transition-colors"
                  >
                    Back
                  </button>
                )}
                {step < totalSteps ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center gap-1.5 rounded-xl bg-[color:var(--color-brand-primary)] px-6 py-3 text-xs font-bold text-white shadow hover:bg-black transition-colors"
                  >
                    Continue
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="flex items-center gap-1.5 rounded-xl bg-[color:var(--color-brand-primary)] px-6 py-3 text-xs font-bold text-white shadow hover:bg-black transition-colors"
                  >
                    Add to Cart & Checkout
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default SelectLensesPage;
