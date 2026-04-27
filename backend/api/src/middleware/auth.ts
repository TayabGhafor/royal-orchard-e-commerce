import type { NextFunction, Request, Response } from "express";
import { fail } from "../lib/http";
import { verifyToken, type JwtUser } from "../services/jwt";

export type AuthedRequest = Request & { user?: JwtUser };

export function requireAuth(opts: { accessSecret: string }) {
  return (req: AuthedRequest, res: Response, next: NextFunction) => {
    const header = req.header("authorization") || "";
    const m = header.match(/^Bearer\s+(.+)$/i);
    if (!m) return fail(res, 401, "unauthorized", "Missing bearer token");
    try {
      req.user = verifyToken<JwtUser>(m[1], opts.accessSecret);
      return next();
    } catch {
      return fail(res, 401, "unauthorized", "Invalid or expired token");
    }
  };
}

export function requireRole(role: "admin" | "customer") {
  return (req: AuthedRequest, res: Response, next: NextFunction) => {
    if (!req.user) return fail(res, 401, "unauthorized", "Not authenticated");
    if (req.user.role !== role) return fail(res, 403, "forbidden", "Insufficient role");
    return next();
  };
}

