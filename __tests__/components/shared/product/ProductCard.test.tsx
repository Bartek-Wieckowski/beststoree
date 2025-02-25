import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { convertTestProduct } from '@/__tests__/mocks/test-data';
import ProductCard from '@/components/shared/product/ProductCard';
import sampleData from '@/db/sample-data';

describe('ProductCard()', () => {
  const product = convertTestProduct(sampleData.products[0]);

  it('should show product name', () => {
    render(<ProductCard product={product} />);
    expect(screen.getByText(product.name)).toBeInTheDocument();
  });

  it('should show product image', () => {
    render(<ProductCard product={product} />);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('should show product rating', () => {
    render(<ProductCard product={product} />);
    expect(screen.getByTestId('product-rating')).toBeInTheDocument();
    expect(screen.getByTestId('product-rating')).toHaveTextContent('Stars');
  });

  it('should show out of stock message', () => {
    render(<ProductCard product={product} />);
    if (product.stock === 0) {
      expect(screen.getByText('Out of Stock')).toBeInTheDocument();
    }
  });
});
