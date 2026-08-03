import { Skeleton } from "./Skeleton";

export function NavbarSkeleton() {
  return (
    <div className="fixed left-0 right-0 top-0 z-50 flex h-16 items-center justify-between border-b border-[color:var(--color-border)] bg-[color:var(--color-panel)]/85 px-4 backdrop-blur-xl md:px-8">
      <div className="flex items-center gap-3">
        <Skeleton variant="avatar" className="h-9 w-9 rounded-xl" />
        <Skeleton variant="title" className="h-5 w-24" />
      </div>
      <div className="hidden items-center gap-2 xl:flex">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} variant="button" className="h-8 w-20 rounded-full" />
        ))}
      </div>
      <div className="flex items-center gap-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} variant="avatar" className="h-10 w-10" />
        ))}
      </div>
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="flex min-h-[85vh] flex-col items-center justify-center gap-6 px-4">
      <Skeleton variant="badge" className="h-6 w-40" />
      <Skeleton variant="title" className="h-12 w-96 max-w-full" />
      <Skeleton variant="text" className="h-5 w-72 max-w-full" />
      <Skeleton variant="text" className="h-5 w-56 max-w-full" />
      <div className="mt-4 flex gap-4">
        <Skeleton variant="button" className="h-12 w-36 rounded-full" />
        <Skeleton variant="button" className="h-12 w-36 rounded-full" />
      </div>
      <div className="mt-8 grid w-full max-w-4xl grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} variant="card" className="h-24 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

export function CategoryCardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton variant="image" className="aspect-[4/5] rounded-2xl" />
      <Skeleton variant="title" className="h-5 w-3/4" />
      <Skeleton variant="text" className="h-4 w-1/2" />
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="space-y-3">
      <div className="relative overflow-hidden rounded-2xl">
        <Skeleton variant="image" className="aspect-square" />
        <div className="absolute left-3 top-3 flex gap-2">
          <Skeleton variant="badge" className="h-5 w-14" />
          <Skeleton variant="badge" className="h-5 w-14" />
        </div>
      </div>
      <Skeleton variant="text" className="h-4 w-3/4" />
      <Skeleton variant="price" className="h-5 w-20" />
      <div className="flex gap-1">
        <Skeleton variant="rating" className="h-4 w-24" />
        <Skeleton variant="text" className="h-4 w-8" />
      </div>
      <div className="flex gap-2">
        <Skeleton variant="button" className="h-10 flex-1 rounded-xl" />
        <Skeleton variant="avatar" className="h-10 w-10" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ProductDetailsSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <Skeleton variant="text" className="mb-6 h-4 w-48" />
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <Skeleton variant="image" className="aspect-square rounded-3xl" />
          <div className="flex gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} variant="thumbnail" className="h-20 w-20 rounded-xl" />
            ))}
          </div>
        </div>
        <div className="space-y-5">
          <Skeleton variant="badge" className="h-6 w-24" />
          <Skeleton variant="title" className="h-8 w-3/4" />
          <Skeleton variant="price" className="h-7 w-32" />
          <div className="flex gap-1">
            <Skeleton variant="rating" className="h-4 w-28" />
            <Skeleton variant="text" className="h-4 w-16" />
          </div>
          <div className="space-y-2">
            <Skeleton variant="text" className="h-4 w-full" />
            <Skeleton variant="text" className="h-4 w-5/6" />
            <Skeleton variant="text" className="h-4 w-4/6" />
          </div>
          <div className="flex gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} variant="avatar" className="h-8 w-8 rounded-full" />
            ))}
          </div>
          <div className="flex gap-3">
            <Skeleton variant="button" className="h-12 flex-1 rounded-xl" />
            <Skeleton variant="button" className="h-12 flex-1 rounded-xl" />
            <Skeleton variant="avatar" className="h-12 w-12" />
          </div>
          <div className="space-y-3 pt-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} variant="text" className="h-12 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ShopPageSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <div className="mb-6 flex flex-wrap items-center gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} variant="chip" className="h-9 rounded-full" />
        ))}
      </div>
      <div className="mb-8 flex items-center justify-between">
        <Skeleton variant="text" className="h-5 w-32" />
        <div className="flex gap-2">
          <Skeleton variant="button" className="h-9 w-24 rounded-lg" />
          <Skeleton variant="button" className="h-9 w-24 rounded-lg" />
        </div>
      </div>
      <ProductGridSkeleton count={8} />
      <div className="mt-10 flex items-center justify-center gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} variant="avatar" className="h-10 w-10 rounded-lg" />
        ))}
      </div>
    </div>
  );
}

