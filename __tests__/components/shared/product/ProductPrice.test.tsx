import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ProductPrice from '@/components/shared/product/ProductPrice';

describe('ProductPrice()', () => {
  it('should show price', () => {
    render(<ProductPrice value={100} />);
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('should have two span elements with align-super', () => {
    render(<ProductPrice value={100} />);
    const wrapper = screen.getByTestId('product-price-wrapper');
    expect(wrapper).toBeInTheDocument();
    expect(wrapper.children).toHaveLength(2);
    expect(wrapper.children[0]).toHaveClass('align-super');
    expect(wrapper.children[1]).toHaveClass('align-super');
  });

  it('should display pass classname to className prop', () => {
    render(<ProductPrice value={100} className="text-red-500" />);
    const wrapper = screen.getByTestId('product-price-wrapper');
    expect(wrapper).toHaveClass('text-red-500');
  });
});
