import { Router } from "express";
import { z } from "zod";
import { ProductModel } from "../models/Product";
import { fail, ok } from "../lib/http";

const ListSchema = z.object({
  q: z.string().trim().max(100).optional(),
  collection: z.enum(["Premium Reserve", "Seasonal Specials", "Bulk Harvest"]).optional(),
  variety: z.enum(["Sindhri", "Chaunsa", "Anwar Ratol", "Langra", "Mixed", "Other"]).optional(),
});

export function productsRouter() {
  const r = Router();

  r.get("/", async (req, res) => {
    const parsed = ListSchema.safeParse(req.query);
    if (!parsed.success) return fail(res, 400, "bad_request", "Invalid query", parsed.error.flatten());

    const filter: Record<string, unknown> = { active: true };
    if (parsed.data.collection) filter.collection = parsed.data.collection;
    if (parsed.data.variety) filter.variety = parsed.data.variety;
    if (parsed.data.q) filter.name = { $regex: parsed.data.q, $options: "i" };

    const products = await ProductModel.find(filter).sort({ createdAt: -1 }).lean();
    return ok(res, { items: products.map((p) => ({ ...p, id: String(p._id) })) });
  });

  r.get("/:slug", async (req, res) => {
    const slug = String(req.params.slug || "").toLowerCase();
    if (!slug) return fail(res, 400, "bad_request", "Missing slug");
    const p = await ProductModel.findOne({ slug, active: true }).lean();
    if (!p) return fail(res, 404, "not_found", "Product not found");
    return ok(res, { ...p, id: String(p._id) });
  });

  return r;
}

