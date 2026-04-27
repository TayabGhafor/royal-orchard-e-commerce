import mongoose, { Schema } from "mongoose";

export type OrderStatus =
  | "Pending"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Returned"
  | "Cancelled";

export type PaymentProvider = "COD" | "EASYPAISA" | "JAZZCASH" | "PAYFAST";
export type PaymentStatus = "pending" | "authorized" | "paid" | "failed" | "refunded" | "cancelled";

export interface OrderItemSubdoc {
  _id: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  variantId?: mongoose.Types.ObjectId;
  productNameSnapshot: string;
  weightSnapshot: string;
  unitPrice: number;
  qty: number;
  lineTotal: number;
}

export interface PaymentSubdoc {
  _id: mongoose.Types.ObjectId;
  provider: PaymentProvider;
  status: PaymentStatus;
  amount: number;
  currency: "PKR";
  providerReference?: string;
  intentId?: string;
  paidAt?: Date;
}

export interface OrderDoc {
  _id: mongoose.Types.ObjectId;
  orderNumber: string;
  userId?: mongoose.Types.ObjectId;
  customerName: string;
  email: string;
  phone: string;
  addressSnapshot: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    province?: string;
    postalCode?: string;
    country: string;
  };
  status: OrderStatus;
  currency: "PKR";
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  items: OrderItemSubdoc[];
  payment?: PaymentSubdoc;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<OrderItemSubdoc>(
  {
    productId: { type: Schema.Types.ObjectId, required: true, ref: "Product" },
    variantId: { type: Schema.Types.ObjectId, required: false },
    productNameSnapshot: { type: String, required: true, trim: true, maxlength: 200 },
    weightSnapshot: { type: String, required: true, trim: true, maxlength: 20 },
    unitPrice: { type: Number, required: true, min: 0 },
    qty: { type: Number, required: true, min: 1, max: 999 },
    lineTotal: { type: Number, required: true, min: 0 },
  },
  { _id: true },
);

const PaymentSchema = new Schema<PaymentSubdoc>(
  {
    provider: { type: String, required: true, enum: ["COD", "EASYPAISA", "JAZZCASH", "PAYFAST"] },
    status: { type: String, required: true, enum: ["pending", "authorized", "paid", "failed", "refunded", "cancelled"], default: "pending" },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, enum: ["PKR"], default: "PKR" },
    providerReference: { type: String, required: false, trim: true, maxlength: 200 },
    intentId: { type: String, required: false, trim: true, maxlength: 200 },
    paidAt: { type: Date, required: false },
  },
  { _id: true },
);

const OrderSchema = new Schema<OrderDoc>(
  {
    orderNumber: { type: String, required: true, trim: true, unique: true, index: true },
    userId: { type: Schema.Types.ObjectId, required: false, ref: "User", index: true },
    customerName: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 255, index: true },
    phone: { type: String, required: true, trim: true, maxlength: 32 },
    addressSnapshot: {
      addressLine1: { type: String, required: true, trim: true, maxlength: 200 },
      addressLine2: { type: String, required: false, trim: true, maxlength: 200 },
      city: { type: String, required: true, trim: true, maxlength: 80 },
      province: { type: String, required: false, trim: true, maxlength: 80 },
      postalCode: { type: String, required: false, trim: true, maxlength: 20 },
      country: { type: String, required: true, trim: true, default: "PK" },
    },
    status: { type: String, required: true, enum: ["Pending", "Processing", "Shipped", "Delivered", "Returned", "Cancelled"], default: "Pending", index: true },
    currency: { type: String, required: true, enum: ["PKR"], default: "PKR" },
    subtotal: { type: Number, required: true, min: 0 },
    tax: { type: Number, required: true, min: 0 },
    shipping: { type: Number, required: true, min: 0 },
    discount: { type: Number, required: true, min: 0, default: 0 },
    total: { type: Number, required: true, min: 0 },
    items: { type: [OrderItemSchema], required: true, default: [] },
    payment: { type: PaymentSchema, required: false },
  },
  { timestamps: true },
);

OrderSchema.index({ email: 1, createdAt: -1 });

export const OrderModel = mongoose.models.Order || mongoose.model<OrderDoc>("Order", OrderSchema);

