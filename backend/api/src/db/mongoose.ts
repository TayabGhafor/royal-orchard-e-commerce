import mongoose from "mongoose";
import { logger } from "../lib/logger";

export async function connectMongo(uri: string) {
  mongoose.set("strictQuery", true);
  mongoose.connection.on("connected", () => logger.info({ msg: "MongoDB connected" }));
  mongoose.connection.on("disconnected", () => logger.warn({ msg: "MongoDB disconnected" }));
  mongoose.connection.on("error", (err) => logger.error({ err }, "MongoDB connection error"));
  await mongoose.connect(uri);
}

