import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Package, Truck, CreditCard, MapPin, FileText, Printer, Download, CheckCircle, XCircle, MessageSquare } from "lucide-react";
import { adminOrders } from "@/lib/admin-data";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/primitives/Button";
import { cn } from "@/lib/utils";
import { adminUpdateOrderStatusApi } from "@/lib/api/admin";
import { getOrderByIdApi } from "@/lib/api/orders";

const statusFlow = ["pending", "processing", "shipped", "delivered", "cancelled"];

export function AdminOrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<any>(adminOrders[0]);
  const [currentStatus, setCurrentStatus] = useState("pending");
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  useEffect(() => {
    if (id) {
      getOrderByIdApi(id).then((data) => {
        if (data) {
          setOrder({
            id: data._id || id,
            orderNumber: data.orderNumber || id,
            customer: {
              name: data.customerName || "Customer",
              email: data.customerEmail || "customer@example.com",
              phone: data.customerPhone || ""
            },
            shippingAddress: data.shippingAddress ? `${data.shippingAddress.street}, ${data.shippingAddress.city}` : "Address",
            items: data.items || [],
            total: data.total || 0,
            paymentMethod: data.paymentMethod || "COD",
            status: data.status || "pending",
            date: data.createdAt ? new Date(data.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
            timeline: data.timeline || adminOrders[0].timeline
          });
          setCurrentStatus(data.status || "pending");
        }
      }).catch(() => {});
    }
  }, [id]);

  const updateStatus = async (newStatus: string) => {
    setCurrentStatus(newStatus);
    setShowStatusMenu(false);
    if (id) {
      try {
        await adminUpdateOrderStatusApi(id, newStatus);
      } catch (err) {
        console.error("Failed to update order status:", err);
      }
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link to="/admin/orders" className="inline-flex items-center gap-1.5 text-xs text-[color:var(--color-text-tertiary)] hover:text-[color:var(--color-text-primary)]">
            <ArrowLeft className="h-3 w-3" /> Back to Orders
          </Link>
          <h1 className="mt-2 font-display text-2xl text-[color:var(--color-text-primary)] md:text-3xl">{order.orderNumber}</h1>
          <p className="text-sm text-[color:var(--color-text-secondary)]">{order.date} · {order.customer.name}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" iconLeft={<Printer className="h-4 w-4" />} className="text-xs">Print</Button>
          <Button variant="outline" iconLeft={<Download className="h-4 w-4" />} className="text-xs">Invoice</Button>
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
              {order.timeline.map((entry, i) => {
                const isCurrent = entry.status === currentStatus;
                const isPast = entry.completed || statusFlow.indexOf(entry.status) < statusFlow.indexOf(currentStatus);
                return (
                  <div key={entry.status} className="relative flex gap-4 pb-6 last:pb-0">
                    {i < order.timeline.length - 1 && (
                      <div className={cn("absolute left-[15px] top-[30px] h-full w-0.5", isPast ? "bg-[color:var(--color-accent-teal)]" : "bg-[color:var(--color-border)]")} />
                    )}
                    <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full", isPast || isCurrent ? "bg-[color:var(--color-accent-teal)]" : "bg-[color:var(--color-surface-muted)]")}>
                      {isPast || isCurrent ? <CheckCircle className="h-4 w-4 text-white" /> : <div className="h-2.5 w-2.5 rounded-full bg-[color:var(--color-text-tertiary)]" />}
                    </div>
                    <div className="min-w-0 flex-1 pt-1">
                      <p className={cn("text-sm font-medium", isCurrent ? "text-[color:var(--color-accent-teal)]" : "text-[color:var(--color-text-primary)]")}>{entry.label}</p>
                      <p className="mt-0.5 text-xs text-[color:var(--color-text-secondary)]">{entry.description}</p>
                      <p className="mt-0.5 text-[10px] text-[color:var(--color-text-tertiary)]">{entry.date}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-5">
            <h3 className="font-display text-base text-[color:var(--color-text-primary)]">Order Items</h3>
            <div className="mt-4 space-y-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-4 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-app-bg)] p-3">
                  <img src={item.image} alt={item.name} className="h-14 w-14 shrink-0 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[color:var(--color-text-primary)]">{item.name}</p>
                    <p className="text-xs text-[color:var(--color-text-tertiary)]">{item.brand} · {item.color} · Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 space-y-2 border-t border-[color:var(--color-border)] pt-5 text-sm">
              <div className="flex justify-between"><span className="text-[color:var(--color-text-secondary)]">Subtotal</span><span>Rs. {order.subtotal.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-[color:var(--color-text-secondary)]">Shipping</span><span>{order.shipping === 0 ? "Free" : `Rs. ${order.shipping}`}</span></div>
              {order.discount > 0 && <div className="flex justify-between text-[color:var(--color-accent-teal)]"><span>Discount</span><span>-Rs. {order.discount.toLocaleString()}</span></div>}
              <div className="flex justify-between border-t border-[color:var(--color-border)] pt-2 text-base font-semibold"><span>Total</span><span>Rs. {order.total.toLocaleString()}</span></div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-4">
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-text-tertiary)]"><CreditCard className="h-3 w-3" /> Payment</div>
            <p className="mt-2 text-sm font-medium text-[color:var(--color-text-primary)]">{order.paymentMethod}</p>
            <p className="text-xs text-[color:var(--color-text-tertiary)]">Transaction: {order.transactionId}</p>
            <div className="mt-2"><StatusBadge status={order.paymentStatus} /></div>
          </div>
          <div className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-4">
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-text-tertiary)]"><MapPin className="h-3 w-3" /> Shipping</div>
            <p className="mt-2 text-sm text-[color:var(--color-text-primary)]">{order.shippingAddress}</p>
            <p className="mt-1 text-xs text-[color:var(--color-text-tertiary)]">Est. delivery: {order.estimatedDelivery}</p>
          </div>
          <div className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-4">
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-text-tertiary)]"><Package className="h-3 w-3" /> Customer</div>
            <p className="mt-2 text-sm font-medium text-[color:var(--color-text-primary)]">{order.customer.name}</p>
            <p className="text-xs text-[color:var(--color-text-tertiary)]">{order.customer.email}<br />{order.customer.phone}</p>
          </div>
          <div className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-4">
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-text-tertiary)]"><MessageSquare className="h-3 w-3" /> Notes</div>
            <p className="mt-2 text-sm text-[color:var(--color-text-secondary)]">{order.notes || "No notes for this order."}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
