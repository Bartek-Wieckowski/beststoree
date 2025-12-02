import { describe, expect, it, vi, Mock, beforeEach } from "vitest";
import { prisma } from "@/lib/prisma";
import {
  getAllCategories,
  getCategoryById,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/actions/category.actions";
import { convertToPlainObject } from "@/lib/utils";

describe("Category Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAllCategories()", () => {
    it("should return all categories with product counts", async () => {
      const mockCategories = [
        {
          id: "cat-1",
          name: "T-shirts",
          slug: "t-shirts",
          icon: "Shirt",
          createdAt: new Date(),
          updatedAt: new Date(),
          _count: {
            products: 5,
          },
        },
        {
          id: "cat-2",
          name: "Shoes",
          slug: "shoes",
          icon: "Footprints",
          createdAt: new Date(),
          updatedAt: new Date(),
          _count: {
            products: 3,
          },
        },
      ];

      const expectedCategories = convertToPlainObject(mockCategories);

      (prisma.category.findMany as Mock).mockResolvedValue(mockCategories);

      const result = await getAllCategories();

      expect(prisma.category.findMany as Mock).toHaveBeenCalledWith({
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

      expect(result).toEqual(expectedCategories);
    });

    it("should handle empty results", async () => {
      (prisma.category.findMany as Mock).mockResolvedValue([]);

      const result = await getAllCategories();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it("should handle database errors", async () => {
      const dbError = new Error("Database connection failed");
      (prisma.category.findMany as Mock).mockRejectedValue(dbError);

      await expect(getAllCategories()).rejects.toThrow(
        "Database connection failed"
      );
    });
  });

  describe("getCategoryById()", () => {
    it("should return category by id", async () => {
      const category = {
        id: "cat-1",
        name: "T-shirts",
        slug: "t-shirts",
        icon: "Shirt",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.category.findFirst as Mock).mockResolvedValue(category);

      const result = await getCategoryById("cat-1");

      const expectedCategory = convertToPlainObject(category);

      expect(prisma.category.findFirst as Mock).toHaveBeenCalledWith({
        where: { id: "cat-1" },
      });

      expect(result).toEqual(expectedCategory);
    });

    it("should return null when category not found", async () => {
      (prisma.category.findFirst as Mock).mockResolvedValue(null);

      const result = await getCategoryById("non-existent");

      expect(result).toBeNull();
    });
  });

  describe("getCategoryBySlug()", () => {
    it("should return category by slug", async () => {
      const category = {
        id: "cat-1",
        name: "T-shirts",
        slug: "t-shirts",
        icon: "Shirt",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.category.findFirst as Mock).mockResolvedValue(category);

      const result = await getCategoryBySlug("t-shirts");

      const expectedCategory = convertToPlainObject(category);

      expect(prisma.category.findFirst as Mock).toHaveBeenCalledWith({
        where: { slug: "t-shirts" },
      });

      expect(result).toEqual(expectedCategory);
    });
  });

  describe("createCategory()", () => {
    it("should create a category successfully", async () => {
      const categoryData = {
        name: "T-shirts",
        slug: "t-shirts",
        icon: "Shirt",
      };

      (prisma.category.create as Mock).mockResolvedValue({
        id: "cat-1",
        ...categoryData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await createCategory(categoryData);

      expect(prisma.category.create as Mock).toHaveBeenCalledWith({
        data: categoryData,
      });

      expect(result.success).toBe(true);
      expect(result.message).toBe("Category created successfully");
    });

    it("should handle validation errors", async () => {
      const invalidData = {
        name: "T", // Too short
        slug: "t-shirts",
        icon: "Shirt",
      };

      const result = await createCategory(invalidData);

      expect(result.success).toBe(false);
      expect(result.message).toContain("at least 3 characters");
    });

    it("should handle database errors", async () => {
      const categoryData = {
        name: "T-shirts",
        slug: "t-shirts",
        icon: "Shirt",
      };

      const dbError = new Error("Unique constraint violation");
      (prisma.category.create as Mock).mockRejectedValue(dbError);

      const result = await createCategory(categoryData);

      expect(result.success).toBe(false);
      expect(result.message).toContain("Unique constraint violation");
    });
  });

  describe("updateCategory()", () => {
    it("should update a category successfully", async () => {
      const categoryData = {
        id: "cat-1",
        name: "T-Shirts",
        slug: "t-shirts",
        icon: "Shirt",
      };

      const existingCategory = {
        id: "cat-1",
        name: "T-shirts",
        slug: "t-shirts",
        icon: "Shirt",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.category.findFirst as Mock).mockResolvedValue(existingCategory);
      (prisma.category.update as Mock).mockResolvedValue({
        ...existingCategory,
        ...categoryData,
      });

      const result = await updateCategory(categoryData);

      expect(prisma.category.findFirst as Mock).toHaveBeenCalledWith({
        where: { id: "cat-1" },
      });

      expect(prisma.category.update as Mock).toHaveBeenCalledWith({
        where: { id: "cat-1" },
        data: {
          name: categoryData.name,
          slug: categoryData.slug,
          icon: categoryData.icon,
        },
      });

      expect(result.success).toBe(true);
      expect(result.message).toBe("Category updated successfully");
    });

    it("should return error when category not found", async () => {
      const categoryData = {
        id: "non-existent",
        name: "T-Shirts",
        slug: "t-shirts",
        icon: "Shirt",
      };

      (prisma.category.findFirst as Mock).mockResolvedValue(null);

      const result = await updateCategory(categoryData);

      expect(result.success).toBe(false);
      expect(result.message).toContain("Category not found");
    });
  });

  describe("deleteCategory()", () => {
    it("should delete a category successfully when it has no products", async () => {
      const category = {
        id: "cat-1",
        name: "T-shirts",
        slug: "t-shirts",
        icon: "Shirt",
        createdAt: new Date(),
        updatedAt: new Date(),
        _count: {
          products: 0,
        },
      };

      (prisma.category.findFirst as Mock).mockResolvedValue(category);
      (prisma.category.delete as Mock).mockResolvedValue(category);

      const result = await deleteCategory("cat-1");

      expect(prisma.category.findFirst as Mock).toHaveBeenCalledWith({
        where: { id: "cat-1" },
        include: {
          _count: {
            select: {
              products: true,
            },
          },
        },
      });

      expect(prisma.category.delete as Mock).toHaveBeenCalledWith({
        where: { id: "cat-1" },
      });

      expect(result.success).toBe(true);
      expect(result.message).toBe("Category deleted successfully");
    });

    it("should return error when category has products", async () => {
      const category = {
        id: "cat-1",
        name: "T-shirts",
        slug: "t-shirts",
        icon: "Shirt",
        createdAt: new Date(),
        updatedAt: new Date(),
        _count: {
          products: 5,
        },
      };

      (prisma.category.findFirst as Mock).mockResolvedValue(category);

      const result = await deleteCategory("cat-1");

      expect(result.success).toBe(false);
      expect(result.message).toContain("Cannot delete category");
      expect(result.message).toContain("5 product(s)");
    });

    it("should return error when category not found", async () => {
      (prisma.category.findFirst as Mock).mockResolvedValue(null);

      const result = await deleteCategory("non-existent");

      expect(result.success).toBe(false);
      expect(result.message).toBe("Category not found");
    });
  });
});

