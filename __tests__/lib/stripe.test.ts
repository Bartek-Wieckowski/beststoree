import Stripe from "stripe";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("Stripe", () => {
  let stripe: Stripe;

  beforeEach(() => {
    // Use a mock/test key - this won't actually make API calls if we mock the methods
    stripe = new Stripe("sk_test_mock_key_for_testing");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("creates a payment intent", async () => {
    const amount = 10.0;
    const orderId = "test-order-123";

    const mockPaymentIntent = {
      id: "pi_test_1234567890",
      client_secret: "pi_test_1234567890_secret_abcdef",
      status: "requires_payment_method",
      amount: Math.round(amount * 100),
      currency: "usd",
      metadata: { orderId },
      lastResponse: {
        headers: {},
        requestId: "test",
        statusCode: 200,
      },
    } as unknown as Stripe.PaymentIntent & {
      lastResponse: {
        headers: Record<string, string>;
        requestId: string;
        statusCode: number;
      };
    };

    const mockCreate = vi
      .spyOn(stripe.paymentIntents, "create")
      .mockResolvedValue(mockPaymentIntent);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: "USD",
      metadata: { orderId },
    });

    expect(paymentIntent).toHaveProperty("id");
    expect(paymentIntent).toHaveProperty("client_secret");
    expect(paymentIntent).toHaveProperty("status");
    expect(typeof paymentIntent.id).toBe("string");
    expect(typeof paymentIntent.client_secret).toBe("string");
    expect(paymentIntent.id.length).toBeGreaterThan(0);
    expect(paymentIntent.client_secret?.length).toBeGreaterThan(0);
    expect(paymentIntent.metadata.orderId).toBe(orderId);
    expect(mockCreate).toHaveBeenCalledWith({
      amount: Math.round(amount * 100),
      currency: "USD",
      metadata: { orderId },
    });
  });

  it("retrieves a payment intent", async () => {
    const amount = 10.0;
    const orderId = "test-order-456";
    const paymentIntentId = "pi_test_retrieve_123";

    const mockCreatedPaymentIntent = {
      id: paymentIntentId,
      client_secret: "pi_test_retrieve_123_secret",
      status: "requires_payment_method",
      amount: Math.round(amount * 100),
      currency: "usd",
      metadata: { orderId },
      lastResponse: {
        headers: {},
        requestId: "test",
        statusCode: 200,
      },
    } as unknown as Stripe.PaymentIntent & {
      lastResponse: {
        headers: Record<string, string>;
        requestId: string;
        statusCode: number;
      };
    };

    const mockCreate = vi
      .spyOn(stripe.paymentIntents, "create")
      .mockResolvedValue(mockCreatedPaymentIntent);
    const mockRetrieve = vi
      .spyOn(stripe.paymentIntents, "retrieve")
      .mockResolvedValue(mockCreatedPaymentIntent);

    const createdPaymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "USD",
      metadata: { orderId },
    });

    const retrievedPaymentIntent = await stripe.paymentIntents.retrieve(
      createdPaymentIntent.id
    );

    expect(retrievedPaymentIntent).toHaveProperty("id");
    expect(retrievedPaymentIntent).toHaveProperty("status");
    expect(retrievedPaymentIntent).toHaveProperty("amount");
    expect(retrievedPaymentIntent).toHaveProperty("currency");
    expect(retrievedPaymentIntent.id).toBe(createdPaymentIntent.id);
    expect(retrievedPaymentIntent.amount).toBe(Math.round(amount * 100));
    expect(retrievedPaymentIntent.currency).toBe("usd");
    expect(mockCreate).toHaveBeenCalledWith({
      amount: Math.round(amount * 100),
      currency: "USD",
      metadata: { orderId },
    });
    expect(mockRetrieve).toHaveBeenCalledWith(paymentIntentId);
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
