import { cn } from "@/lib/utils";

type SkeletonVariant =
  | "text"
  | "title"
  | "card"
  | "image"
  | "avatar"
  | "badge"
  | "button"
  | "thumbnail"
  | "price"
  | "chip"
  | "rating";

type SkeletonProps = {
  variant?: SkeletonVariant;
  className?: string;
  count?: number;
  shimmer?: boolean;
};

const variantClasses: Record<SkeletonVariant, string> = {
  text: "h-4 w-full rounded",
  title: "h-7 w-3/4 rounded-lg",
  card: "h-48 w-full rounded-2xl",
  image: "aspect-[4/3] w-full rounded-2xl",
  avatar: "h-10 w-10 rounded-full",
  badge: "h-5 w-16 rounded-full",
  button: "h-10 w-24 rounded-xl",
  thumbnail: "aspect-square w-16 rounded-xl",
  price: "h-5 w-20 rounded",
  chip: "h-8 w-20 rounded-full",
  rating: "h-4 w-24 rounded",
};

export function Skeleton({ variant = "text", className, count = 1, shimmer = true }: SkeletonProps) {
  const items = Array.from({ length: count });

  return (
    <>
      {items.map((_, i) => (
        <div
          key={i}
          className={cn(
            "relative isolate overflow-hidden",
            "bg-[color:var(--color-surface-muted)]",
            "motion-safe:animate-pulse",
            variantClasses[variant],
            className,
          )}
          style={{ animationDelay: `${i * 0.08}s` }}
        >
          {shimmer && (
            <div
              className="absolute inset-0 -translate-x-full motion-safe:animate-shimmer"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
              }}
            />
          )}
        </div>
      ))}
    </>
  );
}
