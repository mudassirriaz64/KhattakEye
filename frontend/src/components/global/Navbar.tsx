import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Search, Heart, UserRound, ShoppingBag, Menu, ChevronDown, X,
  ArrowRight,
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
};

const navLinks: NavLink[] = [
  { label: "Home", path: "/" },
  {
    label: "Eyeglasses", path: "/shop/eyeglasses",
    megaImages: [
      "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=400&h=400&fit=crop",
    ],
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
    megaImages: [
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=400&h=400&fit=crop",
    ],
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
        { label: "Contact Us", path: "/contact" },
        { label: "Careers", path: "/careers" },
      ]},
      { title: "Support", links: [
        { label: "FAQs", path: "/faqs" },
        { label: "Track Order", path: "/track-order" },
        { label: "Shipping Info", path: "/shipping" },
        { label: "Return Policy", path: "/return-policy" },
      ]},
      { title: "Legal", links: [
        { label: "Privacy Policy", path: "/privacy" },
        { label: "Terms of Service", path: "/terms" },
        { label: "Refund Policy", path: "/refund-policy" },
      ]},
    ],
  },
  {
    label: "Contact Lenses", path: "/shop/contact-lenses",
    megaImages: [
      "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=400&h=400&fit=crop",
    ],
    mega: [
      { title: "Type", links: [
        { label: "Daily", path: "/shop/contact-lenses/daily" },
        { label: "Monthly", path: "/shop/contact-lenses/monthly" },
        { label: "Yearly", path: "/shop/contact-lenses/yearly" },
        { label: "Colored", path: "/shop/contact-lenses/colored" },
        { label: "Cosmetic", path: "/shop/contact-lenses/cosmetic" },
      ]},
      { title: "Specialty", links: [
        { label: "Toric (Astigmatism)", path: "/shop/contact-lenses/toric" },
        { label: "Multifocal", path: "/shop/contact-lenses/multifocal" },
        { label: "Daily Disposable", path: "/shop/contact-lenses/daily-disposable" },
      ]},
      { title: "Brands", links: [
        { label: "Khattak Atelier", path: "/brands/khattak-atelier" },
        { label: "Khattak Signature", path: "/brands/khattak-signature" },
        { label: "Khattak Heritage", path: "/brands/khattak-heritage" },
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
        { label: "Blue Cut", path: "/shop/lenses/blue-cut" },
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

// ─── Mega Menu Panel ─────────────────────────────────────────────────
function MegaPanel({ columns, images, onEnter, onLeave }: {
  columns: MegaColumn[];
  images?: string[];
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
          "mx-auto flex max-w-[1440px] gap-10 px-8 py-12",
          images ? "items-start" : "justify-center",
        )}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
        initial="hidden"
        animate="visible"
      >
        <div className={cn("grid flex-1 gap-10", images ? "grid-cols-3" : "grid-cols-3")}>
          {columns.map((col) => (
            <motion.div
              key={col.title}
              variants={{
                hidden: { opacity: 0, y: 12 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.26em] text-[color:var(--color-brand-primary)]">
                {col.title}
              </p>
              <ul className="space-y-3">
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
          ))}
        </div>

        {images && images.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="flex shrink-0 flex-col gap-4"
          >
            {images.slice(0, 2).map((src, i) => (
              <div key={i} className="group relative h-[150px] w-[150px] overflow-hidden rounded-[18px]">
                <img
                  src={src}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─── Brands Mega Menu ────────────────────────────────────────────────
function BrandsMegaPanel({ onEnter, onLeave }: { onEnter: () => void; onLeave: () => void }) {
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
        className="mx-auto max-w-[1440px] px-8 py-12"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.04 } } }}
        initial="hidden"
        animate="visible"
      >
        <p className="mb-6 text-[11px] font-semibold uppercase tracking-[0.26em] text-[color:var(--color-brand-primary)]">
          Premium Brands
        </p>
        <div className="grid grid-cols-4 gap-4 md:grid-cols-8">
          {brandLogos.map((brand) => (
            <motion.div
              key={brand.name}
              variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.28 }}
            >
              <Link
                to={`/brands/${brand.name.toLowerCase().replace(/\s+/g, "-")}`}
                className="group flex flex-col items-center gap-3 rounded-[18px] p-4 transition-all hover:bg-[color:var(--color-surface-muted)] hover:shadow-[var(--shadow-soft)]"
              >
                <BrandLogoSvg initials={brand.initials} color={brand.color} />
                <span className="text-center text-[10px] font-medium text-[color:var(--color-text-tertiary)] transition-colors group-hover:text-[color:var(--color-text-primary)]">
                  {brand.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

import { getCategories } from "@/lib/api/categories";
import { getBrands } from "@/lib/api/products";
import { useAuthStore } from "@/lib/stores/auth-store";

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
  
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [megaLabel, setMegaLabel] = useState<string | null>(null);
  const megaTimeout = useRef<ReturnType<typeof setTimeout>>();
  const navRef = useRef<HTMLElement>(null);
  
  const [navData, setNavData] = useState<NavLink[]>(navLinks);
  const [dynamicBrands, setDynamicBrands] = useState(brandLogos);

  useEffect(() => {
    async function fetchNavData() {
      try {
        const [categories, brands] = await Promise.all([
          getCategories(),
          getBrands()
        ]);
        
        const grouped = {
          Category: categories.filter((c: any) => c.type === 'category'),
          Styles: categories.filter((c: any) => c.type === 'style'),
          Collections: categories.filter((c: any) => c.type === 'collection')
        };
        
        const dynamicMega = [
          {
            title: "Category",
            links: grouped.Category.map((c: any) => ({ label: c.name, path: `/shop?category=${c.slug}` }))
          },
          {
            title: "Styles",
            links: grouped.Styles.map((c: any) => ({ label: c.name, path: `/shop?category=${c.slug}` }))
          },
          {
            title: "Collections",
            links: grouped.Collections.map((c: any) => ({ label: c.name, path: `/shop?category=${c.slug}` }))
          }
        ].filter(col => col.links.length > 0);

        if (dynamicMega.length > 0) {
          setNavData(prev => prev.map(link => {
            // Replace the mega menu for Eyeglasses/Sunglasses with real backend categories
            if (link.label === "Eyeglasses" || link.label === "Sunglasses") {
              return { ...link, mega: dynamicMega };
            }
            return link;
          }));
        }

        if (brands && brands.length > 0) {
          setDynamicBrands(brands.map((b: any) => ({
            name: b.name,
            initials: b.name.substring(0, 2).toUpperCase(),
            color: "#19130D"
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
  const isBrands = megaLabel === "Brands";

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
            onEnter={() => handleEnter(megaLabel)}
            onLeave={handleLeave}
          />
        )}
        {megaLabel === "Brands" && (
          <BrandsMegaPanel
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
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.path}
                    onClick={() => setMobileNavOpen(false)}
                    className={cn(
                      "flex items-center justify-between rounded-[14px] px-4 py-3 text-sm transition-colors",
                      isActive(link)
                        ? "bg-[color:var(--color-surface-muted)] font-semibold text-[color:var(--color-brand-primary)]"
                        : "text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-muted)] hover:text-[color:var(--color-text-primary)]",
                    )}
                  >
                    {link.label}
                    <ArrowRight className="h-3.5 w-3.5 opacity-40" />
                  </Link>
                ))}
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
