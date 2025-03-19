import Header from "@/components/shared/header/Header";
import { screen, render } from "@testing-library/react";
import { describe, expect, it, beforeEach, vi } from "vitest";

vi.mock("@/components/shared/header/Menu", () => ({
  default: () => <div>Mocked Menu</div>,
}));

describe("Header()", () => {
  const expectedCompanyName = "bestStoree";
  let companyName: HTMLElement;

  beforeEach(() => {
    render(<Header />);
    companyName = screen.getByText(expectedCompanyName);
  });

  it("should renders company name in header on desktop device", () => {
    expect(companyName).toBeInTheDocument();
  });

  it("should have hidden class on mobile", () => {
    expect(companyName).toHaveClass("hidden");
  });

  it("should have link to homepage", () => {
    const link = screen.getByTestId("logo-link");
    expect(link).toHaveAttribute("href", "/");
  });

  it("should Link wrapper have one image", () => {
    const linkWrapper = screen.getByTestId("logo-link");
    const image = linkWrapper.querySelector("img");
    expect(image).toBeInTheDocument();
  });
});
