import express from "express";
import protect from "@/shared/middlewares/protect";
import authorizeRole from "@/shared/middlewares/authorizeRole";
import { validateDto } from "@/shared/middlewares/validateDto";
import { CreateCategoryDto } from "./category.dto";
import { makeCategoryController } from "./category.factory";
import upload from "@/shared/middlewares/upload";

const router = express.Router();
const categoryController = makeCategoryController();

router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategory);
router.post(
  "/",
  protect,
  authorizeRole("ADMIN", "SUPERADMIN"),
  validateDto(CreateCategoryDto),
  upload.array("images", 5),
  categoryController.createCategory
);
router.delete(
  "/:id",
  protect,
  authorizeRole("ADMIN", "SUPERADMIN"),
  categoryController.deleteCategory
);

export default router;
