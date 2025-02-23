import mongoose, { model, models, Schema } from "mongoose";
import { ImageVariant, ImageVariantType } from "./Product.model";

interface IPopulatedUser{
    _id: mongoose.Types.ObjectId;
    email: string;
    name?: string;
}
interface IPopulatedProduct{
    _id: mongoose.Types.ObjectId;
    name: string;
    imageUrl: string;
}
export interface IOrder{
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId | IPopulatedUser;
    productId: mongoose.Types.ObjectId | IPopulatedProduct;
    variant: ImageVariant;
    stripeSessionId: string;
    paymentIntentId?: string;
    amount: number;
    status: "pending" | "completed" | "failed";
    downloadUrl?: string;
    previewUrl?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
const orderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    variant: {
      type: {
        type: String,
        required: true,
        enum: ["SQUARE", "WIDE", "PORTRAIT"] as ImageVariantType[],
        set: (v: string) => v.toUpperCase(),
      },
      price: { type: Number, required: true },
      license: {
        type: String,
        required: true,
        enum: ["Personal", "Commercial"],
      },
    },
    stripeSessionId: { type: String, required: true },
    paymentIntentId: { type: String },
    amount: { type: Number, required: true },
    status: {
      type: String,
      required: true,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    downloadUrl: { type: String },
    previewUrl: { type: String },
  },
  { timestamps: true }
);

const Order = models?.Order || model<IOrder>("Order", orderSchema);
export default Order;