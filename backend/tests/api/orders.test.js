const request = require("supertest");

const { createApp } = require("../../src/app");
const { startMongo, stopMongo, clearMongo } = require("../helpers/mongo");
const { User } = require("../../src/modules/users/user.model");
const { Product } = require("../../src/modules/products/product.model");
const { hashPassword } = require("../../src/utils/hashPassword");

const env = {
  NODE_ENV: "test",
  PORT: 0,
  MONGODB_URI: "mongodb://unused",
  JWT_SECRET: "test_secret_1234567890",
  JWT_EXPIRES_IN: "7d",
  CORS_ORIGINS: [],
};

async function loginAs(app, email, password) {
  const res = await request(app).post("/api/auth/login").send({ email, password });
  expect(res.statusCode).toBe(200);
  return res.body.token;
}

describe("Orders API", () => {
  beforeAll(async () => {
    await startMongo();
  }, 120_000);

  afterAll(async () => {
    await stopMongo();
  }, 30_000);

  beforeEach(async () => {
    await clearMongo();
  });

  test("create order reduces stock, cancel restores stock", async () => {
    const app = createApp(env);

    await User.create({
      name: "Customer",
      email: "c@example.com",
      password: await hashPassword("password123"),
      role: "customer",
    });

    const prod = await Product.create({
      name: "Sindhri Mango Box",
      slug: `sindhri-mango-box-${Date.now()}`,
      variety: "Sindhri",
      collection: "Premium Reserve",
      price: 500,
      weights: ["3kg", "5kg", "8kg"],
      stock: 10,
      images: ["https://img"],
      isActive: true,
    });

    const token = await loginAs(app, "c@example.com", "password123");

    const created = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${token}`)
      .send({
        items: [{ product: prod._id.toString(), weight: 3, quantity: 2 }],
        deliveryDetails: { name: "C", phone: "123", address: "Addr" },
        paymentMethod: "COD",
        pricing: { shipping: 0, tax: 0 },
      });

    expect(created.statusCode).toBe(201);
    expect(created.body.order.orderStatus).toBe("Placed");

    const afterCreate = await Product.findById(prod._id).lean();
    expect(afterCreate.stock).toBe(8);
    expect(afterCreate.totalSold).toBe(2);

    const cancelled = await request(app)
      .put(`/api/orders/${created.body.order._id}/cancel`)
      .set("Authorization", `Bearer ${token}`);
    expect(cancelled.statusCode).toBe(200);
    expect(cancelled.body.order.orderStatus).toBe("Cancelled");

    const afterCancel = await Product.findById(prod._id).lean();
    expect(afterCancel.stock).toBe(10);
    expect(afterCancel.totalSold).toBe(0);
  });
});

