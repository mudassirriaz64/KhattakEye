import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  DollarSign, ShoppingCart, Package, AlertTriangle, Plus, Settings, Users, Activity, ShoppingBag
} from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";
import { DonutChart } from "@/components/admin/AdminCharts";
import {
  adminGetDashboardStatsApi,
  adminGetOrdersApi,
  adminGetProductsApi,
  adminGetUsersApi
} from "@/lib/api/admin";
import { resolveCloudinaryUrl, productImageFallback } from "@/lib/api/products";

type LiveOrder = {
  id: string;
  orderNumber: string;
  customer: string;
  total: number;
  status: string;
  date: string;
};

type LiveCustomer = {
  id: string;
  name: string;
  email: string;
  joined: string;
};

type LiveProduct = {
  id: string;
  name: string;
  sales: number;
  revenue: number;
  image: string;
};

type LiveActivity = {
  id: string;
  type: string;
  title: string;
  timestamp: string;
};

const categoryColors: Record<string, string> = {
  Sunglasses: "var(--color-brand-primary)",
  Eyeglasses: "var(--color-accent-teal)",
  "Contact Lenses": "var(--color-accent-blue)",
  Accessories: "#f59e0b",
  Other: "var(--color-brand-soft)",
};

const statusBadgeColors: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-600",
  "pending-quote": "bg-purple-500/10 text-purple-600",
  "payment-verification": "bg-blue-500/10 text-blue-600",
  confirmed: "bg-teal-500/10 text-teal-600",
  processing: "bg-indigo-500/10 text-indigo-600",
  packed: "bg-yellow-500/10 text-yellow-600",
  shipped: "bg-cyan-500/10 text-cyan-600",
  "out-for-delivery": "bg-emerald-500/10 text-emerald-600",
  delivered: "bg-emerald-600/10 text-emerald-700",
  cancelled: "bg-rose-500/10 text-rose-600",
};

