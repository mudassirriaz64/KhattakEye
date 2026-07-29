import { useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAdminStore } from "@/lib/stores/admin-store";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopBar } from "./AdminTopBar";

export function AdminLayout() {
  useTheme();
  const location = useLocation();
  const { isAuthenticated, sidebarCollapsed } = useAdminStore();
  const [mobileSidebar, setMobileSidebar] = useState(false);

  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;

  return (
    <div className="flex h-screen overflow-hidden bg-[color:var(--color-app-bg)]">
      <div className={cn("hidden h-full shrink-0 border-r border-[color:var(--color-border)] lg:block", sidebarCollapsed ? "w-[72px]" : "w-[260px]")}>
        <AdminSidebar />
      </div>

      <AnimatePresence>
        {mobileSidebar && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileSidebar(false)} className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden" />
            <motion.aside initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 28, stiffness: 260 }} className="fixed inset-y-0 left-0 z-50 w-[280px] lg:hidden">
              <AdminSidebar onClose={() => setMobileSidebar(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopBar onMenuClick={() => setMobileSidebar(true)} />
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="p-4 lg:p-6"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
