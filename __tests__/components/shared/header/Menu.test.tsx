import Menu from "@/components/shared/header/Menu";
import { screen, render } from "@testing-library/react";
import { describe, expect, it, beforeEach, vi, Mock } from "vitest";
import { getMyCart } from "@/lib/actions/cart.actions";

vi.mock("@/components/shared/header/UserButton", () => ({
  default: () => <div>Mocked UserButton</div>,
}));

vi.mock("@/lib/actions/cart.actions", () => ({
  getMyCart: vi.fn(),
}));

const mockedGetMyCart = getMyCart as Mock;

describe("Menu()", () => {
  beforeEach(async () => {
    mockedGetMyCart.mockResolvedValue(undefined);
    render(await Menu());
  });

  it("should have button with cart icon and Cart text", () => {
    const button = screen.getByTestId("cart-button");
    const icon = button.querySelector("svg");
    expect(icon).toBeInTheDocument();
    // Text is now in sr-only span, so we check for it in the document
    expect(screen.getByText("Cart")).toBeInTheDocument();
  });

  it("should have link to cart page", () => {
    const link = screen.getByTestId("cart-button");
    expect(link).toHaveAttribute("href", "/cart");
  });

  it("should have two nav html elements", () => {
    const navs = screen.getAllByRole("navigation");
    expect(navs).toHaveLength(2);
  });

  it("should have correct responsive classes for navigation elements", () => {
    const desktopNav = screen.getAllByRole("navigation", { hidden: true })[0];
    const mobileNav = screen.getAllByRole("navigation")[1];

    expect(desktopNav).toHaveClass("hidden", "md:flex");
    expect(mobileNav).toHaveClass("md:hidden");
  });
});
