import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/types";

export type ComparisonItem = {
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: string;
  categoryId: string;
  categoryName?: string;
  brand: string;
  rating: string;
  stock: number;
  description: string;
};

const MAX_COMPARISON_ITEMS = 4;

type ComparisonStore = {
  comparison: ComparisonItem[];
  isLoaded: boolean;
  addToComparison: (product: Product) => { success: boolean; message: string };
  removeFromComparison: (productId: string) => {
    success: boolean;
    message: string;
  };
  isInComparison: (productId: string) => boolean;
  clearComparison: () => void;
  canAddProduct: (product: Product) => {
    canAdd: boolean;
    reason?: "max_limit" | "different_category" | "already_added";
  };
  count: number;
  maxItems: number;
};

export const useComparisonStore = create<ComparisonStore>()(
  persist(
    (set, get) => ({
      comparison: [],
      isLoaded: false,
      addToComparison: (product: Product) => {
        const items = get().comparison;

        // Check if product already exists
        if (items.some((item) => item.productId === product.id)) {
          return { success: false, message: "Product already in comparison" };
        }

        // Check if we've reached the max limit
        if (items.length >= MAX_COMPARISON_ITEMS) {
          return {
            success: false,
            message: `You can compare maximum ${MAX_COMPARISON_ITEMS} products`,
          };
        }

        // Validate same category - if there are existing items, check category
        if (items.length > 0) {
          const firstItemCategoryId = items[0].categoryId;
          const productCategoryId = product.category?.id || "";

          if (firstItemCategoryId !== productCategoryId) {
            return {
              success: false,
              message:
                "You can only compare products from the same category. Please clear the comparison list first.",
            };
          }
        }

        const newItem: ComparisonItem = {
          productId: product.id,
          slug: product.slug,
          name: product.name,
          image: product.images?.[0] || "",
          price: product.price,
          categoryId: product.category?.id || "",
          categoryName: product.category?.name,
          brand: product.brand,
          rating: product.rating,
          stock: product.stock,
          description: product.description,
        };

        const updatedItems = [...items, newItem];
        set({ comparison: updatedItems, count: updatedItems.length });
        return { success: true, message: "Product added to comparison" };
      },
      removeFromComparison: (productId: string) => {
        const items = get().comparison;
        const updatedItems = items.filter(
          (item) => item.productId !== productId
        );
        set({ comparison: updatedItems, count: updatedItems.length });
        return { success: true, message: "Product removed from comparison" };
      },
      isInComparison: (productId: string) => {
        return get().comparison.some((item) => item.productId === productId);
      },
      clearComparison: () => {
        set({ comparison: [], count: 0 });
      },
      canAddProduct: (product: Product) => {
        const items = get().comparison;

        if (items.length >= MAX_COMPARISON_ITEMS) {
          return { canAdd: false, reason: "max_limit" };
        }

        if (items.length > 0) {
          const firstItemCategoryId = items[0].categoryId;
          const productCategoryId = product.category?.id || "";

          if (firstItemCategoryId !== productCategoryId) {
            return { canAdd: false, reason: "different_category" };
          }
        }

        if (items.some((item) => item.productId === product.id)) {
          return { canAdd: false, reason: "already_added" };
        }

        return { canAdd: true };
      },
      count: 0,
      maxItems: MAX_COMPARISON_ITEMS,
    }),
    {
      name: "comparison-storage",
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isLoaded = true;
          state.count = state.comparison.length;
        }
      },
    }
  )
);
