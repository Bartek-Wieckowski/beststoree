import { prisma } from "@/lib/prisma";
import sampleData from "./sample-data";
import { hash } from "@/lib/encrypt";
import { generateRandomReview, generateRandomUserName } from "./helpers";

export async function main() {
  try {
    // Delete in correct order (respecting foreign keys)
    await prisma.coupon.deleteMany();
    await prisma.presell.deleteMany();
    await prisma.upsell.deleteMany();
    await prisma.promotion.deleteMany();
    await prisma.review.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.account.deleteMany();
    await prisma.session.deleteMany();
    await prisma.verificationToken.deleteMany();
    await prisma.user.deleteMany();

    // Create categories first
    const createdCategories = await Promise.all(
      sampleData.categories.map((category) =>
        prisma.category.create({
          data: category,
        })
      )
    );

    // Create a map of category slugs to IDs
    const categoryMap = new Map(
      createdCategories.map((cat) => [cat.slug, cat.id])
    );

    // Create products with categoryId
    const productsWithCategoryId = sampleData.products.map((product) => {
      const categoryId = categoryMap.get(product.categorySlug);
      if (!categoryId) {
        throw new Error(`Category not found for slug: ${product.categorySlug}`);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { categorySlug, ...productData } = product;
      return {
        ...productData,
        categoryId,
      };
    });

    await prisma.product.createMany({
      data: productsWithCategoryId,
    });

    // Create users (needed for reviews)
    const users = [];
    for (let i = 0; i < sampleData.users.length; i++) {
      users.push({
        ...sampleData.users[i],
        password: await hash(sampleData.users[i].password),
      });
      console.log(
        sampleData.users[i].password,
        await hash(sampleData.users[i].password)
      );
    }
    await prisma.user.createMany({ data: users });

    // Create additional users for reviews with random names (fixed number, reused for all reviews)
    const reviewUsersCount = 6; // Fixed number of review users
    const reviewUsers = [];
    for (let i = 0; i < reviewUsersCount; i++) {
      const userName = generateRandomUserName();
      reviewUsers.push({
        name: userName,
        email: `reviewer${i + 1}@example.com`,
        password: await hash("reviewer123"),
        role: "user",
      });
    }
    await prisma.user.createMany({ data: reviewUsers });

    // Get all created users and products
    const createdUsers = await prisma.user.findMany();
    const createdProducts = await prisma.product.findMany();

    // Create reviews for products based on numReviews
    for (const product of createdProducts) {
      const productData = sampleData.products.find(
        (p) => p.slug === product.slug
      );
      if (productData && productData.numReviews > 0) {
        for (let i = 0; i < productData.numReviews; i++) {
          const reviewData = generateRandomReview();
          // Randomly select a user from existing users
          const randomUser =
            createdUsers[Math.floor(Math.random() * createdUsers.length)];
          const isVerifiedPurchase = Math.random() > 0.3;

          // Generate random date within the last 90 days
          // Each review gets a different date, spread out over time
          const daysAgo = Math.floor(Math.random() * 90); // 0-90 days ago
          const randomHour = Math.floor(Math.random() * 24); // Random hour (0-23)
          const randomMinute = Math.floor(Math.random() * 60); // Random minute (0-59)
          const randomSecond = Math.floor(Math.random() * 60); // Random second (0-59)

          const reviewDate = new Date();
          reviewDate.setDate(reviewDate.getDate() - daysAgo);
          reviewDate.setHours(randomHour, randomMinute, randomSecond, 0);

          await prisma.review.create({
            data: {
              userId: randomUser.id,
              productId: product.id,
              rating: reviewData.rating,
              title: reviewData.title,
              description: reviewData.description,
              isVerifiedPurchase: isVerifiedPurchase,
              createdAt: reviewDate,
            },
          });
        }
      }
    }

    // Update product ratings and numReviews based on actual reviews
    for (const product of createdProducts) {
      const averageRating = await prisma.review.aggregate({
        _avg: { rating: true },
        where: { productId: product.id },
      });

      const numReviews = await prisma.review.count({
        where: { productId: product.id },
      });

      await prisma.product.update({
        where: { id: product.id },
        data: {
          rating: averageRating._avg.rating || 0,
          numReviews,
        },
      });
    }

    // Create promotion for the first product (set end date to 7 days from now)
    const firstProduct = await prisma.product.findFirst({
      orderBy: { createdAt: "asc" },
    });

    if (firstProduct) {
      const promotionEndDate = new Date();
      promotionEndDate.setDate(promotionEndDate.getDate() + 7);
      promotionEndDate.setHours(23, 59, 59, 999); // Set to end of day

      await prisma.promotion.create({
        data: {
          productId: firstProduct.id,
          endDate: promotionEndDate,
          isEnabled: true,
          discountPercentage: 10,
        },
      });
    }

    // Create Presell for each category
    for (const category of createdCategories) {
      // Find a random product from this category
      const productsInCategory = createdProducts.filter(
        (p) => p.categoryId === category.id
      );

      if (productsInCategory.length > 0) {
        const randomProduct =
          productsInCategory[
            Math.floor(Math.random() * productsInCategory.length)
          ];

        await prisma.presell.create({
          data: {
            categoryId: category.id,
            productId: randomProduct.id,
            isEnabled: true,
          },
        });
      }
    }

    // Create Upsell - select one random product
    if (createdProducts.length > 0) {
      const randomUpsellProduct =
        createdProducts[Math.floor(Math.random() * createdProducts.length)];

      await prisma.upsell.create({
        data: {
          productId: randomUpsellProduct.id,
          isEnabled: true,
        },
      });
    }

    // Create coupon SALE10 with 10% discount
    const couponStartDate = new Date();
    const couponEndDate = new Date();
    couponEndDate.setFullYear(couponEndDate.getFullYear() + 30); // Valid for 30 years
    couponEndDate.setHours(23, 59, 59, 999); // Set to end of day

    await prisma.coupon.create({
      data: {
        code: "SALE10",
        discountPercentage: 10,
        startDate: couponStartDate,
        endDate: couponEndDate,
        isEnabled: true,
      },
    });

    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Only run if file is being executed directly
if (require.main === module) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
