import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Search, Heart, UserRound, ShoppingBag, Menu, ChevronDown, X,
  ArrowRight, ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useScrollPosition } from "@/hooks/useScrollPosition";
import { useUiStore } from "@/lib/stores/ui-store";
import { useCartStore } from "@/lib/stores/cart-store";
import { useReveal } from "@/components/loading/RevealContext";

// ─── Navigation Link Data ───────────────────────────────────────────
type MegaLink = { label: string; path: string };
type MegaColumn = { title: string; links: MegaLink[] };
type NavLink = {
  label: string;
  path: string;
  mega?: MegaColumn[];
  megaImages?: string[];
  megaImageLabel?: string;
  megaImageLink?: string;
};

type NavCategory = Category & {
  subcategories?: {
    name?: string;
    slug?: string;
    image?: string;
    productCount?: number;
    group?: string;
  }[];
};

const navLinks: NavLink[] = [
  { label: "Home", path: "/" },
  {
    label: "Eyeglasses", path: "/shop/eyeglasses",
    mega: [
      { title: "Category", links: [
        { label: "Prescription Glasses", path: "/shop/eyeglasses" },
        { label: "Computer & Blue Light", path: "/shop/eyeglasses" },
        { label: "Reading Glasses", path: "/shop/eyeglasses" },
        { label: "Rimless & Minimalist", path: "/shop/eyeglasses" },
      ]},
      { title: "Styles", links: [
        { label: "Full Rim", path: "/shop/full-rim" },
        { label: "Half Rim", path: "/shop/half-rim" },
        { label: "Rimless Frames", path: "/shop/rimless" },
        { label: "New Arrivals", path: "/shop/new" },
        { label: "Best Sellers", path: "/shop/best" },
      ]},
      { title: "Collections", links: [
        { label: "Titanium Series", path: "/shop/titanium" },
        { label: "Acetate Collection", path: "/shop/acetate" },
        { label: "Aviator Classics", path: "/shop/aviator" },
        { label: "Sport Performance", path: "/shop/sport" },
      ]},
    ],
  },
  {
    label: "Sunglasses", path: "/shop/sunglasses",
    mega: [
      { title: "Category", links: [
        { label: "Polarized Shades", path: "/shop/sunglasses" },
        { label: "Driving Sunglasses", path: "/shop/sunglasses" },
        { label: "Fashion & Luxury", path: "/shop/sunglasses" },
        { label: "Sports Performance", path: "/shop/sunglasses" },
      ]},
      { title: "Styles", links: [
        { label: "Aviator", path: "/shop/sunglasses" },
        { label: "Wayfarer & Square", path: "/shop/sunglasses" },
        { label: "Round Classics", path: "/shop/sunglasses" },
        { label: "Cat-Eye Frames", path: "/shop/sunglasses" },
      ]},
      { title: "Featured", links: [
        { label: "New Arrivals", path: "/shop/new" },
        { label: "Best Sellers", path: "/shop/best" },
        { label: "Luxury Collection", path: "/shop/sunglasses/luxury" },
      ]},
    ],
  },
  {
    label: "About",
    path: "/about",
    mega: [
      { title: "Company", links: [
        { label: "About Us", path: "/about" },
        { label: "Blog", path: "/blog" },
        { label: "Contact Us", path: "/contact" },
        { label: "Careers", path: "/careers" },
      ]},
      { title: "Support", links: [
        { label: "FAQs", path: "/faqs" },
        { label: "Track Order", path: "/track-order" },
        { label: "Shipping Info", path: "/shipping-policy" },
        { label: "Return Policy", path: "/return-policy" },
      ]},
      { title: "Legal", links: [
        { label: "Privacy Policy", path: "/privacy" },
        { label: "Terms of Service", path: "/terms" },
        { label: "Refund Policy", path: "/return-policy" },
      ]},
    ],
  },
  {
    label: "Contact Lenses", path: "/shop/contact-lenses",
    mega: [
      { title: "Shop by Type", links: [
        { label: "Daily", path: "/shop/contact-lenses/daily" },
        { label: "Monthly", path: "/shop/contact-lenses/monthly" },
        { label: "Yearly", path: "/shop/contact-lenses/yearly" },
        { label: "Colored", path: "/shop/contact-lenses/colored" },
        { label: "Cosmetic", path: "/shop/contact-lenses/cosmetic" },
      ]},
      { title: "Shop by Need", links: [
        { label: "Toric (Astigmatism)", path: "/shop/contact-lenses/toric" },
        { label: "Multifocal", path: "/shop/contact-lenses/multifocal" },
        { label: "Daily Disposable", path: "/shop/contact-lenses/daily-disposable" },
      ]},
    ],
  },
  {
    label: "Lenses", path: "/shop/lenses",
    mega: [
      { title: "Prescription", links: [
        { label: "Single Vision", path: "/shop/lenses/single-vision" },
        { label: "Progressive", path: "/shop/lenses/progressive" },
        { label: "Reading", path: "/shop/lenses/reading" },
        { label: "Computer Lenses", path: "/shop/lenses/computer" },
      ]},
      { title: "Treatments", links: [
        { label: "Blue Cut", path: "/shop/lenses/blue-light" },
        { label: "Anti Reflective", path: "/shop/lenses/anti-reflective" },
        { label: "Photochromic", path: "/shop/lenses/photochromic" },
        { label: "Scratch Resistant", path: "/shop/lenses/scratch-resistant" },
      ]},
      { title: "Featured", links: [
        { label: "Thin & Light", path: "/shop/lenses/thin-light" },
        { label: "Premium Digital", path: "/shop/lenses/premium-digital" },
        { label: "All Lenses", path: "/shop/lenses" },
      ]},
    ],
  },
  { label: "Brands", path: "/brands" },
  { label: "Blog", path: "/blog" },
];

