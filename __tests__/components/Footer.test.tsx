import { render, screen } from '@testing-library/react';
import Footer from '@/components/Footer';
import { describe, expect, it, beforeEach } from 'vitest';

describe('Footer()', () => {
  const expectedText = 'All Rights Reserved';
  let text: HTMLElement;

  beforeEach(() => {
    render(<Footer />);
    text = screen.getByText(expectedText);
  });

  it('should render text All Rights Reserved', () => {
    expect(text).toBeInTheDocument();
  });

  it('it should show the current date -> YEAR', () => {
    const currentYear = new Date().getFullYear();
    const year = screen.getByTestId('current-year');
    expect(year).toHaveTextContent(currentYear.toString());
  });
});
