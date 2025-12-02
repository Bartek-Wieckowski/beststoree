"use server";

import { auth } from "@/auth";
import { CartItem } from "@/types";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { prisma } from "../prisma";
import ROUTES from "../routes";
import { convertToPlainObject, formatError, round2 } from "../utils";
import { cartItemSchema, insertCartSchema } from "../validators";
import { Prisma } from "@prisma/client";

const calcPrice = (items: CartItem[]) => {
  const itemsPrice = round2(
      items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0)
    ),
    shippingPrice = round2(itemsPrice > 100 ? 0 : 10),
    taxPrice = round2(0.15 * itemsPrice),
    totalPrice = round2(itemsPrice + taxPrice + shippingPrice);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
};

export async function addItemToCart(data: CartItem) {
  try {
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;

    if (!sessionCartId) throw new Error("Cart session not found");

    const session = await auth();
    const userId = session?.user?.id;

    const cart = await getMyCart();

    const item = cartItemSchema.parse(data);

    const product = await prisma.product.findFirst({
      where: { id: item.productId },
    });

    if (!product) throw new Error("Product not found");

    if (!cart) {
      // Validate stock before creating new cart
      if (product.stock < item.qty) {
        return {
          success: false,
          message: `We don't have enough stock of "${product.name}". Available stock: ${product.stock}`,
        };
      }

      const newCart = insertCartSchema.parse({
        userId: userId,
        items: [item],
        sessionCartId: sessionCartId,
        ...calcPrice([item]),
      });

      await prisma.cart.create({
        data: newCart,
      });

      revalidatePath(ROUTES.PRODUCT(product.slug));

      return {
        success: true,
        message: `${product.name} added to cart`,
      };
    } else {
      // Find existing item matching productId, size, and color
      const existItem = (cart.items as CartItem[]).find(
        (x) =>
          x.productId === item.productId &&
          x.size === item.size &&
          x.color === item.color
      );

      if (existItem) {
        const newQuantity = existItem.qty + 1;

        // Validate stock before updating
        if (product.stock < newQuantity) {
          return {
            success: false,
            message: `We don't have enough stock of "${product.name}". Available stock: ${product.stock}`,
          };
        }

        (cart.items as CartItem[]).find(
          (x) =>
            x.productId === item.productId &&
            x.size === item.size &&
            x.color === item.color
        )!.qty = newQuantity;
      } else {
        // Validate stock before adding new item
        if (product.stock < item.qty) {
          return {
            success: false,
            message: `We don't have enough stock of "${product.name}". Available stock: ${product.stock}`,
          };
        }

        cart.items.push(item);
      }

      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: cart.items as Prisma.CartUpdateitemsInput[],
          ...calcPrice(cart.items as CartItem[]),
        },
      });

      revalidatePath(ROUTES.PRODUCT(product.slug));

      return {
        success: true,
        message: `${product.name} ${
          existItem ? "updated in" : "added to"
        } cart`,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function getMyCart() {
  const sessionCartId = (await cookies()).get("sessionCartId")?.value;

  if (!sessionCartId) throw new Error("Cart session not found");

  const session = await auth();
  const userId = session?.user?.id;

  const cart = await prisma.cart.findFirst({
    where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
  });

  if (!cart) return undefined;

  return convertToPlainObject({
    ...cart,
    items: cart.items as CartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
  });
}

export async function removeItemFromCart(
  productId: string,
  size?: string | null,
  color?: string | null
) {
  try {
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart session not found");

    const product = await prisma.product.findFirst({
      where: { id: productId },
    });
    if (!product) throw new Error("Product not found");

    const cart = await getMyCart();
    if (!cart) throw new Error("Cart not found!");

    // Find item matching productId, size, and color
    const existItem = (cart.items as CartItem[]).find(
      (x) =>
        x.productId === productId &&
        x.size === (size ?? null) &&
        x.color === (color ?? null)
    );
    if (!existItem) throw new Error("Item not found");

    if (existItem.qty === 1) {
      cart.items = (cart.items as CartItem[]).filter(
        (x) =>
          !(
            x.productId === productId &&
            x.size === (size ?? null) &&
            x.color === (color ?? null)
          )
      );
    } else {
      (cart.items as CartItem[]).find(
        (x) =>
          x.productId === productId &&
          x.size === (size ?? null) &&
          x.color === (color ?? null)
      )!.qty = existItem.qty - 1;
    }

    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: cart.items as Prisma.CartUpdateitemsInput[],
        ...calcPrice(cart.items as CartItem[]),
      },
    });

    revalidatePath(ROUTES.PRODUCT(product.slug));

    return {
      success: true,
      message: `${product.name} was removed from cart`,
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}
