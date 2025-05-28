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

export const mockCart = {
  items: [],
  itemsPrice: '0',
  totalPrice: '0',
  shippingPrice: '0',
  taxPrice: '0',
  sessionCartId: 'test-session-id',
  userId: 'test-user-id',
};

export const mockCartWithItems = {
  ...mockCart,
  items: [
    {
      productId: '1',
      name: 'Test Product',
      slug: 'test-product',
      qty: 1,
      image: '/test-image.jpg',
      price: '99.99',
    },
  ],
  itemsPrice: '99.99',
  totalPrice: '109.99',
};
