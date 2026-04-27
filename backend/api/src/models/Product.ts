import mongoose, { Schema } from "mongoose";

export type WeightOption = "3kg" | "5kg" | "8kg";
export type Variety = "Sindhri" | "Chaunsa" | "Anwar Ratol" | "Langra" | "Mixed" | "Other";
export type Collection = "Premium Reserve" | "Seasonal Specials" | "Bulk Harvest";

export interface ProductVariant {
  _id: mongoose.Types.ObjectId;
  weight: WeightOption;
  price: number; // PKR
  sku?: string;
  stockQty: number;
  reservedQty: number;
}

export interface ProductDoc {
  _id: mongoose.Types.ObjectId;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  variety: Variety;
  collection: Collection;
  images: string[];
  active: boolean;
  rating: number;
  reviews: number;
  variants: ProductVariant[];
  createdAt: Date;
  updatedAt: Date;
}

const VariantSchema = new Schema<ProductVariant>(
  {
    weight: { type: String, required: true, enum: ["3kg", "5kg", "8kg"] },
    price: { type: Number, required: true, min: 0 },
    sku: { type: String, required: false, trim: true, maxlength: 64 },
    stockQty: { type: Number, required: true, min: 0, default: 0 },
    reservedQty: { type: Number, required: true, min: 0, default: 0 },
  },
  { _id: true },
);

const ProductSchema = new Schema<ProductDoc>(
  {
    slug: { type: String, required: true, trim: true, lowercase: true, index: true, unique: true, maxlength: 120 },
    name: { type: String, required: true, trim: true, maxlength: 140 },
    tagline: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, required: true, trim: true, maxlength: 5000 },
    variety: { type: String, required: true, enum: ["Sindhri", "Chaunsa", "Anwar Ratol", "Langra", "Mixed", "Other"] },
    collection: { type: String, required: true, enum: ["Premium Reserve", "Seasonal Specials", "Bulk Harvest"] },
    images: { type: [String], required: true, default: [] },
    active: { type: Boolean, required: true, default: true, index: true },
    rating: { type: Number, required: true, default: 0, min: 0, max: 5 },
    reviews: { type: Number, required: true, default: 0, min: 0 },
    variants: { type: [VariantSchema], required: true, default: [] },
  },
  { timestamps: true },
);

ProductSchema.index({ slug: 1 }, { unique: true });
ProductSchema.index({ active: 1, collection: 1 });

export const ProductModel =
  mongoose.models.Product || mongoose.model<ProductDoc>("Product", ProductSchema);

