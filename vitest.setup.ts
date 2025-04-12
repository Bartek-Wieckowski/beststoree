import "@testing-library/jest-dom/vitest";
import "@testing-library/jest-dom";
import { afterEach, beforeAll, beforeEach, vi } from "vitest";
import { cleanup, render, RenderOptions } from "@testing-library/react";
import { Providers } from "./components/providers/Providers";
import { ReactElement } from "react";
import "./__tests__/mocks/prisma.mock";
import "./__tests__/mocks/auth.mock";
import "./__tests__/mocks/next.mock";

beforeAll(() => {
  // Mock ResizeObserver
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };

  // Mock matchMedia
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

beforeEach(() => {
  vi.spyOn(console, "log").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.clearAllMocks();
});

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) => render(ui, { wrapper: Providers, ...options });

export * from "@testing-library/react";
export { customRender as render };
