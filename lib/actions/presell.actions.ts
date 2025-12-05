"use server";

import { prisma } from "../prisma";
import {
  formatError,
  formatErrorMessage,
  convertToPlainObject,
} from "../utils";
import { revalidatePath } from "next/cache";
import ROUTES from "../routes";
import { insertPresellSchema } from "../validators";

export async function setPresell(
  categoryId: string,
  productId: string,
  isEnabled: boolean = true
) {
  try {
    const data = insertPresellSchema.parse({
      categoryId,
      productId,
      isEnabled,
    });

    // Check if presell already exists for this category
    const existingPresell = await prisma.presell.findUnique({
      where: { categoryId },
    });

    if (existingPresell) {
      // Update existing presell
      await prisma.presell.update({
        where: { categoryId },
        data: {
          productId: data.productId,
          isEnabled: data.isEnabled,
        },
      });
    } else {
      // Create new presell
      await prisma.presell.create({
        data: {
          categoryId: data.categoryId,
          productId: data.productId,
          isEnabled: data.isEnabled,
        },
      });
    }

    revalidatePath(ROUTES.CART);
    revalidatePath(ROUTES.ADMIN_PRESELL);

    return {
      success: true,
      message: "Presell set successfully",
    };
  } catch (error) {
    const formattedError = formatError(error);
    return { success: false, message: formatErrorMessage(formattedError) };
  }
}

export async function updatePresellEnabled(isEnabled: boolean) {
  try {
    const presell = await prisma.presell.findFirst();

    if (!presell) {
      return { success: false, message: "No presell found" };
    }

    await prisma.presell.update({
      where: { id: presell.id },
      data: { isEnabled: isEnabled },
    });

    revalidatePath(ROUTES.CART);
    revalidatePath(ROUTES.ADMIN_PRESELL);

    return {
      success: true,
      message: `Presell ${isEnabled ? "enabled" : "disabled"} successfully`,
    };
  } catch (error) {
    const formattedError = formatError(error);
    return { success: false, message: formatErrorMessage(formattedError) };
  }
}

export async function clearPresell(categoryId: string) {
  try {
    await prisma.presell.deleteMany({
      where: { categoryId },
    });

    revalidatePath(ROUTES.CART);
    revalidatePath(ROUTES.ADMIN_PRESELL);

    return {
      success: true,
      message: "Presell cleared successfully",
    };
  } catch (error) {
    const formattedError = formatError(error);
    return { success: false, message: formatErrorMessage(formattedError) };
  }
}

export async function getAllPresellsForAdmin() {
  const presells = await prisma.presell.findMany({
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      product: {
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      },
    },
    orderBy: {
      category: {
        name: "asc",
      },
    },
  });

  return convertToPlainObject(presells);
}

export async function getPresellForCategory(categoryId: string) {
  const presell = await prisma.presell.findUnique({
    where: { categoryId },
    include: {
      product: {
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      },
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });

  if (!presell || !presell.isEnabled) {
    return null;
  }

  // Check if product has stock > 0
  if (presell.product.stock <= 0) {
    return null;
  }

  return convertToPlainObject(presell);
}

export async function getPresellForCart(
  cartItems: Array<{ productId: string; price: string | number }>
) {
  if (!cartItems || cartItems.length === 0) {
    return null;
  }

  // Find the most expensive product
  const mostExpensiveItem = cartItems.reduce((max, item) => {
    const itemPrice = Number(item.price);
    const maxPrice = Number(max.price);
    return itemPrice > maxPrice ? item : max;
  });

  // Get product with category
  const product = await prisma.product.findUnique({
    where: { id: mostExpensiveItem.productId },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });

  if (!product || !product.categoryId) {
    return null;
  }

  // Get presell for this category
  const presell = await getPresellForCategory(product.categoryId);

  if (!presell) {
    return null;
  }

  // Check if presell product is already in cart
  const isPresellInCart = cartItems.some(
    (item) => item.productId === presell.productId
  );

  // If presell product is already in cart, don't show it
  if (isPresellInCart) {
    return null;
  }

  return presell;
}
