import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { connectDB, disconnectDB } from "../../../src/configs/db.ts";
import Category from "../../../src/models/Category.ts";
import request from "supertest";
import { app } from "../../../src/index.ts";

beforeAll(async () => {
  process.env.NODE_ENV = "test";
  await connectDB();
});

afterAll(async () => await disconnectDB());
afterEach(async () => await Category.deleteMany({}));

const insertData = async () => {
  const mockCategories = Array.from({ length: 15 }, (_, i) => ({
    name: `Category ${i + 1}`,
    description: `Description ${i + 1}`,
  }));

  await Category.insertMany(mockCategories);
};

describe("GET /category", () => {
  it("return a paginated empty category, category = empty", async () => {
    const res = await request(app).get("/category/get_categories");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      items: [],
      totalItems: 0,
      page: 1,
      totalPages: 0,
    });
  });

  it("return a paginated list of categories, page = 1", async () => {
    await insertData();

    const resPage1 = await request(app)
      .get("/category/get_categories")
      .query({ page: 1 });

    expect(resPage1.status).toBe(200);
    expect(resPage1.body.items).toHaveLength(10);
    expect(resPage1.body.totalItems).toBe(15);
    expect(resPage1.body.page).toBe(1);
    expect(resPage1.body.totalPages).toBe(2);
  });

  it("return a paginated list of categories, page = 2", async () => {
    await insertData();

    const resPage2 = await request(app)
      .get("/category/get_categories")
      .query({ page: 2 });

    expect(resPage2.status).toBe(200);
    expect(resPage2.body.items).toHaveLength(5);
    expect(resPage2.body.totalItems).toBe(15);
    expect(resPage2.body.page).toBe(2);
    expect(resPage2.body.totalPages).toBe(2);
  });

  it("return a paginated list of categories, search = category 2", async () => {
    await insertData();

    const searchPage = await request(app)
      .get("/category/get_categories")
      .query({ search: "category 2" });

    expect(searchPage.status).toBe(200);
    expect(searchPage.body.items).toHaveLength(1);
    expect(searchPage.body.totalItems).toBe(1);
    expect(searchPage.body.page).toBe(1);
    expect(searchPage.body.totalPages).toBe(1);
  });
});
