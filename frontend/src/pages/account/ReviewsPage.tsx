import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, CheckCircle, Package } from "lucide-react";
import { AccountLayout } from "@/components/account/AccountLayout";
import { cn } from "@/lib/utils";
import axios from "@/lib/api/axios";

type ApiReview = {
  _id: string;
  productName: string;
  productImage: string;
  productBrand: string;
  rating: number;
  title: string;
  text: string;
  images?: string[];
  videos?: string[];
  status: "published" | "pending" | "rejected";
  createdAt: string;
  product?: {
    _id: string;
    name: string;
    slug: string;
    images?: string[];
    brand?: string;
  };
};

type TabFilter = "all" | "published" | "pending";

export function ReviewsPage() {
  const [reviews, setReviews] = useState<ApiReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabFilter>("all");

  const fetchUserReviews = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/reviews/my-reviews");
      if (res.data && Array.isArray(res.data.items)) {
        setReviews(res.data.items);
      }
    } catch (err) {
      console.error("Failed to fetch user reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserReviews();
  }, []);

  const filteredReviews = reviews.filter((r) => {
    if (activeTab === "all") return true;
    return r.status === activeTab;
  });

  return (
    <AccountLayout title="My Product Reviews" subtitle="Verified reviews submitted for your purchased eyewear items">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex gap-1.5">
          {(["all", "published", "pending"] as TabFilter[]).map((tab) => {
            const count = tab === "all" ? reviews.length : reviews.filter((r) => r.status === tab).length;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "rounded-lg px-3.5 py-1.5 text-xs font-semibold capitalize transition-colors",
                  activeTab === tab
                    ? "bg-[color:var(--color-brand-primary)] text-white"
                    : "bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)]"
                )}
              >
                {tab} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center">
          <div className="h-8 w-8 animate-spin mx-auto rounded-full border-4 border-[color:var(--color-brand-primary)] border-t-transparent" />
          <p className="mt-2 text-xs text-[color:var(--color-text-tertiary)]">Loading your reviews...</p>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8">
          <Star className="mx-auto h-10 w-10 text-[color:var(--color-text-tertiary)]" />
          <h3 className="mt-3 font-display text-lg font-bold text-[color:var(--color-text-primary)]">
            {reviews.length === 0 ? "No Product Reviews Yet" : `No ${activeTab} reviews found`}
          </h3>
          <p className="mt-1 max-w-sm mx-auto text-xs text-[color:var(--color-text-secondary)]">
            Once your order is delivered or closed, you can submit verified reviews with photos & videos for your purchased items directly from your order history.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((review, i) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-5 shadow-xs"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[color:var(--color-surface-muted)] border border-[color:var(--color-border)]">
                  {review.productImage || review.product?.images?.[0] ? (
                    <img src={review.productImage || review.product?.images?.[0]} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <Package className="h-6 w-6 text-[color:var(--color-text-tertiary)]" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-bold text-[color:var(--color-text-primary)]">
                      {review.productName || review.product?.name || "Khattak Frame"}
                    </p>
                    <div className="flex items-center gap-2">
                      {review.status === "pending" && (
                        <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-600">Pending Approval</span>
                      )}
                      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                        <CheckCircle className="h-3 w-3" /> Verified Purchase
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-[color:var(--color-text-tertiary)]">{review.productBrand || review.product?.brand || "Khattak Atelier"}</p>
                  
                  <div className="mt-2 flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i2) => (
                      <Star key={i2} className={cn("h-4 w-4", i2 < review.rating ? "fill-amber-400 text-amber-400" : "text-[color:var(--color-text-tertiary)]")} />
                    ))}
                    <span className="ml-2 text-[10px] text-[color:var(--color-text-tertiary)]">
                      {new Date(review.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                    </span>
                  </div>

                  {review.title && <p className="mt-2 text-xs font-bold text-[color:var(--color-text-primary)]">{review.title}</p>}
                  <p className="mt-1 text-xs leading-relaxed text-[color:var(--color-text-secondary)]">{review.text}</p>

                  {/* Attached Customer Photos & Videos */}
                  {((review.images && review.images.length > 0) || (review.videos && review.videos.length > 0)) && (
                    <div className="flex flex-wrap gap-2 pt-3">
                      {review.images?.map((img, imgIdx) => (
                        <div key={imgIdx} className="h-14 w-14 overflow-hidden rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)]">
                          <img src={img} alt="Customer photo" className="h-full w-full object-cover" />
                        </div>
                      ))}
                      {review.videos?.map((vid, vidIdx) => (
                        <div key={vidIdx} className="h-14 w-14 overflow-hidden rounded-xl border border-[color:var(--color-border)] bg-black">
                          <video src={vid} controls className="h-full w-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </AccountLayout>
  );
}
