const request = require("supertest");

const { createApp } = require("../../src/app");
const { startMongo, stopMongo, clearMongo } = require("../helpers/mongo");

const env = {
  NODE_ENV: "test",
  PORT: 0,
  MONGODB_URI: "mongodb://unused",
  JWT_SECRET: "test_secret_1234567890",
  JWT_EXPIRES_IN: "7d",
  CORS_ORIGINS: [],
};

describe("Auth API", () => {
  beforeAll(async () => {
    await startMongo();
  }, 120_000);

  afterAll(async () => {
    await stopMongo();
  }, 30_000);

  beforeEach(async () => {
    await clearMongo();
  });

  test("register -> login -> me", async () => {
    const app = createApp(env);

    const reg = await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });
    expect(reg.statusCode).toBe(201);
    expect(reg.body.token).toBeTruthy();

    const login = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "password123",
    });
    expect(login.statusCode).toBe(200);
    expect(login.body.token).toBeTruthy();

    const me = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${login.body.token}`);
    expect(me.statusCode).toBe(200);
    expect(me.body.user.email).toBe("test@example.com");
    expect(me.body.user.password).toBeUndefined();
  });

  test("forgot-password -> verify code (424242) -> reset-password", async () => {
    const app = createApp(env);

    await request(app).post("/api/auth/register").send({
      name: "Reset User",
      email: "resetme@example.com",
      password: "oldpass123",
    });

    const forgot = await request(app).post("/api/auth/forgot-password").send({
      email: "resetme@example.com",
    });
    expect(forgot.statusCode).toBe(200);
    expect(forgot.body.ok).toBe(true);

    const verify = await request(app).post("/api/auth/verify-reset-code").send({
      email: "resetme@example.com",
      code: "424242",
    });
    expect(verify.statusCode).toBe(200);
    expect(verify.body.resetToken).toBeTruthy();

    const reset = await request(app).post("/api/auth/reset-password").send({
      resetToken: verify.body.resetToken,
      password: "newpass456",
      confirmPassword: "newpass456",
    });
    expect(reset.statusCode).toBe(200);
    expect(reset.body.ok).toBe(true);

    const login = await request(app).post("/api/auth/login").send({
      email: "resetme@example.com",
      password: "newpass456",
    });
    expect(login.statusCode).toBe(200);
    expect(login.body.token).toBeTruthy();
  });

  test("forgot-password rejects unknown email", async () => {
    const app = createApp(env);
    const res = await request(app).post("/api/auth/forgot-password").send({
      email: "nobody@example.com",
    });
    expect(res.statusCode).toBe(404);
  });
});

