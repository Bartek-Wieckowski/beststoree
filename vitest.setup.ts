import '@testing-library/jest-dom/vitest';
import '@testing-library/jest-dom';
import { afterEach, beforeAll, beforeEach, vi } from 'vitest';
import { cleanup, render, RenderOptions } from '@testing-library/react';
import { Providers } from './components/providers/Providers';
import { ReactElement } from 'react';

beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

beforeEach(() => {
  vi.clearAllMocks();
});

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: Providers, ...options });

export * from '@testing-library/react';
export { customRender as render };
