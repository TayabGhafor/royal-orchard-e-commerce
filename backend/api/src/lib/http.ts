import type { Response } from "express";

export type ApiErrorCode =
  | "bad_request"
  | "unauthorized"
  | "forbidden"
  | "not_found"
  | "conflict"
  | "rate_limited"
  | "internal_error";

export function ok(res: Response, data: unknown, status = 200) {
  return res.status(status).json(data);
}

export function fail(res: Response, status: number, code: ApiErrorCode, message: string, details?: unknown) {
  return res.status(status).json({ error: { code, message, details } });
}

