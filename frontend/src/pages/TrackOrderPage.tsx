import { useState, useEffect, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, HeadphonesIcon, MessageCircle, Package, Upload } from "lucide-react";
import { mockOrder, type Order } from "@/lib/order-data";
import { TrackOrderSearch } from "@/components/order/TrackOrderSearch";
import { OrderTimeline } from "@/components/order/OrderTimeline";
import { Button } from "@/components/primitives/Button";
import { getOrderByIdApi, resubmitPaymentProofApi } from "@/lib/api/orders";

export function TrackOrderPage() {
  const [searchParams] = useSearchParams();
  const initialId = searchParams.get("id") || "";
  const [tracked, setTracked] = useState(!!initialId);
  const [orderId, setOrderId] = useState(initialId);
  const [order, setOrder] = useState<Order & { paymentProof?: any }>(mockOrder);

  // Resubmit modal state
  const [showResubmitModal, setShowResubmitModal] = useState(false);
  const [resubmitFile, setResubmitFile] = useState<File | null>(null);
  const [resubmitScreenshot, setResubmitScreenshot] = useState<string | null>(null);
  const [resubmitTxnId, setResubmitTxnId] = useState("");
  const [resubmitting, setResubmitting] = useState(false);
  const [resubmitError, setResubmitError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchLiveOrder = (idToSearch: string) => {
    if (!idToSearch) return;
    getOrderByIdApi(idToSearch).then((data) => {
      if (data) {
        setOrder({
          orderNumber: data.orderNumber || idToSearch,
          estimatedDelivery: data.estimatedDelivery ? new Date(data.estimatedDelivery).toLocaleDateString() : "August 8, 2026",
          status: data.status || "pending",
          timeline: data.timeline && data.timeline.length > 0 ? data.timeline : mockOrder.timeline,
          items: data.items || [],
          paymentProof: data.paymentProof || undefined
        } as Order & { paymentProof?: any });
      }
    }).catch(() => {});
  };

  useEffect(() => {
    if (initialId) {
      fetchLiveOrder(initialId);
    }
  }, [initialId]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setResubmitError("");
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setResubmitError("Image size exceeds maximum 10MB limit.");
        return;
      }
      setResubmitFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setResubmitScreenshot(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleResubmitSubmit = async () => {
    if (!resubmitFile && !resubmitScreenshot) {
      setResubmitError("Please select a new payment receipt image.");
      return;
    }

    setResubmitting(true);
    setResubmitError("");
    try {
      const payload = resubmitFile || resubmitScreenshot!;
      await resubmitPaymentProofApi(order.orderNumber, payload, resubmitTxnId);
      setShowResubmitModal(false);
      setResubmitScreenshot(null);
      setResubmitFile(null);
      setResubmitTxnId("");
      fetchLiveOrder(order.orderNumber);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Failed to resubmit payment proof";
      setResubmitError(msg);
    } finally {
      setResubmitting(false);
    }
  };

  const handleSearch = (id: string, phone: string) => {
    const query = id || phone;
    setOrderId(query);
    setTracked(true);
    fetchLiveOrder(query);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 md:px-8">
      <AnimatePresence mode="wait">
        {!tracked ? (
          <motion.div key="search" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <TrackOrderSearch onSearch={handleSearch} />
          </motion.div>
        ) : (
          <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <button type="button" onClick={() => setTracked(false)} className="inline-flex items-center gap-2 text-sm text-[color:var(--color-text-secondary)] transition-colors hover:text-[color:var(--color-text-primary)]">
                  <ArrowLeft className="h-4 w-4" /> Track Another Order
                </button>
                <h1 className="mt-3 font-display text-3xl text-[color:var(--color-text-primary)] md:text-4xl">Order Tracking</h1>
                <p className="mt-1 text-sm text-[color:var(--color-text-secondary)]">
                  {order.orderNumber} — Estimated delivery: <span className="font-medium text-[color:var(--color-text-primary)]">{order.estimatedDelivery}</span>
                </p>
              </div>
              <div className="hidden sm:block">
                <div className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-6 py-3 text-center">
                  <p className="text-xs text-[color:var(--color-text-tertiary)]">Order Status</p>
                  <p className="mt-0.5 text-sm font-semibold capitalize text-[color:var(--color-accent-teal)]">{order.status.replace(/-/g, " ")}</p>
                </div>
              </div>
            </div>

            {/* Rejection Alert Banner & Resubmit Trigger */}
            {order.paymentProof?.status === "rejected" && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-red-600 dark:text-red-400">Payment Proof Rejected by Admin</h3>
                    <p className="mt-1 text-xs text-red-700 dark:text-red-300">
                      Reason: <span className="font-semibold">{order.paymentProof.rejectionReason || "Verification failed. Please upload a clear receipt."}</span>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowResubmitModal(true)}
                    className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-red-700"
                  >
                    <Upload className="h-4 w-4" /> Resubmit Receipt
                  </button>
                </div>
              </motion.div>
            )}

            <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 md:p-8">
              <OrderTimeline entries={order.timeline} currentStatus={order.status} />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[color:var(--color-surface-muted)]">
                  <HeadphonesIcon className="h-6 w-6 text-[color:var(--color-accent-teal)]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[color:var(--color-text-primary)]">Need Help?</p>
                  <p className="text-xs text-[color:var(--color-text-secondary)]">Our support team is here to assist you.</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" iconLeft={<MessageCircle className="h-4 w-4" />}>Live Chat</Button>
                <Button variant="primary">Contact Support</Button>
              </div>
            </div>

            <Link to="/shop">
              <Button variant="ghost" iconLeft={<Package className="h-4 w-4" />}>Continue Shopping</Button>
            </Link>

            {/* Resubmit Payment Modal */}
            {showResubmitModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                <div className="w-full max-w-lg rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-[color:var(--color-border)] pb-4">
                    <h3 className="font-display text-lg font-bold text-[color:var(--color-text-primary)]">Resubmit Payment Proof</h3>
                    <button type="button" onClick={() => setShowResubmitModal(false)} className="rounded-lg p-1 text-[color:var(--color-text-tertiary)] hover:bg-[color:var(--color-surface-muted)]">
                      ✕
                    </button>
                  </div>

                  <div className="mt-4 space-y-4">
                    {resubmitError && <p className="text-xs font-medium text-red-500 bg-red-50 p-2 rounded-lg">{resubmitError}</p>}
                    
                    <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-[color:var(--color-border)] p-6 bg-[color:var(--color-app-bg)]">
                      {resubmitScreenshot ? (
                        <div className="relative">
                          <img src={resubmitScreenshot} alt="Receipt preview" className="max-h-36 rounded-lg object-contain" />
                          <button type="button" onClick={() => { setResubmitScreenshot(null); setResubmitFile(null); }} className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs text-white">
                            ✕
                          </button>
                        </div>
                      ) : (
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center gap-2 text-sm text-[color:var(--color-text-tertiary)] hover:text-[color:var(--color-accent-teal)]">
                          <Upload className="h-8 w-8" />
                          <span className="font-medium">Upload New Payment Receipt</span>
                          <span className="text-xs">PNG, JPG (max 10MB)</span>
                        </button>
                      )}
                      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[color:var(--color-text-tertiary)] mb-1">Transaction ID (Optional)</label>
                      <input
                        type="text"
                        value={resubmitTxnId}
                        onChange={(e) => setResubmitTxnId(e.target.value)}
                        placeholder="Enter transaction / reference ID"
                        className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-app-bg)] p-3 text-sm text-[color:var(--color-text-primary)]"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end gap-2">
                    <button type="button" onClick={() => setShowResubmitModal(false)} className="rounded-xl border border-[color:var(--color-border)] px-4 py-2 text-xs font-medium">Cancel</button>
                    <button type="button" onClick={handleResubmitSubmit} disabled={resubmitting} className="rounded-xl bg-[color:var(--color-brand-primary)] px-5 py-2 text-xs font-semibold text-white hover:bg-black">
                      {resubmitting ? "Uploading..." : "Submit Receipt"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
