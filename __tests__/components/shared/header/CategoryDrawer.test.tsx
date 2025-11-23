import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, Mock, beforeEach } from "vitest";
import CategoryDrawer from "@/components/shared/header/CategoryDrawer";
import { getAllCategories } from "@/lib/actions/product.actions";
import ROUTES from "@/lib/routes";

vi.mock("@/lib/actions/product.actions", () => ({
  getAllCategories: vi.fn(),
}));

const mockedGetAllCategories = getAllCategories as Mock;

describe("CategoryDrawer()", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render categories with correct names and counts", async () => {
    const user = userEvent.setup();
    const mockCategories = [
      { category: "Men's Dress Shirts", _count: 5 },
      { category: "Men's Sweatshirts", _count: 1 },
    ];

    mockedGetAllCategories.mockResolvedValue(mockCategories);

    render(await CategoryDrawer());

    const trigger = screen.getByTestId("category-drawer-trigger");
    await user.click(trigger);

    expect(screen.getByTestId("category-drawer-content")).toBeInTheDocument();
    expect(screen.getByText("Men's Dress Shirts (5)")).toBeInTheDocument();
    expect(screen.getByText("Men's Sweatshirts (1)")).toBeInTheDocument();
  });

  it("should render category links with correct href attributes", async () => {
    const user = userEvent.setup();
    const mockCategories = [
      { category: "Men's Dress Shirts", _count: 5 },
      { category: "Men's Sweatshirts", _count: 1 },
    ];

    mockedGetAllCategories.mockResolvedValue(mockCategories);

    render(await CategoryDrawer());

    const trigger = screen.getByTestId("category-drawer-trigger");
    await user.click(trigger);

    const firstCategoryLink = screen.getByText("Men's Dress Shirts (5)");
    const secondCategoryLink = screen.getByText("Men's Sweatshirts (1)");

    expect(firstCategoryLink.closest("a")).toHaveAttribute(
      "href",
      ROUTES.CATEGORY("Men's Dress Shirts")
    );
    expect(secondCategoryLink.closest("a")).toHaveAttribute(
      "href",
      ROUTES.CATEGORY("Men's Sweatshirts")
    );
  });
});
