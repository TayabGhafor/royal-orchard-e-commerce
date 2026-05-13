const { createCheckoutSession } = require("../../src/modules/payments/stripe.service");

describe("Stripe checkout session metadata", () => {
  test("includes metadata.orderId and metadata.userId", async () => {
    const orderId = "507f1f77bcf86cd799439011";
    const userId = "507f1f77bcf86cd799439012";
    const stripe = {
      checkout: {
        sessions: {
          create: jest.fn().mockResolvedValue({ id: "cs_test_123", url: "https://checkout.stripe.test/cs_test_123" }),
        },
      },
    };

    await createCheckoutSession({
      stripe,
      order: {
        _id: orderId,
        user: userId,
        items: [{ title: "Sindhri Mango", quantity: 1, price: 500 }],
        pricing: { shipping: 0, tax: 25 },
      },
      items: [{ title: "Sindhri Mango", quantity: 1, unitPrice: 500 }],
      customerEmail: "customer@example.com",
      userId,
      env: {},
    });

    expect(stripe.checkout.sessions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        metadata: {
          orderId,
          userId,
        },
      }),
    );
  });
});
