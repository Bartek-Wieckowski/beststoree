import { describe, expect, it, vi } from 'vitest';
import { prismaMock } from '../mocks/prisma.mock';
import { main } from '@/db/seed';
import sampleData from '@/db/sample-data';

// Mockowanie modułu encrypt
vi.mock('@/lib/encrypt', () => ({
  hash: vi
    .fn()
    .mockImplementation((password) => Promise.resolve(`hashed_${password}`)),
}));

describe('Database seed', () => {
  it('should delete existing data and create new products and users', async () => {
    prismaMock.product.deleteMany.mockResolvedValue({ count: 0 });
    prismaMock.account.deleteMany.mockResolvedValue({ count: 0 });
    prismaMock.session.deleteMany.mockResolvedValue({ count: 0 });
    prismaMock.verificationToken.deleteMany.mockResolvedValue({ count: 0 });
    prismaMock.user.deleteMany.mockResolvedValue({ count: 0 });

    prismaMock.product.createMany.mockResolvedValue({
      count: sampleData.products.length,
    });

    prismaMock.user.createMany.mockResolvedValue({
      count: sampleData.users.length,
    });

    await main();

    expect(prismaMock.product.deleteMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.account.deleteMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.session.deleteMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.verificationToken.deleteMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.user.deleteMany).toHaveBeenCalledTimes(1);

    expect(prismaMock.product.createMany).toHaveBeenCalledWith({
      data: sampleData.products,
    });

    expect(prismaMock.user.createMany).toHaveBeenCalled();

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