export function CartSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-8">
      <Skeleton variant="title" className="mb-8 h-8 w-32" />
      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-4 rounded-2xl border border-[color:var(--color-border)] p-4">
              <Skeleton variant="thumbnail" className="h-24 w-24 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton variant="title" className="h-5 w-3/4" />
                <Skeleton variant="price" className="h-4 w-20" />
                <div className="flex items-center gap-3">
                  <Skeleton variant="button" className="h-8 w-24 rounded-lg" />
                  <Skeleton variant="text" className="h-4 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-4 rounded-2xl border border-[color:var(--color-border)] p-6">
          <Skeleton variant="title" className="h-6 w-28" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex justify-between">
                <Skeleton variant="text" className="h-4 w-24" />
                <Skeleton variant="text" className="h-4 w-16" />
              </div>
            ))}
          </div>
          <Skeleton variant="button" className="h-12 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function CheckoutSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-8">
      <Skeleton variant="title" className="mb-8 h-8 w-40" />
      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-4 rounded-2xl border border-[color:var(--color-border)] p-6">
              <Skeleton variant="title" className="h-5 w-32" />
              <Skeleton variant="text" className="h-10 w-full rounded-xl" />
              <Skeleton variant="text" className="h-10 w-full rounded-xl" />
              <Skeleton variant="text" className="h-10 w-3/4 rounded-xl" />
            </div>
          ))}
        </div>
        <div className="space-y-4 rounded-2xl border border-[color:var(--color-border)] p-6">
          <Skeleton variant="title" className="h-6 w-28" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex justify-between">
                <Skeleton variant="text" className="h-4 w-24" />
                <Skeleton variant="text" className="h-4 w-16" />
              </div>
            ))}
          </div>
          <Skeleton variant="button" className="h-12 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <div className="mb-8 flex items-center gap-4">
        <Skeleton variant="avatar" className="h-16 w-16 rounded-2xl" />
        <div className="space-y-2">
          <Skeleton variant="title" className="h-6 w-48" />
          <Skeleton variant="text" className="h-4 w-32" />
        </div>
      </div>
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} variant="card" className="h-28 rounded-2xl" />
        ))}
      </div>
      <div className="space-y-4">
        <Skeleton variant="title" className="h-6 w-40" />
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} variant="text" className="h-16 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} variant="text" className="h-5 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex items-center gap-4">
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} variant="text" className="h-10 flex-1 rounded-lg" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="space-y-4 rounded-2xl border border-[color:var(--color-border)] p-6">
      <div className="flex items-center justify-between">
        <Skeleton variant="title" className="h-5 w-32" />
        <Skeleton variant="avatar" className="h-8 w-8 rounded-lg" />
      </div>
      <Skeleton variant="image" className="h-48 w-full rounded-xl" />
      <div className="flex justify-between">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} variant="text" className="h-3 w-8" />
        ))}
      </div>
    </div>
  );
}

export function ReviewSkeleton() {
  return (
    <div className="space-y-4 rounded-2xl border border-[color:var(--color-border)] p-6">
      <div className="flex items-center gap-3">
        <Skeleton variant="avatar" className="h-10 w-10" />
        <div className="space-y-1">
          <Skeleton variant="title" className="h-4 w-28" />
          <Skeleton variant="rating" className="h-3 w-20" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton variant="text" className="h-4 w-full" />
        <Skeleton variant="text" className="h-4 w-5/6" />
        <Skeleton variant="text" className="h-4 w-3/4" />
      </div>
      <Skeleton variant="text" className="h-3 w-24" />
    </div>
  );
}

export function BannerSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-3xl">
      <Skeleton variant="image" className="aspect-[21/9] w-full rounded-3xl" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
        <Skeleton variant="badge" className="h-6 w-32" />
        <Skeleton variant="title" className="h-10 w-64" />
        <Skeleton variant="button" className="h-10 w-32 rounded-full" />
      </div>
    </div>
  );
}

export function FooterSkeleton() {
  return (
    <div className="border-t border-[color:var(--color-border)] px-4 py-12 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton variant="title" className="h-5 w-24" />
              {Array.from({ length: 4 }).map((_, j) => (
                <Skeleton key={j} variant="text" className="h-4 w-3/4" />
              ))}
            </div>
          ))}
        </div>
        <div className="mt-10 flex justify-center gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} variant="avatar" className="h-10 w-10" />
          ))}
        </div>
        <Skeleton variant="text" className="mx-auto mt-10 h-4 w-48" />
      </div>
    </div>
  );
}

export function WishlistSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <Skeleton variant="title" className="mb-8 h-8 w-36" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function OrderTimelineSkeleton() {
  return (
    <div className="space-y-6 rounded-2xl border border-[color:var(--color-border)] p-6">
      <Skeleton variant="title" className="h-6 w-32" />
      <div className="space-y-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex gap-4">
            <Skeleton variant="avatar" className="h-6 w-6" />
            <div className="flex-1 space-y-1">
              <Skeleton variant="title" className="h-4 w-48" />
              <Skeleton variant="text" className="h-3 w-32" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 md:px-8">
      <div className="mb-8 flex items-center gap-4">
        <Skeleton variant="avatar" className="h-20 w-20 rounded-2xl" />
        <div className="space-y-2">
          <Skeleton variant="title" className="h-6 w-48" />
          <Skeleton variant="text" className="h-4 w-32" />
        </div>
      </div>
      <div className="space-y-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton variant="text" className="h-4 w-24" />
            <Skeleton variant="text" className="h-10 w-full rounded-xl" />
          </div>
        ))}
        <Skeleton variant="button" className="h-12 w-32 rounded-xl" />
      </div>
    </div>
  );
}

