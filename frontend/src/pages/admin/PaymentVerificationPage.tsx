import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Search, CheckCircle, XCircle, ExternalLink, ImageIcon, X, AlertCircle, RefreshCw } from "lucide-react";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { cn } from "@/lib/utils";
import { adminGetOrdersApi, adminVerifyPaymentApi } from "@/lib/api/admin";
import { getPaymentMethodLabel } from "@/lib/utils/enum-labels";

const methodColors: Record<string, string> = {
  "bank-transfer": "bg-[color:var(--color-accent-blue)]/10 text-[color:var(--color-accent-blue)]",
  jazzcash: "bg-rose-500/10 text-rose-600",
  easypaisa: "bg-emerald-500/10 text-emerald-600",
  cod: "bg-amber-500/10 text-amber-600",
};

type PaymentVerificationItem = {
  id: string;
  orderNumber: string;
  customer: string;
  email: string;
  phone: string;
  amount: number;
  method: string;
  transactionId: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
  screenshot?: string;
  notes?: string;
  rejectionReason?: string;
};

export function AdminPaymentVerificationPage() {
  const [payments, setPayments] = useState<PaymentVerificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedScreenshot, setSelectedScreenshot] = useState<{ url: string; orderNumber: string } | null>(null);
  
  // Rejection modal state
  const [rejectModalId, setRejectModalId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionError, setRejectionError] = useState("");

  const fetchPayments = () => {
    adminGetOrdersApi(1, 100)
      .then((data) => {
        if (data && Array.isArray(data.items)) {
          const items: PaymentVerificationItem[] = [];
          data.items.forEach((o: any) => {
            // Include orders that have payment proof or status payment-verification
            if (o.paymentProof || o.status === "payment-verification") {
              const proof = o.paymentProof || {};
              items.push({
                id: o._id || o.id,
                orderNumber: o.orderNumber || "",
                customer: o.customerName || "Customer",
                email: o.customerEmail || "",
                phone: o.customerPhone || "",
                amount: o.total || 0,
                method: o.paymentMethod || "bank-transfer",
                transactionId: proof.transactionId || "N/A",
                submittedAt: o.createdAt ? new Date(o.createdAt).toLocaleString() : "Recently",
                status: proof.status || (o.status === "confirmed" ? "approved" : "pending"),
                screenshot: proof.screenshotUrl || undefined,
                notes: proof.notes || undefined,
                rejectionReason: proof.rejectionReason || undefined
              });
            }
          });
          setPayments(items);
        }
      })
      .catch((err) => console.error("Failed to load payment verifications:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPayments();
    // Real-time zero-refresh polling sync every 8 seconds
    const interval = setInterval(fetchPayments, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await adminVerifyPaymentApi(id, "approve");
      fetchPayments();
    } catch (err) {
      console.error("Failed to approve payment:", err);
    }
  };

  const submitRejection = async () => {
    if (!rejectionReason.trim()) {
      setRejectionError("Please provide a reason for rejecting this payment screenshot.");
      return;
    }
    if (!rejectModalId) return;

    try {
      await adminVerifyPaymentApi(rejectModalId, "reject", rejectionReason.trim());
      setRejectModalId(null);
      setRejectionReason("");
      setRejectionError("");
      fetchPayments();
    } catch (err) {
      console.error("Failed to reject payment:", err);
    }
  };

  const filtered = payments.filter((p) => {
    const matchFilter = filter === "All" || p.status === filter.toLowerCase();
    const matchSearch = !search || p.orderNumber.toLowerCase().includes(search.toLowerCase()) || p.customer.toLowerCase().includes(search.toLowerCase()) || p.transactionId.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const pendingCount = payments.filter((p) => p.status === "pending").length;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-[color:var(--color-text-primary)] md:text-3xl">Payment Verification</h1>
          <p className="mt-0.5 text-sm text-[color:var(--color-text-secondary)]">{pendingCount} pending verifications (Live Sync)</p>
        </div>
        <button
          type="button"
          onClick={() => { setLoading(true); fetchPayments(); }}
          className="flex items-center gap-2 rounded-xl border border-[color:var(--color-border)] px-4 py-2 text-xs font-medium text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-muted)]"
        >
          <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} /> Refresh Live
        </button>
      </div>

      <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)]">
        <div className="flex flex-col gap-4 border-b border-[color:var(--color-border)] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--color-text-tertiary)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Order #, Customer, or TXN..."
              className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] py-2.5 pl-10 pr-4 text-sm text-[color:var(--color-text-primary)] placeholder:text-[color:var(--color-text-tertiary)] focus:border-[color:var(--color-accent-teal)] focus:outline-none"
            />
          </div>
          <div className="flex gap-1">
            {["All", "Pending", "Approved", "Rejected"].map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                  filter === f ? "bg-[color:var(--color-brand-primary)] text-white" : "bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)]"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3 p-4">
          {loading ? (
            <div className="py-16 text-center">
              <RefreshCw className="mx-auto h-7 w-7 animate-spin text-[color:var(--color-brand-primary)]" />
              <p className="mt-2 text-xs text-[color:var(--color-text-tertiary)]">Fetching live payment verifications...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center">
              <ShieldCheck className="mx-auto h-8 w-8 text-[color:var(--color-text-tertiary)]" />
              <p className="mt-2 text-sm text-[color:var(--color-text-secondary)]">No payment verifications found.</p>
            </div>
          ) : (
            <AnimatePresence>
              {filtered.map((pv, i) => (
                <motion.div key={pv.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-app-bg)] p-4">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[color:var(--color-surface-muted)]">
                        <ShieldCheck className="h-6 w-6 text-[color:var(--color-accent-teal)]" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[color:var(--color-text-primary)]">{pv.orderNumber}</p>
                        <p className="text-xs text-[color:var(--color-text-tertiary)]">{pv.customer} · {pv.email} · {pv.phone}</p>
                        <p className="mt-1 text-xs text-[color:var(--color-text-secondary)]">
                          <span className="font-medium">Rs. {pv.amount.toLocaleString()}</span> via{" "}
                          <span className={cn("rounded px-1.5 py-0.5 text-[10px] font-semibold", methodColors[pv.method] || "bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-tertiary)]")}>{getPaymentMethodLabel(pv.method)}</span>
                        </p>
                        <p className="mt-1 flex items-center gap-1.5 text-xs text-[color:var(--color-text-tertiary)]">
                          <ExternalLink className="h-3 w-3" /> TXN: <span className="font-mono text-[color:var(--color-text-primary)]">{pv.transactionId}</span>
                        </p>
                        <p className="mt-0.5 text-[10px] text-[color:var(--color-text-tertiary)]">{pv.submittedAt}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {pv.screenshot && (
                        <button
                          type="button"
                          onClick={() => setSelectedScreenshot({ url: pv.screenshot!, orderNumber: pv.orderNumber })}
                          className="flex items-center gap-1.5 rounded-lg border border-[color:var(--color-border)] px-3 py-1.5 text-xs font-medium text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-muted)]"
                        >
                          <ImageIcon className="h-4 w-4 text-[color:var(--color-accent-teal)]" /> View Receipt
                        </button>
                      )}

                      {pv.status === "pending" && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleApprove(pv.id)}
                            className="flex items-center gap-1 rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-600 transition-colors hover:bg-emerald-500/20"
                          >
                            <CheckCircle className="h-3.5 w-3.5" /> Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setRejectModalId(pv.id);
                              setRejectionReason("");
                              setRejectionError("");
                            }}
                            className="flex items-center gap-1 rounded-lg bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-500/20"
                          >
                            <XCircle className="h-3.5 w-3.5" /> Reject
                          </button>
                        </>
                      )}
                      {pv.status !== "pending" && <StatusBadge status={pv.status} />}
                    </div>
                  </div>
                  {pv.notes && <p className="mt-2 text-xs text-[color:var(--color-text-secondary)] italic">Note: {pv.notes}</p>}
                  {pv.rejectionReason && (
                    <p className="mt-2 text-xs font-medium text-red-600 bg-red-50 dark:bg-red-950/20 p-2 rounded-lg">
                      Rejection Reason: {pv.rejectionReason}
                    </p>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Mandatory Rejection Modal */}
      {rejectModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[color:var(--color-border)] pb-4">
              <h3 className="font-display text-lg font-bold text-red-600 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" /> Reject Payment Proof
              </h3>
              <button type="button" onClick={() => setRejectModalId(null)} className="rounded-lg p-1 text-[color:var(--color-text-tertiary)] hover:bg-[color:var(--color-surface-muted)]">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4 space-y-3">
              <p className="text-xs text-[color:var(--color-text-secondary)]">
                Please enter a clear reason for rejecting this payment screenshot. The customer will be able to read this reason and resubmit a new proof.
              </p>
              <textarea
                value={rejectionReason}
                onChange={(e) => {
                  setRejectionReason(e.target.value);
                  setRejectionError("");
                }}
                placeholder="e.g. Transaction ID does not match account records, or receipt image is unreadable..."
                rows={3}
                className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-app-bg)] p-3 text-sm text-[color:var(--color-text-primary)] placeholder:text-[color:var(--color-text-tertiary)] focus:border-red-500 focus:outline-none"
              />
              {rejectionError && <p className="text-xs font-medium text-red-500">{rejectionError}</p>}
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setRejectModalId(null)}
                className="rounded-xl border border-[color:var(--color-border)] px-4 py-2 text-xs font-medium text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-muted)]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submitRejection}
                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Screenshot Lightbox Preview Modal */}
      {selectedScreenshot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4" onClick={() => setSelectedScreenshot(null)}>
          <div className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-2xl bg-black p-2" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-2 text-white border-b border-stone-800">
              <span className="text-xs font-semibold">Payment Receipt — {selectedScreenshot.orderNumber}</span>
              <button type="button" onClick={() => setSelectedScreenshot(null)} className="rounded-lg p-1 text-stone-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <img src={selectedScreenshot.url} alt="Receipt preview" className="max-h-[75vh] w-auto rounded-lg object-contain mx-auto mt-2" />
          </div>
        </div>
      )}
    </div>
  );
}

