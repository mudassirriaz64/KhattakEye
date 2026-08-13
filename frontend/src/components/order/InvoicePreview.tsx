import { Download, Printer, Glasses, ExternalLink, FileText } from "lucide-react";
import { Button } from "@/components/primitives/Button";
import { getPaymentMethodLabel, getOrderStatusLabel } from "@/lib/utils/enum-labels";
import { resolveCloudinaryUrl } from "@/lib/api/products";

type InvoicePreviewProps = {
  order: any;
};

export function InvoicePreview({ order }: InvoicePreviewProps) {
  const handlePrint = () => {
    window.print();
  };

  const shipping = order.shippingAddress;
  const shippingStr = typeof shipping === "string"
    ? shipping
    : shipping
    ? `${shipping.fullName || order.customerName || ''} · ${shipping.phone || order.customerPhone || ''}\n${shipping.street || ''}, ${shipping.area || ''}, ${shipping.city || ''}, ${shipping.province || ''} ${shipping.postalCode || ''}`
    : "";

  return (
    <div id="printable-invoice" className="rounded-2xl border border-[color:var(--color-border)] bg-white p-8 shadow-[var(--shadow-soft)] print:border-none print:shadow-none print:p-0 print:m-0">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-200 pb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#8B181A] text-white">
            <Glasses className="h-6 w-6" />
          </div>
          <div>
            <p className="font-display text-2xl font-bold text-neutral-900">Khattak Eyewear</p>
            <p className="text-xs text-neutral-500">Master Artisans · Premium Optics</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold uppercase tracking-widest text-[#8B181A]">TAX INVOICE</p>
          <p className="text-lg font-bold text-neutral-900">{order.orderNumber}</p>
          <p className="text-xs text-neutral-500">
            Date: {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : order.date}
          </p>
        </div>
      </div>

      {/* Customer & Billing Info Grid */}
      <div className="mt-6 grid gap-6 sm:grid-cols-2 text-neutral-800">
        <div className="rounded-xl bg-neutral-50 p-4 border border-neutral-200/80">
          <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Customer & Shipping Address</p>
          <p className="mt-1.5 text-sm font-bold text-neutral-900">{order.customerName}</p>
          <p className="text-xs text-neutral-600">{order.customerEmail}</p>
          <p className="text-xs text-neutral-600">{order.customerPhone}</p>
          <p className="mt-2 text-xs leading-relaxed text-neutral-700 whitespace-pre-line">{shippingStr}</p>
        </div>

        <div className="rounded-xl bg-neutral-50 p-4 border border-neutral-200/80">
          <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Payment & Order Summary</p>
          <div className="mt-2 space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-neutral-500">Payment Method:</span>
              <span className="font-semibold text-neutral-900">{getPaymentMethodLabel(order.paymentMethod)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Payment Type:</span>
              <span className="font-semibold capitalize text-neutral-900">{order.paymentType || "Full Payment"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Order Status:</span>
              <span className="font-semibold capitalize text-neutral-900">{getOrderStatusLabel(order.status)}</span>
            </div>
            {order.paymentProof?.transactionId && (
              <div className="flex justify-between">
                <span className="text-neutral-500">Transaction ID:</span>
                <span className="font-mono text-neutral-800">{order.paymentProof.transactionId}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Items Table with Detailed Prescription Specs */}
      <div className="mt-6 overflow-hidden rounded-xl border border-neutral-200">
        <table className="w-full text-xs text-left">
          <thead className="bg-neutral-100 border-b border-neutral-200 text-neutral-700 font-bold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="px-4 py-3">Product Item & Specifications</th>
              <th className="px-4 py-3 text-center">Qty</th>
              <th className="px-4 py-3 text-right">Unit Price</th>
              <th className="px-4 py-3 text-right">Total Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {order.items?.map((item: any, i: number) => {
              const c = item.customization;
              const itemImg = item.image ? resolveCloudinaryUrl(item.image) : "/placeholder.png";

              const lensChain = [
                c?.lensCoatingName || c?.lensCoating,
                c?.lensOptionCollectionName || c?.lensOptionCollectionSlug,
                c?.lensOptionBrandName || c?.lensOptionBrandSlug,
                c?.lensOptionTypeName || c?.lensOptionTypeSlug,
                c?.tintColor ? `Tint: ${c.tintColor} (${c.tintStrength || ''})` : null
              ].filter(Boolean).join(" · ");

              return (
                <tr key={i} className="align-top">
                  <td className="px-4 py-3.5 space-y-2">
                    <div className="flex items-center gap-3">
                      <img src={itemImg} alt={item.name} className="h-12 w-12 shrink-0 rounded-lg object-contain border border-neutral-200 bg-white p-0.5" />
                      <div>
                        <p className="font-bold text-sm text-neutral-900">{item.name}</p>
                        <p className="text-xs text-neutral-500">Brand: {item.brand || "Khattak"} · Color: {item.color}</p>
                      </div>
                    </div>

                    {/* Lens Option Details */}
                    {lensChain && (
                      <div className="rounded-lg bg-neutral-50 p-2.5 border border-neutral-200 text-neutral-700">
                        <p className="font-bold text-[10px] uppercase tracking-wider text-neutral-500">Lens Specification:</p>
                        <p className="font-medium text-xs text-neutral-800">{lensChain}</p>
                        {c?.usageType && (
                          <p className="text-[10px] text-neutral-500">Usage: {c.usageType} {c.multifocalSubtype ? `(${c.multifocalSubtype})` : ''}</p>
                        )}
                      </div>
                    )}

                    {/* Prescription Details (OD, OS, SPH, CYL, AXIS, ADD, PD) */}
                    {c?.prescriptionType && c.prescriptionType !== "none" && (
                      <div className="rounded-lg bg-amber-50/60 p-2.5 border border-amber-200 text-neutral-800 space-y-1.5">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-900">
                          <FileText className="h-3 w-3 text-amber-700" />
                          <span>Prescription Details ({c.prescriptionType})</span>
                        </div>

                        {c.prescriptionType === "manual" && c.prescriptionData && (
                          <div className="overflow-x-auto">
                            <table className="w-full text-[11px] border-collapse text-center bg-white rounded border border-amber-200">
                              <thead>
                                <tr className="bg-amber-100/70 text-amber-900 font-bold">
                                  <th className="px-2 py-1 text-left">Eye</th>
                                  <th className="px-2 py-1">SPH</th>
                                  <th className="px-2 py-1">CYL</th>
                                  <th className="px-2 py-1">AXIS</th>
                                  <th className="px-2 py-1">ADD</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-amber-100">
                                <tr>
                                  <td className="px-2 py-1 font-bold text-left bg-amber-50/50">OD (Right)</td>
                                  <td className="px-2 py-1">{c.prescriptionData.od?.sph ?? '-'}</td>
                                  <td className="px-2 py-1">{c.prescriptionData.od?.cyl ?? '-'}</td>
                                  <td className="px-2 py-1">{c.prescriptionData.od?.axis ?? '-'}</td>
                                  <td className="px-2 py-1">{c.prescriptionData.od?.add ?? '-'}</td>
                                </tr>
                                <tr>
                                  <td className="px-2 py-1 font-bold text-left bg-amber-50/50">OS (Left)</td>
                                  <td className="px-2 py-1">{c.prescriptionData.os?.sph ?? '-'}</td>
                                  <td className="px-2 py-1">{c.prescriptionData.os?.cyl ?? '-'}</td>
                                  <td className="px-2 py-1">{c.prescriptionData.os?.axis ?? '-'}</td>
                                  <td className="px-2 py-1">{c.prescriptionData.os?.add ?? '-'}</td>
                                </tr>
                              </tbody>
                            </table>
                            {c.prescriptionData.pd && (
                              <p className="mt-1 text-[10px] font-semibold text-amber-900">
                                PD (Pupillary Distance): {typeof c.prescriptionData.pd === 'object' ? `${c.prescriptionData.pdTwo?.od || '-'}/${c.prescriptionData.pdTwo?.os || '-'}` : c.prescriptionData.pd} mm
                              </p>
                            )}
                          </div>
                        )}

                        {c.prescriptionType === "written" && c.prescriptionText && (
                          <p className="text-xs italic text-neutral-800 bg-white p-2 rounded border border-amber-200">
                            "{c.prescriptionText}"
                          </p>
                        )}

                        {c.prescriptionType === "file" && c.prescriptionFilePublicId && (
                          <div className="pt-1">
                            <a
                              href={`https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'demo'}/image/upload/${c.prescriptionFilePublicId}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-bold text-amber-900 underline hover:text-amber-700"
                            >
                              <ExternalLink className="h-3 w-3" /> View Prescription File Attachment
                            </a>
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-center font-bold text-neutral-900">{item.quantity}</td>
                  <td className="px-4 py-3.5 text-right font-medium text-neutral-800">Rs. {(item.price || 0).toLocaleString()}</td>
                  <td className="px-4 py-3.5 text-right font-bold text-neutral-900">Rs. {((item.price || 0) * (item.quantity || 1)).toLocaleString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Financial Calculations Summary */}
      <div className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-t border-neutral-200 pt-4 text-xs">
        <div className="text-neutral-500 space-y-1">
          <p className="font-semibold text-neutral-700">Thank you for choosing Khattak Eyewear.</p>
          <p>For questions or assistance regarding your order, contact support@khattakeye.com</p>
        </div>

        <div className="w-full sm:w-64 space-y-2 text-neutral-800">
          <div className="flex justify-between">
            <span className="text-neutral-500">Subtotal</span>
            <span className="font-medium">Rs. {(order.subtotal || 0).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Shipping Fee</span>
            <span className="font-medium">{order.shipping === 0 ? "Free" : `Rs. ${order.shipping}`}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-600 font-medium">
              <span>Discount</span>
              <span>-Rs. {(order.discount || 0).toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between border-t border-neutral-300 pt-2 text-sm font-bold text-neutral-900">
            <span>Grand Total</span>
            <span className="text-[#8B181A]">Rs. {(order.total || 0).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Print Action Buttons (Hidden when printing) */}
      <div className="mt-8 flex justify-end gap-3 print:hidden">
        <Button variant="outline" iconLeft={<Printer className="h-4 w-4" />} onClick={handlePrint}>
          Print Invoice
        </Button>
        <Button variant="primary" iconLeft={<Download className="h-4 w-4" />} onClick={handlePrint}>
          Download PDF
        </Button>
      </div>
    </div>
  );
}
