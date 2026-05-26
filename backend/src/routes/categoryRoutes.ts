import { Router } from "express";
import getCategories from "../controllers/category/getCategories.ts";
import addCategory from "../controllers/category/addCategory.ts";
import updateCategory from "../controllers/category/updateCategory.ts";
import deleteCategory from "../controllers/category/deleteCategory.ts";
import isAutheticated from "../middlewares/isAuthenticated.ts";
import getCategory from "../controllers/category/getCategory.ts";

const router: Router = Router();

router.get("/get_categories", getCategories);
router.get("/get_category/:id", getCategory);
router.post("/add_category", isAutheticated(["vendor"]), addCategory);
router.put("/update_category/:id", isAutheticated(["vendor"]), updateCategory);
router.delete(
  "/delete_category/:id",
  isAutheticated(["vendor"]),
  deleteCategory,
);

export default router;
