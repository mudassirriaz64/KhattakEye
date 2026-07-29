import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search, Heart, UserRound, ShoppingBag, Menu, ChevronDown, Glasses,
  SunMedium, MoonStar, Monitor,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useScrollPosition } from "@/hooks/useScrollPosition";
import { useTheme } from "@/hooks/useTheme";
import { useUiStore } from "@/lib/stores/ui-store";
import { useCartStore } from "@/lib/stores/cart-store";

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
        { label: "Men Eyeglasses", path: "/shop/eyeglasses/men" },
        { label: "Women Eyeglasses", path: "/shop/eyeglasses/women" },
        { label: "Kids Eyeglasses", path: "/shop/eyeglasses/kids" },
        { label: "Premium Frames", path: "/shop/premium" },
        { label: "Lightweight Frames", path: "/shop/lightweight" },
      ]},
      { title: "Styles", links: [
        { label: "Rimless Frames", path: "/shop/rimless" },
        { label: "Full Rim", path: "/shop/full-rim" },
        { label: "Half Rim", path: "/shop/half-rim" },
        { label: "New Arrivals", path: "/shop/new" },
        { label: "Best Sellers", path: "/shop/best" },
      ]},
      { title: "Collections", links: [
        { label: "Titanium Series", path: "/shop/titanium" },
        { label: "Acetate Collection", path: "/shop/acetate" },
        { label: "Aviator Classics", path: "/shop/aviator" },
        { label: "Sport Performance", path: "/shop/sport" },
        { label: "Gift Cards", path: "/gift-cards" },
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
        { label: "Men", path: "/shop/sunglasses/men" },
        { label: "Women", path: "/shop/sunglasses/women" },
        { label: "Kids", path: "/shop/sunglasses/kids" },
        { label: "Polarized", path: "/shop/sunglasses/polarized" },
        { label: "UV Protection", path: "/shop/sunglasses/uv" },
      ]},
      { title: "Styles", links: [
        { label: "Driving", path: "/shop/sunglasses/driving" },
        { label: "Fashion", path: "/shop/sunglasses/fashion" },
        { label: "Sports", path: "/shop/sunglasses/sports" },
        { label: "Luxury Collection", path: "/shop/sunglasses/luxury" },
        { label: "Aviator", path: "/shop/sunglasses/aviator" },
      ]},
      { title: "Featured", links: [
        { label: "New Arrivals", path: "/shop/new" },
        { label: "Best Sellers", path: "/shop/best" },
        { label: "Sale", path: "/shop/sale" },
        { label: "Gift Cards", path: "/gift-cards" },
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
  { name: "Khattak Atelier", initials: "KA", color: "#0F766E" },
  { name: "Khattak Signature", initials: "KS", color: "#2563EB" },
  { name: "Khattak Heritage", initials: "KH", color: "#7C3AED" },
  { name: "Khattak Performance", initials: "KP", color: "#DC2626" },
  { name: "Ray-Ban", initials: "RB", color: "#111111" },
  { name: "Oakley", initials: "OK", color: "#1A1A2E" },
  { name: "Persol", initials: "PR", color: "#92400E" },
  { name: "Tom Ford", initials: "TF", color: "#1E1B4B" },
];

// ─── Theme Toggle ────────────────────────────────────────────────────
function ThemeToggle() {
  const { mode, isDark, isSystem, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="relative flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition-all hover:scale-105 hover:bg-white/10 hover:text-white"
      aria-label={`Current theme: ${mode}. Click to switch.`}
    >
      <AnimatePresence mode="wait">
        {isSystem ? (
          <motion.span key="system" initial={{ opacity: 0, rotate: -90, scale: 0.5 }} animate={{ opacity: 1, rotate: 0, scale: 1 }} exit={{ opacity: 0, rotate: 90, scale: 0.5 }} transition={{ duration: 0.25 }}>
            <Monitor className="h-4 w-4" />
          </motion.span>
        ) : isDark ? (
          <motion.span key="dark" initial={{ opacity: 0, rotate: -90, scale: 0.5 }} animate={{ opacity: 1, rotate: 0, scale: 1 }} exit={{ opacity: 0, rotate: 90, scale: 0.5 }} transition={{ duration: 0.25 }}>
            <SunMedium className="h-4 w-4" />
          </motion.span>
        ) : (
          <motion.span key="light" initial={{ opacity: 0, rotate: -90, scale: 0.5 }} animate={{ opacity: 1, rotate: 0, scale: 1 }} exit={{ opacity: 0, rotate: 90, scale: 0.5 }} transition={{ duration: 0.25 }}>
            <MoonStar className="h-4 w-4" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

// ─── Brand Logo SVG ──────────────────────────────────────────────────
function BrandLogoSvg({ initials, color }: { initials: string; color: string }) {
  return (
    <svg viewBox="0 0 60 60" className="h-10 w-10">
      <rect width="60" height="60" rx="12" fill={color} opacity="0.1" />
      <rect width="60" height="60" rx="12" fill="none" stroke={color} strokeWidth="0.5" opacity="0.2" />
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
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="absolute left-0 right-0 border-t border-[color:var(--color-border)] bg-[color:var(--color-panel)] shadow-[var(--shadow-strong)] backdrop-blur-xl"
    >
      <motion.div
        className={cn(
          "mx-auto flex max-w-[1440px] gap-8 px-8 py-10",
          images ? "items-start" : "justify-center",
        )}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
        initial="hidden"
        animate="visible"
      >
        <div className={cn("grid flex-1 gap-8", images ? "grid-cols-3" : "grid-cols-3")}>
          {columns.map((col) => (
            <motion.div
              key={col.title}
              variants={{
                hidden: { opacity: 0, y: 12 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--color-text-secondary)]">
                {col.title}
              </p>
              <ul className="space-y-3">
                {col.links.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.path}
                      className="group inline-flex items-center gap-2 text-sm text-[color:var(--color-text-secondary)] transition-colors hover:text-[color:var(--color-text-primary)]"
                    >
                      <span className="h-1 w-1 rounded-full bg-transparent transition-colors group-hover:bg-[color:var(--color-accent-teal)]" />
                      {item.label}
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
            className="flex shrink-0 flex-col gap-3"
          >
            {images.slice(0, 2).map((src, i) => (
              <div key={i} className="group relative h-[140px] w-[140px] overflow-hidden rounded-2xl">
                <img
                  src={src}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
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
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="absolute left-0 right-0 border-t border-[color:var(--color-border)] bg-[color:var(--color-panel)] shadow-[var(--shadow-strong)] backdrop-blur-xl"
    >
      <motion.div
        className="mx-auto max-w-[1440px] px-8 py-10"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.04 } } }}
        initial="hidden"
        animate="visible"
      >
        <p className="mb-6 text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--color-text-secondary)]">
          Premium Brands
        </p>
        <div className="grid grid-cols-4 gap-4 md:grid-cols-8">
          {brandLogos.map((brand) => (
            <motion.div
              key={brand.name}
              variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.25 }}
            >
              <Link
                to={`/brands/${brand.name.toLowerCase().replace(/\s+/g, "-")}`}
                className="group flex flex-col items-center gap-2 rounded-2xl p-4 transition-colors hover:bg-[color:var(--color-surface-muted)]"
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

// ─── Navbar ──────────────────────────────────────────────────────────
export function Navbar() {
  const { isScrolled } = useScrollPosition();
  const announcementDismissed = useUiStore((s) => s.announcementDismissed);
  const setMobileNavOpen = useUiStore((state) => state.setMobileNavOpen);
  const setSearchOpen = useUiStore((state) => state.setSearchOpen);
  const setWishlistOpen = useUiStore((state) => state.setWishlistOpen);
  const setCartOpen = useUiStore((state) => state.setCartOpen);
  const cartCount = useCartStore((s) => s.getItemCount());
  const [megaLabel, setMegaLabel] = useState<string | null>(null);
  const megaTimeout = useRef<ReturnType<typeof setTimeout>>();
  const navRef = useRef<HTMLElement>(null);

  const currentLink = navLinks.find((l) => l.label === megaLabel);
  const hasMega = !!(currentLink?.mega);
  const isBrands = megaLabel === "Brands";

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
    <header
      ref={navRef}
      className={cn(
        "fixed left-0 right-0 z-50 transition-all duration-300",
        announcementDismissed ? "top-0" : "top-10",
        "bg-[#0C111B]/85 backdrop-blur-xl shadow-[var(--shadow-soft)]",
      )}
    >
      <motion.div
        className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 md:px-8"
        animate={isScrolled ? { paddingLeft: 24, paddingRight: 24 } : {}}
        transition={{ duration: 0.3 }}
      >
        <Link to="/" className="flex items-center gap-2">
          <motion.div
            animate={isScrolled ? { scale: 0.85 } : { scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[color:var(--color-brand-primary)]"
          >
            <Glasses className="h-4 w-4" />
          </motion.div>
          <motion.span
            animate={isScrolled ? { scale: 0.9 } : { scale: 1 }}
            transition={{ duration: 0.3 }}
            className="font-display text-xl text-white"
          >
            Khattak
          </motion.span>
        </Link>

        <nav className="hidden items-center gap-1 xl:flex">
          {navLinks.map((link) => (
            <div
              key={link.label}
              className="relative"
              onMouseEnter={() => handleEnter(link.label)}
              onMouseLeave={handleLeave}
            >
              <Link
                to={link.path}
                className="group relative flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-white/80 transition-colors hover:text-white"
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
                <span className="absolute bottom-0 left-4 right-4 h-0.5 origin-left scale-x-0 rounded-full bg-white transition-transform duration-200 group-hover:scale-x-100" />
              </Link>
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          {[
            { icon: Search, label: "Search", action: () => setSearchOpen(true) },
            { icon: Heart, label: "Wishlist", action: () => setWishlistOpen(true) },
            { icon: UserRound, label: "Account", path: "/account" },
          ].map(({ icon: Icon, label, action, path }) => (
            <button
              key={label}
              type="button"
              onClick={action}
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition-all hover:scale-105 hover:bg-white/10 hover:text-white"
              aria-label={label}
            >
              <Icon className="h-4 w-4" />
            </button>
          ))}
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition-all hover:scale-105 hover:bg-white/10 hover:text-white"
            aria-label="Cart"
          >
            <ShoppingBag className="h-4 w-4" />
            {cartCount > 0 && (
              <motion.span
                key={cartCount}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[color:var(--color-accent-teal)] text-[9px] font-bold text-white"
              >
                {cartCount > 9 ? "9+" : cartCount}
              </motion.span>
            )}
          </button>
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            className="ml-2 flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition-all hover:scale-105 hover:bg-white/10 hover:text-white xl:hidden"
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
    </header>
  );
}
