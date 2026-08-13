import { useState, useEffect } from "react";
import { useSearchParams, Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { InvoicePreview } from "@/components/order/InvoicePreview";
import { getOrderByIdApi } from "@/lib/api/orders";

export function InvoicePage() {
  const [searchParams] = useSearchParams();
  const params = useParams<{ id: string }>();
  const orderId = searchParams.get("id") || params.id;
  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const fromAdmin = searchParams.get("from") === "admin" || window.location.pathname.includes("/admin");

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
        <Link to={fromAdmin ? "/admin/orders" : "/account/orders"} className="mt-4 inline-block text-xs font-semibold text-[color:var(--color-brand-primary)] hover:underline">
          {fromAdmin ? "Back to Admin Orders" : "Back to My Orders"}
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

  const backLink = fromAdmin
    ? `/admin/orders/${order._id || order.id}`
    : `/account/orders/${order._id || order.id}`;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 md:px-8">
      <div className="print:hidden mb-6 flex items-center justify-between">
        <Link to={backLink} className="inline-flex items-center gap-2 text-sm font-medium text-[color:var(--color-text-secondary)] transition-colors hover:text-[color:var(--color-text-primary)]">
          <ArrowLeft className="h-4 w-4" /> {fromAdmin ? "Back to Admin Order Details" : "Back to Order"}
        </Link>
      </div>

      <div>
        <InvoicePreview order={formattedOrder} />
      </div>
    </div>
  );
}
