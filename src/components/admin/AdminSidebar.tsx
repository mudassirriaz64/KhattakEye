import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Package, Grid3X3, Bookmark, ShoppingCart, Users, FileText, BarChart3, Settings, LogOut, ChevronLeft, X,
  ShieldCheck, Star, MessageSquare, ClipboardList,
} from "lucide-react";
import { useAdminStore } from "@/lib/stores/admin-store";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard", exact: true },
  { to: "/admin/orders", icon: ShoppingCart, label: "Orders", badge: "38" },
  { to: "/admin/products", icon: Package, label: "Products" },
  { to: "/admin/categories", icon: Grid3X3, label: "Categories" },
  { to: "/admin/brands", icon: Bookmark, label: "Brands" },
  { to: "/admin/payments", icon: ShieldCheck, label: "Payments" },
  { to: "/admin/inventory", icon: ClipboardList, label: "Inventory" },
  { to: "/admin/customers", icon: Users, label: "Customers" },
  { to: "/admin/reviews", icon: Star, label: "Reviews" },
  { to: "/admin/testimonials", icon: MessageSquare, label: "Testimonials" },
  { to: "/admin/cms", icon: FileText, label: "CMS" },
  { to: "/admin/reports", icon: BarChart3, label: "Reports" },
  { to: "/admin/settings", icon: Settings, label: "Settings" },
];

type Props = { onClose?: () => void };

export function AdminSidebar({ onClose }: Props) {
  const { sidebarCollapsed, toggleSidebar, user, logout } = useAdminStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <aside className={cn(
      "flex h-full flex-col bg-[color:var(--color-panel)] backdrop-blur-2xl transition-all duration-300",
      sidebarCollapsed ? "w-[72px]" : "w-[260px]",
    )}>
      <div className={cn("flex items-center border-b border-[color:var(--color-border)] px-4 py-5", sidebarCollapsed ? "justify-center" : "justify-between")}>
        {!sidebarCollapsed && (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[color:var(--color-brand-primary)] text-xs font-bold text-white">K</div>
            <span className="text-sm font-semibold text-[color:var(--color-text-primary)]">Admin</span>
          </div>
        )}
        {sidebarCollapsed && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[color:var(--color-brand-primary)] text-xs font-bold text-white">K</div>
        )}
        <button type="button" onClick={sidebarCollapsed ? toggleSidebar : onClose} className="hidden lg:flex h-7 w-7 items-center justify-center rounded-lg text-[color:var(--color-text-tertiary)] hover:bg-[color:var(--color-surface-muted)]">
          {sidebarCollapsed ? null : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.exact}
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                sidebarCollapsed && "justify-center px-2",
                isActive
                  ? "bg-[color:var(--color-brand-primary)] text-white shadow-[var(--shadow-soft)]"
                  : "text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-muted)] hover:text-[color:var(--color-text-primary)]",
              )
            }
          >
            <item.icon className="h-4.5 w-4.5 shrink-0" />
            {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
            {!sidebarCollapsed && item.badge && (
              <span className="ml-auto rounded-lg bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold text-amber-600">{item.badge}</span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-[color:var(--color-border)] p-3">
        {!sidebarCollapsed ? (
          <>
            <div className="flex items-center gap-3 rounded-xl px-3 py-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[color:var(--color-brand-primary)] text-xs font-bold text-white">
                {user?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2) || "AK"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-[color:var(--color-text-primary)]">{user?.name || "Admin"}</p>
                <p className="truncate text-[10px] text-[color:var(--color-text-tertiary)] capitalize">{user?.role?.replace("-", " ") || "Admin"}</p>
              </div>
            </div>
            <button type="button" onClick={handleLogout} className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium text-[color:var(--color-text-tertiary)] transition-colors hover:bg-[color:var(--color-surface-muted)] hover:text-[color:var(--color-danger)]">
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </>
        ) : (
          <button type="button" onClick={handleLogout} className="flex w-full items-center justify-center rounded-xl px-3 py-2.5 text-[color:var(--color-text-tertiary)] hover:bg-[color:var(--color-surface-muted)] hover:text-[color:var(--color-danger)]">
            <LogOut className="h-4 w-4" />
          </button>
        )}
      </div>
    </aside>
  );
}
