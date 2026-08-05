export type FilterOption = {
  label: string;
  value: string;
  count?: number;
};

export type FilterGroup = {
  id: string;
  label: string;
  type: "checkbox" | "radio" | "price" | "rating";
  options: FilterOption[];
};

export type ProductVariant = {
  color: string;
  colorName: string;
  image: string;
  hoverImage?: string;
  stock: number;
};

export type ProductReview = {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  date: string;
  text: string;
  images?: string[];
};

export type ProductSpec = {
  label: string;
  value: string;
};

export type Product = {
  id: string;
  name: string;
  brand: string;
  slug: string;
  category: string;
  subcategory: string;
  price: number;
  oldPrice?: number;
  currency: string;
  description: string;
  shortDescription: string;
  images: string[];
  hoverImage?: string;
  rating: number;
  reviewCount: number;
  badges: string[];
  variants: ProductVariant[];
  specs: ProductSpec[];
  features: string[];
  stock: number;
  sku: string;
  gender: string[];
  frameShape: string;
  frameMaterial: string;
  lensType: string;
  lensColor: string;
  frameColor: string;
  frameSize: string;
  weight: string;
  uvProtection: string;
  warranty: string;
  availability: string;
  discount?: number;
};

export type SortOption = {
  label: string;
  value: string;
};

const imageBase =
  "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?image_size=portrait_4_3&prompt=";

const ei = (prompt: string) => `${imageBase}${encodeURIComponent(prompt)}`;

export const sortOptions: SortOption[] = [
  { label: "Featured", value: "featured" },
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Best Rating", value: "rating" },
  { label: "Most Popular", value: "popular" },
];

