/**
 * Centralized Enum & Slug Display Label Resolvers
 * Single source of truth for converting raw backend database enums/slugs
 * into title-cased, human-readable display labels for UI rendering.
 */

export const getPaymentMethodLabel = (method?: string): string => {
  if (!method) return "Cash on Delivery";
  const normalized = method.toLowerCase().trim();
  const map: Record<string, string> = {
    "bank-transfer": "Bank Transfer",
    "banktransfer": "Bank Transfer",
    "bank_transfer": "Bank Transfer",
    jazzcash: "JazzCash",
    easypaisa: "EasyPaisa",
    cod: "Cash on Delivery",
    "cash-on-delivery": "Cash on Delivery"
  };
  return map[normalized] || method;
};

export const getOrderStatusLabel = (status?: string): string => {
  if (!status) return "Pending";
  const normalized = status.toLowerCase().trim();
  const map: Record<string, string> = {
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
  return map[normalized] || status.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

export const getAvailabilityLabel = (availability?: string): string => {
  if (!availability) return "In Stock";
  const normalized = availability.toLowerCase().trim();
  const map: Record<string, string> = {
    "in-stock": "In Stock",
    "out-of-stock": "Out of Stock",
    preorder: "Pre-Order",
    "pre-order": "Pre-Order",
    limited: "Limited Stock",
    "low-stock": "Low Stock"
  };
  return map[normalized] || availability.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

export const getGenderLabel = (gender?: string | string[]): string => {
  if (!gender) return "Unisex";
  if (Array.isArray(gender)) {
    if (gender.length === 0) return "Unisex";
    return gender.map((g) => getGenderLabel(g)).join(", ");
  }
  const normalized = gender.toLowerCase().trim();
  const map: Record<string, string> = {
    men: "Men",
    man: "Men",
    male: "Male",
    women: "Women",
    woman: "Women",
    female: "Female",
    kids: "Kids",
    unisex: "Unisex"
  };
  return map[normalized] || gender;
};

export const getRoleLabel = (role?: string): string => {
  if (!role) return "Admin";
  const normalized = role.toLowerCase().trim();
  const map: Record<string, string> = {
    "super-admin": "Super Admin",
    "super_admin": "Super Admin",
    admin: "Admin",
    manager: "Store Manager"
  };
  return map[normalized] || role.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

export const getAppliesToLabel = (appliesTo?: string): string => {
  if (!appliesTo) return "Eyeglasses & Sunglasses";
  const normalized = appliesTo.toLowerCase().trim();
  const map: Record<string, string> = {
    eyeglasses: "Eyeglasses",
    sunglasses: "Sunglasses",
    common: "Universal (Both)",
    both: "Universal (Both)"
  };
  return map[normalized] || appliesTo;
};
