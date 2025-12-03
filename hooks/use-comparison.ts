"use client";

import { useComparisonStore } from "@/stores/comparison-store";

export type { ComparisonItem } from "@/stores/comparison-store";

export function useComparison() {
  const comparison = useComparisonStore((state) => state.comparison);
  const isLoaded = useComparisonStore((state) => state.isLoaded);
  const addToComparison = useComparisonStore((state) => state.addToComparison);
  const removeFromComparison = useComparisonStore(
    (state) => state.removeFromComparison
  );
  const isInComparison = useComparisonStore((state) => state.isInComparison);
  const clearComparison = useComparisonStore((state) => state.clearComparison);
  const canAddProduct = useComparisonStore((state) => state.canAddProduct);
  const count = useComparisonStore((state) => state.count);
  const maxItems = useComparisonStore((state) => state.maxItems);

  return {
    comparison,
    isLoaded,
    addToComparison,
    removeFromComparison,
    isInComparison,
    clearComparison,
    canAddProduct,
    count,
    maxItems,
  };
}
