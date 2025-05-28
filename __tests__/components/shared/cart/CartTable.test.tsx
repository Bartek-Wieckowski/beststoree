import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import CartTable from '@/app/(root)/cart/CartTable';
import { mockCart, mockCartWithItems } from '@/__tests__/mocks/test-data';
import { describe, expect, it } from 'vitest';

describe('CartTable', () => {
  it('should render empty cart message when no items', () => {
    render(<CartTable cart={mockCart} />);
    expect(screen.getByText(/cart is empty/i)).toBeInTheDocument();
  });

  it('should render cart items correctly', () => {
    render(<CartTable cart={mockCartWithItems} />);
    const table = screen.getByRole('table');
    const rows = within(table).getAllByRole('row');
    const priceCells = within(rows[1]).getAllByRole('cell');

    expect(priceCells[0]).toHaveTextContent(mockCartWithItems.items[0].name);
    expect(priceCells[2]).toHaveTextContent('$99.99');
  });

  it('should display correct subtotal with quantity', () => {
    render(<CartTable cart={mockCartWithItems} />);
    expect(screen.getByText(/subtotal \(1\)/i)).toBeInTheDocument();
  });
});
