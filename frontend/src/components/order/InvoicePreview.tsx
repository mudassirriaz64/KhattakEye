import { Download, Printer, Glasses } from "lucide-react";
import { Button } from "@/components/primitives/Button";
import type { Order } from "@/lib/order-data";

type InvoicePreviewProps = {
  order: Order;
};

export function InvoicePreview({ order }: InvoicePreviewProps) {
  return (
    <div className="rounded-2xl border border-[color:var(--color-border)] bg-white p-8 shadow-[var(--shadow-soft)]">
      <div className="flex items-center justify-between border-b border-[color:var(--color-border)] pb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--color-brand-primary)] text-white">
            <Glasses className="h-5 w-5" />
          </div>
          <div>
            <p className="font-display text-xl text-[color:var(--color-text-primary)]">Khattak Eyewear</p>
            <p className="text-xs text-[color:var(--color-text-tertiary)]">Premium Eyewear</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-[color:var(--color-text-tertiary)]">Invoice</p>
          <p className="text-sm font-medium text-[color:var(--color-text-primary)]">{order.orderNumber}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--color-text-tertiary)]">Bill To</p>
          <p className="mt-2 text-sm font-medium text-[color:var(--color-text-primary)]">{order.customerName}</p>
          <p className="text-xs text-[color:var(--color-text-secondary)]">{order.customerEmail}</p>
          <p className="text-xs text-[color:var(--color-text-secondary)]">{order.customerPhone}</p>
          <p className="mt-1 text-xs text-[color:var(--color-text-secondary)]">{order.shippingAddress}</p>
        </div>
        <div className="text-right sm:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--color-text-tertiary)]">Order Info</p>
          <p className="mt-2 text-sm text-[color:var(--color-text-primary)]">Date: {order.date}</p>
          <p className="text-xs text-[color:var(--color-text-secondary)]">Payment: {order.paymentMethod}</p>
          <p className="text-xs text-[color:var(--color-text-secondary)]">Status: {order.status.replace("-", " ")}</p>
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-[color:var(--color-border)]">
        <table className="w-full text-sm">
          <thead className="bg-[color:var(--color-surface-muted)]">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--color-text-tertiary)]">Product</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--color-text-tertiary)]">Qty</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--color-text-tertiary)]">Price</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--color-text-tertiary)]">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[color:var(--color-border)]">
            {order.items.map((item, i) => (
              <tr key={i}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="h-10 w-10 rounded-lg object-cover" />
                    <div>
                      <p className="text-sm font-medium text-[color:var(--color-text-primary)]">{item.name}</p>
                      <p className="text-xs text-[color:var(--color-text-tertiary)]">{item.color}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-right text-[color:var(--color-text-secondary)]">{item.quantity}</td>
                <td className="px-4 py-3 text-right text-[color:var(--color-text-secondary)]">Rs. {item.price.toLocaleString()}</td>
                <td className="px-4 py-3 text-right font-medium">Rs. {(item.price * item.quantity).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 space-y-2 border-t border-[color:var(--color-border)] pt-4 text-sm">
        <div className="flex justify-between">
          <span className="text-[color:var(--color-text-secondary)]">Subtotal</span>
          <span>Rs. {order.subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[color:var(--color-text-secondary)]">Shipping</span>
          <span>{order.shipping === 0 ? "Free" : `Rs. ${order.shipping}`}</span>
        </div>
        {order.discount > 0 && (
          <div className="flex justify-between text-[color:var(--color-accent-teal)]">
            <span>Discount</span>
            <span>-Rs. {order.discount.toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between border-t border-[color:var(--color-border)] pt-2 text-base font-semibold">
          <span>Grand Total</span>
          <span>Rs. {order.total.toLocaleString()}</span>
        </div>
      </div>

      <div className="mt-8 flex justify-end gap-3">
        <Button variant="outline" iconLeft={<Printer className="h-4 w-4" />}>Print</Button>
        <Button variant="primary" iconLeft={<Download className="h-4 w-4" />}>Download PDF</Button>
      </div>
    </div>
  );
}
