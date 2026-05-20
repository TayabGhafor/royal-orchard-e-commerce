const request = require("supertest");
const mongoose = require("mongoose");

const { createApp } = require("../../src/app");
const { startMongo, stopMongo, clearMongo } = require("../helpers/mongo");
const { Product } = require("../../src/modules/products/product.model");
const { User } = require("../../src/modules/users/user.model");
const { Order } = require("../../src/modules/orders/order.model");
const { hashPassword } = require("../../src/utils/hashPassword");
const { generateToken } = require("../../src/utils/generateToken");

const env = {
  NODE_ENV: "test",
  PORT: 0,
  MONGODB_URI: "mongodb://unused",
  JWT_SECRET: "test_secret_1234567890",
  JWT_EXPIRES_IN: "7d",
  CORS_ORIGINS: [],
};

async function seedProduct(overrides = {}) {
  return Product.create({
    name: "Sweet Chaunsa Crate",
    slug: `chaunsa-${Date.now()}`,
    tagline: "Honey-sweet harvest",
    description: "Naturally sweet organic mango",
    variety: "Chaunsa",
    collection: "Premium Reserve",
    weightPrices: { "3kg": 2500, "5kg": 3200, "8kg": 4500 },
    weights: ["3kg", "5kg", "8kg"],
    availabilityStatus: "In Stock",
    rating: 4.8,
    isActive: true,
    ...overrides,
  });
}

describe("Chat API", () => {
  let app;

  beforeAll(async () => {
    await startMongo();
    app = createApp(env);
  }, 120_000);

  afterAll(async () => {
    await stopMongo();
  }, 30_000);

  beforeEach(async () => {
    await clearMongo();
  });

  test("GET /api/chat/search — price and variety filters", async () => {
    await seedProduct({ name: "Budget Sindhri", variety: "Sindhri", weightPrices: { "5kg": 2800 } });
    await seedProduct({ name: "Premium Chaunsa", variety: "Chaunsa", weightPrices: { "5kg": 4500 } });

    const res = await request(app).get("/api/chat/search").query({ q: "show mangoes under 3000" });
    expect(res.statusCode).toBe(200);
    expect(res.body.products.length).toBeGreaterThanOrEqual(1);
    expect(res.body.products.every((p) => p.minPrice <= 3000)).toBe(true);
  });

  test("GET /api/chat/suggestions", async () => {
    await seedProduct();
    const res = await request(app).get("/api/chat/suggestions").query({ q: "chau" });
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.suggestions)).toBe(true);
    expect(res.body.suggestions.length).toBeGreaterThan(0);
  });

  test("GET /api/chat/recommendations trending", async () => {
    await seedProduct({ viewsCount: 100, totalSold: 50 });
    const res = await request(app).get("/api/chat/recommendations").query({ section: "trending" });
    expect(res.statusCode).toBe(200);
    expect(res.body.products.length).toBeGreaterThanOrEqual(1);
  });

  test("POST /api/chat/cart-action — add and coupon", async () => {
    await seedProduct();
    const add = await request(app)
      .post("/api/chat/cart-action")
      .send({ message: "Add 5kg Chaunsa" });
    expect(add.statusCode).toBe(200);
    expect(add.body.action).toBe("add");
    expect(add.body.productId).toBeTruthy();

    const coupon = await request(app)
      .post("/api/chat/cart-action")
      .send({ message: "Apply SUMMER10" });
    expect(coupon.statusCode).toBe(200);
    expect(coupon.body.action).toBe("applyCoupon");
    expect(coupon.body.couponCode).toBe("SUMMER10");
  });

  test("POST /api/chat/faq", async () => {
    const res = await request(app)
      .post("/api/chat/faq")
      .send({ question: "What payment methods do you accept?" });
    expect(res.statusCode).toBe(200);
    expect(res.body.answer).toMatch(/COD|Easypaisa/i);
  });

  test("GET /api/chat/order-status requires auth", async () => {
    const res = await request(app).get("/api/chat/order-status");
    expect(res.statusCode).toBe(401);
  });

  test("GET /api/chat/order-status with order", async () => {
    const user = await User.create({
      name: "Buyer",
      email: "buyer@test.com",
      password: await hashPassword("password123"),
      role: "customer",
    });
    const product = await seedProduct();
    const order = await Order.create({
      user: user._id,
      items: [
        {
          product: product._id,
          title: product.name,
          weight: 5,
          quantity: 1,
          price: 3200,
        },
      ],
      deliveryDetails: { name: "Buyer", phone: "03001234567", address: "Multan" },
      paymentMethod: "COD",
      orderStatus: "Shipped",
      pricing: { subtotal: 3200, shipping: 0, tax: 0, total: 3200 },
      timeline: [{ status: "Placed", date: new Date() }],
    });
    const token = generateToken({ userId: user._id.toString(), role: "customer" }, {
      secret: env.JWT_SECRET,
      expiresIn: "7d",
    });

    const res = await request(app)
      .get("/api/chat/order-status")
      .query({ orderId: String(order._id) })
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.orderId).toBe(String(order._id));
    expect(res.body.timeline).toBeTruthy();
  });

  test("POST /api/chatbot/query returns structured reply", async () => {
    await seedProduct();
    const res = await request(app)
      .post("/api/chatbot/query")
      .send({ message: "show sweet mangoes" });
    expect(res.statusCode).toBe(200);
    expect(res.body.reply).toBeTruthy();
  });

  test("POST /api/chat/activity", async () => {
    const product = await seedProduct();
    const res = await request(app)
      .post("/api/chat/activity")
      .set("x-guest-session", "guest-test-1")
      .send({ productId: String(product._id), type: "view" });
    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);
  });
});
