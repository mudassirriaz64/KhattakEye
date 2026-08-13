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
    desktopImage: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=1200&q=85",
    tabletImage: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80",
    mobileImage: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=75",
    headline: "The World is Worth Seeing.",
    highlightedText: "Define Your Vision. Define Your Style.",
    subtitle: "Italian acetates, Japanese titanium, and optics that have earned a following across the country. Handcrafted with uncompromising precision.",
    primaryCta: { label: "Explore the Collection", link: "/shop" },
    secondaryCta: { label: "Virtual Try-On", link: "/virtual-try-on" },
    discountBadge: "New Season 2026",
    floatingProduct: {
      name: "Khattak Royal Aviator Gold",
      price: "Rs. 18,500",
      image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=85",
      rating: 5,
    },
    animationStyle: "kenBurns",
    order: 1,
    active: true,
  },
  {
    id: "slide-2",
    desktopImage: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=1200&q=85",
    tabletImage: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80",
    mobileImage: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=75",
    headline: "The World is Worth Seeing.",
    highlightedText: "See the world in style.",
    subtitle: "Italian acetates, Japanese titanium, and optics that have earned a following across the country. Handcrafted with uncompromising precision.",
    primaryCta: { label: "Explore the Collection", link: "/shop" },
    secondaryCta: { label: "Virtual Try-On", link: "/virtual-try-on" },
    offerBadge: "Authentic UV400 Protection",
    discountBadge: "Bestseller",
    floatingProduct: {
      name: "Atelier Classic Wayfarer Black",
      price: "Rs. 14,500",
      image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=85",
      rating: 4.9,
    },
    animationStyle: "zoom",
    order: 2,
    active: true,
  },
  {
    id: "slide-3",
    desktopImage: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=1200&q=85",
    tabletImage: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800&q=80",
    mobileImage: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&q=75",
    headline: "The World is Worth Seeing.",
    highlightedText: "Clarity meets innovation.",
    subtitle: "Italian acetates, Japanese titanium, and optics that have earned a following across the country. Handcrafted with uncompromising precision.",
    primaryCta: { label: "Explore the Collection", link: "/shop" },
    secondaryCta: { label: "Virtual Try-On", link: "/virtual-try-on" },
    offerBadge: "Hand-finished Titanium",
    discountBadge: "Exclusive Edition",
    floatingProduct: {
      name: "Imperial Titanium Square",
      price: "Rs. 22,000",
      image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800&q=85",
      rating: 4.8,
    },
    animationStyle: "parallax",
    order: 3,
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
