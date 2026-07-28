import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingBag, MapPin, Heart, Star, Ban, CheckCircle, Mail, Phone, Calendar, DollarSign } from "lucide-react";
import { adminCustomerDetails } from "@/lib/admin-data";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/primitives/Button";

export function AdminCustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const customer = adminCustomerDetails.find((c) => c.id === id) || adminCustomerDetails[0];
  const [blocked, setBlocked] = useState(customer.blocked);

  const tabs = [
    { id: "overview", label: "Overview", icon: ShoppingBag },
    { id: "addresses", label: "Addresses", icon: MapPin },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "reviews", label: "Reviews", icon: Star },
  ] as const;
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link to="/admin/customers" className="inline-flex items-center gap-1.5 text-xs text-[color:var(--color-text-tertiary)] hover:text-[color:var(--color-text-primary)]">
            <ArrowLeft className="h-3 w-3" /> Back to Customers
          </Link>
          <h1 className="mt-2 font-display text-2xl text-[color:var(--color-text-primary)]">{customer.name}</h1>
        </div>
        <Button variant={blocked ? "success" : "danger"} iconLeft={blocked ? <CheckCircle className="h-4 w-4" /> : <Ban className="h-4 w-4" />} onClick={() => setBlocked(!blocked)} className="text-xs">
          {blocked ? "Unblock User" : "Block User"}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="space-y-4">
          <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-5 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[color:var(--color-brand-primary)] text-lg font-bold text-white">
              {customer.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <h3 className="mt-3 font-display text-lg text-[color:var(--color-text-primary)]">{customer.name}</h3>
            <div className="mt-2"><StatusBadge status={blocked ? "cancelled" : "active"} /></div>
          </div>

          <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm"><Mail className="h-4 w-4 text-[color:var(--color-text-tertiary)]" /><span className="text-[color:var(--color-text-secondary)]">{customer.email}</span></div>
              <div className="flex items-center gap-3 text-sm"><Phone className="h-4 w-4 text-[color:var(--color-text-tertiary)]" /><span className="text-[color:var(--color-text-secondary)]">{customer.phone}</span></div>
              <div className="flex items-center gap-3 text-sm"><Calendar className="h-4 w-4 text-[color:var(--color-text-tertiary)]" /><span className="text-[color:var(--color-text-secondary)]">Joined {customer.joined}</span></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-4 text-center">
              <ShoppingBag className="mx-auto h-5 w-5 text-[color:var(--color-text-tertiary)]" />
              <p className="mt-2 text-lg font-bold text-[color:var(--color-text-primary)]">{customer.totalOrders}</p>
              <p className="text-xs text-[color:var(--color-text-tertiary)]">Orders</p>
            </div>
            <div className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-4 text-center">
              <DollarSign className="mx-auto h-5 w-5 text-[color:var(--color-text-tertiary)]" />
              <p className="mt-2 text-lg font-bold text-[color:var(--color-text-primary)]">Rs. {customer.totalSpent.toLocaleString()}</p>
              <p className="text-xs text-[color:var(--color-text-tertiary)]">Spent</p>
            </div>
          </div>
        </div>

        <div>
          <div className="flex gap-1.5 border-b border-[color:var(--color-border)] pb-3">
            {tabs.map((tab) => (
              <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-medium transition-colors ${activeTab === tab.id ? "bg-[color:var(--color-brand-primary)] text-white" : "text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-muted)]"}`}>
                <tab.icon className="h-3.5 w-3.5" /> {tab.label}
              </button>
            ))}
          </div>

          <div className="mt-6">
            {activeTab === "overview" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <h3 className="font-display text-base text-[color:var(--color-text-primary)]">Recent Orders</h3>
                {customer.recentOrders.map((o, i) => (
                  <div key={i} className="flex items-center justify-between rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-4">
                    <div>
                      <p className="text-sm font-medium text-[color:var(--color-text-primary)]">{o.orderNumber}</p>
                      <p className="text-xs text-[color:var(--color-text-tertiary)]">{o.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold">Rs. {o.total.toLocaleString()}</span>
                      <StatusBadge status={o.status} />
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === "addresses" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                {customer.addresses.map((a) => (
                  <div key={a.id} className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-[color:var(--color-accent-teal)]" />
                      <span className="text-sm font-medium text-[color:var(--color-text-primary)]">{a.label}</span>
                      {a.isDefault && <StatusBadge status="yes" />}
                    </div>
                    <p className="mt-1 text-xs text-[color:var(--color-text-secondary)]">{a.street}, {a.city}, {a.province}</p>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === "wishlist" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {customer.wishlistItems.length === 0 ? (
                  <p className="text-sm text-[color:var(--color-text-tertiary)]">No items in wishlist.</p>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {customer.wishlistItems.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-3">
                        <img src={item.image} alt="" className="h-12 w-12 rounded-lg object-cover" />
                        <div>
                          <p className="text-sm font-medium text-[color:var(--color-text-primary)]">{item.name}</p>
                          <p className="text-xs font-semibold">Rs. {item.price.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "reviews" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <p className="text-sm text-[color:var(--color-text-tertiary)]">Customer&apos;s reviews appear here.</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
