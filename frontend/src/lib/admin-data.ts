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
  _id?: string;
  name: string;
  slug: string;
  parent: string | null;
  description: string;
  image: string;
  productCount: number;
  featured: boolean;
  status: "active" | "inactive";
  productKind?: "glasses" | "lenses";
  type?: "category" | "style" | "collection";
  group?: string;
  createdAt: string;
};

export type ApiSubcategory = {
  _id?: string;
  id?: string;
  name: string;
  slug: string;
  description?: string;
  group?: string;
  productCount?: number;
};

export type ApiCategory = {
  _id?: string;
  id?: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  productCount?: number;
  featured?: boolean;
  status?: "active" | "inactive";
  productKind?: "glasses" | "lenses";
  type?: "category" | "style" | "collection";
  createdAt?: string;
  subcategories?: ApiSubcategory[];
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
  { id: "cat-001", name: "Sunglasses", slug: "sunglasses", parent: null, description: "Premium sunglasses with UV400 protection", image: "", productCount: 42, featured: true, status: "active", createdAt: "Jan 1, 2026", productKind: "glasses", type: "category" },
  { id: "cat-002", name: "Eyeglasses", slug: "eyeglasses", parent: null, description: "Prescription & everyday optical frames", image: "", productCount: 58, featured: true, status: "active", createdAt: "Jan 1, 2026", productKind: "glasses", type: "category" },
  // Sunglasses Subcategories
  { id: "cat-010", name: "Polarized Shades", slug: "polarized-shades", parent: "cat-001", description: "Glare-reducing polarized lenses", image: "", productCount: 16, featured: true, status: "active", createdAt: "Feb 1, 2026" },
  { id: "cat-011", name: "Driving Sunglasses", slug: "driving-sunglasses", parent: "cat-001", description: "High contrast lenses for optimal driving vision", image: "", productCount: 12, featured: false, status: "active", createdAt: "Feb 5, 2026" },
  { id: "cat-012", name: "Fashion & Luxury", slug: "fashion-luxury", parent: "cat-001", description: "Statement fashion frames", image: "", productCount: 22, featured: true, status: "active", createdAt: "Feb 10, 2026" },
  { id: "cat-013", name: "Sports Performance", slug: "sports-performance", parent: "cat-001", description: "Wrap-around aerodynamic frames", image: "", productCount: 9, featured: false, status: "active", createdAt: "Feb 12, 2026" },
  // Eyeglasses Subcategories
  { id: "cat-020", name: "Prescription Glasses", slug: "prescription-glasses", parent: "cat-002", description: "Single vision and progressive frames", image: "", productCount: 30, featured: true, status: "active", createdAt: "Feb 1, 2026" },
  { id: "cat-021", name: "Computer & Blue Light", slug: "blue-light", parent: "cat-002", description: "Digital screen eye strain protection", image: "", productCount: 25, featured: true, status: "active", createdAt: "Feb 5, 2026" },
  { id: "cat-022", name: "Reading Glasses", slug: "reading-glasses", parent: "cat-002", description: "Compact magnification frames", image: "", productCount: 14, featured: false, status: "active", createdAt: "Feb 10, 2026" },
  { id: "cat-023", name: "Rimless & Minimalist", slug: "rimless-frames", parent: "cat-002", description: "Ultra lightweight rimless design", image: "", productCount: 18, featured: true, status: "active", createdAt: "Feb 15, 2026" },
];

