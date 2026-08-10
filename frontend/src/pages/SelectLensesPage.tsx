import { useEffect, useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCartStore, prescriptionFilesCache } from "@/lib/stores/cart-store";
import { useUiStore } from "@/lib/stores/ui-store";
import { getProductBySlug } from "@/lib/api/products";
import { getLensOptionsApi } from "@/lib/api/lens-options";
import { AudioInstructionPlayer } from "@/components/product/configurator/AudioInstructionPlayer";
import { PrescriptionFormStep } from "@/components/product/configurator/PrescriptionFormStep";
import {
  LensTypeStep,
  type LensTypeOption,
  type LensSelection,
  getDefaultSelection,
  resolveSelection
} from "@/components/product/configurator/LensTypeStep";
import { ConfiguratorReviewStep } from "@/components/product/configurator/ConfiguratorReviewStep";
import { SelectableOptionCard } from "@/components/product/configurator/SelectableOptionCard";
import { type PrescriptionData } from "@/components/product/configurator/PrescriptionSummaryTable";

// Usage types for eyeglasses (category "eyeglasses") — ERP.md §6 enum values
const USAGE_OPTIONS: { id: "distance" | "reading" | "non-prescription"; name: string; description: string }[] = [
  {
    id: "distance",
    name: "Distance",
    description: "For driving, TV, and everyday long-distance vision."
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
  const [usageType, setUsageType] = useState<"distance" | "reading" | "non-prescription">("distance");

  // Lens state — single path object per branch (main + delegated Sun); the API is the source of truth
  const [lensOptions, setLensOptions] = useState<LensTypeOption[]>([]);
  const [lensSelection, setLensSelection] = useState<LensSelection | null>(null);
  const [selectedStrength, setSelectedStrength] = useState("");
  const [selectedColorNameOpt, setSelectedColorNameOpt] = useState("");
  const [delegatedOptions, setDelegatedOptions] = useState<LensTypeOption[]>([]);
  const [delegatedSelection, setDelegatedSelection] = useState<LensSelection | null>(null);
  const [delegatedStrength, setDelegatedStrength] = useState("");
  const [delegatedColorName, setDelegatedColorName] = useState("");
  const [lensLoadError, setLensLoadError] = useState(false);

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
      try {
        const options = await getLensOptionsApi(appliesTo);
        setLensOptions(options);
        const def = getDefaultSelection(options);
        setLensSelection(def);
        if (def) {
          const leaf = resolveSelection(options, def).type;
          if (leaf?.strengths?.length) setSelectedStrength(leaf.strengths[0]);
          if (leaf?.colors?.length) setSelectedColorNameOpt(leaf.colors[0].name);
        }
        setLensLoadError(false);
      } catch (err) {
        console.error("Failed to fetch lens options:", err);
        setLensLoadError(true);
      }

      // Also fetch sunglasses options for eyeglasses sunglasses delegation (Sun coating)
      if (product.category === "eyeglasses") {
        try {
          const sunOpts = await getLensOptionsApi("sunglasses");
          setDelegatedOptions(sunOpts);
          const sunDef = getDefaultSelection(sunOpts);
          setDelegatedSelection(sunDef);
          if (sunDef) {
            const sunLeaf = resolveSelection(sunOpts, sunDef).type;
            if (sunLeaf?.strengths?.length) setDelegatedStrength(sunLeaf.strengths[0]);
            if (sunLeaf?.colors?.length) setDelegatedColorName(sunLeaf.colors[0].name);
          }
        } catch (err) {
          console.error("Failed to fetch sunglasses options for delegation:", err);
        }
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
  const lensDetail = resolveSelection(lensOptions, lensSelection);
  const delegatedDetail = isEyeglasses ? resolveSelection(delegatedOptions, delegatedSelection) : null;
  const currentLensOption = lensDetail?.type ?? lensOptions[0];
  const isDelegated = isEyeglasses && currentLensOption?.delegatesToAppliesTo === "sunglasses";
  const effectiveLensPrice = (isDelegated ? delegatedSelection?.price : lensSelection?.price) ?? null;
  const isPriceOnRequest = isDelegated
    ? (delegatedSelection?.priceOnRequest ?? false)
    : (lensSelection?.priceOnRequest ?? false);
  const runningSubtotal = product.price + (effectiveLensPrice ?? 0);
  const effectiveLensName = isDelegated
    ? (delegatedDetail?.type?.name ?? "")
    : (currentLensOption?.name ?? "");
  const effectiveColorName = isDelegated ? delegatedColorName : selectedColorNameOpt;
  const effectiveStrength = isDelegated ? delegatedStrength : selectedStrength;
  const isGradientLens = /gradient/i.test(effectiveLensName);
  const lensSubtotalNote = isDelegated
    ? `${currentLensOption?.name ?? ""} - ${delegatedDetail?.type?.name ?? ""}`
    : [lensDetail?.collection?.name, lensDetail?.brand?.name, lensDetail?.type?.name]
        .filter(Boolean)
        .join(" - ") || "";
  const reviewLensOption: LensTypeOption =
    (isDelegated ? delegatedDetail?.type : currentLensOption) ??
    (isDelegated ? delegatedOptions[0] : lensOptions[0]) ?? {
      kind: "type",
      id: "",
      name: "",
      price: null,
      description: "",
      info: "",
    };

  const handleSelectLens = (partial: Partial<LensSelection>) => {
    setLensSelection((prev) => (prev ? { ...prev, ...partial } : (partial as LensSelection)));
  };
  const handleSelectDelegated = (partial: Partial<LensSelection>) => {
    setDelegatedSelection((prev) => (prev ? { ...prev, ...partial } : (partial as LensSelection)));
  };

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
      // §6/§14: the category is referenced via lensOptionSlug (sunglasses) or lensCoating (eyeglasses);
      // collection → brand → lensType slugs resolve the server-authoritative price.
      lensOptionSlug: isEyeglasses
        ? (isDelegated ? delegatedSelection?.categoryId : undefined)
        : (lensSelection?.categoryId ?? undefined),
      lensOptionCollectionSlug: isDelegated ? undefined : (lensSelection?.collectionSlug ?? undefined),
      lensOptionBrandSlug: isDelegated ? undefined : (lensSelection?.brandSlug ?? undefined),
      lensOptionTypeSlug: isDelegated ? undefined : (lensSelection?.typeSlug ?? undefined),
      lensType: effectiveLensName,
      usageType: isEyeglasses ? usageType : undefined,
      lensCoating: isEyeglasses ? (lensSelection?.categoryId ?? undefined) : undefined,
      tintColor: isEyeglasses ? (isDelegated ? delegatedColorName : undefined) : selectedColorNameOpt,
      tintStrength: isEyeglasses ? (isDelegated ? delegatedStrength : undefined) : selectedStrength,
      priceAdded: effectiveLensPrice,
      priceOnRequest: isPriceOnRequest
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
        ? `${effectiveLensName} • ${USAGE_OPTIONS.find((u) => u.id === usageType)?.name}`
        : `${effectiveLensName}${selectedColorNameOpt ? ` (${selectedColorNameOpt})` : ""}`,
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
          <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 shadow-sm min-h-[400px] flex flex-col" style={{ overflowAnchor: "none" }}>
            <div className="flex-1">
              {isEyeglasses && step === 1 && (
                <div className="space-y-6">
                  <AudioInstructionPlayer src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" />
                  <div>
                    <h3 className="text-sm font-bold text-[color:var(--color-text-primary)]">What will you use these glasses for?</h3>
                    <p className="text-[11px] text-[color:var(--color-text-secondary)] mt-0.5 mb-4">Choose the usage that matches your daily needs.</p>
                    <div className="flex flex-col gap-3">
                      {USAGE_OPTIONS.map((usage) => (
                        <SelectableOptionCard
                          key={usage.id}
                          title={usage.name}
                          description={usage.description}
                          selected={usageType === usage.id}
                          onClick={() => setUsageType(usage.id)}
                        />
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
                <div className="space-y-4">
                  {lensLoadError && (
                    <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 flex items-start gap-2.5">
                      <ShieldAlert className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-red-700">Couldn't load lens options</p>
                        <p className="text-[11px] text-red-600/90 mt-0.5">
                          We couldn't fetch the latest lens pricing. Please refresh the page or try again later.
                        </p>
                      </div>
                    </div>
                  )}
                  <LensTypeStep
                    options={lensOptions}
                    selection={lensSelection}
                    onSelect={handleSelectLens}
                    selectedStrength={selectedStrength}
                    selectedColorName={selectedColorNameOpt}
                    onSelectStrength={setSelectedStrength}
                    onSelectColor={setSelectedColorNameOpt}
                    delegatedOptions={delegatedOptions}
                    delegatedSelection={delegatedSelection}
                    delegatedStrength={delegatedStrength}
                    delegatedColorName={delegatedColorName}
                    onSelectDelegated={handleSelectDelegated}
                    onSelectDelegatedStrength={setDelegatedStrength}
                    onSelectDelegatedColor={setDelegatedColorName}
                  />
                </div>
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
                  lensOption={reviewLensOption}
                  selectedColorName={effectiveColorName}
                  selectedStrength={effectiveStrength}
                  usageType={isEyeglasses ? (USAGE_OPTIONS.find((u) => u.id === usageType)?.name) : undefined}
                  lensCoating={isEyeglasses ? (lensDetail?.category?.name ?? currentLensOption?.name) : undefined}
                  collectionName={lensDetail?.collection?.name}
                  brandName={lensDetail?.brand?.name}
                  lensTypeName={lensDetail?.type?.name}
                  priceOnRequest={isPriceOnRequest}
                />
              )}
            </div>

            {/* Bottom Actions Row inside the main card */}
            <div className="border-t border-[color:var(--color-border)] pt-5 mt-6 flex justify-between items-center gap-4">
              <div className="min-w-0">
                <p className="text-[10px] text-[color:var(--color-text-tertiary)] uppercase font-bold tracking-wider">Subtotal</p>
                <p className={cn("text-base font-bold", isPriceOnRequest ? "text-amber-700" : "text-[color:var(--color-text-primary)]")}>
                  {isPriceOnRequest
                    ? `Rs. ${product.price.toLocaleString()} + Lens on request`
                    : `Rs. ${runningSubtotal.toLocaleString()}`}
                </p>
                <p className="text-[10px] text-[color:var(--color-text-secondary)] font-medium mt-0.5 truncate max-w-[200px] sm:max-w-none">
                  {isPriceOnRequest
                    ? `(Rs. ${product.price.toLocaleString()} Frame + ${lensSubtotalNote} — price confirmed by our team before payment)`
                    : `(Rs. ${product.price.toLocaleString()} Frame + Rs. ${(effectiveLensPrice ?? 0).toLocaleString()} ${lensSubtotalNote})`}
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
                    {isPriceOnRequest
                      ? "Confirm & add to cart — price confirmed by our team before payment"
                      : "Add to Cart & Checkout"}
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
