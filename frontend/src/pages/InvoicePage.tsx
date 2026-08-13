import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { InvoicePreview } from "@/components/order/InvoicePreview";
import { getOrderByIdApi } from "@/lib/api/orders";

export function InvoicePage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("id");
  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      setLoading(true);
      getOrderByIdApi(orderId)
        .then((data) => setOrder(data))
        .catch((err) => console.error("Failed to load invoice order:", err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 md:px-8 text-center">
        <p className="text-sm text-[color:var(--color-text-tertiary)]">Loading invoice...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 md:px-8 text-center">
        <p className="text-base text-[color:var(--color-text-primary)]">Invoice not found</p>
        <Link to="/account/orders" className="mt-4 inline-block text-xs font-semibold text-[color:var(--color-brand-primary)] hover:underline">
          Back to My Orders
        </Link>
      </div>
    );
  }

  const shippingStr = order.shippingAddress
    ? `${order.shippingAddress.street || ''}, ${order.shippingAddress.area || ''}, ${order.shippingAddress.city || ''}, ${order.shippingAddress.province || ''}`
    : "";

  const formattedOrder = {
    ...order,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    customerPhone: order.customerPhone,
    shippingAddress: shippingStr,
    date: order.createdAt ? new Date(order.createdAt).toLocaleDateString() : order.date
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 md:px-8">
      <Link to={`/account/orders/${order._id || order.id}`} className="inline-flex items-center gap-2 text-sm text-[color:var(--color-text-secondary)] transition-colors hover:text-[color:var(--color-text-primary)]">
        <ArrowLeft className="h-4 w-4" /> Back to Order
      </Link>

      <div className="mt-6">
        <InvoicePreview order={formattedOrder} />
      </div>
    </div>
  );
}
