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

describe("POST /category/add_category", () => {
  it("return 401 , unauthenticated", async () => {
    mockAuthState.isLoggedIn = false;

    const res = await request(app)
      .post("/category/add_category")
      .send({ name: "Text", description: "Gadgets" });

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: "Unauthenticated. Please log in" });
  });

  it("return 401. unauthorized", async () => {
    mockAuthState.isLoggedIn = true;
    mockAuthState.role = "customer";

    const res = await request(app)
      .post("/category/add_category")
      .send({ name: "Text", description: "Gadgets" });

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: "Unauthorized. Please log in" });
  });

  it("return 404. send empty data", async () => {
    mockAuthState.isLoggedIn = true;
    mockAuthState.role = "vendor";

    const res = await request(app)
      .post("/category/add_category")
      .send({ name: "", description: "" });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      message: {
        name: "Category name is required!",
        description: "Category description is required!",
      },
    });
  });

  it("return 404. data already exist", async () => {
    mockAuthState.isLoggedIn = true;
    mockAuthState.role = "vendor";

    await Category.create({ name: "Text", description: "Gadgets" });

    const res = await request(app)
      .post("/category/add_category")
      .send({ name: "Text", description: "Gadgets" });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      message: {
        name: "This category has been added already",
      },
    });
  });

  it("return 201. data added successfully", async () => {
    mockAuthState.isLoggedIn = true;
    mockAuthState.role = "vendor";

    const res = await request(app)
      .post("/category/add_category")
      .send({ name: "Text", description: "Gadgets" });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      message: "Category has been added successfully",
    });
  });
});