export function AddressSkeleton() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 md:px-8">
      <Skeleton variant="title" className="mb-8 h-8 w-36" />
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-3 rounded-2xl border border-[color:var(--color-border)] p-5">
            <Skeleton variant="title" className="h-5 w-32" />
            <Skeleton variant="text" className="h-4 w-full" />
            <Skeleton variant="text" className="h-4 w-3/4" />
            <div className="flex gap-2">
              <Skeleton variant="button" className="h-8 w-16 rounded-lg" />
              <Skeleton variant="button" className="h-8 w-16 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function FAQSkeleton() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:px-8">
      <Skeleton variant="title" className="mx-auto mb-10 h-10 w-48" />
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3 rounded-2xl border border-[color:var(--color-border)] p-5">
            <Skeleton variant="title" className="h-5 w-3/4" />
            <Skeleton variant="text" className="h-4 w-full" />
            <Skeleton variant="text" className="h-4 w-5/6" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function PolicyPageSkeleton() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:px-8">
      <Skeleton variant="title" className="mx-auto mb-6 h-10 w-56" />
      <div className="space-y-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton variant="title" className="h-6 w-48" />
            <Skeleton variant="text" className="h-4 w-full" />
            <Skeleton variant="text" className="h-4 w-5/6" />
            <Skeleton variant="text" className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function CMSSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <div className="mb-6 flex items-center justify-between">
        <Skeleton variant="title" className="h-8 w-40" />
        <Skeleton variant="button" className="h-10 w-32 rounded-xl" />
      </div>
      <div className="mb-6 flex gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} variant="chip" className="h-9 rounded-full" />
        ))}
      </div>
      <TableSkeleton rows={6} cols={5} />
    </div>
  );
}

export function SearchSkeleton() {
  return (
    <div className="p-4">
      <div className="mb-6 space-y-4">
        <Skeleton variant="text" className="h-10 w-full rounded-xl" />
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} variant="chip" className="h-8 rounded-full" />
          ))}
        </div>
      </div>
      <ProductGridSkeleton count={4} />
    </div>
  );
}

export function FilterSkeleton() {
  return (
    <div className="space-y-5">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton variant="title" className="h-5 w-24" />
          {Array.from({ length: 4 }).map((_, j) => (
            <div key={j} className="flex items-center gap-3">
              <Skeleton variant="avatar" className="h-4 w-4 rounded" />
              <Skeleton variant="text" className="h-4 w-28" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export function AnalyticsSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-3 rounded-2xl border border-[color:var(--color-border)] p-5">
            <Skeleton variant="text" className="h-4 w-24" />
            <Skeleton variant="title" className="h-8 w-16" />
            <Skeleton variant="text" className="h-3 w-20" />
          </div>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
      <div className="mt-8">
        <TableSkeleton rows={5} cols={6} />
      </div>
    </div>
  );
}

export function InstagramSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} variant="image" className="aspect-square rounded-2xl" />
      ))}
    </div>
  );
}

export function CollectionSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton variant="image" className="aspect-[3/2] rounded-3xl" />
          <Skeleton variant="title" className="h-6 w-48" />
          <Skeleton variant="text" className="h-4 w-32" />
        </div>
      ))}
    </div>
  );
}

export function TestimonialsSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="space-y-4 rounded-2xl border border-[color:var(--color-border)] p-6">
          <div className="flex items-center gap-3">
            <Skeleton variant="avatar" className="h-12 w-12" />
            <div className="space-y-1">
              <Skeleton variant="title" className="h-4 w-24" />
              <Skeleton variant="text" className="h-3 w-16" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton variant="text" className="h-4 w-full" />
            <Skeleton variant="text" className="h-4 w-5/6" />
            <Skeleton variant="text" className="h-4 w-4/6" />
          </div>
          <Skeleton variant="rating" className="h-3 w-20" />
        </div>
      ))}
    </div>
  );
}

export function NewsletterSkeleton() {
  return (
    <div className="flex flex-col items-center gap-4 rounded-3xl border border-[color:var(--color-border)] p-10">
      <Skeleton variant="avatar" className="h-12 w-12 rounded-xl" />
      <Skeleton variant="title" className="h-7 w-48" />
      <Skeleton variant="text" className="h-4 w-72 max-w-full" />
      <div className="flex w-full max-w-md gap-3">
        <Skeleton variant="text" className="h-12 flex-1 rounded-xl" />
        <Skeleton variant="button" className="h-12 w-32 rounded-xl" />
      </div>
    </div>
  );
}
