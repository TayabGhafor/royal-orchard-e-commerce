import mongoose, { Schema } from "mongoose";

export type WebhookProvider = "EASYPAISA" | "JAZZCASH" | "PAYFAST";

export interface WebhookEventDoc {
  _id: mongoose.Types.ObjectId;
  provider: WebhookProvider;
  providerEventId: string;
  signatureValid: boolean;
  payloadHash: string;
  receivedAt: Date;
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const WebhookEventSchema = new Schema<WebhookEventDoc>(
  {
    provider: { type: String, required: true, enum: ["EASYPAISA", "JAZZCASH", "PAYFAST"], index: true },
    providerEventId: { type: String, required: true, trim: true, maxlength: 200 },
    signatureValid: { type: Boolean, required: true },
    payloadHash: { type: String, required: true, trim: true, maxlength: 128 },
    receivedAt: { type: Date, required: true, default: () => new Date() },
    processedAt: { type: Date, required: false },
  },
  { timestamps: true },
);

WebhookEventSchema.index({ provider: 1, providerEventId: 1 }, { unique: true });

export const WebhookEventModel =
  mongoose.models.WebhookEvent || mongoose.model<WebhookEventDoc>("WebhookEvent", WebhookEventSchema);