const brandLogos = [
  { name: "Khattak Atelier", initials: "KA", color: "#B6191B" },
  { name: "Khattak Signature", initials: "KS", color: "#8F1215" },
  { name: "Khattak Heritage", initials: "KH", color: "#D3A095" },
  { name: "Khattak Performance", initials: "KP", color: "#6D1F22" },
  { name: "Ray-Ban", initials: "RB", color: "#19130D" },
  { name: "Oakley", initials: "OK", color: "#3A2E2A" },
  { name: "Persol", initials: "PR", color: "#886057" },
  { name: "Tom Ford", initials: "TF", color: "#1E1B4B" },
];

// ─── Brand Logo Mark ─────────────────────────────────────────────────
function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="group flex items-center gap-2.5">
      <motion.img
        src="/khattak.png"
        alt="Khattak Eyewear"
        whileHover={{ rotate: -6, scale: 1.05 }}
        transition={{ duration: 0.3 }}
        className={cn("object-contain", compact ? "h-8 w-8" : "h-10 w-10")}
      />
      <span className="flex flex-col leading-none">
        <span className={cn("font-display font-semibold tracking-tight text-[color:var(--color-text-primary)]", compact ? "text-lg" : "text-xl")}>
          Khattak
        </span>
        <span className="text-[9px] font-medium uppercase tracking-[0.34em] text-[color:var(--color-text-tertiary)]">
          Eyewear
        </span>
      </span>
    </Link>
  );
}

// ─── Brand Logo SVG ──────────────────────────────────────────────────
function BrandLogoSvg({ initials, color }: { initials: string; color: string }) {
  return (
    <svg viewBox="0 0 60 60" className="h-10 w-10">
      <rect width="60" height="60" rx="14" fill={color} opacity="0.1" />
      <rect width="60" height="60" rx="14" fill="none" stroke={color} strokeWidth="0.5" opacity="0.2" />
      <text x="30" y="36" textAnchor="middle" fill={color} fontSize="16" fontWeight="700" fontFamily="Inter, sans-serif">
        {initials}
      </text>
    </svg>
  );
}

