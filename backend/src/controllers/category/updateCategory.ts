import type { RequestHandler } from "express";
import type { ICategory } from "../../models/Category.ts";
import Category from "../../models/Category.ts";

interface IParams {
  id: string;
}

const updateCategory: RequestHandler<
  Partial<IParams>,
  any,
  Partial<ICategory>,
  any
> = async (req, res) => {
  try {
    const { name, description } = req.body;
    const { id } = req.params;

    let messages: Record<string, string> = {};

    const category = await Category.findOne({ _id: id });

    if (!category) {
      messages.name = "Category ID is required!";
    }

    if (!name) {
      messages.name = "Category name is required!";
    }

    if (!description) {
      messages.description = "Category description is required!";
    }

    if (Object.keys(messages).length > 0) {
      return res.status(400).json({ message: messages });
    }

    // @ts-ignore
    category.name = name;
    // @ts-ignore
    category.description = description;
    // @ts-ignore
    await category!.save();

    return res
      .status(200)
      .json({ message: "Category has been updated successfully" });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json(error);
    } else {
      return res.status(500).json({ message: "Server Error" });
    }
  }
};

export default updateCategory;
