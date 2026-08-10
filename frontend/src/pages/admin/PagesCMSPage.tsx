import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, Plus, Edit3, Trash2, X, Check } from "lucide-react";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { Button } from "@/components/primitives/Button";
import axios from "@/lib/api/axios";

export type AdminFaq = {
  _id?: string;
  id?: string;
  question: string;
  answer: string;
  targetPages: string[];
  category: string;
  order: number;
  isActive: boolean;
};

const AVAILABLE_PAGES = [
  { id: "home", label: "Homepage" },
  { id: "blue-light", label: "Blue Light Glasses" },
  { id: "computer", label: "Computer Glasses" },
  { id: "anti-glare", label: "Anti-Glare Glasses" },
  { id: "photochromic", label: "Photochromic Glasses" },
  { id: "general", label: "General FAQ Page" }
];

const faqFormDefault = {
  question: "",
  answer: "",
  targetPages: ["general"],
  category: "General",
  order: 1,
  isActive: true
};

export function AdminPagesCMSPage() {
  const [faqs, setFaqs] = useState<AdminFaq[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingFaq, setEditingFaq] = useState<AdminFaq | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [faqForm, setFaqForm] = useState(faqFormDefault);

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/admin/faqs");
      if (res.data && Array.isArray(res.data)) {
        setFaqs(res.data);
      }
    } catch (err) {
      console.error("Failed to load FAQs:", err);
    } finally {
      setLoading(false);
    }
  };

  const resetFaqForm = () => setFaqForm(faqFormDefault);

  const openEditFaq = (f: AdminFaq) => {
    setFaqForm({
      question: f.question,
      answer: f.answer,
      targetPages: f.targetPages && f.targetPages.length > 0 ? f.targetPages : ["general"],
      category: f.category || "General",
      order: f.order || 1,
      isActive: f.isActive !== undefined ? f.isActive : true
    });
    setEditingFaq(f);
    setShowForm(true);
  };

  const togglePageTarget = (pageId: string) => {
    setFaqForm((prev) => {
      const exists = prev.targetPages.includes(pageId);
      const updated = exists
        ? prev.targetPages.filter((p) => p !== pageId)
        : [...prev.targetPages, pageId];
      return { ...prev, targetPages: updated };
    });
  };

  const saveForm = async () => {
    try {
      const payload = {
        question: faqForm.question,
        answer: faqForm.answer,
        targetPages: faqForm.targetPages.length > 0 ? faqForm.targetPages : ["general"],
        category: faqForm.category,
        order: faqForm.order,
        isActive: faqForm.isActive
      };

      if (editingFaq && editingFaq._id) {
        await axios.put(`/admin/faqs/${editingFaq._id}`, payload);
      } else {
        await axios.post("/admin/faqs", payload);
      }
      await fetchFaqs();
    } catch (err) {
      console.error("Failed to save FAQ:", err);
    }
    setShowForm(false);
    setEditingFaq(null);
    resetFaqForm();
  };

  const removeFaq = async () => {
    if (deleteId) {
      try {
        await axios.delete(`/admin/faqs/${deleteId}`);
        await fetchFaqs();
      } catch (err) {
        console.error("Failed to delete FAQ:", err);
      }
      setDeleteId(null);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-[color:var(--color-text-primary)] md:text-3xl">FAQ Management</h1>
          <p className="mt-0.5 text-sm text-[color:var(--color-text-secondary)]">Create FAQs and assign them across multiple storefront pages</p>
        </div>
        <Button
          variant="primary"
          iconLeft={<Plus className="h-4 w-4" />}
          onClick={() => {
            resetFaqForm();
            setEditingFaq(null);
            setShowForm(true);
          }}
          className="text-xs"
        >
          Add New FAQ
        </Button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mb-6 overflow-hidden">
          <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-5 shadow-lg">
            <div className="flex items-center justify-between border-b border-[color:var(--color-border)] pb-3">
              <h3 className="text-sm font-bold text-[color:var(--color-text-primary)]">{editingFaq ? "Edit FAQ" : "New FAQ Entry"}</h3>
              <button type="button" onClick={() => setShowForm(false)} className="text-[color:var(--color-text-tertiary)] hover:text-[color:var(--color-text-primary)]">
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-tertiary)]">Question</label>
                <input
                  type="text"
                  value={faqForm.question}
                  onChange={(e) => setFaqForm((p) => ({ ...p, question: e.target.value }))}
                  placeholder="e.g. Do Computer Glasses Really Work?"
                  className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm text-[color:var(--color-text-primary)] focus:border-[color:var(--color-brand-primary)] focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-tertiary)]">Answer</label>
                <textarea
                  rows={4}
                  value={faqForm.answer}
                  onChange={(e) => setFaqForm((p) => ({ ...p, answer: e.target.value }))}
                  placeholder="Enter detailed answer here..."
                  className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm text-[color:var(--color-text-primary)] focus:border-[color:var(--color-brand-primary)] focus:outline-none"
                />
              </div>

              {/* Multi-Page Target Assignment Checkboxes */}
              <div className="sm:col-span-2 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-app-bg)] p-4">
                <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-brand-primary)]">
                  Assign to Pages (Multi-Select)
                </label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {AVAILABLE_PAGES.map((page) => {
                    const isSelected = faqForm.targetPages.includes(page.id);
                    return (
                      <button
                        key={page.id}
                        type="button"
                        onClick={() => togglePageTarget(page.id)}
                        className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                          isSelected
                            ? "border-[color:var(--color-brand-primary)] bg-[color:var(--color-brand-soft)]/20 text-[color:var(--color-brand-primary)] font-semibold shadow-sm"
                            : "border-[color:var(--color-border)] bg-[color:var(--color-panel)] text-[color:var(--color-text-secondary)] hover:border-[color:var(--color-text-tertiary)]"
                        }`}
                      >
                        <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${isSelected ? "border-[color:var(--color-brand-primary)] bg-[color:var(--color-brand-primary)] text-white" : "border-[color:var(--color-border)]"}`}>
                          {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>
                        <span className="truncate">{page.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-tertiary)]">Category</label>
                <input
                  type="text"
                  value={faqForm.category}
                  onChange={(e) => setFaqForm((p) => ({ ...p, category: e.target.value }))}
                  placeholder="General / Coatings / Prescriptions"
                  className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm text-[color:var(--color-text-primary)]"
                />
              </div>

              <div>
                <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-tertiary)]">Display Order</label>
                <input
                  type="number"
                  min={1}
                  value={faqForm.order}
                  onChange={(e) => setFaqForm((p) => ({ ...p, order: parseInt(e.target.value) || 1 }))}
                  className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm text-[color:var(--color-text-primary)]"
                />
              </div>

              <div className="flex items-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={faqForm.isActive}
                    onChange={(e) => setFaqForm((p) => ({ ...p, isActive: e.target.checked }))}
                    className="h-4 w-4 rounded border-[color:var(--color-border)] text-[color:var(--color-brand-primary)]"
                  />
                  <span className="text-xs font-medium text-[color:var(--color-text-primary)]">Active & Visible</span>
                </label>
              </div>
            </div>

            <div className="mt-5 flex gap-2 pt-2 border-t border-[color:var(--color-border)]">
              <Button variant="primary" onClick={saveForm} className="text-xs">
                {editingFaq ? "Update FAQ" : "Save FAQ"}
              </Button>
              <Button variant="ghost" onClick={() => setShowForm(false)} className="text-xs">
                Cancel
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* FAQ List Cards */}
      <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] shadow-sm">
        <div className="border-b border-[color:var(--color-border)] px-5 py-4 flex items-center justify-between">
          <p className="text-xs font-semibold text-[color:var(--color-text-secondary)]">
            Total {faqs.length} FAQs configured in database
          </p>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-[color:var(--color-text-tertiary)]">Loading FAQs...</div>
        ) : (
          <div className="divide-y divide-[color:var(--color-border)]">
            <AnimatePresence>
              {faqs.map((faq, i) => (
                <motion.div
                  key={faq._id || faq.id || i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between hover:bg-[color:var(--color-surface-muted)]/50 transition-colors"
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-sm text-[color:var(--color-text-primary)]">{faq.question}</span>
                      <StatusBadge status={faq.isActive ? "active" : "inactive"} />
                    </div>
                    <p className="text-xs text-[color:var(--color-text-secondary)] line-clamp-2 leading-relaxed">{faq.answer}</p>
                    
                    {/* Display assigned target pages */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[color:var(--color-text-tertiary)] mr-1">Appears on:</span>
                      {(faq.targetPages || ["general"]).map((target) => (
                        <span key={target} className="rounded-full bg-[color:var(--color-brand-soft)]/20 px-2.5 py-0.5 text-[10px] font-semibold text-[color:var(--color-brand-primary)] border border-[color:var(--color-brand-primary)]/20">
                          {AVAILABLE_PAGES.find((p) => p.id === target)?.label || target}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0">
                    <button
                      type="button"
                      onClick={() => openEditFaq(faq)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-[color:var(--color-text-tertiary)] hover:bg-[color:var(--color-surface-muted)] hover:text-[color:var(--color-text-primary)] transition-colors"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteId(faq._id || faq.id || null)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-[color:var(--color-text-tertiary)] hover:bg-red-500/10 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <ConfirmModal open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={removeFaq} title="Delete FAQ" message="Are you sure you want to delete this FAQ entry?" />
    </div>
  );
}
