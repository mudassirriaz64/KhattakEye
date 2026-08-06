import { useEffect, useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCartStore, prescriptionFilesCache } from "@/lib/stores/cart-store";
import { useUiStore } from "@/lib/stores/ui-store";
import { getProductBySlug } from "@/lib/api/products";
import { type Product } from "@/lib/shop-data";
import { AudioInstructionPlayer } from "@/components/product/configurator/AudioInstructionPlayer";
import { PrescriptionFormStep } from "@/components/product/configurator/PrescriptionFormStep";
import { LensTypeStep, type LensTypeOption } from "@/components/product/configurator/LensTypeStep";
import { ConfiguratorReviewStep } from "@/components/product/configurator/ConfiguratorReviewStep";
import { type PrescriptionData } from "@/components/product/configurator/PrescriptionSummaryTable";

const LENS_OPTIONS: LensTypeOption[] = [
  {
    id: "basic",
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
    id: "medium",
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
    id: "gradient",
    name: "Gradient Fashion Tint",
    price: 2500,
    description: "Dark top fading to clear bottom. Preferred by drivers.",
    info: "Fades down elegantly. The darker top blocks overhead sun rays, while the lighter bottom helps you view dashboards clearly.",
    strengths: ["Standard Gradient"],
    colors: [
      { name: "Smoke Gradient", hex: "#1f2937" },
      { name: "Amber Gradient", hex: "#78350f" },
      { name: "Forest Gradient", hex: "#064e3b" }
    ]
  },
  {
    id: "polarized",
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

  // Lens State
  const [selectedLensId, setSelectedLensId] = useState("basic");
  const [selectedLensPrice, setSelectedLensPrice] = useState(1000);
  const [selectedStrength, setSelectedStrength] = useState("Medium (50%)");
  const [selectedColorNameOpt, setSelectedColorNameOpt] = useState("Solid Black");

  useEffect(() => {
    async function fetchProduct() {
      if (!slug) return;
      try {
        const data = await getProductBySlug(slug);
        setProduct(data);
      } catch (err) {
        console.error("Failed to fetch product details:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [slug]);

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

  const runningSubtotal = product.price + selectedLensPrice;
  const currentLensOption = LENS_OPTIONS.find((l) => l.id === selectedLensId) || LENS_OPTIONS[0];

  const handleNext = () => {
    if (step === 1) {
      if (prescriptionType === "file" && !prescriptionFile) {
        alert("Please upload a prescription image file to proceed.");
        return;
      }
      if (prescriptionType === "written" && !prescriptionText.trim()) {
        alert("Please enter your eyesight details to proceed.");
        return;
      }
    }
    if (step < 3) {
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
      lensType: currentLensOption.name,
      tintColor: selectedColorNameOpt,
      tintStrength: selectedStrength,
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
      lensType: `${currentLensOption.name} (${selectedColorNameOpt})`,
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
              {/* Lens color tint overlay — visible on Step 2 when a color is selected */}
              {step === 2 && selectedColorNameOpt && LENS_COLOR_HEX[selectedColorNameOpt] && (
                <motion.div
                  key={selectedColorNameOpt}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.32 }}
                  transition={{ duration: 0.4 }}
                  className="pointer-events-none absolute inset-0 rounded-lg"
                  style={{
                    background: getLensOverlayStyle(selectedColorNameOpt, selectedLensId === "gradient"),
                    mixBlendMode: "multiply",
                  }}
                />
              )}
              {/* Color pill badge */}
              {step === 2 && selectedColorNameOpt && LENS_COLOR_HEX[selectedColorNameOpt] && (
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
            <div className="flex items-center gap-1.5">
              <span className={cn("flex h-5 w-5 items-center justify-center rounded-full border text-[9px]", step >= 1 ? "border-[color:var(--color-brand-primary)] bg-[color:var(--color-brand-primary)] text-white" : "border-[color:var(--color-border)]")}>
                {step > 1 ? <Check className="h-3 w-3" /> : "1"}
              </span>
              <span className={cn(step === 1 && "text-[color:var(--color-text-primary)]")}>Prescription</span>
            </div>
            <div className="h-px w-12 bg-[color:var(--color-border)]" />
            <div className="flex items-center gap-1.5">
              <span className={cn("flex h-5 w-5 items-center justify-center rounded-full border text-[9px]", step >= 2 ? "border-[color:var(--color-brand-primary)] bg-[color:var(--color-brand-primary)] text-white" : "border-[color:var(--color-border)]")}>
                {step > 2 ? <Check className="h-3 w-3" /> : "2"}
              </span>
              <span className={cn(step === 2 && "text-[color:var(--color-text-primary)]")}>Lens Type</span>
            </div>
            <div className="h-px w-12 bg-[color:var(--color-border)]" />
            <div className="flex items-center gap-1.5">
              <span className={cn("flex h-5 w-5 items-center justify-center rounded-full border text-[9px]", step >= 3 ? "border-[color:var(--color-brand-primary)] bg-[color:var(--color-brand-primary)] text-white" : "border-[color:var(--color-border)]")}>
                3
              </span>
              <span className={cn(step === 3 && "text-[color:var(--color-text-primary)]")}>Review</span>
            </div>
          </div>

          {/* Active Step Panel */}
          <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 shadow-sm min-h-[400px] flex flex-col">
            <div className="flex-1">
              {step === 1 && (
                <div className="space-y-6">
                  <AudioInstructionPlayer src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" />
                  
                  {/* Option selector to indicate prescription choice */}
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
                </div>
              )}

              {step === 2 && (
                <LensTypeStep
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

              {step === 3 && (
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
                {step < 3 ? (
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
