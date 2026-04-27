import jwt from "jsonwebtoken";

export type JwtUser = {
  sub: string; // userId
  role: "customer" | "admin";
  email: string;
};

export function signAccessToken(payload: JwtUser, secret: string, ttlSeconds: number) {
  return jwt.sign(payload, secret, { expiresIn: ttlSeconds, algorithm: "HS256" });
}

export function signRefreshToken(payload: JwtUser, secret: string, ttlSeconds: number) {
  return jwt.sign(payload, secret, { expiresIn: ttlSeconds, algorithm: "HS256" });
}

export function verifyToken<T>(token: string, secret: string): T {
  return jwt.verify(token, secret, { algorithms: ["HS256"] }) as T;
}

