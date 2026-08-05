import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Plus, Edit3, Trash2, MessageSquare, X, HelpCircle } from "lucide-react";
import { cmsPages, cmsFaqs, type CmsPageContent, type CmsFaq } from "@/lib/admin-data";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { Button } from "@/components/primitives/Button";
import { cn } from "@/lib/utils";
import axios from "@/lib/api/axios";

type Tab = "pages" | "faqs";

const pageFormDefault = { slug: "", title: "", content: "", status: "published" as CmsPageContent["status"] };
const faqFormDefault = { question: "", answer: "", category: "General", order: 1, active: true };

export function AdminPagesCMSPage() {
  const [tab, setTab] = useState<Tab>("pages");
  const [pages, setPages] = useState<any[]>(cmsPages);
  const [faqs, setFaqs] = useState(cmsFaqs);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingPage, setEditingPage] = useState<any | null>(null);
  const [editingFaq, setEditingFaq] = useState<CmsFaq | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [pageForm, setPageForm] = useState(pageFormDefault);
  const [faqForm, setFaqForm] = useState(faqFormDefault);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const res = await axios.get("/admin/cms");
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setPages(res.data.map(p => ({
          id: p._id || p.slug,
          slug: p.slug,
          title: p.title,
          content: p.content,
          status: "published",
          updatedAt: p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : "Recently"
        })));
      }
    } catch (err) {}
  };

  const resetPageForm = () => setPageForm(pageFormDefault);
  const resetFaqForm = () => setFaqForm(faqFormDefault);

  const openEditPage = (p: CmsPageContent) => {
    setPageForm({ slug: p.slug, title: p.title, content: p.content, status: p.status });
    setEditingPage(p);
    setEditingFaq(null);
    setShowForm(true);
  };

  const openEditFaq = (f: CmsFaq) => {
    setFaqForm({ question: f.question, answer: f.answer, category: f.category, order: f.order, active: f.active });
    setEditingFaq(f);
    setEditingPage(null);
    setShowForm(true);
  };

  const saveForm = async () => {
    if (tab === "pages" || editingPage) {
      const targetSlug = pageForm.slug || (pageForm.title ? pageForm.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") : "new-page");
      try {
        await axios.put(`/admin/cms/${targetSlug}`, {
          title: pageForm.title,
          content: pageForm.content
        });
        await fetchPages();
      } catch (err) {
        console.error("Failed to save CMS page:", err);
      }
    } else if (editingFaq) {
      setFaqs((prev) => prev.map((f) => f.id === editingFaq.id ? { ...f, ...faqForm } : f));
    } else {
      const newFaq: CmsFaq = { id: `faq-${Date.now()}`, ...faqForm };
      setFaqs((prev) => [...prev, newFaq]);
    }
    setShowForm(false);
    setEditingPage(null);
    setEditingFaq(null);
    resetPageForm();
    resetFaqForm();
  };

  const removeItem = () => {
    if (deleteId) {
      setPages((prev) => prev.filter((p) => p.id !== deleteId));
      setFaqs((prev) => prev.filter((f) => f.id !== deleteId));
      setDeleteId(null);
    }
  };

  const tabs: { key: Tab; label: string; icon: typeof FileText }[] = [
    { key: "pages", label: "Static Pages", icon: FileText },
    { key: "faqs", label: "FAQs", icon: HelpCircle },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-[color:var(--color-text-primary)] md:text-3xl">Pages & FAQs</h1>
          <p className="mt-0.5 text-sm text-[color:var(--color-text-secondary)]">{tab === "pages" ? `${pages.length} pages` : `${faqs.length} FAQs`}</p>
        </div>
        <Button variant="primary" iconLeft={<Plus className="h-4 w-4" />} onClick={() => {
          resetPageForm(); resetFaqForm(); setEditingPage(null); setEditingFaq(null); setShowForm(true);
        }} className="text-xs">Add {tab === "pages" ? "Page" : "FAQ"}</Button>
      </div>

      <div className="mb-6 flex gap-1.5 rounded-xl bg-[color:var(--color-surface-muted)] p-1.5">
        {tabs.map((t) => (
          <button key={t.key} type="button" onClick={() => { setTab(t.key); setShowForm(false); }} className={cn("flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-medium transition-colors", tab === t.key ? "bg-[color:var(--color-panel)] text-[color:var(--color-text-primary)] shadow-[var(--shadow-soft)]" : "text-[color:var(--color-text-tertiary)] hover:text-[color:var(--color-text-primary)]")}>
            <t.icon className="h-3.5 w-3.5" /> {t.label}
          </button>
        ))}
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mb-6 overflow-hidden">
          <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">{editingPage ? "Edit Page" : editingFaq ? "Edit FAQ" : `New ${tab === "pages" ? "Page" : "FAQ"}`}</h3>
              <button type="button" onClick={() => setShowForm(false)}><X className="h-4 w-4" /></button>
            </div>
            {tab === "pages" ? (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div><label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em]">Title</label><input type="text" value={pageForm.title} onChange={(e) => setPageForm((p) => ({ ...p, title: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") }))} className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm" /></div>
                <div><label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em]">Slug</label><input type="text" value={pageForm.slug} onChange={(e) => setPageForm((p) => ({ ...p, slug: e.target.value }))} className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm" /></div>
                <div className="sm:col-span-2"><label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em]">Content (HTML)</label><textarea rows={5} value={pageForm.content} onChange={(e) => setPageForm((p) => ({ ...p, content: e.target.value }))} className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm" /></div>
                <div><label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em]">Status</label><select value={pageForm.status} onChange={(e) => setPageForm((p) => ({ ...p, status: e.target.value as "published" | "draft" }))} className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm">
                  <option value="draft">Draft</option><option value="published">Published</option>
                </select></div>
              </div>
            ) : (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2"><label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em]">Question</label><input type="text" value={faqForm.question} onChange={(e) => setFaqForm((p) => ({ ...p, question: e.target.value }))} className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm" /></div>
                <div className="sm:col-span-2"><label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em]">Answer</label><textarea rows={3} value={faqForm.answer} onChange={(e) => setFaqForm((p) => ({ ...p, answer: e.target.value }))} className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm" /></div>
                <div><label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em]">Category</label><input type="text" value={faqForm.category} onChange={(e) => setFaqForm((p) => ({ ...p, category: e.target.value }))} className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm" /></div>
                <div><label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em]">Order</label><input type="number" min={1} value={faqForm.order} onChange={(e) => setFaqForm((p) => ({ ...p, order: parseInt(e.target.value) || 1 }))} className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm" /></div>
                <div className="flex items-end gap-4">
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={faqForm.active} onChange={(e) => setFaqForm((p) => ({ ...p, active: e.target.checked }))} className="h-4 w-4 rounded" /><span className="text-xs">Active</span></label>
                </div>
              </div>
            )}
            <div className="mt-4 flex gap-2">
              <Button variant="primary" onClick={saveForm} className="text-xs">Save</Button>
              <Button variant="ghost" onClick={() => setShowForm(false)} className="text-xs">Cancel</Button>
            </div>
          </div>
        </motion.div>
      )}

      {tab === "pages" ? (
        <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)]">
          <div className="divide-y divide-[color:var(--color-border)]">
            <AnimatePresence>
              {pages.map((page, i) => (
                <motion.div key={page.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} transition={{ delay: i * 0.03 }} className="flex items-center gap-4 px-5 py-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[color:var(--color-surface-muted)]"><FileText className="h-4 w-4 text-[color:var(--color-text-tertiary)]" /></div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[color:var(--color-text-primary)]">{page.title}</p>
                    <p className="text-[10px] text-[color:var(--color-text-tertiary)]">/{page.slug} · Updated {page.updatedAt}</p>
                  </div>
                  <StatusBadge status={page.status} />
                  <div className="flex gap-1">
                    <button type="button" onClick={() => openEditPage(page)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[color:var(--color-text-tertiary)] hover:bg-[color:var(--color-surface-muted)]"><Edit3 className="h-3.5 w-3.5" /></button>
                    <button type="button" onClick={() => setDeleteId(page.id)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[color:var(--color-text-tertiary)] hover:bg-red-500/10 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      ) : (
        <div className="grid gap-3">
          <AnimatePresence>
            {faqs.sort((a, b) => a.order - b.order).map((faq, i) => (
              <motion.div key={faq.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} transition={{ delay: i * 0.03 }} className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-5">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="h-4 w-4 text-[color:var(--color-accent-teal)]" />
                      <span className="text-sm font-medium text-[color:var(--color-text-primary)]">{faq.question}</span>
                    </div>
                    <p className="mt-1 text-xs text-[color:var(--color-text-secondary)]">{faq.answer}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="rounded-lg bg-[color:var(--color-surface-muted)] px-2 py-0.5 text-[10px] font-medium text-[color:var(--color-text-tertiary)]">{faq.category}</span>
                      <StatusBadge status={faq.active ? "active" : "inactive"} />
                      <span className="text-[10px] text-[color:var(--color-text-tertiary)]">Order: {faq.order}</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button type="button" onClick={() => openEditFaq(faq)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[color:var(--color-text-tertiary)] hover:bg-[color:var(--color-surface-muted)]"><Edit3 className="h-3.5 w-3.5" /></button>
                    <button type="button" onClick={() => setDeleteId(faq.id)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[color:var(--color-text-tertiary)] hover:bg-red-500/10 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <ConfirmModal open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={removeItem} title={`Delete ${tab === "pages" ? "Page" : "FAQ"}`} message={`Are you sure you want to delete this ${tab === "pages" ? "page" : "FAQ"}?`} />
    </div>
  );
}
