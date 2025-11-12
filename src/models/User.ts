import mongoose, { Schema, Document, Model } from "mongoose";
import { Types } from "mongoose";

// Payment subdocument interface
interface IPayment extends Document {
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  amount?: number;
  createdAt?: Date;
}

//  User interface
export interface IUser extends Document {
  _id: Types.ObjectId;
  name?: string;
  email: string;
  image?: string;
  isPremium?: boolean;
  premiumSince?: Date;
  payments: Types.DocumentArray<IPayment>;
}

//  Payment Schema
const PaymentSchema = new Schema<IPayment>(
  {
    razorpayOrderId: String,
    razorpayPaymentId: String,
    amount: Number,
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

//  User Schema
const UserSchema = new Schema<IUser>(
  {
    name: String,
    email: { type: String, required: true, unique: true },
    image: String,
    isPremium: { type: Boolean, default: false },
    premiumSince: Date,
    payments: [PaymentSchema],
  },
  { timestamps: true }
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
