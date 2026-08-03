export type Category = {
  title: string;
  description: string;
  image: string;
  path: string;
  count: string;
};

export type Product = {
  id: string;
  name: string;
  brand: string;
  price: string;
  oldPrice?: string;
  image: string;
  hoverImage?: string;
  rating: number;
  badge?: string;
};

export type Testimonial = {
  id: string;
  name: string;
  location: string;
  avatar: string;
  rating: number;
  text: string;
};

export type Brand = {
  name: string;
  logo: string;
};

export type Stat = {
  value: number;
  suffix: string;
  label: string;
};

export type InstagramPost = {
  id: string;
  image: string;
  likes: string;
};

const imageBase =
  "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?image_size=portrait_4_3&prompt=";

const ei = (prompt: string) => `${imageBase}${encodeURIComponent(prompt)}`;

export const announcements = [
  "Premium Eyewear — Crafted For Modern Lifestyles",
  "Easy Returns — 14-Day Satisfaction Guarantee",
  "Secure Checkout — 100% Payment Protection",
];

export const categories: Category[] = [
  {
    title: "Sunglasses",
    description: "UV400 protection with premium Italian acetates and hand-finished details.",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=85",
    path: "/shop/sunglasses",
    count: "42 Styles",
  },
  {
    title: "Prescription",
    description: "Custom-crafted optical frames with precision-engineered lens technology.",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=85",
    path: "/shop/prescription",
    count: "28 Styles",
  },
  {
    title: "Titanium",
    description: "Ultra-light Japanese titanium frames for enduring comfort and sophistication.",
    image: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=800&q=85",
    path: "/shop/titanium",
    count: "18 Styles",
  },
  {
    title: "Blue Light",
    description: "Protective lens technology engineered for modern digital lifestyles.",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=85",
    path: "/shop/blue-light",
    count: "24 Styles",
  },
];

export const featuredProducts: Product[] = [
  {
    id: "1",
    name: "Noir Line Titanium",
    brand: "Khattak Atelier",
    price: "Rs. 28,500",
    oldPrice: "Rs. 34,000",
    image: ei("luxury black titanium eyewear product photography on soft white background, premium studio lighting, editorial ecommerce image, front angle"),
    hoverImage: ei("luxury black titanium eyewear product photography on soft white background, premium studio lighting, editorial ecommerce image, three quarter angle"),
    rating: 4.9,
    badge: "Best Seller",
  },
  {
    id: "2",
    name: "Verde Artisan Acetate",
    brand: "Khattak Signature",
    price: "Rs. 19,900",
    oldPrice: "Rs. 23,900",
    image: ei("luxury emerald green acetate eyewear product photography on soft ivory background, fashion editorial ecommerce image, front angle"),
    hoverImage: ei("luxury emerald green acetate eyewear product photography on soft ivory background, fashion editorial ecommerce image, side angle"),
    rating: 4.8,
    badge: "New Arrival",
  },
  {
    id: "3",
    name: "Rose Gold Aviator",
    brand: "Khattak Atelier",
    price: "Rs. 32,000",
    image: ei("luxury rose gold aviator sunglasses on premium surface, editorial fashion photography, studio lighting, realistic"),
    hoverImage: ei("luxury rose gold aviator sunglasses on premium surface, editorial fashion photography, three quarter angle"),
    rating: 4.9,
    badge: "Trending",
  },
  {
    id: "4",
    name: "Carbon Fiber Sport",
    brand: "Khattak Performance",
    price: "Rs. 24,500",
    oldPrice: "Rs. 29,000",
    image: ei("luxury carbon fiber sport eyewear product photography, modern studio lighting, technical fashion editorial, realistic"),
    hoverImage: ei("luxury carbon fiber sport eyewear product photography, modern studio lighting, technical fashion editorial, side angle"),
    rating: 4.7,
    badge: "Premium",
  },
  {
    id: "5",
    name: "Classic Round Tortoise",
    brand: "Khattak Heritage",
    price: "Rs. 15,500",
    image: ei("classic round tortoise shell glasses on vintage book, warm studio lighting, heritage editorial photography, realistic"),
    hoverImage: ei("classic round tortoise shell glasses on vintage book, warm studio lighting, heritage editorial photography, detail angle"),
    rating: 4.8,
    badge: "Best Seller",
  },
  {
    id: "6",
    name: "Crystal Clear Minimal",
    brand: "Khattak Signature",
    price: "Rs. 18,000",
    image: ei("crystal clear transparent eyewear on white marble, clean minimalist studio lighting, modern editorial fashion, realistic"),
    hoverImage: ei("crystal clear transparent eyewear on white marble, clean minimalist studio lighting, modern editorial fashion, side angle"),
    rating: 4.6,
    badge: "New Arrival",
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Ayesha Khan",
    location: "Karachi, Pakistan",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    text: "The quality of these frames is exceptional. I've never experienced this level of comfort and craftsmanship. The titanium collection is truly world-class.",
  },
  {
    id: "2",
    name: "Usman Malik",
    location: "Lahore, Pakistan",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    text: "Finally, a Pakistani brand that competes with international luxury eyewear. The attention to detail and customer service is outstanding.",
  },
  {
    id: "3",
    name: "Fatima Ahmed",
    location: "Islamabad, Pakistan",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    text: "My blue light blocking glasses are perfect for long work hours. Stylish enough for meetings, comfortable enough for all-day wear.",
  },
  {
    id: "4",
    name: "Ali Raza",
    location: "Rawalpindi, Pakistan",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    rating: 4,
    text: "Premium quality that rivals international brands. The virtual try-on feature made choosing the perfect frame effortless.",
  },
  {
    id: "5",
    name: "Zara Hussain",
    location: "Dubai, UAE",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    text: "Exceptional craftsmanship and premium materials. These glasses have become my everyday essential. Highly recommended!",
  },
];

