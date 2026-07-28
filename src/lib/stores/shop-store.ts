import { create } from "zustand";

type ViewMode = "grid" | "list";

type ShopState = {
  selectedFilters: Record<string, string[]>;
  priceRange: [number, number];
  sortBy: string;
  viewMode: ViewMode;
  currentPage: number;
  quickViewProduct: string | null;
  compareList: string[];
  recentlyViewed: string[];

  setFilter: (groupId: string, values: string[]) => void;
  setPriceRange: (range: [number, number]) => void;
  setSortBy: (sort: string) => void;
  setViewMode: (mode: ViewMode) => void;
  setCurrentPage: (page: number) => void;
  resetFilters: () => void;
  setQuickViewProduct: (id: string | null) => void;
  toggleCompare: (id: string) => void;
  addToRecentlyViewed: (id: string) => void;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
};

const initialState = {
  selectedFilters: {} as Record<string, string[]>,
  priceRange: [0, 50000] as [number, number],
  sortBy: "featured",
  viewMode: "grid" as ViewMode,
  currentPage: 1,
  quickViewProduct: null as string | null,
  compareList: [] as string[],
  recentlyViewed: [] as string[],
};

export const useShopStore = create<ShopState>((set) => ({
  ...initialState,

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
      sortBy: "featured",
      currentPage: 1,
    }),

  setQuickViewProduct: (id) => set({ quickViewProduct: id }),

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
