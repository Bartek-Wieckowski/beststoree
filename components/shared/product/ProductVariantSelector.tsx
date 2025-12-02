"use client";

import { useState } from "react";
import ProductVariants from "./ProductVariants";
import AddToCart from "./AddToCart";
import { Cart, CartItem } from "@/types";
import { Product } from "@/types";

type ProductVariantSelectorProps = {
  product: Product;
  cart?: Cart;
};

export default function ProductVariantSelector({
  product,
  cart,
}: ProductVariantSelectorProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const hasVariants = product.hasVariants || false;
  const sizes = product.sizes || [];
  const colors = product.colors || [];

  // Check if variants are required
  const isVariantRequired =
    hasVariants && (sizes.length > 0 || colors.length > 0);
  const isVariantSelected =
    (!sizes.length || selectedSize) && (!colors.length || selectedColor);

  const cartItem: CartItem = {
    image: product.images[0],
    productId: product.id,
    slug: product.slug,
    qty: 1,
    name: product.name,
    price: product.price,
    size: selectedSize || null,
    color: selectedColor || null,
  };

  return (
    <div className="space-y-4">
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

      {product.stock > 0 && (
        <AddToCart
          cart={cart}
          item={cartItem}
          disabled={isVariantRequired && !isVariantSelected}
        />
      )}
    </div>
  );
}

