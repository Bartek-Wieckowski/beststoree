import { render, RenderResult, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { Session } from "next-auth";
import { auth } from "@/auth";
import { getAllProducts } from "@/lib/actions/product.actions";
import AdminProductsPage from "@/app/admin/products/page";

vi.mock("@/auth", () => ({
  auth: vi.fn().mockResolvedValue(null),
}));

vi.mock("@/lib/actions/product.actions", () => ({
  getAllProducts: vi.fn(),
}));

const mockedAuth = auth as Mock;
const mockedGetAllProducts = getAllProducts as Mock;

async function renderAdminProductsPage(
  page: string = "1",
  query: string = "all",
  category: string = ""
): Promise<RenderResult> {
  const Component = await AdminProductsPage({
    searchParams: Promise.resolve({ page, query, category }),
  });
  return render(Component);
}

describe("AdminProductsPage", () => {
  beforeEach(async () => {
    vi.clearAllMocks();

    mockedAuth.mockResolvedValue({
      user: {
        id: "admin-user-id",
        role: "admin",
      },
    } as Session);

    mockedGetAllProducts.mockResolvedValue({
      data: [],
      totalPages: 1,
    });

    await renderAdminProductsPage();
  });

  it("should render h1 with correct text", () => {
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Products");
  });

  it("should render button to create product", () => {
    const button = screen.getByTestId("create-product-button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Create Product");
  });
});
