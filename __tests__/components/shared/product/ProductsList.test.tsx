import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ProductList from '@/components/shared/product/ProductList';
import sampleData from '@/db/sample-data';

describe('ProductList()', () => {
  it('should show text "No products found" when data is empty', () => {
    render(<ProductList data={[]} />);
    expect(screen.getByText('No products found')).toBeInTheDocument();
  });

  it('should show exact number of products when limit is applied', () => {
    render(<ProductList data={sampleData.products} limit={4} />);
    expect(screen.getAllByTestId('product-card')).toHaveLength(4);
  });
});
