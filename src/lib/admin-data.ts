export type AdminProduct = {
  id: string;
  sku: string;
  name: string;
  brand: string;
  category: string;
  image: string;
  price: number;
  oldPrice: number | null;
  stock: number;
  status: "active" | "draft" | "archived";
  featured: boolean;
  discount: number;
  sales: number;
  revenue: number;
  createdAt: string;
};

export type AdminCategory = {
  id: string;
  name: string;
  slug: string;
  parent: string | null;
  description: string;
  image: string;
  productCount: number;
  featured: boolean;
  status: "active" | "inactive";
  createdAt: string;
};

export type AdminBrand = {
  id: string;
  name: string;
  slug: string;
  logo: string;
  description: string;
  website: string;
  featured: boolean;
  productCount: number;
  status: "active" | "inactive";
  createdAt: string;
};

export type DashboardStats = {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  totalProducts: number;
  totalCustomers: number;
  lowStockItems: number;
  todaySales: number;
};

export type MonthlyRevenue = {
  month: string;
  revenue: number;
  orders: number;
};

export type RecentOrder = {
  id: string;
  orderNumber: string;
  customer: string;
  email: string;
  items: number;
  total: number;
  status: string;
  date: string;
};

export type RecentCustomer = {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  orders: number;
  spent: number;
  joined: string;
};

export type ActivityItem = {
  id: string;
  type: "order" | "product" | "customer" | "review" | "system";
  action: string;
  description: string;
  time: string;
  user: string;
};

export const dashboardStats: DashboardStats = {
  totalRevenue: 2456800,
  totalOrders: 1247,
  pendingOrders: 38,
  totalProducts: 156,
  totalCustomers: 892,
  lowStockItems: 12,
  todaySales: 128500,
};

export const monthlyRevenue: MonthlyRevenue[] = [
  { month: "Jan", revenue: 145000, orders: 78 },
  { month: "Feb", revenue: 162000, orders: 92 },
  { month: "Mar", revenue: 188000, orders: 105 },
  { month: "Apr", revenue: 174000, orders: 98 },
  { month: "May", revenue: 210000, orders: 120 },
  { month: "Jun", revenue: 245000, orders: 138 },
  { month: "Jul", revenue: 232000, orders: 130 },
  { month: "Aug", revenue: 268000, orders: 145 },
  { month: "Sep", revenue: 256000, orders: 140 },
  { month: "Oct", revenue: 290000, orders: 158 },
  { month: "Nov", revenue: 275000, orders: 150 },
  { month: "Dec", revenue: 320000, orders: 175 },
];

export const recentOrders: RecentOrder[] = [
  { id: "ord-001", orderNumber: "KT-2A3F9C-BX7K", customer: "Ayesha Khan", email: "ayesha@example.com", items: 2, total: 43560, status: "processing", date: "2 hours ago" },
  { id: "ord-002", orderNumber: "KT-7D8E2F-QL4M", customer: "Ali Raza", email: "ali@example.com", items: 1, total: 28500, status: "shipped", date: "5 hours ago" },
  { id: "ord-003", orderNumber: "KT-4B1C9A-XR7P", customer: "Sara Ahmed", email: "sara@example.com", items: 3, total: 72500, status: "pending", date: "8 hours ago" },
  { id: "ord-004", orderNumber: "KT-9F2D5E-CM3K", customer: "Usman Malik", email: "usman@example.com", items: 1, total: 19900, status: "delivered", date: "1 day ago" },
  { id: "ord-005", orderNumber: "KT-6H3G1J-ZP8N", customer: "Fatima Bibi", email: "fatima@example.com", items: 2, total: 51200, status: "cancelled", date: "1 day ago" },
  { id: "ord-006", orderNumber: "KT-8K4L2M-WQ6R", customer: "Bilal Hussain", email: "bilal@example.com", items: 1, total: 16800, status: "processing", date: "2 days ago" },
  { id: "ord-007", orderNumber: "KT-3N5O7P-TD9S", customer: "Zainab Ali", email: "zainab@example.com", items: 2, total: 37400, status: "shipped", date: "2 days ago" },
  { id: "ord-008", orderNumber: "KT-5R8S0U-VG2T", customer: "Tariq Khan", email: "tariq@example.com", items: 1, total: 45900, status: "delivered", date: "3 days ago" },
];

export const latestCustomers: RecentCustomer[] = [
  { id: "cst-001", name: "Ayesha Khan", email: "ayesha@example.com", avatar: null, orders: 3, spent: 87500, joined: "Jul 28, 2026" },
  { id: "cst-002", name: "Ali Raza", email: "ali@example.com", avatar: null, orders: 1, spent: 28500, joined: "Jul 25, 2026" },
  { id: "cst-003", name: "Sara Ahmed", email: "sara@example.com", avatar: null, orders: 5, spent: 148000, joined: "Jul 20, 2026" },
  { id: "cst-004", name: "Usman Malik", email: "usman@example.com", avatar: null, orders: 2, spent: 42000, joined: "Jul 15, 2026" },
  { id: "cst-005", name: "Fatima Bibi", email: "fatima@example.com", avatar: null, orders: 4, spent: 96000, joined: "Jul 10, 2026" },
];

