import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ShoppingBag, Package, Heart, Gift, ChevronRight, Eye, Star } from "lucide-react";
import { AccountLayout } from "@/components/account/AccountLayout";
import { Button } from "@/components/primitives/Button";
import { useAuthStore } from "@/lib/stores/auth-store";
import { getMyOrdersApi } from "@/lib/api/orders";

const cards = [
  { label: "Total Orders", value: "3", icon: ShoppingBag, color: "text-[color:var(--color-accent-blue)]", bg: "bg-[color:var(--color-accent-blue)]/10" },
  { label: "Pending Orders", value: "1", icon: Package, color: "text-amber-500", bg: "bg-amber-500/10" },
  { label: "Wishlist Items", value: "6", icon: Heart, color: "text-rose-500", bg: "bg-rose-500/10" },
  { label: "Reward Points", value: "2,450", icon: Gift, color: "text-[color:var(--color-accent-teal)]", bg: "bg-[color:var(--color-accent-teal)]/10" },
];

const statusColor: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-600",
  processing: "bg-[color:var(--color-accent-blue)]/10 text-[color:var(--color-accent-blue)]",
  shipped: "bg-[color:var(--color-accent-teal)]/10 text-[color:var(--color-accent-teal)]",
  delivered: "bg-emerald-500/10 text-emerald-600",
  cancelled: "bg-red-500/10 text-red-600",
};

export function DashboardPage() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    getMyOrdersApi().then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        const mapped = data.map((o: any) => ({
          id: o._id,
          orderNumber: o.orderNumber,
          date: o.createdAt ? new Date(o.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
          status: o.status || "pending",
          total: o.total || 0,
          items: o.items ? o.items.length : 1,
        }));
        setOrders(mapped);
      }
    }).catch(() => {});
  }, []);

  return (
    <AccountLayout>
      <div className="mb-6">
        <h2 className="font-display text-2xl text-[color:var(--color-text-primary)]">Hello, {user?.fullName?.split(" ")[0] || "there"} 👋</h2>
        <p className="mt-1 text-sm text-[color:var(--color-text-secondary)]">Here&apos;s your account overview.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-5 backdrop-blur-2xl"
          >
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.bg}`}>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </div>
            <p className="mt-4 text-2xl font-bold text-[color:var(--color-text-primary)]">{card.value}</p>
            <p className="text-xs text-[color:var(--color-text-tertiary)]">{card.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg text-[color:var(--color-text-primary)]">Recent Orders</h3>
            <Link to="/account/orders" className="text-xs font-medium text-[color:var(--color-accent-teal)] hover:underline">View All</Link>
          </div>
          {orders.length === 0 ? (
            <div className="mt-4 rounded-xl border border-dashed border-[color:var(--color-border)] p-8 text-center">
              <Package className="mx-auto h-8 w-8 text-[color:var(--color-text-tertiary)]" />
              <p className="mt-3 text-sm text-[color:var(--color-text-secondary)]">No orders yet. Start shopping to see your orders here.</p>
              <Link to="/shop"><Button variant="primary" className="mt-4">Explore Collection</Button></Link>
            </div>
          ) : (
          <div className="mt-4 space-y-3">
            {orders.slice(0, 3).map((order) => (
              <Link key={order.id} to={`/account/orders?id=${order.orderNumber}`} className="flex items-center gap-4 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-4 transition-colors hover:bg-[color:var(--color-surface-muted)]">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[color:var(--color-surface-muted)]">
                  <Package className="h-5 w-5 text-[color:var(--color-text-tertiary)]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-[color:var(--color-text-primary)]">{order.orderNumber}</p>
                  <p className="text-xs text-[color:var(--color-text-tertiary)]">{order.date} · {order.items} item{order.items > 1 ? "s" : ""}</p>
                </div>
                <span className={`rounded-lg px-2.5 py-1 text-[10px] font-semibold capitalize ${statusColor[order.status] || "bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-tertiary)]"}`}>{order.status}</span>
                <span className="text-sm font-semibold text-[color:var(--color-text-primary)]">Rs. {order.total.toLocaleString()}</span>
                <ChevronRight className="h-4 w-4 text-[color:var(--color-text-tertiary)]" />
              </Link>
            ))}
          </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg text-[color:var(--color-text-primary)]">Quick Actions</h3>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Link to="/shop" className="flex flex-col items-center gap-2 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-4 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]">
              <ShoppingBag className="h-5 w-5 text-[color:var(--color-accent-teal)]" />
              <span className="text-[11px] font-medium text-[color:var(--color-text-secondary)]">Shop</span>
            </Link>
            <Link to="/account/wishlist" className="flex flex-col items-center gap-2 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-4 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]">
              <Heart className="h-5 w-5 text-rose-500" />
              <span className="text-[11px] font-medium text-[color:var(--color-text-secondary)]">Wishlist</span>
            </Link>
            <Link to="/account/reviews" className="flex flex-col items-center gap-2 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-4 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]">
              <Star className="h-5 w-5 text-amber-500" />
              <span className="text-[11px] font-medium text-[color:var(--color-text-secondary)]">Reviews</span>
            </Link>
            <Link to="/account/settings" className="flex flex-col items-center gap-2 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-4 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]">
              <Eye className="h-5 w-5 text-[color:var(--color-accent-blue)]" />
              <span className="text-[11px] font-medium text-[color:var(--color-text-secondary)]">Settings</span>
            </Link>
          </div>

          <h3 className="mt-8 font-display text-lg text-[color:var(--color-text-primary)]">Recent Reviews</h3>
          <div className="mt-4 rounded-xl border border-dashed border-[color:var(--color-border)] p-6 text-center">
            <Star className="mx-auto h-6 w-6 text-[color:var(--color-text-tertiary)]" />
            <p className="mt-2 text-xs text-[color:var(--color-text-secondary)]">No reviews yet. Your reviews will appear here.</p>
          </div>
        </div>
      </div>
    </AccountLayout>
  );
}
