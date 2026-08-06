import { create } from "zustand";
import { getWishlistApi, addToWishlistApi, removeFromWishlistApi } from "../api/wishlist";
import { type ProductCard } from "../api/products";
import { type Product } from "../shop-data";
import { useAuthStore } from "./auth-store";

type WishlistItem = ProductCard & { _id?: string };
type WishlistProduct = Product & { _id?: string };

type WishlistState = {
  items: WishlistItem[];
  isLoading: boolean;
  fetchWishlist: () => Promise<void>;
  toggleWishlist: (product: WishlistProduct) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
};

const LOCAL_STORAGE_KEY = "khattak_guest_wishlist";

const getGuestWishlist = (): WishlistItem[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveGuestWishlist = (items: WishlistItem[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* ignore storage errors (private mode, quota) */
  }
};

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: getGuestWishlist(),
  isLoading: false,

  fetchWishlist: async () => {
    const isAuth = useAuthStore.getState().isAuthenticated;
    if (!isAuth) {
      set({ items: getGuestWishlist() });
      return;
    }

    set({ isLoading: true });
    try {
      const items = await getWishlistApi();
      set({ items });
    } catch {
      set({ items: getGuestWishlist() });
    } finally {
      set({ isLoading: false });
    }
  },

  toggleWishlist: async (product: WishlistProduct) => {
    const productId = product._id || product.id;
    const isAuth = useAuthStore.getState().isAuthenticated;

    const currentItems = get().items;
    const inList = get().isInWishlist(productId);
    let updatedItems: WishlistItem[];
    if (inList) {
      updatedItems = currentItems.filter((i) => (i._id || i.id) !== productId);
    } else {
      updatedItems = [...currentItems, product as unknown as WishlistItem];
    }

    // Optimistically update frontend state instantly
    set({ items: updatedItems });

    if (isAuth) {
      try {
        let items: WishlistItem[];
        if (inList) {
          items = await removeFromWishlistApi(productId);
        } else {
          items = await addToWishlistApi(productId);
        }
        // Sync with verified server response
        set({ items });
      } catch (err) {
        console.error("Failed to update wishlist server-side, rolling back:", err);
        set({ items: currentItems });
      }
    } else {
      saveGuestWishlist(updatedItems);
    }
  },

  removeFromWishlist: async (productId: string) => {
    const isAuth = useAuthStore.getState().isAuthenticated;
    if (isAuth) {
      set({ isLoading: true });
      try {
        const items = await removeFromWishlistApi(productId);
        set({ items });
      } catch (err) {
        console.error("Failed to remove from wishlist:", err);
      } finally {
        set({ isLoading: false });
      }
    } else {
      const updated = get().items.filter((i) => (i._id || i.id) !== productId);
      saveGuestWishlist(updated);
      set({ items: updated });
    }
  },

  isInWishlist: (productId: string) => {
    return get().items.some((i) => (i._id || i.id) === productId);
  },
}));
