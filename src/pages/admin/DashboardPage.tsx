import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  DollarSign, ShoppingCart, Package, Users, AlertTriangle, TrendingUp, Eye, Plus, Settings,
} from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { BarChart, DonutChart } from "@/components/admin/AdminCharts";
import { dashboardStats, monthlyRevenue, recentOrders, latestCustomers, activityFeed } from "@/lib/admin-data";

const widgets = [
  { label: "Total Revenue", value: "Rs. 2,456,800", icon: <DollarSign className="h-5 w-5" />, trend: { value: "12.5%", positive: true }, color: "text-emerald-600", bg: "bg-emerald-500/10" },
  { label: "Total Orders", value: "1,247", icon: <ShoppingCart className="h-5 w-5" />, trend: { value: "8.2%", positive: true }, color: "text-[color:var(--color-accent-blue)]", bg: "bg-[color:var(--color-accent-blue)]/10" },
  { label: "Pending Orders", value: "38", icon: <AlertTriangle className="h-5 w-5" />, trend: { value: "3.1%", positive: false }, color: "text-amber-500", bg: "bg-amber-500/10" },
  { label: "Total Products", value: "156", icon: <Package className="h-5 w-5" />, trend: { value: "4", positive: true }, color: "text-purple-500", bg: "bg-purple-500/10" },
  { label: "Total Customers", value: "892", icon: <Users className="h-5 w-5" />, trend: { value: "18.3%", positive: true }, color: "text-[color:var(--color-accent-teal)]", bg: "bg-[color:var(--color-accent-teal)]/10" },
  { label: "Low Stock Items", value: "12", icon: <AlertTriangle className="h-5 w-5" />, trend: { value: "2", positive: false }, color: "text-red-500", bg: "bg-red-500/10" },
  { label: "Today's Sales", value: "Rs. 128,500", icon: <TrendingUp className="h-5 w-5" />, trend: { value: "5.7%", positive: true }, color: "text-[color:var(--color-accent-teal)]", bg: "bg-[color:var(--color-accent-teal)]/10" },
];

const orderStatusColors: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-600",
  processing: "bg-[color:var(--color-accent-blue)]/10 text-[color:var(--color-accent-blue)]",
  shipped: "bg-[color:var(--color-accent-teal)]/10 text-[color:var(--color-accent-teal)]",
  delivered: "bg-emerald-500/10 text-emerald-600",
  cancelled: "bg-red-500/10 text-red-600",
};

const activityIcons: Record<string, string> = {
  order: "bg-[color:var(--color-accent-blue)]/10 text-[color:var(--color-accent-blue)]",
  product: "bg-purple-500/10 text-purple-500",
  customer: "bg-emerald-500/10 text-emerald-600",
  review: "bg-amber-500/10 text-amber-600",
  system: "bg-[color:var(--color-accent-teal)]/10 text-[color:var(--color-accent-teal)]",
};

const categoryData = [
  { label: "Sunglasses", value: 42, color: "var(--color-brand-primary)" },
  { label: "Eyeglasses", value: 58, color: "var(--color-accent-teal)" },
  { label: "Sports", value: 24, color: "var(--color-accent-blue)" },
  { label: "Kids", value: 18, color: "#f59e0b" },
  { label: "Blue Light", value: 14, color: "#8b5cf6" },
];

