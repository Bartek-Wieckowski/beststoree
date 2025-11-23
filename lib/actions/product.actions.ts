"use server";

import { prisma } from "../prisma";
import { convertToPlainObject, formatError } from "../utils";
import { LATEST_PRODUCTS_LIMIT, PAGE_SIZE } from "../constants";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import ROUTES from "../routes";
import { insertProductSchema, updateProductSchema } from "../validators";
import { z } from "zod";
import { deleteImages } from "./image.actions";

export async function getLatestProducts() {
  const data = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: {
      createdAt: "desc",
    },
  });

  return convertToPlainObject(data);
}

export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findFirst({
    where: { slug },
  });

  return convertToPlainObject(product);
}

export async function getProductById(productId: string) {
  const data = await prisma.product.findFirst({
    where: { id: productId },
  });

  return convertToPlainObject(data);
}

export async function getAllProducts({
  query,
  limit = PAGE_SIZE,
  page,
  category,
  price,
  rating,
  sort,
}: {
  query: string;
  limit?: number;
  page: number;
  category?: string;
  price?: string;
  rating?: string;
  sort?: string;
}) {
  // Query filter
  const queryFilter: Prisma.ProductWhereInput =
    query && query !== "all"
      ? {
          name: {
            contains: query,
            mode: "insensitive",
          } as Prisma.StringFilter,
        }
      : {};

  // Category filter
  const categoryFilter = category && category !== "all" ? { category } : {};

  // Price filter
  const priceFilter: Prisma.ProductWhereInput =
    price && price !== "all"
      ? {
          price: {
            gte: Number(price.split("-")[0]),
            lte: Number(price.split("-")[1]),
          },
        }
      : {};

  // Rating filter
  const ratingFilter =
    rating && rating !== "all"
      ? {
          rating: {
            gte: Number(rating),
          },
        }
      : {};

  const data = await prisma.product.findMany({
    where: {
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    },
    orderBy:
      sort === "lowest"
        ? { price: "asc" }
        : sort === "highest"
        ? { price: "desc" }
        : sort === "rating"
        ? { rating: "desc" }
        : { createdAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
  });

  const dataCount = await prisma.product.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

export async function deleteProduct(id: string) {
  try {
    const productExists = await prisma.product.findFirst({
      where: { id },
    });

    if (!productExists) throw new Error("Product not found");
    const imagesToBeDeleted = [...productExists.images];

    if (productExists.isFeatured && productExists.banner) {
      imagesToBeDeleted.push(productExists.banner);
    }
    const imageKeys = imagesToBeDeleted.map((image) => image.split("/").pop());

    await deleteImages(imageKeys as string[]);

    await prisma.product.delete({ where: { id } });

    revalidatePath("/admin/products");
    return { success: true, message: "Product deleted successfully" };
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

export async function createProduct(data: z.infer<typeof insertProductSchema>) {
  try {
    const product = insertProductSchema.parse(data);
    await prisma.product.create({ data: product });

    revalidatePath(ROUTES.ADMIN_PRODUCTS);

    return {
      success: true,
      message: "Product created successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function updateProduct(data: z.infer<typeof updateProductSchema>) {
  try {
    const product = updateProductSchema.parse(data);
    const productExists = await prisma.product.findFirst({
      where: { id: product.id },
    });

    if (!productExists) throw new Error("Product not found");

    // Find images that were removed (exist in old but not in new)
    const oldImages = productExists.images;
    const newImages = product.images;
    const removedImages = oldImages.filter(
      (oldImage) => !newImages.includes(oldImage)
    );

    // Also check if banner was removed
    const bannerRemoved =
      productExists.banner && productExists.banner !== product.banner;

    // Collect all images to be deleted
    const imagesToDelete: string[] = [];

    // Add explicitly marked images for deletion
    if (product.imagesToBeDeleted && product.imagesToBeDeleted.length > 0) {
      imagesToDelete.push(...product.imagesToBeDeleted);
    }

    // Add removed images (extract keys from URLs)
    if (removedImages.length > 0) {
      const removedImageKeys = removedImages.map((image) =>
        image.split("/").pop()
      );
      imagesToDelete.push(...(removedImageKeys as string[]));
    }

    // Add removed banner if it exists or was explicitly marked for deletion
    if (bannerRemoved && productExists.banner) {
      const bannerKey = productExists.banner.split("/").pop();
      if (bannerKey) {
        imagesToDelete.push(bannerKey);
      }
    } else if (product.bannerToBeDeleted) {
      imagesToDelete.push(product.bannerToBeDeleted);
    }

    // Remove duplicates
    const uniqueImagesToDelete = [...new Set(imagesToDelete)];

    // Delete images from uploadthing
    if (uniqueImagesToDelete.length > 0) {
      await deleteImages(uniqueImagesToDelete);
    }

    // Update product in database
    await prisma.product.update({
      where: { id: product.id },
      data: {
        name: product.name,
        slug: product.slug,
        category: product.category,
        brand: product.brand,
        description: product.description,
        stock: product.stock,
        price: product.price,
        images: product.images,
        isFeatured: product.isFeatured,
        banner: product.banner,
      },
    });

    revalidatePath(ROUTES.ADMIN_PRODUCTS);

    return {
      success: true,
      message: "Product updated successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function getAllCategories() {
  const data = await prisma.product.groupBy({
    by: ["category"],
    _count: true,
  });

  return data;
}
