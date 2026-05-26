import type { Request, Response } from "express";
import type { ICategory } from "../../models/Category.ts";
import Category from "../../models/Category.ts";

const addCategory = async (
  req: Request<any, any, ICategory, any>,
  res: Response,
) => {
  try {
    const { name, description } = req.body;

    let messages: Record<string, string> = {};

    if (!name) {
      messages.name = "Category name is required!";
    }

    if (!description) {
      messages.description = "Category description is required!";
    }

    const category = await Category.findOne({ name: name });

    if (category) {
      messages.name = "This category has been added already";
    }

    if (Object.keys(messages).length > 0) {
      return res.status(400).json({ message: messages });
    }

    const newCategory = new Category({ name, description });
    await newCategory.save();

    return res
      .status(201)
      .json({ message: "Category has been added successfully" });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json(error);
    } else {
      return res.status(500).json({ message: "Server Error" });
    }
  }
};

export default addCategory;
