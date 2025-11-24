import Stripe from "stripe";
import { describe, it, expect, vi } from "vitest";

describe("Stripe", () => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

  it("creates a payment intent", async () => {
    const amount = 10.0;
    const orderId = "test-order-123";

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: "USD",
      metadata: { orderId },
    });

    console.log(paymentIntent);

    expect(paymentIntent).toHaveProperty("id");
    expect(paymentIntent).toHaveProperty("client_secret");
    expect(paymentIntent).toHaveProperty("status");
    expect(typeof paymentIntent.id).toBe("string");
    expect(typeof paymentIntent.client_secret).toBe("string");
    expect(paymentIntent.id.length).toBeGreaterThan(0);
    expect(paymentIntent.client_secret?.length).toBeGreaterThan(0);
    expect(paymentIntent.metadata.orderId).toBe(orderId);
  });

  it("retrieves a payment intent", async () => {
    // First create a payment intent to retrieve
    const amount = 10.0;
    const orderId = "test-order-456";
    const createdPaymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "USD",
      metadata: { orderId },
    });

    const retrievedPaymentIntent = await stripe.paymentIntents.retrieve(
      createdPaymentIntent.id
    );
    console.log(retrievedPaymentIntent);

    expect(retrievedPaymentIntent).toHaveProperty("id");
    expect(retrievedPaymentIntent).toHaveProperty("status");
    expect(retrievedPaymentIntent).toHaveProperty("amount");
    expect(retrievedPaymentIntent).toHaveProperty("currency");
    expect(retrievedPaymentIntent.id).toBe(createdPaymentIntent.id);
    expect(retrievedPaymentIntent.amount).toBe(Math.round(amount * 100));
    expect(retrievedPaymentIntent.currency).toBe("usd");
  });

  it("simulates confirming a payment intent", async () => {
    const paymentIntentId = "pi_test_123";

    const mockConfirmPaymentIntent = vi
      .spyOn(stripe.paymentIntents, "confirm")
      .mockResolvedValue({
        id: paymentIntentId,
        status: "succeeded",
        lastResponse: {
          headers: {},
          requestId: "test",
          statusCode: 200,
        },
      } as Stripe.PaymentIntent & {
        lastResponse: {
          headers: Record<string, string>;
          requestId: string;
          statusCode: number;
        };
      });

    const confirmResponse = await stripe.paymentIntents.confirm(
      paymentIntentId
    );
    expect(confirmResponse).toHaveProperty("id", paymentIntentId);
    expect(confirmResponse).toHaveProperty("status", "succeeded");

    mockConfirmPaymentIntent.mockRestore();
  });
});
