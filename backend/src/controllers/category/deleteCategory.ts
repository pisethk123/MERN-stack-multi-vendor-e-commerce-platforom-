import type { RequestHandler } from "express";
import Category from "../../models/Category.ts";

interface IParam {
  id: string;
}

const deleteCategory: RequestHandler<Partial<IParam>, any, any, any> = async (
  req,
  res,
) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found!" });
    }

    return res.json({ message: "Category has been deleted successfully" });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json(error);
    } else {
      return res.status(500).json({ message: "Server Error" });
    }
  }
};

export default deleteCategory;
