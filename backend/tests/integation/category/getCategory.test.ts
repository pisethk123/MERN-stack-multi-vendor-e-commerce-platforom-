import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "../../../src/index";
import Category from "../../../src/models/Category";
import mongoose from "mongoose";
import { connectDB, disconnectDB } from "../../../src/configs/db";

beforeAll(async () => {
  process.env.NODE_ENV = "test";
  await connectDB();
});

afterAll(async () => await disconnectDB());
afterEach(async () => await Category.deleteMany({}));

describe("GET /category/get_category", () => {
  it("return 404. category not found", async () => {
    const categoryArray = Array.from({ length: 15 }, (_, i) => ({
      name: `Category ${i + 1}`,
      description: `Category description ${i + 1}`,
    }));
    await Category.insertMany(categoryArray);

    const id = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/category/get_category/${id}`);

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: "No category found" });
  });

  it("return 200. found category", async () => {
    const categoryArray = Array.from({ length: 15 }, (_, i) => ({
      name: `Category ${i + 1}`,
      description: `Category description ${i + 1}`,
    }));
    const categories = await Category.insertMany(categoryArray);

    // @ts-ignore
    const id = categories[5]._id;
    const res = await request(app).get(`/category/get_category/${id}`);

    expect(res.status).toBe(200);
  });
});
