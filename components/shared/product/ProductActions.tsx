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
    <div className="flex flex-col gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleWishlistToggle}
        className={cn(
          "flex-1 justify-start",
          isInWishlist(product.id) &&
            "bg-red-50 border-red-200 hover:bg-red-100 text-stone-900 hover:text-stone-900 text-[0.75rem]"
        )}
      >
        <Heart
          className={cn(
            "w-4 h-4 mr-2",
            isInWishlist(product.id) && "fill-red-500 text-red-500"
          )}
        />
        {isInWishlist(product.id)
          ? CONTENT_PAGE.COMPONENT.PRODUCT_DETAILS.removeFromWishlist
          : CONTENT_PAGE.COMPONENT.PRODUCT_DETAILS.addToWishlist}
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleComparisonToggle}
        className={cn(
          "flex-1 justify-start",
          isInComparison(product.id) &&
            "bg-blue-50 border-blue-200 hover:bg-blue-100 text-stone-900 hover:text-stone-900 text-[0.75rem]"
        )}
      >
        <Scale
          className={cn(
            "w-4 h-4 mr-2",
            isInComparison(product.id) && "fill-blue-500 text-blue-500"
          )}
        />
        {isInComparison(product.id)
          ? CONTENT_PAGE.COMPONENT.PRODUCT_DETAILS.removeFromComparison
          : CONTENT_PAGE.COMPONENT.PRODUCT_DETAILS.addToComparison}
      </Button>
    </div>
  );
}
