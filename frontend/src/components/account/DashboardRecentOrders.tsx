import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Package, ChevronRight } from "lucide-react";
import { Button } from "@/components/primitives/Button";
import { statusColorMap, statusLabelMap, type OrderStatus } from "@/lib/order-data";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

type OrderItemSummary = {
  id: string;
  orderNumber: string;
  date: string;
  status: string;
  total: number;
  items: number;
  image?: string | null;
};

type Props = {
  orders: OrderItemSummary[];
};

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const rowVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: EASE } },
};

export function DashboardRecentOrders({ orders }: Props) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg text-[color:var(--color-text-primary)]">Recent Orders</h3>
        <Link to="/account/orders" className="text-xs font-medium text-[color:var(--color-brand-primary)] hover:underline">
          View All
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="mt-4 rounded-xl bg-[color:var(--color-surface-muted)] p-8 text-center">
          <Package className="mx-auto h-8 w-8 text-[color:var(--color-text-tertiary)]" />
          <p className="mt-3 text-sm text-[color:var(--color-text-secondary)]">No orders yet. Start shopping to see your orders here.</p>
          <Link to="/shop">
            <Button variant="primary" className="mt-4 text-xs">Explore Collection</Button>
          </Link>
        </div>
      ) : (
        <motion.div
          className="mt-4 space-y-3"
          variants={listVariants}
          initial="hidden"
          animate="show"
        >
          {orders.slice(0, 3).map((order) => {
            const statusKey = order.status as OrderStatus;
            const badgeColor = statusColorMap[statusKey] || "bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-tertiary)]";
            const badgeLabel = statusLabelMap[statusKey] || order.status;

            return (
              <motion.div key={order.id} variants={rowVariants}>
                <Link
                  to={`/account/orders/${order.id}`}
                  className="group flex items-center gap-4 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-4 shadow-sm transition-all duration-200 hover:bg-[color:var(--color-surface-muted)] hover:shadow-[var(--shadow-soft)]"
                >
                  {order.image ? (
                    <img
                      src={order.image}
                      alt={order.orderNumber}
                      loading="lazy"
                      className="h-11 w-11 shrink-0 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[color:var(--color-surface-muted)]">
                      <Package className="h-5 w-5 text-[color:var(--color-text-tertiary)]" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[color:var(--color-text-primary)]">{order.orderNumber}</p>
                    <p className="text-xs text-[color:var(--color-text-tertiary)]">
                      {order.date} · {order.items} item{order.items > 1 ? "s" : ""}
                    </p>
                  </div>
                  <span className={cn("rounded-full px-2.5 py-1 text-[10px] font-semibold", badgeColor)}>
                    {badgeLabel}
                  </span>
                  <span className="text-sm font-semibold tabular-nums text-[color:var(--color-text-primary)]">
                    Rs. {order.total.toLocaleString()}
                  </span>
                  <ChevronRight className="h-4 w-4 text-[color:var(--color-text-tertiary)] transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
