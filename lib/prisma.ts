import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient().$extends({
  result: {
    product: {
      price: {
        needs: { price: true },
        compute(product) {
          return product.price.toString();
        }
      },
      rating: {
        needs: { rating: true },
        compute(product) {
          return product.rating.toString();
        }
      }
    }
  }
}); 