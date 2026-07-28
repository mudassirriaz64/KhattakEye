import { create } from "zustand";

type ThemeMode = "light" | "dark";

type UiState = {
  theme: ThemeMode;
  mobileNavOpen: boolean;
  searchOpen: boolean;
  wishlistOpen: boolean;
  cartOpen: boolean;
  megaMenuOpen: boolean;
  cookieConsent: boolean;
  announcementDismissed: boolean;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  setMobileNavOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  setWishlistOpen: (open: boolean) => void;
  setCartOpen: (open: boolean) => void;
  setMegaMenuOpen: (open: boolean) => void;
  setCookieConsent: (value: boolean) => void;
  setAnnouncementDismissed: (value: boolean) => void;
};

const getInitialTheme = (): ThemeMode => {
  if (typeof window === "undefined") {
    return "light";
  }

  const savedTheme = window.localStorage.getItem("khattak-theme");
  if (savedTheme === "dark" || savedTheme === "light") {
    return savedTheme;
  }

  if (typeof window.matchMedia === "function") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  return "light";
};

const getInitialCookieConsent = (): boolean => {
  if (typeof window === "undefined") return true;
  return window.localStorage.getItem("khattak-cookie-consent") === "true";
};

export const useUiStore = create<UiState>((set) => ({
  theme: getInitialTheme(),
  mobileNavOpen: false,
  searchOpen: false,
  wishlistOpen: false,
  cartOpen: false,
  megaMenuOpen: false,
  cookieConsent: getInitialCookieConsent(),
  announcementDismissed: false,
  setTheme: (theme) => set({ theme }),
  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === "light" ? "dark" : "light",
    })),
  setMobileNavOpen: (mobileNavOpen) => set({ mobileNavOpen }),
  setSearchOpen: (searchOpen) => set({ searchOpen }),
  setWishlistOpen: (wishlistOpen) => set({ wishlistOpen }),
  setCartOpen: (cartOpen) => set({ cartOpen }),
  setMegaMenuOpen: (megaMenuOpen) => set({ megaMenuOpen }),
  setCookieConsent: (value) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("khattak-cookie-consent", String(value));
    }
    set({ cookieConsent: value });
  },
  setAnnouncementDismissed: (announcementDismissed) => set({ announcementDismissed }),
}));
