import { prisma } from "@/lib/prisma";
import sampleData from "./sample-data";
import { hash } from "@/lib/encrypt";

export async function main() {
  try {
    await prisma.product.deleteMany();
    await prisma.account.deleteMany();
    await prisma.session.deleteMany();
    await prisma.verificationToken.deleteMany();
    await prisma.user.deleteMany();

    await prisma.product.createMany({
      data: sampleData.products,
    });

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
