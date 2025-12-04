"use client";

import { Button } from "@/components/ui/button";
import { useWishlist } from "@/hooks/use-wishlist";
import { useComparison } from "@/hooks/use-comparison";
import { Product } from "@/types";
import CONTENT_PAGE from "@/lib/content-page";
import { Heart, Scale } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function ProductActions({ product }: { product: Product }) {
  const {
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    isLoaded: wishlistLoaded,
  } = useWishlist();
  const {
    addToComparison,
    removeFromComparison,
    isInComparison,
    canAddProduct,
    isLoaded: comparisonLoaded,
  } = useComparison();
  const { toast } = useToast();

  const handleWishlistToggle = () => {
    if (!wishlistLoaded) return;

    if (isInWishlist(product.id)) {
      const result = removeFromWishlist(product.id);
      toast({
        description: result.message,
      });
    } else {
      const result = addToWishlist(product);
      if (result.success) {
        toast({
          description: result.message,
        });
      } else {
        toast({
          description: result.message,
          variant: "destructive",
        });
      }
    }
  };

  const handleComparisonToggle = () => {
    if (!comparisonLoaded) return;

    if (isInComparison(product.id)) {
      const result = removeFromComparison(product.id);
      toast({
        description: result.message,
      });
    } else {
      const canAdd = canAddProduct(product);
      if (!canAdd.canAdd) {
        let message = "";
        switch (canAdd.reason) {
          case "max_limit":
            message = CONTENT_PAGE.COMPONENT.COMPARISON.maxItems;
            break;
          case "different_category":
            message = CONTENT_PAGE.COMPONENT.COMPARISON.differentCategory;
            break;
          case "already_added":
            message = CONTENT_PAGE.COMPONENT.COMPARISON.alreadyAdded;
            break;
          default:
            message = CONTENT_PAGE.COMPONENT.COMPARISON.cannotAddProduct;
        }
        toast({
          description: message,
          variant: "destructive",
        });
        return;
      }

      const result = addToComparison(product);
      if (result.success) {
        toast({
          description: result.message,
        });
      } else {
        toast({
          description: result.message,
          variant: "destructive",
        });
      }
    }
  };

  if (!wishlistLoaded || !comparisonLoaded) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 w-fit">
      <Button
        type="button"
        variant={isInWishlist(product.id) ? "default" : "outline"}
        size="sm"
        onClick={handleWishlistToggle}
        className={cn(
          "group w-full justify-start gap-2 transition-all",
          isInWishlist(product.id)
            ? "bg-red-500 hover:bg-red-600 text-white border-red-500"
            : "hover:bg-red-50 dark:hover:bg-red-950 hover:border-red-200 dark:hover:border-red-800 hover:text-red-700 dark:hover:text-red-400 text-foreground"
        )}
      >
        <Heart
          className={cn(
            "w-4 h-4 shrink-0 transition-colors",
            isInWishlist(product.id)
              ? "fill-white text-white"
              : "text-foreground group-hover:text-red-700 dark:group-hover:text-red-400"
          )}
        />
        <span className="text-sm">
          {isInWishlist(product.id)
            ? CONTENT_PAGE.COMPONENT.PRODUCT_DETAILS.removeFromWishlist
            : CONTENT_PAGE.COMPONENT.PRODUCT_DETAILS.addToWishlist}
        </span>
      </Button>
      <Button
        type="button"
        variant={isInComparison(product.id) ? "default" : "outline"}
        size="sm"
        onClick={handleComparisonToggle}
        className={cn(
          "group w-full justify-start gap-2 transition-all",
          isInComparison(product.id)
            ? "bg-blue-500 hover:bg-blue-600 text-white border-blue-500"
            : "hover:bg-blue-50 dark:hover:bg-blue-950 hover:border-blue-200 dark:hover:border-blue-800 hover:text-blue-700 dark:hover:text-blue-400 text-foreground"
        )}
      >
        <Scale
          className={cn(
            "w-4 h-4 shrink-0 transition-colors",
            isInComparison(product.id)
              ? "fill-white text-white"
              : "text-foreground group-hover:text-blue-700 dark:group-hover:text-blue-400"
          )}
        />
        <span className="text-sm">
          {isInComparison(product.id)
            ? CONTENT_PAGE.COMPONENT.PRODUCT_DETAILS.removeFromComparison
            : CONTENT_PAGE.COMPONENT.PRODUCT_DETAILS.addToComparison}
        </span>
      </Button>
    </div>
  );
}