export const activityFeed: ActivityItem[] = [
  { id: "act-001", type: "order", action: "New Order", description: "Order KT-2A3F9C-BX7K placed by Ayesha Khan", time: "2 hours ago", user: "System" },
  { id: "act-002", type: "product", action: "Product Added", description: "New product 'Sapphire Blue Crystal' added", time: "3 hours ago", user: "Admin" },
  { id: "act-003", type: "customer", action: "New Customer", description: "Ali Raza created an account", time: "5 hours ago", user: "System" },
  { id: "act-004", type: "order", action: "Payment Received", description: "Payment confirmed for order KT-7D8E2F", time: "5 hours ago", user: "System" },
  { id: "act-005", type: "review", action: "New Review", description: "5-star review on 'Noir Line Titanium'", time: "6 hours ago", user: "Sara Ahmed" },
  { id: "act-006", type: "order", action: "Order Shipped", description: "Order KT-4B1C9A marked as shipped", time: "8 hours ago", user: "Admin" },
  { id: "act-007", type: "system", action: "Stock Alert", description: "12 products are running low on stock", time: "10 hours ago", user: "System" },
  { id: "act-008", type: "product", action: "Product Updated", description: "Price updated for 'Verde Artisan Acetate'", time: "1 day ago", user: "Admin" },
];

