import { defineConfig } from "cypress";
import { PrismaClient } from "@prisma/client";
import { hash } from "./lib/encrypt";

const prisma = new PrismaClient();

export default defineConfig({
  e2e: {
    setupNodeEvents(on) {
      on("task", {
        async "db:reset"() {
          // Delete carts with null userId
          await prisma.cart.deleteMany({
            where: {
              userId: null,
            },
          });

          // Delete all carts for the test user
          await prisma.cart.deleteMany({
            where: {
              user: {
                email: "testCypressUser@example.com",
              },
            },
          });

          // Then delete the test user if exists
          await prisma.user.deleteMany({
            where: {
              email: "testCypressUser@example.com",
            },
          });

          return null;
        },
        async "db:seed"() {
          return null;
        },
        async "db:cleanup"() {
          // Delete carts with null userId
          await prisma.cart.deleteMany({
            where: {
              userId: null,
            },
          });

          // Delete all carts for the test user
          await prisma.cart.deleteMany({
            where: {
              user: {
                email: "testCypressUser@example.com",
              },
            },
          });

          // Then delete the test user if exists
          await prisma.user.deleteMany({
            where: {
              email: "testCypressUser@example.com",
            },
          });

          await prisma.$disconnect();
          return null;
        },
        async "db:createUser"() {
          const hashedPassword = await hash("123456");
          const user = await prisma.user.upsert({
            where: { email: "testCypressUser@example.com" },
            update: {
              name: "Cypress User",
              password: hashedPassword,
            },
            create: {
              email: "testCypressUser@example.com",
              name: "Cypress User",
              password: hashedPassword,
              role: "user",
              image: null,
              address: {},
              emailVerified: null,
              paymentMethod: null,
            },
          });

          return {
            id: user.id,
            email: user.email,
            name: user.name,
          };
        },
        async "db:updateOrderToPaid"(orderId: string) {
          const order = await prisma.order.findFirst({
            where: { id: orderId },
            include: { orderitems: true },
          });

          if (!order) {
            throw new Error(`Order with id ${orderId} not found`);
          }

          if (order.isPaid) {
            return { success: true, message: "Order is already paid" };
          }

          // Transaction to update order and account for product stock
          await prisma.$transaction(async (tx) => {
            // Iterate over products and update stock
            for (const item of order.orderitems) {
              await tx.product.update({
                where: { id: item.productId },
                data: { stock: { increment: -item.qty } },
              });
            }

            // Set the order to paid
            await tx.order.update({
              where: { id: orderId },
              data: {
                isPaid: true,
                paidAt: new Date(),
                paymentResult:
                  order.paymentMethod === "PayPal"
                    ? {
                        id: "test-paypal-order-id",
                        status: "COMPLETED",
                        email_address: "test@example.com",
                        pricePaid: order.totalPrice.toString(),
                      }
                    : undefined,
              },
            });
          });

          return { success: true, message: "Order updated to paid" };
        },
      });
    },
    baseUrl: "http://localhost:3000/",
  },
});
