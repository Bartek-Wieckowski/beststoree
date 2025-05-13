import { vi } from "vitest";

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => vi.fn(),
  // useRouter: () => ({
  //   push: vi.fn(),
  //   replace: vi.fn(),
  //   prefetch: vi.fn(),
  // }),
}));