export const adminLensesCategories: AdminCategory[] = [
  { id: "cat-lns-001", name: "Shop by Type", slug: "shop-by-type", parent: null, description: "Category grouping for contact lenses by wear duration and usage", image: "", productCount: 45, featured: true, status: "active", createdAt: "Jan 1, 2026", productKind: "lenses", type: "category" },
  { id: "cat-lns-002", name: "Shop by Need", slug: "shop-by-need", parent: null, description: "Style & specialty grouping for contact lenses by vision need", image: "", productCount: 30, featured: true, status: "active", createdAt: "Jan 1, 2026", productKind: "lenses", type: "style" },
  // Shop by Type Subcategories
  { id: "cat-lns-010", name: "Daily", slug: "daily", parent: "cat-lns-001", description: "Daily contact lenses", image: "", productCount: 12, featured: true, status: "active", createdAt: "Feb 1, 2026" },
  { id: "cat-lns-011", name: "Monthly", slug: "monthly", parent: "cat-lns-001", description: "Monthly contact lenses", image: "", productCount: 15, featured: true, status: "active", createdAt: "Feb 1, 2026" },
  { id: "cat-lns-012", name: "Yearly", slug: "yearly", parent: "cat-lns-001", description: "Yearly contact lenses", image: "", productCount: 8, featured: true, status: "active", createdAt: "Feb 1, 2026" },
  { id: "cat-lns-013", name: "Colored", slug: "colored", parent: "cat-lns-001", description: "Colored contact lenses", image: "", productCount: 18, featured: true, status: "active", createdAt: "Feb 1, 2026" },
  { id: "cat-lns-014", name: "Cosmetic", slug: "cosmetic", parent: "cat-lns-001", description: "Cosmetic contact lenses", image: "", productCount: 10, featured: true, status: "active", createdAt: "Feb 1, 2026" },
  // Shop by Need Subcategories
  { id: "cat-lns-020", name: "Toric (Astigmatism)", slug: "toric", parent: "cat-lns-002", description: "Astigmatism correction lenses", image: "", productCount: 9, featured: true, status: "active", createdAt: "Feb 1, 2026" },
  { id: "cat-lns-021", name: "Multifocal", slug: "multifocal", parent: "cat-lns-002", description: "Presbyopia correction lenses", image: "", productCount: 7, featured: true, status: "active", createdAt: "Feb 1, 2026" },
  { id: "cat-lns-022", name: "Daily Disposable", slug: "daily-disposable", parent: "cat-lns-002", description: "Single-use daily disposable lenses", image: "", productCount: 14, featured: true, status: "active", createdAt: "Feb 1, 2026" }
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

export type CmsBanner = { id: string; title: string; subtitle: string; image: string; link: string; active: boolean; type: "slider" | "offer" | "popup" | "seasonal"; position: number };
export type CmsCoupon = { id: string; code: string; description: string; discount: number; type: "percentage" | "fixed"; minOrder: number; usageLimit: number; used: number; expiresAt: string; active: boolean };
export type CmsSubscriber = { id: string; email: string; name: string; subscribedAt: string; status: "active" | "unsubscribed" };
export type CmsMediaItem = { id: string; name: string; url: string; folder: string; type: "image" | "document"; size: string; uploadedAt: string; alt: string };
export type CmsPageContent = { id: string; slug: string; title: string; content: string; status: "published" | "draft"; updatedAt: string };
export type CmsHomepageSection = { id: string; section: string; title: string; subtitle: string; visible: boolean; order: number };
export type CmsFaq = { id: string; question: string; answer: string; category: string; order: number; active: boolean };

export const cmsHomepageSections: CmsHomepageSection[] = [
  { id: "hp-1", section: "hero", title: "Precision Crafted For Your Vision", subtitle: "Discover premium handcrafted eyewear", visible: true, order: 1 },
  { id: "hp-2", section: "brand-trust", title: "Trusted by Thousands", subtitle: "Premium quality across Pakistan", visible: true, order: 2 },
  { id: "hp-3", section: "categories", title: "Shop by Category", subtitle: "Find your perfect pair", visible: true, order: 3 },
  { id: "hp-4", section: "featured-collection", title: "Featured Collection", subtitle: "Curated for you", visible: true, order: 4 },
  { id: "hp-5", section: "virtual-try-on", title: "Virtual Try-On", subtitle: "See how they look on you", visible: true, order: 5 },
  { id: "hp-6", section: "premium-collection", title: "Premium Collection", subtitle: "Our finest materials", visible: true, order: 6 },
  { id: "hp-7", section: "brands", title: "Featured Brands", subtitle: "Explore our brands", visible: true, order: 7 },
  { id: "hp-8", section: "why-choose-us", title: "Why Choose Us", subtitle: "The Khattak difference", visible: true, order: 8 },
  { id: "hp-9", section: "testimonials", title: "What Our Customers Say", subtitle: "Real stories from real people", visible: true, order: 9 },
  { id: "hp-10", section: "instagram", title: "Follow Us", subtitle: "@khattak_eyewear", visible: false, order: 10 },
  { id: "hp-11", section: "newsletter", title: "Stay in the Loop", subtitle: "Subscribe for exclusive offers", visible: true, order: 11 },
];

export const cmsBanners: CmsBanner[] = [
  { id: "bn-1", title: "Summer Collection 2026", subtitle: "Up to 30% off on premium sunglasses", image: "", link: "/shop/sunglasses", active: true, type: "slider", position: 1 },
  { id: "bn-2", title: "New Titanium Arrivals", subtitle: "Ultra-light frames, maximum comfort", image: "", link: "/shop?material=titanium", active: true, type: "slider", position: 2 },
  { id: "bn-3", title: "Free Shipping Over Rs. 3,000", subtitle: "Nationwide delivery", image: "", link: "/shop", active: true, type: "offer", position: 1 },
  { id: "bn-4", title: "First Purchase Discount", subtitle: "Get 10% off using code KHATTAK10", image: "", link: "/shop", active: true, type: "popup", position: 1 },
  { id: "bn-5", title: "Eid Collection", subtitle: "Limited edition frames", image: "", link: "/shop", active: false, type: "seasonal", position: 1 },
];

export const cmsPages: CmsPageContent[] = [
  { id: "pg-1", slug: "about", title: "About Us", content: "<h2>Our Story</h2><p>Khattak Eyewear was founded with a vision to provide premium, handcrafted eyewear that combines traditional craftsmanship with modern design. Each frame tells a story of heritage, precision, and the pursuit of perfection.</p><p>Our team of skilled artisans works with the finest materials — from Japanese titanium to Italian acetate — to create eyewear that not only looks exceptional but feels comfortable for all-day wear.</p>", status: "published", updatedAt: "Jul 28, 2026" },
  { id: "pg-2", slug: "privacy", title: "Privacy Policy", content: "<h2>Privacy Policy</h2><p>At Khattak Eyewear, we take your privacy seriously. This policy describes how we collect, use, and protect your personal information when you use our website and services.</p><h3>Information We Collect</h3><p>We collect information you provide directly to us, such as your name, email address, phone number, shipping address, and payment information when you make a purchase.</p>", status: "published", updatedAt: "Jul 25, 2026" },
  { id: "pg-3", slug: "shipping", title: "Shipping Policy", content: "<h2>Shipping Policy</h2><p>We offer free shipping on all orders over Rs. 3,000. Standard delivery takes 3-5 business days within Pakistan. Express shipping is available at an additional cost.</p><p>Orders are processed within 24 hours of payment confirmation. You will receive a tracking number once your order is shipped.</p>", status: "published", updatedAt: "Jul 20, 2026" },
  { id: "pg-4", slug: "returns", title: "Returns & Exchanges", content: "<h2>Returns & Exchanges</h2><p>We want you to love your eyewear. If you're not satisfied, you can return or exchange your frames within 14 days of delivery. Items must be in original condition with all packaging.</p><p>For prescription eyewear, please allow 7-10 business days for customization before dispatch.</p>", status: "published", updatedAt: "Jul 18, 2026" },
  { id: "pg-5", slug: "terms", title: "Terms of Service", content: "<h2>Terms of Service</h2><p>By using the Khattak Eyewear website, you agree to these terms. Please read them carefully. We reserve the right to update these terms at any time.</p>", status: "published", updatedAt: "Jul 15, 2026" },
  { id: "pg-6", slug: "faqs", title: "Frequently Asked Questions", content: "<h2>FAQs</h2><p>Find answers to common questions about our products, ordering process, shipping, and more.</p>", status: "published", updatedAt: "Jul 10, 2026" },
  { id: "pg-7", slug: "eye-care-tips", title: "Eye Care Tips", content: "<h2>Eye Care Tips</h2><p>Taking care of your eyes is essential for maintaining good vision and overall health. Here are our top tips for keeping your eyes healthy.</p><h3>Regular Check-ups</h3><p>Visit your eye care professional annually for comprehensive eye exams.</p><h3>Blue Light Protection</h3><p>Consider blue light blocking lenses if you spend long hours in front of digital screens.</p>", status: "draft", updatedAt: "Jul 5, 2026" },
];

export const cmsFaqs: CmsFaq[] = [
  { id: "faq-1", question: "How do I find my frame size?", answer: "Check the inside of your current frames for measurements (e.g., 52-18-145). The first number is lens width, second is bridge width, third is temple length.", category: "Products", order: 1, active: true },
  { id: "faq-2", question: "Do you offer prescription lenses?", answer: "Yes! Most of our frames can be fitted with prescription lenses. Simply select your prescription type during checkout or visit our store.", category: "Products", order: 2, active: true },
  { id: "faq-3", question: "What payment methods do you accept?", answer: "We accept Bank Transfer, JazzCash, EasyPaisa, and Cash on Delivery. For online payments, use the transaction ID from your payment app.", category: "Orders", order: 3, active: true },
  { id: "faq-4", question: "How long does shipping take?", answer: "Standard shipping takes 3-5 business days within Pakistan. Express shipping (1-2 days) is available at checkout.", category: "Shipping", order: 4, active: true },
  { id: "faq-5", question: "Can I return or exchange my frames?", answer: "Yes, you can return or exchange within 14 days of delivery. Items must be unused and in original packaging.", category: "Returns", order: 5, active: true },
  { id: "faq-6", question: "How do I use a coupon code?", answer: "Enter your coupon code at checkout in the 'Coupon' field. The discount will be applied to your order total automatically.", category: "Orders", order: 6, active: true },
];

export const cmsCoupons: CmsCoupon[] = [
  { id: "cp-1", code: "KHATTAK10", description: "10% off on your first order", discount: 10, type: "percentage", minOrder: 0, usageLimit: 500, used: 128, expiresAt: "Dec 31, 2026", active: true },
  { id: "cp-2", code: "SUMMER20", description: "20% off on sunglasses", discount: 20, type: "percentage", minOrder: 5000, usageLimit: 200, used: 45, expiresAt: "Sep 30, 2026", active: true },
  { id: "cp-3", code: "FREESHIP", description: "Free shipping on all orders", discount: 350, type: "fixed", minOrder: 3000, usageLimit: 1000, used: 312, expiresAt: "Dec 31, 2026", active: true },
  { id: "cp-4", code: "VIP500", description: "Rs. 500 off on premium frames", discount: 500, type: "fixed", minOrder: 15000, usageLimit: 100, used: 18, expiresAt: "Aug 31, 2026", active: true },
  { id: "cp-5", code: "WELCOME15", description: "15% off for new customers", discount: 15, type: "percentage", minOrder: 0, usageLimit: 300, used: 0, expiresAt: "Dec 31, 2026", active: false },
];

export const cmsSubscribers: CmsSubscriber[] = [
  { id: "sub-001", email: "ayesha@example.com", name: "Ayesha Khan", subscribedAt: "Jul 28, 2026", status: "active" },
  { id: "sub-002", email: "ali@example.com", name: "Ali Raza", subscribedAt: "Jul 25, 2026", status: "active" },
  { id: "sub-003", email: "sara@example.com", name: "Sara Ahmed", subscribedAt: "Jul 20, 2026", status: "active" },
  { id: "sub-004", email: "usman@example.com", name: "Usman Malik", subscribedAt: "Jul 15, 2026", status: "active" },
  { id: "sub-005", email: "fatima@example.com", name: "Fatima Bibi", subscribedAt: "Jul 10, 2026", status: "unsubscribed" },
  { id: "sub-006", email: "bilal@example.com", name: "Bilal Hussain", subscribedAt: "Jul 8, 2026", status: "active" },
  { id: "sub-007", email: "zainab@example.com", name: "Zainab Ali", subscribedAt: "Jul 5, 2026", status: "active" },
  { id: "sub-008", email: "tariq@example.com", name: "Tariq Khan", subscribedAt: "Jul 1, 2026", status: "active" },
];

export const cmsMediaItems: CmsMediaItem[] = [
  { id: "med-001", name: "hero-banner.jpg", url: "", folder: "Banners", type: "image", size: "2.4 MB", uploadedAt: "Jul 28, 2026", alt: "Hero banner" },
  { id: "med-002", name: "logo-dark.png", url: "", folder: "Brand", type: "image", size: "128 KB", uploadedAt: "Jul 20, 2026", alt: "Logo dark" },
  { id: "med-003", name: "product-noir.jpg", url: "", folder: "Products", type: "image", size: "1.8 MB", uploadedAt: "Jul 15, 2026", alt: "Noir Line Titanium" },
  { id: "med-004", name: "summer-sale-banner.jpg", url: "", folder: "Banners", type: "image", size: "3.1 MB", uploadedAt: "Jul 10, 2026", alt: "Summer sale" },
  { id: "med-005", name: "about-team.jpg", url: "", folder: "Pages", type: "image", size: "2.0 MB", uploadedAt: "Jul 5, 2026", alt: "Team photo" },
  { id: "med-006", name: "shipping-policy.pdf", url: "", folder: "Documents", type: "document", size: "450 KB", uploadedAt: "Jun 28, 2026", alt: "" },
];

export const cmsWebsiteSettings = {
  logo: "/logo.png",
  favicon: "/favicon.ico",
  siteTitle: "Khattak Eyewear",
  tagline: "Precision Crafted For Your Vision",
  theme: { primaryColor: "#111111", accentColor: "#B6191B", borderRadius: "16px" },
  contact: { email: "hello@khattak.com", phone: "+92 300 111 2222", address: "57-E, Gulberg III, Lahore, Pakistan" },
  social: { facebook: "https://facebook.com/khattakeyewear", instagram: "https://instagram.com/khattak_eyewear", twitter: "https://twitter.com/khattak_eye", youtube: "https://youtube.com/@khattakeyewear" },
  socialLinks: { facebook: "https://facebook.com/khattakeyewear", instagram: "https://instagram.com/khattak_eyewear", twitter: "https://twitter.com/khattak_eye", youtube: "https://youtube.com/@khattakeyewear" },
  whatsapp: { number: "+923001112222", message: "Hi! I have a question about your products." },
  emails: { orderConfirmation: "orders@khattak.com", support: "support@khattak.com", noreply: "noreply@khattak.com" },
  shipping: { freeThreshold: 3000, standardRate: 350, expressRate: 750, estimatedDays: "3-5 business days" },
  bankDetails: { bankName: "HBL", accountTitle: "Khattak Eyewear Pvt Ltd", accountNumber: "1234-5678-9012-3456", iban: "PK36HBLB1234567890123456" },
  jazzcash: { number: "+92 300 111 2222", accountTitle: "Khattak Eyewear" },
  easypaisa: { number: "+92 300 111 2222", accountTitle: "Khattak Eyewear" },
  payment: {
    cod: { active: true, label: "Cash on Delivery", instructions: "Pay cash upon delivery at your doorstep." },
    bankTransfer: { active: true, bankName: "Meezan Bank", accountTitle: "Khattak Eyewear Pvt Ltd", accountNumber: "01020304050607", iban: "PK36MEZN0001020304050607" },
    jazzcash: { active: true, number: "03001234567", accountTitle: "Khattak Eyewear" },
    easypaisa: { active: true, number: "03001234567", accountTitle: "Khattak Eyewear" },
    customMethods: [] as Array<{ id: string; name: string; accountTitle: string; accountNumber: string; instructions: string; active: boolean }>
  },
  seo: { metaTitle: "Khattak Eyewear — Premium Handcrafted Eyewear in Pakistan", metaDescription: "Discover premium handcrafted eyewear at Khattak Eyewear. Shop titanium, acetate, and luxury frames with free shipping across Pakistan.", metaKeywords: "eyewear, sunglasses, eyeglasses, premium frames, Pakistan, Khattak" },
  analytics: { googleAnalyticsId: "G-XXXXXXXXXX", facebookPixelId: "1234567890", googleTagManagerId: "GTM-XXXXXXX" },
};

// ─── Phase 6D: Enterprise Modules ────────────────────────────────────────────

export type ReportPeriod = "daily" | "weekly" | "monthly" | "yearly";
export type ReportMetric = { label: string; value: number; change: number; positive: boolean };
export type ReportDataPoint = { label: string; revenue: number; orders: number; products: number; customers: number };
export type SalesFunnelStage = { stage: string; count: number; dropRate: number };
export type ConversionMetric = { source: string; visitors: number; conversions: number; rate: number; revenue: number };
export type TopProduct = { name: string; image: string; sales: number; revenue: number; growth: number };
export type CustomerGrowthPoint = { month: string; newCustomers: number; totalCustomers: number };

export type AdminRole = { id: string; name: string; description: string; users: number; permissions: string[]; color: string };
export type Permission = { id: string; module: string; actions: { key: string; label: string }[] };

export type AdminUserManage = { id: string; name: string; email: string; role: string; avatar: string | null; status: "active" | "inactive"; lastLogin: string; createdAt: string };

export type ActivityLog = { id: string; user: string; avatar: string | null; action: string; resource: string; details: string; ip: string; timestamp: string; severity: "info" | "warning" | "critical" };

export type SystemNotification = { id: string; type: "email" | "order" | "alert"; title: string; message: string; recipient?: string; status: "sent" | "failed" | "pending"; timestamp: string; read: boolean };

export type SessionInfo = { id: string; device: string; browser: string; ip: string; location: string; lastActive: string; current: boolean };
export type LoginHistoryEntry = { id: string; user: string; ip: string; device: string; location: string; timestamp: string; success: boolean; reason?: string };
export type PasswordPolicy = { key: string; label: string; enabled: boolean; value: string };

export type AuditLog = { id: string; user: string; role: string; action: string; resource: string; resourceId: string; details: string; ip: string; timestamp: string; severity: "low" | "medium" | "high" | "critical" };

// ── Reports ──

export const reportPeriods: ReportPeriod[] = ["daily", "weekly", "monthly", "yearly"];

export const reportMetrics: Record<ReportPeriod, ReportMetric[]> = {
  daily: [
    { label: "Revenue", value: 128500, change: 5.7, positive: true },
    { label: "Orders", value: 24, change: 8.3, positive: true },
    { label: "Products Sold", value: 38, change: 2.1, positive: true },
    { label: "New Customers", value: 7, change: -12.5, positive: false },
    { label: "Inventory Issues", value: 3, change: 0, positive: true },
  ],
  weekly: [
    { label: "Revenue", value: 892000, change: 12.3, positive: true },
    { label: "Orders", value: 168, change: 15.7, positive: true },
    { label: "Products Sold", value: 245, change: 9.8, positive: true },
    { label: "New Customers", value: 52, change: 6.4, positive: true },
    { label: "Inventory Issues", value: 8, change: -20, positive: true },
  ],
  monthly: [
    { label: "Revenue", value: 3450000, change: 8.9, positive: true },
    { label: "Orders", value: 685, change: 11.2, positive: true },
    { label: "Products Sold", value: 1020, change: 7.5, positive: true },
    { label: "New Customers", value: 210, change: 4.8, positive: true },
    { label: "Inventory Issues", value: 15, change: -25, positive: true },
  ],
  yearly: [
    { label: "Revenue", value: 28560000, change: 24.7, positive: true },
    { label: "Orders", value: 5840, change: 31.2, positive: true },
    { label: "Products Sold", value: 8900, change: 22.4, positive: true },
    { label: "New Customers", value: 1840, change: 35.1, positive: true },
    { label: "Inventory Issues", value: 42, change: -18, positive: true },
  ],
};

export const reportDataDaily: ReportDataPoint[] = [
  { label: "Mon", revenue: 18500, orders: 4, products: 6, customers: 1 },
  { label: "Tue", revenue: 22400, orders: 5, products: 8, customers: 2 },
  { label: "Wed", revenue: 16800, orders: 3, products: 5, customers: 0 },
  { label: "Thu", revenue: 31200, orders: 6, products: 10, customers: 2 },
  { label: "Fri", revenue: 25600, orders: 4, products: 7, customers: 1 },
  { label: "Sat", revenue: 9800, orders: 2, products: 2, customers: 1 },
  { label: "Sun", revenue: 4200, orders: 0, products: 0, customers: 0 },
];

export const reportDataWeekly: ReportDataPoint[] = [
  { label: "Week 1", revenue: 210000, orders: 42, products: 62, customers: 14 },
  { label: "Week 2", revenue: 245000, orders: 48, products: 71, customers: 16 },
  { label: "Week 3", revenue: 198000, orders: 38, products: 55, customers: 11 },
  { label: "Week 4", revenue: 239000, orders: 40, products: 57, customers: 11 },
];

export const reportDataMonthly: ReportDataPoint[] = [
  { label: "Jan", revenue: 145000, orders: 28, products: 42, customers: 12 },
  { label: "Feb", revenue: 162000, orders: 32, products: 48, customers: 15 },
  { label: "Mar", revenue: 188000, orders: 35, products: 52, customers: 18 },
  { label: "Apr", revenue: 174000, orders: 30, products: 45, customers: 14 },
  { label: "May", revenue: 210000, orders: 40, products: 60, customers: 20 },
  { label: "Jun", revenue: 245000, orders: 45, products: 68, customers: 22 },
  { label: "Jul", revenue: 232000, orders: 42, products: 62, customers: 19 },
  { label: "Aug", revenue: 268000, orders: 48, products: 72, customers: 24 },
  { label: "Sep", revenue: 256000, orders: 44, products: 66, customers: 21 },
  { label: "Oct", revenue: 290000, orders: 52, products: 78, customers: 26 },
  { label: "Nov", revenue: 275000, orders: 50, products: 75, customers: 23 },
  { label: "Dec", revenue: 320000, orders: 58, products: 85, customers: 28 },
];

export const reportDataYearly: ReportDataPoint[] = [
  { label: "2022", revenue: 12400000, orders: 2400, products: 3600, customers: 780 },
  { label: "2023", revenue: 16800000, orders: 3200, products: 4800, customers: 1050 },
  { label: "2024", revenue: 21500000, orders: 4200, products: 6200, customers: 1380 },
  { label: "2025", revenue: 25600000, orders: 5100, products: 7600, customers: 1650 },
  { label: "2026", revenue: 28560000, orders: 5840, products: 8900, customers: 1840 },
];

// ── Analytics ──

export const salesFunnel: SalesFunnelStage[] = [
  { stage: "Visitors", count: 45280, dropRate: 0 },
  { stage: "Product Views", count: 18240, dropRate: 59.7 },
  { stage: "Add to Cart", count: 6240, dropRate: 65.8 },
  { stage: "Checkout Started", count: 2850, dropRate: 54.3 },
  { stage: "Payment Completed", count: 1890, dropRate: 33.7 },
  { stage: "Order Delivered", count: 1720, dropRate: 9.0 },
];

export const conversionMetrics: ConversionMetric[] = [
  { source: "Direct", visitors: 12450, conversions: 498, rate: 4.0, revenue: 4980000 },
  { source: "Organic Search", visitors: 15820, conversions: 712, rate: 4.5, revenue: 7120000 },
  { source: "Social Media", visitors: 9850, conversions: 345, rate: 3.5, revenue: 3450000 },
  { source: "Email", visitors: 4200, conversions: 252, rate: 6.0, revenue: 2520000 },
  { source: "Paid Ads", visitors: 2960, conversions: 83, rate: 2.8, revenue: 830000 },
];

export const bestProducts: TopProduct[] = [
  { name: "Aviator Classic Gold", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?image_size=portrait_4_3&prompt=gold+aviator+sunglasses+front+view", sales: 210, revenue: 3339000, growth: 18.5 },
  { name: "Verde Artisan Acetate", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?image_size=portrait_4_3&prompt=emerald+acetate+eyewear+front+view", sales: 156, revenue: 3104400, growth: 12.3 },
  { name: "Noir Line Titanium", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?image_size=portrait_4_3&prompt=luxury+black+titanium+eyewear+front+view", sales: 128, revenue: 3648000, growth: 22.1 },
  { name: "Rose Gold Aviator", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?image_size=portrait_4_3&prompt=rose+gold+aviator+sunglasses+front+view", sales: 95, revenue: 3040000, growth: 8.7 },
  { name: "Carbon Fiber Sport", image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?image_size=portrait_4_3&prompt=carbon+fiber+sport+eyewear+front+view", sales: 64, revenue: 1408000, growth: -2.4 },
];

export const customerGrowth: CustomerGrowthPoint[] = [
  { month: "Jan", newCustomers: 120, totalCustomers: 120 },
  { month: "Feb", newCustomers: 145, totalCustomers: 265 },
  { month: "Mar", newCustomers: 168, totalCustomers: 433 },
  { month: "Apr", newCustomers: 132, totalCustomers: 565 },
  { month: "May", newCustomers: 190, totalCustomers: 755 },
  { month: "Jun", newCustomers: 210, totalCustomers: 965 },
  { month: "Jul", newCustomers: 185, totalCustomers: 1150 },
  { month: "Aug", newCustomers: 220, totalCustomers: 1370 },
  { month: "Sep", newCustomers: 195, totalCustomers: 1565 },
  { month: "Oct", newCustomers: 240, totalCustomers: 1805 },
  { month: "Nov", newCustomers: 215, totalCustomers: 2020 },
  { month: "Dec", newCustomers: 260, totalCustomers: 2280 },
];

// ── Roles & Permissions ──

export const adminRoles: AdminRole[] = [
  { id: "role-1", name: "Super Admin", description: "Full access to all modules and settings", users: 2, permissions: ["all"], color: "from-red-500 to-rose-600" },
  { id: "role-2", name: "Manager", description: "Can manage orders, products, customers, and reports", users: 5, permissions: ["orders", "products", "customers", "reports", "inventory", "cms"], color: "from-[color:var(--color-brand-hover)] to-[#B6191B]" },
  { id: "role-3", name: "Staff", description: "Limited access to orders and basic operations", users: 8, permissions: ["orders-read", "products-read", "customers-read"], color: "from-[#B6191B] to-[color:var(--color-brand-soft)]" },
];

export const allPermissions: Permission[] = [
  { id: "perm-1", module: "Dashboard", actions: [{ key: "dashboard-view", label: "View" }] },
  { id: "perm-2", module: "Orders", actions: [{ key: "orders-view", label: "View" }, { key: "orders-create", label: "Create" }, { key: "orders-edit", label: "Edit" }, { key: "orders-delete", label: "Delete" }, { key: "orders-status", label: "Update Status" }] },
  { id: "perm-3", module: "Products", actions: [{ key: "products-view", label: "View" }, { key: "products-create", label: "Create" }, { key: "products-edit", label: "Edit" }, { key: "products-delete", label: "Delete" }] },
  { id: "perm-4", module: "Customers", actions: [{ key: "customers-view", label: "View" }, { key: "customers-edit", label: "Edit" }, { key: "customers-block", label: "Block/Unblock" }] },
  { id: "perm-5", module: "Inventory", actions: [{ key: "inventory-view", label: "View" }, { key: "inventory-adjust", label: "Adjust Stock" }, { key: "inventory-restock", label: "Bulk Restock" }] },
  { id: "perm-6", module: "Reports", actions: [{ key: "reports-view", label: "View" }, { key: "reports-export", label: "Export" }] },
  { id: "perm-7", module: "CMS", actions: [{ key: "cms-view", label: "View" }, { key: "cms-edit", label: "Edit" }] },
  { id: "perm-8", module: "Settings", actions: [{ key: "settings-view", label: "View" }, { key: "settings-edit", label: "Edit" }] },
  { id: "perm-9", module: "Admin Users", actions: [{ key: "admin-users-view", label: "View" }, { key: "admin-users-create", label: "Create" }, { key: "admin-users-edit", label: "Edit" }, { key: "admin-users-delete", label: "Delete" }] },
  { id: "perm-10", module: "Security", actions: [{ key: "security-view", label: "View" }, { key: "security-edit", label: "Edit" }] },
];

// ── Admin Users ──

export const adminUsers: AdminUserManage[] = [
  { id: "au-001", name: "Admin Khattak", email: "admin@khattak.com", role: "Super Admin", avatar: null, status: "active", lastLogin: "Just now", createdAt: "Jan 1, 2026" },
  { id: "au-002", name: "Ahmed Raza", email: "ahmed@khattak.com", role: "Manager", avatar: null, status: "active", lastLogin: "2 hours ago", createdAt: "Feb 15, 2026" },
  { id: "au-003", name: "Sana Malik", email: "sana@khattak.com", role: "Manager", avatar: null, status: "active", lastLogin: "1 day ago", createdAt: "Mar 1, 2026" },
  { id: "au-004", name: "Usman Khan", email: "usman@khattak.com", role: "Staff", avatar: null, status: "active", lastLogin: "3 hours ago", createdAt: "Apr 10, 2026" },
  { id: "au-005", name: "Fatima Ali", email: "fatima@khattak.com", role: "Staff", avatar: null, status: "active", lastLogin: "5 hours ago", createdAt: "Apr 15, 2026" },
  { id: "au-006", name: "Bilal Ahmed", email: "bilal@khattak.com", role: "Staff", avatar: null, status: "inactive", lastLogin: "2 weeks ago", createdAt: "May 1, 2026" },
  { id: "au-007", name: "Zainab Noor", email: "zainab@khattak.com", role: "Staff", avatar: null, status: "active", lastLogin: "1 hour ago", createdAt: "Jun 5, 2026" },
  { id: "au-008", name: "Tariq Hussain", email: "tariq@khattak.com", role: "Manager", avatar: null, status: "inactive", lastLogin: "1 month ago", createdAt: "Mar 20, 2026" },
];

// ── Activity Logs ──

export const activityLogs: ActivityLog[] = [
  { id: "al-001", user: "Admin Khattak", avatar: null, action: "Updated Order Status", resource: "Order KT-2A3F9C", details: "Status changed from Processing to Shipped", ip: "192.168.1.100", timestamp: "2 minutes ago", severity: "info" },
  { id: "al-002", user: "Ahmed Raza", avatar: null, action: "Added Product", resource: "Product", details: "Created new product 'Sapphire Blue Crystal'", ip: "192.168.1.101", timestamp: "15 minutes ago", severity: "info" },
  { id: "al-003", user: "Sana Malik", avatar: null, action: "Bulk Stock Update", resource: "Inventory", details: "Restocked 5 products with 50 units each", ip: "192.168.1.102", timestamp: "1 hour ago", severity: "info" },
  { id: "al-004", user: "Usman Khan", avatar: null, action: "Refund Processed", resource: "Order KT-6H3G1J", details: "Full refund of Rs. 52,000 processed", ip: "192.168.1.103", timestamp: "2 hours ago", severity: "warning" },
  { id: "al-005", user: "System", avatar: null, action: "Payment Failed", resource: "Order KT-8K4L2M", details: "Payment verification failed - invalid transaction ID", ip: "—", timestamp: "3 hours ago", severity: "critical" },
  { id: "al-006", user: "Admin Khattak", avatar: null, action: "Updated Settings", resource: "Website Settings", details: "Updated shipping rates and free threshold", ip: "192.168.1.100", timestamp: "4 hours ago", severity: "info" },
  { id: "al-007", user: "Ahmed Raza", avatar: null, action: "Deleted Category", resource: "Category", details: "Deleted category 'Kids Eyewear'", ip: "192.168.1.101", timestamp: "5 hours ago", severity: "warning" },
  { id: "al-008", user: "System", avatar: null, action: "Security Alert", resource: "Login Attempt", details: "Failed login attempt from IP 45.67.89.123", ip: "45.67.89.123", timestamp: "6 hours ago", severity: "critical" },
  { id: "al-009", user: "Zainab Noor", avatar: null, action: "Customer Updated", resource: "Customer Profile", details: "Updated contact information for Ali Raza", ip: "192.168.1.105", timestamp: "8 hours ago", severity: "info" },
  { id: "al-010", user: "Admin Khattak", avatar: null, action: "Export Report", resource: "Monthly Report", details: "Exported July 2026 sales report as PDF", ip: "192.168.1.100", timestamp: "1 day ago", severity: "info" },
];

// ── System Notifications ──

export const systemNotifications: SystemNotification[] = [
  { id: "nt-001", type: "email", title: "Order Confirmation Sent", message: "Order KT-2A3F9C confirmation email sent to ayesha@example.com", recipient: "ayesha@example.com", status: "sent", timestamp: "2 hours ago", read: false },
  { id: "nt-002", type: "email", title: "Newsletter Campaign Sent", message: "Summer Collection 2026 newsletter sent to 892 subscribers", recipient: "892 subscribers", status: "sent", timestamp: "5 hours ago", read: false },
  { id: "nt-003", type: "order", title: "New Order Placed", message: "Order KT-4B1C9A placed by Sara Ahmed — Rs. 59,900", recipient: "Admin", status: "sent", timestamp: "8 hours ago", read: true },
  { id: "nt-004", type: "order", title: "Payment Received", message: "Payment of Rs. 43,560 received for order KT-2A3F9C", recipient: "Admin", status: "sent", timestamp: "2 hours ago", read: false },
  { id: "nt-005", type: "alert", title: "Low Stock Alert", message: "12 products are below their low stock threshold", recipient: "Admin", status: "sent", timestamp: "10 hours ago", read: false },
  { id: "nt-006", type: "email", title: "Password Reset Request", message: "Password reset link sent to fatima@example.com", recipient: "fatima@example.com", status: "sent", timestamp: "1 day ago", read: true },
  { id: "nt-007", type: "alert", title: "Failed Payment", message: "Payment for order KT-8K4L2M failed — invalid JazzCash transaction ID", recipient: "Admin", status: "sent", timestamp: "3 hours ago", read: false },
  { id: "nt-008", type: "order", title: "Order Delivered", message: "Order KT-9F2D5E delivered to Usman Malik", recipient: "usman@example.com", status: "sent", timestamp: "1 day ago", read: true },
  { id: "nt-009", type: "email", title: "Welcome Email", message: "Welcome email sent to ali@example.com", recipient: "ali@example.com", status: "failed", timestamp: "2 days ago", read: true },
  { id: "nt-010", type: "alert", title: "Database Backup Complete", message: "Daily database backup completed successfully", recipient: "Admin", status: "sent", timestamp: "1 day ago", read: true },
  { id: "nt-011", type: "alert", title: "SSL Certificate Expiring", message: "SSL certificate for khattak.com expires in 30 days", recipient: "Admin", status: "pending", timestamp: "3 days ago", read: false },
];

// ── Security ──

export const adminSessions: SessionInfo[] = [
  { id: "sess-001", device: "Windows 11 PC", browser: "Chrome 125", ip: "192.168.1.100", location: "Lahore, Pakistan", lastActive: "Current session", current: true },
  { id: "sess-002", device: "iPhone 15 Pro", browser: "Safari 18", ip: "192.168.1.100", location: "Lahore, Pakistan", lastActive: "2 hours ago", current: false },
  { id: "sess-003", device: "MacBook Pro", browser: "Firefox 128", ip: "203.0.113.45", location: "Karachi, Pakistan", lastActive: "3 days ago", current: false },
];

export const loginHistory: LoginHistoryEntry[] = [
  { id: "lh-001", user: "admin@khattak.com", ip: "192.168.1.100", device: "Windows 11 · Chrome 125", location: "Lahore, Pakistan", timestamp: "Just now", success: true },
  { id: "lh-002", user: "admin@khattak.com", ip: "192.168.1.100", device: "Windows 11 · Chrome 125", location: "Lahore, Pakistan", timestamp: "8 hours ago", success: true },
  { id: "lh-003", user: "ahmed@khattak.com", ip: "192.168.1.101", device: "macOS · Safari 18", location: "Islamabad, Pakistan", timestamp: "2 hours ago", success: true },
  { id: "lh-004", user: "usman@khattak.com", ip: "192.168.1.103", device: "Windows 10 · Edge 124", location: "Lahore, Pakistan", timestamp: "3 hours ago", success: true },
  { id: "lh-005", user: "admin@khattak.com", ip: "45.67.89.123", device: "Unknown · Unknown", location: "Beijing, China", timestamp: "6 hours ago", success: false, reason: "Invalid password" },
  { id: "lh-006", user: "admin@khattak.com", ip: "45.67.89.123", device: "Unknown · Unknown", location: "Beijing, China", timestamp: "6 hours ago", success: false, reason: "Invalid password" },
  { id: "lh-007", user: "sana@khattak.com", ip: "192.168.1.102", device: "Windows 11 · Chrome 125", location: "Karachi, Pakistan", timestamp: "1 day ago", success: true },
  { id: "lh-008", user: "admin@khattak.com", ip: "78.90.12.34", device: "Linux · Firefox 127", location: "Moscow, Russia", timestamp: "2 days ago", success: false, reason: "IP not recognized" },
];

export const passwordPolicies: PasswordPolicy[] = [
  { key: "min-length", label: "Minimum Length", enabled: true, value: "8 characters" },
  { key: "uppercase", label: "Require Uppercase", enabled: true, value: "At least 1 uppercase letter" },
  { key: "lowercase", label: "Require Lowercase", enabled: true, value: "At least 1 lowercase letter" },
  { key: "numbers", label: "Require Numbers", enabled: true, value: "At least 1 number" },
  { key: "symbols", label: "Require Symbols", enabled: true, value: "At least 1 special character" },
  { key: "expiry", label: "Password Expiry", enabled: true, value: "90 days" },
  { key: "history", label: "Password History", enabled: true, value: "5 previous passwords" },
  { key: "lockout", label: "Account Lockout", enabled: true, value: "5 failed attempts" },
];

// ── Audit Logs ──

export const auditLogs: AuditLog[] = [
  { id: "aud-001", user: "Admin Khattak", role: "Super Admin", action: "UPDATE", resource: "Order", resourceId: "KT-2A3F9C", details: "Changed status from Processing to Shipped", ip: "192.168.1.100", timestamp: "2 minutes ago", severity: "low" },
  { id: "aud-002", user: "Ahmed Raza", role: "Manager", action: "CREATE", resource: "Product", resourceId: "kt-013", details: "Created new product 'Sapphire Blue Crystal'", ip: "192.168.1.101", timestamp: "15 minutes ago", severity: "low" },
  { id: "aud-003", user: "Sana Malik", role: "Manager", action: "UPDATE", resource: "Inventory", resourceId: "Multiple", details: "Bulk restock: 5 products updated (+50 units each)", ip: "192.168.1.102", timestamp: "1 hour ago", severity: "medium" },
  { id: "aud-004", user: "Usman Khan", role: "Staff", action: "UPDATE", resource: "Order", resourceId: "KT-6H3G1J", details: "Processed refund of Rs. 52,000", ip: "192.168.1.103", timestamp: "2 hours ago", severity: "high" },
  { id: "aud-005", user: "System", role: "System", action: "FAILURE", resource: "Payment", resourceId: "KT-8K4L2M", details: "Payment verification failed — invalid transaction ID", ip: "—", timestamp: "3 hours ago", severity: "critical" },
  { id: "aud-006", user: "Admin Khattak", role: "Super Admin", action: "UPDATE", resource: "Settings", resourceId: "shipping", details: "Updated shipping rates and free threshold value", ip: "192.168.1.100", timestamp: "4 hours ago", severity: "medium" },
  { id: "aud-007", user: "Ahmed Raza", role: "Manager", action: "DELETE", resource: "Category", resourceId: "cat-004", details: "Deleted category 'Kids Eyewear' and reassigned 18 products", ip: "192.168.1.101", timestamp: "5 hours ago", severity: "high" },
  { id: "aud-008", user: "System", role: "System", action: "LOGIN_FAIL", resource: "Authentication", resourceId: "admin@khattak.com", details: "Failed login attempt from unknown IP 45.67.89.123", ip: "45.67.89.123", timestamp: "6 hours ago", severity: "critical" },
  { id: "aud-009", user: "Zainab Noor", role: "Staff", action: "UPDATE", resource: "Customer", resourceId: "cst-002", details: "Updated contact information for customer Ali Raza", ip: "192.168.1.105", timestamp: "8 hours ago", severity: "low" },
  { id: "aud-010", user: "Admin Khattak", role: "Super Admin", action: "EXPORT", resource: "Report", resourceId: "revenue-jul-2026", details: "Exported July 2026 revenue report as PDF", ip: "192.168.1.100", timestamp: "1 day ago", severity: "low" },
  { id: "aud-011", user: "System", role: "System", action: "BACKUP", resource: "Database", resourceId: "full-backup", details: "Automated daily database backup completed (2.4 GB)", ip: "—", timestamp: "1 day ago", severity: "low" },
  { id: "aud-012", user: "Admin Khattak", role: "Super Admin", action: "CREATE", resource: "AdminUser", resourceId: "au-008", details: "Created new admin user 'Tariq Hussain' with Manager role", ip: "192.168.1.100", timestamp: "2 days ago", severity: "high" },
];

export const adminBrands: AdminBrand[] = [
  { id: "brd-001", name: "Louis Vuitton", slug: "louis-vuitton", logo: "", description: "Iconic French luxury fashion house renowned for high-end eyewear.", website: "https://louisvuitton.com", featured: true, productCount: 24, status: "active", createdAt: "Jan 1, 2026" },
  { id: "brd-002", name: "Prada", slug: "prada", logo: "", description: "Italian luxury fashion house offering sophisticated and innovative frames.", website: "https://prada.com", featured: true, productCount: 32, status: "active", createdAt: "Jan 1, 2026" },
  { id: "brd-003", name: "Gucci", slug: "gucci", logo: "", description: "Eclectic, contemporary, and romantic Italian luxury eyewear.", website: "https://gucci.com", featured: true, productCount: 28, status: "active", createdAt: "Jan 15, 2026" },
  { id: "brd-004", name: "Ray-Ban", slug: "ray-ban", logo: "", description: "Timeless American-Italian brand creator of Aviator and Wayfarer classics.", website: "https://ray-ban.com", featured: true, productCount: 45, status: "active", createdAt: "Feb 1, 2026" },
  { id: "brd-005", name: "Tom Ford", slug: "tom-ford", logo: "", description: "Glamorous and modern luxury frames crafted with unmatched precision.", website: "https://tomford.com", featured: true, productCount: 19, status: "active", createdAt: "Mar 1, 2026" },
  { id: "brd-006", name: "Cartier", slug: "cartier", logo: "", description: "French luxury maison specializing in high-jewelry and precious metal eyewear.", website: "https://cartier.com", featured: true, productCount: 14, status: "active", createdAt: "Mar 15, 2026" },
  { id: "brd-007", name: "Dior", slug: "dior", logo: "", description: "French luxury fashion house presenting elegant and bold eyewear silhouettes.", website: "https://dior.com", featured: false, productCount: 18, status: "active", createdAt: "Apr 1, 2026" },
];