export function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalProducts: 0,
    lowStockProducts: 0
  });
  const [liveRecentOrders, setLiveRecentOrders] = useState<LiveOrder[]>([]);
  const [liveCustomers, setLiveCustomers] = useState<LiveCustomer[]>([]);
  const [liveTopProducts, setLiveTopProducts] = useState<LiveProduct[]>([]);
  const [liveActivity, setLiveActivity] = useState<LiveActivity[]>([]);
  const [computedCategoryData, setComputedCategoryData] = useState<
    { label: string; value: number; color: string }[]
  >([]);

  useEffect(() => {
    // 1. Dashboard metrics
    adminGetDashboardStatsApi().then((data) => {
      if (data) {
        setStats({
          totalRevenue: data.totalRevenue || 0,
          totalOrders: data.totalOrders || 0,
          pendingOrders: data.pendingOrders || 0,
          totalProducts: data.totalProducts || 0,
          lowStockProducts: data.lowStockProducts || 0
        });
      }
    }).catch(() => {});

    // 2. Recent orders & activity feed building
    adminGetOrdersApi(1, 5).then((data) => {
      if (data && data.items) {
        const formattedOrders: LiveOrder[] = data.items.map((o: { _id?: string; id?: string; orderNumber?: string; customerName?: string; total?: number; status?: string; createdAt?: string }) => ({
          id: o._id || o.id || "",
          orderNumber: o.orderNumber || "KT-ORDER",
          customer: o.customerName || "Customer",
          total: o.total || 0,
          status: o.status || "pending",
          date: o.createdAt ? new Date(o.createdAt).toLocaleDateString() : "Recent"
        }));
        setLiveRecentOrders(formattedOrders);

        // Build live activity feed from order events
        const activities: LiveActivity[] = data.items.map((o: { _id?: string; orderNumber?: string; customerName?: string; status?: string; createdAt?: string }) => ({
          id: `act-${o._id}`,
          type: "order",
          title: `Order ${o.orderNumber || ''} placed by ${o.customerName || 'Customer'} (${o.status || 'pending'})`,
          timestamp: o.createdAt ? new Date(o.createdAt).toLocaleDateString() : "Recent"
        }));
        setLiveActivity(activities);
      }
    }).catch(() => {});

    // 3. Products & Top Selling Products
    adminGetProductsApi(1, 100).then((data) => {
      if (data && Array.isArray(data.items)) {
        // Category Share
        const counts: Record<string, number> = {};
        data.items.forEach((p: { category?: unknown }) => {
          const catName = typeof p.category === "object" && p.category !== null ? (p.category as { name?: string }).name || "Other" : String(p.category || "Other");
          counts[catName] = (counts[catName] || 0) + 1;
        });
        const formattedCat = Object.entries(counts).map(([label, value]) => ({
          label,
          value,
          color: categoryColors[label] || "var(--color-brand-primary)"
        }));
        setComputedCategoryData(formattedCat);

        // Top Selling / Catalog items
        const formattedProducts: LiveProduct[] = data.items.slice(0, 4).map((p: { _id?: string; name: string; price?: number; sales?: number; soldCount?: number; images?: (string | { url?: string })[] }) => ({
          id: p._id || "",
          name: p.name || "Eyewear",
          sales: p.soldCount || p.sales || 0,
          revenue: (p.price || 0) * (p.soldCount || p.sales || 1),
          image: p.images && p.images.length > 0 ? resolveCloudinaryUrl(typeof p.images[0] === 'string' ? p.images[0] : p.images[0].url || '') : productImageFallback(p.name)
        }));
        setLiveTopProducts(formattedProducts);
      }
    }).catch(() => {});

    // 4. Registered Users / Customers
    adminGetUsersApi(1, 5).then((data) => {
      if (data && (Array.isArray(data.users) || Array.isArray(data.items))) {
        const rawUsers = data.users || data.items || [];
        const formattedUsers: LiveCustomer[] = rawUsers.map((u: { _id?: string; name?: string; fullName?: string; email?: string; createdAt?: string }) => ({
          id: u._id || "",
          name: u.fullName || u.name || "Customer",
          email: u.email || "-",
          joined: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "Registered"
        }));
        setLiveCustomers(formattedUsers);
      }
    }).catch(() => {});
  }, []);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-[color:var(--color-text-primary)] md:text-3xl">Dashboard</h1>
          <p className="mt-0.5 text-sm text-[color:var(--color-text-secondary)]">Your store at a glance.</p>
        </div>
        <div className="hidden gap-2 sm:flex">
          <Link to="/admin/products/add" className="flex items-center gap-2 rounded-xl bg-[color:var(--color-brand-primary)] px-4 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-black">
            <Plus className="h-4 w-4" /> Add Product
          </Link>
          <Link to="/admin/settings" className="flex items-center gap-2 rounded-xl border border-[color:var(--color-border)] px-4 py-2.5 text-sm font-semibold text-[color:var(--color-text-primary)] transition-all hover:-translate-y-0.5 hover:bg-[color:var(--color-surface-muted)]">
            <Settings className="h-4 w-4" /> Settings
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Revenue" value={`Rs. ${stats.totalRevenue.toLocaleString()}`} icon={<DollarSign className="h-5 w-5" />} color="text-[color:var(--color-brand-primary)]" bg="bg-[color:var(--color-brand-primary)]/10" delay={0.05} />
        <StatCard label="Total Orders" value={stats.totalOrders.toLocaleString()} icon={<ShoppingCart className="h-5 w-5" />} color="text-[color:var(--color-accent-teal)]" bg="bg-[color:var(--color-accent-teal)]/10" delay={0.1} />
        <StatCard label="Total Products" value={stats.totalProducts.toString()} icon={<Package className="h-5 w-5" />} trend={{ value: `${stats.lowStockProducts} low stock`, positive: false }} color="text-[color:var(--color-accent-blue)]" bg="bg-[color:var(--color-accent-blue)]/10" delay={0.15} />
        <StatCard label="Pending Orders" value={stats.pendingOrders.toString()} icon={<AlertTriangle className="h-5 w-5" />} color="text-amber-500" bg="bg-amber-500/10" delay={0.2} />
      </div>

      {/* Recent Orders & Category Share */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base text-[color:var(--color-text-primary)]">Recent Orders</h3>
            <Link to="/admin/orders" className="text-[10px] font-medium text-[color:var(--color-brand-primary)] hover:underline">View All</Link>
          </div>
          {liveRecentOrders.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-[color:var(--color-border)] p-6 text-center text-xs text-[color:var(--color-text-tertiary)]">
              No recent orders found.
            </div>
          ) : (
            <div className="mt-4 space-y-2">
              {liveRecentOrders.map((order) => (
                <div key={order.id || order.orderNumber} className="flex items-center justify-between rounded-xl bg-[color:var(--color-surface-muted)] p-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-[color:var(--color-text-primary)]">{order.orderNumber}</p>
                    <p className="text-[10px] text-[color:var(--color-text-tertiary)]">{order.customer}</p>
                  </div>
                  <span className={`rounded-lg px-2 py-0.5 text-[10px] font-semibold capitalize ${statusBadgeColors[order.status] || "bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-tertiary)]"}`}>{order.status}</span>
                  <span className="ml-3 text-xs font-semibold">Rs. {order.total.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-5">
            <h3 className="font-display text-base text-[color:var(--color-text-primary)] mb-3">Product Category Share</h3>
            {computedCategoryData.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[color:var(--color-border)] p-6 text-center text-xs text-[color:var(--color-text-tertiary)]">
                No active category data.
              </div>
            ) : (
              <DonutChart data={computedCategoryData} />
            )}
          </div>

          <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-5">
            <h3 className="font-display text-base text-[color:var(--color-text-primary)] mb-3">Top Products</h3>
            {liveTopProducts.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[color:var(--color-border)] p-6 text-center text-xs text-[color:var(--color-text-tertiary)]">
                No catalog products found.
              </div>
            ) : (
              <div className="space-y-3">
                {liveTopProducts.map((p) => (
                  <div key={p.id || p.name} className="flex items-center gap-3">
                    <img src={p.image} alt={p.name} className="h-10 w-10 rounded-lg object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-[color:var(--color-text-primary)] truncate">{p.name}</p>
                      <p className="text-[10px] text-[color:var(--color-text-tertiary)]">{p.sales} units sold</p>
                    </div>
                    <span className="text-[10px] font-semibold">Rs. {p.revenue.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Latest Customers & Activity Feed */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-base text-[color:var(--color-text-primary)]">Latest Registered Customers</h3>
            <Link to="/admin/customers" className="text-[10px] font-medium text-[color:var(--color-brand-primary)] hover:underline">View All</Link>
          </div>
          {liveCustomers.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[color:var(--color-border)] p-8 text-center text-xs text-[color:var(--color-text-tertiary)] flex flex-col items-center gap-2">
              <Users className="h-6 w-6 text-[color:var(--color-text-tertiary)]" />
              <span>No registered customers found in database.</span>
            </div>
          ) : (
            <div className="space-y-2">
              {liveCustomers.map((c) => (
                <div key={c.id || c.email} className="flex items-center gap-3 rounded-xl bg-[color:var(--color-surface-muted)] p-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[color:var(--color-brand-primary)] text-[10px] font-bold text-white">
                    {c.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-[color:var(--color-text-primary)]">{c.name}</p>
                    <p className="text-[10px] text-[color:var(--color-text-tertiary)]">{c.email}</p>
                  </div>
                  <span className="text-[10px] text-[color:var(--color-text-tertiary)]">{c.joined}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-5">
          <h3 className="font-display text-base text-[color:var(--color-text-primary)] mb-4">Activity Feed</h3>
          {liveActivity.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[color:var(--color-border)] p-8 text-center text-xs text-[color:var(--color-text-tertiary)] flex flex-col items-center gap-2">
              <Activity className="h-6 w-6 text-[color:var(--color-text-tertiary)]" />
              <span>No recent store activities logged.</span>
            </div>
          ) : (
            <div className="space-y-3">
              {liveActivity.map((act) => (
                <div key={act.id} className="flex items-start gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[color:var(--color-brand-primary)]/10 text-[color:var(--color-brand-primary)]">
                    <ShoppingBag className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-[color:var(--color-text-primary)] leading-snug">{act.title}</p>
                    <p className="text-[10px] text-[color:var(--color-text-tertiary)]">{act.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
