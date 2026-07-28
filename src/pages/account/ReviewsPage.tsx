import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Plus, Pencil, ImagePlus, X } from "lucide-react";
import { AccountLayout } from "@/components/account/AccountLayout";
import { mockReviews, type ReviewItem } from "@/lib/account-data";
import { Button } from "@/components/primitives/Button";
import { cn } from "@/lib/utils";

type Tab = "published" | "pending";

export function ReviewsPage() {
  const [reviews, setReviews] = useState(mockReviews);
  const [activeTab, setActiveTab] = useState<Tab>("published");
  const [showForm, setShowForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 0, title: "", text: "" });

  const filtered = reviews.filter((r) => r.status === activeTab);

  const addReview = () => {
    if (!newReview.rating || !newReview.title || !newReview.text) return;
    const item: ReviewItem = {
      id: `rev-${Date.now()}`,
      productId: "kt-new",
      productName: "New Product",
      productImage: "",
      productBrand: "Khattak",
      ...newReview,
      date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      status: "pending",
    };
    setReviews((prev) => [item, ...prev]);
    setNewReview({ rating: 0, title: "", text: "" });
    setShowForm(false);
  };

  return (
    <AccountLayout title="My Reviews" subtitle="Share your feedback on products">
      <div className="flex items-center justify-between">
        <div className="flex gap-1.5">
          {(["published", "pending"] as Tab[]).map((tab) => (
            <button key={tab} type="button" onClick={() => setActiveTab(tab)} className={cn("rounded-lg px-3.5 py-1.5 text-xs font-medium capitalize transition-colors", activeTab === tab ? "bg-[color:var(--color-brand-primary)] text-white" : "bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)]")}>
              {tab} ({reviews.filter((r) => r.status === tab).length})
            </button>
          ))}
        </div>
        <Button variant="outline" iconLeft={<Plus className="h-3.5 w-3.5" />} onClick={() => setShowForm(!showForm)} className="text-xs">Write Review</Button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-4 overflow-hidden">
            <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-5">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-[color:var(--color-text-primary)]">Write a Review</h4>
                <button type="button" onClick={() => setShowForm(false)}><X className="h-4 w-4 text-[color:var(--color-text-tertiary)]" /></button>
              </div>
              <div className="mt-4 flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} type="button" onClick={() => setNewReview((p) => ({ ...p, rating: star }))}>
                    <Star className={cn("h-6 w-6 transition-colors", star <= newReview.rating ? "fill-amber-400 text-amber-400" : "text-[color:var(--color-text-tertiary)]")} />
                  </button>
                ))}
              </div>
              <input type="text" value={newReview.title} onChange={(e) => setNewReview((p) => ({ ...p, title: e.target.value }))} placeholder="Review title" className="mt-4 w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm text-[color:var(--color-text-primary)] placeholder:text-[color:var(--color-text-tertiary)] focus:border-[color:var(--color-accent-teal)] focus:outline-none focus:ring-4 focus:ring-[color:var(--color-focus-ring)]" />
              <textarea value={newReview.text} onChange={(e) => setNewReview((p) => ({ ...p, text: e.target.value }))} rows={3} placeholder="Write your review..." className="mt-3 w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-4 py-2.5 text-sm text-[color:var(--color-text-primary)] placeholder:text-[color:var(--color-text-tertiary)] focus:border-[color:var(--color-accent-teal)] focus:outline-none focus:ring-4 focus:ring-[color:var(--color-focus-ring)]" />
              <div className="mt-3 flex items-center gap-3">
                <button type="button" className="flex items-center gap-1.5 rounded-lg border border-[color:var(--color-border)] px-3 py-2 text-xs text-[color:var(--color-text-secondary)] transition-colors hover:bg-[color:var(--color-surface-muted)]">
                  <ImagePlus className="h-3.5 w-3.5" /> Add Images
                </button>
                <Button variant="primary" onClick={addReview} className="text-xs">Submit Review</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-6 space-y-4">
        <AnimatePresence>
          {filtered.length === 0 ? (
            <div className="py-12 text-center">
              <Star className="mx-auto h-10 w-10 text-[color:var(--color-text-tertiary)]" />
              <p className="mt-3 text-sm text-[color:var(--color-text-secondary)]">No {activeTab} reviews yet.</p>
            </div>
          ) : (
            filtered.map((review, i) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-5"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[color:var(--color-surface-muted)]">
                    {review.productImage ? (
                      <img src={review.productImage} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <Star className="h-5 w-5 text-[color:var(--color-text-tertiary)]" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-[color:var(--color-text-primary)]">{review.productName}</p>
                      {review.status === "pending" && <span className="rounded-lg bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-600">Pending</span>}
                    </div>
                    <p className="text-xs text-[color:var(--color-text-tertiary)]">{review.productBrand}</p>
                    <div className="mt-1.5 flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i2) => (
                        <Star key={i2} className={cn("h-3.5 w-3.5", i2 < review.rating ? "fill-amber-400 text-amber-400" : "text-[color:var(--color-text-tertiary)]")} />
                      ))}
                      <span className="ml-2 text-[10px] text-[color:var(--color-text-tertiary)]">{review.date}</span>
                    </div>
                    <p className="mt-1.5 text-sm font-medium text-[color:var(--color-text-primary)]">{review.title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-[color:var(--color-text-secondary)]">{review.text}</p>
                    <div className="mt-3 flex gap-2">
                      <button type="button" className="flex items-center gap-1 text-[10px] text-[color:var(--color-text-tertiary)] hover:text-[color:var(--color-accent-blue)]"><Pencil className="h-3 w-3" /> Edit</button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </AccountLayout>
  );
}
