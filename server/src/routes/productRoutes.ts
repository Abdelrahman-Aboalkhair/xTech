import express from "express";
import productController from "../controllers/productController";
import authorizeRole from "../middlewares/authorizeRole";
import protect from "../middlewares/protect";

const router = express.Router();

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
