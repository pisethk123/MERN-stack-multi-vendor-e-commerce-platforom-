import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response, NextFunction } from "express";
import isAuthenticated from "../../../src/middlewares/isAuthenticated.ts";

describe("isAuthenticated Middleware", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {
      // @ts-ignore
      isAuthenticated: vi.fn(),
      user: { role: "customer" },
    };

    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    mockNext = vi.fn() as unknown as NextFunction;
  });

  it("should return 401 if user is not authenticated", () => {
    // @ts-ignore
    (mockReq.isAuthenticated as any).mockReturnValue(false);
    const middleware = isAuthenticated(["customer", "admin"]);
    middleware(mockReq as Request, mockRes as Response, mockNext);

    // Assertions
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Unauthenticated. Please log in",
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should return 401 if user authenticated but has wrong role", () => {
    // Force user authentication to pass, but provide an invalid role
    // @ts-ignore
    (mockReq.isAuthenticated as any).mockReturnValue(true);
    // @ts-ignore
    mockReq.user = { role: "customer" };

    // Only allow vendors or admins
    const middleware = isAuthenticated(["vendor", "admin"]);
    middleware(mockReq as Request, mockRes as Response, mockNext);

    // Assertions
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Unauthorized. Please log in",
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should call next() if user is authenticated and has allowed role", () => {
    // Force complete authorization success
    // @ts-ignore
    (mockReq.isAuthenticated as any).mockReturnValue(true);
    // @ts-ignore
    mockReq.user = { role: "vendor" };

    const middleware = isAuthenticated(["vendor"]);
    middleware(mockReq as Request, mockRes as Response, mockNext);

    // Assertions
    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(mockRes.status).not.toHaveBeenCalled();
    expect(mockRes.json).not.toHaveBeenCalled();
  });
});
