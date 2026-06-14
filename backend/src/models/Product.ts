import { model, Schema, type Document } from "mongoose";

interface IProduct extends Document {
  name: string;
  specification: string;
  description: string;
  price: {
    base: number;
    discount: number;
  };
  availability: {
    inStock: number;
    sold: number;
  };
  dimensionAndWeight: {
    width: number;
    length: number;
    height: number;
    weight: number;
  };
  images: Array<string>;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    specification: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: {
      base: {
        type: Number,
        required: true,
      },
      discount: {
        type: Number,
        required: true,
        default: 0,
      },
    },
    availability: {
      inStock: { type: Number, required: true },
      sold: { type: Number, required: true, default: 0 },
    }, dimensionAndWeight: {
      width: { type: Number, required: true },
      length: { type: Number, required: true },
      height: { type: Number, required: true },
      weight: { type: Number, required: true },
    },
    images: [{ type: String, required: true }],
  },
  {
    timestamps: true,
  },
);

const Product = model<IProduct>("User", productSchema);

export default Product;
