import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { ArrowLeft, Package, CreditCard, User, MapPin, FileText, HeadphonesIcon } from "lucide-react";
import { mockOrder, type Order } from "@/lib/order-data";
import { OrderTimeline } from "@/components/order/OrderTimeline";
import { Button } from "@/components/primitives/Button";
import { getOrderByIdApi } from "@/lib/api/orders";
import { getPaymentMethodLabel } from "@/lib/utils/enum-labels";

export function OrderDetailsPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("id") || mockOrder.orderNumber;
  const [order, setOrder] = useState<Order>(mockOrder);

  useEffect(() => {
    if (orderId) {
      getOrderByIdApi(orderId).then((data) => {
        if (data) {
          setOrder({
            orderNumber: data.orderNumber || orderId,
            date: data.createdAt ? new Date(data.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
            status: data.status || 'pending',
            items: data.items || [],
            subtotal: data.subtotal || 0,
            shipping: data.shipping !== undefined ? data.shipping : 0,
            discount: data.discount || 0,
            total: data.total || 0,
            paymentMethod: getPaymentMethodLabel(data.paymentMethod),
            customerName: data.customerName || 'Customer',
            customerEmail: data.customerEmail || '-',
            customerPhone: data.customerPhone || 'Phone',
            shippingAddress: data.shippingAddress ? `${data.shippingAddress.street || ''}, ${data.shippingAddress.area || ''}, ${data.shippingAddress.city || ''}` : 'Shipping Address',
            timeline: data.timeline && data.timeline.length > 0 ? data.timeline : mockOrder.timeline
          } as Order);
        }
      }).catch(() => {});
    }
  }, [orderId]);

  const details = [
    { icon: Package, label: "Products", value: order.items.map((i) => `${i.name} x${i.quantity}`).join(", ") },
    { icon: CreditCard, label: "Payment", value: getPaymentMethodLabel(order.paymentMethod) },
    { icon: User, label: "Customer", value: `${order.customerName}\n${order.customerEmail}\n${order.customerPhone}` },
    { icon: MapPin, label: "Shipping", value: order.shippingAddress },
    { icon: FileText, label: "Invoice", value: order.orderNumber },
  ];

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-10 md:px-8">
      <Link to="/account/orders" className="inline-flex items-center gap-2 text-sm text-[color:var(--color-text-secondary)] transition-colors hover:text-[color:var(--color-text-primary)]">
        <ArrowLeft className="h-4 w-4" /> Back to Orders
      </Link>

      <div className="mt-4 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-[color:var(--color-text-primary)] md:text-4xl">Order Details</h1>
          <p className="mt-1 text-sm text-[color:var(--color-text-secondary)]">{order.orderNumber} — {order.date}</p>
        </div>
        <Link to={`/track-order?id=${order.orderNumber}`}>
          <Button variant="outline" iconLeft={<Package className="h-4 w-4" />}>Track Order</Button>
        </Link>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
            <h2 className="font-display text-xl text-[color:var(--color-text-primary)]">Order Timeline</h2>
            <div className="mt-6">
              <OrderTimeline entries={order.timeline} currentStatus={order.status} />
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
            <h2 className="font-display text-xl text-[color:var(--color-text-primary)]">Order Items</h2>
            <div className="mt-4 space-y-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-4 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-app-bg)] p-3">
                  <img src={item.image} alt={item.name} className="h-16 w-16 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[color:var(--color-text-primary)]">{item.name}</p>
                    <p className="text-xs text-[color:var(--color-text-tertiary)]">{item.brand} · {item.color} · Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-2 border-t border-[color:var(--color-border)] pt-5 text-sm">
              <div className="flex justify-between"><span className="text-[color:var(--color-text-secondary)]">Subtotal</span><span>Rs. {order.subtotal.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-[color:var(--color-text-secondary)]">Shipping</span><span>{order.shipping === 0 ? "Free" : `Rs. ${order.shipping}`}</span></div>
              {order.discount > 0 && <div className="flex justify-between text-[color:var(--color-accent-teal)]"><span>Discount</span><span>-Rs. {order.discount.toLocaleString()}</span></div>}
              <div className="flex justify-between border-t border-[color:var(--color-border)] pt-2 text-base font-semibold"><span>Total</span><span>Rs. {order.total.toLocaleString()}</span></div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {details.map((item) => (
            <div key={item.label} className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--color-text-tertiary)]">
                <item.icon className="h-3.5 w-3.5" /> {item.label}
              </div>
              <p className="mt-2 whitespace-pre-line text-sm text-[color:var(--color-text-primary)]">{item.value}</p>
            </div>
          ))}

          <div className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--color-text-tertiary)]">
              <HeadphonesIcon className="h-3.5 w-3.5" /> Need Help?
            </div>
            <p className="mt-2 text-sm text-[color:var(--color-text-secondary)]">Contact our support team for assistance with your order.</p>
            <div className="mt-3 flex gap-2">
              <Button variant="outline" className="flex-1 text-xs">Chat</Button>
              <Button variant="outline" className="flex-1 text-xs">Call</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
