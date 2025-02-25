'use server';

import { prisma } from '../prisma';
import { convertToPlanObject } from '../utils';
import { LATEST_PRODUCTS_LIMIT } from '../constants';

export async function getLatestProducts() {
  const data = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: {
      createdAt: 'desc',
    },
  });

  return convertToPlanObject(data);
}

export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findFirst({
    where: { slug },
  });

  return convertToPlanObject(product);
}
