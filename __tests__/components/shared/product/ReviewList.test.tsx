import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, Mock, beforeEach } from "vitest";
import ReviewList from "@/app/(root)/product/[slug]/ReviewList";
import { getReviews } from "@/lib/actions/review.actions";

vi.mock("@/lib/actions/review.actions", () => ({
  getReviews: vi.fn(),
}));

const mockedGetReviews = getReviews as Mock;

describe("ReviewList()", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render 'No reviews yet' message when there are no reviews", async () => {
    mockedGetReviews.mockResolvedValue({ data: [] });

    render(
      <ReviewList
        userId="user-123"
        productId="product-123"
        productSlug="test-product"
      />
    );

    expect(await screen.findByText("No reviews yet")).toBeInTheDocument();
  });

  it("should render ReviewForm when userId is provided", async () => {
    mockedGetReviews.mockResolvedValue({ data: [] });

    render(
      <ReviewList
        userId="user-123"
        productId="product-123"
        productSlug="test-product"
      />
    );

    expect(
      await screen.findByRole("button", {
        name: "Write a Review",
      })
    ).toBeInTheDocument();
  });
});
