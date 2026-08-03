import { useCheckoutStore } from "@/lib/stores/checkout-store";
import { useCartStore } from "@/lib/stores/cart-store";
import { StepIndicator } from "@/components/checkout/StepIndicator";
import { CustomerInfoForm } from "@/components/checkout/CustomerInfoForm";
import { ShippingAddressForm } from "@/components/checkout/ShippingAddressForm";
import { PaymentMethodSelector } from "@/components/checkout/PaymentMethodSelector";
import { ManualPaymentForm } from "@/components/checkout/ManualPaymentForm";
import { OrderReviewContent } from "@/components/checkout/OrderReview";
import { OrderSuccess } from "@/components/order/OrderSuccess";
import { ProductRecommendations } from "@/components/product/ProductRecommendations";
import { allProducts } from "@/lib/shop-data";
import { motion, AnimatePresence } from "framer-motion";
import { Navigate, Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";

export function CheckoutPage() {
  const step = useCheckoutStore((s) => s.step);
  const orderNumber = useCheckoutStore((s) => s.orderNumber);
  const orderPlaced = useCheckoutStore((s) => s.orderPlaced);
  const items = useCartStore((s) => s.items);

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="mx-auto max-w-lg py-20 text-center">
        <ShoppingBag className="mx-auto h-12 w-12 text-[color:var(--color-text-tertiary)]" />
        <h2 className="mt-4 font-display text-2xl text-[color:var(--color-text-primary)]">Your cart is empty</h2>
        <p className="mt-2 text-sm text-[color:var(--color-text-secondary)]">Add items to your cart before checkout.</p>
        <Link to="/shop" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[color:var(--color-brand-primary)] px-6 py-3 text-sm font-semibold text-white">Shop Now</Link>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="mx-auto max-w-[1440px] px-4 py-10 md:px-8">
        <OrderSuccess orderNumber={orderNumber || "KT-UNKNOWN"} estimatedDelivery="August 5, 2026" />
        <div className="mt-14">
          <ProductRecommendations title="You May Also Like" products={allProducts.slice(0, 4)} />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 md:px-8">
      <StepIndicator current={step} />

      <div className="mt-10">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="info" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <CustomerInfoForm />
            </motion.div>
          )}
          {step === 2 && (
            <motion.div key="shipping" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <ShippingAddressForm />
            </motion.div>
          )}
          {step === 3 && (
            <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <PaymentMethodSelector />
              <div className="mt-6">
                <ManualPaymentForm />
              </div>
            </motion.div>
          )}
          {step === 4 && (
            <motion.div key="review" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <OrderReviewContent />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
