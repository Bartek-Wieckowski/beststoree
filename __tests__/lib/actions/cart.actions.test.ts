import { auth } from "@/auth";
import {
  addItemToCart,
  getMyCart,
  removeItemFromCart,
} from "@/lib/actions/cart.actions";
import { prisma } from "@/lib/prisma";
import { Session } from "next-auth";
import { cookies } from "next/headers";
import { describe, expect, it, vi, Mock } from "vitest";

describe("Cart Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("addItemToCart()", () => {
    it("should throws error when sessionCartId is missing", async () => {
      (cookies as Mock).mockResolvedValue({
        get: vi.fn(() => undefined),
      });

      const result = await addItemToCart({
        productId: "prod123",
        image: "prod123",
        slug: "prod123",
        qty: 1,
        name: "test",
        price: "59.99",
      });

      expect(result.success).toBe(false);
      expect(result.message).toEqual({
        generalError: "Cart session not found",
      });
    });

    it("should throw an error when product does not exist", async () => {
      (cookies as Mock).mockResolvedValue({
        get: vi.fn(() => ({ value: "session123" })),
      });
      (auth as Mock).mockResolvedValue({ user: { id: "user123" } });

      (prisma.product.findFirst as Mock).mockResolvedValue(null);

      const result = await addItemToCart({
        productId: "prod123",
        image: "prod123-image",
        slug: "prod123",
        qty: 1,
        name: "Test Product",
        price: "10.00",
      });

      expect(result.success).toBe(false);
      expect(result.message).toEqual({ generalError: "Product not found" });
    });
  });

  describe("getMyCart()", () => {
    it("should throws error when sessionCartId is missing", async () => {
      (cookies as Mock).mockReturnValue({ get: vi.fn(() => undefined) });

      await expect(getMyCart()).rejects.toThrow("Cart session not found");
    });

    it("should return undefined when session cart id doesnt exist", async () => {
      (cookies as Mock).mockResolvedValue({
        get: vi.fn(() => ({ value: "session123" })),
      });
      (auth as Mock).mockResolvedValue(null);
      (prisma.cart.findFirst as Mock).mockResolvedValue(null);

      const result = await getMyCart();
      expect(result).toBeUndefined();
    });

    it("should return cart if sessionCartId exist", async () => {
      (cookies as Mock).mockResolvedValue({
        get: vi.fn(() => ({ value: "session123" })),
      });
      (auth as Mock).mockResolvedValue(null);
      (prisma.cart.findFirst as Mock).mockResolvedValue({
        id: "cart1",
        sessionCartId: "session123",
        userId: null,
        items: [],
        itemsPrice: 100,
        totalPrice: 120,
        shippingPrice: 10,
        taxPrice: 10,
      });

      const result = await getMyCart();

      expect(result).toEqual({
        id: "cart1",
        sessionCartId: "session123",
        userId: null,
        items: [],
        itemsPrice: "100",
        totalPrice: "120",
        shippingPrice: "10",
        taxPrice: "10",
      });
    });
  });

  describe("removeItemFromCart()", () => {
    it("should return error when sessionCartId is not found", async () => {
      (cookies as Mock).mockResolvedValue({
        get: vi.fn(() => undefined),
      });

      const result = await removeItemFromCart("prod123");

      expect(result.success).toBe(false);
      expect(result.message).toEqual({
        generalError: "Cart session not found",
      });
    });
  });

  it("returns the shopping cart based on the userId if logged in", async () => {
    (cookies as Mock).mockResolvedValue({
      get: vi.fn(() => ({ value: "session123" })),
    });
    (auth as Mock).mockResolvedValue({ user: { id: "user123" } } as Session);
    (prisma.cart.findFirst as Mock).mockResolvedValue({
      id: "cart2",
      sessionCartId: null,
      userId: "user123",
      items: [],
      itemsPrice: 50,
      totalPrice: 70,
      shippingPrice: 10,
      taxPrice: 10,
    });

    const result = await getMyCart();

    expect(result).toEqual({
      id: "cart2",
      sessionCartId: null,
      userId: "user123",
      items: [],
      itemsPrice: "50",
      totalPrice: "70",
      shippingPrice: "10",
      taxPrice: "10",
    });
  });
});
