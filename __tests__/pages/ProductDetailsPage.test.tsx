// vi.mock("@/lib/actions/product.actions", () => ({
//   getProductBySlug: vi.fn(),
//   // getMyCart: vi.fn(),
// }));

import { render, screen, waitFor, RenderResult } from "@testing-library/react";
import { describe, expect, it, vi, Mock, beforeEach } from "vitest";
import ProductDetailsPage from "@/app/(root)/product/[slug]/page";
import { getProductBySlug } from "@/lib/actions/product.actions";
import { getMyCart } from "@/lib/actions/cart.actions";
import sampleData from "@/db/sample-data";
import { convertTestProduct } from "../mocks/test-data";

// Mock both functions
vi.mock("@/lib/actions/product.actions", () => ({
  getProductBySlug: vi.fn()
}));

vi.mock("@/lib/actions/cart.actions", () => ({
  getMyCart: vi.fn()
}));

const mockedGetProductBySlug = getProductBySlug as Mock;
const mockedGetMyCart = getMyCart as Mock;

async function renderProductPage(slug: string): Promise<RenderResult> {
  const Component = await ProductDetailsPage({
    params: Promise.resolve({ slug }),
  });
  return render(Component);
}

describe("ProductDetailsPage()", () => {
  const testProduct = convertTestProduct(sampleData.products[0]);

  beforeEach(() => {
    mockedGetProductBySlug.mockResolvedValue(testProduct);
    mockedGetMyCart.mockResolvedValue(undefined);
  });

  it("should render ProductImages component", async () => {
    await renderProductPage(testProduct.slug);

    await waitFor(() => {
      expect(screen.getByTestId("product-image-main")).toBeInTheDocument();
      expect(
        screen.getAllByTestId("product-image-thumbnail").length,
      ).toBeGreaterThan(0);
    });
  });

  it("should render product details correctly", async () => {
    await renderProductPage(testProduct.slug);

    await waitFor(() => {
      expect(screen.getByTestId("product-name")).toHaveTextContent(
        testProduct.name,
      );
      expect(screen.getByTestId("product-brand")).toHaveTextContent(
        testProduct.brand,
      );
      expect(screen.getByTestId("product-description")).toHaveTextContent(
        testProduct.description,
      );
    });
  });

  it("should render Button component when product is in stock", async () => {
    mockedGetProductBySlug.mockResolvedValue({
      ...testProduct,
      stock: 5,
    });

    await renderProductPage(testProduct.slug);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /add to cart/i }),
      ).toBeInTheDocument();
    });
  });

  it("should not render Button component when product is out of stock", async () => {
    mockedGetProductBySlug.mockResolvedValue({
      ...testProduct,
      stock: 0,
    });

    await renderProductPage(testProduct.slug);

    await waitFor(() => {
      expect(
        screen.queryByRole("button", { name: /add to cart/i }),
      ).not.toBeInTheDocument();
    });
  });
});
