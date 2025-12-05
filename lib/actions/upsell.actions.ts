"use server";

import { prisma } from "../prisma";
import {
  formatError,
  formatErrorMessage,
  convertToPlainObject,
} from "../utils";
import { revalidatePath } from "next/cache";
import ROUTES from "../routes";
import { insertUpsellSchema } from "../validators";

export async function setUpsell(productId: string, isEnabled: boolean = true) {
  try {
    const data = insertUpsellSchema.parse({
      productId,
      isEnabled,
    });

    // Check if upsell already exists
    const existingUpsell = await prisma.upsell.findFirst();

    if (existingUpsell) {
      // Update existing upsell
      await prisma.upsell.update({
        where: { id: existingUpsell.id },
        data: {
          productId: data.productId,
          isEnabled: data.isEnabled,
        },
      });
    } else {
      // Create new upsell
      await prisma.upsell.create({
        data: {
          productId: data.productId,
          isEnabled: data.isEnabled,
        },
      });
    }

    revalidatePath(ROUTES.PLACE_ORDER);
    revalidatePath(ROUTES.ADMIN_UPSELL);

    return {
      success: true,
      message: "Upsell set successfully",
    };
  } catch (error) {
    const formattedError = formatError(error);
    return { success: false, message: formatErrorMessage(formattedError) };
  }
}

export async function updateUpsellEnabled(isEnabled: boolean) {
  try {
    const upsell = await prisma.upsell.findFirst();

    if (!upsell) {
      return { success: false, message: "No upsell found" };
    }

    await prisma.upsell.update({
      where: { id: upsell.id },
      data: { isEnabled: isEnabled },
    });

    revalidatePath(ROUTES.PLACE_ORDER);
    revalidatePath(ROUTES.ADMIN_UPSELL);

    return {
      success: true,
      message: `Upsell ${isEnabled ? "enabled" : "disabled"} successfully`,
    };
  } catch (error) {
    const formattedError = formatError(error);
    return { success: false, message: formatErrorMessage(formattedError) };
  }
}

export async function clearUpsell() {
  try {
    await prisma.upsell.deleteMany({});

    revalidatePath(ROUTES.PLACE_ORDER);
    revalidatePath(ROUTES.ADMIN_UPSELL);

    return {
      success: true,
      message: "Upsell cleared successfully",
    };
  } catch (error) {
    const formattedError = formatError(error);
    return { success: false, message: formatErrorMessage(formattedError) };
  }
}

export async function getUpsellForAdmin() {
  const upsell = await prisma.upsell.findFirst({
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

  return convertToPlainObject(upsell);
}

export async function getUpsell() {
  const upsell = await prisma.upsell.findFirst({
    where: {
      isEnabled: true,
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

  if (!upsell) {
    return null;
  }

  // Check if product has stock > 0
  if (upsell.product.stock <= 0) {
    return null;
  }

  return convertToPlainObject(upsell);
}
