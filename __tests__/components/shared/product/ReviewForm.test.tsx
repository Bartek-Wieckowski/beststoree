import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, Mock, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import ReviewForm from "@/app/(root)/product/[slug]/ReviewForm";
import { getReviewByProductId } from "@/lib/actions/review.actions";

vi.mock("@/lib/actions/review.actions", () => ({
  getReviewByProductId: vi.fn(),
}));

vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

const mockedGetReviewByProductId = getReviewByProductId as Mock;

describe("ReviewForm()", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render button to open review form", () => {
    render(
      <ReviewForm
        userId="user-123"
        productId="product-123"
        onReviewSubmitted={vi.fn()}
      />
    );

    const button = screen.getByRole("button", {
      name: "Write a Review",
    });
    expect(button).toBeInTheDocument();
  });

  it("should render form fields when dialog is opened", async () => {
    const user = userEvent.setup();
    mockedGetReviewByProductId.mockResolvedValue(null);

    render(
      <ReviewForm
        userId="user-123"
        productId="product-123"
        onReviewSubmitted={vi.fn()}
      />
    );

    const button = screen.getByRole("button", {
      name: "Write a Review",
    });
    await user.click(button);

    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getByText("Rating")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter title")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter description")
    ).toBeInTheDocument();
  });
});
