import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Search, CheckCircle, XCircle, Eye, ExternalLink, ImageIcon } from "lucide-react";
import { paymentVerifications, type PaymentVerification } from "@/lib/admin-data";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { cn } from "@/lib/utils";

const methodColors: Record<string, string> = {
  "bank-transfer": "bg-[color:var(--color-accent-blue)]/10 text-[color:var(--color-accent-blue)]",
  jazzcash: "bg-rose-500/10 text-rose-600",
  easypaisa: "bg-emerald-500/10 text-emerald-600",
};

export function AdminPaymentVerificationPage() {
  const [payments, setPayments] = useState(paymentVerifications);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedPayment, setSelectedPayment] = useState<PaymentVerification | null>(null);
  const [confirmAction, setConfirmAction] = useState<{ id: string; action: "approved" | "rejected" } | null>(null);

  const filtered = payments.filter((p) => {
    const matchFilter = filter === "All" || p.status === filter.toLowerCase();
    const matchSearch = !search || p.orderNumber.toLowerCase().includes(search.toLowerCase()) || p.customer.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const handleAction = (id: string, action: "approved" | "rejected") => {
    setPayments((prev) => prev.map((p) => p.id === id ? { ...p, status: action } : p));
    setConfirmAction(null);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl text-[color:var(--color-text-primary)] md:text-3xl">Payment Verification</h1>
        <p className="mt-0.5 text-sm text-[color:var(--color-text-secondary)]">{payments.filter((p) => p.status === "pending").length} pending verifications</p>
      </div>

      <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)]">
        <div className="flex flex-col gap-4 border-b border-[color:var(--color-border)] p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--color-text-tertiary)]" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] py-2.5 pl-10 pr-4 text-sm text-[color:var(--color-text-primary)] placeholder:text-[color:var(--color-text-tertiary)] focus:border-[color:var(--color-accent-teal)] focus:outline-none focus:ring-4 focus:ring-[color:var(--color-focus-ring)]" />
          </div>
          {["All", "Pending", "Approved", "Rejected"].map((f) => (
            <button key={f} type="button" onClick={() => setFilter(f)} className={cn("rounded-lg px-3 py-1.5 text-xs font-medium transition-colors", filter === f ? "bg-[color:var(--color-brand-primary)] text-white" : "bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)]")}>{f}</button>
          ))}
        </div>

        <div className="space-y-3 p-4">
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
                      <p className="text-xs text-[color:var(--color-text-tertiary)]">{pv.customer} · {pv.email}</p>
                      <p className="mt-1 text-xs text-[color:var(--color-text-secondary)]">
                        <span className="font-medium">Rs. {pv.amount.toLocaleString()}</span> via{" "}
                        <span className={cn("rounded px-1.5 py-0.5 text-[10px] font-medium", methodColors[pv.method])}>{pv.method.replace("-", " ")}</span>
                      </p>
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-[color:var(--color-text-tertiary)]">
                        <ExternalLink className="h-3 w-3" /> TXN: {pv.transactionId}
                      </p>
                      <p className="mt-0.5 text-[10px] text-[color:var(--color-text-tertiary)]">{pv.submittedAt}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {pv.status === "pending" && (
                      <>
                        <button type="button" onClick={() => setConfirmAction({ id: pv.id, action: "approved" })} className="flex items-center gap-1 rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-600 transition-colors hover:bg-emerald-500/20">
                          <CheckCircle className="h-3.5 w-3.5" /> Approve
                        </button>
                        <button type="button" onClick={() => setConfirmAction({ id: pv.id, action: "rejected" })} className="flex items-center gap-1 rounded-lg bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-500/20">
                          <XCircle className="h-3.5 w-3.5" /> Reject
                        </button>
                      </>
                    )}
                    {pv.status !== "pending" && <StatusBadge status={pv.status} />}
                    {pv.screenshot && (
                      <button type="button" onClick={() => setSelectedPayment(pv)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[color:var(--color-text-tertiary)] hover:bg-[color:var(--color-surface-muted)]">
                        <ImageIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
                {pv.notes && <p className="mt-2 text-xs text-[color:var(--color-text-secondary)] italic">Note: {pv.notes}</p>}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <ConfirmModal open={!!confirmAction} onClose={() => setConfirmAction(null)} onConfirm={() => confirmAction && handleAction(confirmAction.id, confirmAction.action)} title={confirmAction?.action === "approved" ? "Approve Payment" : "Reject Payment"} message={confirmAction?.action === "approved" ? "This will mark the payment as verified and update the order status." : "This will reject the payment. The customer will be notified."} confirmLabel={confirmAction?.action === "approved" ? "Approve" : "Reject"} variant={confirmAction?.action === "approved" ? "primary" : "danger"} />
    </div>
  );
}
