import { describe, expect, it, vi, Mock, beforeEach } from "vitest";
import { prisma } from "@/lib/prisma";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getLatestProducts,
  getProductById,
  getProductBySlug,
  updateProduct,
} from "@/lib/actions/product.actions";
import { LATEST_PRODUCTS_LIMIT } from "@/lib/constants";
import { Decimal } from "@prisma/client/runtime/library";
import { convertToPlainObject } from "@/lib/utils";
import sampleData from "@/db/sample-data";

vi.mock("@/lib/actions/image.actions", () => ({
  deleteImages: vi.fn(),
}));

import { deleteImages } from "@/lib/actions/image.actions";

describe("Product Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getLatestProducts()", () => {
    it("should return latest products with correct limit", async () => {
      const prismaProducts = sampleData.products
        .slice(0, LATEST_PRODUCTS_LIMIT)
        .map((product) => ({
          ...product,
          id: product.slug,
          price: new Decimal(product.price),
          rating: new Decimal(product.rating),
          createdAt: new Date(),
        }));

      const expectedProducts = convertToPlainObject(prismaProducts);

      (prisma.product.findMany as Mock).mockResolvedValue(prismaProducts);

      const result = await getLatestProducts();

      expect(prisma.product.findMany as Mock).toHaveBeenCalledWith({
        take: LATEST_PRODUCTS_LIMIT,
        orderBy: {
          createdAt: "desc",
        },
      });

      expect(result).toEqual(expectedProducts);
    });

    it("should handle empty results", async () => {
      (prisma.product.findMany as Mock).mockResolvedValue([]);

      const result = await getLatestProducts();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it("should handle database errors", async () => {
      const dbError = new Error("Database connection failed");
      (prisma.product.findMany as Mock).mockRejectedValue(dbError);

      await expect(getLatestProducts()).rejects.toThrow(
        "Database connection failed"
      );
    });
  });

  describe("getProductBySlug()", () => {
    it("should return product by slug", async () => {
      const product = sampleData.products[0];
      const slug = product.slug;
      const prismaProduct = {
        ...product,
        id: product.slug,
        price: new Decimal(product.price),
        rating: new Decimal(product.rating),
        createdAt: new Date(),
      };

      (prisma.product.findFirst as Mock).mockResolvedValue(prismaProduct);

      const result = await getProductBySlug(slug);

      const expectedProduct = convertToPlainObject(prismaProduct);

      expect(result).toEqual(expectedProduct);
    });

    it("should handle database errors", async () => {
      const dbError = new Error("Database connection failed");
      (prisma.product.findFirst as Mock).mockRejectedValue(dbError);

      await expect(getProductBySlug("non-existent-slug")).rejects.toThrow(
        "Database connection failed"
      );
    });
  });

  describe("getProductById()", () => {
    it("should return product by id", async () => {
      const product = sampleData.products[0];
      const productId = product.slug;
      const prismaProduct = {
        ...product,
        id: product.slug,
        price: new Decimal(product.price),
        rating: new Decimal(product.rating),
        createdAt: new Date(),
      };
      (prisma.product.findFirst as Mock).mockResolvedValue(prismaProduct);

      const result = await getProductById(productId);

      expect(prisma.product.findFirst as Mock).toHaveBeenCalledWith({
        where: { id: productId },
      });

      const expectedProduct = convertToPlainObject(prismaProduct);

      expect(result).toEqual(expectedProduct);
    });

    it("should return null when product not found", async () => {
      (prisma.product.findFirst as Mock).mockResolvedValue(null);

      const result = await getProductById("non-existent-id");

      expect(prisma.product.findFirst as Mock).toHaveBeenCalledWith({
        where: { id: "non-existent-id" },
      });
      expect(result).toBeNull();
    });

    it("should handle database errors", async () => {
      const dbError = new Error("Database connection failed");
      (prisma.product.findFirst as Mock).mockRejectedValue(dbError);

      await expect(getProductById("some-id")).rejects.toThrow(
        "Database connection failed"
      );
    });
  });

  describe("getAllProducts()", () => {
    it("should return all products", async () => {
      const products = sampleData.products;
      const prismaProducts = products.map((product) => ({
        ...product,
        id: product.slug,
        price: new Decimal(product.price),
        rating: new Decimal(product.rating),
        createdAt: new Date(),
      }));

      const limit = 10;
      const totalCount = products.length;
      const expectedTotalPages = Math.ceil(totalCount / limit);

      (prisma.product.findMany as Mock).mockResolvedValue(prismaProducts);
      (prisma.product.count as Mock).mockResolvedValue(totalCount);

      const result = await getAllProducts({
        query: "",
        page: 1,
        limit,
        category: "",
        price: "",
        rating: "",
        sort: "",
      });

      expect(result).toEqual({
        data: prismaProducts,
        totalPages: expectedTotalPages,
      });
    });
  });

  describe("deleteProduct()", () => {
    it("should delete product", async () => {
      const product = sampleData.products[0];
      const id = "order-1";
      const prismaProduct = {
        ...product,
        id: product.slug,
        price: new Decimal(product.price),
        rating: new Decimal(product.rating),
        createdAt: new Date(),
      };

      (prisma.product.findFirst as Mock).mockResolvedValue(prismaProduct);
      (prisma.product.delete as Mock).mockResolvedValue(prismaProduct);
      (deleteImages as Mock).mockResolvedValue({
        success: true,
        message: "Image(s) deleted successfully",
      });

      const result = await deleteProduct(id);

      // Extract image keys from product images
      const imageKeys = prismaProduct.images.map((image) =>
        image.split("/").pop()
      );
      if (prismaProduct.isFeatured && prismaProduct.banner) {
        imageKeys.push(prismaProduct.banner.split("/").pop()!);
      }

      expect(deleteImages).toHaveBeenCalledWith(imageKeys);
      expect(prisma.product.delete as Mock).toHaveBeenCalledWith({
        where: { id },
      });
      expect(result).toEqual({
        success: true,
        message: "Product deleted successfully",
      });
    });

    it("should error if product not found", async () => {
      (prisma.product.findFirst as Mock).mockResolvedValue(null);

      const result = await deleteProduct("non-existent-id");

      expect(result).toEqual({
        success: false,
        message: "Product not found",
      });
    });
  });
  describe("createProduct()", () => {
    it("should create product successfully", async () => {
      const product = sampleData.products[0];
      const productData = {
        name: product.name,
        slug: product.slug,
        category: product.category,
        brand: product.brand,
        description: product.description,
        stock: product.stock,
        images: product.images,
        isFeatured: product.isFeatured,
        banner: product.banner,
        price: product.price.toString(),
      };

      (prisma.product.create as Mock).mockResolvedValue({
        ...product,
        id: product.slug,
        price: new Decimal(product.price),
        rating: new Decimal(product.rating),
        createdAt: new Date(),
      });

      const result = await createProduct(productData);

      expect(prisma.product.create as Mock).toHaveBeenCalledWith({
        data: productData,
      });
      expect(result).toEqual({
        success: true,
        message: "Product created successfully",
      });
    });

    it("should return error when validation fails", async () => {
      const invalidProduct = {
        name: "ab", // too short
        slug: "test-slug",
        category: "Test Category",
        brand: "Test Brand",
        description: "Test Description",
        stock: 10,
        images: ["image.jpg"],
        isFeatured: true,
        banner: null,
        price: "10.99",
      };

      const result = await createProduct(invalidProduct);

      expect(result.success).toBe(false);
      expect(result.message).toBeDefined();
      expect(typeof result.message).toBe("object");
      expect(result.message).toHaveProperty("fieldErrors");
      expect(prisma.product.create as Mock).not.toHaveBeenCalled();
    });
  });

  describe("updateProduct()", () => {
    it("should update product successfully", async () => {
      const product = sampleData.products[0];
      const productData = {
        id: product.slug,
        name: product.name,
        slug: product.slug,
        category: product.category,
        brand: product.brand,
        description: product.description,
        stock: product.stock,
        images: product.images,
        isFeatured: product.isFeatured,
        banner: product.banner,
        price: product.price.toString(),
      };

      const prismaProduct = {
        ...product,
        id: product.slug,
        price: new Decimal(product.price),
        rating: new Decimal(product.rating),
        createdAt: new Date(),
      };

      (prisma.product.findFirst as Mock).mockResolvedValue(prismaProduct);
      (prisma.product.update as Mock).mockResolvedValue(prismaProduct);
      (deleteImages as Mock).mockResolvedValue({
        success: true,
        message: "Image(s) deleted successfully",
      });

      const result = await updateProduct(productData);

      expect(prisma.product.findFirst as Mock).toHaveBeenCalledWith({
        where: { id: productData.id },
      });
      // Verify update is called with correct data (without id, imagesToBeDeleted, bannerToBeDeleted)
      expect(prisma.product.update as Mock).toHaveBeenCalledWith({
        where: { id: productData.id },
        data: {
          name: productData.name,
          slug: productData.slug,
          category: productData.category,
          brand: productData.brand,
          description: productData.description,
          stock: productData.stock,
          price: productData.price,
          images: productData.images,
          isFeatured: productData.isFeatured,
          banner: productData.banner,
        },
      });
      expect(result).toEqual({
        success: true,
        message: "Product updated successfully",
      });
    });

    it("should return error when product not found", async () => {
      const product = sampleData.products[0];
      const productData = {
        id: "non-existent-id",
        name: product.name,
        slug: product.slug,
        category: product.category,
        brand: product.brand,
        description: product.description,
        stock: product.stock,
        images: product.images,
        isFeatured: product.isFeatured,
        banner: product.banner,
        price: product.price.toString(),
      };

      (prisma.product.findFirst as Mock).mockResolvedValue(null);

      const result = await updateProduct(productData);

      expect(prisma.product.findFirst as Mock).toHaveBeenCalledWith({
        where: { id: productData.id },
      });
      expect(prisma.product.update as Mock).not.toHaveBeenCalled();
      expect(deleteImages).not.toHaveBeenCalled();
      expect(result.success).toBe(false);
      expect(result.message).toBeDefined();
      expect(typeof result.message).toBe("object");
      expect(result.message).toHaveProperty(
        "generalError",
        "Product not found"
      );
    });

    it("should delete removed images when updating product", async () => {
      const product = sampleData.products[0];
      const oldImages = product.images;
      const newImages = [oldImages[0]]; // Remove one image
      const productData = {
        id: product.slug,
        name: product.name,
        slug: product.slug,
        category: product.category,
        brand: product.brand,
        description: product.description,
        stock: product.stock,
        images: newImages,
        isFeatured: product.isFeatured,
        banner: product.banner,
        price: product.price.toString(),
      };

      const prismaProduct = {
        ...product,
        id: product.slug,
        price: new Decimal(product.price),
        rating: new Decimal(product.rating),
        createdAt: new Date(),
      };

      (prisma.product.findFirst as Mock).mockResolvedValue(prismaProduct);
      (prisma.product.update as Mock).mockResolvedValue(prismaProduct);
      (deleteImages as Mock).mockResolvedValue({
        success: true,
        message: "Image(s) deleted successfully",
      });

      const result = await updateProduct(productData);

      // Verify that removed image key was extracted and passed to deleteImages
      const removedImage = oldImages.find((img) => !newImages.includes(img));
      const removedImageKey = removedImage?.split("/").pop();

      expect(deleteImages).toHaveBeenCalledWith([removedImageKey]);
      expect(result).toEqual({
        success: true,
        message: "Product updated successfully",
      });
    });

    it("should delete images when imagesToBeDeleted is provided", async () => {
      const product = sampleData.products[0];
      const productData = {
        id: product.slug,
        name: product.name,
        slug: product.slug,
        category: product.category,
        brand: product.brand,
        description: product.description,
        stock: product.stock,
        images: product.images,
        isFeatured: product.isFeatured,
        banner: product.banner,
        price: product.price.toString(),
        imagesToBeDeleted: ["image-key-1", "image-key-2"],
      };

      const prismaProduct = {
        ...product,
        id: product.slug,
        price: new Decimal(product.price),
        rating: new Decimal(product.rating),
        createdAt: new Date(),
      };

      (prisma.product.findFirst as Mock).mockResolvedValue(prismaProduct);
      (prisma.product.update as Mock).mockResolvedValue(prismaProduct);
      (deleteImages as Mock).mockResolvedValue({
        success: true,
        message: "Image(s) deleted successfully",
      });

      const result = await updateProduct(productData);

      expect(deleteImages).toHaveBeenCalledWith(
        expect.arrayContaining(["image-key-1", "image-key-2"])
      );
      expect(result).toEqual({
        success: true,
        message: "Product updated successfully",
      });
    });
  });
});
