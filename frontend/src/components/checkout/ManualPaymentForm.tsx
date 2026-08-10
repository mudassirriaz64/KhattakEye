import { useState, useRef, useEffect } from "react";
import { Copy, Check, Upload, Shield } from "lucide-react";
import { useCheckoutStore } from "@/lib/stores/checkout-store";
import axios from "@/lib/api/axios";

const defaultBankDetails: Record<string, { holder: string; bank: string; iban: string; number: string }> = {
  "bank-transfer": { holder: "Khattak Eyewear Pvt. Ltd.", bank: "Habib Bank Limited (HBL)", iban: "PK36 HABB 0024 5678 9012 3456", number: "0245-6789012-34" },
  jazzcash: { holder: "Khattak Eyewear", bank: "JazzCash", iban: "", number: "0300 1234567" },
  easypaisa: { holder: "Khattak Eyewear", bank: "EasyPaisa", iban: "", number: "0300 1234567" },
};

export function ManualPaymentForm() {
  const payment = useCheckoutStore((s) => s.payment);
  const setTransactionId = useCheckoutStore((s) => s.setTransactionId);
  const setPaymentScreenshot = useCheckoutStore((s) => s.setPaymentScreenshot);
  const setPaymentNotes = useCheckoutStore((s) => s.setPaymentNotes);
  const [copied, setCopied] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dynamicBankDetails, setDynamicBankDetails] = useState(defaultBankDetails);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    axios.get("/settings").then((res) => {
      if (res.data) {
        const s = res.data;
        setDynamicBankDetails({
          "bank-transfer": {
            holder: s.bankDetails?.accountTitle || defaultBankDetails["bank-transfer"].holder,
            bank: s.bankDetails?.bankName || defaultBankDetails["bank-transfer"].bank,
            iban: s.bankDetails?.iban || defaultBankDetails["bank-transfer"].iban,
            number: s.bankDetails?.accountNumber || defaultBankDetails["bank-transfer"].number
          },
          jazzcash: {
            holder: s.jazzcash?.accountTitle || defaultBankDetails.jazzcash.holder,
            bank: "JazzCash",
            iban: "",
            number: s.jazzcash?.number || defaultBankDetails.jazzcash.number
          },
          easypaisa: {
            holder: s.easypaisa?.accountTitle || defaultBankDetails.easypaisa.holder,
            bank: "EasyPaisa",
            iban: "",
            number: s.easypaisa?.number || defaultBankDetails.easypaisa.number
          }
        });
      }
    }).catch(() => {});
  }, []);

  const details = payment.method ? dynamicBankDetails[payment.method] : null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setUploadError(null);
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setUploadError("Image exceeds maximum 10MB limit. Please choose a smaller file.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => setPaymentScreenshot(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  if (!details) return null;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 md:p-8">
        <h3 className="font-display text-xl text-[color:var(--color-text-primary)]">Payment Details</h3>
        <p className="mt-1 text-sm text-[color:var(--color-text-secondary)]">Transfer the amount to the following account.</p>

        <div className="mt-6 space-y-4">
          {[
            { label: "Account Holder", value: details.holder },
            { label: "Bank Name", value: details.bank },
            ...(details.iban ? [{ label: "IBAN / Account", value: details.iban }] : []),
            { label: "Account Number", value: details.number },
          ].map((field) => (
            <div key={field.label} className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-app-bg)] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-[color:var(--color-text-tertiary)]">{field.label}</p>
                  <p className="mt-0.5 text-sm font-medium text-[color:var(--color-text-primary)]">{field.value}</p>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(field.value, field.label)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-[color:var(--color-border)] text-[color:var(--color-text-tertiary)] transition-colors hover:bg-[color:var(--color-surface-muted)] hover:text-[color:var(--color-accent-teal)]"
                >
                  {copied === field.label ? <Check className="h-4 w-4 text-[color:var(--color-accent-teal)]" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>
          ))}
        </div>

        {payment.method !== "cod" && (
          <>
            <div className="mt-6 flex items-center justify-center rounded-xl border-2 border-dashed border-[color:var(--color-border)] bg-[color:var(--color-app-bg)] p-8">
              {payment.paymentScreenshot ? (
                <div className="relative">
                  <img src={payment.paymentScreenshot} alt="Payment receipt" className="max-h-40 rounded-lg object-contain" />
                  <button
                    type="button"
                    onClick={() => setPaymentScreenshot(null)}
                    className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[color:var(--color-danger)] text-xs text-white"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button type="button" onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center gap-2 text-sm text-[color:var(--color-text-tertiary)] transition-colors hover:text-[color:var(--color-accent-teal)]">
                  <Upload className="h-8 w-8" />
                  <span className="font-medium">Upload Payment Screenshot</span>
                  <span className="text-xs">PNG, JPG or PDF (max 5MB)</span>
                </button>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </div>
            {uploadError && (
              <p className="mt-2 text-xs font-medium text-red-500">{uploadError}</p>
            )}

            <div className="mt-4">
              <label className="block space-y-2">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--color-text-tertiary)]">Transaction ID</span>
                <input
                  value={payment.transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="Enter transaction / reference ID"
                  className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-app-bg)] py-3.5 px-4 text-sm text-[color:var(--color-text-primary)] outline-none transition-all placeholder:text-[color:var(--color-text-tertiary)] focus:border-[color:var(--color-accent-blue)] focus:ring-4 focus:ring-[color:var(--color-focus-ring)]"
                />
              </label>
            </div>

            <div className="mt-4">
              <label className="block space-y-2">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--color-text-tertiary)]">Payment Notes (Optional)</span>
                <textarea
                  value={payment.paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  placeholder="Any additional information..."
                  rows={2}
                  className="w-full resize-none rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-app-bg)] py-3.5 px-4 text-sm text-[color:var(--color-text-primary)] outline-none transition-all placeholder:text-[color:var(--color-text-tertiary)] focus:border-[color:var(--color-accent-blue)] focus:ring-4 focus:ring-[color:var(--color-focus-ring)]"
                />
              </label>
            </div>
          </>
        )}

        <div className="mt-6 space-y-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <div className="flex items-start gap-3">
            <Shield className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            <p className="text-xs leading-6 text-amber-800">
              Your payment is secure and encrypted. Orders are processed after payment verification, which typically takes 2-4 hours during business hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
