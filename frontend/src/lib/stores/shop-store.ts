import { create } from "zustand";
import { getProducts, ProductFilters } from "../api/products";

type ViewMode = "grid" | "list";

type ShopState = {
  products: any[];
  totalProducts: number;
  totalPages: number;
  isLoading: boolean;
  selectedFilters: Record<string, string[]>;
  priceRange: [number, number];
  sortBy: string;
  viewMode: ViewMode;
  currentPage: number;
  quickViewProduct: any | null;
  compareList: string[];
  recentlyViewed: string[];

  fetchProducts: (category?: string | null) => Promise<void>;
  setFilter: (groupId: string, values: string[]) => void;
  setPriceRange: (range: [number, number]) => void;
  setSortBy: (sort: string) => void;
  setViewMode: (mode: ViewMode) => void;
  setCurrentPage: (page: number) => void;
  resetFilters: () => void;
  setQuickViewProduct: (product: any | null) => void;
  toggleCompare: (id: string) => void;
  addToRecentlyViewed: (id: string) => void;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
};

const initialState = {
  products: [] as any[],
  totalProducts: 0,
  totalPages: 1,
  isLoading: false,
  selectedFilters: {} as Record<string, string[]>,
  priceRange: [0, 50000] as [number, number],
  sortBy: "popular",
  viewMode: "grid" as ViewMode,
  currentPage: 1,
  quickViewProduct: null as any | null,
  compareList: [] as string[],
  recentlyViewed: [] as string[],
};

export const useShopStore = create<ShopState>((set, get) => ({
  ...initialState,

  fetchProducts: async (categoryParam?: string | null) => {
    set({ isLoading: true });
    try {
      const state = get();
      
      const filters: ProductFilters = {
        page: state.currentPage,
        limit: 20,
        sort: state.sortBy,
        minPrice: state.priceRange[0],
        maxPrice: state.priceRange[1]
      };
      
      if (categoryParam) {
        filters.category = categoryParam;
      }

      // Map selected filters to API params
      if (state.selectedFilters['category']?.length > 0) {
        // If multiple categories are selected we might need to adjust the API,
        // but for now we'll pick the first one or pass them if backend supports it.
        // Assuming backend exact match for now.
        filters.category = state.selectedFilters['category'][0];
      }
      if (state.selectedFilters['brand']?.length > 0) {
        filters.brand = state.selectedFilters['brand'][0];
      }
      if (state.selectedFilters['frame-shape']?.length > 0) {
        filters.frameShape = state.selectedFilters['frame-shape'][0];
      }
      if (state.selectedFilters['frame-color']?.length > 0) {
        filters.colour = state.selectedFilters['frame-color'][0];
      }

      const response = await getProducts(filters);
      
      set({ 
        products: response.items,
        totalProducts: response.total,
        totalPages: response.totalPages,
        isLoading: false 
      });
    } catch (error) {
      console.error('Failed to fetch products', error);
      set({ isLoading: false });
    }
  },

  setFilter: (groupId, values) =>
    set((state) => ({
      selectedFilters: { ...state.selectedFilters, [groupId]: values },
      currentPage: 1,
    })),

  setPriceRange: (range) => set({ priceRange: range, currentPage: 1 }),
  setSortBy: (sortBy) => set({ sortBy, currentPage: 1 }),
  setViewMode: (viewMode) => set({ viewMode }),
  setCurrentPage: (currentPage) => set({ currentPage }),

  resetFilters: () =>
    set({
      selectedFilters: {},
      priceRange: [0, 50000],
      sortBy: "popular",
      currentPage: 1,
    }),

  setQuickViewProduct: (product) => set({ quickViewProduct: product }),

  toggleCompare: (id) =>
    set((state) => {
      const exists = state.compareList.includes(id);
      return {
        compareList: exists
          ? state.compareList.filter((i) => i !== id)
          : [...state.compareList, id],
      };
    }),

  addToRecentlyViewed: (id) =>
    set((state) => {
      const filtered = state.recentlyViewed.filter((i) => i !== id);
      return { recentlyViewed: [id, ...filtered].slice(0, 12) };
    }),

  removeFromCompare: (id) =>
    set((state) => ({
      compareList: state.compareList.filter((i) => i !== id),
    })),

  clearCompare: () => set({ compareList: [] }),
}));
