"use server";

import { prisma } from "@/lib/prisma";
import { convertToPlainObject, formatError } from "../utils";
import { revalidatePath } from "next/cache";
import ROUTES from "../routes";
import { insertCategorySchema, updateCategorySchema } from "../validators";
import { z } from "zod";

export async function getAllCategories() {
  const data = await prisma.category.findMany({
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return convertToPlainObject(data);
}

export async function getCategoriesWithProducts() {
  const data = await prisma.category.findMany({
    where: {
      products: {
        some: {},
      },
    },
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return convertToPlainObject(data);
}

export async function getCategoryById(id: string) {
  const data = await prisma.category.findFirst({
    where: { id },
  });

  return convertToPlainObject(data);
}

export async function getCategoryBySlug(slug: string) {
  const data = await prisma.category.findFirst({
    where: { slug },
  });

  return convertToPlainObject(data);
}

export async function createCategory(
  data: z.infer<typeof insertCategorySchema>
) {
  try {
    const category = insertCategorySchema.parse(data);
    await prisma.category.create({ data: category });

    revalidatePath(ROUTES.ADMIN_PRODUCTS);
    revalidatePath(ROUTES.HOME);

    return {
      success: true,
      message: "Category created successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function updateCategory(
  data: z.infer<typeof updateCategorySchema>
) {
  try {
    const category = updateCategorySchema.parse(data);

    const categoryExists = await prisma.category.findFirst({
      where: { id: category.id },
    });

    if (!categoryExists) {
      throw new Error("Category not found");
    }

    // Ensure icon is null if empty string
    const iconValue = category.icon === "" ? null : category.icon;

    const updatePayload = {
      name: category.name,
      slug: category.slug,
      icon: iconValue,
    };

    await prisma.category.update({
      where: { id: category.id },
      data: updatePayload,
    });

    revalidatePath(ROUTES.ADMIN_PRODUCTS);
    revalidatePath(ROUTES.ADMIN_CATEGORIES);
    revalidatePath(ROUTES.HOME);

    return {
      success: true,
      message: "Category updated successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function deleteCategory(id: string) {
  try {
    const category = await prisma.category.findFirst({
      where: { id },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    if (!category) {
      return { success: false, message: "Category not found" };
    }

    if (category._count.products > 0) {
      return {
        success: false,
        message: `Cannot delete category. It has ${category._count.products} product(s) associated with it.`,
      };
    }

    await prisma.category.delete({
      where: { id },
    });

    revalidatePath(ROUTES.ADMIN_PRODUCTS);
    revalidatePath(ROUTES.HOME);

    return {
      success: true,
      message: "Category deleted successfully",
    };
  } catch (error) {
    const formattedError = formatError(error);
    let errorMessage: string;

    if ("generalError" in formattedError) {
      errorMessage = formattedError.generalError;
    } else if ("prismaError" in formattedError) {
      errorMessage = formattedError.prismaError.message;
    } else if ("message" in formattedError) {
      errorMessage = formattedError.message;
    } else if ("fieldErrors" in formattedError && formattedError.fieldErrors) {
      errorMessage = Object.values(formattedError.fieldErrors)
        .flat()
        .join(", ");
    } else {
      errorMessage = "An error occurred";
    }

    return { success: false, message: errorMessage };
  }
}
