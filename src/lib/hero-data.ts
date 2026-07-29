export type HeroSlideCTA = {
  label: string;
  link: string;
};

export type HeroSlideFloatingProduct = {
  name: string;
  price: string;
  image: string;
  rating: number;
};

export type HeroSlide = {
  id: string;
  desktopImage: string;
  tabletImage?: string;
  mobileImage?: string;
  video?: string;
  headline: string;
  highlightedText?: string;
  subtitle: string;
  primaryCta: HeroSlideCTA;
  secondaryCta?: HeroSlideCTA;
  offerBadge?: string;
  discountBadge?: string;
  floatingProduct?: HeroSlideFloatingProduct;
  overlayColor?: string;
  overlayOpacity?: number;
  animationStyle?: "fade" | "zoom" | "kenBurns" | "parallax";
  themeDarkImage?: string;
  order: number;
  active: boolean;
  scheduledFrom?: string;
  scheduledTo?: string;
};

export const heroSlides: HeroSlide[] = [
  {
    id: "slide-1",
    desktopImage: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=1920&q=85",
    tabletImage: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=1024&q=80",
    mobileImage: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=640&q=75",
    headline: "Premium Eyewear Collection",
    highlightedText: "Define Your Vision. Define Your Style.",
    subtitle: "Crafted for confidence, comfort, and timeless elegance. Discover frames that elevate every look.",
    primaryCta: { label: "Shop Collection", link: "/shop" },
    secondaryCta: { label: "Virtual Try-On", link: "/virtual-try-on" },
    discountBadge: "Up to 30% Off",
    floatingProduct: {
      name: "Tom Ford FT-210",
      price: "Rs. 18,999",
      image: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=200",
      rating: 5,
    },
    animationStyle: "kenBurns",
    order: 1,
    active: true,
  },
  {
    id: "slide-2",
    desktopImage: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=1920&q=85",
    tabletImage: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=1024&q=80",
    mobileImage: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=640&q=75",
    headline: "Luxury Sunglasses",
    highlightedText: "See the world in style.",
    subtitle: "Premium UV protection meets high fashion. From timeless aviators to modern wayfarers.",
    primaryCta: { label: "Explore Sunglasses", link: "/shop/sunglasses" },
    secondaryCta: { label: "Style Quiz", link: "/quiz" },
    offerBadge: "Authentic UV400 Protection",
    discountBadge: "Buy 1 Get 1 Free",
    floatingProduct: {
      name: "Ray-Ban Aviator",
      price: "Rs. 14,500",
      image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200",
      rating: 4.5,
    },
    animationStyle: "zoom",
    order: 2,
    active: true,
  },
  {
    id: "slide-3",
    desktopImage: "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=1920&q=85",
    tabletImage: "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=1024&q=80",
    mobileImage: "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=640&q=75",
    headline: "Smart Lens Technology",
    highlightedText: "Clarity meets innovation.",
    subtitle: "Blue-light blocking, anti-reflective, and photochromic lenses engineered for modern life.",
    primaryCta: { label: "Discover Lenses", link: "/shop/lenses" },
    secondaryCta: { label: "Learn More", link: "/lenses-technology" },
    offerBadge: "Free Eye Test Included",
    discountBadge: "20% Off Lens Upgrade",
    animationStyle: "parallax",
    order: 3,
    active: true,
  },
  {
    id: "slide-4",
    desktopImage: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=1920&q=85",
    tabletImage: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=1024&q=80",
    mobileImage: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=640&q=75",
    headline: "Try Before You Buy",
    highlightedText: "Virtual Try-On, Real Confidence.",
    subtitle: "See how any frame looks on your face instantly with AI-powered virtual try-on technology.",
    primaryCta: { label: "Try Now", link: "/virtual-try-on" },
    secondaryCta: { label: "Browse Frames", link: "/shop" },
    offerBadge: "No Appointment Needed",
    animationStyle: "fade",
    order: 4,
    active: true,
  },
  {
    id: "slide-5",
    desktopImage: "https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=1920&q=85",
    tabletImage: "https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=1024&q=80",
    mobileImage: "https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=640&q=75",
    headline: "New Season Arrivals",
    highlightedText: "Fresh looks for every occasion.",
    subtitle: "Explore our latest collection of handcrafted frames, from minimalist titanium to bold acetate.",
    primaryCta: { label: "Shop New Arrivals", link: "/shop/new" },
    secondaryCta: { label: "View Lookbook", link: "/lookbook" },
    discountBadge: "New Season Launch",
    animationStyle: "kenBurns",
    order: 5,
    active: true,
  },
  {
    id: "slide-6",
    desktopImage: "https://images.unsplash.com/photo-1572726729207-a78d6feb18d8?w=1920&q=85",
    tabletImage: "https://images.unsplash.com/photo-1572726729207-a78d6feb18d8?w=1024&q=80",
    mobileImage: "https://images.unsplash.com/photo-1572726729207-a78d6feb18d8?w=640&q=75",
    headline: "Complimentary Styling",
    highlightedText: "Perfect pair, guaranteed.",
    subtitle: "Not sure which frame suits you? Our expert stylists will handpick frames tailored to your face shape.",
    primaryCta: { label: "Book Consultation", link: "/consultation" },
    secondaryCta: { label: "Take Style Quiz", link: "/quiz" },
    offerBadge: "Free Styling Consultation",
    discountBadge: "Complimentary Case Included",
    animationStyle: "parallax",
    order: 6,
    active: true,
  },
];

export function getActiveSlides(): HeroSlide[] {
  const now = Date.now();
  return heroSlides
    .filter((s) => {
      if (!s.active) return false;
      if (s.scheduledFrom && new Date(s.scheduledFrom).getTime() > now) return false;
      if (s.scheduledTo && new Date(s.scheduledTo).getTime() < now) return false;
      return true;
    })
    .sort((a, b) => a.order - b.order);
}
