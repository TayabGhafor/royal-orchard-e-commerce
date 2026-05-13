const request = require("supertest");

const { createApp } = require("../../src/app");
const { startMongo, stopMongo, clearMongo } = require("../helpers/mongo");
const { Order } = require("../../src/modules/orders/order.model");
const { StripeEvent } = require("../../src/modules/payments/stripe-event.model");

const env = {
  NODE_ENV: "test",
  PORT: 0,
  MONGODB_URI: "mongodb://unused",
  JWT_SECRET: "test_secret_1234567890",
  JWT_EXPIRES_IN: "7d",
  CORS_ORIGINS: [],
  STRIPE_SECRET_KEY: "sk_test_123",
};

function buildCheckoutCompletedEvent({ eventId, orderId }) {
  return {
    id: eventId,
    type: "checkout.session.completed",
    data: {
      object: {
        id: "cs_test_123",
        metadata: { orderId },
        payment_intent: "pi_test_123",
      },
    },
  };
}

async function postStripeWebhook(app, event) {
  return request(app)
    .post("/api/payments/stripe/webhook")
    .set("Content-Type", "application/json")
    .send(event);
}

describe("Stripe webhook idempotency", () => {
  beforeAll(async () => {
    await startMongo();
  }, 120_000);

  afterAll(async () => {
    await stopMongo();
  }, 30_000);

  beforeEach(async () => {
    await clearMongo();
  });

  test("ignores duplicate webhook deliveries for the same event id", async () => {
    const app = createApp(env);
    const order = await Order.create({
      items: [],
      deliveryDetails: { name: "Customer", phone: "123", address: "Addr" },
      paymentMethod: "Card",
      paymentStatus: "Pending",
      pricing: { subtotal: 500, shipping: 0, tax: 0, total: 500 },
    });

    const event = buildCheckoutCompletedEvent({
      eventId: "evt_test_duplicate",
      orderId: order._id.toString(),
    });

    const first = await postStripeWebhook(app, event);
    expect(first.statusCode).toBe(200);
    expect(first.body).toEqual({ received: true });

    const paidOrder = await Order.findById(order._id).lean();
    expect(paidOrder.paymentStatus).toBe("Paid");
    expect(paidOrder.transactionId).toBe("pi_test_123");

    const storedEvents = await StripeEvent.find({ eventId: event.id }).lean();
    expect(storedEvents).toHaveLength(1);
    expect(storedEvents[0].eventType).toBe("checkout.session.completed");
    expect(storedEvents[0].processedAt).toBeInstanceOf(Date);

    const findByIdSpy = jest.spyOn(Order, "findById");
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    const second = await postStripeWebhook(app, event);
    expect(second.statusCode).toBe(200);
    expect(second.body).toEqual({ received: true });
    expect(findByIdSpy).not.toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith("[stripe webhook] duplicate event ignored", { eventId: event.id });

    const afterDuplicate = await Order.findById(order._id).lean();
    expect(afterDuplicate.paymentStatus).toBe("Paid");
    expect(await StripeEvent.countDocuments({ eventId: event.id })).toBe(1);

    findByIdSpy.mockRestore();
    logSpy.mockRestore();
  });
});
