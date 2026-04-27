import mongoose, { Schema } from "mongoose";

export interface AddressDoc {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  province?: string;
  postalCode?: string;
  country: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AddressSchema = new Schema<AddressDoc>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User", index: true },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    phone: { type: String, required: true, trim: true, maxlength: 32 },
    addressLine1: { type: String, required: true, trim: true, maxlength: 200 },
    addressLine2: { type: String, required: false, trim: true, maxlength: 200 },
    city: { type: String, required: true, trim: true, maxlength: 80, index: true },
    province: { type: String, required: false, trim: true, maxlength: 80 },
    postalCode: { type: String, required: false, trim: true, maxlength: 20 },
    country: { type: String, required: true, trim: true, default: "PK", maxlength: 2 },
    isDefault: { type: Boolean, required: true, default: false },
  },
  { timestamps: true },
);

AddressSchema.index({ userId: 1, isDefault: 1 });

export const AddressModel =
  mongoose.models.Address || mongoose.model<AddressDoc>("Address", AddressSchema);

