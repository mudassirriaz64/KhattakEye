import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, ShoppingBag, Heart, MapPin, Star, Bell, Settings, LogOut, ChevronLeft, User, X,
} from "lucide-react";
import { useAuthStore } from "@/lib/stores/auth-store";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/account", icon: LayoutDashboard, label: "Dashboard", exact: true },
  { to: "/account/orders", icon: ShoppingBag, label: "My Orders" },
  { to: "/account/wishlist", icon: Heart, label: "Wishlist" },
  { to: "/account/addresses", icon: MapPin, label: "Saved Addresses" },
  { to: "/account/reviews", icon: Star, label: "Reviews & Ratings" },
  { to: "/account/notifications", icon: Bell, label: "Notifications" },
  { to: "/account/settings", icon: Settings, label: "Account Settings" },
];

type Props = { mobileOpen: boolean; onClose: () => void };

export function AccountSidebar({ mobileOpen, onClose }: Props) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3.5 border-b border-[color:var(--color-border)] px-5 py-6">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[color:var(--color-brand-primary)] text-sm font-bold text-white">
          {user?.fullName?.split(" ").map((n) => n[0]).join("").slice(0, 2) || "UK"}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-[color:var(--color-text-primary)]">{user?.fullName || "User"}</p>
          <p className="truncate text-xs text-[color:var(--color-text-tertiary)]">{user?.email || "user@email.com"}</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.exact}
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-[color:var(--color-brand-primary)] text-white shadow-[var(--shadow-soft)]"
                  : "text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-muted)] hover:text-[color:var(--color-text-primary)]",
              )
            }
          >
            <item.icon className="h-4.5 w-4.5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-[color:var(--color-border)] px-3 py-4">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-[color:var(--color-text-secondary)] transition-colors hover:bg-[color:var(--color-surface-muted)] hover:text-[color:var(--color-danger)]"
        >
          <LogOut className="h-4.5 w-4.5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block">
        <div className="sticky top-24 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] backdrop-blur-2xl">
          {sidebarContent}
        </div>
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed inset-y-0 left-0 z-50 w-[280px] bg-[color:var(--color-app-bg)] shadow-[var(--shadow-strong)] lg:hidden"
            >
              <button
                type="button"
                onClick={onClose}
                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg text-[color:var(--color-text-tertiary)] hover:bg-[color:var(--color-surface-muted)]"
              >
                <X className="h-4 w-4" />
              </button>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
