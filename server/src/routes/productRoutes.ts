import express from "express";
import * as productController from "../controllers/productController";
import protect from "../middlewares/protect";
import authorizeRole from "../middlewares/authorizeRole";
import {
  validateCreateProduct,
  validateUpdateProduct,
} from "../validation/productValidation";

const router = express.Router();

router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);

router.post(
  "/",
  protect,
  authorizeRole("admin", "superadmin"),
  validateCreateProduct,
  productController.createProduct
);

router.put(
  "/:id",
  protect,
  authorizeRole("admin", "superadmin"),
  validateUpdateProduct,
  productController.updateProduct
);

router.delete(
  "/:id",
  protect,
  authorizeRole("admin", "superadmin"),
  productController.deleteProduct
);

export default router;
