import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import AdminSearch from "@/components/admin/AdminSearch";
import { usePathname, useSearchParams } from "next/navigation";
import ROUTES from "@/lib/routes";
import CONTENT_PAGE from "@/lib/content-page";
import { ReadonlyURLSearchParams } from "next/dist/client/components/navigation";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
  useSearchParams: vi.fn(),
}));

describe("AdminSearch", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Form action URL", () => {
    it("should use ADMIN_ORDERS when pathname includes orders", () => {
      vi.mocked(usePathname).mockReturnValue("/admin/orders");
      vi.mocked(useSearchParams).mockReturnValue({
        get: vi.fn(() => null),
        toString: vi.fn(() => ""),
      } as unknown as ReadonlyURLSearchParams);

      const { container } = render(<AdminSearch />);

      const form = container.querySelector("form");
      expect(form).toBeInTheDocument();
      expect(form).toHaveAttribute("action", ROUTES.ADMIN_ORDERS);
      expect(form).toHaveAttribute("method", "GET");
    });

    it("should use ADMIN_USERS when pathname includes users", () => {
      vi.mocked(usePathname).mockReturnValue("/admin/users");
      vi.mocked(useSearchParams).mockReturnValue({
        get: vi.fn(() => null),
        toString: vi.fn(() => ""),
      } as unknown as ReadonlyURLSearchParams);

      const { container } = render(<AdminSearch />);

      const form = container.querySelector("form");
      expect(form).toBeInTheDocument();
      expect(form).toHaveAttribute("action", ROUTES.ADMIN_USERS);
    });

    it("should use ADMIN_PRODUCTS as default when pathname includes products", () => {
      vi.mocked(usePathname).mockReturnValue("/admin/products");
      vi.mocked(useSearchParams).mockReturnValue({
        get: vi.fn(() => null),
        toString: vi.fn(() => ""),
      } as unknown as ReadonlyURLSearchParams);

      const { container } = render(<AdminSearch />);

      const form = container.querySelector("form");
      expect(form).toBeInTheDocument();
      expect(form).toHaveAttribute("action", ROUTES.ADMIN_PRODUCTS);
    });

    it("should use ADMIN_PRODUCTS as default for other admin paths", () => {
      vi.mocked(usePathname).mockReturnValue("/admin/overview");
      vi.mocked(useSearchParams).mockReturnValue({
        get: vi.fn(() => null),
        toString: vi.fn(() => ""),
      } as unknown as ReadonlyURLSearchParams);

      const { container } = render(<AdminSearch />);

      const form = container.querySelector("form");
      expect(form).toBeInTheDocument();
      expect(form).toHaveAttribute("action", ROUTES.ADMIN_PRODUCTS);
    });
  });

  describe("Input field", () => {
    it("should render search input with correct attributes", () => {
      vi.mocked(usePathname).mockReturnValue("/admin/products");
      vi.mocked(useSearchParams).mockReturnValue({
        get: vi.fn(() => null),
        toString: vi.fn(() => ""),
      } as unknown as ReadonlyURLSearchParams);

      render(<AdminSearch />);

      const input = screen.getByPlaceholderText(
        CONTENT_PAGE.ADMIN_SEARCH.search
      );
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute("type", "search");
      expect(input).toHaveAttribute("name", "query");
      expect(input).toHaveValue("");
    });

    it("should sync input value with searchParams query", () => {
      const queryValue = "test query";
      vi.mocked(usePathname).mockReturnValue("/admin/products");
      vi.mocked(useSearchParams).mockReturnValue({
        get: vi.fn((key: string) => (key === "query" ? queryValue : null)),
        toString: vi.fn(() => `query=${queryValue}`),
      } as unknown as ReadonlyURLSearchParams);

      render(<AdminSearch />);

      const input = screen.getByPlaceholderText(
        CONTENT_PAGE.ADMIN_SEARCH.search
      );
      expect(input).toHaveValue(queryValue);
    });

    it("should sync input value when searchParams has query", () => {
      vi.mocked(usePathname).mockReturnValue("/admin/products");
      vi.mocked(useSearchParams).mockReturnValue({
        get: vi.fn((key: string) =>
          key === "query" ? "existing query" : null
        ),
        toString: vi.fn(() => "query=existing+query"),
      } as unknown as ReadonlyURLSearchParams);

      render(<AdminSearch />);

      const input = screen.getByPlaceholderText(
        CONTENT_PAGE.ADMIN_SEARCH.search
      );
      expect(input).toHaveValue("existing query");
    });
  });

  describe("Submit button", () => {
    it("should render hidden submit button", () => {
      vi.mocked(usePathname).mockReturnValue("/admin/products");
      vi.mocked(useSearchParams).mockReturnValue({
        get: vi.fn(() => null),
        toString: vi.fn(() => ""),
      } as unknown as ReadonlyURLSearchParams);

      render(<AdminSearch />);

      const submitButton = screen.getByRole("button", { hidden: true });
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveAttribute("type", "submit");
      expect(submitButton).toHaveClass("sr-only");
      expect(submitButton).toHaveTextContent(CONTENT_PAGE.ADMIN_SEARCH.search);
    });
  });
});
