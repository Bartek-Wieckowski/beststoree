import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import IconBoxes from "@/components/IconBoxes";
import CONTENT_PAGE from "@/lib/content-page";

describe("IconBoxes()", () => {
  it("should render all four icon boxes with correct titles", () => {
    render(<IconBoxes />);

    expect(
      screen.getByText(CONTENT_PAGE.COMPONENT.ICON_BOXES.freeShipping)
    ).toBeInTheDocument();
    expect(
      screen.getByText(CONTENT_PAGE.COMPONENT.ICON_BOXES.moneyBackGuarantee)
    ).toBeInTheDocument();
    expect(
      screen.getByText(CONTENT_PAGE.COMPONENT.ICON_BOXES.flexiblePayment)
    ).toBeInTheDocument();
    expect(
      screen.getByText(CONTENT_PAGE.COMPONENT.ICON_BOXES.support)
    ).toBeInTheDocument();
  });

  it("should render all four icon boxes with correct descriptions", () => {
    render(<IconBoxes />);

    expect(
      screen.getByText(CONTENT_PAGE.COMPONENT.ICON_BOXES.freeShippingDescription)
    ).toBeInTheDocument();
    expect(
      screen.getByText(CONTENT_PAGE.COMPONENT.ICON_BOXES.moneyBackGuaranteeDescription)
    ).toBeInTheDocument();
    expect(
      screen.getByText(CONTENT_PAGE.COMPONENT.ICON_BOXES.flexiblePaymentDescription)
    ).toBeInTheDocument();
    expect(
      screen.getByText(CONTENT_PAGE.COMPONENT.ICON_BOXES.supportDescription)
    ).toBeInTheDocument();
  });
});
