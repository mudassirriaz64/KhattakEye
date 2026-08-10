import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, GripVertical, Save, Check } from "lucide-react";
import { cmsHomepageSections, type CmsHomepageSection } from "@/lib/admin-data";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/primitives/Button";
import { cn } from "@/lib/utils";
import axios from "@/lib/api/axios";

export function AdminHomepageCMSPage() {
  const [sections, setSections] = useState<CmsHomepageSection[]>(cmsHomepageSections);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    axios.get("/settings")
      .then((res) => {
        if (res.data && Array.isArray(res.data.homepageSections) && res.data.homepageSections.length > 0) {
          setSections(res.data.homepageSections);
        }
      })
      .catch(() => {});
  }, []);

  const toggleVisibility = (id: string) => {
    setSections((prev) => prev.map((s) => s.id === id ? { ...s, visible: !s.visible } : s));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put("/admin/settings", { homepageSections: sections });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("Failed to save homepage CMS settings:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-[color:var(--color-text-primary)] md:text-3xl">Homepage CMS</h1>
          <p className="mt-0.5 text-sm text-[color:var(--color-text-secondary)]">Manage homepage sections visibility and layout dynamically</p>
        </div>
        <Button
          variant="primary"
          iconLeft={saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          onClick={handleSave}
          disabled={saving}
          className="text-xs"
        >
          {saved ? "Saved!" : saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)]">
        <div className="border-b border-[color:var(--color-border)] px-5 py-4 flex items-center justify-between">
          <p className="text-xs font-medium text-[color:var(--color-text-secondary)]">
            {sections.filter((s) => s.visible).length} of {sections.length} sections active on client homepage
          </p>
        </div>
        <div className="divide-y divide-[color:var(--color-border)]">
          {[...sections].sort((a, b) => a.order - b.order).map((section, i) => (
            <motion.div key={section.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="flex items-center gap-4 px-5 py-4">
              <GripVertical className="h-4 w-4 shrink-0 text-[color:var(--color-text-tertiary)]" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-[color:var(--color-text-primary)] capitalize">{section.section.replace(/-/g, " ")}</span>
                  <StatusBadge status={section.visible ? "active" : "inactive"} />
                </div>
                <p className="mt-0.5 text-sm text-[color:var(--color-text-primary)]">{section.title}</p>
                <p className="text-[10px] text-[color:var(--color-text-tertiary)]">{section.subtitle}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-[color:var(--color-text-tertiary)] font-medium">Order: {section.order}</span>
                <button
                  type="button"
                  onClick={() => toggleVisibility(section.id)}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                    section.visible ? "bg-emerald-500/10 text-emerald-600" : "bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-tertiary)]"
                  )}
                >
                  {section.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
