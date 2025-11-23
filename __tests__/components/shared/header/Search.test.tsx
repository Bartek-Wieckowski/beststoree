import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, Mock, beforeEach } from "vitest";
import Search from "@/components/shared/header/Search";
import { getAllCategories } from "@/lib/actions/product.actions";
import CONTENT_PAGE from "@/lib/content-page";

vi.mock("@/lib/actions/product.actions", () => ({
  getAllCategories: vi.fn(),
}));

const mockedGetAllCategories = getAllCategories as Mock;

describe("Search()", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Form action URL", () => {
    it("should use SEARCH route for form action", async () => {
      mockedGetAllCategories.mockResolvedValue([]);

      const { container } = render(await Search());

      const form = container.querySelector("form");
      expect(form).toBeInTheDocument();
      expect(form).toHaveAttribute("action", "/search");
      expect(form).toHaveAttribute("method", "GET");
    });
  });

  describe("Category select", () => {
    it("should render select with All option and categories", async () => {
      const mockCategories = [
        { category: "Men's Dress Shirts", _count: 5 },
        { category: "Men's Sweatshirts", _count: 1 },
      ];

      mockedGetAllCategories.mockResolvedValue(mockCategories);

      const { container } = render(await Search());

      const selectTrigger = screen.getByRole("combobox");
      expect(selectTrigger).toBeInTheDocument();

      const hiddenSelect = container.querySelector(
        'select[name="category"]'
      ) as HTMLSelectElement;
      expect(hiddenSelect).toBeInTheDocument();

      const options = hiddenSelect.querySelectorAll("option");
      expect(options).toHaveLength(4); // empty option + All + 2 categories

      const allOption = Array.from(options).find((opt) => opt.value === "all");
      expect(allOption).toHaveTextContent("All");

      const dressShirtsOption = Array.from(options).find(
        (opt) => opt.value === "Men's Dress Shirts"
      );
      expect(dressShirtsOption).toHaveTextContent("Men's Dress Shirts");

      const sweatshirtsOption = Array.from(options).find(
        (opt) => opt.value === "Men's Sweatshirts"
      );
      expect(sweatshirtsOption).toHaveTextContent("Men's Sweatshirts");
    });

    it("should render select with correct placeholder", async () => {
      mockedGetAllCategories.mockResolvedValue([]);

      render(await Search());

      const selectTrigger = screen.getByRole("combobox");
      expect(selectTrigger).toBeInTheDocument();
      expect(selectTrigger).toHaveTextContent("All");
    });

    it("should have hidden select element with name attribute for form submission", async () => {
      mockedGetAllCategories.mockResolvedValue([]);

      const { container } = render(await Search());

      const hiddenSelect = container.querySelector('select[name="category"]');
      expect(hiddenSelect).toBeInTheDocument();
      expect(hiddenSelect).toHaveAttribute("aria-hidden", "true");
    });
  });

  describe("Search input field", () => {
    it("should render search input with correct attributes", async () => {
      mockedGetAllCategories.mockResolvedValue([]);

      render(await Search());

      const input = screen.getByPlaceholderText(CONTENT_PAGE.SEARCH.search);
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute("type", "text");
      expect(input).toHaveAttribute("name", "q");
      expect(input).toHaveValue("");
    });
  });

  describe("Submit button", () => {
    it("should render submit button with search icon", async () => {
      mockedGetAllCategories.mockResolvedValue([]);

      render(await Search());

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
      const icon = button.querySelector("svg");
      expect(icon).toBeInTheDocument();
    });
  });
});