const bestSellers = [
  { name: "Noir Line Titanium", sales: 128, revenue: "Rs. 3,648,000", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?image_size=portrait_4_3&prompt=luxury+black+titanium+eyewear+front+view" },
  { name: "Aviator Classic Gold", sales: 210, revenue: "Rs. 3,339,000", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?image_size=portrait_4_3&prompt=gold+aviator+sunglasses+front+view" },
  { name: "Verde Artisan Acetate", sales: 156, revenue: "Rs. 3,104,400", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?image_size=portrait_4_3&prompt=emerald+acetate+eyewear+front+view" },
  { name: "Rose Gold Aviator", sales: 95, revenue: "Rs. 3,040,000", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?image_size=portrait_4_3&prompt=rose+gold+aviator+sunglasses+front+view" },
];

export function AdminDashboardPage() {
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

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {widgets.map((w, i) => (
          <StatCard key={w.label} {...w} delay={i * 0.04} />
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base text-[color:var(--color-text-primary)]">Monthly Revenue</h3>
            <select className="rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-3 py-1.5 text-xs text-[color:var(--color-text-secondary)]">
              <option>2026</option>
            </select>
          </div>
          <div className="mt-6">
            <BarChart data={monthlyRevenue.map((m) => ({ label: m.month, value: m.revenue }))} height={180} />
          </div>
        </div>

        <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-5">
          <h3 className="font-display text-base text-[color:var(--color-text-primary)]">Category Distribution</h3>
          <div className="mt-4 flex flex-col items-center">
            <DonutChart data={categoryData} />
            <div className="mt-4 w-full space-y-2">
              {categoryData.map((c) => (
                <div key={c.label} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                    <span className="text-[color:var(--color-text-secondary)]">{c.label}</span>
                  </div>
                  <span className="font-medium text-[color:var(--color-text-primary)]">{c.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base text-[color:var(--color-text-primary)]">Recent Orders</h3>
            <Link to="/admin/orders" className="text-[10px] font-medium text-[color:var(--color-accent-teal)] hover:underline">View All</Link>
          </div>
          <div className="mt-4 space-y-2">
            {recentOrders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between rounded-xl bg-[color:var(--color-surface-muted)] p-3">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-[color:var(--color-text-primary)]">{order.orderNumber}</p>
                  <p className="text-[10px] text-[color:var(--color-text-tertiary)]">{order.customer} · {order.items} item{order.items > 1 ? "s" : ""}</p>
                </div>
                <span className={`rounded-lg px-2 py-0.5 text-[10px] font-semibold capitalize ${orderStatusColors[order.status] || "bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-tertiary)]"}`}>{order.status}</span>
                <span className="ml-3 text-xs font-semibold">Rs. {order.total.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-5">
            <h3 className="font-display text-base text-[color:var(--color-text-primary)]">Best Sellers</h3>
            <div className="mt-4 space-y-3">
              {bestSellers.map((p) => (
                <div key={p.name} className="flex items-center gap-3">
                  <img src={p.image} alt="" className="h-10 w-10 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-[color:var(--color-text-primary)] truncate">{p.name}</p>
                    <p className="text-[10px] text-[color:var(--color-text-tertiary)]">{p.sales} sold</p>
                  </div>
                  <span className="text-[10px] font-semibold">{p.revenue}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-5">
          <h3 className="font-display text-base text-[color:var(--color-text-primary)]">Latest Customers</h3>
          <div className="mt-4 space-y-2">
            {latestCustomers.map((c) => (
              <div key={c.id} className="flex items-center gap-3 rounded-xl bg-[color:var(--color-surface-muted)] p-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[color:var(--color-brand-primary)] text-[10px] font-bold text-white">
                  {c.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-[color:var(--color-text-primary)]">{c.name}</p>
                  <p className="text-[10px] text-[color:var(--color-text-tertiary)]">{c.email}</p>
                </div>
                <span className="text-[10px] text-[color:var(--color-text-tertiary)]">{c.joined}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-5">
          <h3 className="font-display text-base text-[color:var(--color-text-primary)]">Activity Feed</h3>
          <div className="mt-4 space-y-3">
            {activityFeed.slice(0, 5).map((act) => (
              <div key={act.id} className="flex items-start gap-3">
                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${activityIcons[act.type] || "bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-tertiary)]"}`}>
                  <div className="h-3 w-3 rounded-full bg-current opacity-50" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-[color:var(--color-text-primary)]">
                    <span className="font-medium">{act.action}</span>: {act.description}
                  </p>
                  <p className="text-[10px] text-[color:var(--color-text-tertiary)]">{act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
