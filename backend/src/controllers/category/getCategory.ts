import type { Request, Response } from "express";
import Category from "../../models/Category.ts";

interface IParam {
  id: string;
}

const getCategory = async (
  req: Request<IParam, any, any, any>,
  res: Response,
) => {
  try {
    const { id } = req.params;

    const category = await Category.findOne({ _id: id });

    if (!category) {
      return res.status(404).json({ message: "No category found" });
    }

    return res.json(category);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json(error);
    } else {
      return res.status(500).json({ message: "Server Error" });
    }
  }
};

export default getCategory;
