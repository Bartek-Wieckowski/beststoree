import { generateAccessToken, paypal } from "@/lib/paypal";
import { describe, it, expect } from "vitest";

describe("PayPal", () => {
  it("generates token from paypal", async () => {
    const tokenResponse = await generateAccessToken();
    console.log(tokenResponse);
    expect(typeof tokenResponse).toBe("string");
    expect(tokenResponse.length).toBeGreaterThan(0);
  });

  it("creates a paypal order", async () => {
    const token = await generateAccessToken();
    const price = 10.0;

    const orderResponse = await paypal.createOrder(price);
    console.log(orderResponse);

    expect(orderResponse).toHaveProperty("id");
    expect(orderResponse).toHaveProperty("status");
    expect(orderResponse.status).toBe("CREATED");
  });

  it("simulate capturing a payment from an order", async () => {
    const orderId = "100";

    const mockCapturePayment = vi
      .spyOn(paypal, "capturePayment")
      .mockResolvedValue({
        status: "COMPLETED",
      });

    const captureResponse = await paypal.capturePayment(orderId);
    expect(captureResponse).toHaveProperty("status", "COMPLETED");

    mockCapturePayment.mockRestore();
  });
});
