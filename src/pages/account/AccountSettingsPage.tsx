import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Bell, Globe, Sun, Mail, Shield, AlertTriangle, LogOut, ChevronRight } from "lucide-react";
import { useAuthStore } from "@/lib/stores/auth-store";
import { AccountLayout } from "@/components/account/AccountLayout";
import { Button } from "@/components/primitives/Button";

export function AccountSettingsPage() {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const [newsletter, setNewsletter] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [promotions, setPromotions] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const sections = [
    {
      title: "Preferences",
      items: [
        { icon: Globe, label: "Language", value: "English (US)", action: true },
        { icon: Sun, label: "Theme", value: "Light Mode", action: true },
      ],
    },
    {
      title: "Email Notifications",
      items: [
        { icon: Mail, label: "Newsletter", value: newsletter, action: false, toggle: () => setNewsletter(!newsletter) },
        { icon: Bell, label: "Order Updates", value: orderUpdates, action: false, toggle: () => setOrderUpdates(!orderUpdates) },
        { icon: MegaphoneIcon, label: "Promotions & Offers", value: promotions, action: false, toggle: () => setPromotions(!promotions) },
      ],
    },
    {
      title: "Privacy",
      items: [
        { icon: Shield, label: "Two-Factor Authentication", value: "Disabled", action: true },
        { icon: AlertTriangle, label: "Delete Account", value: "Irreversible", action: true, danger: true },
      ],
    },
  ];

  return (
    <AccountLayout title="Account Settings" subtitle="Manage your preferences and account">
      <div className="space-y-10">
        {sections.map((section) => (
          <div key={section.title}>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--color-text-tertiary)]">{section.title}</h3>
            <div className="space-y-2">
              {section.items.map((item) => (
                <motion.div
                  key={item.label}
                  className="flex items-center justify-between rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.danger ? "bg-red-500/10" : "bg-[color:var(--color-surface-muted)]"}`}>
                      <item.icon className={`h-5 w-5 ${item.danger ? "text-red-500" : "text-[color:var(--color-text-tertiary)]"}`} />
                    </div>
                    <div>
                      <p className={`text-sm ${item.danger ? "font-medium text-red-500" : "text-[color:var(--color-text-primary)]"}`}>{item.label}</p>
                      {typeof item.value === "string" && <p className="text-xs text-[color:var(--color-text-tertiary)]">{item.value}</p>}
                    </div>
                  </div>
                  {item.action ? (
                    <ChevronRight className={`h-5 w-5 ${item.danger ? "text-red-400" : "text-[color:var(--color-text-tertiary)]"}`} />
                  ) : (
                    item.toggle && (
                      <button type="button" onClick={item.toggle} className={`relative h-6 w-10 rounded-full transition-colors ${item.value ? "bg-[color:var(--color-accent-teal)]" : "bg-[color:var(--color-surface-muted)]"}`}>
                        <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-[var(--shadow-soft)] transition-transform ${item.value ? "translate-x-4" : "translate-x-0"}`} />
                      </button>
                    )
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        ))}

        <div className="border-t border-[color:var(--color-border)] pt-6">
          <Button variant="danger" iconLeft={<LogOut className="h-4 w-4" />} onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </AccountLayout>
  );
}

function MegaphoneIcon(props: React.ComponentProps<typeof Bell>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m3 11 18-5v12L3 14v-3z" /><path d="M11.6 16.5a3 3 0 1 1-5.2-3" />
    </svg>
  );
}
