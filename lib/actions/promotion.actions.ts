"use server";

import { prisma } from "../prisma";
import { formatError } from "../utils";
import { revalidatePath } from "next/cache";
import ROUTES from "../routes";
import { convertToPlainObject } from "../utils";

export async function setPromotion(
  productId: string,
  endDate: Date,
  isEnabled: boolean = true
) {
  try {
    // Check if promotion already exists
    const existingPromotion = await prisma.promotion.findFirst();

    if (existingPromotion) {
      // Update existing promotion
      await prisma.promotion.update({
        where: { id: existingPromotion.id },
        data: {
          productId: productId,
          endDate: endDate,
          isEnabled: isEnabled,
        },
      });
    } else {
      // Create new promotion
      await prisma.promotion.create({
        data: {
          productId: productId,
          endDate: endDate,
          isEnabled: isEnabled,
        },
      });
    }

    revalidatePath(ROUTES.HOME);
    revalidatePath(ROUTES.ADMIN_PRODUCTS);
    revalidatePath(ROUTES.ADMIN_PROMOTION);

    return {
      success: true,
      message: "Promotion set successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function updatePromotionEnabled(isEnabled: boolean) {
  try {
    const promotion = await prisma.promotion.findFirst();

    if (!promotion) {
      return { success: false, message: "No promotion found" };
    }

    await prisma.promotion.update({
      where: { id: promotion.id },
      data: { isEnabled: isEnabled },
    });

    revalidatePath(ROUTES.HOME);
    revalidatePath(ROUTES.ADMIN_PROMOTION);

    return {
      success: true,
      message: `Promotion ${isEnabled ? "enabled" : "disabled"} successfully`,
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function clearPromotion() {
  try {
    await prisma.promotion.deleteMany({});

    revalidatePath(ROUTES.HOME);
    revalidatePath(ROUTES.ADMIN_PRODUCTS);
    revalidatePath(ROUTES.ADMIN_PROMOTION);

    return {
      success: true,
      message: "Promotion cleared successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function getPromotionForAdmin() {
  // Get promotion for admin (regardless of isEnabled status)
  const promotion = await prisma.promotion.findFirst({
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
    },
  });

  return convertToPlainObject(promotion);
}

export async function getPromotion() {
  // First, try to get active promotion
  const activePromotion = await prisma.promotion.findFirst({
    where: {
      endDate: {
        gte: new Date(), // Only return if promotion hasn't ended
      },
      isEnabled: true, // Only return if promotion is enabled
    },
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
    },
  });

  if (activePromotion) {
    return convertToPlainObject(activePromotion);
  }

  // Check if there's a disabled promotion - if so, don't show fallback
  const disabledPromotion = await prisma.promotion.findFirst({
    where: {
      isEnabled: false,
    },
  });

  if (disabledPromotion) {
    return null; // Don't show anything if promotion is explicitly disabled
  }

  // Fallback: return first product with a fake promotion date (7 days from now)
  const firstProduct = await prisma.product.findFirst({
    orderBy: {
      createdAt: "asc",
    },
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

  if (!firstProduct) {
    return null;
  }

  // Create a fake promotion object with end date 7 days from now
  const fallbackEndDate = new Date();
  fallbackEndDate.setDate(fallbackEndDate.getDate() + 7);
  fallbackEndDate.setHours(23, 59, 59, 999);

  return convertToPlainObject({
    id: "fallback-promotion",
    productId: firstProduct.id,
    endDate: fallbackEndDate,
    isEnabled: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    product: firstProduct,
  });
}
