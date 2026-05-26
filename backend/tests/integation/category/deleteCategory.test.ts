import { app } from "../../../src/index";
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import isAuthenticated from "../../../src/middlewares/isAuthenticated";
import { RequestHandler } from "express";
import { connectDB, disconnectDB } from "../../../src/configs/db";
import Category from "../../../src/models/Category";
import request from "supertest";
import mongoose from "mongoose";

const mockAuthState = {
  isLoggedIn: true,
  role: "admin",
};

vi.mock("../../../src/middlewares/isAuthenticated", () => {
  return {
    default: (allowedRoles: string[]): RequestHandler => {
      return (req, res, next) => {
        if (!mockAuthState.isLoggedIn) {
          return res
            .status(401)
            .json({ message: "Unauthenticated. Please log in" });
        }
        if (!allowedRoles.includes(mockAuthState.role)) {
          return res
            .status(401)
            .json({ message: "Unauthorized. Please log in" });
        }
        return next();
      };
    },
  };
});

beforeAll(async () => {
  process.env.NODE_ENV = "test";
  await connectDB();
});

afterAll(async () => await disconnectDB());
afterEach(async () => await Category.deleteMany({}));

describe("DELETE /category/delete_cateogory", () => {
  it("return 401 , unauthenticated", async () => {
    mockAuthState.isLoggedIn = false;
    const category = await Category.create({
      name: "Category",
      description: "Category's description",
    });
    const res = await request(app).delete(
      `/category/delete_category/${category._id}`,
    );

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: "Unauthenticated. Please log in" });
  });
  it("return 401. unauthorized", async () => {
    mockAuthState.isLoggedIn = true;
    mockAuthState.role = "customer";
    const category = await Category.create({
      name: "Category",
      description: "Category's description",
    });
    const res = await request(app).delete(
      `/category/delete_category/${category._id}`,
    );

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: "Unauthorized. Please log in" });
  });

  it("return 404. invalid id", async () => {
    mockAuthState.isLoggedIn = true;
    mockAuthState.role = "vendor";

    const fakeId = new mongoose.Types.ObjectId().toString();

    const category = await Category.create({
      name: "Category",
      description: "Category's description",
    });
    const res = await request(app).delete(
      `/category/delete_category/${fakeId}`,
    );

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: "Category not found!" });
  });

  it("return 200. data deleted successfully", async () => {
    mockAuthState.isLoggedIn = true;
    mockAuthState.role = "vendor";

    const category = await Category.create({
      name: "Category",
      description: "Category's description",
    });

    const res = await request(app).delete(
      `/category/delete_category/${category._id}`,
    );

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: "Category has been deleted successfully",
    });
  });
});
