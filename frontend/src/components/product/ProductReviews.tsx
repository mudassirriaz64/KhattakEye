import { useState, useEffect } from "react";
import { Star, Send, CheckCircle2, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "@/lib/api/axios";
import { useAuthStore } from "@/lib/stores/auth-store";
import { Button } from "@/components/primitives/Button";

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

  const displayReviews = liveReviews.length > 0 ? liveReviews : initialReviews;

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-[300px_1fr] items-start">
        {/* Rating Summary Header Card */}
        <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 text-center shadow-xs">
          <p className="font-display text-6xl text-[color:var(--color-text-primary)]">{rating}</p>
          <div className="mt-3 flex items-center justify-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={cn("h-5 w-5", i < Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-[color:var(--color-border)]")} />
            ))}
          </div>
          <p className="mt-2 text-sm font-medium text-[color:var(--color-text-primary)]">Based on {reviewCount} Verified Buyer Reviews</p>
          <div className="mt-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-800 font-medium">
            <CheckCircle2 className="mx-auto h-4 w-4 text-emerald-600 mb-1" />
            100% Verified Customer Feedback
          </div>
        </div>

        {/* Customer Reviews List */}
        <div className="space-y-4">
          {displayReviews.length === 0 ? (
            <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-12 text-center">
              <Star className="mx-auto h-10 w-10 text-[color:var(--color-text-tertiary)]" />
              <h4 className="mt-3 font-display text-base font-bold text-[color:var(--color-text-primary)]">No Customer Reviews Yet</h4>
              <p className="mt-1 text-xs text-[color:var(--color-text-secondary)]">
                Be the first to order and review this frame! Verified buyer reviews can be submitted directly from your account orders dashboard.
              </p>
            </div>
          ) : (
            displayReviews.map((review, idx) => (
              <div key={review._id || review.id || idx} className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 shadow-xs space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--color-brand-primary)] text-xs font-bold text-white uppercase shadow-xs">
                      {(review.user?.fullName || review.customer || review.name || "Customer").charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-[color:var(--color-text-primary)]">
                          {review.user?.fullName || review.customer || review.name || "Valued Customer"}
                        </p>
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[9px] font-bold text-emerald-700 uppercase tracking-wider border border-emerald-500/20">
                          <CheckCircle2 className="h-3 w-3" /> Verified Buyer
                        </span>
                      </div>
                      <p className="text-xs text-[color:var(--color-text-tertiary)]">
                        {review.createdAt ? new Date(review.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : review.date || "Recent"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={cn("h-4 w-4", i < review.rating ? "fill-amber-400 text-amber-400" : "text-[color:var(--color-border)]")} />
                    ))}
                  </div>
                </div>

                {review.title && <h5 className="text-sm font-bold text-[color:var(--color-text-primary)]">{review.title}</h5>}
                <p className="text-xs leading-relaxed text-[color:var(--color-text-secondary)]">{review.text}</p>

                {/* Attached Customer Photos & Videos */}
                {((review.images && review.images.length > 0) || (review.videos && review.videos.length > 0)) && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {review.images?.map((img, imgIdx) => (
                      <div key={imgIdx} className="h-16 w-16 overflow-hidden rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)]">
                        <img src={img} alt="Customer photo" className="h-full w-full object-cover hover:scale-110 transition-transform cursor-pointer" />
                      </div>
                    ))}
                    {review.videos?.map((vid, vidIdx) => (
                      <div key={vidIdx} className="h-16 w-16 overflow-hidden rounded-xl border border-[color:var(--color-border)] bg-black">
                        <video src={vid} controls className="h-full w-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}

                {review.adminReply && (
                  <div className="mt-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5 text-xs leading-relaxed">
                    <span className="font-bold text-amber-900">Khattak Concierge Reply: </span>
                    <span className="text-[color:var(--color-text-secondary)]">{review.adminReply}</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
