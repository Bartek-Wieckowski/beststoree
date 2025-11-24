import { describe, expect, it, vi, Mock, beforeEach } from "vitest";
import { prisma } from "@/lib/prisma";
import {
  createUpdateReview,
  getReviews,
  getReviewByProductId,
} from "@/lib/actions/review.actions";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { Session } from "next-auth";
import sampleData from "@/db/sample-data";
import { Decimal } from "@prisma/client/runtime/library";
import { z } from "zod";
import { insertReviewSchema } from "@/lib/validators";

type ReviewInput = Omit<z.infer<typeof insertReviewSchema>, "userId">;

describe("Review Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createUpdateReview()", () => {
    it("should create a new review successfully", async () => {
      const product = sampleData.products[0];
      const mockSession = {
        user: { id: "user-123" },
      } as Session;

      const reviewData: ReviewInput = {
        title: "Great product!",
        description: "This is an excellent product with great quality.",
        productId: product.slug,
        rating: 5,
      };

      const mockProduct = {
        ...product,
        id: product.slug,
        price: new Decimal(product.price),
        rating: new Decimal(product.rating),
        slug: product.slug,
      };

      const mockReview = {
        id: "review-1",
        ...reviewData,
        userId: "user-123",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (auth as Mock).mockResolvedValue(mockSession);
      (prisma.product.findFirst as Mock).mockResolvedValue(mockProduct);
      (prisma.review.findFirst as Mock).mockResolvedValue(null);
      (prisma.$transaction as Mock).mockImplementation(async (callback) => {
        const tx = {
          review: {
            create: vi.fn().mockResolvedValue(mockReview),
            aggregate: vi.fn().mockResolvedValue({
              _avg: { rating: 5 },
            }),
            count: vi.fn().mockResolvedValue(1),
          },
          product: {
            update: vi.fn().mockResolvedValue(mockProduct),
          },
        };
        return callback(tx);
      });

      const result = await createUpdateReview(
        reviewData as z.infer<typeof insertReviewSchema>
      );

      expect(auth).toHaveBeenCalled();
      expect(prisma.product.findFirst).toHaveBeenCalledWith({
        where: { id: reviewData.productId },
      });
      expect(result).toEqual({
        success: true,
        message: "Review Updated Successfully",
      });
      expect(revalidatePath).toHaveBeenCalledWith(`/product/${product.slug}`);
    });

    it("should update an existing review successfully", async () => {
      const product = sampleData.products[0];
      const mockSession = {
        user: { id: "user-123" },
      } as Session;

      const reviewData: ReviewInput = {
        title: "Updated review title",
        description: "Updated review description",
        productId: product.slug,
        rating: 4,
      };

      const mockProduct = {
        ...product,
        id: product.slug,
        price: new Decimal(product.price),
        rating: new Decimal(product.rating),
        slug: product.slug,
      };

      const existingReview = {
        id: "review-1",
        title: "Old title",
        description: "Old description",
        productId: product.slug,
        userId: "user-123",
        rating: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedReview = {
        ...existingReview,
        ...reviewData,
      };

      (auth as Mock).mockResolvedValue(mockSession);
      (prisma.product.findFirst as Mock).mockResolvedValue(mockProduct);
      (prisma.review.findFirst as Mock).mockResolvedValue(existingReview);
      (prisma.$transaction as Mock).mockImplementation(async (callback) => {
        const tx = {
          review: {
            update: vi.fn().mockResolvedValue(updatedReview),
            aggregate: vi.fn().mockResolvedValue({
              _avg: { rating: 4 },
            }),
            count: vi.fn().mockResolvedValue(1),
          },
          product: {
            update: vi.fn().mockResolvedValue(mockProduct),
          },
        };
        return callback(tx);
      });

      const result = await createUpdateReview(
        reviewData as z.infer<typeof insertReviewSchema>
      );

      expect(auth).toHaveBeenCalled();
      expect(prisma.review.findFirst).toHaveBeenCalledWith({
        where: {
          productId: reviewData.productId,
          userId: "user-123",
        },
      });
      expect(result).toEqual({
        success: true,
        message: "Review Updated Successfully",
      });
      expect(revalidatePath).toHaveBeenCalledWith(`/product/${product.slug}`);
    });

    it("should return error when user is not authenticated", async () => {
      const reviewData: ReviewInput = {
        title: "Great product!",
        description: "This is an excellent product.",
        productId: "product-1",
        rating: 5,
      };

      (auth as Mock).mockResolvedValue(null);

      const result = await createUpdateReview(
        reviewData as z.infer<typeof insertReviewSchema>
      );

      expect(auth).toHaveBeenCalled();
      expect(result.success).toBe(false);
      expect(result.message).toBeDefined();
      expect(prisma.product.findFirst).not.toHaveBeenCalled();
    });

    it("should return error when product not found", async () => {
      const mockSession = {
        user: { id: "user-123" },
      } as Session;

      const reviewData: ReviewInput = {
        title: "Great product!",
        description: "This is an excellent product.",
        productId: "non-existent-product",
        rating: 5,
      };

      (auth as Mock).mockResolvedValue(mockSession);
      (prisma.product.findFirst as Mock).mockResolvedValue(null);

      const result = await createUpdateReview(
        reviewData as z.infer<typeof insertReviewSchema>
      );

      expect(auth).toHaveBeenCalled();
      expect(prisma.product.findFirst).toHaveBeenCalledWith({
        where: { id: reviewData.productId },
      });
      expect(result.success).toBe(false);
      expect(result.message).toBeDefined();
      expect(prisma.review.findFirst).not.toHaveBeenCalled();
    });

    it("should return error when validation fails", async () => {
      const mockSession = {
        user: { id: "user-123" },
      } as Session;

      const invalidReviewData: ReviewInput = {
        title: "ab", // too short
        description: "ab", // too short
        productId: "",
        rating: 6, // invalid rating
      };

      (auth as Mock).mockResolvedValue(mockSession);

      const result = await createUpdateReview(
        invalidReviewData as z.infer<typeof insertReviewSchema>
      );

      expect(auth).toHaveBeenCalled();
      expect(result.success).toBe(false);
      expect(result.message).toBeDefined();
      expect(typeof result.message).toBe("object");
      expect(result.message).toHaveProperty("fieldErrors");
      expect(prisma.product.findFirst).not.toHaveBeenCalled();
    });

    it("should update product rating and numReviews correctly", async () => {
      const product = sampleData.products[0];
      const mockSession = {
        user: { id: "user-123" },
      } as Session;

      const reviewData: ReviewInput = {
        title: "Great product!",
        description: "This is an excellent product.",
        productId: product.slug,
        rating: 5,
      };

      const mockProduct = {
        ...product,
        id: product.slug,
        price: new Decimal(product.price),
        rating: new Decimal(product.rating),
        slug: product.slug,
      };

      (auth as Mock).mockResolvedValue(mockSession);
      (prisma.product.findFirst as Mock).mockResolvedValue(mockProduct);
      (prisma.review.findFirst as Mock).mockResolvedValue(null);

      const transactionCalls: {
        review: {
          create: Mock;
          aggregate: Mock;
          count: Mock;
        };
        product: {
          update: Mock;
        };
      } = {
        review: {
          create: vi.fn(),
          aggregate: vi.fn(),
          count: vi.fn(),
        },
        product: {
          update: vi.fn(),
        },
      };

      (prisma.$transaction as Mock).mockImplementation(async (callback) => {
        transactionCalls.review.create.mockResolvedValue({
          id: "review-1",
          ...reviewData,
          userId: "user-123",
        });
        transactionCalls.review.aggregate.mockResolvedValue({
          _avg: { rating: 4.5 },
        });
        transactionCalls.review.count.mockResolvedValue(2);
        transactionCalls.product.update.mockResolvedValue(mockProduct);

        return callback(transactionCalls);
      });

      await createUpdateReview(
        reviewData as z.infer<typeof insertReviewSchema>
      );

      expect(transactionCalls.review.aggregate).toHaveBeenCalledWith({
        _avg: { rating: true },
        where: { productId: reviewData.productId },
      });
      expect(transactionCalls.review.count).toHaveBeenCalledWith({
        where: { productId: reviewData.productId },
      });
      expect(transactionCalls.product.update).toHaveBeenCalledWith({
        where: { id: reviewData.productId },
        data: {
          rating: 4.5,
          numReviews: 2,
        },
      });
    });
  });

  describe("getReviews()", () => {
    it("should return all reviews for a product", async () => {
      const productId = "product-1";
      const mockReviews = [
        {
          id: "review-1",
          title: "Great product!",
          description: "Excellent quality",
          rating: 5,
          productId,
          userId: "user-1",
          createdAt: new Date("2024-01-01"),
          updatedAt: new Date("2024-01-01"),
          user: {
            name: "John Doe",
          },
        },
        {
          id: "review-2",
          title: "Good product",
          description: "Nice quality",
          rating: 4,
          productId,
          userId: "user-2",
          createdAt: new Date("2024-01-02"),
          updatedAt: new Date("2024-01-02"),
          user: {
            name: "Jane Smith",
          },
        },
      ];

      (prisma.review.findMany as Mock).mockResolvedValue(mockReviews);

      const result = await getReviews({ productId });

      expect(prisma.review.findMany).toHaveBeenCalledWith({
        where: {
          productId: productId,
        },
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      expect(result).toEqual({ data: mockReviews });
    });

    it("should handle empty results", async () => {
      const productId = "product-1";

      (prisma.review.findMany as Mock).mockResolvedValue([]);

      const result = await getReviews({ productId });

      expect(result).toEqual({ data: [] });
      expect(result.data).toHaveLength(0);
    });
  });

  describe("getReviewByProductId()", () => {
    it("should return review when user has reviewed the product", async () => {
      const productId = "product-1";
      const mockSession = {
        user: { id: "user-123" },
      } as Session;

      const mockReview = {
        id: "review-1",
        title: "Great product!",
        description: "Excellent quality",
        rating: 5,
        productId,
        userId: "user-123",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (auth as Mock).mockResolvedValue(mockSession);
      (prisma.review.findFirst as Mock).mockResolvedValue(mockReview);

      const result = await getReviewByProductId({ productId });

      expect(auth).toHaveBeenCalled();
      expect(prisma.review.findFirst).toHaveBeenCalledWith({
        where: {
          productId,
          userId: "user-123",
        },
      });
      expect(result).toEqual(mockReview);
    });

    it("should return null when review does not exist", async () => {
      const productId = "product-1";
      const mockSession = {
        user: { id: "user-123" },
      } as Session;

      (auth as Mock).mockResolvedValue(mockSession);
      (prisma.review.findFirst as Mock).mockResolvedValue(null);

      const result = await getReviewByProductId({ productId });

      expect(auth).toHaveBeenCalled();
      expect(prisma.review.findFirst).toHaveBeenCalledWith({
        where: {
          productId,
          userId: "user-123",
        },
      });
      expect(result).toBeNull();
    });

    it("should throw error when user is not authenticated", async () => {
      const productId = "product-1";

      (auth as Mock).mockResolvedValue(null);

      await expect(getReviewByProductId({ productId })).rejects.toThrow(
        "User is not authenticated"
      );

      expect(auth).toHaveBeenCalled();
      expect(prisma.review.findFirst).not.toHaveBeenCalled();
    });
  });
});
