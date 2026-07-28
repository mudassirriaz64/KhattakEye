export type NavItem = {
  label: string;
  path: string;
  section: "Foundations" | "Components" | "Systems";
};

export type TokenRow = {
  token: string;
  value: string;
  usage: string;
};

export type TypeScaleRow = {
  name: string;
  size: string;
  lineHeight: string;
  weight: string;
  useCase: string;
};

export type ShowcaseCard = {
  title: string;
  description: string;
  path: string;
  accent: string;
};

const imageBase =
  "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?image_size=portrait_4_3&prompt=";

const encodeImagePrompt = (prompt: string) => `${imageBase}${encodeURIComponent(prompt)}`;

export const navItems: NavItem[] = [
  { label: "Overview", path: "/", section: "Foundations" },
  { label: "Colors", path: "/foundations/colors", section: "Foundations" },
  { label: "Typography", path: "/foundations/typography", section: "Foundations" },
  { label: "Layout", path: "/foundations/layout", section: "Foundations" },
  { label: "Buttons", path: "/components/buttons", section: "Components" },
  { label: "Forms", path: "/components/forms", section: "Components" },
  { label: "Cards", path: "/components/cards", section: "Components" },
  { label: "Navigation", path: "/components/navigation", section: "Components" },
  { label: "Motion", path: "/motion", section: "Systems" },
  { label: "Governance", path: "/governance", section: "Systems" },
];

export const showcaseCards: ShowcaseCard[] = [
  {
    title: "Editorial Foundation",
    description: "Near-black typography, generous white space, and premium surfaces tuned for eyewear storytelling.",
    path: "/foundations/colors",
    accent: "from-stone-900 to-stone-700",
  },
  {
    title: "Signature Commerce",
    description: "Product cards, trust cues, and interaction patterns built to make frames feel collectible and high-value.",
    path: "/components/cards",
    accent: "from-teal-700 to-teal-500",
  },
  {
    title: "Motion and Restraint",
    description: "Framer Motion presets that add polish without undermining clarity, accessibility, or conversion focus.",
    path: "/motion",
    accent: "from-blue-700 to-blue-500",
  },
];

export const colorTokens: TokenRow[] = [
  { token: "color.brand.primary", value: "#111111", usage: "Primary text, core CTA, luxury emphasis" },
  { token: "color.bg.canvas", value: "#FFFFFF", usage: "Main canvas and clean editorial sections" },
  { token: "color.bg.surface", value: "#F8F9FA", usage: "Soft elevated cards and utility surfaces" },
  { token: "color.accent.teal", value: "#0F766E", usage: "Premium accent, trust and feature emphasis" },
  { token: "color.accent.blue", value: "#2563EB", usage: "Information and focus-led highlights" },
  { token: "color.border.default", value: "#E5E7EB", usage: "Inputs, dividers, light structure" },
  { token: "color.text.secondary", value: "#6B7280", usage: "Subdued content and supporting metadata" },
  { token: "color.success", value: "#15803D", usage: "Positive states and in-stock messaging" },
  { token: "color.warning", value: "#D97706", usage: "Warning and low-stock states" },
  { token: "color.danger", value: "#DC2626", usage: "Errors and destructive actions" },
  { token: "color.info", value: "#2563EB", usage: "Instructional and informational cues" },
];

export const interactionTokens: TokenRow[] = [
  { token: "color.interactive.primary.hover", value: "#000000", usage: "Primary button hover" },
  { token: "color.interactive.primary.active", value: "#1F1F1F", usage: "Pressed button state" },
  { token: "color.interactive.secondary.hover", value: "#F3F4F6", usage: "Secondary surface hover" },
  { token: "color.interactive.outline.hover", value: "#F9FAFB", usage: "Outline button hover fill" },
  { token: "color.interactive.disabled.bg", value: "#E5E7EB", usage: "Disabled controls" },
  { token: "color.interactive.disabled.text", value: "#9CA3AF", usage: "Disabled text" },
  { token: "color.focus.ring", value: "rgba(37, 99, 235, 0.35)", usage: "Accessible focus treatment" },
];

