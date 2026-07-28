import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Heart,
  UserRound,
  ShoppingBag,
  Menu,
  ChevronDown,
  Glasses,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useScrollPosition } from "@/hooks/useScrollPosition";
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

export function Navbar() {
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
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 md:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[color:var(--color-brand-primary)]">
            <Glasses className="h-4 w-4" />
          </div>
          <span className="font-display text-xl text-white">
            Khattak
          </span>
        </Link>

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
                  "text-white/80 hover:text-white",
                )}
              >
                {link.label}
                {link.hasMega && <ChevronDown className="h-3 w-3" />}
                <span className="absolute bottom-0 left-4 right-4 h-0.5 origin-left scale-x-0 rounded-full bg-white transition-transform duration-200 group-hover:scale-x-100" />
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
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition-all hover:scale-105 hover:bg-white/10 hover:text-white"
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
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            className="ml-2 flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition-all hover:bg-white/10 hover:text-white xl:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {megaOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            onMouseEnter={handleMegaEnter}
            onMouseLeave={handleMegaLeave}
            className="absolute left-0 right-0 border-t border-[color:var(--color-border)] bg-[color:var(--color-panel)] shadow-[var(--shadow-strong)] backdrop-blur-xl"
          >
            <div className="mx-auto grid max-w-[1440px] grid-cols-3 gap-8 px-8 py-10">
              {megaColumns.map((col) => (
                <div key={col.title}>
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
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
