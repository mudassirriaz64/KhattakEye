import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Plus, Edit3, Trash2, X, Star } from "lucide-react";
import { adminTestimonials } from "@/lib/admin-data";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { Button } from "@/components/primitives/Button";
import axios from "@/lib/api/axios";
import { cn } from "@/lib/utils";

const defaultForm = { name: "", role: "", text: "", rating: 5, featured: false, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop" };

type TestimonialView = {
  id: string;
  name: string;
  role: string;
  avatar: string | null;
  text: string;
  rating: number;
  featured: boolean;
  createdAt: string;
  status?: "active" | "inactive";
};

export function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<TestimonialView[]>(adminTestimonials);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<TestimonialView | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await axios.get("/admin/testimonials");
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setTestimonials(res.data.map((t: { _id: string; customerName: string; text: string; rating: number; isActive: boolean; customerImage?: string; createdAt?: string }) => ({
          id: t._id,
          name: t.customerName,
          role: "Verified Customer",
          text: t.text,
          rating: t.rating,
          featured: t.isActive,
          avatar: t.customerImage || null,
          createdAt: t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "Recent"
        })));
      }
    } catch {
      /* testimonial list is optional; keep existing data */
    }
  };

  const resetForm = () => setForm(defaultForm);

  const openEdit = (t: TestimonialView) => {
    setForm({ name: t.name, role: t.role || "", text: t.text, rating: t.rating, featured: t.featured, avatar: t.avatar || "" });
    setEditing(t);
    setShowForm(true);
  };

  const saveTestimonial = async () => {
    try {
      const payload = {
        customerName: form.name,
        customerImage: form.avatar,
        rating: form.rating,
        text: form.text,
        isActive: form.featured
      };

      if (editing && editing.id && !editing.id.startsWith("tst-")) {
        await axios.put(`/admin/testimonials/${editing.id}`, payload);
      } else {
        await axios.post("/admin/testimonials", payload);
      }
      await fetchTestimonials();
    } catch (err) {
      console.error("Failed to save testimonial:", err);
    }
    setShowForm(false);
    setEditing(null);
    resetForm();
  };

  const removeTestimonial = async () => {
    if (deleteId) {
      if (!deleteId.startsWith("tst-")) {
        try {
          await axios.delete(`/admin/testimonials/${deleteId}`);
        } catch {
          /* best-effort delete on the server */
        }
      }
      setTestimonials((prev) => prev.filter((t) => t.id !== deleteId));
      setDeleteId(null);
    }
  };

  const toggleFeatured = (id: string) => setTestimonials((prev) => prev.map((t) => t.id === id ? { ...t, featured: !t.featured } : t));

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-[color:var(--color-text-primary)] md:text-3xl">Testimonials</h1>
          <p className="mt-0.5 text-sm text-[color:var(--color-text-secondary)]">{testimonials.length} testimonials</p>
        </div>
        <Button variant="primary" iconLeft={<Plus className="h-4 w-4" />} onClick={() => { resetForm(); setEditing(null); setShowForm(true); }} className="text-xs">Add Testimonial</Button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mb-6 overflow-hidden">
          <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-5">
            <div className="flex items-center justify-between"><h3 className="text-sm font-semibold">{editing ? "Edit" : "New"} Testimonial</h3><button type="button" onClick={() => setShowForm(false)}><X className="h-4 w-4" /></button></div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div><label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em]">Name</label><input type="text" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm" /></div>
              <div><label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em]">Role</label><input type="text" value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))} className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm" /></div>
              <div className="sm:col-span-2"><label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em]">Testimonial</label><textarea rows={3} value={form.text} onChange={(e) => setForm((p) => ({ ...p, text: e.target.value }))} className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm" /></div>
              <div>
                <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em]">Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button key={s} type="button" onClick={() => setForm((p) => ({ ...p, rating: s }))}><Star className={cn("h-5 w-5", s <= form.rating ? "fill-amber-400 text-amber-400" : "text-[color:var(--color-text-tertiary)]")} /></button>
                  ))}
                </div>
              </div>
              <div className="flex items-end gap-4">
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.featured} onChange={(e) => setForm((p) => ({ ...p, featured: e.target.checked }))} className="h-4 w-4 rounded" /><span className="text-xs">Featured / Active</span></label>
              </div>
            </div>
            <div className="mt-4 flex gap-2"><Button variant="primary" onClick={saveTestimonial} className="text-xs">{editing ? "Update" : "Create"}</Button><Button variant="ghost" onClick={() => setShowForm(false)} className="text-xs">Cancel</Button></div>
          </div>
        </motion.div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence>
          {testimonials.map((t, i) => (
            <motion.div key={t.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.04 }} className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-5">
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[color:var(--color-surface-muted)]">
                  <MessageSquare className="h-6 w-6 text-[color:var(--color-text-tertiary)]" />
                </div>
                <div className="flex gap-1">
                  <button type="button" onClick={() => openEdit(t)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[color:var(--color-text-tertiary)] hover:text-[color:var(--color-accent-teal)]"><Edit3 className="h-3.5 w-3.5" /></button>
                  <button type="button" onClick={() => setDeleteId(t.id)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[color:var(--color-text-tertiary)] hover:text-[color:var(--color-danger)]"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-text-secondary)] italic">"{t.text}"</p>
              <div className="mt-4 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, s) => <Star key={s} className={cn("h-3.5 w-3.5", s < t.rating ? "fill-amber-400 text-amber-400" : "text-[color:var(--color-text-tertiary)]")} />)}
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-[color:var(--color-text-primary)]">{t.name}</p>
                  <p className="text-[10px] text-[color:var(--color-text-tertiary)]">{t.role}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => toggleFeatured(t.id)} className={cn("text-[10px] font-semibold", t.featured ? "text-amber-500" : "text-[color:var(--color-text-tertiary)]")}>
                    {t.featured ? "Featured" : "Set Featured"}
                  </button>
                  <StatusBadge status={t.status || "active"} />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {testimonials.length === 0 && <div className="py-16 text-center"><MessageSquare className="mx-auto h-10 w-10" /><p className="mt-3 text-sm">No testimonials yet.</p></div>}

      <ConfirmModal open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={removeTestimonial} title="Delete Testimonial" message="This will permanently remove this testimonial." confirmLabel="Delete" variant="danger" />
    </div>
  );
}