export const brands: Brand[] = [
  { name: "Khattak Atelier", logo: "KA" },
  { name: "Khattak Signature", logo: "KS" },
  { name: "Khattak Heritage", logo: "KH" },
  { name: "Khattak Performance", logo: "KP" },
  { name: "Khattak Atelier", logo: "KA" },
  { name: "Khattak Signature", logo: "KS" },
  { name: "Khattak Heritage", logo: "KH" },
  { name: "Khattak Performance", logo: "KP" },
];

export const stats: Stat[] = [
  { value: 50, suffix: "+", label: "Premium Styles" },
  { value: 15, suffix: "K+", label: "Happy Customers" },
  { value: 4.9, suffix: "", label: "Average Rating" },
  { value: 100, suffix: "%", label: "Authentic Products" },
];

export const trustFeatures = [
  {
    icon: "Truck",
    title: "Free Shipping",
    description: "Complimentary delivery across Pakistan on all orders.",
  },
  {
    icon: "Shield",
    title: "Secure Payments",
    description: "Encrypted transactions with 100% payment protection.",
  },
  {
    icon: "Gem",
    title: "Premium Materials",
    description: "Italian acetates, Japanese titanium, precision optics.",
  },
  {
    icon: "BadgeCheck",
    title: "2 Year Warranty",
    description: "Comprehensive coverage on frames and lens defects.",
  },
  {
    icon: "ScanFace",
    title: "Virtual Try-On",
    description: "AI-powered frame fitting from the comfort of your home.",
  },
  {
    icon: "RefreshCw",
    title: "Easy Returns",
    description: "14-day satisfaction guarantee with free pick-up.",
  },
];

export const whyChooseUs = [
  {
    title: "Italian & Japanese Materials",
    description: "We source premium acetates from Italy and titanium from Japan, ensuring every frame meets international luxury standards.",
  },
  {
    title: "Handcrafted Precision",
    description: "Each frame undergoes 45+ quality checks, assembled by master artisans with decades of optical craftsmanship.",
  },
  {
    title: "Advanced Lens Technology",
    description: "German-engineered lens coatings with anti-reflective, scratch-resistant, and blue light filtering properties.",
  },
  {
    title: "Concierge-Level Service",
    description: "Personal stylist consultations, home try-ons, and dedicated aftercare support for every customer.",
  },
];

export const instagramPosts: InstagramPost[] = [
  { id: "1", image: ei("luxury eyewear fashion editorial on model, natural sunlight, premium lifestyle photography, high fashion"), likes: "12.5K" },
  { id: "2", image: ei("close up luxury eyewear detail shot, premium materials texture, macro product photography, editorial lighting"), likes: "8.3K" },
  { id: "3", image: ei("luxury lifestyle with eyewear, elegant setting, premium fashion editorial, natural lighting, candid"), likes: "15.1K" },
  { id: "4", image: ei("luxury eyewear on premium marble surface, flat lay editorial, studio lighting, high end fashion photography"), likes: "9.7K" },
  { id: "5", image: ei("model wearing premium sunglasses, outdoor golden hour, fashion editorial photography, luxury lifestyle"), likes: "22.4K" },
  { id: "6", image: ei("luxury eyewear collection display, premium retail presentation, editorial product arrangement, soft lighting"), likes: "11.8K" },
];

export const footerLinks = {
  company: [
    { label: "About Us", path: "/about" },
    { label: "Our Story", path: "/story" },
    { label: "Craftsmanship", path: "/craftsmanship" },
    { label: "Careers", path: "/careers" },
    { label: "Press", path: "/press" },
  ],
  shop: [
    { label: "Sunglasses", path: "/shop/sunglasses" },
    { label: "Prescription", path: "/shop/prescription" },
    { label: "Titanium Collection", path: "/shop/titanium" },
    { label: "Blue Light", path: "/shop/blue-light" },
    { label: "Gift Cards", path: "/gift-cards" },
  ],
  support: [
    { label: "Contact Us", path: "/contact" },
    { label: "FAQ", path: "/faq" },
    { label: "Shipping & Returns", path: "/shipping" },
    { label: "Warranty", path: "/warranty" },
    { label: "Size Guide", path: "/size-guide" },
  ],
  contact: {
    phone: "+92 300 1234567",
    email: "hello@khattakov.com",
    address: "57-E, Gulberg III, Lahore, Pakistan",
  },
};
