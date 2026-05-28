import { Document, model, Schema } from "mongoose";

export interface ICategory extends Document {
  name: string;
  description: string;
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

const Category = model("Category", categorySchema);

export default Category;
