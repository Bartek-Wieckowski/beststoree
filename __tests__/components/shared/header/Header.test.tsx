import Header from '@/components/shared/header/Header';
import { screen, render } from '@testing-library/react';
import { describe, expect, it, beforeEach } from 'vitest';

describe('Header()', () => {
  const expectedCompanyName = 'bestStoree';
  let companyName: HTMLElement;

  beforeEach(() => {
    render(<Header />);
    companyName = screen.getByText(expectedCompanyName);
  });

  it('should renders company name in header on desktop device', () => {
    expect(companyName).toBeInTheDocument();
  });

  it('should have hidden class on mobile', () => {
    expect(companyName).toHaveClass('hidden');
  });

  it('should Link wrapper have one image', () => {
    const linkWrapper = screen.getByTestId('logo-link');
    const image = linkWrapper.querySelector('img');
    expect(image).toBeInTheDocument();
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

  it('should have link to homepage', () => {
    const link = screen.getByTestId('logo-link');
    expect(link).toHaveAttribute('href', '/');
  });

  it('should have link to cart page', () => {
    const link = screen.getByTestId('cart-button');
    expect(link).toHaveAttribute('href', '/cart');
  });

  it('should have link to sign in page', () => {
    const link = screen.getByTestId('sign-in-button');
    expect(link).toHaveAttribute('href', '/sign-in');
  });
});
