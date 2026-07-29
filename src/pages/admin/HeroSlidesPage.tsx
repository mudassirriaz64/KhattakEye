import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Eye, EyeOff, GripVertical, Copy, Trash2, ChevronDown, ChevronUp,
  ImageIcon, Link as LinkIcon, Calendar,
} from "lucide-react";
import { Button } from "@/components/primitives/Button";
import { heroSlides, type HeroSlide } from "@/lib/hero-data";
import { cn } from "@/lib/utils";

type SlideForm = Partial<HeroSlide>;

const emptyForm: SlideForm = {
  headline: "",
  subtitle: "",
  primaryCta: { label: "", link: "" },
  active: true,
  order: heroSlides.length + 1,
  animationStyle: "fade",
};

export function HeroSlidesPage() {
  const [slides, setSlides] = useState(heroSlides);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<SlideForm>(emptyForm);
  const [showForm, setShowForm] = useState(false);

  const handleToggle = (id: string) => {
    setSlides((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s)),
    );
  };

  const handleDuplicate = (slide: HeroSlide) => {
    const newSlide = {
      ...slide,
      id: `${slide.id}-copy-${Date.now()}`,
      headline: `${slide.headline} (Copy)`,
      order: slides.length + 1,
    };
    setSlides((prev) => [...prev, newSlide]);
  };

  const handleDelete = (id: string) => {
    setSlides((prev) => prev.filter((s) => s.id !== id));
  };

  const handleMove = (id: string, direction: "up" | "down") => {
    setSlides((prev) => {
      const idx = prev.findIndex((s) => s.id === id);
      if (idx < 0) return prev;
      const newIdx = direction === "up" ? idx - 1 : idx + 1;
      if (newIdx < 0 || newIdx >= prev.length) return prev;
      const copy = [...prev];
      [copy[idx], copy[newIdx]] = [copy[newIdx], copy[idx]];
      return copy.map((s, i) => ({ ...s, order: i + 1 }));
    });
  };

  const handleEdit = (slide: HeroSlide) => {
    setForm(slide);
    setEditing(slide.id);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.headline) return;
    if (editing) {
      setSlides((prev) =>
        prev.map((s) => (s.id === editing ? { ...s, ...form } : s)),
      );
    }
    setShowForm(false);
    setEditing(null);
    setForm(emptyForm);
  };

  const handleAdd = () => {
    setForm({ ...emptyForm, id: `slide-${Date.now()}`, order: slides.length + 1 });
    setEditing(null);
    setShowForm(true);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-[color:var(--color-text-primary)]">Hero Slides</h1>
          <p className="mt-1 text-sm text-[color:var(--color-text-secondary)]">
            Manage your cinematic hero carousel slides
          </p>
        </div>
        <Button variant="primary" onClick={handleAdd} iconLeft={<Plus className="h-4 w-4" />}>
          Add Slide
        </Button>
      </div>

      {/* Slide editor panel */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-8 overflow-hidden rounded-2xl border border-[color:var(--color-border)]"
          >
            <div className="space-y-5 p-6">
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[color:var(--color-text-secondary)]">Headline</label>
                  <input
                    value={form.headline || ""}
                    onChange={(e) => setForm((f) => ({ ...f, headline: e.target.value }))}
                    className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm text-[color:var(--color-text-primary)] outline-none focus:border-[color:var(--color-accent-teal)]"
                    placeholder="Premium Eyewear Collection"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[color:var(--color-text-secondary)]">Highlighted Text</label>
                  <input
                    value={form.highlightedText || ""}
                    onChange={(e) => setForm((f) => ({ ...f, highlightedText: e.target.value }))}
                    className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm text-[color:var(--color-text-primary)] outline-none focus:border-[color:var(--color-accent-teal)]"
                    placeholder="Define Your Vision."
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-semibold text-[color:var(--color-text-secondary)]">Subtitle</label>
                  <textarea
                    value={form.subtitle || ""}
                    onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
                    rows={2}
                    className="w-full resize-none rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm text-[color:var(--color-text-primary)] outline-none focus:border-[color:var(--color-accent-teal)]"
                    placeholder="Crafted for confidence..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[color:var(--color-text-secondary)]">
                    <LinkIcon className="mr-1 inline h-3 w-3" />
                    Primary CTA Label
                  </label>
                  <input
                    value={form.primaryCta?.label || ""}
                    onChange={(e) => setForm((f) => ({ ...f, primaryCta: { ...f.primaryCta!, label: e.target.value, link: f.primaryCta?.link || "" } }))}
                    className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm text-[color:var(--color-text-primary)] outline-none focus:border-[color:var(--color-accent-teal)]"
                    placeholder="Shop Collection"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[color:var(--color-text-secondary)]">
                    <LinkIcon className="mr-1 inline h-3 w-3" />
                    Primary CTA Link
                  </label>
                  <input
                    value={form.primaryCta?.link || ""}
                    onChange={(e) => setForm((f) => ({ ...f, primaryCta: { ...f.primaryCta!, label: f.primaryCta?.label || "", link: e.target.value } }))}
                    className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm text-[color:var(--color-text-primary)] outline-none focus:border-[color:var(--color-accent-teal)]"
                    placeholder="/shop"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[color:var(--color-text-secondary)]">
                    <ImageIcon className="mr-1 inline h-3 w-3" />
                    Desktop Image URL
                  </label>
                  <input
                    value={form.desktopImage || ""}
                    onChange={(e) => setForm((f) => ({ ...f, desktopImage: e.target.value }))}
                    className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm text-[color:var(--color-text-primary)] outline-none focus:border-[color:var(--color-accent-teal)]"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[color:var(--color-text-secondary)]">
                    <ImageIcon className="mr-1 inline h-3 w-3" />
                    Mobile Image URL
                  </label>
                  <input
                    value={form.mobileImage || ""}
                    onChange={(e) => setForm((f) => ({ ...f, mobileImage: e.target.value }))}
                    className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm text-[color:var(--color-text-primary)] outline-none focus:border-[color:var(--color-accent-teal)]"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[color:var(--color-text-secondary)]">Offer Badge</label>
                  <input
                    value={form.offerBadge || ""}
                    onChange={(e) => setForm((f) => ({ ...f, offerBadge: e.target.value }))}
                    className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm text-[color:var(--color-text-primary)] outline-none focus:border-[color:var(--color-accent-teal)]"
                    placeholder="Free Shipping"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[color:var(--color-text-secondary)]">Discount Badge</label>
                  <input
                    value={form.discountBadge || ""}
                    onChange={(e) => setForm((f) => ({ ...f, discountBadge: e.target.value }))}
                    className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm text-[color:var(--color-text-primary)] outline-none focus:border-[color:var(--color-accent-teal)]"
                    placeholder="Up to 30% Off"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[color:var(--color-text-secondary)]">
                    <Calendar className="mr-1 inline h-3 w-3" />
                    Schedule From
                  </label>
                  <input
                    type="date"
                    value={form.scheduledFrom || ""}
                    onChange={(e) => setForm((f) => ({ ...f, scheduledFrom: e.target.value }))}
                    className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm text-[color:var(--color-text-primary)] outline-none focus:border-[color:var(--color-accent-teal)]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[color:var(--color-text-secondary)]">
                    <Calendar className="mr-1 inline h-3 w-3" />
                    Schedule To
                  </label>
                  <input
                    type="date"
                    value={form.scheduledTo || ""}
                    onChange={(e) => setForm((f) => ({ ...f, scheduledTo: e.target.value }))}
                    className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm text-[color:var(--color-text-primary)] outline-none focus:border-[color:var(--color-accent-teal)]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[color:var(--color-text-secondary)]">Animation Style</label>
                  <select
                    value={form.animationStyle || "fade"}
                    onChange={(e) => setForm((f) => ({ ...f, animationStyle: e.target.value as HeroSlide["animationStyle"] }))}
                    className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm text-[color:var(--color-text-primary)] outline-none focus:border-[color:var(--color-accent-teal)]"
                  >
                    <option value="fade">Fade</option>
                    <option value="zoom">Zoom</option>
                    <option value="kenBurns">Ken Burns</option>
                    <option value="parallax">Parallax</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[color:var(--color-text-secondary)]">Active</label>
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, active: !f.active }))}
                      className={cn(
                        "relative h-6 w-11 rounded-full transition-colors",
                        form.active ? "bg-[color:var(--color-accent-teal)]" : "bg-[color:var(--color-border-strong)]",
                      )}
                    >
                      <span
                        className={cn(
                          "absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform",
                          form.active && "translate-x-5",
                        )}
                      />
                    </button>
                    <span className="text-sm text-[color:var(--color-text-secondary)]">
                      {form.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="primary" onClick={handleSave}>
                  {editing ? "Update Slide" : "Create Slide"}
                </Button>
                <Button variant="ghost" onClick={() => { setShowForm(false); setEditing(null); setForm(emptyForm); }}>
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slides table */}
      <div className="space-y-3">
        {slides
          .sort((a, b) => a.order - b.order)
          .map((slide, i) => (
            <motion.div
              key={slide.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="group flex items-center gap-4 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-4"
            >
              <div className="flex flex-col gap-0.5 text-[color:var(--color-text-tertiary)]">
                <button
                  type="button"
                  onClick={() => handleMove(slide.id, "up")}
                  disabled={i === 0}
                  className="disabled:opacity-20"
                >
                  <ChevronUp className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  onClick={() => handleMove(slide.id, "down")}
                  disabled={i === slides.length - 1}
                  className="disabled:opacity-20"
                >
                  <ChevronDown className="h-3 w-3" />
                </button>
              </div>

              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[color:var(--color-surface-muted)]">
                {slide.desktopImage ? (
                  <img src={slide.desktopImage} alt="" className="h-full w-full object-cover" />
                ) : (
                  <ImageIcon className="h-5 w-5 text-[color:var(--color-text-tertiary)]" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[color:var(--color-text-primary)]">
                  {slide.headline}
                </p>
                <p className="truncate text-xs text-[color:var(--color-text-tertiary)]">
                  {slide.subtitle || "No subtitle"}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="rounded bg-[color:var(--color-surface-muted)] px-2 py-0.5 text-[10px] text-[color:var(--color-text-tertiary)]">
                    Order {slide.order}
                  </span>
                  <span className="rounded bg-[color:var(--color-surface-muted)] px-2 py-0.5 text-[10px] text-[color:var(--color-text-tertiary)]">
                    {slide.animationStyle}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleToggle(slide.id)}
                  className="rounded-lg p-2 text-[color:var(--color-text-tertiary)] transition-colors hover:bg-[color:var(--color-surface-muted)] hover:text-[color:var(--color-text-primary)]"
                  aria-label={slide.active ? "Deactivate" : "Activate"}
                >
                  {slide.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => handleDuplicate(slide)}
                  className="rounded-lg p-2 text-[color:var(--color-text-tertiary)] transition-colors hover:bg-[color:var(--color-surface-muted)] hover:text-[color:var(--color-text-primary)]"
                  aria-label="Duplicate"
                >
                  <Copy className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleEdit(slide)}
                  className="rounded-lg p-2 text-[color:var(--color-text-tertiary)] transition-colors hover:bg-[color:var(--color-surface-muted)] hover:text-[color:var(--color-text-primary)]"
                  aria-label="Edit"
                >
                  <LinkIcon className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(slide.id)}
                  className="rounded-lg p-2 text-[color:var(--color-text-tertiary)] transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/20"
                  aria-label="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
      </div>
    </div>
  );
}
