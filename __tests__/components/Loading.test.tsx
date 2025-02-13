import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Loading from '@/app/loading';

describe('Loading component', () => {
  it('should render the loading component', () => {
    render(<Loading />);
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });
});
