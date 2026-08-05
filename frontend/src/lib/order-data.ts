export type OrderStatus =
  | "pending"
  | "payment-verification"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

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
