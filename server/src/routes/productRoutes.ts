import express from "express";
import productController from "../controllers/productController";
import authorizeRole from "../middlewares/authorizeRole";
import { validateDto } from "../middlewares/validateDto";
import { CreateProductDto, UpdateProductDto } from "../dtos/productDto";
import protect from "../middlewares/protect";

const router = express.Router();

router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.get("/slug/:slug", productController.getProductBySlug);

router.post(
  "/",
  protect,
  authorizeRole("ADMIN", "SUPERADMIN"),
  validateDto(CreateProductDto),
  productController.createProduct
);

router.put(
  "/:id",
  protect,
  authorizeRole("ADMIN", "SUPERADMIN"),
  validateDto(UpdateProductDto),
  productController.updateProduct
);

router.delete(
  "/:id",
  protect,
  authorizeRole("ADMIN", "SUPERADMIN"),
  productController.deleteProduct
);

export default router;
