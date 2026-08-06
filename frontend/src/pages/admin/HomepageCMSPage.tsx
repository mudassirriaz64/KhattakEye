import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, GripVertical } from "lucide-react";
import { cmsHomepageSections } from "@/lib/admin-data";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { cn } from "@/lib/utils";

export function AdminHomepageCMSPage() {
  const [sections, setSections] = useState(cmsHomepageSections);

  const toggleVisibility = (id: string) => {
    setSections((prev) => prev.map((s) => s.id === id ? { ...s, visible: !s.visible } : s));
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-[color:var(--color-text-primary)] md:text-3xl">Homepage CMS</h1>
          <p className="mt-0.5 text-sm text-[color:var(--color-text-secondary)]">Manage homepage sections visibility and order</p>
        </div>
      </div>

      <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)]">
        <div className="border-b border-[color:var(--color-border)] px-5 py-4">
          <p className="text-xs font-medium text-[color:var(--color-text-secondary)]">{sections.filter((s) => s.visible).length} of {sections.length} sections visible</p>
        </div>
        <div className="divide-y divide-[color:var(--color-border)]">
          {sections.sort((a, b) => a.order - b.order).map((section, i) => (
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
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[color:var(--color-text-tertiary)]">Order: {section.order}</span>
                <button type="button" onClick={() => toggleVisibility(section.id)} className={cn("flex h-8 w-8 items-center justify-center rounded-lg transition-colors", section.visible ? "bg-emerald-500/10 text-emerald-600" : "bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-tertiary)]")}>
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