export const filterGroups: FilterGroup[] = [
  {
    id: "category",
    label: "Subcategory",
    type: "checkbox",
    options: [
      { label: "Polarized Shades", value: "polarized-shades", count: 0 },
      { label: "Driving Sunglasses", value: "driving-sunglasses", count: 0 },
      { label: "Fashion & Luxury", value: "fashion-luxury", count: 0 },
      { label: "Sports Performance", value: "sports-performance", count: 0 },
      { label: "Prescription Glasses", value: "prescription-glasses", count: 0 },
      { label: "Computer & Blue Light", value: "blue-light", count: 0 },
      { label: "Reading Glasses", value: "reading-glasses", count: 0 },
      { label: "Rimless & Minimalist", value: "rimless-frames", count: 0 },
    ],
  },
  {
    id: "brand",
    label: "Brand",
    type: "checkbox",
    options: [
      { label: "Louis Vuitton", value: "louis-vuitton", count: 0 },
      { label: "Prada", value: "prada", count: 0 },
      { label: "Gucci", value: "gucci", count: 0 },
      { label: "Ray-Ban", value: "ray-ban", count: 0 },
      { label: "Tom Ford", value: "tom-ford", count: 0 },
      { label: "Cartier", value: "cartier", count: 0 },
      { label: "Dior", value: "dior", count: 0 },
    ],
  },
  {
    id: "gender",
    label: "Gender",
    type: "checkbox",
    options: [
      { label: "Men", value: "men", count: 0 },
      { label: "Women", value: "women", count: 0 },
      { label: "Unisex", value: "unisex", count: 0 },
    ],
  },
  {
    id: "frame-shape",
    label: "Frame Shape",
    type: "checkbox",
    options: [
      { label: "Aviator", value: "aviator", count: 0 },
      { label: "Round", value: "round", count: 0 },
      { label: "Square", value: "square", count: 0 },
      { label: "Rectangle", value: "rectangle", count: 0 },
      { label: "Cat Eye", value: "cat-eye", count: 0 },
      { label: "Geometric", value: "geometric", count: 0 },
      { label: "Wayfarer", value: "wayfarer", count: 0 },
      { label: "Oval", value: "oval", count: 0 },
      { label: "Butterfly", value: "butterfly", count: 0 },
      { label: "Shield", value: "shield", count: 0 },
      { label: "Rimless", value: "rimless", count: 0 },
      { label: "Half Rim", value: "half-rim", count: 0 },
      { label: "Sports", value: "sports", count: 0 },
    ],
  },
  {
    id: "frame-material",
    label: "Frame Material",
    type: "checkbox",
    options: [
      { label: "Titanium", value: "titanium", count: 0 },
      { label: "Acetate", value: "acetate", count: 0 },
      { label: "Stainless Steel", value: "stainless-steel", count: 0 },
      { label: "Carbon Fiber", value: "carbon-fiber", count: 0 },
    ],
  },
  {
    id: "lens-type",
    label: "Lens Type",
    type: "checkbox",
    options: [
      { label: "Polarized", value: "polarized", count: 0 },
      { label: "Blue Light Blocking", value: "blue-light-blocking", count: 0 },
      { label: "Photochromic", value: "photochromic", count: 0 },
      { label: "Progressive", value: "progressive", count: 0 },
      { label: "Anti-Reflective", value: "anti-reflective", count: 0 },
    ],
  },
  {
    id: "lens-color",
    label: "Lens Color",
    type: "checkbox",
    options: [
      { label: "Black", value: "black", count: 0 },
      { label: "Brown", value: "brown", count: 0 },
      { label: "Green", value: "green", count: 0 },
      { label: "Blue", value: "blue", count: 0 },
      { label: "Grey", value: "grey", count: 0 },
      { label: "Mirror", value: "mirror", count: 0 },
    ],
  },
  {
    id: "frame-color",
    label: "Frame Color",
    type: "checkbox",
    options: [
      { label: "Black", value: "black", count: 25 },
      { label: "Gold", value: "gold", count: 12 },
      { label: "Silver", value: "silver", count: 10 },
      { label: "Rose Gold", value: "rose-gold", count: 8 },
      { label: "Tortoise", value: "tortoise", count: 15 },
      { label: "Transparent", value: "transparent", count: 6 },
    ],
  },
  {
    id: "frame-size",
    label: "Frame Size",
    type: "checkbox",
    options: [
      { label: "Small", value: "small", count: 15 },
      { label: "Medium", value: "medium", count: 35 },
      { label: "Large", value: "large", count: 25 },
      { label: "Extra Large", value: "extra-large", count: 10 },
    ],
  },
  {
    id: "price",
    label: "Price Range",
    type: "price",
    options: [],
  },
  {
    id: "availability",
    label: "Availability",
    type: "checkbox",
    options: [
      { label: "In Stock", value: "in-stock", count: 60 },
      { label: "Limited Stock", value: "limited", count: 15 },
      { label: "New Arrival", value: "new-arrival", count: 20 },
    ],
  },
  {
    id: "discount",
    label: "Discount",
    type: "checkbox",
    options: [
      { label: "10% or more", value: "10", count: 25 },
      { label: "20% or more", value: "20", count: 15 },
      { label: "30% or more", value: "30", count: 8 },
      { label: "50% or more", value: "50", count: 3 },
    ],
  },
];

