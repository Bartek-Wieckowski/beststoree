import sampleData from '@/db/sample-data';

export const convertTestProduct = (
  product: (typeof sampleData.products)[0]
) => ({
  ...product,
  id: product.slug,
  price: product.price.toString(),
  rating: product.rating.toString(),
  createdAt: new Date(),
});

export const convertTestProductArray = (products: typeof sampleData.products) =>
  products.map((product) => ({
    ...product,
    id: product.slug,
    price: product.price.toString(),
    rating: product.rating.toString(),
    createdAt: new Date(),
  }));
