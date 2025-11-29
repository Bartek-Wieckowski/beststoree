import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ProductCarousel from "@/components/shared/product/ProductCarousel";
import { convertTestProductArray } from "@/__tests__/mocks/test-data";
import sampleData from "@/db/sample-data";
import ROUTES from "@/lib/routes";

describe("ProductCarousel()", () => {
  const featuredProducts = sampleData.products
    .filter((product) => product.isFeatured && product.banner)
    .map((product) => ({
      ...product,
      banner: product.banner?.startsWith('/') ? product.banner : `/${product.banner}`,
    }));
  const testProducts = convertTestProductArray(featuredProducts);

  it("should render products with correct names and links", () => {
    render(<ProductCarousel data={testProducts} />);

    testProducts.forEach((product) => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
      const link = screen.getByRole("link", {
        name: new RegExp(product.name),
      });
      expect(link).toHaveAttribute("href", ROUTES.PRODUCT(product.slug));
    });
  });

  it("should render carousel navigation buttons", () => {
    render(<ProductCarousel data={testProducts} />);

    const previousButton = screen.getByRole("button", { name: /previous/i });
    const nextButton = screen.getByRole("button", { name: /next/i });

    expect(previousButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
  });
});
