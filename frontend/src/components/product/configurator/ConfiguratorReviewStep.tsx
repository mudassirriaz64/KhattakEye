import { PrescriptionSummaryTable, type PrescriptionData } from "./PrescriptionSummaryTable";
import { type LensTypeOption } from "./LensTypeStep";

interface ConfiguratorReviewStepProps {
  product: { name: string; brand: string; image: string; price: number };
  prescriptionType: "none" | "manual" | "file" | "written";
  prescriptionData: PrescriptionData;
  prescriptionFile: File | null;
  prescriptionText: string;
  lensOption: LensTypeOption;
  selectedColorName: string;
  selectedStrength: string;
  usageType?: string;
  lensCoating?: string;
}

export function ConfiguratorReviewStep({
  product,
  prescriptionType,
  prescriptionData,
  prescriptionFile,
  prescriptionText,
  lensOption,
  selectedColorName,
  selectedStrength,
  usageType,
  lensCoating
}: ConfiguratorReviewStepProps) {
  const itemSubtotal = product.price + lensOption.price;

  return (
    <div className="flex flex-col gap-4 text-xs font-semibold text-[color:var(--color-text-secondary)]">
      {/* Product Summary */}
      <div className="flex items-center gap-3 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-3">
        <img src={product.image} alt={product.name} className="h-14 w-14 rounded-lg object-contain bg-[color:var(--color-surface-muted)] border border-[color:var(--color-border)]" />
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-[color:var(--color-text-tertiary)] uppercase tracking-wider">{product.brand}</p>
          <p className="text-xs font-bold text-[color:var(--color-text-primary)] truncate">{product.name}</p>
          <p className="text-[11px] text-[color:var(--color-text-secondary)] mt-0.5">Frame Base: Rs. {product.price.toLocaleString()}</p>
        </div>
      </div>

      {/* Prescription Summary */}
      <div>
        <h4 className="text-xs font-bold text-[color:var(--color-text-primary)] mb-2">Prescription Details</h4>
        {(prescriptionType === "manual" || prescriptionType === "none") && (
          <PrescriptionSummaryTable data={prescriptionData} prescriptionType={prescriptionType} />
        )}
        {prescriptionType === "file" && (
          <div className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] p-3 text-center">
            <p className="font-bold text-[color:var(--color-text-primary)]">Prescription Photo Attached</p>
            <p className="text-[10px] text-[color:var(--color-text-tertiary)] mt-1">{prescriptionFile ? prescriptionFile.name : "No file selected"}</p>
          </div>
        )}
        {prescriptionType === "written" && (
          <div className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-3">
            <p className="font-bold text-[color:var(--color-text-primary)] mb-1">Handwritten / Typed Text:</p>
            <p className="text-xs text-[color:var(--color-text-secondary)] leading-relaxed italic">"{prescriptionText || "No text entered"}"</p>
          </div>
        )}
      </div>

      {/* Lens Configuration Summary */}
      <div className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-3 space-y-2">
        {usageType && (
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-[color:var(--color-text-tertiary)] uppercase tracking-wider">Usage</span>
            <span className="text-xs font-bold text-[color:var(--color-text-primary)]">{usageType}</span>
          </div>
        )}
        <div className="flex justify-between items-center">
          <span className="text-[10px] text-[color:var(--color-text-tertiary)] uppercase tracking-wider">Selected Lens</span>
          <span className="text-xs font-bold text-[color:var(--color-text-primary)]">{lensOption.name}</span>
        </div>
        {lensCoating && lensCoating !== lensOption.name && (
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-[color:var(--color-text-tertiary)] uppercase tracking-wider">Coating</span>
            <span className="text-xs font-bold text-[color:var(--color-text-primary)]">{lensCoating}</span>
          </div>
        )}
        {selectedColorName && (
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-[color:var(--color-text-tertiary)] uppercase tracking-wider">Lens Color / Option</span>
            <span className="text-xs font-bold text-[color:var(--color-text-primary)]">{selectedColorName}</span>
          </div>
        )}
        {selectedStrength && (
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-[color:var(--color-text-tertiary)] uppercase tracking-wider">Tint Density</span>
            <span className="text-xs font-bold text-[color:var(--color-text-primary)]">{selectedStrength}</span>
          </div>
        )}
        <div className="flex justify-between items-center border-t border-[color:var(--color-border)] pt-2 mt-1">
          <span className="text-xs font-bold text-[color:var(--color-text-primary)]">Lens Customization Price</span>
          <span className="text-xs font-bold text-[color:var(--color-brand-primary)]">+Rs. {lensOption.price.toLocaleString()}</span>
        </div>
      </div>

      {/* Price breakdown and Advance Policy Callout */}
      <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 space-y-2">
        <div className="flex justify-between items-center text-amber-900 font-bold">
          <span>Customized Subtotal</span>
          <span>Rs. {itemSubtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center text-amber-900 text-[11px]">
          <span>Required 50% Advance Payment</span>
          <span className="font-bold">Rs. {(itemSubtotal * 0.5).toLocaleString()}</span>
        </div>
        <p className="text-[10px] text-amber-800/90 leading-relaxed font-medium pt-1 border-t border-amber-500/20">
          * Note: Custom cut lenses require a 50% advance payment via Bank Transfer, Easypaisa, or JazzCash before processing.
        </p>
      </div>
    </div>
  );
}
