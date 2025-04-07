import express from "express";
import categoryController from "../controllers/categoryController";
import protect from "../middlewares/protect";
import authorizeRole from "../middlewares/authorizeRole";
import { validateDto } from "../middlewares/validateDto";
import { CreateCategoryDto } from "../dtos/categoryDto";

const router = express.Router();

router.get("/", categoryController.getAllCategories);
router.post(
  "/",
  protect,
  authorizeRole("ADMIN", "SUPERADMIN"),
  validateDto(CreateCategoryDto),
  categoryController.createCategory
);
router.delete(
  "/:id",
  protect,
  authorizeRole("ADMIN", "SUPERADMIN"),
  categoryController.deleteCategory
);

export default router;
