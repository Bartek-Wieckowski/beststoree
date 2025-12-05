"use server";

import { prisma } from "@/lib/prisma";
import {
  convertToPlainObject,
  formatError,
  formatErrorMessage,
} from "../utils";
import { revalidatePath } from "next/cache";
import ROUTES from "../routes";
import { insertCouponSchema, updateCouponSchema } from "../validators";
import { Coupon } from "@/types";
import { z } from "zod";

export async function getAllCoupons() {
  const data = await prisma.coupon.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return convertToPlainObject(data);
}

export async function getCouponById(id: string) {
  const data = await prisma.coupon.findFirst({
    where: { id },
  });

  if (!data) return null;

  return convertToPlainObject(data) as unknown as Coupon;
}

export async function getCouponByCode(code: string) {
  const data = await prisma.coupon.findFirst({
    where: { code: code.toUpperCase() },
  });

  return convertToPlainObject(data);
}

export async function validateCoupon(code: string) {
  try {
    const coupon = await prisma.coupon.findFirst({
      where: { code: code.toUpperCase() },
    });

    if (!coupon) {
      return {
        success: false,
        message: "Invalid or expired coupon code",
        coupon: null,
      };
    }

    if (!coupon.isEnabled) {
      return {
        success: false,
        message: "This coupon is not active",
        coupon: null,
      };
    }

    const now = new Date();
    if (now < coupon.startDate || now > coupon.endDate) {
      return {
        success: false,
        message: "This coupon has expired",
        coupon: null,
      };
    }

    return {
      success: true,
      message: "Coupon is valid",
      coupon: convertToPlainObject(coupon),
    };
  } catch (error) {
    const formattedError = formatError(error);
    return {
      success: false,
      message: formatErrorMessage(formattedError),
      coupon: null,
    };
  }
}

export async function createCoupon(data: z.infer<typeof insertCouponSchema>) {
  try {
    const coupon = insertCouponSchema.parse(data);

    // Check if code already exists
    const existingCoupon = await prisma.coupon.findFirst({
      where: { code: coupon.code.toUpperCase() },
    });

    if (existingCoupon) {
      return {
        success: false,
        message: "Coupon code already exists",
      };
    }

    await prisma.coupon.create({
      data: {
        ...coupon,
        code: coupon.code.toUpperCase(),
      },
    });

    revalidatePath(ROUTES.ADMIN_COUPONS);

    return {
      success: true,
      message: "Coupon created successfully",
    };
  } catch (error) {
    const formattedError = formatError(error);
    return { success: false, message: formatErrorMessage(formattedError) };
  }
}

export async function updateCoupon(data: z.infer<typeof updateCouponSchema>) {
  try {
    const coupon = updateCouponSchema.parse(data);

    const couponExists = await prisma.coupon.findFirst({
      where: { id: coupon.id },
    });

    if (!couponExists) {
      throw new Error("Coupon not found");
    }

    // Check if code already exists (excluding current coupon)
    const existingCoupon = await prisma.coupon.findFirst({
      where: {
        code: coupon.code.toUpperCase(),
        NOT: { id: coupon.id },
      },
    });

    if (existingCoupon) {
      return {
        success: false,
        message: "Coupon code already exists",
      };
    }

    await prisma.coupon.update({
      where: { id: coupon.id },
      data: {
        code: coupon.code.toUpperCase(),
        discountPercentage: coupon.discountPercentage,
        startDate: coupon.startDate,
        endDate: coupon.endDate,
        isEnabled: coupon.isEnabled,
      },
    });

    revalidatePath(ROUTES.ADMIN_COUPONS);
    revalidatePath(ROUTES.CART);

    return {
      success: true,
      message: "Coupon updated successfully",
    };
  } catch (error) {
    const formattedError = formatError(error);
    return { success: false, message: formatErrorMessage(formattedError) };
  }
}

export async function deleteCoupon(id: string) {
  try {
    const coupon = await prisma.coupon.findFirst({
      where: { id },
    });

    if (!coupon) {
      return { success: false, message: "Coupon not found" };
    }

    await prisma.coupon.delete({
      where: { id },
    });

    revalidatePath(ROUTES.ADMIN_COUPONS);
    revalidatePath(ROUTES.CART);

    return {
      success: true,
      message: "Coupon deleted successfully",
    };
  } catch (error) {
    const formattedError = formatError(error);
    return { success: false, message: formatErrorMessage(formattedError) };
  }
}