export const allProducts: Product[] = [
  {
    id: "kt-001",
    name: "Noir Line Titanium",
    brand: "Khattak Atelier",
    slug: "noir-line-titanium",
    category: "sunglasses",
    subcategory: "titanium",
    price: 28500,
    oldPrice: 34000,
    currency: "Rs.",
    description: "The Noir Line Titanium represents the pinnacle of precision engineering and minimalist design. Crafted from ultra-light Japanese titanium, these frames offer exceptional durability without compromising on comfort. The matte black finish is achieved through a specialized anodization process that ensures long-lasting color retention. Each frame undergoes 45+ quality checks before being certified for sale. The adjustable silicone nose pads provide a customized fit, while the spring-loaded hinges offer flexibility and durability. Whether for daily wear or special occasions, these frames make a sophisticated statement.",
    shortDescription: "Ultra-light Japanese titanium with precision-machined details and premium matte finish. Engineered for enduring comfort.",
    images: [
      ei("luxury black titanium eyewear on white marble, front angle, premium studio lighting, editorial product photography"),
      ei("luxury black titanium eyewear on white marble, three quarter angle, premium studio lighting"),
      ei("luxury black titanium eyewear on white marble, side angle, premium studio lighting"),
      ei("luxury black titanium eyewear on white marble, top angle, premium studio lighting"),
    ],
    hoverImage: ei("luxury black titanium eyewear on white marble, side view, premium studio lighting"),
    rating: 4.9,
    reviewCount: 128,
    badges: ["best-seller", "premium"],
    variants: [
      { color: "#111111", colorName: "Matte Black", image: ei("matte black titanium eyewear front view"), stock: 15 },
      { color: "#C0C0C0", colorName: "Silver", image: ei("silver titanium eyewear front view"), stock: 10 },
      { color: "#B8860B", colorName: "Gold", image: ei("gold titanium eyewear front view"), stock: 8 },
    ],
    specs: [
      { label: "Frame Material", value: "Japanese Titanium" },
      { label: "Weight", value: "18g" },
      { label: "Frame Width", value: "140mm" },
      { label: "Lens Width", value: "52mm" },
      { label: "Bridge Width", value: "18mm" },
      { label: "Temple Length", value: "145mm" },
    ],
    features: [
      "Ultra-light Japanese titanium alloy",
      "Matte anodized finish",
      "Adjustable silicone nose pads",
      "Spring-loaded hinges",
      "UV400 protection lenses",
      "Premium leather case included",
    ],
    stock: 15,
    sku: "KT-NLT-001",
    gender: ["men", "unisex"],
    frameShape: "rectangle",
    frameMaterial: "titanium",
    lensType: "polarized",
    lensColor: "black",
    frameColor: "black",
    frameSize: "medium",
    weight: "18g",
    uvProtection: "UV400",
    warranty: "2 Years",
    availability: "in-stock",
    discount: 16,
  },
  {
    id: "kt-002",
    name: "Verde Artisan Acetate",
    brand: "Khattak Signature",
    slug: "verde-artisan-acetate",
    category: "prescription",
    subcategory: "acetate",
    price: 19900,
    oldPrice: 23900,
    currency: "Rs.",
    description: "Handcrafted from premium Italian acetate, the Verde Artisan celebrates the beauty of natural materials. Each frame is carved from a single block of acetate, resulting in unique color variations and depth that mass-produced frames cannot replicate. The emerald green hue is complemented by subtle gold-toned accents, creating a refined look that transitions seamlessly from professional settings to social occasions. The keyhole bridge adds a vintage-inspired touch, while the custom core wire ensures structural integrity.",
    shortDescription: "Handcrafted Italian acetate with deep emerald tones and gold accents. A statement of refined taste.",
    images: [
      ei("emerald green acetate eyewear on soft ivory, front angle, luxury editorial photography"),
      ei("emerald green acetate eyewear on soft ivory, three quarter angle, luxury editorial"),
      ei("emerald green acetate eyewear on soft ivory, side angle, luxury editorial"),
      ei("emerald green acetate eyewear on soft ivory, detail close up, luxury editorial"),
    ],
    hoverImage: ei("emerald green acetate eyewear on soft ivory, three quarter angle, luxury"),
    rating: 4.8,
    reviewCount: 96,
    badges: ["new-arrival", "trending"],
    variants: [
      { color: "#2E8B57", colorName: "Emerald", image: ei("emerald acetate eyewear front view"), stock: 12 },
      { color: "#8B4513", colorName: "Tortoise", image: ei("tortoise acetate eyewear front view"), stock: 8 },
      { color: "#1a1a1a", colorName: "Ebony", image: ei("ebony acetate eyewear front view"), stock: 10 },
    ],
    specs: [
      { label: "Frame Material", value: "Italian Acetate" },
      { label: "Weight", value: "28g" },
      { label: "Frame Width", value: "138mm" },
      { label: "Lens Width", value: "50mm" },
      { label: "Bridge Width", value: "20mm" },
      { label: "Temple Length", value: "148mm" },
    ],
    features: [
      "Premium Italian acetate",
      "Gold-toned metal accents",
      "Keyhole bridge design",
      "Custom core wire",
      "Anti-reflective lenses",
      "Hard case included",
    ],
    stock: 12,
    sku: "KT-VAA-002",
    gender: ["women", "unisex"],
    frameShape: "round",
    frameMaterial: "acetate",
    lensType: "anti-reflective",
    lensColor: "green",
    frameColor: "green",
    frameSize: "medium",
    weight: "28g",
    uvProtection: "UV400",
    warranty: "2 Years",
    availability: "in-stock",
    discount: 12,
  },
  {
    id: "kt-003",
    name: "Rose Gold Aviator",
    brand: "Khattak Atelier",
    slug: "rose-gold-aviator",
    category: "sunglasses",
    subcategory: "aviator",
    price: 32000,
    currency: "Rs.",
    description: "The Rose Gold Aviator reimagines a timeless silhouette with contemporary luxury. The rose gold-plated stainless steel frame catches light beautifully, while the gradient brown lenses provide both style and superior UV protection. Double bridge detailing adds a classic aviator touch, and the adjustable nose pads ensure a comfortable fit for various face shapes. These sunglasses are designed to make a statement whether you're on a coastal drive or attending an outdoor event.",
    shortDescription: "Timeless aviator silhouette in luxurious rose gold with gradient brown lenses.",
    images: [
      ei("rose gold aviator sunglasses on premium surface, front angle, editorial fashion photography"),
      ei("rose gold aviator sunglasses on premium surface, three quarter angle, editorial fashion"),
      ei("rose gold aviator sunglasses on premium surface, side angle, editorial fashion"),
      ei("rose gold aviator sunglasses on premium surface, detail, editorial fashion"),
    ],
    hoverImage: ei("rose gold aviator sunglasses on premium surface, side angle, editorial"),
    rating: 4.9,
    reviewCount: 74,
    badges: ["trending", "premium"],
    variants: [
      { color: "#B76E79", colorName: "Rose Gold", image: ei("rose gold aviator front view"), stock: 8 },
      { color: "#C0C0C0", colorName: "Silver", image: ei("silver aviator front view"), stock: 6 },
      { color: "#FFD700", colorName: "Gold", image: ei("gold aviator front view"), stock: 5 },
    ],
    specs: [
      { label: "Frame Material", value: "Stainless Steel" },
      { label: "Weight", value: "32g" },
      { label: "Frame Width", value: "145mm" },
      { label: "Lens Width", value: "58mm" },
      { label: "Bridge Width", value: "14mm" },
      { label: "Temple Length", value: "150mm" },
    ],
    features: [
      "Rose gold-plated stainless steel",
      "Gradient brown polarized lenses",
      "Double bridge aviator design",
      "Adjustable silicone nose pads",
      "UV400 protection",
      "Premium case and cloth included",
    ],
    stock: 8,
    sku: "KT-RGA-003",
    gender: ["women", "unisex"],
    frameShape: "aviator",
    frameMaterial: "stainless-steel",
    lensType: "polarized",
    lensColor: "brown",
    frameColor: "rose-gold",
    frameSize: "large",
    weight: "32g",
    uvProtection: "UV400",
    warranty: "2 Years",
    availability: "limited",
  },
  {
    id: "kt-004",
    name: "Carbon Fiber Sport",
    brand: "Khattak Performance",
    slug: "carbon-fiber-sport",
    category: "sports",
    subcategory: "performance",
    price: 24500,
    oldPrice: 29000,
    currency: "Rs.",
    description: "Engineered for the active lifestyle, the Carbon Fiber Sport combines cutting-edge materials with athletic functionality. The carbon fiber frame offers exceptional strength-to-weight ratio, making these glasses nearly weightless yet incredibly durable. Rubberized temple tips and adjustable nose pads ensure they stay secure during intense activities. The wrap-around design provides peripheral protection, while the hydrophobic lens coating repels water and sweat.",
    shortDescription: "Performance eyewear with carbon fiber frame and hydrophobic lens coating for active lifestyles.",
    images: [
      ei("carbon fiber sport eyewear on technical surface, front angle, modern studio lighting"),
      ei("carbon fiber sport eyewear on technical surface, three quarter angle, modern studio lighting"),
      ei("carbon fiber sport eyewear on technical surface, side angle, modern studio lighting"),
    ],
    hoverImage: ei("carbon fiber sport eyewear on technical surface, side view, modern studio lighting"),
    rating: 4.7,
    reviewCount: 52,
    badges: ["premium"],
    variants: [
      { color: "#1a1a1a", colorName: "Black Carbon", image: ei("black carbon fiber sport front view"), stock: 20 },
      { color: "#2F4F4F", colorName: "Dark Slate", image: ei("dark slate carbon fiber sport front view"), stock: 12 },
    ],
    specs: [
      { label: "Frame Material", value: "Carbon Fiber" },
      { label: "Weight", value: "22g" },
      { label: "Frame Width", value: "142mm" },
      { label: "Lens Width", value: "64mm" },
      { label: "Bridge Width", value: "16mm" },
      { label: "Temple Length", value: "135mm" },
    ],
    features: [
      "Carbon fiber frame",
      "Hydrophobic lens coating",
      "Rubberized temple tips",
      "Adjustable nose pads",
      "Wrap-around design",
      "Impact-resistant lenses",
    ],
    stock: 20,
    sku: "KT-CFS-004",
    gender: ["men", "unisex"],
    frameShape: "rectangle",
    frameMaterial: "carbon-fiber",
    lensType: "polarized",
    lensColor: "black",
    frameColor: "black",
    frameSize: "large",
    weight: "22g",
    uvProtection: "UV400",
    warranty: "2 Years",
    availability: "in-stock",
    discount: 15,
  },
  {
    id: "kt-005",
    name: "Classic Round Tortoise",
    brand: "Khattak Heritage",
    slug: "classic-round-tortoise",
    category: "prescription",
    subcategory: "heritage",
    price: 15500,
    currency: "Rs.",
    description: "Inspired by mid-century intellectual style, the Classic Round Tortoise frames are crafted from premium acetate with authentic tortoiseshell patterning. The round silhouette flatters a wide range of face shapes and evokes a timeless scholarly elegance. These frames feature layered acetate construction that creates depth and dimension, with each pair exhibiting unique pattern variations. Perfect for those who appreciate vintage-inspired style with modern craftsmanship.",
    shortDescription: "Vintage-inspired round frames in authentic tortoiseshell acetate with timeless appeal.",
    images: [
      ei("classic round tortoise glasses on vintage book, front angle, warm lighting, editorial"),
      ei("classic round tortoise glasses on vintage book, three quarter angle, warm lighting"),
      ei("classic round tortoise glasses on vintage book, side angle, warm lighting"),
    ],
    hoverImage: ei("classic round tortoise glasses on vintage book, three quarter angle, warm lighting"),
    rating: 4.8,
    reviewCount: 89,
    badges: ["best-seller"],
    variants: [
      { color: "#8B4513", colorName: "Tortoise", image: ei("tortoise round frames front view"), stock: 18 },
      { color: "#1a1a1a", colorName: "Black", image: ei("black round frames front view"), stock: 22 },
    ],
    specs: [
      { label: "Frame Material", value: "Italian Acetate" },
      { label: "Weight", value: "26g" },
      { label: "Frame Width", value: "135mm" },
      { label: "Lens Width", value: "48mm" },
      { label: "Bridge Width", value: "22mm" },
      { label: "Temple Length", value: "145mm" },
    ],
    features: [
      "Italian acetate with tortoise pattern",
      "Layered construction for depth",
      "Wire core temples",
      "Adjustable nose pads",
      "Anti-reflective lenses",
      "Heritage-inspired case",
    ],
    stock: 18,
    sku: "KT-CRT-005",
    gender: ["men", "women", "unisex"],
    frameShape: "round",
    frameMaterial: "acetate",
    lensType: "anti-reflective",
    lensColor: "brown",
    frameColor: "tortoise",
    frameSize: "medium",
    weight: "26g",
    uvProtection: "UV400",
    warranty: "2 Years",
    availability: "in-stock",
  },
  {
    id: "kt-006",
    name: "Crystal Clear Minimal",
    brand: "Khattak Signature",
    slug: "crystal-clear-minimal",
    category: "blue-light",
    subcategory: "minimal",
    price: 18000,
    currency: "Rs.",
    description: "The Crystal Clear Minimal embodies the philosophy that true luxury lies in simplicity. These transparent frames are crafted from lightweight acetate with clean lines and an almost invisible silhouette. The crystal clear material allows your natural features to take center stage while providing the benefits of premium blue light blocking lenses. Ideal for professionals who spend extended hours in front of digital screens, these frames offer style without compromise.",
    shortDescription: "Invisible crystal clear frames with premium blue light blocking technology for modern professionals.",
    images: [
      ei("crystal clear transparent eyewear on white marble, front angle, minimalist studio lighting"),
      ei("crystal clear transparent eyewear on white marble, three quarter angle, minimalist studio lighting"),
      ei("crystal clear transparent eyewear on white marble, side angle, minimalist studio lighting"),
    ],
    hoverImage: ei("crystal clear transparent eyewear on white marble, side angle, minimalist"),
    rating: 4.6,
    reviewCount: 45,
    badges: ["new-arrival"],
    variants: [
      { color: "transparent", colorName: "Crystal Clear", image: ei("crystal clear frames front view"), stock: 14 },
      { color: "#F5F5DC", colorName: "Beige", image: ei("beige clear frames front view"), stock: 8 },
    ],
    specs: [
      { label: "Frame Material", value: "Italian Acetate" },
      { label: "Weight", value: "24g" },
      { label: "Frame Width", value: "136mm" },
      { label: "Lens Width", value: "51mm" },
      { label: "Bridge Width", value: "19mm" },
      { label: "Temple Length", value: "142mm" },
    ],
    features: [
      "Transparent Italian acetate",
      "Blue light blocking lenses",
      "Anti-reflective coating",
      "Lightweight minimalist design",
      "UV400 protection",
      "Slim hard case included",
    ],
    stock: 14,
    sku: "KT-CCM-006",
    gender: ["women", "men", "unisex"],
    frameShape: "square",
    frameMaterial: "acetate",
    lensType: "blue-light-blocking",
    lensColor: "clear",
    frameColor: "transparent",
    frameSize: "medium",
    weight: "24g",
    uvProtection: "UV400",
    warranty: "2 Years",
    availability: "new-arrival",
  },
];

