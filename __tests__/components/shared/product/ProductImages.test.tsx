import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ProductImages from '@/components/shared/product/ProductImages';
import sampleData from '@/db/sample-data';
import { convertTestProduct } from '@/__tests__/mocks/test-data';
describe('ProductImages()', () => {
  const product = convertTestProduct(sampleData.products[0]);

  it('should show product image', () => {
    render(<ProductImages images={product.images} />);
    expect(screen.getByTestId('product-image-main')).toBeInTheDocument();
  });

  it('should show product thumbnails', () => {
    render(<ProductImages images={product.images} />);
    expect(screen.getAllByTestId('product-image-thumbnail')).toHaveLength(
      product.images.length
    );
  });
});
