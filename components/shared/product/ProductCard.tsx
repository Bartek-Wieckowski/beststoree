"use client";

import { useState, useTransition, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
import { addItemToCart } from "@/lib/actions/cart.actions";
import { ToastAction } from "@/components/ui/toast";
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
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
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

  const firstImage = useMemo(
    () => product.images?.find((img) => img && img.trim() !== ""),
    [product.images]
  );

  const sizes = useMemo(() => product.sizes || [], [product.sizes]);
  const colors = useMemo(() => product.colors || [], [product.colors]);

  const cartItem: CartItem = useMemo(
    () => ({
      image: firstImage || "",
      productId: product.id,
      slug: product.slug,
      qty: 1,
      name: product.name,
      price: product.price,
      size: selectedSize || null,
      color: selectedColor || null,
    }),
    [
      firstImage,
      product.id,
      product.slug,
      product.name,
      product.price,
      selectedSize,
      selectedColor,
    ]
  );

  const handleWishlistClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
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
    },
    [product, isInWishlist, removeFromWishlist, addToWishlist, toast]
  );

  const handleComparisonClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
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
              message = CONTENT_PAGE.COMPONENT.COMPARISON.maxItems;
              break;
            case "different_category":
              message = CONTENT_PAGE.COMPONENT.COMPARISON.differentCategory;
              break;
            case "already_added":
              message = CONTENT_PAGE.COMPONENT.COMPARISON.alreadyAdded;
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
    },
    [
      product,
      isInComparison,
      removeFromComparison,
      canAddProduct,
      addToComparison,
      toast,
    ]
  );

  const handleQuickAddClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();

      const hasVariants = sizes.length > 0 || colors.length > 0;

      if (!hasVariants) {
        // No variants - add directly to cart
        startTransition(async () => {
          const res = await addItemToCart(cartItem);
          if (!res.success) {
            toast({
              description: res.message as string,
              variant: "destructive",
            });
            return;
          }

          toast({
            description: res.message as string,
            action: (
              <ToastAction
                className=""
                altText={CONTENT_PAGE.GLOBAL.goToCart}
                onClick={() => router.push(ROUTES.CART)}
              >
                {CONTENT_PAGE.GLOBAL.goToCart}
              </ToastAction>
            ),
          });
        });
      } else {
        // Has variants - show dialog
        setShowQuickAdd(true);
      }
    },
    [sizes, colors, cartItem, startTransition, toast, router]
  );

  if (!firstImage) return null;

  const hasVariants = product.hasVariants || false;
  const isVariantRequired =
    hasVariants && (sizes.length > 0 || colors.length > 0);
  const isVariantSelected =
    (!sizes.length || selectedSize) && (!colors.length || selectedColor);

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
              onClick={handleWishlistClick}
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
              onClick={handleComparisonClick}
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
              onClick={handleQuickAddClick}
              disabled={isPending}
              className="shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Plus className="w-4 h-4 mr-1" />
              {CONTENT_PAGE.GLOBAL.quickAdd}
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
            <p className="text-destructive">{CONTENT_PAGE.GLOBAL.outOfStock}</p>
          )}
        </div>
      </CardContent>

      <Dialog open={showQuickAdd} onOpenChange={setShowQuickAdd}>
        <DialogContent className="sm:max-w-[26.5625rem]">
          <DialogHeader>
            <DialogTitle>
              {CONTENT_PAGE.GLOBAL.quickAdd} - {product.name}
            </DialogTitle>
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