export const categories = [
  { id: "sunglasses", name: "Sunglasses", description: "UV400 protection with premium Italian acetates and hand-finished details.", image: ei("luxury sunglasses collection on marble, hero shot, premium studio lighting, editorial fashion"), productCount: 42 },
  { id: "prescription", name: "Prescription", description: "Custom-crafted optical frames with precision-engineered lens technology.", image: ei("luxury prescription eyewear collection, hero shot, professional studio lighting"), productCount: 28 },
  { id: "blue-light", name: "Blue Light", description: "Protective lens technology engineered for modern digital lifestyles.", image: ei("modern blue light glasses collection, hero shot, tech-inspired lighting"), productCount: 24 },
  { id: "reading", name: "Reading Glasses", description: "Elegant reading frames combining style with everyday functionality.", image: ei("elegant reading glasses collection, hero shot, warm studio lighting"), productCount: 15 },
  { id: "sports", name: "Sports Eyewear", description: "Performance-driven frames designed for active lifestyles.", image: ei("performance sport eyewear collection, hero shot, dynamic lighting"), productCount: 12 },
];

export const getProductById = (id: string) => allProducts.find((p) => p.id === id) || null;
export const getProductBySlug = (slug: string) => allProducts.find((p) => p.slug === slug) || null;
export const getProductsByCategory = (category: string) => allProducts.filter((p) => p.category === category);
export const getRelatedProducts = (product: Product, limit = 4) =>
  allProducts.filter((p) => p.id !== product.id && (p.category === product.category || p.frameShape === product.frameShape)).slice(0, limit);
