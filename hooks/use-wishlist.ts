"use client";

import { useWishlistStore } from "@/stores/wishlist-store";

export type { WishlistItem } from "@/stores/wishlist-store";

export function useWishlist() {
  const wishlist = useWishlistStore((state) => state.wishlist);
  const isLoaded = useWishlistStore((state) => state.isLoaded);
  const addToWishlist = useWishlistStore((state) => state.addToWishlist);
  const removeFromWishlist = useWishlistStore(
    (state) => state.removeFromWishlist
  );
  const isInWishlist = useWishlistStore((state) => state.isInWishlist);
  const clearWishlist = useWishlistStore((state) => state.clearWishlist);
  const count = useWishlistStore((state) => state.count);

  return {
    wishlist,
    isLoaded,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    count,
  };
}
