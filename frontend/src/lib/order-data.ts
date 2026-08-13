export type OrderStatus =
  | "pending"
  | "pending-quote"
  | "payment-verification"
  | "confirmed"
  | "processing"
  | "packed"
  | "shipped"
  | "out-for-delivery"
  | "delivered"
  | "cancelled";

export const ORDER_STATUS_LIST: OrderStatus[] = [
  "pending",
  "pending-quote",
  "payment-verification",
  "confirmed",
  "processing",
  "packed",
  "shipped",
  "out-for-delivery",
  "delivered",
  "cancelled"
];

export const statusLabelMap: Record<OrderStatus, string> = {
  pending: "Order Placed",
  "pending-quote": "Pending Quote",
  "payment-verification": "Payment Verification",
  confirmed: "Confirmed",
  processing: "Processing",
  packed: "Packed",
  shipped: "Shipped",
  "out-for-delivery": "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled"
};

export const statusColorMap: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  "pending-quote": "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  "payment-verification": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  confirmed: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
  processing: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  packed: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
  shipped: "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300",
  "out-for-delivery": "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
  delivered: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  cancelled: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300"
};

export type OrderTimelineEntry = {
  status: OrderStatus;
  label: string;
  date: string;
  description: string;
  completed: boolean;
};

export type Order = {
  id: string;
  orderNumber: string;
  date: string;
  status: OrderStatus;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: string;
  paymentMethod: string;
  items: {
    name: string;
    brand: string;
    image: string;
    price: number;
    quantity: number;
    color: string;
  }[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  estimatedDelivery: string;
  timeline: OrderTimelineEntry[];
};

export const mockOrder: Order = {
  id: "ord-001",
  orderNumber: "KT-2A3F9C-BX7K",
  date: "July 28, 2026",
  status: "processing",
  customerName: "Ayesha Khan",
  customerPhone: "+92 300 1234567",
  customerEmail: "ayesha@example.com",
  shippingAddress: "Suite 12, 57-E, Gulberg III, Lahore, Punjab 54000",
  paymentMethod: "Bank Transfer",
  items: [
    {
      name: "Noir Line Titanium",
      brand: "Khattak Atelier",
      image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?image_size=portrait_4_3&prompt=luxury+black+titanium+eyewear+front+view",
      price: 28500,
      quantity: 1,
      color: "Matte Black",
    },
    {
      name: "Verde Artisan Acetate",
      brand: "Khattak Signature",
      image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?image_size=portrait_4_3&prompt=emerald+acetate+eyewear+front+view",
      price: 19900,
      quantity: 1,
      color: "Emerald",
    },
  ],
  subtotal: 48400,
  shipping: 0,
  discount: 4840,
  total: 43560,
  estimatedDelivery: "August 5, 2026",
  timeline: [
    { status: "pending", label: "Order Placed", date: "July 28, 2026 - 02:30 PM", description: "Your order has been placed successfully.", completed: true },
    { status: "payment-verification", label: "Payment Verification", date: "July 28, 2026 - 02:35 PM", description: "Payment is being verified.", completed: true },
    { status: "confirmed", label: "Confirmed", date: "July 28, 2026 - 04:00 PM", description: "Order has been confirmed and payment verified.", completed: true },
    { status: "processing", label: "Processing", date: "July 29, 2026 - 10:00 AM", description: "Your frames are being prepared by our artisans.", completed: true },
    { status: "shipped", label: "Shipped", date: "Expected July 31", description: "Your order will be shipped via courier.", completed: false },
    { status: "delivered", label: "Delivered", date: "Expected Aug 5", description: "Your order will be delivered to your address.", completed: false },
  ],
};
