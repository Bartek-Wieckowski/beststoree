import { generateAccessToken, paypal } from "@/lib/paypal";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("PayPal", () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    // Mock fetch globally for PayPal tests
    global.fetch = mockFetch;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("generates token from paypal", async () => {
    const mockToken = "mock-access-token-12345";
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ access_token: mockToken }),
    } as Response);

    const tokenResponse = await generateAccessToken();
    expect(typeof tokenResponse).toBe("string");
    expect(tokenResponse.length).toBeGreaterThan(0);
    expect(tokenResponse).toBe(mockToken);
  });

  it("creates a paypal order", async () => {
    const mockToken = "mock-access-token-12345";
    const mockOrder = {
      id: "ORDER123",
      status: "CREATED",
    };

    // Mock token generation
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ access_token: mockToken }),
    } as Response);

    // Mock order creation
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockOrder,
    } as Response);

    const price = 10.0;
    const orderResponse = await paypal.createOrder(price);

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
