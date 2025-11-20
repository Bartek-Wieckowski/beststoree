import { auth } from "@/auth";
import {
  createOrder,
  getOrderById,
  getMyOrders,
} from "@/lib/actions/order.actions";
import { getMyCart } from "@/lib/actions/cart.actions";
import { getUserById } from "@/lib/actions/user.actions";
import { prisma } from "@/lib/prisma";
import { Session } from "next-auth";
import { describe, expect, it, vi, Mock } from "vitest";

vi.mock("@/lib/actions/cart.actions", () => ({
  getMyCart: vi.fn(),
}));

vi.mock("@/lib/actions/user.actions", () => ({
  getUserById: vi.fn(),
}));

describe("Order Actions", () => {
  describe("createOrder", () => {
    it("should return error when session is missing", async () => {
      (auth as Mock).mockResolvedValue(null);

      const result = await createOrder();

      expect(result.success).toBe(false);
      expect(result.message).toEqual({
        generalError: "User is not authenticated",
      });
    });

    it("should return error when cart is empty", async () => {
      (auth as Mock).mockResolvedValue({ user: { id: "user123" } } as Session);
      (getMyCart as Mock).mockResolvedValue({
        id: "cart1",
        items: [],
        itemsPrice: "0",
        totalPrice: "0",
        shippingPrice: "0",
        taxPrice: "0",
      });

      const result = await createOrder();

      expect(result.success).toBe(false);
      expect(result.message).toBe("Your cart is empty");
    });

    it("should return error when shipping address is missing", async () => {
      (auth as Mock).mockResolvedValue({ user: { id: "user123" } } as Session);
      (getMyCart as Mock).mockResolvedValue({
        id: "cart1",
        items: [{ productId: "prod1", qty: 1 }],
        itemsPrice: "100",
        totalPrice: "120",
        shippingPrice: "10",
        taxPrice: "10",
      });
      (getUserById as Mock).mockResolvedValue({
        id: "user123",
        address: null,
        paymentMethod: "PayPal",
      });

      const result = await createOrder();

      expect(result.success).toBe(false);
      expect(result.message).toBe("No shipping address");
    });

    it("should return error when payment method is missing", async () => {
      (auth as Mock).mockResolvedValue({ user: { id: "user123" } } as Session);
      (getMyCart as Mock).mockResolvedValue({
        id: "cart1",
        items: [{ productId: "prod1", qty: 1 }],
        itemsPrice: "100",
        totalPrice: "120",
        shippingPrice: "10",
        taxPrice: "10",
      });
      (getUserById as Mock).mockResolvedValue({
        id: "user123",
        address: { city: "Warsaw", country: "Poland" },
        paymentMethod: null,
      });

      const result = await createOrder();

      expect(result.success).toBe(false);
      expect(result.message).toBe("No payment method");
    });
  });

  describe("getOrderById", () => {
    it("should return null when order does not exist", async () => {
      (prisma.order.findFirst as Mock).mockResolvedValue(null);

      const result = await getOrderById("non-existent-id");

      expect(result).toBeNull();
    });

    it("should return order when order exists", async () => {
      const mockOrder = {
        id: "order123",
        userId: "user123",
        itemsPrice: 100,
        totalPrice: 120,
        orderitems: [],
        user: { name: "Test User", email: "test@example.com" },
      };
      (prisma.order.findFirst as Mock).mockResolvedValue(mockOrder);

      const result = await getOrderById("order123");

      expect(result).toEqual(mockOrder);
    });
  });

  describe("getMyOrders", () => {
    it("should throw error when session is missing", async () => {
      (auth as Mock).mockResolvedValue(null);

      await expect(getMyOrders({ page: 1 })).rejects.toThrow(
        "User is not authenticated"
      );
    });

    it("should return orders when user is authenticated", async () => {
      (auth as Mock).mockResolvedValue({ user: { id: "user123" } } as Session);
      (prisma.order.findMany as Mock).mockResolvedValue([
        { id: "order1", userId: "user123" },
        { id: "order2", userId: "user123" },
      ]);
      (prisma.order.count as Mock).mockResolvedValue(2);

      const result = await getMyOrders({ page: 1 });

      expect(result.data).toHaveLength(2);
      expect(result.totalPages).toBe(1);
    });
  });
});
