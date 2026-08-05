import { useState, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { motion } from "framer-motion";
import { AccountSidebar } from "./AccountSidebar";
import { useAuthStore } from "@/lib/stores/auth-store";

type Props = { title?: string; subtitle?: string; children: ReactNode };

export function AccountLayout({ title, subtitle, children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);

  if (!isAuthenticated && !isLoading) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-10 md:px-8">
      <div className="flex items-center gap-3 lg:hidden">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[color:var(--color-border)] text-[color:var(--color-text-secondary)]"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          {title && <h1 className="font-display text-xl text-[color:var(--color-text-primary)]">{title}</h1>}
          {subtitle && <p className="text-xs text-[color:var(--color-text-secondary)]">{subtitle}</p>}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <AccountSidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <motion.main
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="hidden lg:block">
            {title && <h1 className="font-display text-3xl text-[color:var(--color-text-primary)] md:text-4xl">{title}</h1>}
            {subtitle && <p className="mt-1 text-sm text-[color:var(--color-text-secondary)]">{subtitle}</p>}
          </div>
          <div className={title ? "mt-6" : ""}>{children}</div>
        </motion.main>
      </div>
    </div>
  );
}
