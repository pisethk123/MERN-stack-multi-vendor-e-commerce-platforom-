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
import { connectDB, disconnectDB } from "../../../src/configs/db";
import Category from "../../../src/models/Category";
import request from "supertest";
import { RequestHandler } from "express";

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

describe("PUT /category/update_category", () => {
  it("return 401 , unauthenticated", async () => {
    mockAuthState.isLoggedIn = false;

    const category = await Category.create({
      name: "Category",
      description: "Category's description",
    });

    const res = await request(app)
      .put(`/category/update_category/${category._id}`)
      .send({
        name: "Updated Category",
        description: "Category's description",
      });

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

    const res = await request(app)
      .put(`/category/update_category/${category._id}`)
      .send({
        name: "Updated Category",
        description: "Category's description",
      });

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: "Unauthorized. Please log in" });
  });

  it("return 404. send empty data", async () => {
    mockAuthState.isLoggedIn = true;
    mockAuthState.role = "vendor";

    const category = await Category.create({
      name: "Category",
      description: "Category's description",
    });

    const res = await request(app)
      .put(`/category/update_category/${category._id}`)
      .send({
        name: "",
        description: "",
      });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      message: {
        name: "Category name is required!",
        description: "Category description is required!",
      },
    });
  });

  it("return 200. data updated successfully", async () => {
    mockAuthState.isLoggedIn = true;
    mockAuthState.role = "vendor";

    const category = await Category.create({
      name: "Category",
      description: "Category's description",
    });

    const res = await request(app)
      .put(`/category/update_category/${category._id}`)
      .send({
        name: "Updated Category",
        description: "Category's description",
      });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: "Category has been updated successfully",
    });
  });
});
