import { model, Schema } from "mongoose";

export interface ICategory {
  name: string;
  description: string;
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
  },
  { timestamps: true },
);

const Category = model("Category", categorySchema);

export default Category;
