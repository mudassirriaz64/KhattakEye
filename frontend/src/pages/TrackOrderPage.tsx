import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, HeadphonesIcon, MessageCircle, Package } from "lucide-react";
import { mockOrder, type Order } from "@/lib/order-data";
import { TrackOrderSearch } from "@/components/order/TrackOrderSearch";
import { OrderTimeline } from "@/components/order/OrderTimeline";
import { Button } from "@/components/primitives/Button";
import { getOrderByIdApi } from "@/lib/api/orders";

export function TrackOrderPage() {
  const [searchParams] = useSearchParams();
  const initialId = searchParams.get("id") || "";
  const [tracked, setTracked] = useState(!!initialId);
  const [, setOrderId] = useState(initialId);
  const [order, setOrder] = useState<Order>(mockOrder);

  const fetchLiveOrder = (idToSearch: string) => {
    if (!idToSearch) return;
    getOrderByIdApi(idToSearch).then((data) => {
      if (data) {
        setOrder({
          orderNumber: data.orderNumber || idToSearch,
          estimatedDelivery: data.estimatedDelivery ? new Date(data.estimatedDelivery).toLocaleDateString() : "August 8, 2026",
          status: data.status || "pending",
          timeline: data.timeline && data.timeline.length > 0 ? data.timeline : mockOrder.timeline,
          items: data.items || []
        } as Order);
      }
    }).catch(() => {});
  };

  useEffect(() => {
    if (initialId) {
      fetchLiveOrder(initialId);
    }
  }, [initialId]);

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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
