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
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

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
        {product.stock > 0 && (
          <div className="absolute bottom-2 right-2 z-10">
            {!showQuickAdd ? (
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
            ) : (
              <div
                className="bg-white p-3 rounded-lg shadow-xl border min-w-[220px] space-y-3"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-sm">Quick Add</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowQuickAdd(false);
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
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
            )}
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
    </Card>
  );
}
