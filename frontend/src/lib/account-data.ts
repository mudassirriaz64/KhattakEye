export type Address = {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  street: string;
  area: string;
  city: string;
  province: string;
  postalCode: string;
  isDefault: boolean;
};

export type ReviewItem = {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  productBrand: string;
  rating: number;
  title: string;
  text: string;
  date: string;
  status: "published" | "pending";
  images?: string[];
};

export type NotificationItem = {
  id: string;
  type: "order" | "promotion" | "offer" | "system";
  title: string;
  message: string;
  date: string;
  read: boolean;
};

export type OrderSummary = {
  id: string;
  orderNumber: string;
  date: string;
  status: string;
  total: number;
  items: number;
};

export const mockAddresses: Address[] = [
  {
    id: "addr-001",
    label: "Home",
    fullName: "Ayesha Khan",
    phone: "+92 300 1234567",
    street: "57-E, Gulberg III",
    area: "Gulberg",
    city: "Lahore",
    province: "Punjab",
    postalCode: "54000",
    isDefault: true,
  },
  {
    id: "addr-002",
    label: "Office",
    fullName: "Ayesha Khan",
    phone: "+92 300 1234567",
    street: "12th Floor, Tower A, MM Alam Road",
    area: "Gulberg II",
    city: "Lahore",
    province: "Punjab",
    postalCode: "54600",
    isDefault: false,
  },
];

export const mockReviews: ReviewItem[] = [
  {
    id: "rev-001",
    productId: "kt-001",
    productName: "Noir Line Titanium",
    productImage: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?image_size=portrait_4_3&prompt=luxury+black+titanium+eyewear+front+view",
    productBrand: "Khattak Atelier",
    rating: 5,
    title: "Absolutely stunning frames",
    text: "The titanium build is incredibly lightweight. I forget I'm wearing them. The matte finish looks premium and doesn't show fingerprints at all.",
    date: "July 15, 2026",
    status: "published",
  },
  {
    id: "rev-002",
    productId: "kt-003",
    productName: "Verde Artisan Acetate",
    productImage: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?image_size=portrait_4_3&prompt=emerald+acetate+eyewear+front+view",
    productBrand: "Khattak Signature",
    rating: 4,
    title: "Beautiful color but slightly heavy",
    text: "The emerald color is gorgeous and the acetate feels high quality. They're a bit heavier than my previous frames but still comfortable for all-day wear.",
    date: "July 10, 2026",
    status: "published",
  },
  {
    id: "rev-003",
    productId: "kt-005",
    productName: "Aviator Classic Gold",
    productImage: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?image_size=portrait_4_3&prompt=gold+aviator+sunglasses+front+view",
    productBrand: "Khattak Heritage",
    rating: 3,
    title: "Good but adjusting required",
    text: "The frames look great but needed adjustment at the store. The staff was helpful and fixed the fit.",
    date: "June 28, 2026",
    status: "pending",
  },
];

export const mockNotifications: NotificationItem[] = [
  {
    id: "not-001",
    type: "order",
    title: "Order Shipped",
    message: "Your order KT-2A3F9C-BX7K has been shipped and is on its way.",
    date: "July 29, 2026",
    read: false,
  },
  {
    id: "not-002",
    type: "order",
    title: "Order Confirmed",
    message: "Your order KT-2A3F9C-BX7K has been confirmed and payment verified.",
    date: "July 28, 2026",
    read: false,
  },
  {
    id: "not-003",
    type: "offer",
    title: "Summer Sale - 20% Off",
    message: "Get 20% off on all premium acetate frames. Limited time offer!",
    date: "July 25, 2026",
    read: true,
  },
  {
    id: "not-004",
    type: "promotion",
    title: "New Collection Alert",
    message: "The new Khattak Artisan Collection is now available. Explore handcrafted frames.",
    date: "July 20, 2026",
    read: true,
  },
  {
    id: "not-005",
    type: "system",
    title: "Password Changed",
    message: "Your account password was changed successfully.",
    date: "July 18, 2026",
    read: true,
  },
  {
    id: "not-006",
    type: "offer",
    title: "Refer a Friend",
    message: "Refer a friend and get Rs. 1,000 off your next purchase. Share your referral link!",
    date: "July 15, 2026",
    read: false,
  },
];

export const recentOrders: OrderSummary[] = [
  {
    id: "ord-001",
    orderNumber: "KT-2A3F9C-BX7K",
    date: "July 28, 2026",
    status: "processing",
    total: 43560,
    items: 2,
  },
  {
    id: "ord-002",
    orderNumber: "KT-9B8D2E-AC1M",
    date: "June 15, 2026",
    status: "delivered",
    total: 28500,
    items: 1,
  },
  {
    id: "ord-003",
    orderNumber: "KT-4C7F1A-ZX9P",
    date: "May 20, 2026",
    status: "cancelled",
    total: 19900,
    items: 1,
  },
];
