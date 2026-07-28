import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, Package, CreditCard, User, MapPin, FileText, HeadphonesIcon, Download } from "lucide-react";
import { mockOrder } from "@/lib/order-data";
import { OrderTimeline } from "@/components/order/OrderTimeline";
import { AccountLayout } from "@/components/account/AccountLayout";
import { Button } from "@/components/primitives/Button";

export function AccountOrderDetailsPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("id") || mockOrder.orderNumber;
  const order = mockOrder;

  const details = [
    { icon: CreditCard, label: "Payment", value: order.paymentMethod },
    { icon: User, label: "Customer", value: `${order.customerName}\n${order.customerEmail}` },
    { icon: MapPin, label: "Shipping", value: order.shippingAddress },
    { icon: FileText, label: "Invoice #", value: order.orderNumber },
  ];

  return (
    <AccountLayout title="Order Details" subtitle={`${order.orderNumber} — ${order.date}`}>
      <div className="flex flex-wrap items-center gap-3">
        <Link to="/account/orders" className="inline-flex items-center gap-1.5 text-xs text-[color:var(--color-text-tertiary)] hover:text-[color:var(--color-text-primary)]">
          <ArrowLeft className="h-3 w-3" /> Back to Orders
        </Link>
        <Link to={`/track-order?id=${order.orderNumber}`}>
          <Button variant="outline" iconLeft={<Package className="h-3.5 w-3.5" />} className="text-xs">Track Order</Button>
        </Link>
        <Link to={`/invoice?id=${order.orderNumber}`}>
          <Button variant="outline" iconLeft={<Download className="h-3.5 w-3.5" />} className="text-xs">Invoice</Button>
        </Link>
      </div>

      <div className="mt-6 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
        <h3 className="font-display text-lg text-[color:var(--color-text-primary)]">Order Timeline</h3>
        <div className="mt-4">
          <OrderTimeline entries={order.timeline} currentStatus={order.status} />
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
        <h3 className="font-display text-lg text-[color:var(--color-text-primary)]">Items</h3>
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

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {details.map((item) => (
          <div key={item.label} className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-4">
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-text-tertiary)]">
              <item.icon className="h-3 w-3" /> {item.label}
            </div>
            <p className="mt-2 whitespace-pre-line text-sm text-[color:var(--color-text-primary)]">{item.value}</p>
          </div>
        ))}
        <div className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-4">
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-text-tertiary)]">
            <HeadphonesIcon className="h-3 w-3" /> Need Help?
          </div>
          <div className="mt-3 flex gap-2">
            <Button variant="outline" className="flex-1 text-xs">Live Chat</Button>
            <Button variant="outline" className="flex-1 text-xs">Call Support</Button>
          </div>
        </div>
      </div>
    </AccountLayout>
  );
}
