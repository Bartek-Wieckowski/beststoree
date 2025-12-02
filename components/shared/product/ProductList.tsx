"use client";

import CONTENT_PAGE from "@/lib/content-page";
import ProductCard from "./ProductCard";
import { Product, Cart } from "@/types";
import { useEffect, useState } from "react";
import { getMyCart } from "@/lib/actions/cart.actions";

export default function ProductList({
  data,
  title,
  limit,
  cart: initialCart,
}: {
  data: Product[];
  title?: string;
  limit?: number;
  cart?: Cart;
}) {
  const [cart, setCart] = useState<Cart | undefined>(initialCart);
  const limitedData = limit ? data.slice(0, limit) : data;

  useEffect(() => {
    if (!initialCart) {
      getMyCart()
        .then(setCart)
        .catch(() => {});
    }
  }, [initialCart]);

  return (
    <div className="mt-10">
      <h2 className="h2-bold mb-4">{title}</h2>
      {data.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {limitedData.map((product: Product) => (
            <ProductCard key={product.id} product={product} cart={cart} />
          ))}
        </div>
      ) : (
        <div>
          <p>{CONTENT_PAGE.PRODUCT_LIST.noProductsFound}</p>
        </div>
      )}
    </div>
  );
}
