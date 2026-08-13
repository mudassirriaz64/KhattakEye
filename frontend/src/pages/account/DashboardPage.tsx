import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AccountLayout } from "@/components/account/AccountLayout";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useWishlistStore } from "@/lib/stores/wishlist-store";
import { getMyOrdersApi } from "@/lib/api/orders";
import { DashboardStatCards } from "@/components/account/DashboardStatCards";
import { DashboardRecentOrders } from "@/components/account/DashboardRecentOrders";
import { DashboardQuickActions } from "@/components/account/DashboardQuickActions";

const EASE = [0.22, 1, 0.36, 1] as const;

type OrderSummary = {
  id: string;
  orderNumber: string;
  date: string;
  status: string;
  total: number;
  items: number;
  image?: string | null;
};

type ApiOrder = {
  _id?: string;
  id?: string;
  orderNumber?: string;
  createdAt?: string;
  status?: string;
  total?: number;
  items?: Array<{ image?: string }>;
};

export function DashboardPage() {
  const { user } = useAuthStore();
  const wishlistItems = useWishlistStore((s) => s.items);
  const fetchWishlist = useWishlistStore((s) => s.fetchWishlist);

  const [orders, setOrders] = useState<OrderSummary[]>([]);

  useEffect(() => {
    fetchWishlist();
    getMyOrdersApi()
      .then((data) => {
        if (Array.isArray(data)) {
          const mapped: OrderSummary[] = (data as ApiOrder[]).map((o) => ({
            id: o._id || o.id || "",
            orderNumber: o.orderNumber || "",
            date: o.createdAt ? new Date(o.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
            status: o.status || "pending",
            total: o.total || 0,
            items: o.items ? o.items.length : 1,
            image: o.items?.[0]?.image || null,
          }));
          setOrders(mapped);
        }
      })
      .catch((err) => console.error("Failed to load dashboard orders:", err));
  }, [fetchWishlist]);

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status !== "delivered" && o.status !== "cancelled").length;
  const wishlistCount = wishlistItems.length;

  return (
    <AccountLayout>
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: EASE }}
      >
        <h2 className="font-display text-2xl text-[color:var(--color-text-primary)]">
          Hello, {user?.fullName?.split(" ")[0] || "there"} 👋
        </h2>
        <p className="mt-1 text-sm text-[color:var(--color-text-secondary)]">Here&apos;s your account overview.</p>
      </motion.div>

      <DashboardStatCards
        totalOrders={totalOrders}
        pendingOrders={pendingOrders}
        wishlistCount={wishlistCount}
      />

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <DashboardRecentOrders orders={orders} />
        <DashboardQuickActions />
      </div>
    </AccountLayout>
  );
}
