import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import ModeToggle from '@/components/shared/header/ModeToggle';
import { ThemeProvider } from 'next-themes';

describe('ModeToggle()', () => {
  it('should render sun icon in light mode', () => {
    render(
      <ThemeProvider attribute="class" defaultTheme="light">
        <ModeToggle />
      </ThemeProvider>
    );

    expect(screen.getByTestId('sun-icon')).toBeInTheDocument();
  });

  it('should render moon icon in dark mode or system mode', () => {
    render(
      <ThemeProvider attribute="class" defaultTheme="dark">
        <ModeToggle />
      </ThemeProvider>
    );

    expect(screen.getByTestId('moon-icon')).toBeInTheDocument();
  });

  it('should render sun-moon icon in dark mode or system mode', () => {
    render(
      <ThemeProvider attribute="class" defaultTheme="system">
        <ModeToggle />
      </ThemeProvider>
    );

    expect(screen.getByTestId('sun-moon-icon')).toBeInTheDocument();
  });

  it('should show theme options when toggle button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider attribute="class" defaultTheme="system">
        <ModeToggle />
      </ThemeProvider>
    );

    const toggleButton = screen.getByTestId('theme-toggle');
    await user.click(toggleButton);

    expect(screen.getByTestId('theme-options')).toBeVisible();
    expect(screen.getByText('Light')).toBeVisible();
    expect(screen.getByText('Dark')).toBeVisible();
    expect(screen.getByText('System')).toBeVisible();
  });

  it('should show checked state for current theme option', async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider attribute="class" defaultTheme="light">
        <ModeToggle />
      </ThemeProvider>
    );

    const toggleButton = screen.getByTestId('theme-toggle');
    await user.click(toggleButton);

    expect(screen.getByTestId('theme-options')).toBeVisible();

    const lightItem = screen
      .getByRole('menuitemcheckbox', { name: 'Light' })
      .closest('[data-state]');
    const darkItem = screen
      .getByRole('menuitemcheckbox', { name: 'Dark' })
      .closest('[data-state]');
    const systemItem = screen
      .getByRole('menuitemcheckbox', { name: 'System' })
      .closest('[data-state]');

    expect(lightItem).toHaveAttribute('data-state', 'checked');
    expect(darkItem).toHaveAttribute('data-state', 'unchecked');
    expect(systemItem).toHaveAttribute('data-state', 'unchecked');
  });
});
