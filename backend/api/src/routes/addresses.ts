import { Router } from "express";
import { z } from "zod";
import { AddressModel } from "../models/Address";
import { fail, ok } from "../lib/http";
import { requireAuth, type AuthedRequest } from "../middleware/auth";

const AddressSchema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(7).max(32),
  addressLine1: z.string().trim().min(5).max(200),
  addressLine2: z.string().trim().max(200).optional(),
  city: z.string().trim().min(2).max(80),
  province: z.string().trim().max(80).optional(),
  postalCode: z.string().trim().max(20).optional(),
  country: z.string().trim().length(2).default("PK").optional(),
});

export function addressesRouter(opts: { accessSecret: string }) {
  const r = Router();
  const auth = requireAuth({ accessSecret: opts.accessSecret });

  r.get("/", auth, async (req: AuthedRequest, res) => {
    const userId = req.user!.sub;
    const list = await AddressModel.find({ userId }).sort({ isDefault: -1, createdAt: -1 }).lean();
    return ok(res, { items: list.map((a) => ({ ...a, id: String(a._id) })) });
  });

  r.post("/", auth, async (req: AuthedRequest, res) => {
    const parsed = AddressSchema.safeParse(req.body);
    if (!parsed.success) return fail(res, 400, "bad_request", "Invalid input", parsed.error.flatten());

    const userId = req.user!.sub;
    const addr = await AddressModel.create({ userId, ...parsed.data, country: parsed.data.country ?? "PK", isDefault: false });
    return ok(res, { ...addr.toObject(), id: String(addr._id) }, 201);
  });

  r.patch("/:addressId", auth, async (req: AuthedRequest, res) => {
    const parsed = AddressSchema.partial().safeParse(req.body);
    if (!parsed.success) return fail(res, 400, "bad_request", "Invalid input", parsed.error.flatten());

    const userId = req.user!.sub;
    const updated = await AddressModel.findOneAndUpdate(
      { _id: req.params.addressId, userId },
      { $set: parsed.data },
      { new: true },
    ).lean();
    if (!updated) return fail(res, 404, "not_found", "Address not found");
    return ok(res, { ...updated, id: String(updated._id) });
  });

  r.delete("/:addressId", auth, async (req: AuthedRequest, res) => {
    const userId = req.user!.sub;
    const deleted = await AddressModel.findOneAndDelete({ _id: req.params.addressId, userId }).lean();
    if (!deleted) return fail(res, 404, "not_found", "Address not found");
    return ok(res, { ok: true });
  });

  r.post("/:addressId/default", auth, async (req: AuthedRequest, res) => {
    const userId = req.user!.sub;
    const addressId = req.params.addressId;
    const exists = await AddressModel.findOne({ _id: addressId, userId }).lean();
    if (!exists) return fail(res, 404, "not_found", "Address not found");
    await AddressModel.updateMany({ userId }, { $set: { isDefault: false } });
    const updated = await AddressModel.findOneAndUpdate({ _id: addressId, userId }, { $set: { isDefault: true } }, { new: true }).lean();
    return ok(res, { ...updated, id: String(updated!._id) });
  });

  return r;
}

