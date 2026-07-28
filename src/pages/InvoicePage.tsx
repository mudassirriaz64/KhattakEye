import { useSearchParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { mockOrder } from "@/lib/order-data";
import { InvoicePreview } from "@/components/order/InvoicePreview";

export function InvoicePage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("id") || mockOrder.orderNumber;
  const order = mockOrder;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 md:px-8">
      <Link to={`/order-details?id=${orderId}`} className="inline-flex items-center gap-2 text-sm text-[color:var(--color-text-secondary)] transition-colors hover:text-[color:var(--color-text-primary)]">
        <ArrowLeft className="h-4 w-4" /> Back to Order
      </Link>

      <div className="mt-6">
        <InvoicePreview order={order} />
      </div>
    </div>
  );
}
