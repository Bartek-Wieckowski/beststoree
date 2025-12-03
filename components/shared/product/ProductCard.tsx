"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import ROUTES from "@/lib/routes";
import CONTENT_PAGE from "@/lib/content-page";
import ProductPrice from "./ProductPrice";
import { Product, Cart, CartItem } from "@/types";
import ProductRating from "./ProductRating";
import ProductVariants from "./ProductVariants";
import AddToCart from "./AddToCart";
import { Button } from "@/components/ui/button";
import { Plus, Heart, Scale } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/hooks/use-wishlist";
import { useComparison } from "@/hooks/use-comparison";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function ProductCard({
  product,
  cart,
}: {
  product: Product;
  cart?: Cart;
}) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
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

  const firstImage = product.images?.find((img) => img && img.trim() !== "");

  if (!firstImage) return null;

  const hasVariants = product.hasVariants || false;
  const sizes = product.sizes || [];
  const colors = product.colors || [];
  const isVariantRequired =
    hasVariants && (sizes.length > 0 || colors.length > 0);
  const isVariantSelected =
    (!sizes.length || selectedSize) && (!colors.length || selectedColor);

  const cartItem: CartItem = {
    image: firstImage,
    productId: product.id,
    slug: product.slug,
    qty: 1,
    name: product.name,
    price: product.price,
    size: selectedSize || null,
    color: selectedColor || null,
  };

  return (
    <Card className="w-full max-w-sm group mx-auto" data-testid="product-card">
      <CardHeader className="p-0 items-center relative overflow-hidden">
        <Link href={ROUTES.PRODUCT(product.slug)}>
          <Image
            src={firstImage}
            alt={product.name}
            height={300}
            width={300}
            priority={true}
            className="transition-transform group-hover:scale-105"
          />
        </Link>
        {wishlistLoaded && comparisonLoaded && (
          <div className="absolute top-2 left-2 z-10 flex gap-2">
            <Button
              type="button"
              size="icon"
              variant="secondary"
              className={cn(
                "h-8 w-8 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity",
                isInWishlist(product.id) &&
                  "opacity-100 bg-red-50 hover:bg-red-100"
              )}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (isInWishlist(product.id)) {
                  const result = removeFromWishlist(product.id);
                  toast({ description: result.message });
                } else {
                  const result = addToWishlist(product);
                  toast({
                    description: result.message,
                    variant: result.success ? "default" : "destructive",
                  });
                }
              }}
            >
              <Heart
                className={cn(
                  "h-4 w-4",
                  isInWishlist(product.id) && "fill-red-500 text-red-500"
                )}
              />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="secondary"
              className={cn(
                "h-8 w-8 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity",
                isInComparison(product.id) &&
                  "opacity-100 bg-blue-50 hover:bg-blue-100"
              )}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (isInComparison(product.id)) {
                  const result = removeFromComparison(product.id);
                  toast({ description: result.message });
                } else {
                  const canAdd = canAddProduct(product);
                  if (!canAdd.canAdd) {
                    let message = "";
                    switch (canAdd.reason) {
                      case "max_limit":
                        message = CONTENT_PAGE.COMPARISON.maxItems;
                        break;
                      case "different_category":
                        message = CONTENT_PAGE.COMPARISON.differentCategory;
                        break;
                      case "already_added":
                        message = CONTENT_PAGE.COMPARISON.alreadyAdded;
                        break;
                      default:
                        message = "Cannot add product to comparison";
                    }
                    toast({ description: message, variant: "destructive" });
                    return;
                  }
                  const result = addToComparison(product);
                  toast({
                    description: result.message,
                    variant: result.success ? "default" : "destructive",
                  });
                }
              }}
            >
              <Scale
                className={cn(
                  "h-4 w-4",
                  isInComparison(product.id) && "fill-blue-500 text-blue-500"
                )}
              />
            </Button>
          </div>
        )}
        {product.stock > 0 && (
          <div className="absolute bottom-2 right-2 z-10">
            <Button
              type="button"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowQuickAdd(true);
              }}
              className="shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Plus className="w-4 h-4 mr-1" />
              Quick Add
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-4 grid gap-4">
        <Link href={ROUTES.PRODUCT(product.slug)}>
          <h2 className="text-sm font-medium">{product.name}</h2>
        </Link>
        <div className="flex-between gap-4">
          <ProductRating value={Number(product.rating)} />
          {product.stock > 0 ? (
            <ProductPrice value={Number(product.price)} />
          ) : (
            <p className="text-destructive">
              {CONTENT_PAGE.PRODUCT_CARD.outOfStock}
            </p>
          )}
        </div>
      </CardContent>

      <Dialog open={showQuickAdd} onOpenChange={setShowQuickAdd}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Quick Add - {product.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {isVariantRequired && (
              <ProductVariants
                sizes={sizes}
                colors={colors}
                selectedSize={selectedSize}
                selectedColor={selectedColor}
                onSizeChange={setSelectedSize}
                onColorChange={setSelectedColor}
              />
            )}
            <AddToCart
              cart={cart}
              item={cartItem}
              disabled={isVariantRequired && !isVariantSelected}
            />
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