function MegaPanel({ columns, images, imageLabel, imageLink, onEnter, onLeave }: {
  columns: MegaColumn[];
  images?: string[];
  imageLabel?: string;
  imageLink?: string;
  onEnter: () => void;
  onLeave: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="absolute left-0 right-0 glass border-b border-[color:var(--color-border)] shadow-[var(--shadow-strong)]"
    >
      <motion.div
        className={cn(
          "mx-auto flex max-w-[1440px] gap-12 px-8 py-12",
          images ? "items-start justify-center" : "justify-center",
        )}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-wrap items-start justify-start gap-12 flex-1">
          {columns.map((col) => {
            const isSplit = col.links.length > 8;
            const rowCount = Math.ceil(col.links.length / 2);

            return (
              <motion.div
                key={col.title}
                className={cn("min-w-[180px]", isSplit && "min-w-[360px]")}
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.26em] text-[color:var(--color-brand-primary)]">
                  {col.title}
                </p>

                <ul
                  className={cn(
                    "space-y-3",
                    isSplit && "grid grid-flow-col gap-x-8 gap-y-3 space-y-0"
                  )}
                  style={isSplit ? { gridTemplateRows: `repeat(${rowCount}, minmax(0, 1fr))` } : undefined}
                >
                  {col.links.map((item) => (
                    <li key={item.label}>
                      <Link
                        to={item.path}
                        className="group inline-flex items-center gap-2 text-sm text-[color:var(--color-text-secondary)] transition-colors hover:text-[color:var(--color-text-primary)]"
                      >
                        <span className="h-1 w-1 rounded-full bg-transparent transition-colors group-hover:bg-[color:var(--color-brand-primary)]" />
                        <span className="relative">
                          {item.label}
                          <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-[color:var(--color-brand-primary)] transition-all duration-300 group-hover:w-full" />
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        {images && images.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="flex shrink-0 flex-col gap-4"
          >
            {images.slice(0, images.length === 1 ? 1 : 2).map((src, i) => {
              const CardContent = (
                <div className={cn("group relative overflow-hidden rounded-[18px] border border-[color:var(--color-border)] shadow-sm", images.length === 1 ? "h-[190px] w-[210px]" : "h-[150px] w-[150px]")}>
                  <img
                    src={src}
                    alt={imageLabel || ""}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className={cn("absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent", imageLabel ? "opacity-100" : "opacity-0 group-hover:opacity-100 transition-opacity")} />
                  {imageLabel && (
                    <div className="absolute bottom-3.5 left-3.5 right-3.5 text-left">
                      <span className="inline-block rounded bg-[#b91c1c] px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-widest text-white mb-1">NEW COLORS</span>
                      <p className="font-display text-base font-bold text-white drop-shadow-sm">{imageLabel}</p>
                    </div>
                  )}
                </div>
              );
              return imageLink ? (
                <Link key={i} to={imageLink}>{CardContent}</Link>
              ) : (
                <div key={i}>{CardContent}</div>
              );
            })}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─── Brands Mega Menu ────────────────────────────────────────────────
function BrandsMegaPanel({
  brands,
  onEnter,
  onLeave
}: {
  brands: { name: string; slug?: string; tagline?: string; logo?: string; featured?: boolean }[];
  onEnter: () => void;
  onLeave: () => void;
}) {
  // Group brands dynamically from MongoDB
  const houseBrands = brands.filter((b) => b.name.includes("Khattak") || b.featured);
  const otherBrands = brands.filter((b) => !b.name.includes("Khattak") && !b.featured);
  
  const col1 = houseBrands.length > 0 ? houseBrands : brands.slice(0, Math.ceil(brands.length / 2));
  const col2 = houseBrands.length > 0 ? otherBrands : brands.slice(Math.ceil(brands.length / 2));

  const featuredSpotlight = brands.find((b) => b.logo || b.featured) || brands[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="absolute left-0 right-0 glass border-b border-[color:var(--color-border)] shadow-[var(--shadow-strong)] backdrop-blur-xl"
    >
      <motion.div
        className="mx-auto max-w-[1440px] px-8 py-10 grid grid-cols-12 gap-12 items-start"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
        initial="hidden"
        animate="visible"
      >
        {/* Left Column 1: Featured House Brands */}
        <div className="col-span-4 space-y-4">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-brand-primary)]" />
            <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-[color:var(--color-brand-primary)]">
              Khattak Atelier & Featured
            </p>
          </div>
          <ul className="space-y-2">
            {col1.map((b) => (
              <li key={b.name}>
                <Link
                  to={`/shop?brand=${encodeURIComponent(b.name)}`}
                  onClick={onLeave}
                  className="group flex items-center justify-between gap-3 rounded-xl p-2.5 transition-all hover:bg-[color:var(--color-panel)] border border-transparent hover:border-[color:var(--color-border)]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {b.logo ? (
                      <img src={b.logo} alt={b.name} className="h-7 w-7 rounded-lg object-contain bg-white p-0.5 border border-[color:var(--color-border)] shrink-0" />
                    ) : (
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[color:var(--color-brand-primary)]/10 text-[10px] font-bold text-[color:var(--color-brand-primary)] shrink-0">
                        {b.name.substring(0, 2).toUpperCase()}
                      </span>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[color:var(--color-text-primary)] group-hover:text-[color:var(--color-brand-primary)] transition-colors truncate">
                        {b.name}
                      </p>
                      {b.tagline && (
                        <p className="text-[10px] font-medium text-[color:var(--color-text-tertiary)] truncate">
                          {b.tagline}
                        </p>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-[color:var(--color-text-tertiary)] opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Left Column 2: Designer & International Houses */}
        <div className="col-span-4 space-y-4">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-text-tertiary)]" />
            <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-[color:var(--color-text-secondary)]">
              Designer Collections
            </p>
          </div>
          <ul className="grid grid-cols-2 gap-2">
            {col2.map((b) => (
              <li key={b.name}>
                <Link
                  to={`/shop?brand=${encodeURIComponent(b.name)}`}
                  onClick={onLeave}
                  className="group flex items-center gap-2.5 rounded-xl p-2 transition-all hover:bg-[color:var(--color-panel)]"
                >
                  <span className="h-1 w-1 rounded-full bg-transparent group-hover:bg-[color:var(--color-brand-primary)] transition-colors" />
                  <span className="text-sm font-medium text-[color:var(--color-text-secondary)] group-hover:text-[color:var(--color-text-primary)] transition-colors truncate">
                    {b.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          
          <div className="pt-2 border-t border-[color:var(--color-border)]">
            <Link
              to="/shop"
              onClick={onLeave}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[color:var(--color-brand-primary)] hover:underline"
            >
              <span>Explore All {brands.length} Brands</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Right Section: Luxury Brand Showcase Spotlight Card */}
        <div className="col-span-4 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 shadow-xs relative overflow-hidden flex flex-col justify-between min-h-[240px]">
          <div className="absolute top-0 right-0 -mr-10 -mt-10 h-32 w-32 rounded-full bg-[color:var(--color-brand-primary)]/10 blur-2xl pointer-events-none" />
          
          <div>
            <span className="inline-flex items-center gap-1 rounded-full bg-[color:var(--color-brand-primary)]/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[color:var(--color-brand-primary)] mb-3">
              ✦ Featured Spotlight
            </span>
            <h4 className="font-display text-xl font-bold text-[color:var(--color-text-primary)]">
              {featuredSpotlight?.name || "Luxury Brands"}
            </h4>
            <p className="mt-1 text-xs leading-relaxed text-[color:var(--color-text-secondary)]">
              {featuredSpotlight?.tagline || "Discover handcrafted luxury frames, Italian acetates, and iconic optics."}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-[color:var(--color-border)] flex items-center justify-between">
            <span className="text-[10px] font-semibold text-[color:var(--color-text-tertiary)] uppercase tracking-wider">
              100% Authentic Guarantee
            </span>
            <Link
              to={`/shop?brand=${encodeURIComponent(featuredSpotlight?.name || "")}`}
              onClick={onLeave}
              className="inline-flex items-center gap-1 rounded-full bg-[color:var(--color-text-primary)] px-4 py-1.5 text-xs font-bold text-white transition-all hover:bg-[color:var(--color-brand-primary)] shadow-xs"
            >
              <span>Shop Brand</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

      </motion.div>
    </motion.div>
  );
}

import { getCategories, type Category } from "@/lib/api/categories";
import { getBrands, resolveCloudinaryUrl } from "@/lib/api/products";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useWishlistStore } from "@/lib/stores/wishlist-store";
import axios from "@/lib/api/axios";

// Mega-menu promo images now come from the Banner collection via placement
// (ERP.md §11). Empty results render no promo image card — they start empty
// until an admin uploads real banner images per placement.
const MEGA_MENU_PLACEMENTS: { label: string; placement: string }[] = [
  { label: "Eyeglasses", placement: "megamenu-eyeglasses" },
  { label: "Sunglasses", placement: "megamenu-sunglasses" },
  { label: "Lenses", placement: "megamenu-lenses" },
  { label: "Contact Lenses", placement: "megamenu-contact-lenses" },
];

export function Navbar() {
  const { isScrolled } = useScrollPosition();
  const { phase } = useReveal();
  const location = useLocation();
  const announcementDismissed = useUiStore((s) => s.announcementDismissed);
  const mobileNavOpen = useUiStore((s) => s.mobileNavOpen);
  const setMobileNavOpen = useUiStore((state) => state.setMobileNavOpen);
  const setSearchOpen = useUiStore((state) => state.setSearchOpen);
  const setWishlistOpen = useUiStore((state) => state.setWishlistOpen);
  const setCartOpen = useUiStore((state) => state.setCartOpen);
  const cartCount = useCartStore((s) => s.getItemCount());
  const wishlistCount = useWishlistStore((s) => s.items.length);
  
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [megaLabel, setMegaLabel] = useState<string | null>(null);
  const [openMobileSubmenu, setOpenMobileSubmenu] = useState<string | null>(null);
  const megaTimeout = useRef<ReturnType<typeof setTimeout>>();
  const navRef = useRef<HTMLElement>(null);
  
  const [navData, setNavData] = useState<NavLink[]>(navLinks);
  const [dynamicBrands, setDynamicBrands] = useState<{ name: string; slug?: string; tagline?: string; logo?: string; featured?: boolean }[]>([]);

  useEffect(() => {
    async function fetchNavData() {
      try {
        const [allCategories, brands, ...megaBannerLists] = await Promise.all([
          getCategories(),
          getBrands(),
          ...MEGA_MENU_PLACEMENTS.map((m) =>
            axios.get(`/banners?placement=${m.placement}`).then((res) => (Array.isArray(res.data) ? res.data : [])).catch(() => [])
          )
        ]);

        const megaImagesByLabel: Record<string, { images: string[]; label?: string; link?: string }> = {};
        MEGA_MENU_PLACEMENTS.forEach((m, i) => {
          const banners = megaBannerLists[i] || [];
          megaImagesByLabel[m.label] = {
            images: banners.map((b: { image?: string }) => b.image).filter(Boolean),
            label: banners[0]?.title || undefined,
            link: banners[0]?.link || undefined
          };
        });

        if (Array.isArray(allCategories) && allCategories.length > 0) {
          const findCat = (slug: string) => allCategories.find((c) => c.slug === slug);
          const eyeglassesCat = findCat('eyeglasses');
          const sunglassesCat = findCat('sunglasses');
          const contactLensesCat = findCat('contact-lenses');
          const lensesCat = findCat('lenses');

          const buildMegaFromSubcategories = (parentCat: NavCategory | undefined, basePath: string) => {
            if (!parentCat || !Array.isArray(parentCat.subcategories) || parentCat.subcategories.length === 0) {
              return null;
            }
            const groupsMap: Record<string, { label: string; path: string }[]> = {};
            for (const sub of parentCat.subcategories) {
              const groupName = sub.group || "Categories";
              if (!groupsMap[groupName]) groupsMap[groupName] = [];
              groupsMap[groupName].push({
                label: sub.name,
                path: `${basePath}/${sub.slug}`
              });
            }
            return Object.entries(groupsMap).map(([title, links]) => ({ title, links }));
          };

          const dynamicEyeglassesMega = buildMegaFromSubcategories(eyeglassesCat, '/shop/eyeglasses');
          const dynamicSunglassesMega = buildMegaFromSubcategories(sunglassesCat, '/shop/sunglasses');
          const dynamicContactLensesMega = buildMegaFromSubcategories(contactLensesCat, '/shop/contact-lenses');
          const dynamicLensesMega = buildMegaFromSubcategories(lensesCat, '/shop/lenses');

          setNavData(prev => prev.map(link => {
            const megaBanner = megaImagesByLabel[link.label];
            const base = megaBanner && megaBanner.images.length > 0
              ? {
                  ...link,
                  megaImages: megaBanner.images.slice(0, 2),
                  megaImageLabel: megaBanner.label,
                  megaImageLink: megaBanner.link
                }
              : { ...link, megaImages: undefined, megaImageLabel: undefined, megaImageLink: undefined };
            if (link.label === "Eyeglasses" && dynamicEyeglassesMega) {
              return { ...base, mega: dynamicEyeglassesMega };
            }
            if (link.label === "Sunglasses" && dynamicSunglassesMega) {
              return { ...base, mega: dynamicSunglassesMega };
            }
            if (link.label === "Contact Lenses" && dynamicContactLensesMega) {
              return { ...base, mega: dynamicContactLensesMega };
            }
            if (link.label === "Lenses" && dynamicLensesMega) {
              return { ...base, mega: dynamicLensesMega };
            }
            return base;
          }));
        }

        if (brands && Array.isArray(brands) && brands.length > 0) {
          setDynamicBrands(brands.map((b: { name: string; slug?: string; tagline?: string; logo?: string; featured?: boolean }) => ({
            name: b.name,
            slug: b.slug || b.name.toLowerCase().replace(/\s+/g, '-'),
            tagline: b.tagline,
            logo: b.logo ? resolveCloudinaryUrl(b.logo) : undefined,
            featured: Boolean(b.featured)
          })));
        }
      } catch (err) {
        console.error("Failed to fetch categories/brands for navbar", err);
      }
    }
    fetchNavData();
  }, []);

  const currentLink = navData.find((l) => l.label === megaLabel);
  const hasMega = !!(currentLink?.mega);

  const isActive = (link: NavLink) =>
    link.path === "/" ? location.pathname === "/" : location.pathname.startsWith(link.path);

  const handleEnter = (label: string) => {
    clearTimeout(megaTimeout.current);
    setMegaLabel(label);
  };

  const handleLeave = () => {
    megaTimeout.current = setTimeout(() => setMegaLabel(null), 150);
  };

  useEffect(() => {
    return () => clearTimeout(megaTimeout.current);
  }, []);

  return (
    <>
    <motion.header
      ref={navRef}
      initial={phase === "loading" ? { y: -80 } : false}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, delay: phase === "loading" ? 0.7 : 0, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "fixed left-0 right-0 z-50 transition-all duration-300",
        announcementDismissed ? "top-0" : "top-9",
        isScrolled
          ? "glass border-b border-[color:var(--color-border)] shadow-[var(--shadow-soft)]"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <motion.div
        className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 md:px-8"
        animate={isScrolled ? { paddingLeft: 24, paddingRight: 24 } : {}}
        transition={{ duration: 0.3 }}
      >
        <BrandMark />

        <nav className="hidden items-center gap-1 lg:flex">
          {navData.map((link) => (
            <div
              key={link.label}
              className="relative"
              onMouseEnter={() => handleEnter(link.label)}
              onMouseLeave={handleLeave}
            >
              <Link
                to={link.path}
                className={cn(
                  "group relative flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  isActive(link)
                    ? "text-[color:var(--color-brand-primary)]"
                    : "text-[color:var(--color-text-primary)] hover:text-[color:var(--color-brand-primary)]",
                )}
              >
                {link.label}
                {(link.mega || link.label === "Brands") && (
                  <motion.span
                    animate={megaLabel === link.label ? { rotate: 180 } : { rotate: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="h-3 w-3" />
                  </motion.span>
                )}
                <span
                  className={cn(
                    "absolute -bottom-1 left-4 right-4 h-0.5 rounded-full bg-[color:var(--color-brand-primary)] transition-all duration-300",
                    isActive(link) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                  )}
                />
              </Link>
            </div>
          ))}
        </nav>

        <div className="hidden items-center gap-1 lg:flex">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-[color:var(--color-text-secondary)] transition-all hover:scale-105 hover:bg-[color:var(--color-surface-muted)] hover:text-[color:var(--color-brand-primary)]"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setWishlistOpen(true)}
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-[color:var(--color-text-secondary)] transition-all hover:scale-105 hover:bg-[color:var(--color-surface-muted)] hover:text-[color:var(--color-brand-primary)]"
            aria-label="Wishlist"
          >
            <Heart className="h-4 w-4" />
            {wishlistCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[color:var(--color-brand-primary)] text-[9px] font-bold text-white shadow-[var(--glow-brand)]">
                {wishlistCount}
              </span>
            )}
          </button>

          {isAuthenticated && user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-3 py-1.5 text-xs font-semibold text-[color:var(--color-text-primary)] transition-all hover:border-[color:var(--color-accent-teal)]"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[color:var(--color-brand-primary)] text-[10px] text-white">
                  {user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
                </div>
                <span>{user.fullName ? user.fullName.split(" ")[0] : "Account"}</span>
              </button>
              {showUserMenu && (
                <div className="absolute right-0 top-12 z-50 w-48 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-2 shadow-[var(--shadow-strong)] backdrop-blur-xl">
                  <div className="border-b border-[color:var(--color-border)] px-3 py-2 text-xs">
                    <p className="font-semibold text-[color:var(--color-text-primary)]">{user.fullName}</p>
                    <p className="text-[10px] text-[color:var(--color-text-tertiary)]">{user.email}</p>
                  </div>
                  <Link to="/account" onClick={() => setShowUserMenu(false)} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-muted)] hover:text-[color:var(--color-text-primary)]">
                    Dashboard
                  </Link>
                  <Link to="/account/orders" onClick={() => setShowUserMenu(false)} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-muted)] hover:text-[color:var(--color-text-primary)]">
                    My Orders
                  </Link>
                  <button type="button" onClick={() => { logout(); setShowUserMenu(false); }} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs text-red-500 hover:bg-red-500/10">
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/auth/login"
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-[color:var(--color-text-secondary)] transition-all hover:scale-105 hover:bg-[color:var(--color-surface-muted)] hover:text-[color:var(--color-brand-primary)]"
              aria-label="Account"
            >
              <UserRound className="h-4 w-4" />
            </Link>
          )}

          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-[color:var(--color-text-secondary)] transition-all hover:scale-105 hover:bg-[color:var(--color-surface-muted)] hover:text-[color:var(--color-brand-primary)]"
            aria-label="Cart"
          >
            <ShoppingBag className="h-4 w-4" />
            {cartCount > 0 && (
              <motion.span
                key={cartCount}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full brand-gradient text-[9px] font-bold text-white"
              >
                {cartCount > 9 ? "9+" : cartCount}
              </motion.span>
            )}
          </button>
        </div>
        <div className="flex items-center lg:hidden">
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[color:var(--color-text-primary)] transition-all hover:scale-105 hover:bg-[color:var(--color-surface-muted)]"
            aria-label="Open menu"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {megaLabel && hasMega && currentLink?.mega && (
          <MegaPanel
            key={megaLabel}
            columns={currentLink.mega}
            images={currentLink.megaImages}
            imageLabel={currentLink.megaImageLabel}
            imageLink={currentLink.megaImageLink}
            onEnter={() => handleEnter(megaLabel)}
            onLeave={handleLeave}
          />
        )}
        {megaLabel === "Brands" && (
          <BrandsMegaPanel
            brands={dynamicBrands}
            onEnter={() => handleEnter("Brands")}
            onLeave={handleLeave}
          />
        )}
      </AnimatePresence>
    </motion.header>

    <AnimatePresence>
      {mobileNavOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobileNavOpen(false)}
            className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm lg:hidden"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="fixed inset-y-0 right-0 z-[80] flex w-[320px] flex-col bg-[color:var(--color-panel)] shadow-2xl lg:hidden"
          >
            <div className="flex items-center justify-between border-b border-[color:var(--color-border)] px-5 py-4">
              <BrandMark compact />
              <button
                type="button"
                onClick={() => setMobileNavOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-[color:var(--color-text-tertiary)] transition-colors hover:bg-[color:var(--color-surface-muted)] hover:text-[color:var(--color-text-primary)]"
                aria-label="Close menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-4">
              <div className="space-y-1">
                {navData.map((link) => {
                  const hasMegaContent = (link.mega && link.mega.length > 0) || link.label === "Brands";
                  const isExpanded = openMobileSubmenu === link.label;

                  if (!hasMegaContent) {
                    return (
                      <Link
                        key={link.label}
                        to={link.path}
                        onClick={() => setMobileNavOpen(false)}
                        className={cn(
                          "flex items-center justify-between rounded-[14px] px-4 py-3 text-sm font-medium transition-colors",
                          isActive(link)
                            ? "bg-[color:var(--color-surface-muted)] font-semibold text-[color:var(--color-brand-primary)]"
                            : "text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-muted)] hover:text-[color:var(--color-text-primary)]"
                        )}
                      >
                        <span>{link.label}</span>
                        <ArrowRight className="h-3.5 w-3.5 opacity-40" />
                      </Link>
                    );
                  }

                  return (
                    <div key={link.label} className="rounded-[14px] overflow-hidden border border-transparent transition-colors">
                      <button
                        type="button"
                        onClick={() => setOpenMobileSubmenu(isExpanded ? null : link.label)}
                        className={cn(
                          "flex w-full items-center justify-between rounded-[14px] px-4 py-3 text-sm font-medium transition-colors",
                          isExpanded || isActive(link)
                            ? "bg-[color:var(--color-surface-muted)] font-semibold text-[color:var(--color-brand-primary)]"
                            : "text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-muted)] hover:text-[color:var(--color-text-primary)]"
                        )}
                      >
                        <span>{link.label}</span>
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 transition-transform duration-200 text-[color:var(--color-text-tertiary)]",
                            isExpanded && "rotate-180 text-[color:var(--color-brand-primary)]"
                          )}
                        />
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                            className="overflow-hidden bg-[color:var(--color-app-bg)]/60 px-4 py-3 space-y-4 rounded-b-[14px] border-t border-[color:var(--color-border)]/50"
                          >
                            {/* Explicit "Shop All" Link */}
                            <Link
                              to={link.path}
                              onClick={() => setMobileNavOpen(false)}
                              className="flex items-center justify-between rounded-xl bg-[color:var(--color-brand-primary)]/10 px-3.5 py-2.5 text-xs font-bold text-[color:var(--color-brand-primary)] transition-all hover:bg-[color:var(--color-brand-primary)] hover:text-white"
                            >
                              <span>Shop All {link.label}</span>
                              <ArrowRight className="h-3.5 w-3.5" />
                            </Link>

                            {/* Standard Mega Menu Columns */}
                            {link.mega && link.mega.map((col) => (
                              <div key={col.title} className="space-y-2">
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[color:var(--color-text-tertiary)] border-b border-[color:var(--color-border)]/40 pb-1">
                                  {col.title}
                                </p>
                                <ul className="space-y-1.5 pl-1">
                                  {col.links.map((subItem) => (
                                    <li key={subItem.label}>
                                      <Link
                                        to={subItem.path}
                                        onClick={() => setMobileNavOpen(false)}
                                        className="flex items-center gap-2 text-xs font-medium text-[color:var(--color-text-secondary)] transition-colors hover:text-[color:var(--color-brand-primary)]"
                                      >
                                        <span className="h-1 w-1 rounded-full bg-[color:var(--color-brand-primary)]/50" />
                                        <span>{subItem.label}</span>
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}

                            {/* Brands Mega Menu */}
                            {link.label === "Brands" && (
                              <div className="space-y-2">
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[color:var(--color-text-tertiary)] border-b border-[color:var(--color-border)]/40 pb-1">
                                  All Brands
                                </p>
                                <div className="grid grid-cols-2 gap-2 pt-1">
                                  {dynamicBrands.map((b) => (
                                    <Link
                                      key={b.name}
                                      to={`/shop?brand=${encodeURIComponent(b.name)}`}
                                      onClick={() => setMobileNavOpen(false)}
                                      className="flex items-center gap-2 rounded-lg p-1.5 text-xs font-medium text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-panel)] hover:text-[color:var(--color-brand-primary)] truncate"
                                    >
                                      <span className="h-1 w-1 rounded-full bg-[color:var(--color-brand-primary)] shrink-0" />
                                      <span className="truncate">{b.name}</span>
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 border-t border-[color:var(--color-border)] pt-6">
                <p className="mb-3 px-4 text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-text-tertiary)]">
                  Quick Links
                </p>
                <div className="space-y-1">
                  {[
                    { icon: Search, label: "Search", action: () => { setSearchOpen(true); setMobileNavOpen(false); } },
                    { icon: Heart, label: "Wishlist", action: () => { setWishlistOpen(true); setMobileNavOpen(false); } },
                    { icon: UserRound, label: "Account", path: "/account" },
                    { icon: ShoppingBag, label: "Cart", action: () => { setCartOpen(true); setMobileNavOpen(false); } },
                  ].map(({ icon: Icon, label, action, path }) => (
                    path ? (
                      <Link
                        key={label}
                        to={path}
                        onClick={() => setMobileNavOpen(false)}
                        className="flex items-center gap-3 rounded-[14px] px-4 py-3 text-sm text-[color:var(--color-text-secondary)] transition-colors hover:bg-[color:var(--color-surface-muted)] hover:text-[color:var(--color-text-primary)]"
                      >
                        <Icon className="h-4 w-4" />
                        {label}
                      </Link>
                    ) : (
                      <button
                        key={label}
                        type="button"
                        onClick={action}
                        className="flex w-full items-center gap-3 rounded-[14px] px-4 py-3 text-sm text-[color:var(--color-text-secondary)] transition-colors hover:bg-[color:var(--color-surface-muted)] hover:text-[color:var(--color-text-primary)]"
                      >
                        <Icon className="h-4 w-4" />
                        {label}
                      </button>
                    )
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-[color:var(--color-border)] px-5 py-4">
              <p className="text-center text-[10px] text-[color:var(--color-text-tertiary)]">
                Khattak Eyewear &copy; {new Date().getFullYear()}
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
    </>
  );
}
