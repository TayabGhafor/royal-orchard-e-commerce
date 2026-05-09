const request = require("supertest");

const { createApp } = require("../../src/app");

const ADMIN_API_KEY = "test-admin-key-12345";

const env = {
  NODE_ENV: "test",
  PORT: 0,
  MONGODB_URI: "mongodb://unused",
  JWT_SECRET: "test_secret_1234567890",
  JWT_EXPIRES_IN: "7d",
  ADMIN_API_KEY,
  CORS_ORIGINS: ["http://localhost:8081"],
};

describe("Uploads API (routing + CORS)", () => {
  test("OPTIONS preflight lists x-admin-key in Access-Control-Allow-Headers", async () => {
    const app = createApp(env);
    const res = await request(app)
      .options("/api/uploads/image")
      .set("Origin", "http://localhost:8081")
      .set("Access-Control-Request-Method", "POST")
      .set("Access-Control-Request-Headers", "x-admin-key");

    expect(res.status).toBe(204);
    const allowH = String(res.headers["access-control-allow-headers"] || "").toLowerCase();
    expect(allowH.includes("x-admin-key")).toBe(true);
  });

  test("GET /api/uploads/bad-path falls through to app 404", async () => {
    const app = createApp(env);
    const res = await request(app).get("/api/uploads/this-route-does-not-exist");
    expect(res.status).toBe(404);
    expect(res.body?.error?.message).toBe("Route not found");
  });
});
