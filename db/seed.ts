import { prisma } from "@/lib/prisma";
import sampleData from "./sample-data";
import { hash } from "@/lib/encrypt";

export async function main() {
  try {
    // Delete in correct order (respecting foreign keys)
    await prisma.promotion.deleteMany();
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
      const { categorySlug, ...productData } = product;
      return {
        ...productData,
        categoryId,
      };
    });

    await prisma.product.createMany({
      data: productsWithCategoryId,
    });

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

    // Create users
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
