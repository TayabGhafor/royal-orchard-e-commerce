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
  });

  afterAll(async () => {
    await stopMongo();
  });

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
});

