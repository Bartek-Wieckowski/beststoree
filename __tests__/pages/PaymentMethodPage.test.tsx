import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import PaymentMethodForm from "@/app/(root)/payment-method/PaymentMethodForm";
import { PAYMENT_METHODS, DEFAULT_PAYMENT_METHOD } from "@/lib/constants";

describe("PaymentMethodForm", () => {
  it("should render h1 with correct text and paragraph with correct description", () => {
    render(<PaymentMethodForm preferredPaymentMethod={null} />);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Payment Method");

    const description = screen.getByText("Please select a payment method");
    expect(description).toBeInTheDocument();
    expect(description.tagName.toLowerCase()).toBe("p");
  });

  it("should render correct number of radio inputs and have default option selected", () => {
    render(<PaymentMethodForm preferredPaymentMethod={null} />);

    const radioButtons = screen.getAllByRole("radio");
    expect(radioButtons).toHaveLength(PAYMENT_METHODS.length);

    PAYMENT_METHODS.forEach((method) => {
      const radio = screen.getByRole("radio", { name: method });
      expect(radio).toBeInTheDocument();
    });

    const defaultRadio = screen.getByRole("radio", {
      name: DEFAULT_PAYMENT_METHOD,
    });
    expect(defaultRadio).toHaveAttribute("data-state", "checked");

    const checkedRadios = radioButtons.filter(
      (radio) => radio.getAttribute("data-state") === "checked"
    );
    expect(checkedRadios).toHaveLength(1);
    expect(checkedRadios[0]).toHaveAttribute("value", DEFAULT_PAYMENT_METHOD);
  });
});
