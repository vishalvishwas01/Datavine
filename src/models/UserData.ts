import mongoose, { Schema, Document } from "mongoose";

interface IResponseItem {
  question: string;
  answer?: any;
}

export interface IUserData extends Document {
  ownerEmail: string;
  shareId: string;
  respondentEmail?: string | null;
  formId: string;
  responses: IResponseItem[];
  submittedAt: Date;
}

const ResponseItemSchema = new Schema<IResponseItem>({
  question: { type: String, required: true },
  answer: { type: Schema.Types.Mixed, default: "" },
});

const UserDataSchema = new Schema<IUserData>({
  ownerEmail: { type: String, required: true },
  shareId: { type: String, required: true, index: true },
  respondentEmail: { type: String, default: null },
  formId: { type: String, required: true },
  responses: [ResponseItemSchema],
  submittedAt: { type: Date, default: Date.now },
});

delete mongoose.models.UserData;
export const UserData =
  mongoose.models.UserData ||
  mongoose.model<IUserData>("UserData", UserDataSchema);