export const typographyScale: TypeScaleRow[] = [
  { name: "Display XL", size: "72px", lineHeight: "80px", weight: "700", useCase: "Hero copy on wide screens" },
  { name: "Display", size: "60px", lineHeight: "68px", weight: "700", useCase: "Editorial statements" },
  { name: "H1", size: "48px", lineHeight: "56px", weight: "700", useCase: "Major documentation title" },
  { name: "H2", size: "40px", lineHeight: "48px", weight: "700", useCase: "Section headings" },
  { name: "H3", size: "32px", lineHeight: "40px", weight: "600", useCase: "Subsections and hero support" },
  { name: "Body Large", size: "18px", lineHeight: "30px", weight: "400", useCase: "Lead paragraphs" },
  { name: "Body", size: "16px", lineHeight: "28px", weight: "400", useCase: "Default body copy" },
  { name: "Small", size: "14px", lineHeight: "22px", weight: "400", useCase: "Metadata and helper content" },
  { name: "Caption", size: "12px", lineHeight: "18px", weight: "500", useCase: "Badges and micro labels" },
  { name: "Button", size: "14px", lineHeight: "20px", weight: "600", useCase: "Interactive labels" },
];

export const layoutRules = [
  ["Max container", "1440px"],
  ["Content container", "1280px"],
  ["Desktop grid", "12 columns / 24px gutter"],
  ["Tablet grid", "8 columns / 20px gutter"],
  ["Mobile grid", "4 columns / 16px gutter"],
  ["Desktop section spacing", "96px - 144px"],
  ["Tablet section spacing", "72px - 96px"],
  ["Mobile section spacing", "56px - 72px"],
  ["Card padding", "20px / 24px / 32px"],
  ["Radius scale", "8px / 12px / 16px / 24px / full"],
];

export const motionPresets = [
  ["Fade", "180-240ms opacity transitions for text, toasts, helper layers"],
  ["Reveal", "320-420ms translate and fade for editorial sections"],
  ["Card Hover", "200ms lift + shadow deepen + 4% image zoom"],
  ["Navbar Transition", "240ms blur and surface compression on scroll"],
  ["Drawer", "280ms lateral slide with backdrop fade"],
  ["Modal", "220ms fade and subtle scale-in"],
  ["Parallax", "Low amplitude depth motion reserved for hero and narrative bands"],
];

export const governanceRules = [
  "Tokens are the single source of truth for color, spacing, radius, shadow, and motion.",
  "Every future screen must be assembled from approved primitives or documented commerce components.",
  "No arbitrary hex, spacing, or shadow values inside page-level code.",
  "Each interactive component must support hover, focus, disabled, and loading states where relevant.",
  "Dark mode readiness exists at the token level even before a public dark mode launch.",
  "New components require naming, accessibility, responsive, and motion notes before merge.",
];

export const productCardSamples = [
  {
    brand: "Khattak Atelier",
    name: "Noir Line Titanium",
    price: "Rs. 28,500",
    oldPrice: "Rs. 34,000",
    rating: "4.9",
    stock: "Limited stock",
    image: encodeImagePrompt(
      "luxury black titanium eyewear product photography on soft white background, premium studio lighting, editorial ecommerce image, realistic, detailed frame front angle",
    ),
    hoverImage: encodeImagePrompt(
      "luxury black titanium eyewear product photography on soft white background, premium studio lighting, editorial ecommerce image, realistic, detailed frame side angle",
    ),
    discount: "-16%",
    swatches: ["bg-zinc-950", "bg-stone-400", "bg-amber-100"],
  },
  {
    brand: "Khattak Signature",
    name: "Verde Artisan Acetate",
    price: "Rs. 19,900",
    oldPrice: "Rs. 23,900",
    rating: "4.8",
    stock: "New arrival",
    image: encodeImagePrompt(
      "luxury emerald green acetate eyewear product photography on soft ivory background, refined shadows, fashion editorial ecommerce image, realistic front angle",
    ),
    hoverImage: encodeImagePrompt(
      "luxury emerald green acetate eyewear product photography on soft ivory background, refined shadows, fashion editorial ecommerce image, realistic three quarter angle",
    ),
    discount: "-12%",
    swatches: ["bg-emerald-700", "bg-zinc-900", "bg-stone-200"],
  },
];

export const reviewHighlights = [
  {
    title: "Premium service language",
    body: "Every supporting card uses calm secondary text, precise spacing, and trust-led metadata rather than aggressive sales copy.",
  },
  {
    title: "Fashion-first merchandising",
    body: "Product storytelling is image-led, with metadata arranged to feel like luxury editorial captions instead of dense catalog blocks.",
  },
  {
    title: "Built for 60+ screens",
    body: "Naming, folders, tokens, and patterns are already split for long-term growth across storefront, account, and service surfaces.",
  },
];
