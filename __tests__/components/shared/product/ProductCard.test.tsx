import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ProductCard from '@/components/shared/product/ProductCard';
import sampleData from '@/db/sample-data';

describe('ProductCard()', () => {
  it('should show product name', () => {
    render(<ProductCard product={sampleData.products[0]} />);
    expect(screen.getByText(sampleData.products[0].name)).toBeInTheDocument();
  });

  it("should show product image", () => {
    render(<ProductCard product={sampleData.products[0]} />);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it("should show product rating", () => {
    render(<ProductCard product={sampleData.products[0]} />);
    expect(screen.getByTestId("product-rating")).toBeInTheDocument();
    expect(screen.getByTestId("product-rating")).toHaveTextContent("Stars");
  });

  it("should show out of stock message", () => {
    render(<ProductCard product={sampleData.products[0]} />);
    if(sampleData.products[0].stock === 0) {
      expect(screen.getByText("Out of Stock")).toBeInTheDocument();
    }
  });
});
