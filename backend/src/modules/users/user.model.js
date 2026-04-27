const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema(
  {
    fullAddress: { type: String, trim: true },
    city: { type: String, trim: true },
    area: { type: String, trim: true },
  },
  { _id: false },
);

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["admin", "customer"], default: "customer", index: true },
    phone: { type: String, trim: true },
    avatar: { type: String, trim: true },
    address: { type: AddressSchema, default: {} },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true },
);

UserSchema.index({ createdAt: -1 });

const User = mongoose.model("User", UserSchema);

module.exports = { User };

