import Menu from '@/components/shared/header/Menu';
import { screen, render } from '@testing-library/react';
import { describe, expect, it, beforeEach } from 'vitest';

describe('Menu()', () => {
  beforeEach(() => {
    render(<Menu />);
  });

  it('should have button with cart icon and Cart text', () => {
    const button = screen.getByTestId('cart-button');
    const icon = button.querySelector('svg');
    expect(icon).toBeInTheDocument();
    expect(button).toHaveTextContent('Cart');
  });

  it('should have button with user icon and Sign In text', () => {
    const button = screen.getByTestId('sign-in-button');
    const icon = button.querySelector('svg');
    expect(icon).toBeInTheDocument();
    expect(button).toHaveTextContent('Sign In');
  });

  it('should have link to cart page', () => {
    const link = screen.getByTestId('cart-button');
    expect(link).toHaveAttribute('href', '/cart');
  });

  it('should have link to sign in page', () => {
    const link = screen.getByTestId('sign-in-button');
    expect(link).toHaveAttribute('href', '/sign-in');
  });

  it('should have two nav html elements', () => {
    const navs = screen.getAllByRole('navigation');
    expect(navs).toHaveLength(2);
  });

  it('should have correct responsive classes for navigation elements', () => {
    const desktopNav = screen.getAllByRole('navigation', { hidden: true })[0];
    const mobileNav = screen.getAllByRole('navigation')[1];

    expect(desktopNav).toHaveClass('hidden', 'md:flex');
    expect(mobileNav).toHaveClass('md:hidden');
  });
});
