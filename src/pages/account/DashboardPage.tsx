import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, Package, Heart, Gift, ChevronRight, Eye, Star } from "lucide-react";
import { AccountLayout } from "@/components/account/AccountLayout";
import { recentOrders, mockReviews } from "@/lib/account-data";
import { allProducts } from "@/lib/shop-data";
import { Button } from "@/components/primitives/Button";
import { useAuthStore } from "@/lib/stores/auth-store";

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
          <div className="mt-4 space-y-3">
            {recentOrders.slice(0, 3).map((order) => (
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
          <div className="mt-4 space-y-3">
            {mockReviews.slice(0, 2).map((rev) => (
              <div key={rev.id} className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-4">
                <div className="flex items-center gap-2.5">
                  <img src={rev.productImage} alt="" className="h-10 w-10 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-[color:var(--color-text-primary)]">{rev.productName}</p>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg key={i} className={`h-3 w-3 ${i < rev.rating ? "text-amber-400" : "text-[color:var(--color-text-tertiary)]"}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AccountLayout>
  );
}
