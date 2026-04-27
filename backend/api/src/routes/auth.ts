import { Router } from "express";
import { z } from "zod";
import argon2 from "argon2";
import { UserModel } from "../models/User";
import { fail, ok } from "../lib/http";
import { signAccessToken, signRefreshToken } from "../services/jwt";

const RegisterSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  password: z.string().min(8).max(100),
});

const LoginSchema = z.object({
  email: z.string().trim().email().max(255),
  password: z.string().min(1).max(100),
});

export function authRouter(opts: {
  accessSecret: string;
  refreshSecret: string;
  accessTtlSeconds: number;
  refreshTtlSeconds: number;
}) {
  const r = Router();

  r.post("/register", async (req, res) => {
    const parsed = RegisterSchema.safeParse(req.body);
    if (!parsed.success) return fail(res, 400, "bad_request", "Invalid input", parsed.error.flatten());

    const email = parsed.data.email.toLowerCase();
    const existing = await UserModel.findOne({ email }).lean();
    if (existing) return fail(res, 409, "conflict", "Email already registered");

    const passwordHash = await argon2.hash(parsed.data.password);
    const user = await UserModel.create({
      name: parsed.data.name,
      email,
      role: "customer",
      status: "active",
      passwordHash,
    });

    const jwtUser = { sub: String(user._id), role: user.role, email: user.email };
    const accessToken = signAccessToken(jwtUser, opts.accessSecret, opts.accessTtlSeconds);
    const refreshToken = signRefreshToken(jwtUser, opts.refreshSecret, opts.refreshTtlSeconds);

    return ok(res, { accessToken, refreshToken, user: { id: String(user._id), name: user.name, email: user.email, role: user.role } }, 201);
  });

  r.post("/login", async (req, res) => {
    const parsed = LoginSchema.safeParse(req.body);
    if (!parsed.success) return fail(res, 400, "bad_request", "Invalid input", parsed.error.flatten());

    const email = parsed.data.email.toLowerCase();
    const user = await UserModel.findOne({ email });
    if (!user) return fail(res, 401, "unauthorized", "Invalid credentials");
    if (user.status !== "active") return fail(res, 403, "forbidden", "Account disabled");

    const okPwd = await argon2.verify(user.passwordHash, parsed.data.password);
    if (!okPwd) return fail(res, 401, "unauthorized", "Invalid credentials");

    user.lastLoginAt = new Date();
    await user.save();

    const jwtUser = { sub: String(user._id), role: user.role, email: user.email };
    const accessToken = signAccessToken(jwtUser, opts.accessSecret, opts.accessTtlSeconds);
    const refreshToken = signRefreshToken(jwtUser, opts.refreshSecret, opts.refreshTtlSeconds);

    return ok(res, { accessToken, refreshToken, user: { id: String(user._id), name: user.name, email: user.email, role: user.role } });
  });

  return r;
}

