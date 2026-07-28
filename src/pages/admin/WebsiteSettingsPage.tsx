import { useState } from "react";
import { motion } from "framer-motion";
import { Settings, Save } from "lucide-react";
import { cmsWebsiteSettings } from "@/lib/admin-data";
import { Button } from "@/components/primitives/Button";
import { cn } from "@/lib/utils";

type SettingsSections = "general" | "contact" | "social" | "payments" | "shipping" | "seo" | "analytics";

const sections: { key: SettingsSections; label: string }[] = [
  { key: "general", label: "General" },
  { key: "contact", label: "Contact" },
  { key: "social", label: "Social" },
  { key: "payments", label: "Payments" },
  { key: "shipping", label: "Shipping" },
  { key: "seo", label: "SEO" },
  { key: "analytics", label: "Analytics" },
];

export function AdminWebsiteSettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSections>("general");
  const [settings, setSettings] = useState(cmsWebsiteSettings);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const update = (path: string, value: string) => {
    setSettings((prev) => {
      const copy = { ...prev };
      const keys = path.split(".");
      let obj: Record<string, any> = copy;
      for (let i = 0; i < keys.length - 1; i++) {
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return copy;
    });
  };

  const field = (label: string, path: string, placeholder = "", type = "text") => (
    <div>
      <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em]">{label}</label>
      <input type={type} value={path.split(".").reduce((o, k) => (o as any)?.[k] ?? "", settings as any)} onChange={(e) => update(path, e.target.value)} placeholder={placeholder} className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm text-[color:var(--color-text-primary)] placeholder:text-[color:var(--color-text-tertiary)]" />
    </div>
  );

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-[color:var(--color-text-primary)] md:text-3xl">Website Settings</h1>
          <p className="mt-0.5 text-sm text-[color:var(--color-text-secondary)]">Configure your store</p>
        </div>
        <Button variant="primary" iconLeft={saved ? undefined : <Save className="h-4 w-4" />} onClick={handleSave} className="text-xs">
          {saved ? "Saved!" : "Save Changes"}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[200px_1fr]">
        <div className="flex flex-col gap-1.5 lg:sticky lg:top-6 lg:self-start">
          {sections.map((s) => (
            <button key={s.key} type="button" onClick={() => setActiveSection(s.key)} className={cn("rounded-xl px-4 py-2.5 text-left text-xs font-medium transition-colors", activeSection === s.key ? "bg-[color:var(--color-brand-primary)] text-white" : "text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-muted)]")}>
              {s.label}
            </button>
          ))}
        </div>

        <motion.div key={activeSection} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-5">
          {activeSection === "general" && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">General Settings</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {field("Site Title", "siteTitle", "Khattak Eyewear")}
                {field("Tagline", "tagline", "Precision Crafted For Your Vision")}
                {field("Logo URL", "logo", "/logo.png")}
                {field("Favicon URL", "favicon", "/favicon.ico")}
                {field("Primary Color", "theme.primaryColor", "#111111")}
                {field("Accent Color", "theme.accentColor", "#0f766e")}
                {field("Border Radius", "theme.borderRadius", "16px")}
              </div>
            </div>
          )}
          {activeSection === "contact" && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Contact Information</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {field("Email", "contact.email", "hello@khattak.com")}
                {field("Phone", "contact.phone", "+92 300 111 2222")}
                {field("Address", "contact.address", "57-E, Gulberg III, Lahore")}
                {field("WhatsApp Number", "whatsapp.number", "+923001112222")}
                {field("WhatsApp Message", "whatsapp.message", "Hi! I have a question.")}
                {field("Order Confirmation Email", "emails.orderConfirmation", "orders@khattak.com")}
                {field("Support Email", "emails.support", "support@khattak.com")}
                {field("No-Reply Email", "emails.noreply", "noreply@khattak.com")}
              </div>
            </div>
          )}
          {activeSection === "social" && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Social Media Links</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {field("Facebook", "social.facebook", "https://facebook.com/khattakeyewear")}
                {field("Instagram", "social.instagram", "https://instagram.com/khattak_eyewear")}
                {field("Twitter", "social.twitter", "https://twitter.com/khattak_eye")}
                {field("YouTube", "social.youtube", "https://youtube.com/@khattakeyewear")}
              </div>
            </div>
          )}
          {activeSection === "payments" && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Payment Details</h3>
              <h4 className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-secondary)]">Bank Transfer</h4>
              <div className="grid gap-4 sm:grid-cols-2">
                {field("Bank Name", "bankDetails.bankName", "HBL")}
                {field("Account Title", "bankDetails.accountTitle", "Khattak Eyewear Pvt Ltd")}
                {field("Account Number", "bankDetails.accountNumber", "1234-5678-9012-3456")}
                {field("IBAN", "bankDetails.iban", "PK36HBLB1234567890123456")}
              </div>
              <h4 className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-secondary)]">JazzCash</h4>
              <div className="grid gap-4 sm:grid-cols-2">
                {field("Number", "jazzcash.number", "+92 300 111 2222")}
                {field("Account Title", "jazzcash.accountTitle", "Khattak Eyewear")}
              </div>
              <h4 className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-secondary)]">EasyPaisa</h4>
              <div className="grid gap-4 sm:grid-cols-2">
                {field("Number", "easypaisa.number", "+92 300 111 2222")}
                {field("Account Title", "easypaisa.accountTitle", "Khattak Eyewear")}
              </div>
            </div>
          )}
          {activeSection === "shipping" && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Shipping Settings</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {field("Free Shipping Threshold (Rs.)", "shipping.freeThreshold", "3000")}
                {field("Standard Rate (Rs.)", "shipping.standardRate", "350")}
                {field("Express Rate (Rs.)", "shipping.expressRate", "750")}
                {field("Estimated Days", "shipping.estimatedDays", "3-5 business days")}
              </div>
            </div>
          )}
          {activeSection === "seo" && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">SEO Settings</h3>
              <div className="grid gap-4">
                {field("Meta Title", "seo.metaTitle")}
                {field("Meta Description", "seo.metaDescription")}
                {field("Meta Keywords", "seo.metaKeywords")}
              </div>
            </div>
          )}
          {activeSection === "analytics" && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Analytics & Tracking</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {field("Google Analytics ID", "analytics.googleAnalyticsId", "G-XXXXXXXXXX")}
                {field("Facebook Pixel ID", "analytics.facebookPixelId", "1234567890")}
                {field("Google Tag Manager ID", "analytics.googleTagManagerId", "GTM-XXXXXXX")}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
