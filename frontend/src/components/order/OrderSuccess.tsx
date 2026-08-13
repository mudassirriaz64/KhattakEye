import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, Download, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/primitives/Button";

type OrderSuccessProps = {
  orderNumber: string;
  estimatedDelivery: string;
};

export function OrderSuccess({ orderNumber, estimatedDelivery }: OrderSuccessProps) {
  return (
    <div className="mx-auto max-w-2xl py-10 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", damping: 15, stiffness: 200, delay: 0.1 }}
        className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[color:var(--color-accent-teal)]/10"
      >
        <CheckCircle2 className="h-12 w-12 text-[color:var(--color-accent-teal)]" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 font-display text-3xl text-[color:var(--color-text-primary)] md:text-5xl"
      >
        Thank You for Your Order!
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mx-auto mt-4 max-w-md text-sm leading-7 text-[color:var(--color-text-secondary)]"
      >
        Your premium eyewear order has been placed successfully. You will receive a confirmation email shortly.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 inline-flex flex-col items-center gap-2 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-8 py-5"
      >
        <p className="text-xs text-[color:var(--color-text-tertiary)]">Order Number</p>
        <p className="font-display text-2xl text-[color:var(--color-text-primary)]">{orderNumber}</p>
        <div className="flex items-center gap-2 text-xs text-[color:var(--color-accent-teal)]">
          <Package className="h-3.5 w-3.5" />
          Estimated delivery: {estimatedDelivery}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8 flex flex-wrap items-center justify-center gap-3"
      >
        <Link to={`/track-order?id=${orderNumber}`}>
          <Button variant="primary" iconLeft={<Package className="h-4 w-4" />}>Track Order</Button>
        </Link>
        <Link to={`/invoice?id=${orderNumber}`} target="_blank">
          <Button variant="outline" iconLeft={<Download className="h-4 w-4" />}>Download Invoice</Button>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-10"
      >
        <Link to="/shop">
          <Button variant="ghost" iconRight={<ArrowRight className="h-4 w-4" />}>Continue Shopping</Button>
        </Link>
      </motion.div>
    </div>
  );
}
