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
  const [userRating, setUserRating] = useState(5);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId || !text.trim()) return;

    if (!isAuthenticated) {
      setErrorMsg("Please log in to leave a review.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");
    try {
      await axios.post("/reviews", {
        productId,
        rating: userRating,
        title,
        text
      });
      setSubmitted(true);
      setText("");
      setTitle("");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  const displayReviews = liveReviews.length > 0 ? liveReviews : initialReviews;

  return (
    <div className="space-y-8">
      <div className="grid gap-8 md:grid-cols-[1fr_1.5fr]">
        {/* Rating Summary */}
        <div className="text-center">
          <p className="font-display text-6xl text-[color:var(--color-text-primary)]">{rating}</p>
          <div className="mt-2 flex items-center justify-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={cn("h-4 w-4", i < Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-[color:var(--color-border)]")} />
            ))}
          </div>
          <p className="mt-1 text-sm text-[color:var(--color-text-secondary)]">{reviewCount} Verified Reviews</p>

          {/* Submission Form Card */}
          <div className="mt-8 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] p-5 text-left">
            <h4 className="font-display text-lg text-[color:var(--color-text-primary)] flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-[color:var(--color-brand-primary)]" />
              Write a Review
            </h4>
            
            {submitted ? (
              <div className="mt-4 rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-center text-xs text-green-700 font-medium">
                <CheckCircle2 className="mx-auto h-6 w-6 text-green-600 mb-1" />
                Thank you! Your review has been submitted for approval.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-4 space-y-3">
                {errorMsg && (
                  <p className="text-xs font-semibold text-red-500">{errorMsg}</p>
                )}
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-[color:var(--color-text-tertiary)] block mb-1">Your Rating</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setUserRating(star)}
                        className="p-0.5 focus:outline-none"
                      >
                        <Star className={cn("h-5 w-5 transition-transform hover:scale-110", star <= userRating ? "fill-amber-400 text-amber-400" : "text-[color:var(--color-border)]")} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Review headline (optional)"
                    className="w-full rounded-xl border border-[color:var(--color-border)] bg-white px-3 py-2 text-xs outline-none focus:border-[color:var(--color-brand-primary)]"
                  />
                </div>

                <div>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Write your experience..."
                    rows={3}
                    required
                    className="w-full rounded-xl border border-[color:var(--color-border)] bg-white px-3 py-2 text-xs outline-none focus:border-[color:var(--color-brand-primary)]"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2 text-xs"
                  iconRight={<Send className="h-3.5 w-3.5" />}
                >
                  {submitting ? "Submitting..." : "Submit Review"}
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {displayReviews.length === 0 ? (
            <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-8 text-center text-sm text-[color:var(--color-text-tertiary)]">
              No published reviews yet. Be the first to review this frame!
            </div>
          ) : (
            displayReviews.map((review, idx) => (
              <div key={review._id || review.id || idx} className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--color-brand-primary)] text-xs font-bold text-white uppercase">
                      {(review.user?.fullName || review.customer || review.name || "Customer").charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-[color:var(--color-text-primary)]">
                          {review.user?.fullName || review.customer || review.name || "Valued Customer"}
                        </p>
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-[9px] font-bold text-green-700 uppercase tracking-wider">
                          <CheckCircle2 className="h-2.5 w-2.5" /> Verified Buyer
                        </span>
                      </div>
                      <p className="text-xs text-[color:var(--color-text-tertiary)]">
                        {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : review.date || "Recent"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={cn("h-3 w-3", i < review.rating ? "fill-amber-400 text-amber-400" : "text-[color:var(--color-border)]")} />
                    ))}
                  </div>
                </div>
                {review.title && <h5 className="mt-2 text-xs font-bold text-[color:var(--color-text-primary)]">{review.title}</h5>}
                <p className="mt-1 text-sm leading-6 text-[color:var(--color-text-secondary)]">{review.text}</p>
                {review.adminReply && (
                  <div className="mt-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-xs">
                    <span className="font-semibold text-amber-700">Khattak Concierge Reply: </span>
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
