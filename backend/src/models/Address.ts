import { Document, model, Schema, Types } from "mongoose";

interface IAddress extends Document {
  user: Types.ObjectId;
  userModel: "Customer" | "Vendor" | "Admin";
  objectId: string;
  objectOwner: string;
  name: string;
  company?: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

const addressSchema = new Schema<IAddress>(
  {
    user: { type: Types.ObjectId, refPath: "userModel", required: true },
    userModel: { type: String, required: true, enum: ["Customer", "Vendor", "Admin"] },
    objectId: { type: String, required: true },
    objectOwner: { type: String, required: true },
    name: { type: String, required: true },
    company: { type: String, default: "" },
    street1: { type: String, required: true },
    street2: { type: String, default: "" },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    country: { type: String, required: true },
  },
  { timestamps: true },
);

const Address = model<IAddress>("Address", addressSchema);

export default Address;
