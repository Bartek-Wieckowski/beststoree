import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import ProductForm from "@/components/admin/ProductForm";

describe("AdminProductForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Form fields", () => {
    it("should render all input fields", () => {
      render(<ProductForm type="Create" />);

      const inputs = screen.getAllByRole("textbox");
      expect(inputs).toHaveLength(7);
    });

    it("should render all labels", () => {
      render(<ProductForm type="Create" />);

      expect(screen.getByText("Name")).toBeInTheDocument();
      expect(screen.getByText("Slug")).toBeInTheDocument();
      expect(screen.getByText("Category")).toBeInTheDocument();
      expect(screen.getByText("Brand")).toBeInTheDocument();
      expect(screen.getByText("Price")).toBeInTheDocument();
      expect(screen.getByText("Stock")).toBeInTheDocument();
      expect(screen.getByText("Description")).toBeInTheDocument();
    });

    it("should render textarea for description", () => {
      render(<ProductForm type="Create" />);

      const textarea = screen.getByPlaceholderText("Enter product description");
      expect(textarea.tagName).toBe("TEXTAREA");
    });
  });
});
