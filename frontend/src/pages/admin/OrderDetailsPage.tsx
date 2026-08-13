import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Package, CreditCard, MapPin, Printer, CheckCircle, MessageSquare, ExternalLink, ShieldAlert, FileText } from "lucide-react";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/primitives/Button";
import { cn } from "@/lib/utils";
import { adminUpdateOrderStatusApi, adminSetOrderItemPriceApi, adminVerifyPaymentApi } from "@/lib/api/admin";
import { getOrderByIdApi } from "@/lib/api/orders";
import { getPaymentMethodLabel } from "@/lib/utils/enum-labels";

const statusFlow = ["pending", "pending-quote", "payment-verification", "confirmed", "processing", "packed", "shipped", "out-for-delivery", "delivered", "cancelled"];

export function AdminOrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStatus, setCurrentStatus] = useState("pending");
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [itemPrices, setItemPrices] = useState<Record<number, string>>({});
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);

  const fetchOrder = () => {
    if (id) {
      setLoading(true);
      getOrderByIdApi(id)
        .then((data) => {
          if (data) {
            setOrder(data);
            setCurrentStatus(data.status || "pending");
          }
        })
        .catch((err) => console.error("Failed to load order details:", err))
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const updateStatus = async (newStatus: string) => {
    setCurrentStatus(newStatus);
    setShowStatusMenu(false);
    if (id) {
      try {
        const updated = await adminUpdateOrderStatusApi(id, newStatus);
        if (updated) {
          setOrder((prev: any) =>
            prev
              ? {
                  ...prev,
                  status: updated.status || newStatus,
                  timeline: updated.timeline || prev.timeline
                }
              : null
          );
        }
      } catch (err) {
        console.error("Failed to update order status:", err);
      }
    }
  };

  const handleSetItemPrice = async (itemIndex: number) => {
    const priceVal = Number(itemPrices[itemIndex]);
    if (!priceVal || priceVal <= 0) {
      alert("Please enter a valid positive price.");
      return;
    }
    if (id) {
      try {
        const updated = await adminSetOrderItemPriceApi(id, itemIndex, priceVal);
        if (updated) {
          setOrder(updated);
          setItemPrices({ ...itemPrices, [itemIndex]: "" });
          alert("Lens price updated successfully!");
        }
      } catch (err) {
        console.error("Failed to set item price:", err);
        alert("Failed to set item price.");
      }
    }
  };

  const handleVerifyPayment = async (action: "approve" | "reject") => {
    if (!id) return;
    if (action === "reject" && !rejectionReason) {
      alert("Please provide a reason for rejecting payment.");
      return;
    }
    try {
      const updated = await adminVerifyPaymentApi(id, action, rejectionReason);
      if (updated) {
        setOrder(updated);
        setShowRejectInput(false);
        setRejectionReason("");
        alert(`Payment ${action === "approve" ? "approved" : "rejected"} successfully!`);
      }
    } catch (err) {
      console.error("Failed to verify payment:", err);
      alert("Failed to process payment verification.");
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <p className="text-sm text-[color:var(--color-text-tertiary)]">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-20 text-center">
        <p className="text-base text-[color:var(--color-text-primary)]">Order not found</p>
        <Link to="/admin/orders" className="mt-4 inline-block text-xs font-semibold text-[color:var(--color-brand-primary)] hover:underline">
          Back to Orders
        </Link>
      </div>
    );
  }

  const paymentStatus = order.paymentProof?.status || (order.paymentMethod === "cod" ? "cod" : "pending");

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link to="/admin/orders" className="inline-flex items-center gap-1.5 text-xs text-[color:var(--color-text-tertiary)] hover:text-[color:var(--color-text-primary)]">
            <ArrowLeft className="h-3 w-3" /> Back to Orders
          </Link>
          <h1 className="mt-2 font-display text-2xl text-[color:var(--color-text-primary)] md:text-3xl">{order.orderNumber}</h1>
          <p className="text-sm text-[color:var(--color-text-secondary)]">
            {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : order.date} · {order.customerName}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link to={`/invoice?id=${order._id || order.id}&from=admin`} target="_blank">
            <Button variant="outline" iconLeft={<FileText className="h-4 w-4" />} className="text-xs">
              Generate Invoice
            </Button>
          </Link>
          <div className="relative">
            <Button variant="primary" iconLeft={<CheckCircle className="h-4 w-4" />} onClick={() => setShowStatusMenu(!showStatusMenu)} className="text-xs">
              Update Status
            </Button>
            {showStatusMenu && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="absolute right-0 top-12 z-10 w-48 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-2 shadow-[var(--shadow-strong)]">
                {statusFlow.map((s) => (
                  <button key={s} type="button" onClick={() => updateStatus(s)} className={cn("flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition-colors", currentStatus === s ? "bg-[color:var(--color-brand-primary)] text-white" : "text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-muted)]")}>
                    {s === currentStatus && <CheckCircle className="h-3 w-3" />}
                    {s.replace(/-/g, " ")}
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-5">
            <h3 className="font-display text-base text-[color:var(--color-text-primary)]">Order Timeline</h3>
            <div className="mt-6 space-y-0">
              {order.timeline?.map((entry: any, i: number) => {
                const isCurrent = entry.status === currentStatus;
                const isPast = entry.completed || statusFlow.indexOf(entry.status) < statusFlow.indexOf(currentStatus);
                return (
                  <div key={i} className="relative flex gap-4 pb-6 last:pb-0">
                    {i < order.timeline.length - 1 && (
                      <div className={cn("absolute left-[15px] top-[30px] h-full w-0.5", isPast ? "bg-[color:var(--color-accent-teal)]" : "bg-[color:var(--color-border)]")} />
                    )}
                    <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full", isPast || isCurrent ? "bg-[color:var(--color-accent-teal)]" : "bg-[color:var(--color-surface-muted)]")}>
                      {isPast || isCurrent ? <CheckCircle className="h-4 w-4 text-white" /> : <div className="h-2.5 w-2.5 rounded-full bg-[color:var(--color-text-tertiary)]" />}
                    </div>
                    <div className="min-w-0 flex-1 pt-1">
                      <p className={cn("text-sm font-medium", isCurrent ? "text-[color:var(--color-accent-teal)]" : "text-[color:var(--color-text-primary)]")}>{entry.label}</p>
                      <p className="mt-0.5 text-xs text-[color:var(--color-text-secondary)]">{entry.description}</p>
                      {entry.date && (
                        <p className="mt-0.5 text-[10px] text-[color:var(--color-text-tertiary)]">
                          {new Date(entry.date).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-5">
            <h3 className="font-display text-base text-[color:var(--color-text-primary)]">Order Items</h3>
            <div className="mt-4 space-y-4">
              {order.items?.map((item: any, i: number) => {
                const c = item.customization;
                const isPricePending = c?.priceOnRequest || c?.priceAdded === null;
                const lensChain = [
                  c?.lensCoatingName || c?.lensCoating,
                  c?.lensOptionCollectionName || c?.lensOptionCollectionSlug,
                  c?.lensOptionBrandName || c?.lensOptionBrandSlug,
                  c?.lensOptionTypeName || c?.lensOptionTypeSlug,
                  c?.tintColor ? `Tint: ${c.tintColor} (${c.tintStrength || ''})` : null
                ].filter(Boolean).join(" → ");

                return (
                  <div key={i} className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-app-bg)] p-4">
                    <div className="flex items-start gap-4">
                      <img src={item.image} alt={item.name} className="h-16 w-16 shrink-0 rounded-lg object-cover" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-[color:var(--color-text-primary)]">{item.name}</p>
                        <p className="text-xs text-[color:var(--color-text-tertiary)]">{item.brand} · {item.color} · Qty: {item.quantity}</p>
                        
                        {lensChain && (
                          <div className="mt-2 rounded-lg bg-[color:var(--color-surface-muted)] p-2.5 text-xs">
                            <p className="font-semibold text-[color:var(--color-text-primary)]">Lens Selection:</p>
                            <p className="text-[color:var(--color-text-secondary)]">{lensChain}</p>
                            {c?.usageType && <p className="mt-0.5 text-[10px] text-[color:var(--color-text-tertiary)]">Usage: {c.usageType} {c.multifocalSubtype ? `(${c.multifocalSubtype})` : ''}</p>}
                          </div>
                        )}

                        {c?.prescriptionType && c.prescriptionType !== "none" && (
                          <div className="mt-2 rounded-lg bg-[color:var(--color-surface-muted)] p-2.5 text-xs">
                            <p className="font-semibold text-[color:var(--color-text-primary)]">Prescription ({c.prescriptionType}):</p>
                            {c.prescriptionType === "manual" && c.prescriptionData && (
                              <div className="mt-1 grid grid-cols-5 gap-2 text-center text-[10px]">
                                <div><span className="font-medium">OD SPH:</span> {c.prescriptionData.od?.sph ?? '-'}</div>
                                <div><span className="font-medium">CYL:</span> {c.prescriptionData.od?.cyl ?? '-'}</div>
                                <div><span className="font-medium">AXIS:</span> {c.prescriptionData.od?.axis ?? '-'}</div>
                                <div><span className="font-medium">ADD:</span> {c.prescriptionData.od?.add ?? '-'}</div>
                                <div><span className="font-medium">PD:</span> {typeof c.prescriptionData.pd === 'object' ? `${c.prescriptionData.pdTwo?.od || '-'}/${c.prescriptionData.pdTwo?.os || '-'}` : c.prescriptionData.pd || '-'}</div>
                                <div><span className="font-medium">OS SPH:</span> {c.prescriptionData.os?.sph ?? '-'}</div>
                                <div><span className="font-medium">CYL:</span> {c.prescriptionData.os?.cyl ?? '-'}</div>
                                <div><span className="font-medium">AXIS:</span> {c.prescriptionData.os?.axis ?? '-'}</div>
                                <div><span className="font-medium">ADD:</span> {c.prescriptionData.os?.add ?? '-'}</div>
                              </div>
                            )}
                            {c.prescriptionType === "written" && (
                              <p className="mt-0.5 italic text-[color:var(--color-text-secondary)]">{c.prescriptionText}</p>
                            )}
                            {c.prescriptionType === "file" && c.prescriptionFilePublicId && (
                              <a href={`https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'demo'}/image/upload/${c.prescriptionFilePublicId}`} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1 text-[color:var(--color-brand-primary)] hover:underline">
                                <ExternalLink className="h-3 w-3" /> View Uploaded Prescription Document
                              </a>
                            )}
                          </div>
                        )}

                        {isPricePending && (
                          <div className="mt-3 rounded-lg border border-amber-300 bg-amber-50 p-3 dark:border-amber-900 dark:bg-amber-950/30">
                            <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 dark:text-amber-300">
                              <ShieldAlert className="h-4 w-4" /> Price Pending (Custom High-Index Lens)
                            </div>
                            <div className="mt-2 flex items-center gap-2">
                              <input
                                type="number"
                                placeholder="Enter Lens Price (PKR)"
                                value={itemPrices[i] || ""}
                                onChange={(e) => setItemPrices({ ...itemPrices, [i]: e.target.value })}
                                className="w-44 rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-app-bg)] px-3 py-1 text-xs text-[color:var(--color-text-primary)]"
                              />
                              <Button variant="primary" className="text-xs" onClick={() => handleSetItemPrice(i)}>
                                Set Price
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-semibold">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                        {c?.priceAdded !== null && c?.priceAdded > 0 && (
                          <p className="text-[10px] text-[color:var(--color-text-tertiary)]">(includes Rs. {c.priceAdded} lens add-on)</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 space-y-2 border-t border-[color:var(--color-border)] pt-5 text-sm">
              <div className="flex justify-between"><span className="text-[color:var(--color-text-secondary)]">Subtotal</span><span>Rs. {order.subtotal?.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-[color:var(--color-text-secondary)]">Shipping</span><span>{order.shipping === 0 ? "Free" : `Rs. ${order.shipping}`}</span></div>
              {order.discount > 0 && <div className="flex justify-between text-[color:var(--color-accent-teal)]"><span>Discount</span><span>-Rs. {order.discount?.toLocaleString()}</span></div>}
              <div className="flex justify-between border-t border-[color:var(--color-border)] pt-2 text-base font-semibold"><span>Total</span><span>Rs. {order.total?.toLocaleString()}</span></div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-text-tertiary)]"><CreditCard className="h-3 w-3" /> Payment</div>
              <span className={cn("rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase", order.paymentType === "advance" ? "bg-purple-100 text-purple-800" : "bg-gray-100 text-gray-800")}>
                {order.paymentType || "full"}
              </span>
            </div>
            
            <p className="mt-2 text-sm font-medium text-[color:var(--color-text-primary)]">{getPaymentMethodLabel(order.paymentMethod)}</p>
            {order.paymentProof?.transactionId && (
              <p className="text-xs text-[color:var(--color-text-tertiary)]">Transaction: {order.paymentProof.transactionId}</p>
            )}

            {order.paymentType === "advance" && (
              <div className="mt-2 rounded-lg bg-[color:var(--color-surface-muted)] p-2 text-xs">
                <div className="flex justify-between"><span>Advance Expected:</span><span className="font-semibold">Rs. {Math.round(order.total / 2).toLocaleString()}</span></div>
                {order.paymentProof?.amountPaid && (
                  <div className="flex justify-between"><span>Amount Paid:</span><span className="font-semibold text-emerald-600">Rs. {order.paymentProof.amountPaid.toLocaleString()}</span></div>
                )}
              </div>
            )}

            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-[color:var(--color-text-tertiary)]">Verification Status:</span>
              <span className={cn("rounded-md px-2 py-0.5 text-xs font-semibold uppercase", paymentStatus === "approved" ? "bg-emerald-100 text-emerald-800" : paymentStatus === "rejected" ? "bg-rose-100 text-rose-800" : "bg-amber-100 text-amber-800")}>
                {paymentStatus}
              </span>
            </div>

            {order.paymentProof?.screenshotUrl && (
              <div className="mt-3 border-t border-[color:var(--color-border)] pt-3">
                <a href={order.paymentProof.screenshotUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-[color:var(--color-brand-primary)] hover:underline">
                  <ExternalLink className="h-3 w-3" /> View Payment Receipt Screenshot
                </a>
              </div>
            )}

            {paymentStatus === "pending" && order.paymentProof && (
              <div className="mt-4 space-y-2 border-t border-[color:var(--color-border)] pt-3">
                <p className="text-xs font-medium text-[color:var(--color-text-primary)]">Verify Payment:</p>
                <div className="flex gap-2">
                  <Button variant="primary" className="w-full text-xs" onClick={() => handleVerifyPayment("approve")}>
                    Approve
                  </Button>
                  <Button variant="outline" className="w-full text-xs text-rose-600 border-rose-300 hover:bg-rose-50" onClick={() => setShowRejectInput(!showRejectInput)}>
                    Reject
                  </Button>
                </div>
                {showRejectInput && (
                  <div className="mt-2 space-y-2">
                    <input
                      type="text"
                      placeholder="Reason for rejection..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-app-bg)] px-2.5 py-1 text-xs text-[color:var(--color-text-primary)]"
                    />
                    <Button variant="outline" className="w-full text-xs bg-rose-600 text-white" onClick={() => handleVerifyPayment("reject")}>
                      Confirm Rejection
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-4">
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-text-tertiary)]"><MapPin className="h-3 w-3" /> Shipping</div>
            <p className="mt-2 text-sm text-[color:var(--color-text-primary)] font-medium">{order.shippingAddress?.fullName || order.customerName}</p>
            <p className="text-xs text-[color:var(--color-text-secondary)]">{order.shippingAddress?.street}, {order.shippingAddress?.area}, {order.shippingAddress?.city}, {order.shippingAddress?.province}</p>
            <p className="mt-1 text-xs text-[color:var(--color-text-tertiary)]">Phone: {order.shippingAddress?.phone || order.customerPhone}</p>
          </div>

          <div className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-4">
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-text-tertiary)]"><Package className="h-3 w-3" /> Customer</div>
            <p className="mt-2 text-sm font-medium text-[color:var(--color-text-primary)]">{order.customerName}</p>
            <p className="text-xs text-[color:var(--color-text-tertiary)]">{order.customerEmail}<br />{order.customerPhone}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
