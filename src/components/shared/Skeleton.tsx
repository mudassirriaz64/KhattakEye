import { cn } from "@/lib/utils";

type SkeletonVariant = "text" | "card" | "image" | "avatar" | "badge" | "button";

type SkeletonProps = {
  variant?: SkeletonVariant;
  className?: string;
  count?: number;
};

const variantClasses: Record<SkeletonVariant, string> = {
  text: "h-4 w-full rounded",
  card: "h-48 w-full rounded-2xl",
  image: "aspect-[4/3] w-full rounded-2xl",
  avatar: "h-10 w-10 rounded-full",
  badge: "h-5 w-16 rounded-full",
  button: "h-10 w-24 rounded-xl",
};

export function Skeleton({ variant = "text", className, count = 1 }: SkeletonProps) {
  const items = Array.from({ length: count });

  return (
    <>
      {items.map((_, i) => (
        <div
          key={i}
          className={cn(
            "animate-pulse bg-[color:var(--color-surface-muted)]",
            variantClasses[variant],
            className,
          )}
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </>
  );
}
