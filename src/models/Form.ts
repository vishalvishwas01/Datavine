import mongoose, { Schema, Document, Model } from "mongoose";
import { nanoid } from "nanoid";

export interface IField {
  id: number;
  heading: string;
  type: string;
  mandatory: boolean;
  options?: string[];
  checkedOptions?: boolean[];
}
export interface IFormData {
  headLine: string;
  description: string;
}
export interface IUploadedFile {
  _id?: mongoose.Types.ObjectId;
  filename: string;
  contentType: string;
  length: number;
  uploadDate: Date;
}
export interface IForm extends Document {
  formId: string;
  userEmail: string;
  headLine?: string;
  description?: string;
  shareId?:string;
  fields: IField[];
  formData: IFormData[];
  uploadedFiles?: IUploadedFile[];
}
const FieldSchema = new Schema<IField>(
  {
    id: { type: Number, required: true },
    heading: { type: String, required: true },
    type: { type: String, required: true },
    mandatory: { type: Boolean, default: false, required: true },
    options: [String],
    checkedOptions: [Boolean],
  },
  { _id: false }
);
const FormDataSchema = new Schema<IFormData>(
  {
    headLine: { type: String, default: "" },
    description: { type: String, default: "" },
  },
  { _id: false }
);
const UploadedFileSchema = new Schema<IUploadedFile>(
  {
    _id: { type: Schema.Types.ObjectId },
    filename: { type: String, required: true },
    contentType: { type: String, required: true },
    length: { type: Number, required: true },
    uploadDate: { type: Date, default: Date.now },
  },
  { _id: false }
);
const FormSchema = new Schema<IForm>(
  {
    formId: { type: String, required: true },
    userEmail: { type: String, required: true },
    shareId: { type: String, required: true, unique: true, default: () => nanoid(10) },
    fields: { type: [FieldSchema], default: [] },
    formData: { type: [FormDataSchema], default: [] },
    uploadedFiles: { type: [UploadedFileSchema], default: [] },
  },
  { timestamps: true }
);
delete mongoose.models.Form;
export const Form: Model<IForm> =
  mongoose.models.Form || mongoose.model<IForm>("Form", FormSchema);
