"use server";

import { auth } from "@/auth";
import { CartItem } from "@/types";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { prisma } from "../prisma";
import ROUTES from "../routes";
import {
  convertToPlainObject,
  formatError,
  formatErrorMessage,
  round2,
} from "../utils";
import { cartItemSchema, insertCartSchema } from "../validators";
import { Prisma } from "@prisma/client";
import { validateCoupon } from "./coupon.actions";

const calcPrice = (items: CartItem[], couponDiscountPercentage?: number) => {
  const itemsPrice = round2(
      items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0)
    ),
    discountAmount = couponDiscountPercentage
      ? round2((itemsPrice * couponDiscountPercentage) / 100)
      : 0,
    itemsPriceAfterDiscount = round2(itemsPrice - discountAmount),
    shippingPrice = round2(itemsPriceAfterDiscount > 100 ? 0 : 10),
    taxPrice = round2(0.15 * itemsPriceAfterDiscount),
    totalPrice = round2(itemsPriceAfterDiscount + taxPrice + shippingPrice);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
    discountAmount: discountAmount.toFixed(2),
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

      const prices = calcPrice([item]);
      const newCart = insertCartSchema.parse({
        userId: userId,
        items: [item],
        sessionCartId: sessionCartId,
        itemsPrice: prices.itemsPrice,
        shippingPrice: prices.shippingPrice,
        taxPrice: prices.taxPrice,
        totalPrice: prices.totalPrice,
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
      // Check if cart was cleared (empty items but coupon exists) - remove coupon
      const wasCartCleared =
        (cart.items as CartItem[]).length === 0 && cart.couponCode;

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

      // Get coupon discount if coupon code exists
      // If cart was cleared, don't preserve coupon
      let couponDiscount = 0;
      let couponCodeToUse = null;

      if (cart.couponCode && !wasCartCleared) {
        const couponResult = await validateCoupon(cart.couponCode);
        if (couponResult.success && couponResult.coupon) {
          couponDiscount = Number(couponResult.coupon.discountPercentage);
          couponCodeToUse = cart.couponCode;
        }
      }

      const prices = calcPrice(cart.items as CartItem[], couponDiscount);

      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: cart.items as Prisma.CartUpdateitemsInput[],
          itemsPrice: prices.itemsPrice,
          shippingPrice: prices.shippingPrice,
          taxPrice: prices.taxPrice,
          totalPrice: prices.totalPrice,
          couponCode: couponCodeToUse, // Only preserve coupon if cart has items
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
    const formattedError = formatError(error);
    return {
      success: false,
      message: formatErrorMessage(formattedError),
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

  // Recalculate prices with coupon if exists
  let couponDiscount = 0;
  if (cart.couponCode) {
    const couponResult = await validateCoupon(cart.couponCode);
    if (couponResult.success && couponResult.coupon) {
      couponDiscount = Number(couponResult.coupon.discountPercentage);
    }
  }

  const prices = calcPrice(cart.items as CartItem[], couponDiscount);

  return convertToPlainObject({
    ...cart,
    items: cart.items as CartItem[],
    itemsPrice: prices.itemsPrice, // Original price before discount
    totalPrice: prices.totalPrice,
    shippingPrice: prices.shippingPrice,
    taxPrice: prices.taxPrice,
    couponCode: cart.couponCode,
    discountAmount: prices.discountAmount, // Discount amount from coupon
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

    // Get coupon discount if coupon code exists
    let couponDiscount = 0;
    if (cart.couponCode) {
      const couponResult = await validateCoupon(cart.couponCode);
      if (couponResult.success && couponResult.coupon) {
        couponDiscount = Number(couponResult.coupon.discountPercentage);
      }
    }

    const prices = calcPrice(cart.items as CartItem[], couponDiscount);

    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: cart.items as Prisma.CartUpdateitemsInput[],
        itemsPrice: prices.itemsPrice,
        shippingPrice: prices.shippingPrice,
        taxPrice: prices.taxPrice,
        totalPrice: prices.totalPrice,
        couponCode: cart.couponCode, // Preserve coupon code
      },
    });

    revalidatePath(ROUTES.PRODUCT(product.slug));
    revalidatePath(ROUTES.CART);

    return {
      success: true,
      message: `${product.name} was removed from cart`,
    };
  } catch (error) {
    const formattedError = formatError(error);
    return {
      success: false,
      message: formatErrorMessage(formattedError),
    };
  }
}

export async function clearCart() {
  try {
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart session not found");

    const session = await auth();
    const userId = session?.user?.id;

    const cart = await prisma.cart.findFirst({
      where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
    });

    if (!cart) throw new Error("Cart not found!");

    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: [],
        couponCode: null,
        itemsPrice: "0.00",
        shippingPrice: "0.00",
        taxPrice: "0.00",
        totalPrice: "0.00",
      },
    });

    revalidatePath(ROUTES.CART);

    return {
      success: true,
      message: "Cart cleared successfully",
    };
  } catch (error) {
    const formattedError = formatError(error);
    return {
      success: false,
      message: formatErrorMessage(formattedError),
    };
  }
}

export async function applyCoupon(code: string) {
  try {
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart session not found");

    const session = await auth();
    const userId = session?.user?.id;

    const cart = await prisma.cart.findFirst({
      where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
    });

    if (!cart) {
      return {
        success: false,
        message: "Cart not found",
      };
    }

    const couponResult = await validateCoupon(code);

    if (!couponResult.success || !couponResult.coupon) {
      return {
        success: false,
        message: couponResult.message,
      };
    }

    const couponDiscount = Number(couponResult.coupon.discountPercentage);
    const prices = calcPrice(cart.items as CartItem[], couponDiscount);

    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        couponCode: code.toUpperCase(),
        itemsPrice: prices.itemsPrice,
        shippingPrice: prices.shippingPrice,
        taxPrice: prices.taxPrice,
        totalPrice: prices.totalPrice,
      },
    });

    revalidatePath(ROUTES.CART);

    return {
      success: true,
      message: "Coupon applied successfully",
    };
  } catch (error) {
    const formattedError = formatError(error);
    return {
      success: false,
      message: formatErrorMessage(formattedError),
    };
  }
}

export async function removeCoupon() {
  try {
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart session not found");

    const session = await auth();
    const userId = session?.user?.id;

    const cart = await prisma.cart.findFirst({
      where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
    });

    if (!cart) {
      return {
        success: false,
        message: "Cart not found",
      };
    }

    const prices = calcPrice(cart.items as CartItem[]);

    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        couponCode: null,
        itemsPrice: prices.itemsPrice,
        shippingPrice: prices.shippingPrice,
        taxPrice: prices.taxPrice,
        totalPrice: prices.totalPrice,
      },
    });

    revalidatePath(ROUTES.CART);

    return {
      success: true,
      message: "Coupon removed",
    };
  } catch (error) {
    const formattedError = formatError(error);
    return {
      success: false,
      message: formatErrorMessage(formattedError),
    };
  }
}
