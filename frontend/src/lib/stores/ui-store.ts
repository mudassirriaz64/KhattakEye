import { create } from "zustand";

export type ThemeMode = "light" | "dark" | "system";

type UiState = {
  theme: ThemeMode;
  mobileNavOpen: boolean;
  searchOpen: boolean;
  wishlistOpen: boolean;
  cartOpen: boolean;
  megaMenuOpen: boolean;
  commandPaletteOpen: boolean;
  compareOpen: boolean;
  cookieConsent: boolean;
  announcementDismissed: boolean;
  recentSearches: string[];
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  setMobileNavOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  setWishlistOpen: (open: boolean) => void;
  setCartOpen: (open: boolean) => void;
  setMegaMenuOpen: (open: boolean) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setCompareOpen: (open: boolean) => void;
  setCookieConsent: (value: boolean) => void;
  setAnnouncementDismissed: (value: boolean) => void;
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
};

const getInitialTheme = (): ThemeMode => {
  if (typeof window === "undefined") {
    return "system";
  }

  const savedTheme = window.localStorage.getItem("khattak-theme");
  if (savedTheme === "dark" || savedTheme === "light" || savedTheme === "system") {
    return savedTheme;
  }

  return "system";
};

const getInitialCookieConsent = (): boolean => {
  if (typeof window === "undefined") return true;
  return window.localStorage.getItem("khattak-cookie-consent") === "true";
};

const getInitialRecentSearches = (): string[] => {
  if (typeof window === "undefined") return [];
  try {
    const saved = window.localStorage.getItem("khattak-recent-searches");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export const useUiStore = create<UiState>((set) => ({
  theme: getInitialTheme(),
  mobileNavOpen: false,
  searchOpen: false,
  wishlistOpen: false,
  cartOpen: false,
  megaMenuOpen: false,
  commandPaletteOpen: false,
  compareOpen: false,
  cookieConsent: getInitialCookieConsent(),
  announcementDismissed: false,
  recentSearches: getInitialRecentSearches(),
  setTheme: (theme) => set({ theme }),
  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === "light" ? "dark" : state.theme === "dark" ? "system" : "light",
    })),
  setMobileNavOpen: (mobileNavOpen) => set({ mobileNavOpen }),
  setSearchOpen: (searchOpen) => set({ searchOpen }),
  setWishlistOpen: (wishlistOpen) => set({ wishlistOpen }),
  setCartOpen: (cartOpen) => set({ cartOpen }),
  setMegaMenuOpen: (megaMenuOpen) => set({ megaMenuOpen }),
  setCommandPaletteOpen: (commandPaletteOpen) => set({ commandPaletteOpen }),
  setCompareOpen: (compareOpen) => set({ compareOpen }),
  setCookieConsent: (value) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("khattak-cookie-consent", String(value));
    }
    set({ cookieConsent: value });
  },
  setAnnouncementDismissed: (announcementDismissed) => set({ announcementDismissed }),
  addRecentSearch: (query) =>
    set((state) => {
      const filtered = state.recentSearches.filter((s) => s !== query);
      const updated = [query, ...filtered].slice(0, 10);
      if (typeof window !== "undefined") {
        window.localStorage.setItem("khattak-recent-searches", JSON.stringify(updated));
      }
      return { recentSearches: updated };
    }),
  clearRecentSearches: () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("khattak-recent-searches");
    }
    set({ recentSearches: [] });
  },
}));
