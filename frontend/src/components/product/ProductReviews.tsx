import { useState, useEffect } from "react";
import { Star, CheckCircle2, ChevronLeft, ChevronRight, Filter, LayoutGrid, SlidersHorizontal, Image, Video } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import axios from "@/lib/api/axios";

type ReviewItem = {
  _id?: string;
  id?: string;
  user?: { fullName?: string };
  customer?: string;
  name?: string;
  createdAt?: string;
  date?: string;
  rating: number;
  title?: string;
  text: string;
  images?: string[];
  videos?: string[];
  adminReply?: string;
};

type ProductReviewsProps = {
  productId?: string;
  reviews?: ReviewItem[];
  rating: number;
  reviewCount: number;
};

export function ProductReviews({ productId, reviews: initialReviews = [], rating, reviewCount }: ProductReviewsProps) {
  const [liveReviews, setLiveReviews] = useState<ReviewItem[]>(initialReviews);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<"carousel" | "grid">("carousel");

  // Filters & Sorting
  const [starFilter, setStarFilter] = useState<number | "all">("all");
  const [mediaOnly, setMediaOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"newest" | "highest" | "lowest">("newest");

  useEffect(() => {
    if (productId) {
      axios.get(`/reviews/product/${productId}`)
        .then((res) => {
          if (res.data && res.data.items) {
            setLiveReviews(res.data.items);
          }
        })
        .catch(() => {});
    }
  }, [productId]);

  const rawReviews = liveReviews.length > 0 ? liveReviews : initialReviews;

  // Filter & Sort Logic
  const filteredReviews = rawReviews
    .filter((r) => {
      if (starFilter !== "all" && r.rating !== starFilter) return false;
      if (mediaOnly && (!r.images || r.images.length === 0) && (!r.videos || r.videos.length === 0)) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "highest") return b.rating - a.rating;
      if (sortBy === "lowest") return a.rating - b.rating;
      const dateA = new Date(a.createdAt || a.date || 0).getTime();
      const dateB = new Date(b.createdAt || b.date || 0).getTime();
      return dateB - dateA;
    });

  // Calculate Rating Breakdown Counts
  const ratingCounts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  rawReviews.forEach((r) => {
    if (ratingCounts[r.rating] !== undefined) {
      ratingCounts[r.rating]++;
    }
  });

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : filteredReviews.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < filteredReviews.length - 1 ? prev + 1 : 0));
  };

  const safeIndex = Math.min(currentIndex, Math.max(0, filteredReviews.length - 1));
  const activeReview = filteredReviews[safeIndex];

  return (
    <div className="space-y-6">
      {/* Unified Hero Rating Breakdown Banner */}
      <div className="rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 sm:p-8 shadow-xs">
        <div className="grid gap-6 md:grid-cols-3 items-center">
          {/* Rating Score */}
          <div className="text-center md:text-left border-b md:border-b-0 md:border-r border-[color:var(--color-border)] pb-6 md:pb-0 md:pr-6">
            <div className="flex items-baseline justify-center md:justify-start gap-2">
              <span className="font-display text-5xl font-bold text-[color:var(--color-text-primary)]">{rating}</span>
              <span className="text-sm text-[color:var(--color-text-tertiary)] font-medium">/ 5.0</span>
            </div>
            <div className="mt-2 flex items-center justify-center md:justify-start gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={cn("h-4 w-4", i < Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-[color:var(--color-border)]")} />
              ))}
            </div>
            <p className="mt-2 text-xs font-semibold text-[color:var(--color-text-secondary)]">
              Based on {reviewCount} Verified Buyer {reviewCount === 1 ? "Review" : "Reviews"}
            </p>
          </div>

          {/* Star Progress Bars */}
          <div className="space-y-1.5 border-b md:border-b-0 md:border-r border-[color:var(--color-border)] pb-6 md:pb-0 md:pr-6">
            {[5, 4, 3, 2, 1].map((s) => {
              const count = ratingCounts[s] || 0;
              const pct = rawReviews.length > 0 ? (count / rawReviews.length) * 100 : 0;
              return (
                <div key={s} className="flex items-center gap-2 text-xs">
                  <span className="w-5 font-semibold text-[color:var(--color-text-tertiary)]">{s}★</span>
                  <div className="flex-1 h-2 rounded-full bg-[color:var(--color-surface-muted)] overflow-hidden border border-[color:var(--color-border)]">
                    <div className="h-full bg-amber-400 transition-all duration-500" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-6 text-right text-[10px] font-semibold text-[color:var(--color-text-tertiary)]">{count}</span>
                </div>
              );
            })}
          </div>

          {/* Verified Guarantee Badge */}
          <div className="text-center space-y-2">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <h5 className="text-sm font-bold text-[color:var(--color-text-primary)]">100% Verified Buyer Reviews</h5>
              <p className="mt-0.5 text-xs text-[color:var(--color-text-tertiary)]">Only confirmed purchasers with delivered orders can submit reviews.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sleek Integrated Filter Toolbar */}
      <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Star Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => { setStarFilter("all"); setCurrentIndex(0); }}
              className={cn(
                "rounded-xl px-3 py-1.5 text-xs font-bold transition-all",
                starFilter === "all" ? "bg-[color:var(--color-brand-primary)] text-white shadow-xs" : "bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)]"
              )}
            >
              All ({rawReviews.length})
            </button>
            {[5, 4, 3, 2, 1].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => { setStarFilter(s); setCurrentIndex(0); }}
                className={cn(
                  "inline-flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs font-semibold transition-all",
                  starFilter === s ? "bg-[color:var(--color-brand-primary)] text-white shadow-xs" : "bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)]"
                )}
              >
                <span>{s}★</span>
                <span className="opacity-70 text-[10px]">({ratingCounts[s] || 0})</span>
              </button>
            ))}

            <button
              type="button"
              onClick={() => { setMediaOnly(!mediaOnly); setCurrentIndex(0); }}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all border",
                mediaOnly ? "border-purple-600 bg-purple-600/10 text-purple-700 font-bold" : "border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-secondary)]"
              )}
            >
              <Image className="h-3.5 w-3.5 text-purple-600" />
              <span>With Media</span>
            </button>
          </div>

          {/* Sort & View Mode Switcher */}
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-3 py-1.5 text-xs font-semibold text-[color:var(--color-text-primary)] outline-none cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="highest">Highest Rated</option>
              <option value="lowest">Lowest Rated</option>
            </select>

            <div className="flex rounded-xl border border-[color:var(--color-border)] p-0.5 bg-[color:var(--color-surface-muted)]">
              <button
                type="button"
                title="Rolling Slider View"
                onClick={() => setViewMode("carousel")}
                className={cn(
                  "rounded-lg p-1.5 transition-all",
                  viewMode === "carousel" ? "bg-[color:var(--color-brand-primary)] text-white shadow-xs" : "text-[color:var(--color-text-tertiary)] hover:text-[color:var(--color-text-primary)]"
                )}
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                title="Grid View"
                onClick={() => setViewMode("grid")}
                className={cn(
                  "rounded-lg p-1.5 transition-all",
                  viewMode === "grid" ? "bg-[color:var(--color-brand-primary)] text-white shadow-xs" : "text-[color:var(--color-text-tertiary)] hover:text-[color:var(--color-text-primary)]"
                )}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Container */}
      <div>
        {filteredReviews.length === 0 ? (
          <div className="rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-12 text-center">
            <Star className="mx-auto h-10 w-10 text-[color:var(--color-text-tertiary)]" />
            <h4 className="mt-3 font-display text-base font-bold text-[color:var(--color-text-primary)]">No Matching Reviews</h4>
            <p className="mt-1 text-xs text-[color:var(--color-text-secondary)]">
              Try adjusting your rating or media filters above to view more buyer feedback.
            </p>
          </div>
        ) : viewMode === "carousel" ? (
          /* Rolling Slider View */
          <div className="rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 sm:p-8 shadow-xs space-y-6">
            {/* Header Controls inside Slider */}
            <div className="flex items-center justify-between border-b border-[color:var(--color-border)] pb-4">
              <div>
                <span className="text-xs font-bold text-[color:var(--color-brand-primary)] uppercase tracking-wider">Verified Customer Feedback</span>
                <p className="text-xs text-[color:var(--color-text-tertiary)] mt-0.5">
                  Review {safeIndex + 1} of {filteredReviews.length}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] text-[color:var(--color-text-primary)] transition-all hover:bg-[color:var(--color-surface-muted)] hover:scale-105"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] text-[color:var(--color-text-primary)] transition-all hover:bg-[color:var(--color-surface-muted)] hover:scale-105"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Rolling Review Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeReview._id || activeReview.id || safeIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[color:var(--color-brand-primary)] text-sm font-bold text-white uppercase shadow-sm">
                      {(activeReview.user?.fullName || activeReview.customer || activeReview.name || "Customer").charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-[color:var(--color-text-primary)]">
                          {activeReview.user?.fullName || activeReview.customer || activeReview.name || "Valued Customer"}
                        </p>
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 uppercase tracking-wider border border-emerald-500/20">
                          <CheckCircle2 className="h-3 w-3" /> Verified Buyer
                        </span>
                      </div>
                      <p className="text-xs text-[color:var(--color-text-tertiary)]">
                        {activeReview.createdAt ? new Date(activeReview.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : activeReview.date || "Recent"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={cn("h-4 w-4", i < activeReview.rating ? "fill-amber-400 text-amber-400" : "text-[color:var(--color-border)]")} />
                    ))}
                  </div>
                </div>

                {activeReview.title && <h5 className="text-base font-bold text-[color:var(--color-text-primary)]">{activeReview.title}</h5>}
                <p className="text-sm leading-relaxed text-[color:var(--color-text-secondary)] font-sans">{activeReview.text}</p>

                {/* Attached Customer Photos & Videos */}
                {((activeReview.images && activeReview.images.length > 0) || (activeReview.videos && activeReview.videos.length > 0)) && (
                  <div className="flex flex-wrap gap-3 pt-2">
                    {activeReview.images?.map((img, imgIdx) => (
                      <div key={imgIdx} className="h-20 w-20 overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] shadow-xs">
                        <img src={img} alt="Customer photo" className="h-full w-full object-cover hover:scale-110 transition-transform cursor-pointer" />
                      </div>
                    ))}
                    {activeReview.videos?.map((vid, vidIdx) => (
                      <div key={vidIdx} className="h-20 w-20 overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-black shadow-xs">
                        <video src={vid} controls className="h-full w-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}

                {activeReview.adminReply && (
                  <div className="mt-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs leading-relaxed">
                    <span className="font-bold text-amber-900">Khattak Concierge Reply: </span>
                    <span className="text-[color:var(--color-text-secondary)]">{activeReview.adminReply}</span>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Slider Dots Navigation */}
            {filteredReviews.length > 1 && (
              <div className="flex items-center justify-center gap-1.5 border-t border-[color:var(--color-border)] pt-4">
                {filteredReviews.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={cn(
                      "h-2 rounded-full transition-all",
                      safeIndex === idx ? "w-6 bg-[color:var(--color-brand-primary)]" : "w-2 bg-[color:var(--color-border)] hover:bg-[color:var(--color-text-tertiary)]"
                    )}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Grid View */
          <div className="grid gap-4 md:grid-cols-2">
            {filteredReviews.map((review, idx) => (
              <div key={review._id || review.id || idx} className="rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 shadow-xs space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--color-brand-primary)] text-xs font-bold text-white uppercase shadow-xs">
                      {(review.user?.fullName || review.customer || review.name || "Customer").charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[color:var(--color-text-primary)]">
                        {review.user?.fullName || review.customer || review.name || "Valued Customer"}
                      </p>
                      <p className="text-[10px] text-[color:var(--color-text-tertiary)]">
                        {review.createdAt ? new Date(review.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : review.date || "Recent"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={cn("h-3.5 w-3.5", i < review.rating ? "fill-amber-400 text-amber-400" : "text-[color:var(--color-border)]")} />
                    ))}
                  </div>
                </div>

                {review.title && <h5 className="text-xs font-bold text-[color:var(--color-text-primary)]">{review.title}</h5>}
                <p className="text-xs leading-relaxed text-[color:var(--color-text-secondary)]">{review.text}</p>

                {/* Attached Customer Photos & Videos */}
                {((review.images && review.images.length > 0) || (review.videos && review.videos.length > 0)) && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {review.images?.map((img, imgIdx) => (
                      <div key={imgIdx} className="h-14 w-14 overflow-hidden rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)]">
                        <img src={img} alt="Customer photo" className="h-full w-full object-cover hover:scale-110 transition-transform cursor-pointer" />
                      </div>
                    ))}
                    {review.videos?.map((vid, vidIdx) => (
                      <div key={vidIdx} className="h-14 w-14 overflow-hidden rounded-xl border border-[color:var(--color-border)] bg-black">
                        <video src={vid} controls className="h-full w-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}

                {review.adminReply && (
                  <div className="mt-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-xs leading-relaxed">
                    <span className="font-bold text-amber-900">Concierge: </span>
                    <span className="text-[color:var(--color-text-secondary)]">{review.adminReply}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