export const adminProducts: AdminProduct[] = [
  { id: "kt-001", sku: "KT-AT-001", name: "Noir Line Titanium", brand: "Khattak Atelier", category: "Sunglasses", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?image_size=portrait_4_3&prompt=luxury+black+titanium+eyewear+front+view", price: 28500, oldPrice: 34000, stock: 15, status: "active", featured: true, discount: 16, sales: 128, revenue: 3648000, createdAt: "Jan 15, 2026" },
  { id: "kt-002", sku: "KT-AT-002", name: "Rose Gold Aviator", brand: "Khattak Atelier", category: "Sunglasses", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?image_size=portrait_4_3&prompt=rose+gold+aviator+sunglasses+front+view", price: 32000, oldPrice: null, stock: 20, status: "active", featured: true, discount: 0, sales: 95, revenue: 3040000, createdAt: "Feb 10, 2026" },
  { id: "kt-003", sku: "KT-SG-001", name: "Verde Artisan Acetate", brand: "Khattak Signature", category: "Eyeglasses", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?image_size=portrait_4_3&prompt=emerald+acetate+eyewear+front+view", price: 19900, oldPrice: 24000, stock: 8, status: "active", featured: false, discount: 17, sales: 156, revenue: 3104400, createdAt: "Mar 5, 2026" },
  { id: "kt-004", sku: "KT-SG-002", name: "Azure Blue Crystal", brand: "Khattak Signature", category: "Eyeglasses", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?image_size=portrait_4_3&prompt=blue+crystal+eyewear+front+view", price: 22500, oldPrice: null, stock: 3, status: "active", featured: true, discount: 0, sales: 72, revenue: 1620000, createdAt: "Mar 20, 2026" },
  { id: "kt-005", sku: "KT-HR-001", name: "Aviator Classic Gold", brand: "Khattak Heritage", category: "Sunglasses", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?image_size=portrait_4_3&prompt=gold+aviator+sunglasses+front+view", price: 15900, oldPrice: 19500, stock: 25, status: "active", featured: false, discount: 18, sales: 210, revenue: 3339000, createdAt: "Apr 1, 2026" },
  { id: "kt-006", sku: "KT-HR-002", name: "Retro Round Tortoise", brand: "Khattak Heritage", category: "Eyeglasses", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?image_size=portrait_4_3&prompt=tortoise+shell+round+eyewear+front+view", price: 12500, oldPrice: null, stock: 0, status: "active", featured: false, discount: 0, sales: 185, revenue: 2312500, createdAt: "Apr 15, 2026" },
  { id: "kt-007", sku: "KT-PR-001", name: "Carbon Fiber Sport", brand: "Khattak Performance", category: "Sports", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?image_size=portrait_4_3&prompt=carbon+fiber+sport+eyewear+front+view", price: 22000, oldPrice: 26000, stock: 10, status: "active", featured: true, discount: 15, sales: 64, revenue: 1408000, createdAt: "May 5, 2026" },
  { id: "kt-008", sku: "KT-AT-003", name: "Platinum Edge Limited", brand: "Khattak Atelier", category: "Sunglasses", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?image_size=portrait_4_3&prompt=platinum+metal+eyewear+front+view", price: 52000, oldPrice: null, stock: 2, status: "active", featured: true, discount: 0, sales: 28, revenue: 1456000, createdAt: "Jun 1, 2026" },
  { id: "kt-009", sku: "KT-SG-003", name: "Amber Gradient Cat-Eye", brand: "Khattak Signature", category: "Eyeglasses", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?image_size=portrait_4_3&prompt=amber+cat+eye+eyewear+front+view", price: 18500, oldPrice: 22000, stock: 6, status: "active", featured: false, discount: 16, sales: 92, revenue: 1702000, createdAt: "Jun 15, 2026" },
  { id: "kt-010", sku: "KT-HR-003", name: "Navigator Silver Frame", brand: "Khattak Heritage", category: "Sunglasses", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?image_size=portrait_4_3&prompt=silver+navigator+sunglasses+front+view", price: 13800, oldPrice: null, stock: 18, status: "draft", featured: false, discount: 0, sales: 0, revenue: 0, createdAt: "Jul 1, 2026" },
  { id: "kt-011", sku: "KT-PR-002", name: "Ultra-Light Flex Titanium", brand: "Khattak Performance", category: "Sports", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?image_size=portrait_4_3&prompt=flexible+titanium+sports+eyewear+front+view", price: 25800, oldPrice: 30000, stock: 0, status: "archived", featured: false, discount: 14, sales: 45, revenue: 1161000, createdAt: "Feb 20, 2026" },
  { id: "kt-012", sku: "KT-AT-004", name: "Crystal Clear Collection", brand: "Khattak Atelier", category: "Eyeglasses", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?image_size=portrait_4_3&prompt=transparent+clear+eyewear+front+view", price: 19800, oldPrice: null, stock: 0, status: "draft", featured: false, discount: 0, sales: 0, revenue: 0, createdAt: "Jul 10, 2026" },
];

export const adminCategories: AdminCategory[] = [
  { id: "cat-001", name: "Sunglasses", slug: "sunglasses", parent: null, description: "Premium sunglasses with UV400 protection", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?image_size=portrait_4_3&prompt=premium+sunglasses+collection", productCount: 42, featured: true, status: "active", createdAt: "Jan 1, 2026" },
  { id: "cat-002", name: "Eyeglasses", slug: "eyeglasses", parent: null, description: "Prescription eyewear with premium lenses", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?image_size=portrait_4_3&prompt=premium+eyeglasses+collection", productCount: 58, featured: true, status: "active", createdAt: "Jan 1, 2026" },
  { id: "cat-003", name: "Sports", slug: "sports", parent: null, description: "Performance eyewear for active lifestyles", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?image_size=portrait_4_3&prompt=sports+eyewear+collection", productCount: 24, featured: false, status: "active", createdAt: "Jan 15, 2026" },
  { id: "cat-004", name: "Kids", slug: "kids", parent: null, description: "Durable and stylish eyewear for children", image: "", productCount: 18, featured: false, status: "active", createdAt: "Feb 1, 2026" },
  { id: "cat-005", name: "Blue Light", slug: "blue-light", parent: null, description: "Digital screen protection glasses", image: "", productCount: 14, featured: true, status: "active", createdAt: "Feb 15, 2026" },
  { id: "cat-006", name: "Titanium", slug: "titanium", parent: "cat-001", description: "Ultra-light titanium frame sunglasss", image: "", productCount: 8, featured: false, status: "inactive", createdAt: "Mar 1, 2026" },
];

export type AdminOrderDetail = {
  id: string;
  orderNumber: string;
  date: string;
  customer: { name: string; email: string; phone: string; avatar: string | null };
  status: string;
  items: { name: string; brand: string; image: string; price: number; quantity: number; color: string }[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  paymentMethod: string;
  transactionId: string;
  paymentStatus: string;
  shippingAddress: string;
  estimatedDelivery: string;
  timeline: { status: string; label: string; date: string; description: string; completed: boolean }[];
  notes?: string;
};

export type PaymentVerification = {
  id: string;
  orderNumber: string;
  customer: string;
  email: string;
  amount: number;
  method: "bank-transfer" | "jazzcash" | "easypaisa";
  transactionId: string;
  screenshot: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
  notes?: string;
};

export type AdminCustomerDetail = {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string | null;
  gender: string;
  dateOfBirth: string;
  totalOrders: number;
  totalSpent: number;
  joined: string;
  blocked: boolean;
  addresses: { id: string; label: string; street: string; city: string; province: string; isDefault: boolean }[];
  recentOrders: { orderNumber: string; date: string; total: number; status: string }[];
  wishlistItems: { name: string; image: string; price: number }[];
};

export type AdminReviewManage = {
  id: string;
  product: string;
  productImage: string;
  customer: string;
  avatar: string | null;
  rating: number;
  title: string;
  text: string;
  date: string;
  status: "pending" | "approved" | "rejected";
  featured: boolean;
  reply?: string;
};

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  avatar: string | null;
  text: string;
  rating: number;
  status: "active" | "inactive";
  featured: boolean;
  createdAt: string;
};

export type InventoryItem = {
  id: string;
  sku: string;
  name: string;
  image: string;
  category: string;
  brand: string;
  stock: number;
  reserved: number;
  available: number;
  lowStockThreshold: number;
  status: "in-stock" | "low-stock" | "out-of-stock";
  lastRestocked: string;
  price: number;
};

export type InventoryHistory = {
  id: string;
  product: string;
  sku: string;
  type: "restock" | "sale" | "adjustment" | "return";
  quantity: number;
  before: number;
  after: number;
  date: string;
  user: string;
  note: string;
};

export const adminOrders: AdminOrderDetail[] = [
  {
    id: "ord-001", orderNumber: "KT-2A3F9C-BX7K", date: "July 28, 2026",
    customer: { name: "Ayesha Khan", email: "ayesha@example.com", phone: "+92 300 1234567", avatar: null },
    status: "processing", paymentMethod: "Bank Transfer", transactionId: "BTX-78451-KT", paymentStatus: "verified",
    shippingAddress: "Suite 12, 57-E, Gulberg III, Lahore, Punjab 54000", estimatedDelivery: "August 5, 2026",
    items: [
      { name: "Noir Line Titanium", brand: "Khattak Atelier", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?image_size=portrait_4_3&prompt=luxury+black+titanium+eyewear+front+view", price: 28500, quantity: 1, color: "Matte Black" },
      { name: "Verde Artisan Acetate", brand: "Khattak Signature", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?image_size=portrait_4_3&prompt=emerald+acetate+eyewear+front+view", price: 19900, quantity: 1, color: "Emerald" },
    ],
    subtotal: 48400, shipping: 0, discount: 4840, total: 43560,
    timeline: [
      { status: "pending", label: "Order Placed", date: "Jul 28, 02:30 PM", description: "Order placed successfully.", completed: true },
      { status: "payment-verification", label: "Payment Verified", date: "Jul 28, 02:35 PM", description: "Payment verified.", completed: true },
      { status: "confirmed", label: "Confirmed", date: "Jul 28, 04:00 PM", description: "Order confirmed.", completed: true },
      { status: "processing", label: "Processing", date: "Jul 29, 10:00 AM", description: "Being prepared by artisans.", completed: true },
      { status: "packed", label: "Packed", date: "Expected Jul 30", description: "Will be packed with premium care.", completed: false },
      { status: "shipped", label: "Shipped", date: "Expected Jul 31", description: "Will be shipped via courier.", completed: false },
      { status: "out-for-delivery", label: "Out for Delivery", date: "Expected Aug 4", description: "Out for delivery.", completed: false },
      { status: "delivered", label: "Delivered", date: "Expected Aug 5", description: "Will be delivered.", completed: false },
    ],
  },
  {
    id: "ord-002", orderNumber: "KT-7D8E2F-QL4M", date: "July 27, 2026",
    customer: { name: "Ali Raza", email: "ali@example.com", phone: "+92 300 7654321", avatar: null },
    status: "shipped", paymentMethod: "JazzCash", transactionId: "JC-45219-KT", paymentStatus: "verified",
    shippingAddress: "House 8, Street 15, F-7/4, Islamabad", estimatedDelivery: "August 2, 2026",
    items: [{ name: "Rose Gold Aviator", brand: "Khattak Atelier", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?image_size=portrait_4_3&prompt=rose+gold+aviator+sunglasses+front+view", price: 32000, quantity: 1, color: "Rose Gold" }],
    subtotal: 32000, shipping: 350, discount: 0, total: 32350,
    timeline: [
      { status: "pending", label: "Order Placed", date: "Jul 27, 11:00 AM", description: "Order placed.", completed: true },
      { status: "payment-verification", label: "Payment Verified", date: "Jul 27, 11:05 AM", description: "Payment verified via JazzCash.", completed: true },
      { status: "confirmed", label: "Confirmed", date: "Jul 27, 01:00 PM", description: "Order confirmed.", completed: true },
      { status: "processing", label: "Processing", date: "Jul 27, 03:00 PM", description: "Processing.", completed: true },
      { status: "packed", label: "Packed", date: "Jul 28, 10:00 AM", description: "Packed.", completed: true },
      { status: "shipped", label: "Shipped", date: "Jul 29, 09:00 AM", description: "Shipped via TCS.", completed: true },
      { status: "out-for-delivery", label: "Out for Delivery", date: "Expected Aug 1", description: "Out for delivery.", completed: false },
      { status: "delivered", label: "Delivered", date: "Expected Aug 2", description: "Delivery expected.", completed: false },
    ],
  },
  {
    id: "ord-003", orderNumber: "KT-4B1C9A-XR7P", date: "July 26, 2026",
    customer: { name: "Sara Ahmed", email: "sara@example.com", phone: "+92 321 4567890", avatar: null },
    status: "pending", paymentMethod: "EasyPaisa", transactionId: "EP-89327-KT", paymentStatus: "pending",
    shippingAddress: "Plot 5, Phase 2, DHA, Karachi, Sindh", estimatedDelivery: "August 4, 2026",
    items: [
      { name: "Carbon Fiber Sport", brand: "Khattak Performance", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?image_size=portrait_4_3&prompt=carbon+fiber+sport+eyewear+front+view", price: 22000, quantity: 2, color: "Carbon Black" },
      { name: "Aviator Classic Gold", brand: "Khattak Heritage", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?image_size=portrait_4_3&prompt=gold+aviator+sunglasses+front+view", price: 15900, quantity: 1, color: "Gold" },
    ],
    subtotal: 59900, shipping: 0, discount: 0, total: 59900,
    timeline: [
      { status: "pending", label: "Order Placed", date: "Jul 26, 06:00 PM", description: "Order placed. Awaiting payment verification.", completed: true },
    ],
  },
  {
    id: "ord-004", orderNumber: "KT-9F2D5E-CM3K", date: "July 25, 2026",
    customer: { name: "Usman Malik", email: "usman@example.com", phone: "+92 333 9876543", avatar: null },
    status: "delivered", paymentMethod: "Bank Transfer", transactionId: "BTX-12478-KT", paymentStatus: "verified",
    shippingAddress: "Office 3, Al-Falah Plaza, Mall Road, Lahore", estimatedDelivery: "July 30, 2026",
    items: [{ name: "Verde Artisan Acetate", brand: "Khattak Signature", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?image_size=portrait_4_3&prompt=emerald+acetate+eyewear+front+view", price: 19900, quantity: 1, color: "Emerald" }],
    subtotal: 19900, shipping: 350, discount: 0, total: 20250,
    timeline: [
      { status: "pending", label: "Order Placed", date: "Jul 25", description: "Order placed.", completed: true },
      { status: "payment-verification", label: "Payment Verified", date: "Jul 25", description: "Payment verified.", completed: true },
      { status: "confirmed", label: "Confirmed", date: "Jul 25", description: "Confirmed.", completed: true },
      { status: "processing", label: "Processing", date: "Jul 26", description: "Processing.", completed: true },
      { status: "packed", label: "Packed", date: "Jul 27", description: "Packed.", completed: true },
      { status: "shipped", label: "Shipped", date: "Jul 28", description: "Shipped.", completed: true },
      { status: "out-for-delivery", label: "Out for Delivery", date: "Jul 29", description: "Out for delivery.", completed: true },
      { status: "delivered", label: "Delivered", date: "Jul 30", description: "Delivered successfully.", completed: true },
    ],
  },
  {
    id: "ord-005", orderNumber: "KT-6H3G1J-ZP8N", date: "July 24, 2026",
    customer: { name: "Fatima Bibi", email: "fatima@example.com", phone: "+92 345 6789012", avatar: null },
    status: "cancelled", paymentMethod: "JazzCash", transactionId: "JC-33671-KT", paymentStatus: "refunded",
    shippingAddress: "House 12, Street 8, G-10/2, Islamabad", estimatedDelivery: "—",
    items: [{ name: "Platinum Edge Limited", brand: "Khattak Atelier", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?image_size=portrait_4_3&prompt=platinum+metal+eyewear+front+view", price: 52000, quantity: 1, color: "Platinum" }],
    subtotal: 52000, shipping: 0, discount: 0, total: 52000,
    timeline: [
      { status: "pending", label: "Order Placed", date: "Jul 24", description: "Order placed.", completed: true },
      { status: "payment-verification", label: "Payment Verified", date: "Jul 24", description: "Payment verified.", completed: true },
      { status: "cancelled", label: "Cancelled", date: "Jul 25", description: "Cancelled at customer request. Refund initiated.", completed: true },
    ],
  },
];

export const paymentVerifications: PaymentVerification[] = [
  { id: "pv-001", orderNumber: "KT-4B1C9A-XR7P", customer: "Sara Ahmed", email: "sara@example.com", amount: 59900, method: "easypaisa", transactionId: "EP-89327-KT", screenshot: "", submittedAt: "Jul 26, 2026 - 06:05 PM", status: "pending" },
  { id: "pv-002", orderNumber: "KT-8K4L2M-WQ6R", customer: "Bilal Hussain", email: "bilal@example.com", amount: 16800, method: "bank-transfer", transactionId: "BTX-45123-KT", screenshot: "", submittedAt: "Jul 25, 2026 - 02:15 PM", status: "pending" },
  { id: "pv-003", orderNumber: "KT-3N5O7P-TD9S", customer: "Zainab Ali", email: "zainab@example.com", amount: 37400, method: "jazzcash", transactionId: "JC-55129-KT", screenshot: "", submittedAt: "Jul 24, 2026 - 11:30 AM", status: "pending" },
  { id: "pv-004", orderNumber: "KT-2A3F9C-BX7K", customer: "Ayesha Khan", email: "ayesha@example.com", amount: 43560, method: "bank-transfer", transactionId: "BTX-78451-KT", screenshot: "", submittedAt: "Jul 28, 2026 - 02:35 PM", status: "approved", notes: "Payment confirmed via bank statement" },
  { id: "pv-005", orderNumber: "KT-6H3G1J-ZP8N", customer: "Fatima Bibi", email: "fatima@example.com", amount: 52000, method: "jazzcash", transactionId: "JC-33671-KT", screenshot: "", submittedAt: "Jul 24, 2026 - 01:00 PM", status: "rejected", notes: "Transaction ID does not match records" },
];

export const adminCustomerDetails: AdminCustomerDetail[] = [
  { id: "cst-001", name: "Ayesha Khan", email: "ayesha@example.com", phone: "+92 300 1234567", avatar: null, gender: "Female", dateOfBirth: "1995-06-15", totalOrders: 3, totalSpent: 87500, joined: "Jan 10, 2026", blocked: false,
    addresses: [{ id: "a1", label: "Home", street: "57-E, Gulberg III", city: "Lahore", province: "Punjab", isDefault: true }],
    recentOrders: [{ orderNumber: "KT-2A3F9C-BX7K", date: "Jul 28, 2026", total: 43560, status: "processing" }, { orderNumber: "KT-9B8D2E-AC1M", date: "Jun 15, 2026", total: 28500, status: "delivered" }],
    wishlistItems: [{ name: "Carbon Fiber Sport", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?image_size=portrait_4_3&prompt=carbon+fiber+sport+eyewear+front+view", price: 22000 }, { name: "Platinum Edge Limited", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?image_size=portrait_4_3&prompt=platinum+metal+eyewear+front+view", price: 52000 }],
  },
  { id: "cst-002", name: "Ali Raza", email: "ali@example.com", phone: "+92 300 7654321", avatar: null, gender: "Male", dateOfBirth: "1992-03-22", totalOrders: 1, totalSpent: 28500, joined: "Jul 25, 2026", blocked: false,
    addresses: [{ id: "a2", label: "Home", street: "House 8, Street 15, F-7/4", city: "Islamabad", province: "ICT", isDefault: true }],
    recentOrders: [{ orderNumber: "KT-7D8E2F-QL4M", date: "Jul 27, 2026", total: 32350, status: "shipped" }],
    wishlistItems: [],
  },
  { id: "cst-003", name: "Sara Ahmed", email: "sara@example.com", phone: "+92 321 4567890", avatar: null, gender: "Female", dateOfBirth: "1998-11-08", totalOrders: 5, totalSpent: 148000, joined: "Jul 20, 2026", blocked: false,
    addresses: [{ id: "a3", label: "Home", street: "Plot 5, Phase 2, DHA", city: "Karachi", province: "Sindh", isDefault: true }, { id: "a4", label: "Office", street: "3rd Floor, Business Bay, Clifton", city: "Karachi", province: "Sindh", isDefault: false }],
    recentOrders: [{ orderNumber: "KT-4B1C9A-XR7P", date: "Jul 26, 2026", total: 59900, status: "pending" }, { orderNumber: "KT-2X9M4N-AB5K", date: "Jul 10, 2026", total: 22500, status: "delivered" }],
    wishlistItems: [{ name: "Noir Line Titanium", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?image_size=portrait_4_3&prompt=luxury+black+titanium+eyewear+front+view", price: 28500 }],
  },
  { id: "cst-004", name: "Bilal Hussain", email: "bilal@example.com", phone: "+92 333 9876543", avatar: null, gender: "Male", dateOfBirth: "1990-09-14", totalOrders: 2, totalSpent: 42000, joined: "Jul 15, 2026", blocked: false,
    addresses: [{ id: "a5", label: "Home", street: "House 3, Street 42, G-9/1", city: "Islamabad", province: "ICT", isDefault: true }],
    recentOrders: [{ orderNumber: "KT-8K4L2M-WQ6R", date: "Jul 25, 2026", total: 16800, status: "pending" }],
    wishlistItems: [],
  },
  { id: "cst-005", name: "Fatima Bibi", email: "fatima@example.com", phone: "+92 345 6789012", avatar: null, gender: "Female", dateOfBirth: "1993-02-28", totalOrders: 4, totalSpent: 96000, joined: "Jul 10, 2026", blocked: true,
    addresses: [{ id: "a6", label: "Home", street: "House 12, Street 8, G-10/2", city: "Islamabad", province: "ICT", isDefault: true }],
    recentOrders: [{ orderNumber: "KT-6H3G1J-ZP8N", date: "Jul 24, 2026", total: 52000, status: "cancelled" }],
    wishlistItems: [],
  },
];

export const adminReviewsManage: AdminReviewManage[] = [
  { id: "rev-001", product: "Noir Line Titanium", productImage: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?image_size=portrait_4_3&prompt=luxury+black+titanium+eyewear+front+view", customer: "Ayesha Khan", avatar: null, rating: 5, title: "Absolutely stunning", text: "The titanium build is incredibly lightweight. I forget I'm wearing them. The matte finish looks premium.", date: "Jul 15, 2026", status: "approved", featured: true, reply: "Thank you, Ayesha! We're glad you love them." },
  { id: "rev-002", product: "Verde Artisan Acetate", productImage: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?image_size=portrait_4_3&prompt=emerald+acetate+eyewear+front+view", customer: "Ali Raza", avatar: null, rating: 4, title: "Beautiful color", text: "The emerald color is gorgeous and the acetate feels high quality. Slightly heavy but comfortable.", date: "Jul 10, 2026", status: "approved", featured: false },
  { id: "rev-003", product: "Aviator Classic Gold", productImage: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?image_size=portrait_4_3&prompt=gold+aviator+sunglasses+front+view", customer: "Sara Ahmed", avatar: null, rating: 3, title: "Good but needs adjustment", text: "The frames look great but needed adjustment at the store. Staff was helpful.", date: "Jul 5, 2026", status: "pending", featured: false },
  { id: "rev-004", product: "Carbon Fiber Sport", productImage: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?image_size=portrait_4_3&prompt=carbon+fiber+sport+eyewear+front+view", customer: "Bilal Hussain", avatar: null, rating: 5, title: "Perfect for sports", text: "These stay on during my morning runs. Lightweight and sweat-resistant. Highly recommend.", date: "Jun 28, 2026", status: "pending", featured: false },
  { id: "rev-005", product: "Retro Round Tortoise", productImage: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?image_size=portrait_4_3&prompt=tortoise+shell+round+eyewear+front+view", customer: "Fatima Bibi", avatar: null, rating: 2, title: "Not what I expected", text: "The color was darker than shown online. Returning for a different frame.", date: "Jun 20, 2026", status: "rejected", featured: false },
  { id: "rev-006", product: "Rose Gold Aviator", productImage: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?image_size=portrait_4_3&prompt=rose+gold+aviator+sunglasses+front+view", customer: "Usman Malik", avatar: null, rating: 5, title: "Premium quality", text: "These sunglasses are worth every rupee. The rose gold finish is elegant.", date: "Jun 15, 2026", status: "approved", featured: true },
];

export const adminTestimonials: Testimonial[] = [
  { id: "tst-001", name: "Ayesha Khan", role: "Loyal Customer", avatar: null, text: "Khattak Eyewear has completely changed how I see premium frames. The quality is unmatched and the service is exceptional.", rating: 5, status: "active", featured: true, createdAt: "Jun 1, 2026" },
  { id: "tst-002", name: "Ali Raza", role: "First-time Buyer", avatar: null, text: "I was hesitant about buying eyewear online, but the virtual try-on feature made it easy. My frames arrived perfectly fitted.", rating: 5, status: "active", featured: true, createdAt: "Jun 15, 2026" },
  { id: "tst-003", name: "Sara Ahmed", role: "Fashion Enthusiast", avatar: null, text: "The acetate collection is stunning. I get compliments everywhere I go. Definitely my go-to brand now.", rating: 4, status: "active", featured: false, createdAt: "Jul 1, 2026" },
  { id: "tst-004", name: "Bilal Hussain", role: "Athlete", avatar: null, text: "The sports collection is fantastic. Lightweight, durable, and they stay put during intense workouts.", rating: 5, status: "inactive", featured: false, createdAt: "Jul 10, 2026" },
];

export const adminInventory: InventoryItem[] = [
  { id: "kt-001", sku: "KT-AT-001", name: "Noir Line Titanium", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?image_size=portrait_4_3&prompt=luxury+black+titanium+eyewear+front+view", category: "Sunglasses", brand: "Khattak Atelier", stock: 15, reserved: 2, available: 13, lowStockThreshold: 5, status: "in-stock", lastRestocked: "Jul 20, 2026", price: 28500 },
  { id: "kt-002", sku: "KT-AT-002", name: "Rose Gold Aviator", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?image_size=portrait_4_3&prompt=rose+gold+aviator+sunglasses+front+view", category: "Sunglasses", brand: "Khattak Atelier", stock: 20, reserved: 1, available: 19, lowStockThreshold: 5, status: "in-stock", lastRestocked: "Jul 15, 2026", price: 32000 },
  { id: "kt-003", sku: "KT-SG-001", name: "Verde Artisan Acetate", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?image_size=portrait_4_3&prompt=emerald+acetate+eyewear+front+view", category: "Eyeglasses", brand: "Khattak Signature", stock: 8, reserved: 1, available: 7, lowStockThreshold: 10, status: "low-stock", lastRestocked: "Jul 10, 2026", price: 19900 },
  { id: "kt-004", sku: "KT-SG-002", name: "Azure Blue Crystal", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?image_size=portrait_4_3&prompt=blue+crystal+eyewear+front+view", category: "Eyeglasses", brand: "Khattak Signature", stock: 3, reserved: 1, available: 2, lowStockThreshold: 5, status: "low-stock", lastRestocked: "Jun 28, 2026", price: 22500 },
  { id: "kt-005", sku: "KT-HR-001", name: "Aviator Classic Gold", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?image_size=portrait_4_3&prompt=gold+aviator+sunglasses+front+view", category: "Sunglasses", brand: "Khattak Heritage", stock: 25, reserved: 3, available: 22, lowStockThreshold: 8, status: "in-stock", lastRestocked: "Jul 25, 2026", price: 15900 },
  { id: "kt-006", sku: "KT-HR-002", name: "Retro Round Tortoise", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?image_size=portrait_4_3&prompt=tortoise+shell+round+eyewear+front+view", category: "Eyeglasses", brand: "Khattak Heritage", stock: 0, reserved: 0, available: 0, lowStockThreshold: 10, status: "out-of-stock", lastRestocked: "May 15, 2026", price: 12500 },
  { id: "kt-007", sku: "KT-PR-001", name: "Carbon Fiber Sport", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?image_size=portrait_4_3&prompt=carbon+fiber+sport+eyewear+front+view", category: "Sports", brand: "Khattak Performance", stock: 10, reserved: 2, available: 8, lowStockThreshold: 5, status: "in-stock", lastRestocked: "Jul 18, 2026", price: 22000 },
  { id: "kt-008", sku: "KT-AT-003", name: "Platinum Edge Limited", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?image_size=portrait_4_3&prompt=platinum+metal+eyewear+front+view", category: "Sunglasses", brand: "Khattak Atelier", stock: 2, reserved: 1, available: 1, lowStockThreshold: 3, status: "low-stock", lastRestocked: "Jun 1, 2026", price: 52000 },
  { id: "kt-009", sku: "KT-SG-003", name: "Amber Gradient Cat-Eye", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?image_size=portrait_4_3&prompt=amber+cat+eye+eyewear+front+view", category: "Eyeglasses", brand: "Khattak Signature", stock: 0, reserved: 0, available: 0, lowStockThreshold: 5, status: "out-of-stock", lastRestocked: "Apr 20, 2026", price: 18500 },
  { id: "kt-010", sku: "KT-HR-003", name: "Navigator Silver Frame", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?image_size=portrait_4_3&prompt=silver+navigator+sunglasses+front+view", category: "Sunglasses", brand: "Khattak Heritage", stock: 18, reserved: 0, available: 18, lowStockThreshold: 5, status: "in-stock", lastRestocked: "Jul 1, 2026", price: 13800 },
];

export const inventoryHistory: InventoryHistory[] = [
  { id: "ih-001", product: "Noir Line Titanium", sku: "KT-AT-001", type: "restock", quantity: 10, before: 5, after: 15, date: "Jul 20, 2026 - 10:00 AM", user: "Admin", note: "Regular restock" },
  { id: "ih-002", product: "Rose Gold Aviator", sku: "KT-AT-002", type: "sale", quantity: -1, before: 21, after: 20, date: "Jul 27, 2026 - 11:00 AM", user: "System", note: "Order KT-7D8E2F" },
  { id: "ih-003", product: "Verde Artisan Acetate", sku: "KT-SG-001", type: "sale", quantity: -1, before: 9, after: 8, date: "Jul 28, 2026 - 02:30 PM", user: "System", note: "Order KT-2A3F9C" },
  { id: "ih-004", product: "Carbon Fiber Sport", sku: "KT-PR-001", type: "adjustment", quantity: -2, before: 12, after: 10, date: "Jul 18, 2026 - 03:00 PM", user: "Admin", note: "Quality check adjustment" },
  { id: "ih-005", product: "Retro Round Tortoise", sku: "KT-HR-002", type: "sale", quantity: -1, before: 1, after: 0, date: "Jul 15, 2026 - 04:00 PM", user: "System", note: "Final unit sold" },
  { id: "ih-006", product: "Aviator Classic Gold", sku: "KT-HR-001", type: "restock", quantity: 20, before: 5, after: 25, date: "Jul 25, 2026 - 09:00 AM", user: "Admin", note: "Bulk restock from supplier" },
  { id: "ih-007", product: "Noir Line Titanium", sku: "KT-AT-001", type: "sale", quantity: -1, before: 16, after: 15, date: "Jul 28, 2026 - 02:30 PM", user: "System", note: "Order KT-2A3F9C" },
];

export const adminBrands: AdminBrand[] = [
  { id: "brd-001", name: "Khattak Atelier", slug: "khattak-atelier", logo: "", description: "Premium handcrafted eyewear using the finest materials", website: "https://khattak.com/atelier", featured: true, productCount: 38, status: "active", createdAt: "Jan 1, 2026" },
  { id: "brd-002", name: "Khattak Signature", slug: "khattak-signature", logo: "", description: "Distinctive designs for the modern individual", website: "https://khattak.com/signature", featured: true, productCount: 45, status: "active", createdAt: "Jan 1, 2026" },
  { id: "brd-003", name: "Khattak Heritage", slug: "khattak-heritage", logo: "", description: "Timeless classics inspired by tradition", website: "https://khattak.com/heritage", featured: true, productCount: 35, status: "active", createdAt: "Jan 15, 2026" },
  { id: "brd-004", name: "Khattak Performance", slug: "khattak-performance", logo: "", description: "Engineered for athletes and active lifestyles", website: "https://khattak.com/performance", featured: false, productCount: 22, status: "active", createdAt: "Feb 1, 2026" },
  { id: "brd-005", name: "Khattak Luxe", slug: "khattak-luxe", logo: "", description: "Ultra-premium limited edition collections", website: "https://khattak.com/luxe", featured: false, productCount: 16, status: "inactive", createdAt: "Mar 1, 2026" },
];
