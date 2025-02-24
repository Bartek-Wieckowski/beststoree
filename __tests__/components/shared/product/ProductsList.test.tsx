import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ProductList from '@/components/shared/product/ProductList';
import sampleData from '@/db/sample-data';

const convertTestData = (products: typeof sampleData.products) =>
  products.map((product) => ({
    ...product,
    id: product.slug,
    price: product.price.toString(),
    rating: product.rating.toString(),
    createdAt: new Date(),
  }));

describe('ProductList()', () => {
  it('should show text "No products found" when data is empty', () => {
    render(<ProductList data={[]} />);
    expect(screen.getByText('No products found')).toBeInTheDocument();
  });

  it('should show exact number of products when limit is applied', () => {
    const testProducts = convertTestData(sampleData.products);
    render(<ProductList data={testProducts} limit={4} />);
    expect(screen.getAllByTestId('product-card')).toHaveLength(4);
  });
});
