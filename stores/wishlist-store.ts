import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/types";

export type WishlistItem = {
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: string;
  categoryId: string;
  categoryName?: string;
};

type WishlistStore = {
  wishlist: WishlistItem[];
  isLoaded: boolean;
  addToWishlist: (product: Product) => { success: boolean; message: string };
  removeFromWishlist: (productId: string) => {
    success: boolean;
    message: string;
  };
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  count: number;
};

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      wishlist: [],
      isLoaded: false,
      addToWishlist: (product: Product) => {
        const items = get().wishlist;

        // Check if product already exists
        if (items.some((item) => item.productId === product.id)) {
          return { success: false, message: "Product already in wishlist" };
        }

        const newItem: WishlistItem = {
          productId: product.id,
          slug: product.slug,
          name: product.name,
          image: product.images?.[0] || "",
          price: product.price,
          categoryId: product.category?.id || "",
          categoryName: product.category?.name,
        };

        const updatedItems = [...items, newItem];
        set({ wishlist: updatedItems, count: updatedItems.length });
        return { success: true, message: "Product added to wishlist" };
      },
      removeFromWishlist: (productId: string) => {
        const items = get().wishlist;
        const updatedItems = items.filter(
          (item) => item.productId !== productId
        );
        set({ wishlist: updatedItems, count: updatedItems.length });
        return { success: true, message: "Product removed from wishlist" };
      },
      isInWishlist: (productId: string) => {
        return get().wishlist.some((item) => item.productId === productId);
      },
      clearWishlist: () => {
        set({ wishlist: [], count: 0 });
      },
      count: 0,
    }),
    {
      name: "wishlist-storage",
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isLoaded = true;
          state.count = state.wishlist.length;
        }
      },
    }
  )
);
