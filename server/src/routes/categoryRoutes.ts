import express from "express";
import categoryController from "../controllers/categoryController";
import protect from "../middlewares/protect";
import authorizeRole from "../middlewares/authorizeRole";
import { validateCreateCategory } from "../validation/categoryValidation";

const router = express.Router();

router.get("/", categoryController.getAllCategories);
router.post(
  "/",
  protect,
  authorizeRole("ADMIN", "SUPERADMIN"),
  validateCreateCategory,
  categoryController.createCategory
);
router.delete(
  "/:id",
  protect,
  authorizeRole("ADMIN", "SUPERADMIN"),
  categoryController.deleteCategory
);

export default router;
