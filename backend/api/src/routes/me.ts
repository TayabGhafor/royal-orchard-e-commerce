import { Router } from "express";
import { z } from "zod";
import { UserModel } from "../models/User";
import { fail, ok } from "../lib/http";
import { requireAuth, type AuthedRequest } from "../middleware/auth";

const PatchSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  phone: z.string().trim().min(7).max(32).optional(),
});

export function meRouter(opts: { accessSecret: string }) {
  const r = Router();

  r.get("/", requireAuth({ accessSecret: opts.accessSecret }), async (req: AuthedRequest, res) => {
    const userId = req.user!.sub;
    const user = await UserModel.findById(userId).lean();
    if (!user) return fail(res, 404, "not_found", "User not found");
    return ok(res, { id: String(user._id), name: user.name, email: user.email, role: user.role, phone: user.phone });
  });

  r.patch("/", requireAuth({ accessSecret: opts.accessSecret }), async (req: AuthedRequest, res) => {
    const parsed = PatchSchema.safeParse(req.body);
    if (!parsed.success) return fail(res, 400, "bad_request", "Invalid input", parsed.error.flatten());

    const userId = req.user!.sub;
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { $set: parsed.data },
      { new: true },
    ).lean();
    if (!user) return fail(res, 404, "not_found", "User not found");
    return ok(res, { id: String(user._id), name: user.name, email: user.email, role: user.role, phone: user.phone });
  });

  return r;
}

