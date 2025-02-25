import { describe, expect, it } from 'vitest';
import { prismaMock } from '../../mocks/prisma.mock';
import {
  getLatestProducts,
  getProductBySlug,
} from '@/lib/actions/product.actions';
import { LATEST_PRODUCTS_LIMIT } from '@/lib/constants';
import { Decimal } from '@prisma/client/runtime/library';
import { convertToPlanObject } from '@/lib/utils';
import sampleData from '@/db/sample-data';

describe('Product Actions', () => {
  describe('getLatestProducts()', () => {
    it('should return latest products with correct limit', async () => {
      const prismaProducts = sampleData.products
        .slice(0, LATEST_PRODUCTS_LIMIT)
        .map((product) => ({
          ...product,
          id: product.slug,
          price: new Decimal(product.price),
          rating: new Decimal(product.rating),
          createdAt: new Date(),
        }));

      const expectedProducts = convertToPlanObject(prismaProducts);

      prismaMock.product.findMany.mockResolvedValue(prismaProducts);

      const result = await getLatestProducts();

      expect(prismaMock.product.findMany).toHaveBeenCalledWith({
        take: LATEST_PRODUCTS_LIMIT,
        orderBy: {
          createdAt: 'desc',
        },
      });

      expect(result).toEqual(expectedProducts);
    });

    it('should handle empty results', async () => {
      prismaMock.product.findMany.mockResolvedValue([]);

      const result = await getLatestProducts();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should handle database errors', async () => {
      const dbError = new Error('Database connection failed');
      prismaMock.product.findMany.mockRejectedValue(dbError);

      await expect(getLatestProducts()).rejects.toThrow(
        'Database connection failed'
      );
    });
  });

  describe('getProductBySlug()', () => {
    it('should return product by slug', async () => {
      const product = sampleData.products[0];
      const slug = product.slug;
      const prismaProduct = {
        ...product,
        id: product.slug,
        price: new Decimal(product.price),
        rating: new Decimal(product.rating),
        createdAt: new Date(),
      };

      prismaMock.product.findFirst.mockResolvedValue(prismaProduct);

      const result = await getProductBySlug(slug);

      const expectedProduct = convertToPlanObject(prismaProduct);

      expect(result).toEqual(expectedProduct);
    });

    it('should handle database errors', async () => {
      const dbError = new Error('Database connection failed');
      prismaMock.product.findFirst.mockRejectedValue(dbError);

      await expect(getProductBySlug('non-existent-slug')).rejects.toThrow(
        'Database connection failed'
      );
    });
  });
});
