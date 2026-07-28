import { Star, ThumbsUp, ChevronDown } from "lucide-react";
import { type ProductReview } from "@/lib/shop-data";
import { cn } from "@/lib/utils";

type ProductReviewsProps = {
  reviews: ProductReview[];
  rating: number;
  reviewCount: number;
};

export function ProductReviews({ reviews, rating, reviewCount }: ProductReviewsProps) {
  const distribution = [38, 42, 12, 5, 3];

  return (
    <div className="space-y-8">
      <div className="grid gap-8 md:grid-cols-[1fr_1.5fr]">
        <div className="text-center">
          <p className="font-display text-6xl text-[color:var(--color-text-primary)]">{rating}</p>
          <div className="mt-2 flex items-center justify-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={cn("h-4 w-4", i < Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-[color:var(--color-border)]")} />
            ))}
          </div>
          <p className="mt-1 text-sm text-[color:var(--color-text-secondary)]">{reviewCount} Reviews</p>

          <div className="mt-6 space-y-2">
            {distribution.map((percent, i) => (
              <div key={i} className="flex items-center gap-3 text-xs">
                <span className="w-8 text-right text-[color:var(--color-text-tertiary)]">{5 - i}★</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-[color:var(--color-border)]">
                  <div className="h-full rounded-full bg-amber-400" style={{ width: `${percent}%` }} />
                </div>
                <span className="w-8 text-[color:var(--color-text-tertiary)]">{percent}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {reviews.slice(0, 3).map((review) => (
            <div key={review.id} className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={review.avatar} alt={review.name} className="h-10 w-10 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-medium text-[color:var(--color-text-primary)]">{review.name}</p>
                    <p className="text-xs text-[color:var(--color-text-tertiary)]">{review.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={cn("h-3 w-3", i < review.rating ? "fill-amber-400 text-amber-400" : "text-[color:var(--color-border)]")} />
                  ))}
                </div>
              </div>
              <p className="mt-3 text-sm leading-6 text-[color:var(--color-text-secondary)]">{review.text}</p>
              <button type="button" className="mt-2 flex items-center gap-1.5 text-xs text-[color:var(--color-text-tertiary)] hover:text-[color:var(--color-accent-teal)]">
                <ThumbsUp className="h-3 w-3" /> Helpful
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
