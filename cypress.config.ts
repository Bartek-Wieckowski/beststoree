import { defineConfig } from "cypress";
import { PrismaClient } from "@prisma/client";
import { hash } from "./lib/encrypt";
import { UTApi } from "uploadthing/server";
import sampleData from "./db/sample-data";
import { config } from "dotenv";
import { resolve } from "path";

// Load .env.local for Cypress if DATABASE_URL is not set and file exists
import { existsSync } from "fs";

if (!process.env.DATABASE_URL && existsSync(resolve(__dirname, ".env.local"))) {
  config({ path: resolve(__dirname, ".env.local") });
}

export default defineConfig({
  e2e: {
    // Increase default timeouts for CI environments
    defaultCommandTimeout: 10000,
    requestTimeout: 15000,
    responseTimeout: 15000,
    pageLoadTimeout: 30000,
    setupNodeEvents(on) {
      // Create Prisma Client - DATABASE_URL should be set via env vars (CI) or .env.local (local)
      const prisma = new PrismaClient();

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

          // Delete all carts for the test admin user
          await prisma.cart.deleteMany({
            where: {
              user: {
                email: "testCypressAdmin@example.com",
              },
            },
          });

          // Then delete the test user if exists
          await prisma.user.deleteMany({
            where: {
              email: "testCypressUser@example.com",
            },
          });

          // Delete the test admin user if exists
          await prisma.user.deleteMany({
            where: {
              email: "testCypressAdmin@example.com",
            },
          });

          return null;
        },
        async "db:seed"() {
          // Seed products from sample data
          await prisma.product.deleteMany();
          await prisma.product.createMany({
            data: sampleData.products,
          });
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

          // Delete all carts for the test admin user
          await prisma.cart.deleteMany({
            where: {
              user: {
                email: "testCypressAdmin@example.com",
              },
            },
          });

          // Then delete the test user if exists
          await prisma.user.deleteMany({
            where: {
              email: "testCypressUser@example.com",
            },
          });

          // Delete the test admin user if exists
          await prisma.user.deleteMany({
            where: {
              email: "testCypressAdmin@example.com",
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
        async "db:createAdminUser"() {
          const hashedPassword = await hash("123456");
          const user = await prisma.user.upsert({
            where: { email: "testCypressAdmin@example.com" },
            update: {
              name: "Cypress Admin",
              password: hashedPassword,
              role: "admin",
            },
            create: {
              email: "testCypressAdmin@example.com",
              name: "Cypress Admin",
              password: hashedPassword,
              role: "admin",
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
        async "db:createTestProduct"() {
          const testProduct = await prisma.product.create({
            data: {
              name: "Test Product for Cypress",
              slug: `test-product-cypress-${Date.now()}`,
              category: "Test Category",
              description: "This is a test product created by Cypress",
              images: ["/images/sample-products/p1-1.jpg"],
              brand: "Test Brand",
              price: 29.99,
              rating: 4.5,
              numReviews: 0,
              stock: 100, // High stock to avoid running out during tests
              isFeatured: false,
              banner: null,
            },
          });

          return {
            id: testProduct.id,
            slug: testProduct.slug,
            name: testProduct.name,
          };
        },
        async "db:deleteTestProduct"(productId: string) {
          await prisma.product.deleteMany({
            where: {
              id: productId,
            },
          });
          return null;
        },
        async "db:deleteTestProductsByName"(productName: string) {
          // First, get all products to delete their images from uploadthing
          const products = await prisma.product.findMany({
            where: {
              name: {
                contains: productName,
              },
            },
            select: { images: true, banner: true },
          });

          // Extract image keys and delete from uploadthing
          const imagesToDelete: string[] = [];
          products.forEach((product) => {
            if (product.images && product.images.length > 0) {
              product.images.forEach((imageUrl) => {
                const key = imageUrl.split("/").pop();
                if (key) imagesToDelete.push(key);
              });
            }
            if (product.banner) {
              const bannerKey = product.banner.split("/").pop();
              if (bannerKey) imagesToDelete.push(bannerKey);
            }
          });

          // Delete images from uploadthing
          if (imagesToDelete.length > 0) {
            try {
              const utapi = new UTApi();
              await utapi.deleteFiles([...new Set(imagesToDelete)]);
            } catch {
              // Ignore errors - images might already be deleted
            }
          }

          // Then delete products from database
          await prisma.product.deleteMany({
            where: {
              name: {
                contains: productName,
              },
            },
          });
          return null;
        },
        async "db:createTestOrder"(userId: string) {
          // First create a test product
          const testProduct = await prisma.product.create({
            data: {
              name: "Test Product for Order",
              slug: `test-product-order-${Date.now()}`,
              category: "Test Category",
              description: "This is a test product for order",
              images: ["/images/sample-products/p1-1.jpg"],
              brand: "Test Brand",
              price: 29.99,
              rating: 4.5,
              numReviews: 0,
              stock: 100,
              isFeatured: false,
              banner: null,
            },
          });

          // Create test order with order item
          const order = await prisma.$transaction(async (tx) => {
            const createdOrder = await tx.order.create({
              data: {
                userId: userId,
                shippingAddress: {
                  fullName: "Test User",
                  streetAddress: "Test Street 123",
                  city: "Test City",
                  postalCode: "00-000",
                  country: "Test Country",
                },
                paymentMethod: "CashOnDelivery",
                itemsPrice: 29.99,
                shippingPrice: 10.0,
                taxPrice: 4.0,
                totalPrice: 43.99,
                isPaid: false,
                isDelivered: false,
              },
            });

            await tx.orderItem.create({
              data: {
                orderId: createdOrder.id,
                productId: testProduct.id,
                qty: 1,
                price: 29.99,
                name: testProduct.name,
                slug: testProduct.slug,
                image: testProduct.images[0],
              },
            });

            return createdOrder;
          });

          return {
            orderId: order.id,
            productId: testProduct.id,
          };
        },
        async "db:deleteTestOrder"(orderId: string) {
          // Order items will be deleted automatically due to CASCADE
          await prisma.order.deleteMany({
            where: {
              id: orderId,
            },
          });
          return null;
        },
        async "uploadthing:deleteProductImages"(productId: string) {
          try {
            // Get product from database
            const product = await prisma.product.findUnique({
              where: { id: productId },
              select: { images: true, banner: true },
            });

            if (!product) {
              return { success: false, message: "Product not found" };
            }

            const imagesToDelete: string[] = [];

            // Extract keys from image URLs
            if (product.images && product.images.length > 0) {
              product.images.forEach((imageUrl) => {
                const key = imageUrl.split("/").pop();
                if (key) imagesToDelete.push(key);
              });
            }

            // Extract key from banner URL if exists
            if (product.banner) {
              const bannerKey = product.banner.split("/").pop();
              if (bannerKey) imagesToDelete.push(bannerKey);
            }

            // Delete from uploadthing
            if (imagesToDelete.length > 0) {
              const utapi = new UTApi();
              await utapi.deleteFiles(imagesToDelete);
              return {
                success: true,
                message: `Deleted ${imagesToDelete.length} image(s)`,
              };
            }

            return { success: true, message: "No images to delete" };
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : String(error);
            return {
              success: false,
              message: errorMessage,
            };
          }
        },
        async "uploadthing:deleteImage"(imageKey: string) {
          try {
            if (!imageKey || imageKey.trim() === "") {
              return { success: false, message: "Image key is empty" };
            }
            const utapi = new UTApi();
            await utapi.deleteFiles(imageKey);
            return { success: true, message: "Image deleted successfully" };
          } catch {
            // Ignore errors - image might already be deleted
            return { success: true, message: "Image deletion attempted" };
          }
        },
      });
    },
    baseUrl: "http://localhost:3000/",
  },
});
