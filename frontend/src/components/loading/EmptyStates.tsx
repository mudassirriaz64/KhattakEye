import { motion } from "framer-motion";
import {
  ShoppingBag, Heart, Package, Search, Star, Bell,
  PackageX, Store, Tag, Inbox, List,
} from "lucide-react";
import { Button } from "@/components/primitives/Button";
import { cn } from "@/lib/utils";

type EmptyStateAction = {
  label: string;
  onClick: () => void;
  variant?: "primary" | "outline";
};

type EmptyStateConfig = {
  icon: typeof ShoppingBag;
  title: string;
  description: string;
  primaryAction?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
};

const emptyStateConfigs: Record<string, EmptyStateConfig> = {
  cart: {
    icon: ShoppingBag,
    title: "Your cart is empty",
    description: "Looks like you haven't added anything to your cart yet. Browse our collection and find your perfect pair.",
    primaryAction: { label: "Browse Eyewear", onClick: () => window.location.href = "/shop", variant: "primary" },
  },
  wishlist: {
    icon: Heart,
    title: "Your wishlist is empty",
    description: "Save your favorite frames to your wishlist and come back to them anytime.",
    primaryAction: { label: "Explore Frames", onClick: () => window.location.href = "/shop", variant: "primary" },
  },
  orders: {
    icon: Package,
    title: "No orders yet",
    description: "You haven't placed any orders yet. Start shopping to see your order history here.",
    primaryAction: { label: "Start Shopping", onClick: () => window.location.href = "/shop", variant: "primary" },
  },
  search: {
    icon: Search,
    title: "No results found",
    description: "We couldn't find what you're looking for. Try adjusting your search terms or browse our categories.",
    primaryAction: { label: "Clear Filters", onClick: () => window.location.href = "/shop", variant: "outline" },
    secondaryAction: { label: "Browse All", onClick: () => window.location.href = "/shop", variant: "primary" },
  },
  reviews: {
    icon: Star,
    title: "No reviews yet",
    description: "Be the first to share your experience. Your reviews help others find their perfect frames.",
    primaryAction: { label: "Write a Review", onClick: () => {}, variant: "primary" },
  },
  notifications: {
    icon: Bell,
    title: "All caught up",
    description: "You have no notifications at the moment. We'll let you know when something new arrives.",
  },
  products: {
    icon: PackageX,
    title: "No products found",
    description: "This category doesn't have any products yet. Check back later or explore other categories.",
    primaryAction: { label: "Browse All", onClick: () => window.location.href = "/shop", variant: "primary" },
  },
  brands: {
    icon: Store,
    title: "No brands yet",
    description: "We're adding new brands regularly. Stay tuned for exciting new collections.",
  },
  categories: {
    icon: Tag,
    title: "No categories yet",
    description: "We're organizing our collection. Check back soon for a better browsing experience.",
  },
  addresses: {
    icon: Inbox,
    title: "No saved addresses",
    description: "Add a delivery address to make checkout faster and easier.",
    primaryAction: { label: "Add Address", onClick: () => {}, variant: "primary" },
  },
  compare: {
    icon: List,
    title: "Nothing to compare",
    description: "Add products to compare to see how they stack up side by side.",
    primaryAction: { label: "Browse Products", onClick: () => window.location.href = "/shop", variant: "primary" },
  },
};

type EmptyStatesProps = {
  type: keyof typeof emptyStateConfigs;
  className?: string;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
};

export function EmptyState({ type, className, onPrimaryAction, onSecondaryAction }: EmptyStatesProps) {
  const config = emptyStateConfigs[type];
  if (!config) return null;

  const Icon = config.icon;

  return (
    <motion.div
      className={cn("flex flex-col items-center justify-center px-6 py-16 text-center", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-[color:var(--color-surface-muted)]"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
      >
        <Icon className="h-9 w-9 text-[color:var(--color-text-tertiary)]" />
      </motion.div>
      <h3 className="font-display text-2xl text-[color:var(--color-text-primary)]">{config.title}</h3>
      <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[color:var(--color-text-secondary)]">
        {config.description}
      </p>
      <div className="mt-8 flex gap-3">
        {config.primaryAction && (
          <Button
            variant={config.primaryAction.variant || "primary"}
            onClick={onPrimaryAction || config.primaryAction.onClick}
          >
            {config.primaryAction.label}
          </Button>
        )}
        {config.secondaryAction && (
          <Button
            variant={config.secondaryAction.variant || "outline"}
            onClick={onSecondaryAction || config.secondaryAction.onClick}
          >
            {config.secondaryAction.label}
          </Button>
        )}
      </div>
    </motion.div>
  );
}
