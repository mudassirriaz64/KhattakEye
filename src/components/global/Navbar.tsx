import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Search,
  Heart,
  UserRound,
  ShoppingBag,
  Menu,
  ChevronDown,
  Glasses,
  SunMedium,
  MoonStar,
  Monitor,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useScrollPosition } from "@/hooks/useScrollPosition";
import { useTheme } from "@/hooks/useTheme";
import { useUiStore } from "@/lib/stores/ui-store";

const navLinks = [
  { label: "Home", path: "/" },
  {
    label: "Shop",
    path: "/shop",
    hasMega: true,
  },
  { label: "Men", path: "/shop/men" },
  { label: "Women", path: "/shop/women" },
  { label: "Sunglasses", path: "/shop/sunglasses" },
  { label: "Prescription", path: "/shop/prescription" },
  { label: "Brands", path: "/brands" },
  { label: "Offers", path: "/offers" },
];

const megaColumns = [
  {
    title: "Categories",
    links: [
      { label: "Sunglasses", path: "/shop/sunglasses" },
      { label: "Prescription", path: "/shop/prescription" },
      { label: "Blue Light", path: "/shop/blue-light" },
      { label: "Reading Glasses", path: "/shop/reading" },
    ],
  },
  {
    title: "Collections",
    links: [
      { label: "Titanium Series", path: "/shop/titanium" },
      { label: "Acetate Collection", path: "/shop/acetate" },
      { label: "Aviator Classics", path: "/shop/aviator" },
      { label: "Sport Performance", path: "/shop/sport" },
    ],
  },
  {
    title: "Featured",
    links: [
      { label: "New Arrivals", path: "/shop/new" },
      { label: "Best Sellers", path: "/shop/best" },
      { label: "Sale", path: "/shop/sale" },
      { label: "Gift Cards", path: "/gift-cards" },
    ],
  },
];

function ThemeToggle({ isScrolled, isLanding }: { isScrolled: boolean; isLanding: boolean }) {
  const { mode, isDark, isSystem, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        "relative flex h-10 w-10 items-center justify-center rounded-full transition-all hover:scale-105",
        isScrolled || isLanding
          ? "text-white/80 hover:bg-white/10 hover:text-white"
          : "text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-muted)] hover:text-[color:var(--color-text-primary)]",
      )}
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

export function Navbar() {
  const { pathname } = useLocation();
  const isLanding = pathname === "/";
  const { isScrolled } = useScrollPosition();
  const announcementDismissed = useUiStore((s) => s.announcementDismissed);
  const setMobileNavOpen = useUiStore((state) => state.setMobileNavOpen);
  const setSearchOpen = useUiStore((state) => state.setSearchOpen);
  const setWishlistOpen = useUiStore((state) => state.setWishlistOpen);
  const setCartOpen = useUiStore((state) => state.setCartOpen);
  const [megaOpen, setMegaOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const megaTimeout = useRef<ReturnType<typeof setTimeout>>();
  const navRef = useRef<HTMLElement>(null);

  const handleMegaEnter = () => {
    clearTimeout(megaTimeout.current);
    setMegaOpen(true);
  };

  const handleMegaLeave = () => {
    megaTimeout.current = setTimeout(() => setMegaOpen(false), 150);
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
        isScrolled
          ? "bg-[color:var(--color-brand-primary)]/85 shadow-[var(--shadow-soft)] backdrop-blur-xl"
          : isLanding
            ? "bg-transparent"
            : "bg-[color:var(--color-panel)]/70 backdrop-blur-xl",
      )}
    >
      <motion.div
        className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 md:px-8"
        animate={isScrolled ? { paddingLeft: 24, paddingRight: 24 } : {}}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          animate={isScrolled ? { gap: 8 } : { gap: 8 }}
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
              className={cn("font-display text-xl", isScrolled || isLanding ? "text-white" : "text-[color:var(--color-text-primary)]")}
            >
              Khattak
            </motion.span>
          </Link>
        </motion.div>

        <nav className="hidden items-center gap-1 xl:flex">
          {navLinks.map((link) => (
            <div
              key={link.label}
              className="relative"
              onMouseEnter={() => {
                setHoveredLink(link.label);
                if (link.hasMega) handleMegaEnter();
              }}
              onMouseLeave={() => {
                setHoveredLink(null);
                if (link.hasMega) handleMegaLeave();
              }}
            >
              <Link
                to={link.path}
                className={cn(
                  "group relative flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  isScrolled || isLanding ? "text-white/80 hover:text-white" : "text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)]",
                )}
              >
                {link.label}
                {link.hasMega && (
                  <motion.span
                    animate={megaOpen ? { rotate: 180 } : { rotate: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="h-3 w-3" />
                  </motion.span>
                )}
                <span className={cn(
                  "absolute bottom-0 left-4 right-4 h-0.5 origin-left scale-x-0 rounded-full transition-transform duration-200 group-hover:scale-x-100",
                  isScrolled || isLanding ? "bg-white" : "bg-[color:var(--color-brand-primary)]",
                )} />
              </Link>
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          {[
            { icon: Search, label: "Search", action: () => setSearchOpen(true) },
            { icon: Heart, label: "Wishlist", action: () => setWishlistOpen(true) },
            { icon: UserRound, label: "Account", action: () => {} },
            { icon: ShoppingBag, label: "Cart", action: () => setCartOpen(true), badge: "0" },
          ].map(({ icon: Icon, label, action, badge }) => (
            <button
              key={label}
              type="button"
              onClick={action}
              className={cn(
                "relative flex h-10 w-10 items-center justify-center rounded-full transition-all hover:scale-105",
                isScrolled || isLanding
                  ? "text-white/80 hover:bg-white/10 hover:text-white"
                  : "text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-muted)] hover:text-[color:var(--color-text-primary)]",
              )}
              aria-label={label}
            >
              <Icon className="h-4 w-4" />
              {badge && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[color:var(--color-accent-teal)] text-[9px] font-bold text-white">
                  {badge}
                </span>
              )}
            </button>
          ))}
          <ThemeToggle isScrolled={isScrolled} isLanding={isLanding} />
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            className={cn(
              "ml-2 flex h-10 w-10 items-center justify-center rounded-full transition-all xl:hidden",
              isScrolled || isLanding
                ? "text-white/80 hover:bg-white/10 hover:text-white"
                : "text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface-muted)] hover:text-[color:var(--color-text-primary)]",
            )}
            aria-label="Open menu"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {megaOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onMouseEnter={handleMegaEnter}
            onMouseLeave={handleMegaLeave}
            className="absolute left-0 right-0 border-t border-[color:var(--color-border)] bg-[color:var(--color-panel)] shadow-[var(--shadow-strong)] backdrop-blur-xl"
          >
            <motion.div
              className="mx-auto grid max-w-[1440px] grid-cols-3 gap-8 px-8 py-10"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
              }}
              initial="hidden"
              animate="visible"
            >
              {megaColumns.map((col) => (
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
