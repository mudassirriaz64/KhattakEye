import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Search, Heart, ShoppingBag, UserRound } from "lucide-react";
import { useUiStore } from "@/lib/stores/ui-store";
import { useCartStore } from "@/lib/stores/cart-store";
import { cn } from "@/lib/utils";

const items = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Search, label: "Search", path: "/search", action: "search" as const },
  { icon: Heart, label: "Wishlist", path: "/wishlist" },
  { icon: ShoppingBag, label: "Cart", path: "/cart", badge: true },
  { icon: UserRound, label: "Account", path: "/account" },
];

export function MobileBottomBar() {
  const location = useLocation();
  const setSearchOpen = useUiStore((s) => s.setSearchOpen);
  const [visible, setVisible] = useState(true);
  const [lastScroll, setLastScroll] = useState(0);

  useEffect(() => {
    const handler = () => {
      const current = window.scrollY;
      setVisible(current < 100 || current < lastScroll);
      setLastScroll(current);
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [lastScroll]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80 }}
          animate={{ y: 0 }}
          exit={{ y: 80 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-40 border-t border-[color:var(--color-border)] bg-[color:var(--color-panel)]/90 backdrop-blur-2xl md:hidden"
        >
          <nav className="flex items-center justify-around py-2">
            {items.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    if (item.action === "search") setSearchOpen(true);
                  }}
                  className="relative flex flex-col items-center gap-0.5 px-3 py-1"
                >
                  {item.label === "Cart" ? (
                    <CartIcon isActive={isActive} />
                  ) : item.label === "Wishlist" ? (
                    <WishlistIcon isActive={isActive} />
                  ) : (
                    <>
                      <Link to={item.path} className="flex flex-col items-center gap-0.5">
                        <item.icon className={cn("h-5 w-5", isActive ? "text-[color:var(--color-brand-primary)]" : "text-[color:var(--color-text-tertiary)]")} />
                        <span className={cn("text-[9px] font-medium", isActive ? "text-[color:var(--color-brand-primary)]" : "text-[color:var(--color-text-tertiary)]")}>
                          {item.label}
                        </span>
                      </Link>
                    </>
                  )}
                </button>
              );
            })}
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function CartIcon({ isActive }: { isActive: boolean }) {
  const count = useCartStore((s) => s.getItemCount());
  return (
    <Link to="/cart" className="relative flex flex-col items-center gap-0.5">
      <div className="relative">
        <ShoppingBag className={cn("h-5 w-5", isActive ? "text-[color:var(--color-brand-primary)]" : "text-[color:var(--color-text-tertiary)]")} />
        {count > 0 && (
          <span className="absolute -right-1.5 -top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[color:var(--color-accent-teal)] text-[8px] font-bold text-white">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </div>
      <span className={cn("text-[9px] font-medium", isActive ? "text-[color:var(--color-brand-primary)]" : "text-[color:var(--color-text-tertiary)]")}>
        Cart
      </span>
    </Link>
  );
}

function WishlistIcon({ isActive }: { isActive: boolean }) {
  const count = 0;
  return (
    <Link to="/wishlist" className="relative flex flex-col items-center gap-0.5">
      <div className="relative">
        <Heart className={cn("h-5 w-5", isActive ? "text-[color:var(--color-brand-primary)]" : "text-[color:var(--color-text-tertiary)]")} />
        {count > 0 && (
          <span className="absolute -right-1.5 -top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[color:var(--color-danger)] text-[8px] font-bold text-white">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </div>
      <span className={cn("text-[9px] font-medium", isActive ? "text-[color:var(--color-brand-primary)]" : "text-[color:var(--color-text-tertiary)]")}>
        Wishlist
      </span>
    </Link>
  );
}
