import express from "express";
import authorizeRole from "@/shared/middlewares/authorizeRole";
import protect from "@/shared/middlewares/protect";
import { makeProductController } from "./product.factory";

const router = express.Router();
const productController = makeProductController();

router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.get("/slug/:slug", productController.getProductBySlug);

router.post(
  "/",
  protect,
  authorizeRole("ADMIN", "SUPERADMIN"),
  productController.createProduct
);

router.put(
  "/:id",
  protect,
  authorizeRole("ADMIN", "SUPERADMIN"),
  productController.updateProduct
);

router.delete(
  "/:id",
  protect,
  authorizeRole("ADMIN", "SUPERADMIN"),
  productController.deleteProduct
);

export default router;
