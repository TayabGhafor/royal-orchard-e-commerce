import mongoose, { Schema } from "mongoose";

export type UserRole = "customer" | "admin";
export type UserStatus = "active" | "disabled";

export interface UserDoc {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

const UserSchema = new Schema<UserDoc>(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 255, index: true, unique: true },
    phone: { type: String, required: false, trim: true, maxlength: 32 },
    role: { type: String, required: true, enum: ["customer", "admin"], default: "customer", index: true },
    status: { type: String, required: true, enum: ["active", "disabled"], default: "active", index: true },
    passwordHash: { type: String, required: true },
    lastLoginAt: { type: Date, required: false },
  },
  { timestamps: true },
);

UserSchema.index({ email: 1 }, { unique: true });

export const UserModel = mongoose.models.User || mongoose.model<UserDoc>("User", UserSchema);

