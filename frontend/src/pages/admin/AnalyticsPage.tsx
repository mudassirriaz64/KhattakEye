import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Users, ShoppingCart, DollarSign, BarChart3 } from "lucide-react";
import { monthlyRevenue, salesFunnel, conversionMetrics, bestProducts, customerGrowth } from "@/lib/admin-data";
import { BarChart, DonutChart } from "@/components/admin/AdminCharts";
import { cn } from "@/lib/utils";

type Tab = "revenue" | "funnel" | "conversion" | "products" | "categories" | "growth";

const tabs: { key: Tab; label: string }[] = [
  { key: "revenue", label: "Revenue Charts" },
  { key: "funnel", label: "Sales Funnel" },
  { key: "conversion", label: "Conversion" },
  { key: "products", label: "Best Products" },
  { key: "categories", label: "Top Categories" },
  { key: "growth", label: "Customer Growth" },
];

export function AdminAnalyticsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("revenue");

  const categoryData = [
    { label: "Sunglasses", value: 42, color: "var(--color-brand-primary)" },
    { label: "Eyeglasses", value: 58, color: "var(--color-accent-teal)" },
    { label: "Sports", value: 24, color: "var(--color-accent-blue)" },
    { label: "Kids", value: 18, color: "#f59e0b" },
    { label: "Blue Light", value: 14, color: "var(--color-brand-soft)" },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl text-[color:var(--color-text-primary)] md:text-3xl">Analytics</h1>
        <p className="mt-0.5 text-sm text-[color:var(--color-text-secondary)]">In-depth business intelligence</p>
      </div>

      <div className="mb-6 flex flex-wrap gap-1.5 rounded-xl bg-[color:var(--color-surface-muted)] p-1.5">
        {tabs.map((t) => (
          <button key={t.key} type="button" onClick={() => setActiveTab(t.key)} className={cn("rounded-lg px-3 py-2 text-xs font-medium transition-colors", activeTab === t.key ? "bg-[color:var(--color-panel)] text-[color:var(--color-text-primary)] shadow-[var(--shadow-soft)]" : "text-[color:var(--color-text-tertiary)] hover:text-[color:var(--color-text-primary)]")}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === "revenue" && (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-5">
            <h3 className="font-display text-base text-[color:var(--color-text-primary)]">Monthly Revenue</h3>
            <div className="mt-6">
              <BarChart data={monthlyRevenue.map((m) => ({ label: m.month, value: m.revenue }))} height={280} />
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-4">
            <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-5">
              <h3 className="font-display text-sm text-[color:var(--color-text-primary)]">Year to Date</h3>
              <p className="mt-2 text-2xl font-bold text-[color:var(--color-text-primary)]">Rs. 3,450,000</p>
              <div className="mt-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-emerald-500" />
                <span className="text-[10px] font-semibold text-emerald-500">+8.9%</span>
                <span className="text-[10px] text-[color:var(--color-text-tertiary)]">vs last year</span>
              </div>
            </div>
            <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-5">
              <h3 className="font-display text-sm text-[color:var(--color-text-primary)]">Monthly Orders</h3>
              <div className="mt-4 space-y-2">
                {monthlyRevenue.slice(-6).map((m) => (
                  <div key={m.month} className="flex items-center justify-between text-xs">
                    <span className="text-[color:var(--color-text-secondary)]">{m.month}</span>
                    <span className="font-medium text-[color:var(--color-text-primary)]">{m.orders} orders</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {activeTab === "funnel" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-5">
          <h3 className="font-display text-base text-[color:var(--color-text-primary)]">Sales Funnel</h3>
          <p className="mt-1 text-xs text-[color:var(--color-text-secondary)]">Customer journey from visit to delivery</p>
          <div className="mt-6 space-y-1">
            {salesFunnel.map((stage, i) => {
              const maxWidth = Math.max(...salesFunnel.map((s) => s.count));
              const width = (stage.count / maxWidth) * 100;
              const barColor = i === salesFunnel.length - 1 ? "bg-emerald-500" : i < 2 ? "bg-[color:var(--color-accent-blue)]" : "bg-amber-500";
              return (
                <div key={stage.stage} className="flex items-center gap-4">
                  <span className="w-32 text-[10px] font-medium text-[color:var(--color-text-secondary)]">{stage.stage}</span>
                  <div className="flex-1">
                    <div className="flex h-8 items-center rounded-lg bg-[color:var(--color-surface-muted)]">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${width}%` }} transition={{ duration: 0.8, delay: i * 0.1 }} className={`flex h-full items-center justify-end rounded-lg ${barColor} px-2`}>
                        <span className="text-[10px] font-bold text-white">{stage.count.toLocaleString()}</span>
                      </motion.div>
                    </div>
                  </div>
                  <span className="w-16 text-right text-[10px] text-red-500">{stage.dropRate > 0 ? `-${stage.dropRate}%` : ""}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {activeTab === "conversion" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-5">
            <h3 className="font-display text-base text-[color:var(--color-text-primary)]">Conversion by Source</h3>
            <div className="mt-6">
              <DonutChart data={conversionMetrics.map((c) => ({ label: c.source, value: c.conversions, color: c.source === "Direct" ? "var(--color-brand-primary)" : c.source === "Organic Search" ? "var(--color-accent-teal)" : c.source === "Social Media" ? "var(--color-accent-blue)" : c.source === "Email" ? "#f59e0b" : "var(--color-brand-soft)" }))} />
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-5">
            <h3 className="font-display text-base text-[color:var(--color-text-primary)]">Detailed Metrics</h3>
            <div className="mt-4 space-y-3">
              {conversionMetrics.map((c) => (
                <div key={c.source} className="flex items-center justify-between border-b border-[color:var(--color-border)] pb-3 last:border-0">
                  <div>
                    <p className="text-xs font-medium text-[color:var(--color-text-primary)]">{c.source}</p>
                    <p className="text-[10px] text-[color:var(--color-text-tertiary)]">{c.visitors.toLocaleString()} visitors</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-[color:var(--color-text-primary)]">{c.rate}%</p>
                    <p className="text-[10px] text-[color:var(--color-text-tertiary)]">{c.conversions} conv.</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {activeTab === "products" && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {bestProducts.map((p, i) => (
            <motion.div key={p.name} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-5">
              <div className="flex items-center gap-3">
                <img src={p.image} alt="" className="h-12 w-12 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[color:var(--color-text-primary)] truncate">{p.name}</p>
                  <p className="text-xs text-[color:var(--color-text-secondary)]">{p.sales} sold</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm font-bold text-[color:var(--color-text-primary)]">Rs. {p.revenue.toLocaleString()}</span>
                <div className={cn("flex items-center gap-1 text-[10px] font-semibold", p.growth >= 0 ? "text-emerald-500" : "text-red-500")}>
                  {p.growth >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {p.growth >= 0 ? "+" : ""}{p.growth}%
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === "categories" && (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-5">
            <h3 className="font-display text-base text-[color:var(--color-text-primary)]">Category Distribution</h3>
            <div className="mt-6">
              <BarChart data={categoryData.map((c) => ({ label: c.label, value: c.value }))} height={260} />
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-5">
            <h3 className="font-display text-base text-[color:var(--color-text-primary)]">Breakdown</h3>
            <div className="mt-4 space-y-3">
              {categoryData.map((c) => (
                <div key={c.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                    <span className="text-xs text-[color:var(--color-text-secondary)]">{c.label}</span>
                  </div>
                  <span className="text-xs font-semibold text-[color:var(--color-text-primary)]">{c.value} products</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {activeTab === "growth" && (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-5">
            <h3 className="font-display text-base text-[color:var(--color-text-primary)]">Customer Growth</h3>
            <div className="mt-6">
              <BarChart data={customerGrowth.map((c) => ({ label: c.month, value: c.totalCustomers }))} height={260} />
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-4">
            <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-5">
              <h3 className="font-display text-sm text-[color:var(--color-text-primary)]">Total Customers</h3>
              <p className="mt-2 text-2xl font-bold text-[color:var(--color-text-primary)]">2,280</p>
              <div className="mt-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-emerald-500" />
                <span className="text-[10px] font-semibold text-emerald-500">+12.8%</span>
                <span className="text-[10px] text-[color:var(--color-text-tertiary)]">this year</span>
              </div>
            </div>
            <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-5">
              <h3 className="font-display text-sm text-[color:var(--color-text-primary)]">New Customers (Dec)</h3>
              <p className="mt-2 text-2xl font-bold text-[color:var(--color-text-primary)]">260</p>
              <div className="mt-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-emerald-500" />
                <span className="text-[10px] font-semibold text-emerald-500">+20.9%</span>
                <span className="text-[10px] text-[color:var(--color-text-tertiary)]">vs last month</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
