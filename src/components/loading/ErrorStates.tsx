import { motion } from "framer-motion";
import {
  AlertTriangle, WifiOff, ShieldAlert, CreditCard,
  RefreshCw, ArrowLeft, HeadphonesIcon,
} from "lucide-react";
import { Button } from "@/components/primitives/Button";
import { cn } from "@/lib/utils";

type ErrorType =
  | "404"
  | "500"
  | "network"
  | "image"
  | "payment"
  | "order"
  | "generic";

type ErrorConfig = {
  icon: typeof AlertTriangle;
  title: string;
  description: string;
  primaryLabel: string;
  secondaryLabel?: string;
};

const errorConfigs: Record<ErrorType, ErrorConfig> = {
  "404": {
    icon: ShieldAlert,
    title: "Page not found",
    description: "The page you're looking for doesn't exist or has been moved. Let us help you find your way back.",
    primaryLabel: "Go Home",
    secondaryLabel: "Browse Shop",
  },
  "500": {
    icon: AlertTriangle,
    title: "Something went wrong",
    description: "We're experiencing a technical issue. Our team has been notified and is working on a fix.",
    primaryLabel: "Try Again",
    secondaryLabel: "Contact Support",
  },
  network: {
    icon: WifiOff,
    title: "No internet connection",
    description: "Please check your internet connection and try again. Your saved items are safe.",
    primaryLabel: "Retry",
    secondaryLabel: "Go Home",
  },
  image: {
    icon: AlertTriangle,
    title: "Image failed to load",
    description: "We couldn't load this image. This might be a temporary issue.",
    primaryLabel: "Retry",
  },
  payment: {
    icon: CreditCard,
    title: "Payment failed",
    description: "Your payment couldn't be processed. Please verify your payment details and try again.",
    primaryLabel: "Try Again",
    secondaryLabel: "Contact Support",
  },
  order: {
    icon: AlertTriangle,
    title: "Order error",
    description: "We encountered an issue with your order. Please contact our support team for assistance.",
    primaryLabel: "Contact Support",
    secondaryLabel: "Go Home",
  },
  generic: {
    icon: AlertTriangle,
    title: "Unexpected error",
    description: "Something unexpected happened. Please try again or contact support if the issue persists.",
    primaryLabel: "Try Again",
    secondaryLabel: "Contact Support",
  },
};

type ErrorStateProps = {
  type?: ErrorType;
  title?: string;
  description?: string;
  className?: string;
  onPrimary?: () => void;
  onSecondary?: () => void;
};

export function ErrorState({
  type = "generic",
  title,
  description,
  className,
  onPrimary,
  onSecondary,
}: ErrorStateProps) {
  const config = errorConfigs[type];
  const Icon = config.icon;

  return (
    <motion.div
      className={cn("flex flex-col items-center justify-center px-6 py-16 text-center", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-red-50 dark:bg-red-950/20"
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
      >
        <Icon className="h-9 w-9 text-[color:var(--color-danger)]" />
      </motion.div>
      <h3 className="font-display text-2xl text-[color:var(--color-text-primary)]">
        {title || config.title}
      </h3>
      <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[color:var(--color-text-secondary)]">
        {description || config.description}
      </p>
      <div className="mt-8 flex gap-3">
        <Button
          variant="primary"
          onClick={onPrimary || (() => window.location.reload())}
          iconLeft={type === "404" ? <ArrowLeft className="h-4 w-4" /> : <RefreshCw className="h-4 w-4" />}
        >
          {config.primaryLabel}
        </Button>
        {config.secondaryLabel && (
          <Button
            variant="outline"
            onClick={onSecondary || (() => {})}
            iconLeft={type === "500" || type === "payment" || type === "order" || type === "generic" ? <HeadphonesIcon className="h-4 w-4" /> : undefined}
          >
            {config.secondaryLabel}
          </Button>
        )}
      </div>
    </motion.div>
  );
}
