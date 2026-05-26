import type { RequestHandler } from "express";

const isAuthenticated = (
  allowedRoles: Array<"customer" | "vendor" | "admin">,
): RequestHandler => {
  return (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res
        .status(401)
        .json({ message: "Unauthenticated. Please log in" });
    }

    // @ts-ignore
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(401).json({ message: "Unauthorized. Please log in" });
    }

    return next();
  };
};

export default isAuthenticated;
