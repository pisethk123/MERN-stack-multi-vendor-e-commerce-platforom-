import type { Request, Response } from "express";
import Category from "../../models/Category.ts";
import searchString from "../../utils/searchString.ts";

interface IQuery {
  search: string;
  page: string;
}

const getCategories = async (
  req: Request<any, any, any, Partial<IQuery>>,
  res: Response,
) => {
  try {
    const { search, page } = req.query;
    const skip = page ? (Number(page) - 1) * 10 : 0;
    const searchQuery: Record<string, any> = {};

    if (search) {
      searchQuery.$or = [
        { name: searchString(search) },
        { description: searchString(search) },
      ];
    }

    const items = await Category.find(searchQuery).skip(skip).limit(10).lean();
    const totalItems = await Category.countDocuments(searchQuery);

    const totalPages = Math.ceil(totalItems / 10);
    const currentPage = Number(page || 1);

    return res.json({ items, totalItems, page: currentPage, totalPages });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json(error);
    } else {
      return res.status(500).json({ message: "Server Error" });
    }
  }
};

export default getCategories;
