import { auth } from "@/auth";
import {
  createOrder,
  getOrderById,
  getMyOrders,
  getAllOrders,
  getOrderSummary,
  deleteOrder,
  updateOrderToPaidCOD,
  deliverOrder,
} from "@/lib/actions/order.actions";
import { getMyCart } from "@/lib/actions/cart.actions";
import { getUserById } from "@/lib/actions/user.actions";
import { prisma } from "@/lib/prisma";
import { Session } from "next-auth";
import { describe, expect, it, vi, Mock, beforeEach } from "vitest";
import { revalidatePath } from "next/cache";
import ROUTES from "@/lib/routes";

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

  describe("getOrderSummary", () => {
    it("should return summary data", async () => {
      (prisma.order.count as Mock).mockResolvedValue(10);
      (prisma.product.count as Mock).mockResolvedValue(5);
      (prisma.user.count as Mock).mockResolvedValue(3);

      (prisma.order.aggregate as Mock).mockResolvedValue({
        _sum: { totalPrice: 1234 },
      });

      (prisma.$queryRaw as Mock).mockResolvedValue([
        { month: "01/25", totalSales: 500 },
        { month: "02/25", totalSales: 734 },
      ]);

      (prisma.order.findMany as Mock).mockResolvedValue([
        { id: 1, totalPrice: 200, user: { name: "John" } },
      ]);

      const result = await getOrderSummary();

      expect(result.ordersCount).toBe(10);
      expect(result.productsCount).toBe(5);
      expect(result.usersCount).toBe(3);

      expect(result.totalSales).toEqual({
        _sum: { totalPrice: 1234 },
      });

      expect(result.salesData).toEqual([
        { month: "01/25", totalSales: 500 },
        { month: "02/25", totalSales: 734 },
      ]);

      expect(result.latestSales.length).toBe(1);
      expect(result.latestSales[0].user.name).toBe("John");
    });
  });

  describe("getAllOrders", () => {
    it("should return all orders", async () => {
      (prisma.order.findMany as Mock).mockResolvedValue([
        { id: "order1", userId: "user123" },
      ]);
      (prisma.order.count as Mock).mockResolvedValue(1);

      const result = await getAllOrders({ limit: 10, page: 1, query: "" });

      expect(result.data).toHaveLength(1);
      expect(result.totalPages).toBe(1);
    });
  });

  describe("deleteOrder", () => {
    it("should delete order", async () => {
      (prisma.order.delete as Mock).mockResolvedValue({ id: "order1" });

      const result = await deleteOrder("order1");

      expect(result.success).toBe(true);
    });
  });

  describe("updateOrderToPaidCOD", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("should update order to paid successfully", async () => {
      const mockOrder = {
        id: "order1",
        isPaid: false,
        orderitems: [
          { productId: "prod1", qty: 2 },
          { productId: "prod2", qty: 1 },
        ],
      };

      const mockUpdatedOrder = {
        id: "order1",
        isPaid: true,
        paidAt: new Date(),
        orderitems: mockOrder.orderitems,
        user: { name: "Test User", email: "test@example.com" },
      };

      // Mock findFirst - pierwsze wywołanie (sprawdzenie zamówienia)
      (prisma.order.findFirst as Mock)
        .mockResolvedValueOnce(mockOrder)
        // Drugie wywołanie (pobranie zaktualizowanego zamówienia)
        .mockResolvedValueOnce(mockUpdatedOrder);

      // Mock transaction
      (prisma.$transaction as Mock).mockImplementation(async (callback) => {
        const tx = {
          product: {
            update: vi.fn().mockResolvedValue({}),
          },
          order: {
            update: vi.fn().mockResolvedValue({}),
          },
        };
        return await callback(tx);
      });

      const result = await updateOrderToPaidCOD("order1");

      expect(result.success).toBe(true);
      expect(result.message).toBe("Order marked as paid");
      expect(prisma.order.findFirst).toHaveBeenCalledWith({
        where: { id: "order1" },
        include: { orderitems: true },
      });
      expect(prisma.$transaction).toHaveBeenCalled();
      expect(revalidatePath).toHaveBeenCalledWith(ROUTES.ORDER("order1"));
    });

    it("should return error when order does not exist", async () => {
      (prisma.order.findFirst as Mock).mockResolvedValue(null);

      const result = await updateOrderToPaidCOD("non-existent-order");

      expect(result.success).toBe(false);
      expect(result.message).toHaveProperty("generalError");
      expect((result.message as { generalError: string }).generalError).toBe(
        "Order not found"
      );
      expect(prisma.$transaction).not.toHaveBeenCalled();
      expect(revalidatePath).not.toHaveBeenCalled();
    });

    it("should return error when order is already paid", async () => {
      const mockOrder = {
        id: "order1",
        isPaid: true,
        paidAt: new Date(),
        orderitems: [],
      };

      (prisma.order.findFirst as Mock).mockResolvedValue(mockOrder);

      const result = await updateOrderToPaidCOD("order1");

      expect(result.success).toBe(false);
      expect(result.message).toHaveProperty("generalError");
      expect((result.message as { generalError: string }).generalError).toBe(
        "Order is already paid"
      );
      expect(prisma.$transaction).not.toHaveBeenCalled();
      expect(revalidatePath).not.toHaveBeenCalled();
    });

    it("should handle transaction errors", async () => {
      const mockOrder = {
        id: "order1",
        isPaid: false,
        orderitems: [{ productId: "prod1", qty: 1 }],
      };

      (prisma.order.findFirst as Mock).mockResolvedValue(mockOrder);
      (prisma.$transaction as Mock).mockRejectedValue(
        new Error("Transaction failed")
      );

      const result = await updateOrderToPaidCOD("order1");

      expect(result.success).toBe(false);
      expect(result.message).toBeDefined();
      expect(result.message).toHaveProperty("generalError");
      expect((result.message as { generalError: string }).generalError).toBe(
        "Transaction failed"
      );
    });
  });

  describe("deliverOrder", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("should mark order as delivered successfully", async () => {
      const mockOrder = {
        id: "order1",
        isPaid: true,
        paidAt: new Date(),
        isDelivered: false,
        deliveredAt: null,
      };

      const mockUpdatedOrder = {
        id: "order1",
        isPaid: true,
        isDelivered: true,
        deliveredAt: new Date(),
      };

      (prisma.order.findFirst as Mock).mockResolvedValue(mockOrder);
      (prisma.order.update as Mock).mockResolvedValue(mockUpdatedOrder);

      const result = await deliverOrder("order1");

      expect(result.success).toBe(true);
      expect(result.message).toBe("Order has been marked delivered");
      expect(prisma.order.findFirst).toHaveBeenCalledWith({
        where: { id: "order1" },
      });
      expect(prisma.order.update).toHaveBeenCalledWith({
        where: { id: "order1" },
        data: {
          isDelivered: true,
          deliveredAt: expect.any(Date),
        },
      });
      expect(revalidatePath).toHaveBeenCalledWith(ROUTES.ORDER("order1"));
    });

    it("should return error when order does not exist", async () => {
      (prisma.order.findFirst as Mock).mockResolvedValue(null);

      const result = await deliverOrder("non-existent-order");

      expect(result.success).toBe(false);
      expect(result.message).toHaveProperty("generalError");
      expect((result.message as { generalError: string }).generalError).toBe(
        "Order not found"
      );
      expect(prisma.order.update).not.toHaveBeenCalled();
      expect(revalidatePath).not.toHaveBeenCalled();
    });

    it("should return error when order is not paid", async () => {
      const mockOrder = {
        id: "order1",
        isPaid: false,
        paidAt: null,
        isDelivered: false,
        deliveredAt: null,
      };

      (prisma.order.findFirst as Mock).mockResolvedValue(mockOrder);

      const result = await deliverOrder("order1");

      expect(result.success).toBe(false);
      expect(result.message).toHaveProperty("generalError");
      expect((result.message as { generalError: string }).generalError).toBe(
        "Order is not paid"
      );
      expect(prisma.order.update).not.toHaveBeenCalled();
      expect(revalidatePath).not.toHaveBeenCalled();
    });

    it("should handle update errors", async () => {
      const mockOrder = {
        id: "order1",
        isPaid: true,
        paidAt: new Date(),
        isDelivered: false,
        deliveredAt: null,
      };

      (prisma.order.findFirst as Mock).mockResolvedValue(mockOrder);
      (prisma.order.update as Mock).mockRejectedValue(
        new Error("Update failed")
      );

      const result = await deliverOrder("order1");

      expect(result.success).toBe(false);
      expect(result.message).toBeDefined();
      expect(result.message).toHaveProperty("generalError");
      expect((result.message as { generalError: string }).generalError).toBe(
        "Update failed"
      );
    });
  });
});
