import { PrismaClient } from '@prisma/client';
import sampleData from './sample-data';

export async function main() {
  const prisma = new PrismaClient();

  try {
    await prisma.product.deleteMany();

    await prisma.product.createMany({
      data: sampleData.products,
    });

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Only run if file is being executed directly
if (require.main === module) {
  main()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}
