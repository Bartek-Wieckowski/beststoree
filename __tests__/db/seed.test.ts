import { describe, expect, it } from 'vitest';
import { prismaMock } from '../mocks/prisma.mock';
import { main } from '@/db/seed';
import sampleData from '@/db/sample-data';

describe('Database seed', () => {
  it('should delete existing products and create new ones', async () => {
    prismaMock.product.deleteMany.mockResolvedValue({ count: 0 });
    prismaMock.product.createMany.mockResolvedValue({
      count: sampleData.products.length,
    });

    await main();

    expect(prismaMock.product.deleteMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.product.createMany).toHaveBeenCalledWith({
      data: sampleData.products,
    });
    expect(console.log).toHaveBeenCalledWith('Database seeded successfully');
  });

  it('should handle database errors', async () => {
    const dbError = new Error('Database error');
    prismaMock.product.deleteMany.mockRejectedValue(dbError);

    await expect(main()).rejects.toThrow('Database error');
    expect(console.error).toHaveBeenCalledWith(
      'Error seeding database:',
      dbError
    );
  });
});
