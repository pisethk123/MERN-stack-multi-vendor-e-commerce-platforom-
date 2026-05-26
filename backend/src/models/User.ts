import { model, Schema } from "mongoose";

interface IUser {
  displayName: string;
  googleId: string;
  email: string;
  role: "customer" | "vendor" | "admin";
  profilePicture: string;
}

const userSchema = new Schema<IUser>(
  {
    displayName: { type: String, required: true },
    googleId: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: {
      type: String,
      required: true,
      enum: ["customer", "vendor", "admin"],
    },
    profilePicture: { type: String, required: true },
  },
  { timestamps: true },
);

export const Customer = model<IUser>("Customer", userSchema, "customers");
export const Vendor = model<IUser>("Vendor", userSchema, "vendors");
export const Admin = model<IUser>("Admin", userSchema, "admins");
