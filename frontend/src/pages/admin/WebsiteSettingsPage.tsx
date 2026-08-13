import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save } from "lucide-react";
import { cmsWebsiteSettings } from "@/lib/admin-data";
import { Button } from "@/components/primitives/Button";
import { cn } from "@/lib/utils";
import axios from "@/lib/api/axios";

type SettingsSections = "general" | "contact" | "social" | "payments" | "shipping" | "policies" | "seo" | "analytics";

const sections: { key: SettingsSections; label: string }[] = [
  { key: "general", label: "General" },
  { key: "contact", label: "Contact" },
  { key: "social", label: "Social" },
  { key: "payments", label: "Payments" },
  { key: "shipping", label: "Shipping" },
  { key: "policies", label: "Policies" },
  { key: "seo", label: "SEO" },
  { key: "analytics", label: "Analytics" },
];

export function AdminWebsiteSettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSections>("general");
  const [settings, setSettings] = useState(cmsWebsiteSettings);
  const [saved, setSaved] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  useEffect(() => {
    axios.get("/settings").then((res) => {
      if (res.data) {
        const data = { ...res.data };
        if (data.socialLinks && !data.social) data.social = { ...data.socialLinks };
        if (data.social && !data.socialLinks) data.socialLinks = { ...data.social };
        setSettings((prev) => ({ ...prev, ...data }));
      }
    }).catch(() => {});
  }, []);

  const handleLogoUpload = async (file: File) => {
    setUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("folder", "site");
      const res = await axios.post("/uploads/image", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (res.data && res.data.public_id) {
        update("logo", res.data.public_id);
      }
    } catch (err) {
      console.error("Failed to upload logo:", err);
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSave = async () => {
    try {
      await axios.put("/admin/settings", settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("Failed to save settings:", err);
    }
  };

  const update = (path: string, value: string) => {
    setSettings((prev) => {
      const copy = { ...prev };
      const keys = path.split(".");
      let obj: Record<string, unknown> = copy;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!obj[keys[i]]) obj[keys[i]] = {};
        obj = obj[keys[i]] as Record<string, unknown>;
      }
      obj[keys[keys.length - 1]] = value;

      // Sync social and socialLinks
      if (path.startsWith("social.")) {
        const sub = path.replace("social.", "");
        if (!copy.socialLinks) copy.socialLinks = { ...cmsWebsiteSettings.socialLinks };
        (copy.socialLinks as Record<string, unknown>)[sub] = value;
      }

      if (path === "contact.whatsapp") {
        if (!copy.whatsapp) copy.whatsapp = { number: value };
        (copy.whatsapp as Record<string, unknown>).number = value;
      }

      // Sync shipping aliases
      if (path.startsWith("shipping.")) {
        if (!copy.shipping) copy.shipping = { ...cmsWebsiteSettings.shipping };
        const sh = copy.shipping as Record<string, unknown>;
        if (path === "shipping.freeThreshold") sh.freeDeliveryThreshold = Number(value) || 0;
        if (path === "shipping.standardRate") sh.flatRate = Number(value) || 0;
      }
      return copy;
    });
  };

  const readPath = (path: string): string =>
    path.split(".").reduce<unknown>(
      (o, k) => (o as Record<string, unknown> | undefined)?.[k] ?? "",
      settings as Record<string, unknown>
    ) as string;

  const field = (label: string, path: string, placeholder = "", type = "text") => (
    <div>
      <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em]">{label}</label>
      <input type={type} value={readPath(path)} onChange={(e) => update(path, e.target.value)} placeholder={placeholder} className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm text-[color:var(--color-text-primary)] placeholder:text-[color:var(--color-text-tertiary)]" />
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
                <div>
                  <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em]">Store Logo (Cloudinary)</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={readPath("logo")}
                      onChange={(e) => update("logo", e.target.value)}
                      placeholder="khattak-eye/site/logo"
                      className="flex-1 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm text-[color:var(--color-text-primary)]"
                    />
                    <label className="cursor-pointer inline-flex items-center rounded-xl bg-[color:var(--color-brand-primary)] px-3.5 py-2.5 text-xs font-semibold text-white transition-all hover:bg-black">
                      {uploadingLogo ? "Uploading…" : "Upload"}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleLogoUpload(file);
                        }}
                      />
                    </label>
                  </div>
                </div>
                {field("Favicon URL", "favicon", "/favicon.ico")}
                {field("Primary Color", "theme.primaryColor", "#111111")}
                {field("Accent Color", "theme.accentColor", "#B6191B")}
                {field("Border Radius", "theme.borderRadius", "16px")}
                {field("Hero Featured Product Count", "homepage.featuredProductCount", "3")}
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
                {field("WhatsApp Number", "contact.whatsapp", "+923001112222")}
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
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold">Payment Methods & Accounts</h3>
                <p className="mt-0.5 text-xs text-[color:var(--color-text-tertiary)]">Configure active payment methods and details presented to customers at checkout.</p>
              </div>

              {/* Cash on Delivery */}
              <div className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-primary)]">Cash on Delivery (COD)</span>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium">
                    <input
                      type="checkbox"
                      checked={Boolean(readPath("payment.cod.active") ?? true)}
                      onChange={(e) => update("payment.cod.active", e.target.checked as unknown as string)}
                      className="h-4 w-4 rounded border-[color:var(--color-border)] text-[color:var(--color-brand-primary)]"
                    />
                    <span>Active for Checkout</span>
                  </label>
                </div>
                <div className="mt-3">
                  {field("Instructions / Note", "payment.cod.instructions", "Pay cash upon delivery at your doorstep.")}
                </div>
              </div>

              {/* Bank Transfer */}
              <div className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-primary)]">Bank Transfer</span>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium">
                    <input
                      type="checkbox"
                      checked={Boolean(readPath("payment.bankTransfer.active") ?? true)}
                      onChange={(e) => update("payment.bankTransfer.active", e.target.checked as unknown as string)}
                      className="h-4 w-4 rounded border-[color:var(--color-border)] text-[color:var(--color-brand-primary)]"
                    />
                    <span>Active for Checkout</span>
                  </label>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {field("Bank Name", "payment.bankTransfer.bankName", "Meezan Bank")}
                  {field("Account Title", "payment.bankTransfer.accountTitle", "Khattak Eyewear Pvt Ltd")}
                  {field("Account Number", "payment.bankTransfer.accountNumber", "01020304050607")}
                  {field("IBAN", "payment.bankTransfer.iban", "PK36MEZN0001020304050607")}
                </div>
              </div>

              {/* JazzCash */}
              <div className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-primary)]">JazzCash</span>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium">
                    <input
                      type="checkbox"
                      checked={Boolean(readPath("payment.jazzcash.active") ?? true)}
                      onChange={(e) => update("payment.jazzcash.active", e.target.checked as unknown as string)}
                      className="h-4 w-4 rounded border-[color:var(--color-border)] text-[color:var(--color-brand-primary)]"
                    />
                    <span>Active for Checkout</span>
                  </label>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {field("Mobile Number", "payment.jazzcash.number", "03001234567")}
                  {field("Account Title", "payment.jazzcash.accountTitle", "Khattak Eyewear")}
                </div>
              </div>

              {/* EasyPaisa */}
              <div className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-primary)]">EasyPaisa</span>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium">
                    <input
                      type="checkbox"
                      checked={Boolean(readPath("payment.easypaisa.active") ?? true)}
                      onChange={(e) => update("payment.easypaisa.active", e.target.checked as unknown as string)}
                      className="h-4 w-4 rounded border-[color:var(--color-border)] text-[color:var(--color-brand-primary)]"
                    />
                    <span>Active for Checkout</span>
                  </label>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {field("Mobile Number", "payment.easypaisa.number", "03001234567")}
                  {field("Account Title", "payment.easypaisa.accountTitle", "Khattak Eyewear")}
                </div>
              </div>

              {/* Custom Payment Methods */}
              <div className="space-y-4 pt-4 border-t border-[color:var(--color-border)]">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-primary)]">Custom Payment Methods</h4>
                    <p className="text-xs text-[color:var(--color-text-tertiary)]">Add custom options like SadaPay, NayaPay, Raast, or specialized wallets.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newMethod = {
                        id: `custom-${Date.now()}`,
                        name: "New Payment Method",
                        accountTitle: "Khattak Eyewear",
                        accountNumber: "",
                        instructions: "Transfer payment to this account and upload receipt.",
                        active: true
                      };
                      setSettings((prev) => {
                        const currentPayment = (prev.payment || cmsWebsiteSettings.payment) as typeof cmsWebsiteSettings.payment;
                        const currentCustom = Array.isArray(currentPayment.customMethods)
                          ? currentPayment.customMethods
                          : [];
                        return {
                          ...prev,
                          payment: {
                            ...cmsWebsiteSettings.payment,
                            ...currentPayment,
                            customMethods: [...currentCustom, newMethod]
                          }
                        };
                      });
                    }}
                    className="flex items-center gap-1.5 rounded-xl bg-[color:var(--color-brand-primary)] px-3.5 py-2 text-xs font-semibold text-white transition-all hover:bg-black"
                  >
                    + Add Custom Payment Method
                  </button>
                </div>

                {((settings.payment as typeof cmsWebsiteSettings.payment | undefined)?.customMethods || []).map((method, index) => (
                  <div key={method.id || index} className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={method.name || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSettings((prev) => {
                            const currentPayment = (prev.payment || cmsWebsiteSettings.payment) as typeof cmsWebsiteSettings.payment;
                            const currentCustom = Array.isArray(currentPayment.customMethods) ? currentPayment.customMethods : [];
                            const nextCustom = currentCustom.map((m, i) => i === index ? { ...m, name: val } : m);
                            return {
                              ...prev,
                              payment: {
                                ...cmsWebsiteSettings.payment,
                                ...currentPayment,
                                customMethods: nextCustom
                              }
                            };
                          });
                        }}
                        placeholder="Method Name (e.g. SadaPay, Raast)"
                        className="font-semibold text-sm bg-transparent border-b border-[color:var(--color-border)] pb-1 focus:border-[color:var(--color-brand-primary)] focus:outline-none text-[color:var(--color-text-primary)]"
                      />
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-medium">
                          <input
                            type="checkbox"
                            checked={method.active !== false}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setSettings((prev) => {
                                const currentPayment = (prev.payment || cmsWebsiteSettings.payment) as typeof cmsWebsiteSettings.payment;
                                const currentCustom = Array.isArray(currentPayment.customMethods) ? currentPayment.customMethods : [];
                                const nextCustom = currentCustom.map((m, i) => i === index ? { ...m, active: checked } : m);
                                return {
                                  ...prev,
                                  payment: {
                                    ...cmsWebsiteSettings.payment,
                                    ...currentPayment,
                                    customMethods: nextCustom
                                  }
                                };
                              });
                            }}
                            className="h-4 w-4 rounded border-[color:var(--color-border)] text-[color:var(--color-brand-primary)]"
                          />
                          <span>Active for Checkout</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setSettings((prev) => {
                              const currentPayment = (prev.payment || cmsWebsiteSettings.payment) as typeof cmsWebsiteSettings.payment;
                              const currentCustom = Array.isArray(currentPayment.customMethods) ? currentPayment.customMethods : [];
                              const nextCustom = currentCustom.filter((_, i) => i !== index);
                              return {
                                ...prev,
                                payment: {
                                  ...cmsWebsiteSettings.payment,
                                  ...currentPayment,
                                  customMethods: nextCustom
                                }
                              };
                            });
                          }}
                          className="text-xs font-medium text-rose-600 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em]">Account Title</label>
                        <input
                          type="text"
                          value={method.accountTitle || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSettings((prev) => {
                              const currentPayment = (prev.payment || cmsWebsiteSettings.payment) as typeof cmsWebsiteSettings.payment;
                              const currentCustom = Array.isArray(currentPayment.customMethods) ? currentPayment.customMethods : [];
                              const nextCustom = currentCustom.map((m, i) => i === index ? { ...m, accountTitle: val } : m);
                              return {
                                ...prev,
                                payment: {
                                  ...cmsWebsiteSettings.payment,
                                  ...currentPayment,
                                  customMethods: nextCustom
                                }
                              };
                            });
                          }}
                          placeholder="e.g. Khattak Eyewear"
                          className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-3 py-2 text-xs"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em]">Account Number / Phone / IBAN</label>
                        <input
                          type="text"
                          value={method.accountNumber || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSettings((prev) => {
                              const currentPayment = (prev.payment || cmsWebsiteSettings.payment) as typeof cmsWebsiteSettings.payment;
                              const currentCustom = Array.isArray(currentPayment.customMethods) ? currentPayment.customMethods : [];
                              const nextCustom = currentCustom.map((m, i) => i === index ? { ...m, accountNumber: val } : m);
                              return {
                                ...prev,
                                payment: {
                                  ...cmsWebsiteSettings.payment,
                                  ...currentPayment,
                                  customMethods: nextCustom
                                }
                              };
                            });
                          }}
                          placeholder="e.g. 03001234567"
                          className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-3 py-2 text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em]">Instructions / Note for Customer</label>
                      <input
                        type="text"
                        value={method.instructions || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSettings((prev) => {
                            const currentPayment = (prev.payment || cmsWebsiteSettings.payment) as typeof cmsWebsiteSettings.payment;
                            const currentCustom = Array.isArray(currentPayment.customMethods) ? currentPayment.customMethods : [];
                            const nextCustom = currentCustom.map((m, i) => i === index ? { ...m, instructions: val } : m);
                            return {
                              ...prev,
                              payment: {
                                ...cmsWebsiteSettings.payment,
                                ...currentPayment,
                                customMethods: nextCustom
                              }
                            };
                          });
                        }}
                        placeholder="Instructions displayed at checkout"
                        className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-3 py-2 text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeSection === "shipping" && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Shipping Settings</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {field("Free Shipping Threshold (Rs.)", "shipping.freeThreshold", "15000")}
                {field("Standard Rate (Rs.)", "shipping.standardRate", "350")}
                {field("Express Rate (Rs.)", "shipping.expressRate", "750")}
                {field("Estimated Days Text", "shipping.estimatedDays", "3-5 business days")}
                {field("Min Delivery Days", "shipping.estimatedDaysMin", "1", "number")}
                {field("Max Delivery Days", "shipping.estimatedDaysMax", "7", "number")}
              </div>
            </div>
          )}
          {activeSection === "policies" && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Store Policy Settings</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {field("Return Window (Days)", "policies.returnWindowDays", "14", "number")}
                {field("Warranty Duration (Years)", "policies.warrantyYears", "2", "number")}
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
