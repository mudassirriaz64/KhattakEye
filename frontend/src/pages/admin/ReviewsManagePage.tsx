import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Search, CheckCircle, XCircle, MessageSquare, Heart, Sparkles } from "lucide-react";
import { adminReviewsManage } from "@/lib/admin-data";
import { cn } from "@/lib/utils";
import axios from "@/lib/api/axios";

type Tab = "pending" | "approved" | "rejected";

type ReviewRow = {
  id: string;
  product: string;
  productImage: string;
  customer: string;
  rating: number;
  date: string;
  status: "pending" | "approved" | "rejected";
  featured: boolean;
  title: string;
  text: string;
  reply?: string;
};

export function AdminReviewsManagePage() {
  const [reviews, setReviews] = useState<ReviewRow[]>(adminReviewsManage);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("pending");
  const [replyText, setReplyText] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await axios.get("/admin/reviews");
      if (res.data && res.data.items && Array.isArray(res.data.items) && res.data.items.length > 0) {
        setReviews(res.data.items.map((r: { _id: string; productName?: string; product?: { name?: string; images?: string[] }; productImage?: string; user?: { fullName?: string }; rating: number; text: string; createdAt?: string; status?: string; adminReply?: string }) => ({
          id: r._id,
          product: r.productName || r.product?.name || "Product",
          productImage: r.productImage || r.product?.images?.[0] || "",
          customer: r.user?.fullName || "Customer",
          rating: r.rating,
          comment: r.text,
          date: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "Recent",
          status: r.status === "published" ? "approved" : r.status,
          reply: r.adminReply || undefined
        })));
      }
    } catch {
      /* review list is optional; keep existing data */
    }
  };

  const filtered = reviews.filter((r) => {
    const matchTab = r.status === activeTab;
    const matchSearch = !search || r.product.toLowerCase().includes(search.toLowerCase()) || r.customer.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const toggleFeatured = (id: string) => {
    setReviews((prev) => prev.map((r) => r.id === id ? { ...r, featured: !r.featured } : r));
  };

  const updateStatus = async (id: string, status: "approved" | "rejected") => {
    const apiStatus = status === "approved" ? "published" : "rejected";
    try {
      await axios.put(`/admin/reviews/${id}/status`, { status: apiStatus });
      await fetchReviews();
    } catch {
      setReviews((prev) => prev.map((r) => r.id === id ? { ...r, status } : r));
    }
  };

  const setReply = async (id: string, reply: string) => {
    try {
      await axios.put(`/admin/reviews/${id}/status`, { adminReply: reply });
      await fetchReviews();
    } catch {
      setReviews((prev) => prev.map((r) => r.id === id ? { ...r, reply } : r));
    }
    setReplyText(null);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl text-[color:var(--color-text-primary)] md:text-3xl">Reviews</h1>
        <p className="mt-0.5 text-sm text-[color:var(--color-text-secondary)]">{reviews.filter((r) => r.status === "pending").length} pending reviews</p>
      </div>

      <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)]">
        <div className="flex flex-col gap-4 border-b border-[color:var(--color-border)] p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--color-text-tertiary)]" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search reviews..." className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] py-2.5 pl-10 pr-4 text-sm" />
          </div>
          {(["pending", "approved", "rejected"] as Tab[]).map((tab) => (
            <button key={tab} type="button" onClick={() => setActiveTab(tab)} className={cn("rounded-lg px-3.5 py-1.5 text-xs font-medium capitalize transition-colors", activeTab === tab ? "bg-[color:var(--color-brand-primary)] text-white" : "bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)]")}>
              {tab} ({reviews.filter((r) => r.status === tab).length})
            </button>
          ))}
        </div>

        <div className="space-y-3 p-4">
          <AnimatePresence>
            {filtered.map((review, i) => (
              <motion.div key={review.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.03 }} className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-app-bg)] p-4">
                <div className="flex items-start gap-4">
                  <img src={review.productImage} alt="" className="h-14 w-14 shrink-0 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-[color:var(--color-text-primary)]">{review.product}</p>
                        <div className="mt-0.5 flex items-center gap-2">
                          <span className="text-xs text-[color:var(--color-text-tertiary)]">{review.customer}</span>
                          <div className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, s) => (
                              <Star key={s} className={cn("h-3 w-3", s < review.rating ? "fill-amber-400 text-amber-400" : "text-[color:var(--color-text-tertiary)]")} />
                            ))}
                          </div>
                          <span className="text-[10px] text-[color:var(--color-text-tertiary)]">{review.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {review.featured && <Sparkles className="h-3.5 w-3.5 text-amber-500" />}
                        <button type="button" onClick={() => toggleFeatured(review.id)} className={cn("flex h-7 w-7 items-center justify-center rounded-lg text-xs", review.featured ? "text-amber-500" : "text-[color:var(--color-text-tertiary)] hover:text-amber-500")}>
                          <Heart className="h-3.5 w-3.5" />
                        </button>
                        {activeTab === "pending" && (
                          <>
                            <button type="button" onClick={() => updateStatus(review.id, "approved")} className="flex h-7 w-7 items-center justify-center rounded-lg text-emerald-500 hover:bg-emerald-500/10"><CheckCircle className="h-3.5 w-3.5" /></button>
                            <button type="button" onClick={() => updateStatus(review.id, "rejected")} className="flex h-7 w-7 items-center justify-center rounded-lg text-red-500 hover:bg-red-500/10"><XCircle className="h-3.5 w-3.5" /></button>
                          </>
                        )}
                      </div>
                    </div>
                    <p className="mt-1.5 text-sm font-medium text-[color:var(--color-text-primary)]">{review.title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-[color:var(--color-text-secondary)]">{review.text}</p>
                    {review.reply && (
                      <div className="mt-3 rounded-lg bg-[color:var(--color-surface-muted)] p-3">
                        <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[color:var(--color-accent-teal)]"><MessageSquare className="h-3 w-3" /> Your Reply</div>
                        <p className="mt-1 text-xs text-[color:var(--color-text-secondary)]">{review.reply}</p>
                      </div>
                    )}
                    <div className="mt-2 flex gap-2">
                      <button type="button" onClick={() => setReplyText(review.id)} className="flex items-center gap-1 text-[10px] text-[color:var(--color-text-tertiary)] hover:text-[color:var(--color-accent-teal)]">
                        <MessageSquare className="h-3 w-3" /> Reply
                      </button>
                    </div>
                    {replyText === review.id && (
                      <div className="mt-3">
                        <textarea placeholder="Write your reply..." rows={2} className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-3 py-2 text-xs" />
                        <div className="mt-2 flex gap-2">
                          <button type="button" onClick={() => setReply(review.id, "Thank you for your feedback!")} className="rounded-lg bg-[color:var(--color-brand-primary)] px-3 py-1.5 text-[10px] font-semibold text-white">Send Reply</button>
                          <button type="button" onClick={() => setReplyText(null)} className="rounded-lg border border-[color:var(--color-border)] px-3 py-1.5 text-[10px]">Cancel</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
